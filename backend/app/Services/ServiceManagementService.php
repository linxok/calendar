<?php

namespace App\Services;

use App\Models\Service;

class ServiceManagementService
{
    public function create(array ): Service
    {
        return Service::create([
            'name' => ['name'],
            'duration_min' => ['duration_min'],
            'price' => ['price'] ?? null,
            'active_status' => ['active_status'] ?? 'active',
        ]);
    }

    public function update(Service , array ): Service
    {
        ->update();
        return ->fresh();
    }

    public function deactivate(Service ): void
    {
        ->update(['active_status' => 'inactive']);
    }

    public function getActiveServices()
    {
        return Service::where('active_status', 'active')->get();
    }
}
