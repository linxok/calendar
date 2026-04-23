<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_providers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('provider_key', 50)->unique();
            $table->string('name', 100);
            $table->boolean('enabled')->default(true);
            $table->text('api_key_encrypted')->nullable();
            $table->json('config')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_providers');
    }
};
