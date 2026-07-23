<?php

namespace Database\Seeders;

use App\Models\Pista;
use App\Models\Tarifa;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        for ($i = 1; $i <= 5; $i++) {
            Pista::firstOrCreate(
                ['numero' => $i],
                ['nombre' => "Pista {$i}", 'activa' => true]
            );
        }

        Tarifa::firstOrCreate(
            ['vigente_desde' => '2026-01-01'],
            [
                'precio_hora' => 15.00,
                'tarifa_cancelacion_minima' => 5.00,
                'vigente_hasta' => null,
            ]
        );
    }
}
