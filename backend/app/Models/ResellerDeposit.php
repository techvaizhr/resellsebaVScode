<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ResellerDeposit extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'reseller_id', 'amount', 'transaction_id', 'payment_method', 'status', 'notes'
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
        ];
    }

    public function reseller()
    {
        return $this->belongsTo(Reseller::class);
    }
}
