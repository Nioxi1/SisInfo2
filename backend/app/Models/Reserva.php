<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reserva extends Model
{
    protected $fillable = [
        'socio_id',
        'pista_id',
        'fecha',
        'hora_inicio',
        'hora_fin',
        'estado',
        'ocupada',
        'cancelada_at',
        'ocupada_at',
        'primera_no_ocupacion_anio',
    ];

    protected function casts(): array
    {
        return [
            'fecha' => 'date',
            'ocupada' => 'boolean',
            'cancelada_at' => 'datetime',
            'ocupada_at' => 'datetime',
            'primera_no_ocupacion_anio' => 'boolean',
        ];
    }

    public function socio(): BelongsTo
    {
        return $this->belongsTo(Socio::class);
    }

    public function pista(): BelongsTo
    {
        return $this->belongsTo(Pista::class);
    }
    public function multa()
{
    return $this->hasOne(Multa::class);
}
}