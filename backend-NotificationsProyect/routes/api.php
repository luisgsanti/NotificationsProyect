<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\TaskController;

// 🟢 RUTAS PÚBLICAS
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// 📋 Tareas
Route::post('/tasks', [TaskController::class, 'store']);

// 🛡️ RUTAS PROTEGIDAS con Sanctum
Route::middleware('auth:sanctum')->group(function () {

    // 🚪 Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // 🔔 Notificaciones
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications', [NotificationController::class, 'store']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markOneRead']);
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllRead']);


    // 👤 Endpoint de usuario autenticado
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
