<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AdminNotice extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'title', 'content', 'type', 'is_active', 'is_dismissible', 'starts_at', 'ends_at', 'target_reseller_ids'
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'is_dismissible' => 'boolean',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'target_reseller_ids' => 'array',
        ];
    }

    public function adminNoticeDismissals()
    {
        return $this->hasMany(AdminNoticeDismissal::class);
    }
}
