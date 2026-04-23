<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class AiProvider extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = 'ai_providers';
            
    protected $fillable = [
                'provider_key',
        'name',
        'enabled',
        'api_key_encrypted',
        'config',
    ];

    protected $fillable = [
        'enabled' => 'boolean',
        'config' => 'array',
    ];

    public function models()
    {
        return ->hasMany(AiModel::class, 'provider_id');
    }
}
