<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\MasterProfile;
use Carbon\Carbon;

class CalendarService
{
    public function getAppointments(array $filters = []): array
    {
        $query = Appointment::with(['master.user', 'service', 'client']);

        if (!empty($filters['master_id'])) {
            $query->where('master_id', $filters['master_id']);
        }

        if (!empty($filters['start_date'])) {
            $query->whereDate('start_at', '>=', $filters['start_date']);
        }

        if (!empty($filters['end_date'])) {
            $query->whereDate('start_at', '<=', $filters['end_date']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->get()->toArray();
    }

    public function getMasterAppointments(string $masterId, string $startDate, string $endDate): array
    {
        return Appointment::with(['service', 'client'])
            ->where('master_id', $masterId)
            ->whereBetween('start_at', [$startDate, $endDate])
            ->whereIn('status', ['pending', 'confirmed'])
            ->get()
            ->toArray();
    }

    public function getDailyView(string $date): array
    {
        $carbonDate = Carbon::parse($date);
        $masters = MasterProfile::with('user')
            ->where('active_status', 'active')
            ->get();

        $result = [];
        foreach ($masters as $master) {
            $appointments = Appointment::with('service')
                ->where('master_id', $master->id)
                ->whereDate('start_at', $date)
                ->whereIn('status', ['pending', 'confirmed'])
                ->orderBy('start_at')
                ->get();

            $result[] = [
                'master_id' => $master->id,
                'master_name' => $master->user->name,
                'appointments' => $appointments,
            ];
        }

        return [
            'date' => $date,
            'day_of_week' => $carbonDate->dayName,
            'masters' => $result,
        ];
    }

    public function getWeeklyView(string $startDate): array
    {
        $start = Carbon::parse($startDate);
        $days = [];

        for ($i = 0; $i < 7; $i++) {
            $date = $start->copy()->addDays($i);
            $days[] = $this->getDailyView($date->format('Y-m-d'));
        }

        return [
            'week_start' => $startDate,
            'week_end' => $start->copy()->addDays(6)->format('Y-m-d'),
            'days' => $days,
        ];
    }
}
