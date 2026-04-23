<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MasterProfile;
use App\Services\MasterService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MasterController extends Controller
{
    private MasterService $masterService;

    public function __construct(MasterService $masterService)
    {
        $this->masterService = $masterService;
    }

    public function index(Request $request): JsonResponse
    {
        $masters = MasterProfile::with('user')
            ->where('active_status', 'active')
            ->get()
            ->map(fn ($m) => [
                'id' => $m->id,
                'name' => $m->user->name,
                'specialization' => $m->specialization,
                'photo_url' => $m->photo_url,
            ]);

        return response()->json($masters);
    }

    public function show(string $id): JsonResponse
    {
        $master = MasterProfile::with(['user', 'workingSchedules'])->findOrFail($id);

        return response()->json([
            'id' => $master->id,
            'name' => $master->user->name,
            'email' => $master->user->email,
            'phone' => $master->user->phone,
            'specialization' => $master->specialization,
            'photo_url' => $master->photo_url,
            'schedule' => $master->workingSchedules,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'phone' => 'nullable|string|max:50',
            'specialization' => 'nullable|string|max:255',
            'password' => 'required|string|min:8',
        ]);

        $master = $this->masterService->create($data);

        return response()->json([
            'id' => $master->id,
            'message' => 'Master created successfully',
        ], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $master = MasterProfile::findOrFail($id);
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $master->user_id,
            'phone' => 'nullable|string|max:50',
            'specialization' => 'nullable|string|max:255',
            'active_status' => 'sometimes|in:active,inactive',
        ]);

        $this->masterService->update($master, $data);

        return response()->json(['message' => 'Master updated successfully']);
    }

    public function destroy(string $id): JsonResponse
    {
        $master = MasterProfile::findOrFail($id);
        $this->masterService->deactivate($master);

        return response()->json(null, 204);
    }
}
