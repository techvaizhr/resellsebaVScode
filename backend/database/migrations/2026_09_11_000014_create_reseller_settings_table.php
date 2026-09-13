<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
            Schema::create('reseller_settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('reseller_id')->unique()->constrained('resellers')->cascadeOnDelete();
            $table->text('logo_url')->nullable();
            $table->text('banner_url')->nullable();
            $table->text('hero_image_url')->nullable();
            $table->string('theme_color')->default('#6366f1');
            $table->string('accent_color')->nullable();
            $table->string('font')->nullable();
            $table->json('social_links')->nullable();
            $table->text('custom_css')->nullable();
            $table->text('store_description')->nullable();
            $table->string('whatsapp_number')->nullable();
            $table->string('facebook_url')->nullable();
            $table->text('announcement')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reseller_settings');
    }
};

