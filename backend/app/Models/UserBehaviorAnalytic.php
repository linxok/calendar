<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class UserBehaviorAnalytic extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'user_behavior_analytics';
            
    protected $fillable = [
                'user_id',
        'feature_vector',
        'cluster_id',
        'booking_frequency',
        'preferred_masters',
        'preferred_services',
        'preferred_time_slots',
        'average_interval_days',
        'last_booking_date',
        'churn_risk_score',
        'lifetime_value',
        'analyzed_at',
    ];

    protected $casts = [
        'feature_vector' => 'array',
        'preferred_masters' => 'array',
        'preferred_services' => 'array',
        'preferred_time_slots' => 'array',
        'average_interval_days' => 'integer',
        'last_booking_date' => 'date',
        'churn_risk_score' => 'decimal:4',
        'lifetime_value' => 'decimal:2',
        'analyzed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
