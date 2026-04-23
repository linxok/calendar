<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class CalendarSubscription extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = 'calendar_subscriptions';
            
    protected $fillable = [
                'user_id',
        'token',
        'provider',
        'name',
        'is_active',
        'last_accessed_at',
        'access_count',
    ];

    protected $fillable = [
        'is_active' => 'boolean',
        'access_count' => 'integer',
        'last_accessed_at' => 'datetime',
    ];

    public function user()
    {
        return ->belongsTo(User::class);
    }
}
