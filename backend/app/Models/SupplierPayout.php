<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SupplierPayout extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'supplier_id', 'amount', 'status', 'approved_at', 'paid_at', 'transaction_id'
    ];

    protected function casts(): array
    {
        return [
            'status' => \App\Enums\PayoutStatus::class,
            'amount' => 'decimal:2',
            'approved_at' => 'datetime',
            'paid_at' => 'datetime',
        ];
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }
}
