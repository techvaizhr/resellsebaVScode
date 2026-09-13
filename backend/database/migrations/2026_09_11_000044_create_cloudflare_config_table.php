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
    public function up(): void
    {
        Schema::create('cloudflare_config', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->text('api_token')->nullable();
            $table->string('zone_id')->nullable();
            $table->string('account_id')->nullable();
            $table->string('worker_name')->nullable();
            $table->json('settings')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cloudflare_config');
    }
};

