<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class TelegramBotUser extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'telegram_bot_users';
            
    protected $fillable = [
                'user_id',
        'chat_id',
        'username',
        'first_name',
        'last_name',
        'language_code',
        'is_bot',
        'state',
        'state_data',
        'last_message_at',
    ];

    protected $casts = [
        'chat_id' => 'integer',
        'is_bot' => 'boolean',
        'state_data' => 'array',
        'last_message_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
