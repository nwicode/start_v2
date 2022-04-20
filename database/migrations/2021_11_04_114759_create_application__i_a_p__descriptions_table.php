<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApplicationIAPDescriptionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('application_i_a_p_descriptions', function (Blueprint $table) {
            $table->id();
            $table->integer('app_id');
            $table->integer('iap_id');
            $table->string('lang');
            $table->string('name');
            $table->text('description');            
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
        Schema::dropIfExists('application_i_a_p_descriptions');
    }
}
