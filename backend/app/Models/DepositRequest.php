<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DepositRequest extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'reseller_id', 'amount', 'payment_method', 'transaction_id', 'status', 'reviewed_at', 'reviewer_id'
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'reviewed_at' => 'datetime',
        ];
    }

    public function reseller()
    {
        return $this->belongsTo(Reseller::class);
    }
}
