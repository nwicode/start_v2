<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ActivityLog extends Migration {
    
    public function up() {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id');
            $table->integer('app_id');
            $table->string('name');
            $table->longText('text');
            $table->timestamps();
        });
    }
    
    public function down() {
        Schema::dropIfExists('activity_logs');
    }
}