<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('socio_id')->constrained('socios')->cascadeOnDelete();
            $table->foreignId('pista_id')->constrained('pistas')->cascadeOnDelete();
            $table->date('fecha');
            $table->time('hora_inicio');
            $table->time('hora_fin');
            $table->enum('estado', ['activa', 'cancelada', 'completada', 'no_ocupada'])->default('activa');
            $table->boolean('ocupada')->nullable();
            $table->timestamp('cancelada_at')->nullable();
            $table->boolean('primera_no_ocupacion_anio')->default(false);
            $table->timestamps();

            $table->unique(['pista_id', 'fecha', 'hora_inicio']);
            $table->index(['socio_id', 'fecha']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservas');
    }
};
