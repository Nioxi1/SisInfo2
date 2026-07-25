<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reservas', function (Blueprint $table) {
            $table->timestamp('ocupada_at')->nullable()->after('primera_no_ocupacion_anio');
        });

        DB::statement("ALTER TABLE reservas MODIFY estado ENUM('activa','ocupada','cancelada','completada','no_ocupada') NOT NULL DEFAULT 'activa'");
    }

    public function down(): void
    {
        Schema::table('reservas', function (Blueprint $table) {
            $table->dropColumn('ocupada_at');
        });

        DB::statement("ALTER TABLE reservas MODIFY estado ENUM('activa','cancelada','completada','no_ocupada') NOT NULL DEFAULT 'activa'");
    }
};