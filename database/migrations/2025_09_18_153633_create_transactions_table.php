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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('hrc_id')->constrained('history_records')->onDelete('cascade');
            $table->decimal('rpm', total: 10, places: 2);
            $table->decimal('voltage', total: 10, places: 2);
            $table->decimal('current', total: 10, places: 2);
            $table->decimal('power', total: 10, places: 2);
            $table->decimal('energy', total: 10, places: 2);
            $table->string('row_record');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
