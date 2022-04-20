<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SystemSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FillSystemSettings extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $settings = array(
            'system_email' => 'no-reply@somehost.com',
            'system_owner' => 'App Creator',
            'left_logo_img' => '/assets/images/left_image.png',
            'auth_color' => '#001E47',
            'logo_img' => '/assets/images/top_logo.png',
            'inner_logo' => '/assets/images/inner_logo.png',
            'spinner_logo' => '/assets/images/spinner_logo.png',
            'text_logo_color' => '#986923',
            'domain' => 'example.com',
            'default_currency' => 'USD',
            'default_avatar' => 'assets/images/predefined_avatars/avatar-nw (6).png',
            'smtp_host' => '',
            'smtp_port' => '',
            'smtp_user' => '',
            'smtp_password' => '',
            'google_web_client_id' => '306825626028-9i6uudbl22i7oo68lpnvv0cvl1jlis1t.apps.googleusercontent.com'
        );

        DB::table('system_settings')->insert($settings);
    }
}
