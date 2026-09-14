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
        Schema::create('reseller_policies', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('reseller_id')->nullable()->constrained('resellers')->cascadeOnDelete();
            $table->string('title');
            $table->text('summary')->nullable();
            $table->json('points')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->string('type')->nullable();
            $table->text('content')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reseller_policies');
    }
};

