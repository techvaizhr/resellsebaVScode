<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasApiTokens, HasUuids, Notifiable, HasFactory;

    protected $fillable = [
        'name', 'full_name', 'email', 'password', 'phone', 'avatar_url', 'is_phone_verified', 'is_active'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    public function userRole()
    {
        return $this->hasOne(UserRole::class);
    }

    public function reseller()
    {
        return $this->hasOne(Reseller::class);
    }

    public function supplier()
    {
        return $this->hasOne(Supplier::class);
    }

    public function agent()
    {
        return $this->hasOne(Agent::class);
    }
}
