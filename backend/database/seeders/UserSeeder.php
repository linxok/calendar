<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@salon.com'],
            [
                'name' => 'Administrator',
                'phone' => '+380991234567',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'status' => 'active',
            ]
        );

        User::firstOrCreate(
            ['email' => 'anna@salon.com'],
            [
                'name' => 'Anna Stylist',
                'phone' => '+380992345678',
                'password' => Hash::make('password'),
                'role' => 'master',
                'status' => 'active',
            ]
        );

        User::firstOrCreate(
            ['email' => 'client@example.com'],
            [
                'name' => 'Client User',
                'phone' => '+380993456789',
                'password' => Hash::make('password'),
                'role' => 'client',
                'status' => 'active',
            ]
        );
    }
}
