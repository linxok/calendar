<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('communication_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignUuid('appointment_id')->nullable()->constrained('appointments')->onDelete('set null');
            $table->string('channel', 20);
            $table->string('type', 50);
            $table->string('recipient', 255);
            $table->string('subject', 255)->nullable();
            $table->text('content')->nullable();
            $table->string('status', 20);
            $table->string('provider', 50)->nullable();
            $table->string('provider_id', 255)->nullable();
            $table->decimal('cost', 10, 6)->nullable();
            $table->text('error_message')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('appointment_id');
            $table->index('channel');
            $table->index('status');
            $table->index('sent_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('communication_logs');
    }
};
