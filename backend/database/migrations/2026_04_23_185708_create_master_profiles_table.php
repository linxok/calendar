<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('master_profiles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->unique()->constrained('users')->onDelete('cascade');
            $table->string('specialization', 255)->nullable();
            $table->string('photo_url', 500)->nullable();
            $table->enum('active_status', ['active', 'inactive'])->default('active');
            $table->timestamps();

            $table->index('active_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('master_profiles');
    }
};
