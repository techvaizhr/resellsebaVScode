<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Role extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'name', 'description', 'is_system'
    ];

    protected function casts(): array
    {
        return [
            'is_system' => 'boolean',
        ];
    }

    public function rolePermissions()
    {
        return $this->hasMany(RolePermission::class);
    }

    public function userRoles()
    {
        return $this->hasMany(UserRole::class);
    }
}
