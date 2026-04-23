<?php

namespace App\Services;

use App\Models\Service;

class ServiceManagementService
{
    public function create(array $data): Service
    {
        return Service::create([
            'name' => $data['name'],
            'duration_min' => $data['duration_min'],
            'price' => $data['price'] ?? null,
            'active_status' => $data['active_status'] ?? 'active',
        ]);
    }

    public function update(Service $service, array $data): Service
    {
        $service->update($data);
        return $service->fresh();
    }

    public function deactivate(Service $service): void
    {
        $service->update(['active_status' => 'inactive']);
    }

    public function getActiveServices()
    {
        return Service::where('active_status', 'active')->get();
    }
}
