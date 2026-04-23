<?php

namespace App\Services;

use App\Models\MasterProfile;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class MasterService
{
    public function create(array $data): MasterProfile
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'password' => Hash::make($data['password'] ?? Str::random(12)),
            'role' => 'master',
            'status' => 'active',
        ]);

        return MasterProfile::create([
            'user_id' => $user->id,
            'specialization' => $data['specialization'] ?? null,
            'photo_url' => $data['photo_url'] ?? null,
            'active_status' => 'active',
        ]);
    }

    public function update(MasterProfile $master, array $data): MasterProfile
    {
        if (isset($data['name']) || isset($data['email']) || isset($data['phone'])) {
            $userData = array_intersect_key($data, array_flip(['name', 'email', 'phone']));
            $master->user->update($userData);
        }

        $masterData = array_intersect_key($data, array_flip(['specialization', 'photo_url', 'active_status']));
        $master->update($masterData);

        return $master->fresh();
    }

    public function deactivate(MasterProfile $master): void
    {
        $master->update(['active_status' => 'inactive']);
        $master->user->update(['status' => 'inactive']);
    }

    public function getActiveMasters(?string $specialization = null)
    {
        $query = MasterProfile::with('user')
            ->where('active_status', 'active')
            ->whereHas('user', function ($q) {
                $q->where('status', 'active');
            });

        return $query->get();
    }
}
