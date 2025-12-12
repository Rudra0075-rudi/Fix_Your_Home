<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    public $timestamps = false;
    protected $primaryKey = null;
    public $incrementing = false;

    protected $fillable = ['worker_id','service'];

    public function worker()
    {
        return $this->belongsTo(Worker::class, 'worker_id');
    }
}
