<?php

namespace App\Filament\Resources\MasterProfiles\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class MasterProfileForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('user_id')
                    ->required(),
                TextInput::make('specialization'),
                TextInput::make('photo_url')
                    ->url(),
                TextInput::make('active_status')
                    ->required()
                    ->default('active'),
            ]);
    }
}
