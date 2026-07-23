<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facturas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('socio_id')->constrained('socios')->cascadeOnDelete();
            $table->unsignedSmallInteger('anio');
            $table->unsignedTinyInteger('mes');
            $table->unsignedInteger('horas_reservadas')->default(0);
            $table->unsignedInteger('horas_canceladas')->default(0);
            $table->unsignedInteger('horas_no_ocupadas_cobradas')->default(0);
            $table->decimal('precio_hora_aplicado', 8, 2);
            $table->decimal('tarifa_cancelacion_aplicada', 8, 2);
            $table->decimal('importe_reservas', 10, 2)->default(0);
            $table->decimal('importe_cancelaciones', 10, 2)->default(0);
            $table->decimal('importe_no_ocupacion', 10, 2)->default(0);
            $table->decimal('importe_total', 10, 2)->default(0);
            $table->enum('estado', ['pendiente', 'enviada', 'pagada'])->default('pendiente');
            $table->timestamp('fecha_emision')->nullable();
            $table->timestamps();

            $table->unique(['socio_id', 'anio', 'mes']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facturas');
    }
};
