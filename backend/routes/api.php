<?php

use App\Http\Controllers\Api\PistaController;
use App\Http\Controllers\Api\SocioController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json(['status' => 'ok']));

Route::apiResource('socios', SocioController::class);
Route::apiResource('pistas', PistaController::class);