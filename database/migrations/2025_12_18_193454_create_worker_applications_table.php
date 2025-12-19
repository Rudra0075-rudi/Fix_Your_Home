<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('worker_applications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('job_request_id');
            $table->unsignedBigInteger('worker_id');
            $table->text('message')->nullable();
            $table->decimal('proposed_price', 10, 2)->nullable();
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
            $table->timestamps();

            $table->foreign('job_request_id')->references('id')->on('job_requests')->onDelete('cascade');
            $table->foreign('worker_id')->references('worker_id')->on('workers')->onDelete('cascade');
            $table->unique(['job_request_id', 'worker_id']); // Prevent duplicate applications
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('worker_applications');
    }
};
