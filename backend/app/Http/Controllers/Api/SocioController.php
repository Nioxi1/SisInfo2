<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Socio;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SocioController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Socio::query();

        if ($busqueda = $request->query('busqueda')) {
            $query->where(function ($q) use ($busqueda) {
                $q->where('codigo', 'like', "%{$busqueda}%")
                    ->orWhere('nombre', 'like', "%{$busqueda}%")
                    ->orWhere('apellidos', 'like', "%{$busqueda}%");
            });
        }

        $socios = $query->orderBy('codigo')->get();

        return response()->json([
            'success' => true,
            'data' => $socios,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'codigo' => 'required|string|max:20|unique:socios,codigo',
            'nombre' => 'required|string|max:100',
            'apellidos' => 'required|string|max:150',
            'email' => 'required|email|max:150|unique:socios,email',
            'telefono' => 'nullable|string|max:20',
            'dni' => 'required|string|max:20|unique:socios,dni',
            'fecha_alta' => 'required|date',
        ], [
            'codigo.unique' => 'Ya existe un socio con ese código.',
            'email.unique' => 'Ya existe un socio con ese email.',
            'dni.unique' => 'Ya existe un socio con ese DNI.',
        ]);

        $socio = Socio::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Socio registrado exitosamente.',
            'data' => $socio,
        ], 201);
    }

    public function show(Socio $socio): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $socio,
        ]);
    }

    public function update(Request $request, Socio $socio): JsonResponse
    {
        $validated = $request->validate([
            'codigo' => ['required', 'string', 'max:20', Rule::unique('socios', 'codigo')->ignore($socio->id)],
            'nombre' => 'required|string|max:100',
            'apellidos' => 'required|string|max:150',
            'email' => ['required', 'email', 'max:150', Rule::unique('socios', 'email')->ignore($socio->id)],
            'telefono' => 'nullable|string|max:20',
            'dni' => ['required', 'string', 'max:20', Rule::unique('socios', 'dni')->ignore($socio->id)],
            'fecha_alta' => 'required|date',
            'activo' => 'sometimes|boolean',
        ], [
            'codigo.unique' => 'Ya existe un socio con ese código.',
            'email.unique' => 'Ya existe un socio con ese email.',
            'dni.unique' => 'Ya existe un socio con ese DNI.',
        ]);

        $socio->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Socio actualizado exitosamente.',
            'data' => $socio->fresh(),
        ]);
    }

    public function destroy(Socio $socio): JsonResponse
    {
        $socio->delete();

        return response()->json([
            'success' => true,
            'message' => 'Socio eliminado exitosamente.',
        ]);
    }
}
