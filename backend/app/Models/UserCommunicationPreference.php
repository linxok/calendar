<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class UserCommunicationPreference extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'user_communication_preferences';
            
    protected $fillable = [
                'user_id',
        'telegram_enabled',
        'telegram_chat_id',
        'telegram_username',
        'telegram_confirmations',
        'telegram_reminders',
        'telegram_marketing',
        'viber_enabled',
        'viber_id',
        'viber_phone',
        'viber_confirmations',
        'viber_reminders',
        'viber_marketing',
        'email_enabled',
        'email_address',
        'email_verified',
        'email_confirmations',
        'email_reminders',
        'email_marketing',
        'email_newsletter',
        'sms_enabled',
        'sms_phone',
        'sms_confirmations',
        'sms_reminders',
        'sms_otp',
        'whatsapp_enabled',
        'whatsapp_phone',
        'whatsapp_opt_in',
        'whatsapp_opt_in_date',
        'webpush_enabled',
        'webpush_subscription',
        'calendar_auto_add',
        'calendar_provider',
        'primary_channel',
        'language',
        'timezone',
        'do_not_disturb_start',
        'do_not_disturb_end',
    ];

    protected $casts = [
        'telegram_enabled' => 'boolean',
        'telegram_confirmations' => 'boolean',
        'telegram_reminders' => 'boolean',
        'telegram_marketing' => 'boolean',
        'viber_enabled' => 'boolean',
        'viber_confirmations' => 'boolean',
        'viber_reminders' => 'boolean',
        'viber_marketing' => 'boolean',
        'email_enabled' => 'boolean',
        'email_verified' => 'boolean',
        'email_confirmations' => 'boolean',
        'email_reminders' => 'boolean',
        'email_marketing' => 'boolean',
        'email_newsletter' => 'boolean',
        'sms_enabled' => 'boolean',
        'sms_confirmations' => 'boolean',
        'sms_reminders' => 'boolean',
        'sms_otp' => 'boolean',
        'whatsapp_enabled' => 'boolean',
        'whatsapp_opt_in' => 'boolean',
        'whatsapp_opt_in_date' => 'datetime',
        'webpush_enabled' => 'boolean',
        'webpush_subscription' => 'array',
        'calendar_auto_add' => 'boolean',
        'do_not_disturb_start' => 'datetime:H:i',
        'do_not_disturb_end' => 'datetime:H:i',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
