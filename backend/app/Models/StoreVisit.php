<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StoreVisit extends Model
{
    use HasUuids, HasFactory;

    const UPDATED_AT = null;

    protected $fillable = [
        'reseller_id',
        'store_code',
        'path',
        'referrer',
        'session_key',
        'device',
        'ip',
        'ip_address',
        'user_agent',
        'created_at',
        'visited_at',
    ];
}
