<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class TrPhrases extends Migration {

    public function up() {
        Schema::create('tr_phrases', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('lang_id');
            $table->string('phrase');
            $table->text('translation')->nullable();
            $table->string('section');
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('tr_phrases');
    }
}
