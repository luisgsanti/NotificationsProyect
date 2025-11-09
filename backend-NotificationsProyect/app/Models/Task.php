<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'status',
    ];

    // Relación: la tarea pertenece a un usuario (assigned user)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}