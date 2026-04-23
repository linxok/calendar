<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@salon.com',
            'phone' => '+380991234567',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'status' => 'active',
        ]);

        User::create([
            'name' => 'Anna Stylist',
            'email' => 'anna@salon.com',
            'phone' => '+380992345678',
            'password' => Hash::make('password'),
            'role' => 'master',
            'status' => 'active',
        ]);

        User::create([
            'name' => 'Client User',
            'email' => 'client@example.com',
            'phone' => '+380993456789',
            'password' => Hash::make('password'),
            'role' => 'client',
            'status' => 'active',
        ]);
    }
}
