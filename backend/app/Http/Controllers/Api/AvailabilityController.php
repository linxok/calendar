<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AvailabilityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AvailabilityController extends Controller
{
    private AvailabilityService $availabilityService;

    public function __construct(AvailabilityService $availabilityService)
    {
        $this->availabilityService = $availabilityService;
    }

    public function getSlots(Request $request): JsonResponse
    {
        $data = $request->validate([
            'master_id' => 'required|exists:master_profiles,id',
            'service_id' => 'required|exists:services,id',
            'date' => 'required|date_format:Y-m-d',
        ]);

        $slots = $this->availabilityService->getAvailableSlots(
            $data['master_id'],
            $data['service_id'],
            $data['date']
        );

        return response()->json($slots);
    }
}
