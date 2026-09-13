<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ResellerDomain extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'reseller_id', 'domain', 'is_primary', 'is_verified'
    ];

    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
            'is_verified' => 'boolean',
        ];
    }

    public function reseller()
    {
        return $this->belongsTo(Reseller::class);
    }
}
