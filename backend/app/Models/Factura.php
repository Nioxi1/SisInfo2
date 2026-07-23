<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Factura extends Model
{
    protected $fillable = [
        'socio_id',
        'anio',
        'mes',
        'horas_reservadas',
        'horas_canceladas',
        'horas_no_ocupadas_cobradas',
        'precio_hora_aplicado',
        'tarifa_cancelacion_aplicada',
        'importe_reservas',
        'importe_cancelaciones',
        'importe_no_ocupacion',
        'importe_total',
        'estado',
        'fecha_emision',
    ];

    protected function casts(): array
    {
        return [
            'precio_hora_aplicado' => 'decimal:2',
            'tarifa_cancelacion_aplicada' => 'decimal:2',
            'importe_reservas' => 'decimal:2',
            'importe_cancelaciones' => 'decimal:2',
            'importe_no_ocupacion' => 'decimal:2',
            'importe_total' => 'decimal:2',
            'fecha_emision' => 'datetime',
        ];
    }

    public function socio(): BelongsTo
    {
        return $this->belongsTo(Socio::class);
    }
}
