<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class AiModel extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = 'ai_models';
            
    protected $fillable = [
                'provider_id',
        'model_key',
        'name',
        'context_window',
        'cost_per_1k_input',
        'cost_per_1k_output',
        'enabled',
        'capabilities',
    ];

    protected $fillable = [
        'context_window' => 'integer',
        'cost_per_1k_input' => 'decimal:6',
        'cost_per_1k_output' => 'decimal:6',
        'enabled' => 'boolean',
        'capabilities' => 'array',
    ];

    public function provider()
    {
        return ->belongsTo(AiProvider::class, 'provider_id');
    }
}
