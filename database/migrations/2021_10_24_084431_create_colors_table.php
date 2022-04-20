<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateColorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('colors', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('app_id');
            $table->string('name');
            $table->string('color_name')->nullable();
            $table->string('named')->nullable();
            $table->string('color_value')->nullable();
            $table->string('color_value_rgb')->nullable();
            $table->string('color_value_contrast')->nullable();
            $table->string('color_value_contrast_rgb')->nullable();
            $table->string('color_value_shade')->nullable();
            $table->string('color_value_tint')->nullable();
            $table->string('color_type')->default('system');
            $table->tinyInteger('disabled')->default('0');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('colors');
    }
}
