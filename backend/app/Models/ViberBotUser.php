<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ViberBotUser extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'viber_bot_users';
            
    protected $fillable = [
                'user_id',
        'viber_id',
        'name',
        'phone_number',
        'avatar',
        'language',
        'state',
        'state_data',
        'last_message_at',
    ];

    protected $casts = [
        'state_data' => 'array',
        'last_message_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
