<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'reseller_id', 'customer_name', 'customer_phone', 'customer_address', 
        'delivery_area', 'status', 'payment_method', 'payment_status', 
        'subtotal', 'delivery_charge', 'discount', 'total', 'advance_amount', 
        'received_amount', 'package_cost', 'is_forwarded', 'stock_restored', 'order_code'
    ];

    protected function casts(): array
    {
        return [
            'status' => \App\Enums\OrderStatus::class,
            'payment_method' => \App\Enums\PaymentMethod::class,
            'payment_status' => \App\Enums\PaymentStatus::class,
            'delivery_area' => \App\Enums\DeliveryArea::class,
            'subtotal' => 'decimal:2',
            'delivery_charge' => 'decimal:2',
            'discount' => 'decimal:2',
            'total' => 'decimal:2',
            'advance_amount' => 'decimal:2',
            'received_amount' => 'decimal:2',
            'package_cost' => 'decimal:2',
            'is_forwarded' => 'boolean',
            'stock_restored' => 'boolean',
        ];
    }

    public function reseller()
    {
        return $this->belongsTo(Reseller::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function orderStatusHistories()
    {
        return $this->hasMany(OrderStatusHistory::class);
    }

    public function orderNotes()
    {
        return $this->hasMany(OrderNote::class);
    }

    public function shipments()
    {
        return $this->hasMany(Shipment::class);
    }
}
