<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PaymentGatewayConfig extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'reseller_id', 'gateway_name', 'credentials', 'is_active', 'is_test'
    ];

    protected function casts(): array
    {
        return [
            'credentials' => 'array',
            'is_active' => 'boolean',
            'is_test' => 'boolean',
        ];
    }

    public function reseller()
    {
        return $this->belongsTo(Reseller::class);
    }
}
