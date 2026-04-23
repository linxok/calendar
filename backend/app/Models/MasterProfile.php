<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class MasterProfile extends Model
{
    use HasFactory, HasUuids;

            
    protected $fillable = [
                'user_id',
        'specialization',
        'photo_url',
        'active_status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function workingSchedules()
    {
        return $this->hasMany(WorkingSchedule::class, 'master_id');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'master_id');
    }

    public function aiRecommendations()
    {
        return $this->hasMany(AiRecommendation::class, 'master_id');
    }
}
