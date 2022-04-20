<?php
/**
 * Controller for displaying dashboard information
 */
namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\DB;
use Validator;
use Illuminate\Http\Request;
use App\Models\Application;
use App\Models\User;
use App\Models\Colors;
use App\Models\Application_Languages;
use App\Models\BuildQuery;
use App\Models\SystemSettings;
use App\Models\Application_IAP;
use App\Models\Application_IAP_Description;
use App\Models\InAppPurchase;
use Carbon\Carbon;
use App\Http\Controllers\SystemController;
use App\Http\Controllers\LanguagesController;

class DashboardController extends Controller
{
    


    /**
     * Get admin dashboard info
     */
    function getAdminDashboard(Request $request) {
        $currentUser = auth()->user();
        if ($currentUser['user_type_id'] === 1) {

            $dashboard=[];

            //Check, mb need generate system_jsettings.josn;
            $system_settings = SystemSettings::first();
            $need_generate_settings_json = $system_settings->need_settings_build;
            $dashboard['need_generate_settings_json'] = $need_generate_settings_json;

            //Check, mb need generate system_jsettings.josn;
            $system_settings = SystemSettings::first();
            $need_generate_settings_json = $system_settings->need_settings_build;
            $dashboard['need_generate_settings_json'] = $need_generate_settings_json;

            if ($dashboard['need_generate_settings_json']) {

                //make settings
                $controller = new SystemController();
                $controller->makeSystemSettings($request);
                
                //create langs files
                $controller1 = new LanguagesController();
                $controller1->saveTranslations();                

                $system_settings->need_settings_build=false;
                $system_settings->save();
            }

            $dashboard['app_count'] = Application::all()->count();
            $dashboard['user_count'] = User::where("user_type_id",2)->count();
            $dashboard['blocked_users'] = User::where("user_type_id",2)->where("blocked",true)->count();
            $dashboard['user_count_today'] = User::where("user_type_id",2)->whereDate('created_at', today())->count();
            $dashboard['build_queue'] = BuildQuery::where("run",false)->where('ended', false)->count();

            //users by day
            $users_registrations_result = User::where("user_type_id",2)
                ->whereDate('created_at', '>=', \Carbon\Carbon::now()->subMonth())
                ->groupBy('date')
                ->orderBy('date', 'DESC')
                ->get(array(
                    DB::raw('Date(created_at) as date'),
                    DB::raw('COUNT(*) as "registrations"')
                ));

            $users_registrations = array();
            for($i = 0; $i <= 30; $i++) $users_registrations[date("Y-m-d", strtotime('-'. $i .' days'))] = ["registrations"=>0, "payed"=>0];

            $users_registrations_dates = array();
            $users_registrations_qty = array();
            $users_registrations_money = array();

            foreach($users_registrations_result as $item ) {

                if (isset($users_registrations[$item->date])) {
                    $users_registrations[$item->date]['registrations'] = $item->registrations;
                    if ($item->registrations>0) {
                        //$users_registrations[$item->date]['payed'] = random_int(25,450);
                        $users_registrations[$item->date]['payed'] = 0;
                    }
                }

                $users_registrations_dates[]=$item->date;
                if (isset($users_registrations[$item->date]['payed'])) $users_registrations_money[]=$users_registrations[$item->date]['payed']; else $users_registrations_money[]=0;
                if (isset($users_registrations[$item->date]['registrations'])) $users_registrations_qty[]=$users_registrations[$item->date]['registrations']; else $users_registrations_qty[]=0;

            }


            $dashboard['users_registrations'] = $users_registrations;
            $dashboard['last_30days_payed'] = 0;
            foreach($users_registrations as $item) $dashboard['last_30days_payed']+=$item['payed'];

            $dashboard['users_registrations_dates'] = $users_registrations_dates;
            $dashboard['users_registrations_money'] = $users_registrations_money;
            $dashboard['users_registrations_qty'] = $users_registrations_qty;

            $response = response()->json($dashboard);
        } else {
            $response = response()->json(['error' => 'NOT_ADMIN'], 403);
        }
        return $response;
    }
}
