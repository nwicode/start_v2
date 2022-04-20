<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LanguagesSeeder extends Seeder {
    
    public function run() {
        
        DB::table('languages')->insert([
            'code'=> 'en',
            'name'=> 'ENGLISH',
            'file'=> '',
            'image'=> '',
            'is_default'=> 1
        ]);
        DB::table('languages')->insert([
            'code'=> 'ru',
            'name'=> 'RUSSIAN',
            'file'=> '',
            'image'=> '',
            'is_default'=> 0
        ]);

    }
}