<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CourierEvent extends Model
{
    use HasUuids, HasFactory;

    const UPDATED_AT = null;

    protected $fillable = [
        'shipment_id', 'status', 'description', 'raw_payload'
    ];

    protected function casts(): array
    {
        return [
            'raw_payload' => 'array',
        ];
    }

    public function shipment()
    {
        return $this->belongsTo(Shipment::class);
    }
}
