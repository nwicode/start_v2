<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApplicationPushMessage extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('application_push_message', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('app_id');
            $table->string('push_id')->unique();
            $table->string('header')->nullable();
            $table->string('preview_text')->nullable();
            $table->string('full_text')->nullable();
            $table->string('image')->nullable();
            $table->string('sent_date')->nullable();
            $table->tinyInteger('status')->default(0);
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
        Schema::dropIfExists('application_push_message');
    }
}
