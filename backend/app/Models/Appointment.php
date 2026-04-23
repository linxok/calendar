<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory, HasUuids;

            
    protected $fillable = [
                'client_id',
        'client_name',
        'client_phone',
        'master_id',
        'service_id',
        'start_at',
        'end_at',
        'status',
        'source',
        'notes',
    ];

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function master()
    {
        return $this->belongsTo(MasterProfile::class, 'master_id');
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function communicationLogs()
    {
        return $this->hasMany(CommunicationLog::class);
    }
}
