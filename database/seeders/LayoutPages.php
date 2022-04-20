<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LayoutPages extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //

    
        DB::table('layout_pages')->insert([
            'page_name'=> 'CONSTRUCTOR.LAYOUTS_COMPONENT_SIDE.PAGE_BLANK',
            'image'=> '../../../../assets/images/layouts/pages/blank.svg',
            'page_type'=> 'blank',
            'disabled'=> 0,

        ]);        
    }
}
