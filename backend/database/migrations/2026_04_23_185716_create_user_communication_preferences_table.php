<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_communication_preferences', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->unique()->constrained('users')->onDelete('cascade');
            
            // Telegram
            $table->boolean('telegram_enabled')->default(false);
            $table->string('telegram_chat_id', 255)->nullable();
            $table->string('telegram_username', 255)->nullable();
            $table->boolean('telegram_confirmations')->default(true);
            $table->boolean('telegram_reminders')->default(true);
            $table->boolean('telegram_marketing')->default(false);
            
            // Viber
            $table->boolean('viber_enabled')->default(false);
            $table->string('viber_id', 255)->nullable();
            $table->string('viber_phone', 20)->nullable();
            $table->boolean('viber_confirmations')->default(true);
            $table->boolean('viber_reminders')->default(true);
            $table->boolean('viber_marketing')->default(false);
            
            // Email
            $table->boolean('email_enabled')->default(true);
            $table->string('email_address', 255);
            $table->boolean('email_verified')->default(false);
            $table->boolean('email_confirmations')->default(true);
            $table->boolean('email_reminders')->default(true);
            $table->boolean('email_marketing')->default(true);
            $table->boolean('email_newsletter')->default(true);
            
            // SMS
            $table->boolean('sms_enabled')->default(false);
            $table->string('sms_phone', 20)->nullable();
            $table->boolean('sms_confirmations')->default(false);
            $table->boolean('sms_reminders')->default(true);
            $table->boolean('sms_otp')->default(true);
            
            // WhatsApp
            $table->boolean('whatsapp_enabled')->default(false);
            $table->string('whatsapp_phone', 20)->nullable();
            $table->boolean('whatsapp_opt_in')->default(false);
            $table->timestamp('whatsapp_opt_in_date')->nullable();
            
            // Web Push
            $table->boolean('webpush_enabled')->default(false);
            $table->json('webpush_subscription')->nullable();
            
            // Calendar
            $table->boolean('calendar_auto_add')->default(true);
            $table->string('calendar_provider', 20)->nullable();
            
            // General
            $table->string('primary_channel', 20)->default('email');
            $table->string('language', 5)->default('uk');
            $table->string('timezone', 50)->default('Europe/Kiev');
            $table->time('do_not_disturb_start')->nullable();
            $table->time('do_not_disturb_end')->nullable();
            
            $table->timestamps();

            $table->index('telegram_chat_id');
            $table->index('viber_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_communication_preferences');
    }
};
