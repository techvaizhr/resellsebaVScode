<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payout extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'reseller_id', 'amount', 'status', 'approved_at', 'paid_at', 'transaction_id', 'payment_method'
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

    public function reseller()
    {
        return $this->belongsTo(Reseller::class);
    }
}
