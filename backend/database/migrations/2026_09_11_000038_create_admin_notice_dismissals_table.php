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
            Schema::create('admin_notice_dismissals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('notice_id')->constrained('admin_notices')->cascadeOnDelete();
            $table->uuid('user_id');
            $table->timestamp('created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_notice_dismissals');
    }
};

