<?php

namespace App\Filament\Resources\MasterProfiles\Pages;

use App\Filament\Resources\MasterProfiles\MasterProfileResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListMasterProfiles extends ListRecords
{
    protected static string $resource = MasterProfileResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
