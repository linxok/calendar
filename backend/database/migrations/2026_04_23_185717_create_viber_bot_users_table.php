<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('viber_bot_users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('viber_id', 255)->unique();
            $table->string('name', 255)->nullable();
            $table->string('phone_number', 20)->nullable();
            $table->text('avatar')->nullable();
            $table->string('language', 10)->nullable();
            $table->string('state', 50)->default('idle');
            $table->json('state_data')->nullable();
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('phone_number');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('viber_bot_users');
    }
};
