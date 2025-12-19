<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkerApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_request_id',
        'worker_id',
        'message',
        'proposed_price',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'proposed_price' => 'decimal:2',
        ];
    }

    public function jobRequest()
    {
        return $this->belongsTo(JobRequest::class, 'job_request_id');
    }

    public function worker()
    {
        return $this->belongsTo(Worker::class, 'worker_id');
    }
}
