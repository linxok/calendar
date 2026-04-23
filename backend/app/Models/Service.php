<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Service extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'duration_min',
        'price',
        'active_status',
    ];

    protected $casts = [
        'duration_min' => 'integer',
        'price' => 'decimal:2',
        'active_status' => 'string',
    ];

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function aiRecommendations()
    {
        return $this->hasMany(AiRecommendation::class);
    }
}
