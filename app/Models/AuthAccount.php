<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class AuthAccount extends Authenticatable
{
    use HasApiTokens, Notifiable;

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

    public function customer()
    {
        return $this->hasOne(Customer::class, 'customer_id', 'id');
    }

    public function worker()
    {
        return $this->hasOne(Worker::class, 'worker_id', 'id');
    }
}
