<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Permission extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'name', 'module', 'description'
    ];

    public function rolePermissions()
    {
        return $this->hasMany(RolePermission::class);
    }
}
