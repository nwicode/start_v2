<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApplicationPageComponentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('application_page_components', function (Blueprint $table) {
            $table->id();
            $table->integer('app_id');
            $table->integer('page_id');
            $table->integer('x')->nullable();
            $table->integer('y')->nullable();
            $table->integer('order')->nullable();
            $table->integer('height')->nullable();
            $table->integer('width')->nullable();
            $table->string('mode')->default('md');
            $table->longText('code')->nullable();
            $table->string('component_code')->nullable();
            $table->longText('visibility')->nullable();
            $table->string('title')->nullable();
            $table->string('position')->nullable();
            $table->tinyInteger('fixed')->default('0');
            $table->tinyInteger('fluid_width')->default('0');
            $table->tinyInteger('fluid_height')->default('0');
			
			$table->tinyInteger('use_card')->default('0');
            $table->integer('card_border_radius')->default('0');
            $table->integer('card_border_width')->default('1');
            $table->tinyInteger('card_opacity')->default('100');
            $table->string('card_background_color')->default('--ion-color-light');
            $table->string('card_border_color')->default('--ion-color-light');
            $table->string('card_shadow')->default('0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)');
			$table->integer('card_padding_top')->default('10');
			$table->integer('card_padding_left')->default('10');

			$table->integer('rotate')->default('0');
			
            $table->integer('x0')->nullable();
            $table->integer('y0')->nullable();

            $table->integer('x1')->nullable();
            $table->integer('y1')->nullable();

            $table->tinyInteger('fixed_left')->default('1');
            $table->tinyInteger('fixed_right')->default('0');
            $table->tinyInteger('fixed_top')->default('0');
            $table->tinyInteger('fixed_bottom')->default('0');

            $table->integer('from_left_to_x0')->nullable();
            $table->integer('from_top_to_y0')->nullable();

            $table->integer('from_right_to_x1')->nullable();
            $table->integer('from_bottom_to_y1')->nullable();
            $table->string('css_class')->default('');

            $table->index(['app_id']);
            $table->index(['app_id','page_id']);
            $table->index(['app_id','page_id','component_code']);

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
        Schema::dropIfExists('application_page_components');
    }
}
