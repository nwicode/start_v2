<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLicensesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('licenses', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');
            $table->string('registered_to')->nullable();
            $table->string('license_key')->nullable();
            $table->string('product_id')->nullable();
            $table->string('product_edition')->nullable();
            $table->string('number_of_sites')->nullable();
            $table->string('maximum_users')->nullable();
            $table->boolean('is_active')->default(false);
            $table->dateTime('start_datetime')->nullable();
            $table->dateTime('end_datetime')->nullable();
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
        Schema::dropIfExists('licenses');
    }
}
