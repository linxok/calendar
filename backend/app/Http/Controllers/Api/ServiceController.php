<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Services\ServiceManagementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    private ServiceManagementService $serviceManager;

    public function __construct(ServiceManagementService $serviceManager)
    {
        $this->serviceManager = $serviceManager;
    }

    public function index(): JsonResponse
    {
        $services = Service::where('active_status', 'active')
            ->get()
            ->map(fn ($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'duration_min' => $s->duration_min,
                'price' => $s->price,
            ]);

        return response()->json($services);
    }

    public function show(string $id): JsonResponse
    {
        $service = Service::findOrFail($id);

        return response()->json([
            'id' => $service->id,
            'name' => $service->name,
            'duration_min' => $service->duration_min,
            'price' => $service->price,
            'active_status' => $service->active_status,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'duration_min' => 'required|integer|min:5',
            'price' => 'nullable|numeric|min:0',
        ]);

        $service = $this->serviceManager->create($data);

        return response()->json([
            'id' => $service->id,
            'name' => $service->name,
            'duration_min' => $service->duration_min,
            'price' => $service->price,
            'active_status' => $service->active_status,
        ], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $service = Service::findOrFail($id);
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'duration_min' => 'sometimes|integer|min:5',
            'price' => 'nullable|numeric|min:0',
            'active_status' => 'sometimes|in:active,inactive',
        ]);

        $this->serviceManager->update($service, $data);

        return response()->json(['message' => 'Service updated successfully']);
    }

    public function destroy(string $id): JsonResponse
    {
        $service = Service::findOrFail($id);
        $this->serviceManager->deactivate($service);

        return response()->json(null, 204);
    }
}
