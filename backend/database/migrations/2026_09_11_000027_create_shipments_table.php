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
        Schema::create('shipments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('order_id')->constrained('orders')->cascadeOnDelete();
            $table->string('courier');
            $table->string('consignment_id')->nullable();
            $table->string('tracking_code')->nullable();
            $table->text('tracking_url')->nullable();
            $table->string('status')->default('pending');
            $table->decimal('delivery_charge', 10, 2)->default(0);
            $table->decimal('cod_amount', 10, 2)->default(0);
            $table->decimal('weight', 8, 2)->nullable();
            $table->string('pickup_store_id')->nullable();
            $table->uuid('booked_by')->nullable();
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};

