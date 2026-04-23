<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MasterProfile;
use App\Models\WorkingSchedule;
use App\Services\ScheduleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    private ScheduleService $scheduleService;

    public function __construct(ScheduleService $scheduleService)
    {
        $this->scheduleService = $scheduleService;
    }

    public function index(string $masterId): JsonResponse
    {
        $master = MasterProfile::findOrFail($masterId);
        $schedules = $this->scheduleService->getMasterSchedule($master);

        return response()->json($schedules);
    }

    public function store(Request $request, string $masterId): JsonResponse
    {
        $master = MasterProfile::findOrFail($masterId);
        $data = $request->validate([
            'day_of_week' => 'required|integer|between:0,6',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'breaks' => 'nullable|array',
        ]);

        try {
            $schedule = $this->scheduleService->createSchedule($master, $data);
            return response()->json(['id' => $schedule->id], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function update(Request $request, string $masterId, string $scheduleId): JsonResponse
    {
        $schedule = WorkingSchedule::where('master_id', $masterId)->findOrFail($scheduleId);
        $data = $request->validate([
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i',
            'breaks' => 'nullable|array',
        ]);

        try {
            $this->scheduleService->updateSchedule($schedule, $data);
            return response()->json(['message' => 'Schedule updated']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function destroy(string $masterId, string $scheduleId): JsonResponse
    {
        $schedule = WorkingSchedule::where('master_id', $masterId)->findOrFail($scheduleId);
        $this->scheduleService->deleteSchedule($schedule);

        return response()->json(null, 204);
    }
}
