<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'worker_id',
        'title',
        'description',
        'budget',
        'final_price',
        'status',
        'scheduled_at',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'budget' => 'decimal:2',
            'final_price' => 'decimal:2',
            'scheduled_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function worker()
    {
        return $this->belongsTo(Worker::class, 'worker_id');
    }

    public function applications()
    {
        return $this->hasMany(WorkerApplication::class, 'job_request_id');
    }
}
