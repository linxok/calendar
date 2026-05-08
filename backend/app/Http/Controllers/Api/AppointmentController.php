<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    private BookingService $bookingService;

    public function __construct(BookingService $bookingService)
    {
        $this->bookingService = $bookingService;
    }

    public function index(Request $request): JsonResponse
    {
        $query = Appointment::with(['master.user', 'service', 'client']);

        if ($request->has('master_id')) {
            $query->where('master_id', $request->master_id);
        }

        if ($request->has('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        if ($request->has('date')) {
            $query->whereDate('start_at', $request->date);
        }

        $appointments = $query->orderBy('start_at', 'desc')->get()->map(fn ($a) => [
            'id' => $a->id,
            'client_name' => $a->client_name,
            'client_phone' => $a->client_phone,
            'master_name' => $a->master->user->name,
            'service_name' => $a->service->name,
            'start_at' => $a->start_at,
            'end_at' => $a->end_at,
            'status' => $a->status,
            'source' => $a->source,
            'notes' => $a->notes,
        ]);

        return response()->json($appointments);
    }

    public function myAppointments(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $appointments = Appointment::with(['master.user', 'service'])
            ->where('client_id', $user->id)
            ->orWhere(function ($query) use ($user) {
                $query->whereNull('client_id')
                      ->where('client_phone', $user->phone);
            })
            ->orderBy('start_at', 'desc')
            ->get()
            ->map(fn ($a) => [
                'id' => $a->id,
                'client_name' => $a->client_name,
                'client_phone' => $a->client_phone,
                'master_name' => $a->master->user->name,
                'service_name' => $a->service->name,
                'start_at' => $a->start_at,
                'end_at' => $a->end_at,
                'status' => $a->status,
                'source' => $a->source,
                'notes' => $a->notes,
            ]);

        return response()->json($appointments);
    }

    public function masterAppointments(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $masterProfile = $user->masterProfile;

        if (!$masterProfile) {
            return response()->json(['message' => 'User is not a master'], 403);
        }

        $query = Appointment::with(['service', 'client'])
            ->where('master_id', $masterProfile->id);

        if ($request->has('date')) {
            $query->whereDate('start_at', $request->date);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('from') && $request->has('to')) {
            $query->whereBetween('start_at', [$request->from, $request->to]);
        }

        $appointments = $query->orderBy('start_at', 'asc')->get()->map(fn ($a) => [
            'id' => $a->id,
            'client_name' => $a->client_name,
            'client_phone' => $a->client_phone,
            'service_name' => $a->service->name,
            'service_duration' => $a->service->duration_min,
            'start_at' => $a->start_at,
            'end_at' => $a->end_at,
            'status' => $a->status,
            'source' => $a->source,
            'notes' => $a->notes,
            'client_id' => $a->client_id,
        ]);

        return response()->json($appointments);
    }

    public function show(string $id): JsonResponse
    {
        $appointment = Appointment::with(['master.user', 'service', 'client'])->findOrFail($id);

        return response()->json([
            'id' => $appointment->id,
            'client_name' => $appointment->client_name,
            'client_phone' => $appointment->client_phone,
            'master' => [
                'id' => $appointment->master_id,
                'name' => $appointment->master->user->name,
            ],
            'service' => [
                'id' => $appointment->service_id,
                'name' => $appointment->service->name,
                'duration_min' => $appointment->service->duration_min,
            ],
            'start_at' => $appointment->start_at,
            'end_at' => $appointment->end_at,
            'status' => $appointment->status,
            'source' => $appointment->source,
            'notes' => $appointment->notes,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'master_id' => 'required|exists:master_profiles,id',
            'service_id' => 'required|exists:services,id',
            'client_name' => 'required|string|max:255',
            'client_phone' => 'required|string|max:50',
            'start_at' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $clientId = $request->user()?->id;
        $source = $clientId ? 'internal' : 'public';

        try {
            $appointment = $this->bookingService->createAppointment($data, $clientId, $source);

            return response()->json([
                'id' => $appointment->id,
                'message' => 'Appointment created successfully',
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $appointment = Appointment::findOrFail($id);
        $data = $request->validate([
            'start_at' => 'sometimes|date',
            'status' => 'sometimes|in:pending,confirmed,completed,cancelled',
            'notes' => 'nullable|string',
        ]);

        if (isset($data['start_at'])) {
            try {
                $this->bookingService->rescheduleAppointment($appointment, $data['start_at']);
            } catch (\Exception $e) {
                return response()->json(['message' => $e->getMessage()], 422);
            }
        }

        if (isset($data['status'])) {
            $appointment->update(['status' => $data['status']]);
        }

        if (isset($data['notes'])) {
            $appointment->update(['notes' => $data['notes']]);
        }

        return response()->json(['message' => 'Appointment updated successfully']);
    }

    public function destroy(string $id): JsonResponse
    {
        $appointment = Appointment::findOrFail($id);

        try {
            $this->bookingService->cancelAppointment($appointment);
            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}
