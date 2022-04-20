<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIndexToTrPhrases extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tr_phrases', function (Blueprint $table) {
            //
            $table->index(['id']);
            $table->index(['lang_id','section','phrase']);
            $table->index(['lang_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tr_phrases', function (Blueprint $table) {
            //
        });
    }
}
