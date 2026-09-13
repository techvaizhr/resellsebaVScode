<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AuditLog extends Model
{
    use HasUuids, HasFactory;

    const UPDATED_AT = null;

    protected $fillable = [
        'user_id', 'action', 'model_type', 'model_id', 'old_data', 'new_data', 'ip_address'
    ];

    protected function casts(): array
    {
        return [
            'old_data' => 'array',
            'new_data' => 'array',
        ];
    }
}
