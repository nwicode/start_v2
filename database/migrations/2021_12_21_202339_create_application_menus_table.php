<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApplicationMenusTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('application_menus', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('app_id');
            $table->longText('menu')->nullable();
            $table->integer('sort_order')->nullable();
            $table->longText('translations')->nullable();
            $table->text('action')->nullable();
            $table->text('image')->nullable();
            $table->text('visible_conditions')->nullable();
            $table->timestamps();
            $table->index(['app_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('application_menus');
    }
}
