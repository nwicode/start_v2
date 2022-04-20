<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SideMenusSeeder extends Seeder {

    public function run() {

        DB::table('side_menus')->insert([
            'menu_id'=> 1,
            'title'=> 'MENU.DASHBOARD',
            'svg'=> './assets/media/svg/icons/Design/Layers.svg',
            'icon'=> 'flaticon2-architecture-and-city',
            'page'=> '/dashboard',
            'translate'=> 'MENU.DASHBOARD',
            'is_system'=> 1,
            'sort'=> 10,
        ]);

        /* System section */
        // header
        DB::table('side_menus')->insert([
            'menu_id'=> 2,
            'title'=> '',
            'svg'=> '.',
            'icon'=> '',
            'page'=> '',
            'section'=> 'MENU.SYSTEM_SECTION',
            'translate'=> '',
            'is_system'=> 1,
            'sort'=> 20,
        ]);

        //Level 1 menu
        DB::table('side_menus')->insert([
            'menu_id'=> 3,
            'title'=> 'MENU.SYSTEM_SETTINGS',
            'svg'=> './assets/media/svg/icons/Devices/Server.svg',
            'icon'=> 'flaticon2-architecture-and-city',
            'page'=> '/dashboard',
            'translate'=> 'MENU.SYSTEM_SETTINGS',
            'is_system'=> 1,
            'submenu'=> 1,
            'sort'=> 30
        ]);


        DB::table('side_menus')->insert([
            'menu_id'=> 22,
            'title'=> 'MENU.APPS',
            'svg'=> './assets/media/svg/icons/Layout/Layout-grid.svg',
            'icon'=> 'flaticon-apps',
            'page'=> '/apps',
            'translate'=> 'MENU.APPS',
            'is_system'=> 1,
             'sort'=> 12,
        ]);

        DB::table('side_menus')->insert([
            'menu_id'=> 31,
            'title'=> 'MENU.NEWS',
            'svg'=> './assets/media/svg/icons/Communication/Chat6.svg',
            'icon'=> 'flaticon-apps',
            'page'=> '/news-admin',
            'translate'=> 'MENU.NEWS',
            'is_system'=> 1,
            'sort'=> 13,
        ]);


        
        //Level 1 submenu
        DB::table('side_menus')->insert([
            'menu_id'=> 4,
            'title'=> 'MENU.BRAND_AND_LOGO',
            'svg'=> '',
            'icon'=> '',
            'page'=> '/settings-assets',
            'translate'=> 'MENU.BRAND_AND_LOGO',
            'is_system'=> 1,
            'parent_id'=> 3,
            'sort'=> 40,
        ]);

        //Level 1 submenu
        DB::table('side_menus')->insert([
            'menu_id'=> 5,
            'title'=> 'MENU.DOMAIN',
            'svg'=> '',
            'icon'=> '',
            'page'=> '/settings-web',
            'translate'=> 'MENU.DOMAIN',
            'is_system'=> 1,
            'parent_id'=> 3,
            'sort'=> 50,
        ]);


        //Level 1 submenu
        DB::table('side_menus')->insert([
            'menu_id'=> 6,
            'title'=> 'MENU.META',
            'svg'=> '',
            'icon'=> '',
            'page'=> '/settings-meta',
            'translate'=> 'MENU.META',
            'is_system'=> 1,
            'parent_id'=> 3,
            'sort'=> 60,
        ]);


        //Level 1 submenu
        DB::table('side_menus')->insert([
            'menu_id'=> 7,
            'title'=> 'MENU.LAW_SETTINGS',
            'svg'=> '',
            'icon'=> '',
            'page'=> '/static-pages',
            'translate'=> 'MENU.LAW_SETTINGS',
            'is_system'=> 1,
            'parent_id'=> 3,
            'sort'=> 60,
        ]);


        //level 1 menu
        DB::table('side_menus')->insert([
            'menu_id'=> 8,
            'title'=> 'MENU.MAIL_SETTINGS',
            'svg'=> './assets/media/svg/icons/Communication/Mail.svg',
            'icon'=> 'flaticon2-mail',
            'page'=> '/dashboard',
            'translate'=> 'MENU.MAIL_SETTINGS',
            'is_system'=> 1,
            'submenu'=> 1,
            'sort'=> 30,
        ]);

        //level 1 menu
        DB::table('side_menus')->insert([
            'menu_id'=> 9,
            'title'=> 'MENU.SMTP',
            'svg'=> './assets/media/svg/icons/Communication/Mail.svg',
            'icon'=> 'flaticon2-mail',
            'page'=> '/settings-smtp',
            'translate'=> 'MENU.SMTP',
            'is_system'=> 1,
            'parent_id'=> 8,
            'sort'=> 30,
        ]);


        //level 1 menu
        DB::table('side_menus')->insert([
            'menu_id'=> 11,
            'title'=> 'MENU.MAIL_TEMPLATES',
            'svg'=> '',
            'icon'=> '',
            'page'=> '/mail-templates',
            'translate'=> 'MENU.MAIL_TEMPLATES',
            'is_system'=> 1,
            'parent_id'=> 8,
            'sort'=> 30,
        ]);

        /* Languages section */
        // header
        DB::table('side_menus')->insert([
            'menu_id'=> 12,
            'title'=> '',
            'svg'=> '.',
            'icon'=> '',
            'page'=> '',
            'section'=> 'MENU.LOCALIZATION_SECTION',
            'translate'=> '',
            'is_system'=> 1,
            'sort'=> 40,
        ]);

        DB::table('side_menus')->insert([
            'menu_id'=> 13,
            'title'=> 'MENU.LANGUAGES',
            'svg'=> './assets/media/svg/icons/Communication/Flag.svg',
            'icon'=> 'flaticon2-world',
            'page'=> '/languages/default',
            'translate'=> 'MENU.LANGUAGES',
            'is_system'=> 1,
            'sort'=> 50,
        ]);

        DB::table('side_menus')->insert([
            'menu_id'=> 14,
            'title'=> 'MENU.TRANSLATIONS',
            'svg'=> './assets/media/svg/icons/Communication/Archive.svg',
            'icon'=> 'flaticon2-edit',
            'page'=> '/translations',
            'translate'=> 'MENU.TRANSLATIONS',
            'is_system'=> 1,
            'sort'=> 60,
        ]);

        /* Finance */
        // header
        DB::table('side_menus')->insert([
            'menu_id'=> 15,
            'title'=> '',
            'svg'=> '.',
            'icon'=> '',
            'page'=> '',
            'section'=> 'MENU.FINANCE',
            'translate'=> '',
            'is_system'=> 1,
            'sort'=> 70,
        ]);

        DB::table('side_menus')->insert([
            'menu_id'=> 16,
            'title'=> 'MENU.CURRENCIES',
            'svg'=> './assets/media/svg/icons/Shopping/Money.svg',
            'icon'=> 'flaticon2-list-1',
            'page'=> '/currency',
            'translate'=> 'MENU.CURRENCIES',
            'is_system'=> 1,
            'sort'=> 80,
        ]);




        DB::table('side_menus')->insert([
            'menu_id'=> 25,
            'title'=> 'MENU.ACTIVITY_LOG',
            'svg'=> '',
            'icon'=> '',
            'page'=> '/activity-log',
            'translate'=> 'MENU.ACTIVITY_LOG',
            'is_system'=> 1,
            'parent_id'=> 24,
            'sort'=> 120,
        ]);

        DB::table('side_menus')->insert([
            'menu_id'=> 32,
            'title'=> 'MENU.MARKETPLACE',
            'svg'=> './assets/media/svg/icons/Shopping/Box2.svg',
            'icon'=> 'flaticon-apps',
            'page'=> '/marketplace',
            'translate'=> 'MENU.MARKETPLACE',
            'is_system'=> 1,
            'sort'=> 13,
        ]);
    }
}
