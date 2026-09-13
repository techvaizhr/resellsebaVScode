<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void {
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('(UUID())'))->primary();
            $table->string('order_number')->unique();
            $table->foreignUuid('reseller_id')->nullable()->constrained('resellers')->nullOnDelete();
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->text('customer_address');
            $table->string('customer_email')->nullable();
            $table->string('delivery_area')->default('outside_dhaka');
            $table->string('status')->default('pending');
            $table->string('payment_method')->default('cod');
            $table->string('payment_status')->default('unpaid');
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('delivery_charge', 10, 2)->default(0);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('total', 12, 2)->default(0);
            $table->decimal('advance_amount', 10, 2)->default(0);
            $table->string('advance_by')->nullable();
            $table->decimal('received_amount', 10, 2)->default(0);
            $table->decimal('package_cost', 10, 2)->default(0);
            $table->text('note')->nullable();
            $table->text('admin_note')->nullable();
            $table->string('invoice_number')->nullable();
            $table->string('source')->default('panel');
            $table->boolean('is_forwarded')->default(false);
            $table->timestamp('forwarded_at')->nullable();
            $table->uuid('created_by')->nullable();
            $table->boolean('stock_restored')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('orders');
    }
};
