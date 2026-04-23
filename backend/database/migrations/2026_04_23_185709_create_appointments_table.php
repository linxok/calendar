<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('client_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('client_name', 255);
            $table->string('client_phone', 50);
            $table->foreignUuid('master_id')->constrained('master_profiles')->onDelete('restrict');
            $table->foreignUuid('service_id')->constrained('services')->onDelete('restrict');
            $table->timestamp('start_at');
            $table->timestamp('end_at');
            $table->enum('status', ['pending', 'confirmed', 'completed', 'cancelled'])->default('pending');
            $table->enum('source', ['public', 'internal']);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('client_id');
            $table->index('master_id');
            $table->index('service_id');
            $table->index('start_at');
            $table->index('status');
            $table->index(['master_id', 'start_at', 'end_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
