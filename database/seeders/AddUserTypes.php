<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AddUserTypes extends Seeder
{
    /**
     * Fill user types in user_types table
     *
     * @return void
     */
    public function run()
    {
        DB::table('user_types')->insert(['name'=>'admin']);
    }
}
