<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ResellerSetting extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'reseller_id', 'logo', 'favicon', 'theme_color', 'social_links', 'contact_email', 'contact_phone'
    ];

    protected function casts(): array
    {
        return [
            'social_links' => 'array',
        ];
    }

    public function reseller()
    {
        return $this->belongsTo(Reseller::class);
    }
}
