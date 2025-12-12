<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class AuthAccount extends Authenticatable
{
    use Notifiable;

    protected $table = 'auth';

    protected $fillable = [
        'email',
        'password',
        'type',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function user()
    {
        return $this->hasOne(User::class, 'user_id');
    }

    public function worker()
    {
        return $this->hasOne(Worker::class, 'worker_id');
    }
}
