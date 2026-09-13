<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Brand extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'name', 'slug', 'description', 'logo', 'is_active', 'sort_order'
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
