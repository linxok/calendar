<?php

namespace App\Services;

use App\Models\MasterProfile;
use App\Models\WorkingSchedule;
use Carbon\Carbon;

class ScheduleService
{
    public function createSchedule(MasterProfile $master, array $data): WorkingSchedule
    {
        $this->validateNoOverlap($master, $data);

        return WorkingSchedule::create([
            'master_id' => $master->id,
            'day_of_week' => $data['day_of_week'],
            'start_time' => $data['start_time'],
            'end_time' => $data['end_time'],
            'breaks' => $data['breaks'] ?? [],
        ]);
    }

    public function updateSchedule(WorkingSchedule $schedule, array $data): WorkingSchedule
    {
        $this->validateNoOverlap($schedule->master, $data, $schedule->id);

        $schedule->update($data);
        return $schedule->fresh();
    }

    public function deleteSchedule(WorkingSchedule $schedule): void
    {
        $schedule->delete();
    }

    public function getMasterSchedule(MasterProfile $master, ?string $date = null)
    {
        $query = WorkingSchedule::where('master_id', $master->id);

        if ($date) {
            $dayOfWeek = Carbon::parse($date)->dayOfWeek;
            $query->where('day_of_week', $dayOfWeek);
        }

        return $query->get();
    }

    private function validateNoOverlap(MasterProfile $master, array $data, ?string $excludeId = null): void
    {
        $query = WorkingSchedule::where('master_id', $master->id)
            ->where('day_of_week', $data['day_of_week']);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        $existing = $query->first();
        if ($existing) {
            throw new \Exception('Schedule for this day already exists');
        }
    }
}
