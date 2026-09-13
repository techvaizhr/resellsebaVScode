<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Agent extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'user_id', 'display_name', 'name', 'phone', 'email', 'whatsapp', 'sale_target', 'commission_rate', 'is_active', 'notes', 'agent_code'
    ];

    protected function casts(): array
    {
        return [
            'commission_rate' => 'decimal:2',
            'sale_target' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function agentPayouts()
    {
        return $this->hasMany(AgentPayout::class);
    }
}
