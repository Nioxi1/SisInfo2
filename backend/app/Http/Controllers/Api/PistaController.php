<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pista;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PistaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Pista::query();

        if ($busqueda = $request->query('busqueda')) {
            $query->where(function ($q) use ($busqueda) {
                $q->where('numero', 'like', "%{$busqueda}%")
                    ->orWhere('nombre', 'like', "%{$busqueda}%");
            });
        }

        $pistas = $query->orderBy('numero')->get();

        return response()->json([
            'success' => true,
            'data' => $pistas,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'numero' => 'required|integer|min:1|unique:pistas,numero',
            'nombre' => 'required|string|max:50',
            'superficie' => 'required|string|in:Arcilla,Dura',
            'iluminacion' => 'sometimes|boolean',
            'precio_hora' => 'required|numeric|min:0',
            'estado' => 'required|string|in:disponible,reservada,mantenimiento',
        ], [
            'numero.required' => 'El número de pista es obligatorio.',
            'numero.unique' => 'Ya existe una pista con ese número.',
            'nombre.required' => 'El nombre de la pista es obligatorio.',
            'superficie.required' => 'La superficie es obligatoria.',
            'precio_hora.required' => 'El precio por hora es obligatorio.',
            'estado.required' => 'El estado de disponibilidad es obligatorio.',
        ]);

        $pista = Pista::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Pista registrada exitosamente.',
            'data' => $pista,
        ], 201);
    }

    public function show(Pista $pista): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $pista,
        ]);
    }

    public function update(Request $request, Pista $pista): JsonResponse
    {
        $validated = $request->validate([
            'numero' => ['required', 'integer', 'min:1', Rule::unique('pistas', 'numero')->ignore($pista->id)],
            'nombre' => 'required|string|max:50',
            'superficie' => 'required|string|in:Arcilla,Dura',
            'iluminacion' => 'sometimes|boolean',
            'precio_hora' => 'required|numeric|min:0',
            'estado' => 'required|string|in:disponible,reservada,mantenimiento',
        ], [
            'numero.unique' => 'Ya existe una pista con ese número.',
        ]);

        $pista->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Pista actualizada exitosamente.',
            'data' => $pista->fresh(),
        ]);
    }

    public function destroy(Pista $pista): JsonResponse
    {
        $pista->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pista eliminada exitosamente.',
        ]);
    }
}