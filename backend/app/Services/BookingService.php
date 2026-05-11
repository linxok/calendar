<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\Service;
use App\Models\MasterProfile;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class BookingService
{
    private NotificationService $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Create a new appointment
     */
    public function createAppointment(array $data, ?int $clientId = null, string $source = 'public'): Appointment
    {
        return DB::transaction(function () use ($data, $clientId, $source) {
            // Calculate end time based on service duration
            $service = Service::findOrFail($data['service_id']);
            $startAt = Carbon::parse($data['start_at']);
            $endAt = $startAt->copy()->addMinutes($service->duration_min + $service->buffer_min);

            // Check for conflicts
            $conflicts = Appointment::where('master_id', $data['master_id'])
                ->where('status', '!=', 'cancelled')
                ->where(function ($query) use ($startAt, $endAt) {
                    $query->whereBetween('start_at', [$startAt, $endAt])
                          ->orWhereBetween('end_at', [$startAt, $endAt])
                          ->orWhere(function ($q) use ($startAt, $endAt) {
                              $q->where('start_at', '<=', $startAt)
                                ->where('end_at', '>=', $endAt);
                          });
                })
                ->exists();

            if ($conflicts) {
                throw new \Exception('Time slot is already booked');
            }

            // Create appointment
            $appointment = Appointment::create([
                'master_id' => $data['master_id'],
                'service_id' => $data['service_id'],
                'client_id' => $clientId,
                'client_name' => $data['client_name'],
                'client_phone' => $data['client_phone'],
                'client_email' => $data['client_email'] ?? null,
                'start_at' => $startAt,
                'end_at' => $endAt,
                'status' => 'confirmed',
                'notes' => $data['notes'] ?? null,
                'source' => $source,
            ]);

            // Load relationships for notifications
            $appointment->load(['service', 'master.user']);

            // Send notifications
            $this->notificationService->sendBookingConfirmation($appointment);
            $this->notificationService->notifyMasterNewBooking($appointment);

            return $appointment;
        });
    }

    /**
     * Reschedule an appointment
     */
    public function rescheduleAppointment(Appointment $appointment, string $newStartTime): Appointment
    {
        return DB::transaction(function () use ($appointment, $newStartTime) {
            $oldTime = $appointment->start_at->toDateTimeString();

            // Calculate new end time
            $service = $appointment->service;
            $newStart = Carbon::parse($newStartTime);
            $newEnd = $newStart->copy()->addMinutes($service->duration_min + $service->buffer_min);

            // Check for conflicts (excluding current appointment)
            $conflicts = Appointment::where('master_id', $appointment->master_id)
                ->where('id', '!=', $appointment->id)
                ->where('status', '!=', 'cancelled')
                ->where(function ($query) use ($newStart, $newEnd) {
                    $query->whereBetween('start_at', [$newStart, $newEnd])
                          ->orWhereBetween('end_at', [$newStart, $newEnd])
                          ->orWhere(function ($q) use ($newStart, $newEnd) {
                              $q->where('start_at', '<=', $newStart)
                                ->where('end_at', '>=', $newEnd);
                          });
                })
                ->exists();

            if ($conflicts) {
                throw new \Exception('New time slot is already booked');
            }

            // Update appointment
            $appointment->update([
                'start_at' => $newStart,
                'end_at' => $newEnd,
                'status' => 'confirmed',
            ]);

            // Send notification
            $this->notificationService->sendReschedule($appointment, $oldTime);

            return $appointment->fresh();
        });
    }

    /**
     * Cancel an appointment
     */
    public function cancelAppointment(Appointment $appointment): void
    {
        DB::transaction(function () use ($appointment) {
            // Send notification before cancelling
            $this->notificationService->sendCancellation($appointment);

            $appointment->update(['status' => 'cancelled']);
        });
    }

    /**
     * Get booking statistics
     */
    public function getStatistics(?int $masterId = null, ?string $from = null, ?string $to = null): array
    {
        $query = Appointment::query();

        if ($masterId) {
            $query->where('master_id', $masterId);
        }

        if ($from && $to) {
            $query->whereBetween('start_at', [$from, $to]);
        }

        $total = $query->count();
        $confirmed = (clone $query)->where('status', 'confirmed')->count();
        $completed = (clone $query)->where('status', 'completed')->count();
        $cancelled = (clone $query)->where('status', 'cancelled')->count();
        $pending = (clone $query)->where('status', 'pending')->count();

        return [
            'total' => $total,
            'confirmed' => $confirmed,
            'completed' => $completed,
            'cancelled' => $cancelled,
            'pending' => $pending,
            'completion_rate' => $total > 0 ? round(($completed / $total) * 100, 1) : 0,
            'cancellation_rate' => $total > 0 ? round(($cancelled / $total) * 100, 1) : 0,
        ];
    }
}
