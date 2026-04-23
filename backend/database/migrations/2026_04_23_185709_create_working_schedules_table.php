<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('working_schedules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('master_id')->constrained('master_profiles')->onDelete('cascade');
            $table->tinyInteger('day_of_week')->check('day_of_week >= 0 AND day_of_week <= 6');
            $table->time('start_time');
            $table->time('end_time');
            $table->json('breaks')->nullable();
            $table->timestamps();

            $table->index('master_id');
            $table->unique(['master_id', 'day_of_week']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('working_schedules');
    }
};
