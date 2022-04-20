<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLanguagesTable extends Migration {
    
    public function up() {
        Schema::create('languages', function (Blueprint $table) {
            $table->increments('id');
            $table->string('code')->unique();
            $table->string('name');
            $table->string('file');
            $table->string('image');
            $table->integer('is_default')->default(0);
            $table->timestamps();
        });
    }
    
    public function down() {
        Schema::dropIfExists('languages');
    }
}