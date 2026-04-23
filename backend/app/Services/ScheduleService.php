<?php

namespace App\Services;

use App\Models\MasterProfile;
use App\Models\WorkingSchedule;
use Carbon\Carbon;

class ScheduleService
{
    public function createSchedule(MasterProfile , array ): WorkingSchedule
    {
        ->validateNoOverlap(, );

        return WorkingSchedule::create([
            'master_id' => ->id,
            'day_of_week' => ['day_of_week'],
            'start_time' => ['start_time'],
            'end_time' => ['end_time'],
            'breaks' => ['breaks'] ?? [],
        ]);
    }

    public function updateSchedule(WorkingSchedule , array ): WorkingSchedule
    {
        ->validateNoOverlap(->master, , ->id);

        ->update();
        return ->fresh();
    }

    public function deleteSchedule(WorkingSchedule ): void
    {
        ->delete();
    }

    public function getMasterSchedule(MasterProfile , ?string  = null)
    {
         = WorkingSchedule::where('master_id', ->id);

        if () {
             = Carbon::parse()->dayOfWeek;
            ->where('day_of_week', );
        }

        return ->get();
    }

    private function validateNoOverlap(MasterProfile , array , ?string  = null): void
    {
         = WorkingSchedule::where('master_id', ->id)
            ->where('day_of_week', ['day_of_week']);

        if () {
            ->where('id', '!=', );
        }

         = ->first();
        if () {
            throw new \Exception('Schedule for this day already exists');
        }
    }
}
