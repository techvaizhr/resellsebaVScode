<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AdminNoticeDismissal extends Model
{
    use HasUuids, HasFactory;

    const UPDATED_AT = null;

    protected $fillable = [
        'admin_notice_id', 'user_id'
    ];

    public function adminNotice()
    {
        return $this->belongsTo(AdminNotice::class);
    }
}
