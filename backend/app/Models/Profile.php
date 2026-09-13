<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Profile extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'user_id', 'first_name', 'last_name', 'address', 'city', 'state', 'country', 'zip_code', 'is_phone_verified', 'avatar'
    ];

    protected function casts(): array
    {
        return [
            'is_phone_verified' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
