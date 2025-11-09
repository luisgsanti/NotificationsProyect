<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable; // 👈 ESTA LÍNEA FALTABA
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable; // 👈 Traits ordenados

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // Relación: un usuario tiene muchas tareas
    public function tasks()
    {
        return $this->hasMany(Task::class, 'user_id');
    }

    // Relación: un usuario tiene muchas notificaciones (tabla custom)
    public function notifications()
    {
        return $this->hasMany(Notification::class, 'user_id');
    }
}
