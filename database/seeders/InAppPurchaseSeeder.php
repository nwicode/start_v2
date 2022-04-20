<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InAppPurchaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //

        DB::table('in_app_purchases')->insert([
            'name' => 'Consumable',
            'type' => 'CONSUMABLE',
            'disabled' => '0',
        ]);        

        DB::table('in_app_purchases')->insert([
            'name' => 'Non consumable',
            'type' => 'NON_CONSUMABLE',
            'disabled' => '0',
        ]);        


        DB::table('in_app_purchases')->insert([
            'name' => 'Non renewing subscription',
            'type' => 'NON_RENEWING_SUBSCRIPTION',
            'disabled' => '0',
        ]);

        DB::table('in_app_purchases')->insert([
            'name' => 'Paid subscription',
            'type' => 'PAID_SUBSCRIPTION',
            'disabled' => '0',
        ]); 

        DB::table('in_app_purchases')->insert([
            'name' => 'Free subscription',
            'type' => 'FREE_SUBSCRIPTION',
            'disabled' => '0',
        ]);        
    }
}
