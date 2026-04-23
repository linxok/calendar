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
    private BookingSettingsService ;

    public function __construct(BookingSettingsService )
    {
        ->settingsService = ;
    }

    public function getAvailableSlots(string , string , string ): array
    {
         = availability:{}:{}:{};
        
        return Cache::remember(, 300, function () use (, , ) {
             = MasterProfile::findOrFail();
             = Service::findOrFail();
             = Carbon::parse();

             = WorkingSchedule::where('master_id', )
                ->where('day_of_week', ->dayOfWeek)
                ->first();

            if (!) {
                return [];
            }

             = ->generateTimeSlots(
                ,
                ->start_time,
                ->end_time,
                ->breaks ?? [],
                ->duration_min,
                
            );

            return [
                'master_id' => ,
                'service_id' => ,
                'date' => ,
                'slots' => ,
            ];
        });
    }

    private function generateTimeSlots(
        string ,
        string ,
        string ,
        array ,
        int ,
        string 
    ): array {
         = [];
         = ->settingsService->getSettings();
         = ['buffer_minutes'] ?? 15;
        
         = Carbon::parse({}