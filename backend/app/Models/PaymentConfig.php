<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PaymentConfig extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'reseller_id', 'method', 'details', 'is_active'
    ];

    protected function casts(): array
    {
        return [
            'method' => \App\Enums\PaymentMethod::class,
            'is_active' => 'boolean',
        ];
    }

    public function reseller()
    {
        return $this->belongsTo(Reseller::class);
    }
}
