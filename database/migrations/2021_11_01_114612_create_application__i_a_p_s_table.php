<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApplicationIAPSTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('application_i_a_p_s', function (Blueprint $table) {
            $table->id();
            $table->integer('app_id');
            $table->integer('iap_id');
            $table->text('name');
            $table->text('code');
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
        Schema::dropIfExists('application_i_a_p_s');
    }
}
