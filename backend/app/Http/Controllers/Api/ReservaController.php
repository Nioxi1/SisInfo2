<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pista;
use App\Models\Reserva;
use App\Models\Socio;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ReservaController extends Controller
{
    /**
     * Comprueba si una fecha se encuentra dentro del periodo permitido.
     */
    public function validarLimite(Request $request): JsonResponse
    {
        $datos = $request->validate(
            [
                'fecha' => ['required', 'date_format:Y-m-d'],
            ],
            [
                'fecha.required' => 'Seleccione una fecha para la reserva.',
                'fecha.date_format' => 'La fecha debe tener el formato año-mes-día.',
            ]
        );

        $limite = $this->validarFechaPermitida($datos['fecha']);

        return response()->json([
            'valida' => true,
            'mensaje' => 'La fecha se encuentra dentro del periodo permitido.',
            ...$limite,
        ]);
    }

    /**
     * Devuelve todas las pistas activas e indica cuáles están disponibles.
     */
    public function disponibilidad(Request $request): JsonResponse
    {
        $datos = $request->validate(
            [
                'fecha' => ['required', 'date_format:Y-m-d'],
                'hora_inicio' => ['required', 'date_format:H:i'],
                'duracion_minutos' => ['required', 'integer', 'in:60,90,120'],
            ],
            [
                'fecha.required' => 'Seleccione una fecha.',
                'hora_inicio.required' => 'Seleccione una hora de inicio.',
                'duracion_minutos.in' => 'La duración debe ser de 60, 90 o 120 minutos.',
            ]
        );

        $this->validarFechaPermitida($datos['fecha']);

        [$inicio, $fin] = $this->construirIntervalo(
            $datos['fecha'],
            $datos['hora_inicio'],
            (int) $datos['duracion_minutos']
        );

        $pistas = Pista::query()
            ->where('activa', true)
            ->orderBy('numero')
            ->get()
            ->map(function (Pista $pista) use ($datos, $inicio, $fin) {
                $existeCruce = Reserva::query()
                    ->where('pista_id', $pista->id)
                    ->whereDate('fecha', $datos['fecha'])
                    ->where('estado', 'activa')
                    ->where('hora_inicio', '<', $fin->format('H:i:s'))
                    ->where('hora_fin', '>', $inicio->format('H:i:s'))
                    ->exists();

                return [
                    'id' => $pista->id,
                    'numero' => $pista->numero,
                    'nombre' => $pista->nombre,
                    'disponible' => !$existeCruce,
                ];
            });

        return response()->json([
            'fecha' => $datos['fecha'],
            'hora_inicio' => $inicio->format('H:i'),
            'hora_fin' => $fin->format('H:i'),
            'duracion_minutos' => (int) $datos['duracion_minutos'],
            'pistas' => $pistas,
        ]);
    }

    /**
     * Registra una nueva reserva.
     */
    public function store(Request $request): JsonResponse
    {
        $datos = $request->validate(
            [
                'socio_id' => ['required', 'integer', 'exists:socios,id'],
                'pista_id' => ['required', 'integer', 'exists:pistas,id'],
                'fecha' => ['required', 'date_format:Y-m-d'],
                'hora_inicio' => ['required', 'date_format:H:i'],
                'duracion_minutos' => ['required', 'integer', 'in:60,90,120'],
            ],
            [
                'socio_id.required' => 'Seleccione un socio.',
                'socio_id.exists' => 'El socio seleccionado no existe.',
                'pista_id.required' => 'Seleccione una pista.',
                'pista_id.exists' => 'La pista seleccionada no existe.',
                'fecha.required' => 'Seleccione una fecha.',
                'hora_inicio.required' => 'Seleccione una hora de inicio.',
                'duracion_minutos.in' => 'La duración debe ser de 60, 90 o 120 minutos.',
            ]
        );

        $limite = $this->validarFechaPermitida($datos['fecha']);

        [$inicio, $fin] = $this->construirIntervalo(
            $datos['fecha'],
            $datos['hora_inicio'],
            (int) $datos['duracion_minutos']
        );

        $socio = Socio::query()->findOrFail($datos['socio_id']);

        if (!$socio->activo) {
            throw ValidationException::withMessages([
                'socio_id' => 'El socio seleccionado se encuentra inactivo.',
            ]);
        }

        $pista = Pista::query()->findOrFail($datos['pista_id']);

        if (!$pista->activa) {
            throw ValidationException::withMessages([
                'pista_id' => 'La pista seleccionada se encuentra inactiva.',
            ]);
        }

        $reserva = DB::transaction(function () use ($datos, $inicio, $fin) {
            $existeCruce = Reserva::query()
                ->where('pista_id', $datos['pista_id'])
                ->whereDate('fecha', $datos['fecha'])
                ->where('estado', 'activa')
                ->where('hora_inicio', '<', $fin->format('H:i:s'))
                ->where('hora_fin', '>', $inicio->format('H:i:s'))
                ->exists();

            if ($existeCruce) {
                throw ValidationException::withMessages([
                    'pista_id' => 'La pista ya se encuentra reservada en el horario seleccionado.',
                ]);
            }

            $nuevaReserva = new Reserva();
            $nuevaReserva->socio_id = $datos['socio_id'];
            $nuevaReserva->pista_id = $datos['pista_id'];
            $nuevaReserva->fecha = $datos['fecha'];
            $nuevaReserva->hora_inicio = $inicio->format('H:i:s');
            $nuevaReserva->hora_fin = $fin->format('H:i:s');
            $nuevaReserva->estado = 'activa';
            $nuevaReserva->save();

            return $nuevaReserva;
        });

        return response()->json([
            'mensaje' => 'Reserva registrada exitosamente.',
            'limite' => $limite,
            'reserva' => [
                'id' => $reserva->id,
                'fecha' => $reserva->fecha,
                'hora_inicio' => substr($reserva->hora_inicio, 0, 5),
                'hora_fin' => substr($reserva->hora_fin, 0, 5),
                'socio' => [
                    'id' => $socio->id,
                    'codigo' => $socio->codigo,
                    'nombre' => $socio->nombre,
                    'apellidos' => $socio->apellidos,
                ],
                'pista' => [
                    'id' => $pista->id,
                    'numero' => $pista->numero,
                    'nombre' => $pista->nombre,
                ],
            ],
        ], 201);
    }

    /**
     * Devuelve las reservas activas de un mes para mostrarlas en el calendario.
     */
    public function calendario(Request $request): JsonResponse
    {
        $datos = $request->validate(
            [
                'mes' => ['required', 'date_format:Y-m'],
            ],
            [
                'mes.required' => 'Indique el mes que desea consultar.',
                'mes.date_format' => 'El mes debe tener el formato año-mes.',
            ]
        );

        $inicioMes = Carbon::createFromFormat(
            'Y-m-d',
            $datos['mes'] . '-01'
        )->startOfMonth();

        $finMes = $inicioMes->copy()->endOfMonth();

        $reservas = Reserva::query()
            ->join('socios', 'reservas.socio_id', '=', 'socios.id')
            ->join('pistas', 'reservas.pista_id', '=', 'pistas.id')
            ->whereBetween('reservas.fecha', [
                $inicioMes->toDateString(),
                $finMes->toDateString(),
            ])
            ->where('reservas.estado', 'activa')
            ->orderBy('reservas.fecha')
            ->orderBy('reservas.hora_inicio')
            ->get([
                'reservas.id',
                'reservas.fecha',
                'reservas.hora_inicio',
                'reservas.hora_fin',
                'socios.id as socio_id',
                'socios.nombre as socio_nombre',
                'socios.apellidos as socio_apellidos',
                'pistas.id as pista_id',
                'pistas.numero as pista_numero',
                'pistas.nombre as pista_nombre',
            ]);

        return response()->json($reservas);
    }

    /**
     * Restricción: no se permiten reservas pasadas ni con más de
     * un mes calendario de anticipación.
     */
    private function validarFechaPermitida(string $fecha): array
    {
        $hoy = Carbon::today();
        $fechaSolicitada = Carbon::createFromFormat('Y-m-d', $fecha)->startOfDay();
        $fechaMaxima = $hoy->copy()->addMonthNoOverflow();

        if ($fechaSolicitada->lt($hoy)) {
            throw ValidationException::withMessages([
                'fecha' => 'No se permiten reservas para fechas anteriores a la fecha actual.',
            ]);
        }

        if ($fechaSolicitada->gt($fechaMaxima)) {
            throw ValidationException::withMessages([
                'fecha' => 'No se permiten reservas con más de un mes de anticipación.',
            ]);
        }

        return [
            'fecha_actual' => $hoy->toDateString(),
            'fecha_solicitada' => $fechaSolicitada->toDateString(),
            'fecha_maxima_permitida' => $fechaMaxima->toDateString(),
            'dias_de_anticipacion' => $hoy->diffInDays($fechaSolicitada),
        ];
    }

    /**
     * Calcula el inicio y fin y evita que una reserva atraviese la medianoche.
     */
    private function construirIntervalo(
        string $fecha,
        string $horaInicio,
        int $duracionMinutos
    ): array {
        $inicio = Carbon::createFromFormat(
            'Y-m-d H:i',
            $fecha . ' ' . $horaInicio
        );

        $fin = $inicio->copy()->addMinutes($duracionMinutos);

        if (!$inicio->isSameDay($fin)) {
            throw ValidationException::withMessages([
                'hora_inicio' => 'La reserva debe comenzar y finalizar el mismo día.',
            ]);
        }

        return [$inicio, $fin];
    }
}