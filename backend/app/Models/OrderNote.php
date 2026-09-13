<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderNote extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'order_id', 'note', 'is_internal', 'created_by'
    ];

    protected function casts(): array
    {
        return [
            'is_internal' => 'boolean',
        ];
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
