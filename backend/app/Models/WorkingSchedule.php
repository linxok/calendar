<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class WorkingSchedule extends Model
{
    use HasFactory, HasUuids;

            
    protected $fillable = [
                'master_id',
        'day_of_week',
        'start_time',
        'end_time',
        'breaks',
    ];

    protected $fillable = [
        'day_of_week' => 'integer',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'breaks' => 'array',
    ];

    public function master()
    {
        return ->belongsTo(MasterProfile::class, 'master_id');
    }
}
