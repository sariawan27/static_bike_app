<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('h_battery_usage', function (Blueprint $table) {
            $table->id();
            $table->decimal('voltage', total: 10, places: 2);
            $table->decimal('current', total: 10, places: 2);
            $table->decimal('power', total: 10, places: 2);
            $table->decimal('energy', total: 10, places: 2);
            $table->string('status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('h_battery_usage');
    }
};
