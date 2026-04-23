<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class AiProvider extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'ai_providers';
            
    protected $fillable = [
                'provider_key',
        'name',
        'enabled',
        'api_key_encrypted',
        'config',
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'config' => 'array',
    ];

    public function models()
    {
        return $this->hasMany(AiModel::class, 'provider_id');
    }
}
