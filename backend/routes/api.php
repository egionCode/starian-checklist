<?php

use App\Http\Controllers\TarefaController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->name('v1.')->group(function () {
    Route::apiResource('tarefas', TarefaController::class);
});
