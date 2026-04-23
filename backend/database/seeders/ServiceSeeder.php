<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            ['name' => 'Haircut', 'duration_min' => 30, 'price' => 300],
            ['name' => 'Hair Coloring', 'duration_min' => 120, 'price' => 1500],
            ['name' => 'Manicure', 'duration_min' => 45, 'price' => 400],
            ['name' => 'Pedicure', 'duration_min' => 60, 'price' => 500],
            ['name' => 'Makeup', 'duration_min' => 60, 'price' => 800],
            ['name' => 'Facial', 'duration_min' => 90, 'price' => 1200],
        ];

        foreach ($services as $service) {
            Service::create([
                'id' => Str::uuid(),
                'name' => $service['name'],
                'duration_min' => $service['duration_min'],
                'price' => $service['price'],
                'active_status' => 'active',
            ]);
        }
    }
}
