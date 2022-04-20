<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApplicationContentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('application_contents', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('app_id');
            $table->bigInteger('content_type_id');
            $table->text('column_title');
            $table->string('column_image1')->nullable();
            $table->string('column_image2')->nullable();
            $table->string('column_image3')->nullable();
            $table->string('column_image4')->nullable();
            $table->string('column_image5')->nullable();
            $table->text('column_string1')->nullable();
            $table->text('column_string2')->nullable();
            $table->text('column_string3')->nullable();
            $table->text('column_string4')->nullable();
            $table->text('column_string5')->nullable();
            $table->longText('column_text1')->nullable();
            $table->longText('column_text2')->nullable();
            $table->longText('column_text3')->nullable();
            $table->longText('column_text4')->nullable();
            $table->longText('column_text5')->nullable();
            $table->integer('column_number1')->nullable();
            $table->integer('column_number2')->nullable();
            $table->integer('column_number3')->nullable();
            $table->integer('column_number4')->nullable();
            $table->integer('column_number5')->nullable();
            $table->tinyInteger('column_logical1')->nullable();
            $table->tinyInteger('column_logical2')->nullable();
            $table->tinyInteger('column_logical3')->nullable();
            $table->tinyInteger('column_logical4')->nullable();
            $table->tinyInteger('column_logical5')->nullable();
            $table->date('column_date1')->nullable();
            $table->date('column_date2')->nullable();
            $table->date('column_date3')->nullable();
            $table->date('column_date4')->nullable();
            $table->date('column_date5')->nullable();
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
        Schema::dropIfExists('application_contents');
    }
}
