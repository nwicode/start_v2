<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBuildQueriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('build_queries', function (Blueprint $table) {
            $table->id();
			$table->integer('app_id');
			$table->string('type')->default('source');
			$table->tinyInteger('run')->default('0');
			$table->tinyInteger('ended')->default('0');
			$table->string('report')->nullable();
			$table->string('file')->nullable();
			$table->string('vesrion')->nullable();
			$table->string('bundle_id')->nullable();
			$table->timestamp('buld_start', $precision = 0)->nullable();
			$table->timestamp('buld_end', $precision = 0)->nullable();
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
        Schema::dropIfExists('build_queries');
    }
}
