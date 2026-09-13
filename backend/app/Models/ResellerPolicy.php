<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ResellerPolicy extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'reseller_id', 'title', 'content', 'type'
    ];

    public function reseller()
    {
        return $this->belongsTo(Reseller::class);
    }
}
