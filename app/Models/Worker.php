<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Worker extends Model
{
    protected $primaryKey = 'worker_id';
    public $timestamps = false;

    protected $fillable = ['worker_id', 'name', 'photo', 'email', 'phone', 'description'];

    public function auth()
    {
        return $this->belongsTo(AuthAccount::class, 'worker_id');
    }

    public function services()
    {
        return $this->hasMany(Service::class, 'worker_id');
    }
}
