<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApplicationUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('application_users', function (Blueprint $table) {
            $table->id();
            $table->integer('app_id');
            $table->string('name');
            $table->string('mail');
            $table->string('password');
            $table->string('phone')->default('');
            $table->float('balance')->default(0);
            $table->integer('role')->default(1);
            $table->longText('avatar')->nullable();
            $table->boolean('blocked')->default(false);
            $table->date('last_date')->nullable();
            $table->json('topics')->nullable();
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
        Schema::dropIfExists('application_users');
    }
}
