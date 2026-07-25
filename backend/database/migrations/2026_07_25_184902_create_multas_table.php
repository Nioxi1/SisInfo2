<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('multas', function (Blueprint $table) {
            $table->id();

            $table->foreignId('socio_id')
                ->constrained('socios')
                ->cascadeOnDelete();

            $table->foreignId('reserva_id')
                ->unique()
                ->constrained('reservas')
                ->cascadeOnDelete();

            $table->unsignedSmallInteger('anio');
            $table->unsignedTinyInteger('numero_inasistencia');

            $table->boolean('exenta')->default(false);
            $table->decimal('monto', 10, 2)->default(0);

            $table->text('observaciones')->nullable();
            $table->timestamp('generada_at')->nullable();

            $table->timestamps();

            $table->index(['socio_id', 'anio']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('multas');
    }
};