<?php

namespace App\Services;

use App\Models\MasterProfile;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class MasterService
{
    public function create(array ): MasterProfile
    {
         = User::create([
            'name' => ['name'],
            'email' => ['email'],
            'phone' => ['phone'] ?? null,
            'password' => Hash::make(['password'] ?? Str::random(12)),
            'role' => 'master',
            'status' => 'active',
        ]);

        return MasterProfile::create([
            'user_id' => ->id,
            'specialization' => ['specialization'] ?? null,
            'photo_url' => ['photo_url'] ?? null,
            'active_status' => 'active',
        ]);
    }

    public function update(MasterProfile , array ): MasterProfile
    {
        if (isset(['name']) || isset(['email']) || isset(['phone'])) {
             = array_intersect_key(, array_flip(['name', 'email', 'phone']));
            ->user->update();
        }

         = array_intersect_key(, array_flip(['specialization', 'photo_url', 'active_status']));
        ->update();

        return ->fresh();
    }

    public function deactivate(MasterProfile ): void
    {
        ->update(['active_status' => 'inactive']);
        ->user->update(['status' => 'inactive']);
    }

    public function getActiveMasters(?string  = null)
    {
         = MasterProfile::with('user')
            ->where('active_status', 'active')
            ->whereHas('user', function () {
                ->where('status', 'active');
            });

        return ->get();
    }
}
