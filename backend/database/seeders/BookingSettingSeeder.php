<?php

namespace Database\Seeders;

use App\Models\BookingSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BookingSettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'minimum_notice_hours', 'value' => 2],
            ['key' => 'cancellation_window_hours', 'value' => 24],
            ['key' => 'buffer_minutes', 'value' => 15],
            ['key' => 'max_bookings_per_day', 'value' => 10],
        ];

        foreach ($settings as $setting) {
            BookingSetting::create([
                'id' => Str::uuid(),
                'key' => $setting['key'],
                'value' => json_encode($setting['value']),
            ]);
        }
    }
}
