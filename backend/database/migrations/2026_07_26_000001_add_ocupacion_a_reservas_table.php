<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        /*
         * El intento anterior pudo haber creado ocupada_at antes
         * de fallar. Esta validación evita duplicar la columna.
         */
        if (! Schema::hasColumn('reservas', 'ocupada_at')) {
            Schema::table('reservas', function (Blueprint $table) {
                $table->timestamp('ocupada_at')
                    ->nullable()
                    ->after('primera_no_ocupacion_anio');
            });
        }

        /*
         * Laravel genera la modificación adecuada según
         * el motor de base de datos.
         */
        Schema::table('reservas', function (Blueprint $table) {
            $table->enum('estado', [
                'activa',
                'ocupada',
                'cancelada',
                'completada',
                'no_ocupada',
            ])
                ->default('activa')
                ->change();
        });
    }

    public function down(): void
    {
        /*
         * Evita errores al retirar el valor "ocupada"
         * si existen registros con ese estado.
         */
        DB::table('reservas')
            ->where('estado', 'ocupada')
            ->update(['estado' => 'completada']);

        Schema::table('reservas', function (Blueprint $table) {
            $table->enum('estado', [
                'activa',
                'cancelada',
                'completada',
                'no_ocupada',
            ])
                ->default('activa')
                ->change();
        });

        if (Schema::hasColumn('reservas', 'ocupada_at')) {
            Schema::table('reservas', function (Blueprint $table) {
                $table->dropColumn('ocupada_at');
            });
        }
    }
};