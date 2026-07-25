<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Factura;
use App\Models\Reserva;
use App\Models\Socio;
use App\Models\Tarifa;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class FacturacionController extends Controller
{
    public function preview(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'socio_id' => ['required', 'integer', 'exists:socios,id'],
            'anio' => ['required', 'integer', 'min:2020', 'max:2100'],
            'mes' => ['required', 'integer', 'between:1,12'],
        ]);

        return response()->json($this->calcular(
            (int) $datos['socio_id'],
            (int) $datos['anio'],
            (int) $datos['mes']
        ));
    }

    public function generar(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'socio_id' => ['required', 'integer', 'exists:socios,id'],
            'anio' => ['required', 'integer', 'min:2020', 'max:2100'],
            'mes' => ['required', 'integer', 'between:1,12'],
        ]);

        $existente = Factura::where('socio_id', $datos['socio_id'])
            ->where('anio', $datos['anio'])
            ->where('mes', $datos['mes'])
            ->first();

        if ($existente) {
            return response()->json([
                'message' => 'Ya existe una factura para este socio y período.',
                'factura' => $existente->load('socio'),
            ], 409);
        }

        $calculo = $this->calcular(
            (int) $datos['socio_id'],
            (int) $datos['anio'],
            (int) $datos['mes']
        );

        $factura = Factura::create([
            'socio_id' => $datos['socio_id'],
            'anio' => $datos['anio'],
            'mes' => $datos['mes'],
            'horas_reservadas' => $calculo['horas_utilizadas'],
            'horas_canceladas' => $calculo['horas_canceladas'],
            'horas_no_ocupadas_cobradas' => $calculo['horas_no_ocupadas_cobradas'],
            'precio_hora_aplicado' => $calculo['precio_hora'],
            'tarifa_cancelacion_aplicada' => $calculo['tarifa_cancelacion'],
            'importe_reservas' => $calculo['importe_reservas'],
            'importe_cancelaciones' => $calculo['importe_cancelaciones'],
            'importe_no_ocupacion' => $calculo['importe_multas'],
            'importe_total' => $calculo['importe_total'],
            'estado' => 'pendiente',
            'fecha_emision' => null,
        ]);

        return response()->json([
            'message' => 'Factura mensual generada correctamente.',
            'factura' => $factura->load('socio'),
            'detalle' => $calculo,
        ], 201);
    }

    public function mostrar(Factura $factura): JsonResponse
    {
        return response()->json($factura->load('socio'));
    }

    public function emitir(Factura $factura): JsonResponse
    {
        if ($factura->estado !== 'pendiente') {
            throw ValidationException::withMessages([
                'factura' => 'La factura ya fue emitida o pagada.',
            ]);
        }

        $factura->update([
            'estado' => 'enviada',
            'fecha_emision' => now(),
        ]);

        return response()->json([
            'message' => 'Factura emitida correctamente.',
            'factura' => $factura->fresh('socio'),
        ]);
    }

    private function calcular(int $socioId, int $anio, int $mes): array
    {
        $socio = Socio::findOrFail($socioId);

        $inicio = Carbon::create($anio, $mes, 1)->startOfMonth();
        $fin = $inicio->copy()->endOfMonth();

        $tarifa = Tarifa::whereDate('vigente_desde', '<=', $fin->toDateString())
            ->where(function ($query) use ($inicio) {
                $query->whereNull('vigente_hasta')
                    ->orWhereDate('vigente_hasta', '>=', $inicio->toDateString());
            })
            ->orderByDesc('vigente_desde')
            ->first();

        if (! $tarifa) {
            throw ValidationException::withMessages([
                'tarifa' => 'No existe una tarifa vigente para este período.',
            ]);
        }

        $reservas = Reserva::with('multa')
            ->where('socio_id', $socioId)
            ->whereBetween('fecha', [
                $inicio->toDateString(),
                $fin->toDateString(),
            ])
            ->get();

        $horasUtilizadas = 0;
        $horasCanceladas = 0;
        $horasNoOcupadasCobradas = 0;

        foreach ($reservas as $reserva) {
            $horas = $this->horasReserva($reserva);

            if (in_array($reserva->estado, ['ocupada', 'completada'], true)) {
                $horasUtilizadas += $horas;
            }

            if ($reserva->estado === 'cancelada') {
                $horasCanceladas += $horas;
            }

            if (
                $reserva->estado === 'no_ocupada' &&
                $reserva->multa &&
                ! $reserva->multa->exenta
            ) {
                $horasNoOcupadasCobradas += $horas;
            }
        }

        $precioHora = (float) $tarifa->precio_hora;
        $tarifaCancelacion = (float) $tarifa->tarifa_cancelacion_minima;

        $importeReservas = round($horasUtilizadas * $precioHora, 2);
        $importeCancelaciones = round(
            $horasCanceladas * $tarifaCancelacion,
            2
        );

        $importeMultas = round(
            $reservas
                ->filter(fn ($reserva) => $reserva->multa)
                ->sum(fn ($reserva) => (float) $reserva->multa->monto),
            2
        );

        $importeTotal = round(
            $importeReservas +
            $importeCancelaciones +
            $importeMultas,
            2
        );

        return [
            'socio' => $socio,
            'anio' => $anio,
            'mes' => $mes,
            'horas_utilizadas' => $horasUtilizadas,
            'horas_canceladas' => $horasCanceladas,
            'horas_no_ocupadas_cobradas' => $horasNoOcupadasCobradas,
            'precio_hora' => $precioHora,
            'tarifa_cancelacion' => $tarifaCancelacion,
            'importe_reservas' => $importeReservas,
            'importe_cancelaciones' => $importeCancelaciones,
            'importe_multas' => $importeMultas,
            'importe_total' => $importeTotal,
        ];
    }

    private function horasReserva(Reserva $reserva): float
    {
        $inicio = Carbon::parse($reserva->hora_inicio);
        $fin = Carbon::parse($reserva->hora_fin);

        return round($inicio->diffInMinutes($fin) / 60, 2);
    }
}