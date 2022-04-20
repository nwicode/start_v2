<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApplicationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->string('unique_string_id')->unique();
            $table->string('sb')->unique();
            $table->bigInteger('user_id');
            $table->string('name');
            $table->longText('description');
            $table->tinyInteger('pwa')->default(0);
            $table->tinyInteger('ios')->default(0);
            $table->tinyInteger('android')->default(0);
            $table->string('bundle_id');
            $table->double('size')->default(0);
            $table->string('version')->default('1.0.0');
            $table->string('screen_mode')->default('both');
            $table->tinyInteger('admob_enabled')->default(0);
            $table->string('admob_banner_id')->nullable();
            $table->string('admob_interstitial_id')->nullable();
            $table->string('reward_video_ad')->nullable();
            $table->string('background_image')->nullable();
            $table->string('background_image_mode')->default('repeat');
            $table->string('background_image_size')->default('auto');
            $table->longText('application_css')->nullable();
            $table->string('one_signal_id')->nullable();
            $table->string('one_signal_api_key')->nullable();
            $table->tinyInteger('one_signal_enabled')->default(0);
            $table->string('mixpanel_token')->nullable();
            $table->tinyInteger('mixpanel_enabled')->default(0);
            $table->longText('google_services_json')->nullable();
            $table->longText('google_services_plist')->nullable();
            $table->tinyInteger('use_crashlytics')->default(0);
            $table->string('icon_background_color')->default('#FFFFFF');
            $table->string('splashscreen_background_color')->default('#FFFFFF');
            $table->tinyInteger('splashscreen_show_spinner')->default(1);
            $table->string('splashscreen_spinner_color')->default('#FFFFFF');
            $table->integer('splashscreen_timeout')->default(0);
            $table->tinyInteger('blocked')->default(0);
            $table->tinyInteger('disabled')->default(0);
            $table->tinyInteger('need_first_build')->default(1);
            $table->tinyInteger('need_www_build')->default(0);
            $table->tinyInteger('request_www_build')->default(0);
            $table->tinyInteger('build_now')->default(0);
            $table->tinyInteger('use_default_privacy')->default(1);
            $table->longText('privacy_text')->nullable();
            $table->string('default_language')->default('en');
            $table->string('google_analytics_view_id')->nullable();
            $table->string('token_key');
            $table->timestamp('last_export_time')->nullable();
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
        Schema::dropIfExists('applications');
    }
}
