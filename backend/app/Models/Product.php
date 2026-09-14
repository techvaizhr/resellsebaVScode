<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'title', 'slug', 'description', 'brand_id', 'category_id', 'supplier_id', 
        'price', 'buying_price', 'base_price', 'package_cost', 'supplier_price', 
        'stock', 'is_active', 'pending_changes', 'delivery_charge_override', 'sku'
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'buying_price' => 'decimal:2',
            'base_price' => 'decimal:2',
            'package_cost' => 'decimal:2',
            'supplier_price' => 'decimal:2',
            'stock' => 'integer',
            'is_active' => 'boolean',
            'pending_changes' => 'array',
            'delivery_charge_override' => 'array',
        ];
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function productImages()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function resellerListings()
    {
        return $this->hasMany(ResellerListing::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
