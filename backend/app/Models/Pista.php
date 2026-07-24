<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pista extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'numero',
        'nombre',
        'superficie',
        'iluminacion',
        'precio_hora',
        'estado',
    ];

    protected $appends = ['codigo'];

    protected function casts(): array
    {
        return [
            'numero' => 'integer',
            'iluminacion' => 'boolean',
            'precio_hora' => 'decimal:2',
        ];
    }

    public function reservas(): HasMany
    {
        return $this->hasMany(Reserva::class);
    }

    public function getCodigoAttribute(): string
    {
        return 'CT-' . str_pad((string) $this->numero, 3, '0', STR_PAD_LEFT);
    }
}