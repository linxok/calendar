<?php

namespace App\Filament\Resources\MasterProfiles;

use App\Filament\Resources\MasterProfiles\Pages\CreateMasterProfile;
use App\Filament\Resources\MasterProfiles\Pages\EditMasterProfile;
use App\Filament\Resources\MasterProfiles\Pages\ListMasterProfiles;
use App\Filament\Resources\MasterProfiles\Schemas\MasterProfileForm;
use App\Filament\Resources\MasterProfiles\Tables\MasterProfilesTable;
use App\Models\MasterProfile;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class MasterProfileResource extends Resource
{
    protected static ?string $model = MasterProfile::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return MasterProfileForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return MasterProfilesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListMasterProfiles::route('/'),
            'create' => CreateMasterProfile::route('/create'),
            'edit' => EditMasterProfile::route('/{record}/edit'),
        ];
    }
}
