<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AddFakeNotifications extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //Fake Nnotifications for customer
        DB::table('notifications')->insert([
            'user_id' => '2',
            'title' => '1. New Pays',
            'message' => 'Hi Frend, there are new payments in your platform',
            'icon' => 'assets/media/svg/icons/Shopping/Money.svg',
            'type' => 'ALERT',
            'read' => false,
        ]);
        DB::table('notifications')->insert([
            'user_id' => '2',
            'title' => '2. New user',
            'message' => 'Hello Friend! a new user has registered on your platform',
            'icon' => 'assets/media/svg/icons/Shopping/Money.svg',
            'type' => 'EVENT',
            'read' => false,
        ]);
        DB::table('notifications')->insert([
            'user_id' => '2',
            'title' => '3. New Pays',
            'message' => 'Hi Frend, 2 new applications have been created on your platform',
            'icon' => 'assets/media/svg/icons/Shopping/Money.svg',
            'type' => 'LOG',
            'read' => true,
        ]);
        DB::table('notifications')->insert([
            'user_id' => '2',
            'title' => '4. New App create',
            'message' => 'Hello Friend! a new user has registered on your platform',
            'icon' => 'assets/media/svg/icons/Shopping/Money.svg',
            'type' => 'EVENT',
            'read' => false,
        ]);
        DB::table('notifications')->insert([
            'user_id' => '2',
            'title' => '5. App is delete',
            'message' => 'Hi Frend, 2 new applications have been created on your platform',
            'icon' => 'assets/media/svg/icons/Shopping/Money.svg',
            'type' => 'LOG',
            'read' => true,
        ]);


        //Fake Nnotifications for manager
        DB::table('notifications')->insert([
            'user_id' => '3',
            'title' => '6. New Pays',
            'message' => 'Hi Frend, there are new payments in your platform',
            'icon' => 'assets/media/svg/icons/Shopping/Money.svg',
            'type' => 'ALERT',
            'read' => false,
        ]);
        DB::table('notifications')->insert([
            'user_id' => '3',
            'title' => '7. New user',
            'message' => 'Hello Friend! a new user has registered on your platform',
            'icon' => 'assets/media/svg/icons/Shopping/Money.svg',
            'type' => 'EVENT',
            'read' => true,
        ]);
        DB::table('notifications')->insert([
            'user_id' => '3',
            'title' => '8. New Pays',
            'message' => 'Hi Frend, 2 new applications have been created on your platform',
            'icon' => 'assets/media/svg/icons/Shopping/Money.svg',
            'type' => 'LOG',
            'read' => false,
        ]);
        DB::table('notifications')->insert([
            'user_id' => '3',
            'title' => '9. New App create',
            'message' => 'Hello Friend! a new user has registered on your platform',
            'icon' => 'assets/media/svg/icons/Shopping/Money.svg',
            'type' => 'EVENT',
            'read' => true,
        ]);
        DB::table('notifications')->insert([
            'user_id' => '3',
            'title' => '10. App is delete',
            'message' => 'Hi Frend, 2 new applications have been created on your platform',
            'icon' => 'assets/media/svg/icons/Shopping/Money.svg',
            'type' => 'LOG',
            'read' => false,
        ]);


        //Fake Nnotifications for admin
        DB::table('notifications')->insert([
            'user_id' => '1',
            'title' => '11. New Pays',
            'message' => 'Hi Frend, there are new payments in your platform',
            'icon' => 'assets/media/svg/icons/Shopping/Money.svg',
            'type' => 'ALERT',
            'read' => false,
        ]);
        DB::table('notifications')->insert([
            'user_id' => '1',
            'title' => '12. New user',
            'message' => 'Hello Friend! a new user has registered on your platform',
            'icon' => 'assets/media/svg/icons/Shopping/Money.svg',
            'type' => 'EVENT',
            'read' => true,
        ]);
        DB::table('notifications')->insert([
            'user_id' => '1',
            'title' => '13. New Pays',
            'message' => 'Hi Frend, 2 new applications have been created on your platform',
            'icon' => 'assets/media/svg/icons/Shopping/Money.svg',
            'type' => 'LOG',
            'read' => false,
        ]);
        DB::table('notifications')->insert([
            'user_id' => '1',
            'title' => '14. New App create',
            'message' => 'Hello Friend! a new user has registered on your platform',
            'icon' => 'assets/media/svg/icons/Shopping/Money.svg',
            'type' => 'EVENT',
            'read' => false,
        ]);
        DB::table('notifications')->insert([
            'user_id' => '1',
            'title' => '15. App is delete',
            'message' => 'Hi Frend, 2 new applications have been created on your platform',
            'icon' => 'assets/media/svg/icons/Shopping/Money.svg',
            'type' => 'LOG',
            'read' => true,
        ]);
    }
}
