<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserRole extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'user_id', 'role', 'custom_role_id'
    ];

    protected function casts(): array
    {
        return [
            'role' => \App\Enums\AppRole::class,
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function customRole()
    {
        return $this->belongsTo(Role::class, 'custom_role_id');
    }
}
