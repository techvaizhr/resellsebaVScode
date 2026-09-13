<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class NotificationConfig extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'reseller_id', 'channel', 'config', 'is_active'
    ];

    protected function casts(): array
    {
        return [
            'config' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function reseller()
    {
        return $this->belongsTo(Reseller::class);
    }
}
