<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class AiMessage extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'ai_messages';
            
    protected $fillable = [
                'conversation_id',
        'role',
        'content',
        'model_used',
        'tokens_used',
        'intent',
    ];

    protected $casts = [
        'tokens_used' => 'integer',
    ];

    public function conversation()
    {
        return $this->belongsTo(AiConversation::class, 'conversation_id');
    }
}
