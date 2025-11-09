<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\Notification;

class TaskController extends Controller
{
    /**
     * POST /api/tasks
     * Crea una tarea para el usuario autenticado y genera la notificación correspondiente.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'status' => 'sometimes|in:pendiente,completada',
        ]);

        $user = $request->user(); // ✅ usuario autenticado

        // Crear la tarea
        $task = Task::create([
            'user_id' => $data['user_id'],
            //'user_id' => $user->id,  // ✅ usuario autenticado
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'status' => $data['status'] ?? 'pendiente',
        ]);

        // Crear la notificación asociada
        $notification = Notification::create([
            'user_id' => $data['user_id'],
            //'user_id' => $user->id,  // ✅ usuario autenticado
            'title' => 'Nueva tarea asignada',
            'message' => "Se te ha asignado la tarea '{$task->title}'",
            'read' => false,
        ]);

        // Emitir evento para Laravel Reverb (tiempo real)
        event(new \App\Events\NotificationCreated($notification));

        return response()->json([
            'message' => 'Tarea creada correctamente y notificación enviada',
            'task' => $task,
            'notification' => $notification,
        ], 201);
    }
}
