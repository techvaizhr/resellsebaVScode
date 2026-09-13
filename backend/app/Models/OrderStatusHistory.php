<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderStatusHistory extends Model
{
    use HasUuids, HasFactory;

    const UPDATED_AT = null;

    protected $fillable = [
        'order_id', 'status', 'remarks', 'changed_by'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
