<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SubscriptionPayment extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'reseller_subscription_id', 'amount', 'payment_method', 'transaction_id', 'status', 'reviewed_at', 'reviewer_id'
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'reviewed_at' => 'datetime',
        ];
    }

    public function resellerSubscription()
    {
        return $this->belongsTo(ResellerSubscription::class);
    }
}
