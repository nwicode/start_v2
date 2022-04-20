<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with all seeders
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();

        $this->call(AddUserTypes::class);
        $this->call(AddAdmin::class);
        //$this->call(AddFakeUsers::class);
        $this->call(LanguagesSeeder::class);
        $this->call(TrPhrasesSeeder::class);
        $this->call(StaticPagesSeeder::class);
        $this->call(ActivityLogSeeder::class);
        $this->call(FillSystemSettings::class);
        $this->call(CountrySeeder::class);
        $this->call(SideMenusSeeder::class);
        $this->call(InAppPurchaseSeeder::class);
        $this->call(ConstructorSideMenuSeeder::class);
        $this->call(LayoutPages::class);
        $this->call(StartPageAnimationSeeder::class);
        $this->call(UpdateVersion100::class);
        $this->call(UpdateVersion101::class);
        $this->call(UpdateVersion102::class);
        $this->call(UpdateVersion103::class);
        $this->call(UpdateVersion104::class);
        $this->call(UpdateVersion105::class);
        $this->call(UpdateVersion106::class);
    }
}
