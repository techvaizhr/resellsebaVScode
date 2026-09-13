<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ResellerListing extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'reseller_id', 'product_id', 'price', 'is_active', 'custom_title', 'custom_description'
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function reseller()
    {
        return $this->belongsTo(Reseller::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
