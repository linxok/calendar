<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_behavior_analytics', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->unique()->constrained('users')->onDelete('cascade');
            $table->json('feature_vector')->nullable();
            $table->integer('cluster_id')->nullable();
            $table->string('booking_frequency', 20)->nullable();
            $table->json('preferred_masters')->nullable();
            $table->json('preferred_services')->nullable();
            $table->json('preferred_time_slots')->nullable();
            $table->integer('average_interval_days')->nullable();
            $table->date('last_booking_date')->nullable();
            $table->decimal('churn_risk_score', 5, 4)->nullable();
            $table->decimal('lifetime_value', 10, 2)->nullable();
            $table->timestamp('analyzed_at')->nullable();
            $table->timestamps();

            $table->index('cluster_id');
            $table->index('churn_risk_score');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_behavior_analytics');
    }
};
