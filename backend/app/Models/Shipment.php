<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Shipment extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'order_id', 'courier', 'tracking_code', 'status', 'delivery_charge', 'cod_amount'
    ];

    protected function casts(): array
    {
        return [
            'courier' => \App\Enums\CourierProvider::class,
            'status' => \App\Enums\ShipmentStatus::class,
            'delivery_charge' => 'decimal:2',
            'cod_amount' => 'decimal:2',
        ];
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function courierEvents()
    {
        return $this->hasMany(CourierEvent::class);
    }
}
