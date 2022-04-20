<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
/**
 * Add admin user with credentials:
 * login admin@admin.com
 * pwd admin
 *
 * Add customer user with credentials:
 * login customer@customer.com
 * pwd customer
 *
 * Add manager user with credentials:
 * login manager@manager.com
 * pwd manager
 */
class AddAdmin extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //admin
        DB::table('users')->insert([
            'avatar' => '',
            'name' => 'Ryan Nicholson',
            'email' => 'admin@admin.com',
            'user_type_id' => '1',
            'password' => bcrypt('admin'),
            'phone' => '84376892201',
            'address' => 'London',
            'country' => '2',
            'default_language' => 'en',
            'current_plan' => '3'
        ]);
    }
}
