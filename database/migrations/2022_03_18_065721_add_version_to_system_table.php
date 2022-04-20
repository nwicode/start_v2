<?php
/**
 * Add verison column and platform
 */
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddVersionToSystemTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('system_settings', function (Blueprint $table) {
            //
            
            $table->string('platform')->nullable();
            $table->string('version')->nullable();
            $table->dateTime('last_check_date')->nullable();
        });

        // Insert some stuff
        DB::table('system_settings')->update(
            array(
                'platform' => 'saas',
                'version' => "0.0.1"
            )
        );        
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('system_settings', function (Blueprint $table) {
            //
        });
    }
}
