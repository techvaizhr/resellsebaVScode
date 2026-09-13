<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LeaderCommission extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'leader_id', 'reseller_id', 'order_id', 'amount', 'status'
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
        ];
    }

    public function leader()
    {
        return $this->belongsTo(Reseller::class, 'leader_id');
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function reseller()
    {
        return $this->belongsTo(Reseller::class, 'reseller_id');
    }
}
