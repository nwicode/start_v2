<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class StaticPages extends Migration {

    public function up() {
        Schema::create('static_pages', function (Blueprint $table) {
            $table->increments('id');
            $table->string('code');
            $table->integer('lang_id');
            $table->string('header');
            $table->longText('content');
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('static_pages');
    }
}
