<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class AiRecommendation extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'ai_recommendations';
            
    protected $fillable = [
                'user_id',
        'recommendation_type',
        'service_id',
        'master_id',
        'suggested_date',
        'suggested_time_slots',
        'confidence_score',
        'reasoning',
        'status',
        'accepted_at',
        'expires_at',
    ];

    protected $casts = [
        'suggested_date' => 'date',
        'suggested_time_slots' => 'array',
        'confidence_score' => 'decimal:4',
        'accepted_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function master()
    {
        return $this->belongsTo(MasterProfile::class, 'master_id');
    }
}
