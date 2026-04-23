<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class AiConversation extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = 'ai_conversations';
            
    protected $fillable = [
                'user_id',
        'channel',
        'started_at',
        'ended_at',
        'status',
    ];

    protected $fillable = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    public function user()
    {
        return ->belongsTo(User::class);
    }

    public function messages()
    {
        return ->hasMany(AiMessage::class, 'conversation_id');
    }
}
