<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AgentPayout extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'agent_id', 'amount', 'kind', 'status', 'method', 'reference', 'note', 'admin_note', 'period_from', 'period_to', 'created_by', 'approved_at', 'paid_at', 'transaction_id'
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'approved_at' => 'datetime',
            'paid_at' => 'datetime',
        ];
    }

    public function agent()
    {
        return $this->belongsTo(Agent::class);
    }
}
