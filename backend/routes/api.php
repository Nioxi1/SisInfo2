<?php

use App\Http\Controllers\Api\PistaController;
use App\Http\Controllers\Api\SocioController;
use App\Http\Controllers\Api\ReservaController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json(['status' => 'ok']));

Route::apiResource('socios', SocioController::class);

Route::get('/reservas', [ReservaController::class, 'index']); // NUEVO — HU5
Route::post('/reservas/validar-limite', [ReservaController::class, 'validarLimite']);
Route::get('/reservas/disponibilidad', [ReservaController::class, 'disponibilidad']);
Route::get('/reservas/calendario', [ReservaController::class, 'calendario']);
Route::post('/reservas', [ReservaController::class, 'store']);
Route::patch('/reservas/{reserva}/ocupar', [ReservaController::class, 'ocupar']); // NUEVO — HU5
Route::apiResource('pistas', PistaController::class);