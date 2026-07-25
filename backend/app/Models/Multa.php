<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Multa extends Model
{
    protected $fillable = [
        'socio_id',
        'reserva_id',
        'anio',
        'numero_inasistencia',
        'exenta',
        'monto',
        'observaciones',
        'generada_at',
    ];

    protected $casts = [
        'anio' => 'integer',
        'numero_inasistencia' => 'integer',
        'exenta' => 'boolean',
        'monto' => 'decimal:2',
        'generada_at' => 'datetime',
    ];

    public function socio(): BelongsTo
    {
        return $this->belongsTo(Socio::class);
    }

    public function reserva(): BelongsTo
    {
        return $this->belongsTo(Reserva::class);
    }
}