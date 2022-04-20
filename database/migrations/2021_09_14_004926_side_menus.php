<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class SideMenus extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('side_menus', function (Blueprint $table) {
            $table->id();
            $table->integer('menu_id')->unique();
            $table->longText('title')->nullable();
            $table->longText('icon')->nullable();
            $table->longText('svg')->nullable();
            $table->longText('page')->nullable();
            $table->longText('translate');
            $table->string('section')->nullable();
            $table->integer('is_system');
            $table->integer('sort');
            $table->integer('parent_id')->nullable();
            $table->integer('submenu')->nullable();
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
        Schema::dropIfExists('side_menus');
    }
}
