<?php

namespace App\Http\Controllers;

use App\Models\Tarefa;
use App\Http\Requests\StoreTarefaRequest;
use App\Http\Requests\UpdateTarefaRequest;
use Illuminate\Http\JsonResponse;

class TarefaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(Tarefa::all());
    }

    /**
     * Display the specified resource.
     */
    public function show(Tarefa $tarefa): JsonResponse
    {
        return response()->json($tarefa);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTarefaRequest $request): JsonResponse
    {
        $tarefa = Tarefa::create([
            'title' => $request->validated('title'),
            'completed' => false,
        ]);

        return response()->json($tarefa, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTarefaRequest $request, Tarefa $tarefa): JsonResponse
    {
        $tarefa->update($request->validated());

        return response()->json($tarefa);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tarefa $tarefa): JsonResponse
    {
        $tarefa->delete();

        return response()->json(null, 204);
    }
}
