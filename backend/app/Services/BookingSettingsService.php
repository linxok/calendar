<?php

namespace App\Services;

use App\Models\BookingSetting;

class BookingSettingsService
{
    public function getSettings(): array
    {
         = BookingSetting::all()->pluck('value', 'key')->toArray();
        
        return [
            'minimum_notice_hours' => json_decode(['minimum_notice_hours'] ?? '2'),
            'cancellation_window_hours' => json_decode(['cancellation_window_hours'] ?? '24'),
            'buffer_minutes' => json_decode(['buffer_minutes'] ?? '15'),
            'max_bookings_per_day' => json_decode(['max_bookings_per_day'] ?? '10'),
        ];
    }

    public function updateSettings(array ): void
    {
        foreach ( as  => ) {
            BookingSetting::updateOrCreate(
                ['key' => ],
                ['value' => json_encode()]
            );
        }
    }
}
