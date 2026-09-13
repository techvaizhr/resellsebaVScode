<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Supplier extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'user_id', 'company_name', 'contact_person', 'status', 'approved_at', 'balance'
    ];

    protected function casts(): array
    {
        return [
            'approved_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function supplierReturns()
    {
        return $this->hasMany(SupplierReturn::class);
    }

    public function supplierPayouts()
    {
        return $this->hasMany(SupplierPayout::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
