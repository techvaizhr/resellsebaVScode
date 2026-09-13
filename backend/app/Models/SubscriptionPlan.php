<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SubscriptionPlan extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'name', 'description', 'price', 'duration_days', 'features', 'is_active'
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'features' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function resellerSubscriptions()
    {
        return $this->hasMany(ResellerSubscription::class);
    }
}
