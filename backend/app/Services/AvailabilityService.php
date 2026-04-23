<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\MasterProfile;
use App\Models\Service;
use App\Models\WorkingSchedule;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\Cache;

class AvailabilityService
{
    private BookingSettingsService $settingsService;

    public function __construct(BookingSettingsService $settingsService)
    {
        $this->settingsService = $settingsService;
    }

    public function getAvailableSlots(string $masterId, string $serviceId, string $date): array
    {
        $cacheKey = "availability:{$masterId}:{$serviceId}:{$date}";

        return Cache::remember($cacheKey, 300, function () use ($masterId, $serviceId, $date) {
            $master = MasterProfile::findOrFail($masterId);
            $service = Service::findOrFail($serviceId);
            $carbonDate = Carbon::parse($date);

            $schedule = WorkingSchedule::where('master_id', $masterId)
                ->where('day_of_week', $carbonDate->dayOfWeek)
                ->first();

            if (!$schedule) {
                return [];
            }

            $slots = $this->generateTimeSlots(
                $masterId,
                $date,
                $schedule->start_time,
                $schedule->end_time,
                $schedule->breaks ?? [],
                $service->duration_min
            );

            return [
                'master_id' => $masterId,
                'service_id' => $serviceId,
                'date' => $date,
                'slots' => $slots,
            ];
        });
    }

    private function generateTimeSlots(
        string $masterId,
        string $date,
        string $startTime,
        string $endTime,
        array $breaks,
        int $durationMinutes
    ): array {
        $settings = $this->settingsService->getSettings();
        $bufferMinutes = $settings['buffer_minutes'] ?? 15;

        $start = Carbon::parse("{$date} {$startTime}");
        $end = Carbon::parse("{$date} {$endTime}");

        $existingAppointments = Appointment::where('master_id', $masterId)
            ->whereDate('start_at', $date)
            ->whereIn('status', ['pending', 'confirmed'])
            ->get();

        $slots = [];
        $period = CarbonPeriod::create($start, "{$durationMinutes} minutes", $end);

        foreach ($period as $slotStart) {
            $slotEnd = $slotStart->copy()->addMinutes($durationMinutes);

            if ($slotEnd->gt($end)) {
                continue;
            }

            if ($this->isSlotAvailable($slotStart, $slotEnd, $breaks, $existingAppointments, $bufferMinutes)) {
                $slots[] = [
                    'start_time' => $slotStart->format('H:i'),
                    'end_time' => $slotEnd->format('H:i'),
                    'available' => true,
                ];
            }
        }

        return $slots;
    }

    private function isSlotAvailable(
        Carbon $slotStart,
        Carbon $slotEnd,
        array $breaks,
        $existingAppointments,
        int $bufferMinutes
    ): bool {
        foreach ($breaks as $break) {
            $breakStart = Carbon::parse($slotStart->format('Y-m-d') . ' ' . $break['start']);
            $breakEnd = Carbon::parse($slotStart->format('Y-m-d') . ' ' . $break['end']);

            if ($slotStart->lt($breakEnd) && $slotEnd->gt($breakStart)) {
                return false;
            }
        }

        foreach ($existingAppointments as $appointment) {
            $apptStart = Carbon::parse($appointment->start_at)->subMinutes($bufferMinutes);
            $apptEnd = Carbon::parse($appointment->end_at)->addMinutes($bufferMinutes);

            if ($slotStart->lt($apptEnd) && $slotEnd->gt($apptStart)) {
                return false;
            }
        }

        return true;
    }

    public function isSlotAvailableForBooking(string $masterId, string $startAt, int $durationMinutes): bool
    {
        $start = Carbon::parse($startAt);
        $end = $start->copy()->addMinutes($durationMinutes);
        $date = $start->format('Y-m-d');

        $existingAppointments = Appointment::where('master_id', $masterId)
            ->whereDate('start_at', $date)
            ->whereIn('status', ['pending', 'confirmed'])
            ->get();

        foreach ($existingAppointments as $appointment) {
            $apptStart = Carbon::parse($appointment->start_at);
            $apptEnd = Carbon::parse($appointment->end_at);

            if ($start->lt($apptEnd) && $end->gt($apptStart)) {
                return false;
            }
        }

        return true;
    }
}
