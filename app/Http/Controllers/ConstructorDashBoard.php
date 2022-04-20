<?php
/**
 * Create dashboard information for user constructor pages
 */
namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Validator;
use Illuminate\Http\Request;
use App\Models\Application;
use App\Models\Colors;
use App\Models\News;
use App\Models\Application_Languages;
use App\Models\Application_IAP;
use App\Models\Application_IAP_Description;
use App\Models\InAppPurchase;
use Illuminate\Support\Str;

class ConstructorDashBoard extends Controller
{

    /**
     * Generate dashboard data for constructor
     * @param Request $request
     * @return JsonResponse
     */
    function dashboard(Request $request) {
        $dashboard = [];

        $validator = Validator::make(
            $request->all(),
            array(
                'id' => 'required',
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            if (Application::userHasAccess($request['id'])) {

                //fake data
                $dashboard['demo'] = true;
                $dashboard['customers'] = [
                    "total"=>245,
                    "today"=>14,
                    "ios"=> 65,
                    "android"=> 35,
                ];



                $dashboard['tariff'] = [
                    "name" => "Start",
                    "disk_size" => "200MB",
                    "disk_size_use" => "40MB",
                    "disk_percent" => "20",
                ];

                /*$dashboard['news'] = [
                    [
                        "title"=>"New version 1.0.5 released",
                        "date"=>date("Y-m-d"),
                        "color"=>"bg-success",
                        "text"=>"A new version of our platform has been released",
                    ],
                    [
                        "title"=>"Preventive work on the server",
                        "date"=>date("Y-m-d"),
                        "color"=>"bg-warning",
                        "text"=>"maintenance work on the server from 15:00 to 17:00.",
                    ],
                    [
                        "title"=>"Team weekly summary",
                        "date"=>date("Y-m-d"),
                        "color"=>"bg-primary",
                        "text"=>"The results of our team's work for the previous week",
                    ],
                    [
                        "title"=>"Mode of operation in lockdown",
                        "date"=>date("Y-m-d"),
                        "color"=>"bg-primary",
                        "text"=>"We work as usual :)",
                    ],
                ];*/

                $news = News::where("is_active",true)->orderBy('item_date','desc')->limit(5)->get();
                foreach($news as $news_item) {
                    $description = $news_item->description;
                    if ($description && Str::length($description)>30) $description = Str::of($news_item->description)->limit(30, ' ...');
                    $dashboard['news'][] = [

                        "title"=>$news_item->title,
                        "date"=>$news_item->item_date,
                        "item_url"=>$news_item->item_url,
                        "color"=>"bg-success",
                        "text"=>$description,                        

                    ];
                }

                $dashboard['installations'] = [
                    "X" =>[],
                    "Y" => []
                ];

                $d = array();
                for($i = 30; $i >0; $i--) $dashboard['installations']['X'][] = date("j M", strtotime('-'. $i .' days'));
                for($i = 30; $i >0; $i--) $dashboard['installations']['Y'][] = rand(0, 50);
                for($i = 30; $i >0; $i--) $dashboard['installations']['Y'][] = rand(0, 50);


                $response = response()->json($dashboard);
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }

        return $response;
    }
}
