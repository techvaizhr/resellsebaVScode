<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Tutorial extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'tutorial_topic_id', 'title', 'slug', 'content', 'video_url', 'is_published', 'sort_order'
    ];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function tutorialTopic()
    {
        return $this->belongsTo(TutorialTopic::class);
    }
}
