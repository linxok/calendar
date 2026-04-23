<?php

namespace App\Services;

use App\Models\BookingSetting;

class BookingSettingsService
{
    public function getSettings(): array
    {
        $settings = BookingSetting::all()->pluck('value', 'key')->toArray();

        return [
            'minimum_notice_hours' => json_decode($settings['minimum_notice_hours'] ?? '2'),
            'cancellation_window_hours' => json_decode($settings['cancellation_window_hours'] ?? '24'),
            'buffer_minutes' => json_decode($settings['buffer_minutes'] ?? '15'),
            'max_bookings_per_day' => json_decode($settings['max_bookings_per_day'] ?? '10'),
        ];
    }

    public function updateSettings(array $data): void
    {
        foreach ($data as $key => $value) {
            BookingSetting::updateOrCreate(
                ['key' => $key],
                ['value' => json_encode($value)]
            );
        }
    }
}
