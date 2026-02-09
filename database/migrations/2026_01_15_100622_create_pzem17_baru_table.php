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
        Schema::create('pzem17_baru', function (Blueprint $table) {
            $table->id();
            $table->decimal('voltage', total: 10, places: 2)->nullable();
            $table->decimal('current', total: 10, places: 2)->nullable();
            $table->decimal('power', total: 10, places: 2)->nullable();
            $table->decimal('energy', total: 10, places: 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pzem17_baru');
    }
};
