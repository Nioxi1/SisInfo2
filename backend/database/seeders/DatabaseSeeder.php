<?php

namespace Database\Seeders;

use App\Models\Pista;
use App\Models\Tarifa;
use App\Models\Socio;
use App\Models\Reserva;
use App\Models\Factura;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
        ]);

        // Seed Pistas
        for ($i = 1; $i <= 5; $i++) {
            Pista::firstOrCreate(
                ['numero' => $i],
                ['nombre' => "Pista {$i}", 'activa' => true]
            );
        }

        // Seed Tarifa
        Tarifa::firstOrCreate(
            ['vigente_desde' => '2026-01-01'],
            [
                'precio_hora' => 15.00,
                'tarifa_cancelacion_minima' => 5.00,
                'vigente_hasta' => null,
            ]
        );

        // Seed Socios
        $socio1 = Socio::firstOrCreate(
            ['codigo' => 'SOC-001'],
            [
                'nombre' => 'Alejandro',
                'apellidos' => 'Mendoza',
                'email' => 'a.mendoza@email.com',
                'telefono' => '+54 11 4567 8910',
                'dni' => '12345678A',
                'fecha_alta' => '2025-01-15',
                'activo' => true,
            ]
        );

        $socio2 = Socio::firstOrCreate(
            ['codigo' => 'SOC-002'],
            [
                'nombre' => 'Beatriz',
                'apellidos' => 'Peña',
                'email' => 'b.pena@email.com',
                'telefono' => '+54 11 5678 1234',
                'dni' => '23456789B',
                'fecha_alta' => '2025-02-10',
                'activo' => false,
            ]
        );

        $socio3 = Socio::firstOrCreate(
            ['codigo' => 'SOC-003'],
            [
                'nombre' => 'Carlos',
                'apellidos' => 'Rodríguez',
                'email' => 'c.rod@email.com',
                'telefono' => '+54 11 9876 5432',
                'dni' => '34567890C',
                'fecha_alta' => '2025-03-05',
                'activo' => true,
            ]
        );

        $socio4 = Socio::firstOrCreate(
            ['codigo' => 'SOC-004'],
            [
                'nombre' => 'Diana',
                'apellidos' => 'Villalba',
                'email' => 'dvillalba@email.com',
                'telefono' => '+54 11 2233 4455',
                'dni' => '45678901D',
                'fecha_alta' => '2025-04-12',
                'activo' => true,
            ]
        );

        // Seed Reservas
        Reserva::create([
            'socio_id' => $socio1->id,
            'pista_id' => 1,
            'fecha' => '2026-07-23',
            'hora_inicio' => '16:00:00',
            'hora_fin' => '17:00:00',
            'estado' => 'activa',
            'ocupada' => true,
        ]);

        Reserva::create([
            'socio_id' => $socio3->id,
            'pista_id' => 3,
            'fecha' => '2026-07-23',
            'hora_inicio' => '16:00:00',
            'hora_fin' => '17:30:00',
            'estado' => 'activa',
            'ocupada' => true,
        ]);

        // Seed Facturas
        Factura::create([
            'socio_id' => $socio1->id,
            'anio' => 2026,
            'mes' => 7,
            'horas_reservadas' => 4,
            'horas_canceladas' => 0,
            'horas_no_ocupadas_cobradas' => 0,
            'precio_hora_aplicado' => 15.00,
            'tarifa_cancelacion_aplicada' => 5.00,
            'importe_reservas' => 60.00,
            'importe_cancelaciones' => 0,
            'importe_no_ocupacion' => 0,
            'importe_total' => 60.00,
            'estado' => 'pagada',
            'fecha_emision' => now(),
        ]);
    }
}
