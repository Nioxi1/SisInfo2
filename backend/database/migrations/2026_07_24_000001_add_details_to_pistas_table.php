<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pistas', function (Blueprint $table) {
            $table->string('superficie', 20)->default('Dura')->after('nombre');
            $table->boolean('iluminacion')->default(false)->after('superficie');
            $table->decimal('precio_hora', 8, 2)->default(0)->after('iluminacion');
            $table->enum('estado', ['disponible', 'reservada', 'mantenimiento'])
                ->default('disponible')->after('precio_hora');
            $table->softDeletes();
        });

        Schema::table('pistas', function (Blueprint $table) {
            $table->dropColumn('activa');
        });
    }

    public function down(): void
    {
        Schema::table('pistas', function (Blueprint $table) {
            $table->boolean('activa')->default(true);
            $table->dropColumn(['superficie', 'iluminacion', 'precio_hora', 'estado', 'deleted_at']);
        });
    }
};