<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConstructorSideMenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {




        DB::table('constructor_side_menus')->insert([
            'menu_id'=> 1,
            'title'=> 'CONSTRUCTOR.MENU.DASHBOARD',
            'svg'=> './assets/media/svg/icons/Design/Layers.svg',
            'icon'=> 'flaticon2-architecture-and-city',
            'page'=> '/dashboard',
            'translate'=> 'CONSTRUCTOR.MENU.DASHBOARD',
            'is_system'=> 1,
            'sort'=> 10,
        ]);

        /* System section */
        // header
        DB::table('constructor_side_menus')->insert([
            'menu_id'=> 2,
            'title'=> '',
            'svg'=> '.',
            'icon'=> '',
            'page'=> '',
            'section'=> 'CONSTRUCTOR.MENU.SYSTEM_SECTION',
            'translate'=> '',
            'is_system'=> 1,
            'sort'=> 20,
        ]);


        //Level 1 menu
        DB::table('constructor_side_menus')->insert([
            'menu_id'=> 3,
            'title'=> 'CONSTRUCTOR.MENU.PAGES',
            'svg'=> './assets/media/svg/icons/Layout/Layout-3d.svg',
            'icon'=> 'flaticon2-layers',
            'page'=> '/layouts',
            'translate'=> 'CONSTRUCTOR.MENU.PAGES',
            'is_system'=> 1,
            'submenu'=> 0,
            'sort'=> 30
        ]);

        //Level 1 menu
        DB::table('constructor_side_menus')->insert([
            'menu_id'=> 4,
            'title'=> 'CONSTRUCTOR.MENU.COLORS',
            'svg'=> './assets/media/svg/icons/Design/Color-profile.svg',
            'icon'=> 'flaticon2-pen',
            'page'=> '/colors',
            'translate'=> 'CONSTRUCTOR.MENU.COLORS',
            'is_system'=> 1,
            'submenu'=> 0,
            'sort'=> 30
        ]);

        //Level 1 menu
        DB::table('constructor_side_menus')->insert([
            'menu_id'=> 5,
            'title'=> 'CONSTRUCTOR.MENU.SETTINGS',
            'svg'=> './assets/media/svg/icons/Design/Rectangle.svg',
            'icon'=> 'flaticon2-photograph',
            'page'=> '/settings',
            'translate'=> 'CONSTRUCTOR.MENU.SETTINGS',
            'is_system'=> 1,
            'submenu'=> 0,
            'sort'=> 30
        ]);

        //Level 1 menu
        DB::table('constructor_side_menus')->insert([
            'menu_id'=> 30,
            'title'=> 'CONSTRUCTOR.MENU.APP_MENU',
            'svg'=> './assets/media/svg/icons/Layout/Layout-left-panel-1.svg',
            'icon'=> 'flaticon2-photograph',
            'page'=> '/application-menu',
            'translate'=> 'CONSTRUCTOR.MENU.APP_MENU',
            'is_system'=> 1,
            'submenu'=> 0,
            'sort'=> 31
        ]);

        //Level 1 menu
        DB::table('constructor_side_menus')->insert([
            'menu_id'=> 6,
            'title'=> 'CONSTRUCTOR.MENU.BUILD',
            'svg'=> './assets/media/svg/icons/Home/Stairs.svg',
            'icon'=> 'flaticon2-photograph',
            'page'=> '/build',
            'translate'=> 'CONSTRUCTOR.MENU.BUILD',
            'is_system'=> 1,
            'submenu'=> 0,
            'sort'=> 35
        ]);





        DB::table('constructor_side_menus')->insert([
            'menu_id'=> 10,
            'title'=> '',
            'svg'=> '.',
            'icon'=> '',
            'page'=> '',
            'section'=> 'CONSTRUCTOR.MENU.LANGUAGE_SECTION',
            'translate'=> '',
            'is_system'=> 1,
            'sort'=> 80,
        ]);

        DB::table('constructor_side_menus')->insert([
            'menu_id'=> 11,
            'title'=> 'CONSTRUCTOR.MENU.LANGUAGES',
            'svg'=> './assets/media/svg/icons/Text/Text.svg',
            'icon'=> 'flaticon2-sort-alphabetically',
            'page'=> '/languages',
            'translate'=> 'CONSTRUCTOR.MENU.LANGUAGES',
            'is_system'=> 1,
            'submenu'=> 0,
            'sort'=> 90
        ]);

        DB::table('constructor_side_menus')->insert([
            'menu_id'=> 12,
            'title'=> 'CONSTRUCTOR.MENU.TRANSLATIONS',
            'svg'=> './assets/media/svg/icons/General/Settings-1.svg',
            'icon'=> 'flaticon2-sort-alphabetically',
            'page'=> '/application-translations',
            'translate'=> 'CONSTRUCTOR.MENU.TRANSLATIONS',
            'is_system'=> 1,
            'submenu'=> 0,
            'sort'=> 100
        ]);

        DB::table('constructor_side_menus')->insert([
            'menu_id'=> 13,
            'title'=> '',
            'svg'=> '.',
            'icon'=> '',
            'page'=> '',
            'section'=> 'CONSTRUCTOR.MENU.COTENT_SECTION',
            'translate'=> '',
            'is_system'=> 1,
            'sort'=> 110,
        ]);

        DB::table('constructor_side_menus')->insert([
            'menu_id'=> 14,
            'title'=> 'CONSTRUCTOR.MENU.CONTENT_TYPE_LIST',
            'svg'=> './assets/media/svg/icons/Text/Bullet-list.svg',
            'icon'=> 'flaticon2-sort-alphabetically',
            'page'=> '/content-type-list',
            'translate'=> 'CONSTRUCTOR.MENU.CONTENT_TYPE_LIST',
            'is_system'=> 1,
            'submenu'=> 0,
            'sort'=> 120
        ]);

        DB::table('constructor_side_menus')->insert([
            'menu_id'=> 18,
            'title'=> 'CONSTRUCTOR.MENU.ADD_NEW_CONTENT',
            'svg'=> './assets/media/svg/icons/Navigation/Plus.svg',
            'icon'=> 'flaticon2-sort-alphabetically',
            'page'=> '/create-content-type',
            'translate'=> 'CONSTRUCTOR.MENU.ADD_NEW_CONTENT',
            'is_system'=> 1,
            'submenu'=> 0,
            'sort'=> 160
        ]);

        DB::table('constructor_side_menus')->insert([
            'menu_id'=> 19,
            'title'=> '',
            'svg'=> '.',
            'icon'=> '',
            'page'=> '',
            'section'=> 'CONSTRUCTOR.MENU.MONETIZATION_SECTION',
            'translate'=> '',
            'is_system'=> 1,
            'sort'=> 170,
        ]);


        DB::table('constructor_side_menus')->insert([
            'menu_id'=> 20,
            'title'=> 'CONSTRUCTOR.MENU.SPCONTENT',
            'svg'=> './assets/media/svg/icons/Shopping/Money.svg',
            'icon'=> 'flaticon-coins',
            'page'=> '/spcontent',
            'translate'=> 'CONSTRUCTOR.MENU.SPCONTENT',
            'is_system'=> 1,
            'submenu'=> 0,
            'sort'=> 180
        ]);


        DB::table('constructor_side_menus')->insert([
            'menu_id'=> 21,
            'title'=> 'CONSTRUCTOR.MENU.ADMOB',
            'svg'=> './assets/media/svg/icons/General/Smile.svg',
            'icon'=> 'flaticon-coins',
            'page'=> '/admob-settings',
            'translate'=> 'CONSTRUCTOR.MENU.ADMOB',
            'is_system'=> 1,
            'submenu'=> 0,
            'sort'=> 190
        ]);


        DB::table('constructor_side_menus')->insert([
            'menu_id'=> 22,
            'title'=> 'CONSTRUCTOR.MENU.SERVICES_API',
            'svg'=> './assets/media/svg/icons/Code/Puzzle.svg',
            'icon'=> 'flaticon-coins',
            'page'=> '/',
            'translate'=> 'CONSTRUCTOR.MENU.SERVICES_API',
            'is_system'=> 1,
            'submenu'=> 1,
            'sort'=> 32
        ]);

        DB::table('constructor_side_menus')->insert([
            'menu_id'=> 23,
            'title'=> 'CONSTRUCTOR.MENU.ONESIGNAL_SETTINGS',
            'svg'=> '',
            'icon'=> '',
            'page'=> '/onesignal',
            'translate'=> 'CONSTRUCTOR.MENU.ONESIGNAL_SETTINGS',
            'is_system'=> 1,
            'parent_id'=> 22,
            'sort'=> 10
        ]);

        DB::table('constructor_side_menus')->insert([
            'menu_id'=> 24,
            'title'=> 'CONSTRUCTOR.MENU.FIREBASE_SETTINGS',
            'svg'=> '',
            'icon'=> '',
            'page'=> '/firebase-settings',
            'translate'=> 'CONSTRUCTOR.MENU.FIREBASE_SETTINGS',
            'is_system'=> 1,
            'parent_id'=> 22,
            'sort'=> 20
        ]);

        DB::table('constructor_side_menus')->insert([
            'menu_id'=> 28,
            'title'=> 'CONSTRUCTOR.MENU.MIXPANEL_SETTINGS',
            'svg'=> '',
            'icon'=> '',
            'page'=> '/mixpanel',
            'translate'=> 'CONSTRUCTOR.MENU.MIXPANEL_SETTINGS',
            'is_system'=> 1,
            'parent_id'=> 22,
            'sort'=> 30
        ]);

        DB::table('constructor_side_menus')->insert([
            'menu_id'=> 25,
            'title'=> 'CONSTRUCTOR.MENU.ADVANCED_SETTINGS',
            'svg'=> './assets/media/svg/icons/Code/Settings4.svg',
            'icon'=> 'flaticon-coins',
            'page'=> '/',
            'translate'=> 'CONSTRUCTOR.MENU.ADVANCED_SETTINGS',
            'is_system'=> 1,
            'submenu'=> 1,
            'sort'=> 31
        ]);

        DB::table('constructor_side_menus')->insert([
            'menu_id'=> 26,
            'title'=> 'CONSTRUCTOR.MENU.EDITOR_CSS',
            'svg'=> '',
            'icon'=> '',
            'page'=> '/editor-css',
            'translate'=> 'CONSTRUCTOR.MENU.EDITOR_CSS',
            'is_system'=> 1,
            'parent_id'=> 25,
            'sort'=> 10
        ]);

        DB::table('constructor_side_menus')->insert([
            'menu_id'=> 27,
            'title'=> 'CONSTRUCTOR.MENU.CUSTOM_START_ANIMATION',
            'svg'=> '',
            'icon'=> '',
            'page'=> '/custom-start-animation',
            'translate'=> 'CONSTRUCTOR.MENU.CUSTOM_START_ANIMATION',
            'is_system'=> 1,
            'parent_id'=> 25,
            'sort'=> 10
        ]);

        DB::table('constructor_side_menus')->insert([
            'menu_id'=> 29,
            'title'=> 'CONSTRUCTOR.MENU.CUSTOM_CODE',
            'svg'=> '',
            'icon'=> '',
            'page'=> '/custom-code',
            'translate'=> 'CONSTRUCTOR.MENU.CUSTOM_CODE',
            'is_system'=> 1,
            'parent_id'=> 25,
            'sort'=> 10
        ]);


        //Level 1 menu
        DB::table('constructor_side_menus')->insert([
            'menu_id'=> 31,
            'title'=> 'CONSTRUCTOR.PUSH_MESSAGES.SECTION_HEADER',
            'svg'=> './assets/media/svg/icons/Home/Stairs.svg',
            'icon'=> 'flaticon2-photograph',
            'page'=> '/push-messages',
            'translate'=> 'CONSTRUCTOR.PUSH_MESSAGES.SECTION_HEADER',
            'is_system'=> 1,
            'submenu'=> 0,
            'sort'=> 36
        ]);


        //Level 1 menu
        DB::table('constructor_side_menus')->insert([
            'menu_id'=> 32,
            'title'=> 'PAGE.USERS.TITLE',
            'svg'=> './assets/media/svg/icons/General/User.svg',
            'icon'=> 'flaticon2-group',
            'page'=> '/users',
            'translate'=> 'PAGE.USERS.TITLE',
            'is_system'=> 1,
            'submenu'=> 0,
            'sort'=> 37
        ]);

        DB::table('constructor_side_menus')->insert([
            'menu_id'=> 33,
            'title'=> 'CONSTRUCTOR.MENU.COLLECTIONS',
            'svg'=> './assets/media/svg/icons/Text/Bullet-list.svg',
            'icon'=> '',
            'page'=> '/collections/collection-list',
            'translate'=> 'CONSTRUCTOR.MENU.COLLECTIONS',
            'is_system'=> 1,
            'sort'=> 165
        ]);       
    }
}
