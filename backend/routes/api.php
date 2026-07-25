<?php

use App\Http\Controllers\Api\PistaController;
use App\Http\Controllers\Api\SocioController;
use App\Http\Controllers\Api\ReservaController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\InasistenciaController;
use App\Http\Controllers\Api\FacturacionController;

Route::get('/health', fn () => response()->json(['status' => 'ok']));

Route::apiResource('socios', SocioController::class);

Route::get('/reservas', [ReservaController::class, 'index']); // NUEVO — HU5
Route::post('/reservas/validar-limite', [ReservaController::class, 'validarLimite']);
Route::get('/reservas/disponibilidad', [ReservaController::class, 'disponibilidad']);
Route::get('/reservas/calendario', [ReservaController::class, 'calendario']);
Route::post('/reservas', [ReservaController::class, 'store']);
Route::patch('/reservas/{reserva}/ocupar', [ReservaController::class, 'ocupar']); // NUEVO — HU5
Route::apiResource('pistas', PistaController::class);
Route::get('/inasistencias/pendientes', [InasistenciaController::class, 'pendientes']);
Route::get('/inasistencias/socio/{socioId}', [InasistenciaController::class, 'historial']);
Route::get('/inasistencias/reserva/{reserva}/evaluacion', [InasistenciaController::class, 'evaluacion']);
Route::post('/inasistencias/reserva/{reserva}', [InasistenciaController::class, 'registrar']);
Route::get('/facturacion/preview', [FacturacionController::class, 'preview']);
Route::post('/facturacion/generar', [FacturacionController::class, 'generar']);
Route::get('/facturas/{factura}', [FacturacionController::class, 'mostrar']);
Route::post('/facturas/{factura}/emitir', [FacturacionController::class, 'emitir']);