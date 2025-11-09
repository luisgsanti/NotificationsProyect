<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    /**
     * GET /api/notifications
     * Lista las notificaciones del usuario autenticado.
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 20);
        $user = $request->user(); // ✅ usuario autenticado por Sanctum

        $notifications = Notification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json($notifications);
    }

    /**
     * POST /api/notifications
     * Crea una notificación manual (para pruebas o sistemas internos).
     * Ahora toma el usuario autenticado, no se envía user_id.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $notification = Notification::create([
            'user_id' => $request->user()->id, // ✅ usa el usuario autenticado
            'title' => $data['title'],
            'message' => $data['message'],
            'read' => false,
        ]);

        // 🔔 Emitimos evento de notificación en tiempo real
        event(new \App\Events\NotificationCreated($notification));

        return response()->json([
            'message' => 'Notification created',
            'data' => $notification
        ], 201);
    }

    /**
     * POST /api/notifications/mark-all-read
     * Marca todas las notificaciones del usuario autenticado como leídas.
     */
    public function markAllRead(Request $request)
    {
        $user = $request->user(); // ✅ usuario autenticado

        $updated = Notification::where('user_id', $user->id)
            ->where('read', false)
            ->update(['read' => true, 'updated_at' => now()]);

        return response()->json([
            'message' => 'Notifications marked as read',
            'updated' => $updated
        ]);
    }

    /**
     * PATCH /api/notifications/{id}/read
     * Marca una sola notificación como leída.
     */
    public function markOneRead($id, Request $request)
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', $request->user()->id) // ✅ seguridad: solo sus notificaciones
            ->firstOrFail();

        $notification->update(['read' => true]);

        return response()->json(['message' => 'Notification marked as read']);
    }
}
