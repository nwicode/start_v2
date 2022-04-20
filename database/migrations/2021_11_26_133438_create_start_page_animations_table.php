<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStartPageAnimationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('start_page_animations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('color1')->nullable();
            $table->string('color2')->nullable();
            $table->string('color3')->nullable();
            $table->string('color4')->nullable();
            $table->string('color5')->nullable();
            $table->tinyInteger('color1_used')->default('0');
            $table->tinyInteger('color2_used')->default('0');
            $table->tinyInteger('color3_used')->default('0');
            $table->tinyInteger('color4_used')->default('0');
            $table->tinyInteger('color5_used')->default('0');
            $table->longText('css');
            $table->longText('html');
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
        Schema::dropIfExists('start_page_animations');
    }
}
