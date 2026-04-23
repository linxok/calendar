<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class AiMessage extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = 'ai_messages';
            
    protected $fillable = [
                'conversation_id',
        'role',
        'content',
        'model_used',
        'tokens_used',
        'intent',
    ];

    protected $fillable = [
        'tokens_used' => 'integer',
    ];

    public function conversation()
    {
        return ->belongsTo(AiConversation::class, 'conversation_id');
    }
}
