<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TutorialTopic extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'title', 'slug', 'description', 'sort_order'
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    public function tutorials()
    {
        return $this->hasMany(Tutorial::class);
    }
}
