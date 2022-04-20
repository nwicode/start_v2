<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TrPhrasesSeeder extends Seeder {
    
    public function run() {
        
        DB::table('tr_phrases')->insert([
            'lang_id'=> 1,
            'phrase'=> 'WELCOME_TEXT',
            'translation'=> 'Welcome to NWICODE',
            'section'=> 'PAGE.LOGIN'
        ]);
        DB::table('tr_phrases')->insert([
            'lang_id'=> 2,
            'phrase'=> 'WELCOME_TEXT',
            'translation'=> 'Добро пожаловать в NWICODE',
            'section'=> 'PAGE.LOGIN'
        ]);

    }
}