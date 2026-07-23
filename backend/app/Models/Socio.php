<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Socio extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'codigo',
        'nombre',
        'apellidos',
        'email',
        'telefono',
        'dni',
        'fecha_alta',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'fecha_alta' => 'date',
            'activo' => 'boolean',
        ];
    }

    public function reservas(): HasMany
    {
        return $this->hasMany(Reserva::class);
    }

    public function facturas(): HasMany
    {
        return $this->hasMany(Factura::class);
    }

    public function getNombreCompletoAttribute(): string
    {
        return "{$this->nombre} {$this->apellidos}";
    }
}
