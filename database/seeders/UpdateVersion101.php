<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UpdateVersion101 extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        // Insert some stuff
        DB::table('system_settings')->update(
            array(
                'version' => "1.0.1"
            )
        );         


        //Add menu to left admin menu
        /*$menu = DB::table('side_menus');
        $max_menu_id = (int)$menu->max('menu_id');
        $max_menu_id++;
        DB::table('side_menus')->insert([
            'menu_id'=> $max_menu_id,
            'title'=> 'MENU.SETUP_BUILD',
            'svg'=> './assets/media/svg/icons/Communication/Mail.svg',
            'icon'=> 'flaticon2-mail',
            'page'=> '/settings-sdk',
            'translate'=> 'MENU.SETUP_BUILD',
            'is_system'=> 1,
            'parent_id'=> 8,
            'sort'=> 31,
        ]);*/




    }
}
