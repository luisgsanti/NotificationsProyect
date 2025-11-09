<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;
use App\Models\Notification as NotificationModel;

class NotificationCreated implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $notification;

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\Notification  $notification
     * @return void
     */
    public function __construct(NotificationModel $notification)
    {
        $this->notification = $notification;
    }

    /**
     * Canal público: notifications.user.{id}
     *
     * @return \Illuminate\Broadcasting\Channel
     */
    public function broadcastOn()
    {
        // Canal público para el usuario
        return new Channel('notifications.user.' . $this->notification->user_id);
    }

    /**
     * Fuerza la conexión a usar Reverb (importante en Laravel 12)
     */
    public function broadcastConnection()
    {
        return 'reverb';
    }

    /**
     * Datos que se enviarán al cliente.
     */
    public function broadcastWith()
    {
        return [
            'id' => $this->notification->id,
            'user_id' => $this->notification->user_id,
            'title' => $this->notification->title,
            'message' => $this->notification->message,
            'read' => (bool) $this->notification->read,
            'created_at' => optional($this->notification->created_at)->toDateTimeString(),
        ];
    }

    /**
     * Nombre del evento que llegará al cliente.
     */
    public function broadcastAs()
    {
        return 'NotificationCreated';
    }
}
