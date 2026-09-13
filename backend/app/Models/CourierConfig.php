<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CourierConfig extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'provider', 'config', 'is_active'
    ];

    protected function casts(): array
    {
        return [
            'provider' => \App\Enums\CourierProvider::class,
            'is_active' => 'boolean',
            'config' => 'array',
        ];
    }
}
