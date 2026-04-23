<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_models', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('provider_id')->constrained('ai_providers')->onDelete('cascade');
            $table->string('model_key', 100);
            $table->string('name', 100);
            $table->integer('context_window')->nullable();
            $table->decimal('cost_per_1k_input', 10, 6)->nullable();
            $table->decimal('cost_per_1k_output', 10, 6)->nullable();
            $table->boolean('enabled')->default(true);
            $table->json('capabilities')->nullable();
            $table->timestamps();

            $table->index('provider_id');
            $table->unique(['provider_id', 'model_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_models');
    }
};
