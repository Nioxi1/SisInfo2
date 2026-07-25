<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Multa;
use App\Models\Reserva;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Throwable;

class InasistenciaController extends Controller
{
    public function pendientes(): JsonResponse
    {
        $reservas = Reserva::with(['socio', 'pista'])
            ->where('estado', 'activa')
            ->orderBy('fecha')
            ->orderBy('hora_inicio')
            ->get()
            ->filter(function (Reserva $reserva) {
                return $this->fechaHoraFin($reserva)->isPast();
            })
            ->values();

        return response()->json($reservas);
    }

    public function evaluacion(Reserva $reserva): JsonResponse
    {
        $this->validarReserva($reserva);

        $anio = $this->fechaReserva($reserva)->year;

        $cantidadAnterior = Multa::where('socio_id', $reserva->socio_id)
            ->where('anio', $anio)
            ->count();

        $numero = $cantidadAnterior + 1;
        $exenta = $numero === 1;
        $monto = $exenta ? 0 : (float) config('club.multa_inasistencia', 25);

        $historial = Multa::with(['reserva.pista'])
            ->where('socio_id', $reserva->socio_id)
            ->where('anio', $anio)
            ->orderByDesc('generada_at')
            ->get();

        return response()->json([
            'reserva' => $reserva->load(['socio', 'pista']),
            'historial' => $historial,
            'numero_inasistencia' => $numero,
            'exenta' => $exenta,
            'monto' => $monto,
        ]);
    }

    public function registrar(Request $request, Reserva $reserva): JsonResponse
    {
        $datos = $request->validate([
            'observaciones' => ['nullable', 'string', 'max:1000'],
        ]);

        try {
            $resultado = DB::transaction(function () use ($reserva, $datos) {
                $reserva = Reserva::query()
                    ->lockForUpdate()
                    ->findOrFail($reserva->id);

                $this->validarReserva($reserva);

                if (Multa::where('reserva_id', $reserva->id)->exists()) {
                    throw ValidationException::withMessages([
                        'reserva' => 'Esta inasistencia ya fue registrada.',
                    ]);
                }

                $anio = $this->fechaReserva($reserva)->year;

                $cantidadAnterior = Multa::where('socio_id', $reserva->socio_id)
                    ->where('anio', $anio)
                    ->count();

                $numero = $cantidadAnterior + 1;
                $exenta = $numero === 1;
                $monto = $exenta
                    ? 0
                    : (float) config('club.multa_inasistencia', 25);

                $multa = Multa::create([
                    'socio_id' => $reserva->socio_id,
                    'reserva_id' => $reserva->id,
                    'anio' => $anio,
                    'numero_inasistencia' => $numero,
                    'exenta' => $exenta,
                    'monto' => $monto,
                    'observaciones' => $datos['observaciones'] ?? null,
                    'generada_at' => now(),
                ]);

                $reserva->estado = 'no_ocupada';
                $reserva->primera_no_ocupacion_anio = $exenta;

                if (array_key_exists('ocupada', $reserva->getAttributes())) {
                    $reserva->ocupada = false;
                }

                $reserva->save();

                return [
                    'multa' => $multa->load(['socio', 'reserva.pista']),
                    'reserva' => $reserva->fresh(['socio', 'pista']),
                ];
            });

            return response()->json([
                'message' => $resultado['multa']->exenta
                    ? 'Inasistencia registrada. Es la primera del año y está exenta de multa.'
                    : '¡Multa generada exitosamente!',
                ...$resultado,
            ], 201);
        } catch (ValidationException $exception) {
            throw $exception;
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'message' => 'No fue posible registrar la inasistencia.',
            ], 500);
        }
    }

    public function historial(int $socioId): JsonResponse
    {
        $multas = Multa::with(['reserva.pista'])
            ->where('socio_id', $socioId)
            ->orderByDesc('generada_at')
            ->get();

        return response()->json($multas);
    }

    private function validarReserva(Reserva $reserva): void
    {
        if ($reserva->estado !== 'activa') {
            throw ValidationException::withMessages([
                'reserva' => 'Solo se pueden registrar inasistencias de reservas activas.',
            ]);
        }

        if (! $this->fechaHoraFin($reserva)->isPast()) {
            throw ValidationException::withMessages([
                'reserva' => 'La reserva todavía no ha finalizado.',
            ]);
        }

        if (! empty($reserva->ocupada_at)) {
            throw ValidationException::withMessages([
                'reserva' => 'La reserva ya fue registrada como ocupada.',
            ]);
        }
    }

    private function fechaReserva(Reserva $reserva): Carbon
    {
        $fecha = $reserva->fecha instanceof Carbon
            ? $reserva->fecha->format('Y-m-d')
            : substr((string) $reserva->fecha, 0, 10);

        return Carbon::parse($fecha);
    }

    private function fechaHoraFin(Reserva $reserva): Carbon
    {
        $fecha = $this->fechaReserva($reserva)->format('Y-m-d');

        return Carbon::parse($fecha . ' ' . $reserva->hora_fin);
    }
}