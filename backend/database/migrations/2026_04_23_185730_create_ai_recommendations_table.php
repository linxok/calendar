<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_recommendations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->string('recommendation_type', 50);
            $table->foreignUuid('service_id')->nullable()->constrained('services')->onDelete('set null');
            $table->foreignUuid('master_id')->nullable()->constrained('master_profiles')->onDelete('set null');
            $table->date('suggested_date')->nullable();
            $table->json('suggested_time_slots')->nullable();
            $table->decimal('confidence_score', 5, 4);
            $table->text('reasoning')->nullable();
            $table->enum('status', ['pending', 'accepted', 'dismissed'])->default('pending');
            $table->timestamp('accepted_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('status');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_recommendations');
    }
};
