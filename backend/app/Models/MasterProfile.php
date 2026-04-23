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

    protected $fillable = [
        'active_status' => 'string',
    ];

    public function user()
    {
        return ->belongsTo(User::class);
    }

    public function workingSchedules()
    {
        return ->hasMany(WorkingSchedule::class, 'master_id');
    }

    public function appointments()
    {
        return ->hasMany(Appointment::class, 'master_id');
    }

    public function aiRecommendations()
    {
        return ->hasMany(AiRecommendation::class, 'master_id');
    }
}
