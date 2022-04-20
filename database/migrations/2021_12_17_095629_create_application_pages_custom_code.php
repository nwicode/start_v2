<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApplicationPagesCustomCode extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('application_pages_custom_code', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('page_id');
            $table->longText('import_section')->nullable();
            $table->longText('variables')->nullable();
            $table->longText('define_constructor_objects')->nullable();
            $table->longText('constructor_code')->nullable();
            $table->longText('on_init')->nullable();
            $table->longText('on_destroy')->nullable();
            $table->longText('menu')->nullable();
            $table->longText('ion_view_will_enter')->nullable();
            $table->longText('ion_view_did_enter')->nullable();
            $table->longText('ion_view_will_leave')->nullable();
            $table->longText('ion_view_did_leave')->nullable();
            $table->longText('user_functions')->nullable();
            $table->longText('header')->nullable();
            $table->longText('content_before')->nullable();
            $table->longText('content_after')->nullable();
            $table->longText('footer')->nullable();
            $table->longText('scss')->nullable();
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
        Schema::dropIfExists('application_pages_custom_code');
    }
}
