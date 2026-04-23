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

    protected $fillable = [
        'start_at' => 'datetime',
        'end_at' => 'datetime',
        'status' => 'string',
        'source' => 'string',
    ];

    public function client()
    {
        return ->belongsTo(User::class, 'client_id');
    }

    public function master()
    {
        return ->belongsTo(MasterProfile::class, 'master_id');
    }

    public function service()
    {
        return ->belongsTo(Service::class);
    }

    public function communicationLogs()
    {
        return ->hasMany(CommunicationLog::class);
    }
}
