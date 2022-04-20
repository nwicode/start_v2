<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSystemSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->string('system_email');
            $table->string('system_owner');
            $table->string('left_logo_img');
            $table->string('auth_color');
            $table->string('logo_img');
            $table->string('inner_logo');
            $table->string('spinner_logo');
            $table->string('text_logo_color');
            $table->string('domain');
            $table->string('default_currency');
            $table->string('default_avatar');
            $table->string('smtp_host');
            $table->string('smtp_port');
            $table->string('smtp_user');
            $table->string('smtp_password');
            $table->tinyInteger('users_registration_enabled')->default(1);
            $table->integer('trial_day')->default(3);
            $table->string('google_web_client_id');
            $table->tinyInteger('google_registration')->default(0);
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
        Schema::dropIfExists('system_settings');
    }
}
