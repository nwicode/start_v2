<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('avatar')->nullable();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->boolean('blocked')->default(false);
            $table->unsignedBigInteger('user_type_id')->default(3);
            $table->foreign('user_type_id')->references('id')->on("user_types");
            $table->rememberToken();
            $table->dateTime("last_updated")->nullable();
            $table->timestamps();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->bigInteger('country')->nullable();
            $table->string('default_language')->default("en");
            $table->string('company')->nullable();
            $table->unsignedBigInteger('current_plan')->default(0);
            $table->string('current_plan_period')->default('month');
            $table->bigInteger('parent_id')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
