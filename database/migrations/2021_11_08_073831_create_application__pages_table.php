<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApplicationPagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('application_pages', function (Blueprint $table) {
            $table->id();
            $table->integer('app_id');
            $table->string('name');
            $table->string('type');
            $table->string('background')->default('--ion-background-color');
            $table->string('text')->default('--ion-text-color');
            $table->integer('pos_x')->default('10');
            $table->integer('pos_y')->default('10');
            $table->integer('height')->nullable();
            $table->integer('width')->nullable();
            $table->tinyInteger('first')->default('0');
            $table->tinyInteger('can_delete')->default('1');
            $table->tinyInteger('show_admob_banner')->default('0');
            $table->tinyInteger('show_admob_reward_video')->default('0');
            $table->tinyInteger('show_admob_interstitial')->default('0');
            $table->tinyInteger('padding')->default('0');
            $table->tinyInteger('fullscreen')->default('0');
            $table->tinyInteger('ion_padding')->default('0'); 
            $table->string('background_image')->default('default');
            $table->string('background_image_mode')->default('repeat');
            $table->string('background_image_size')->default('auto');
            $table->integer('start_page_next_page')->default('0');
            $table->integer('start_page_timeout')->default('3');
            $table->integer('current_animation')->default('0');
            $table->string('current_animation_settings')->nullable();
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
        Schema::dropIfExists('application_pages');
    }
}
