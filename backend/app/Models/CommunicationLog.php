<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class CommunicationLog extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = 'communication_logs';
            
    protected $fillable = [
                'user_id',
        'appointment_id',
        'channel',
        'type',
        'recipient',
        'subject',
        'content',
        'status',
        'provider',
        'provider_id',
        'cost',
        'error_message',
        'sent_at',
        'delivered_at',
        'read_at',
    ];

    protected $fillable = [
        'cost' => 'decimal:6',
        'sent_at' => 'datetime',
        'delivered_at' => 'datetime',
        'read_at' => 'datetime',
    ];

    public function user()
    {
        return ->belongsTo(User::class);
    }

    public function appointment()
    {
        return ->belongsTo(Appointment::class);
    }
}
