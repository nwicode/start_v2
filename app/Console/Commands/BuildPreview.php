<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\BuildQuery;
use App\Models\BuildQueryWWW;
use App\Models\Application;
use App\Http\Controllers\BuildController;

class BuildPreview extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'BuildApplication:WWW';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Aplication preview builder, worked as cron every seconds';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        //need first build
		$build_now_count = Application::where("build_now",1)->count();

		if ($build_now_count>5) return 0;

		$app_to_generate = Application::where("build_now",0)->where("need_first_build",1)->first();
		if ($app_to_generate) {
			//BuildController::FirstBuldWWW($app_to_generate);
			return 0;
		}

		$app_to_regenerate = Application::where("build_now",0)->where("request_www_build",1)->first();
		if ($app_to_regenerate) {
			//BuildController::RebuildWWW($app_to_regenerate);
			return 0;
		}
		
		
		//if task already run - exit
/*		$runnded_applications_for_build = BuildQueryWWW::where("run",1)->where("ended",0)->first();
		if ($runnded_applications_for_build) {
			
 			//return if exists
			return 0;
		} else {

			
			//get first and start
			$application_to_build = BuildQueryWWW::where("run",0)->where("ended",0)->first();
			//$application_to_build->run = true;
			//$application_to_build->save();
			
			if ($application_to_build) {

                
                //if now processed genmeration WWW bundle - return
                $now_generating_www = BuildQuery::where("app_id",$application_to_build->app_id)->where("run",1)->where("ended",0)->first();
                if ($now_generating_www) {
                    return 0;
                }                

                // run first WWW generate
				if ($application_to_build->type=="first_www") {
					BuildController::FirstBuldWWW($application_to_build);
				}
				
                //run rebuild WWW bunlde
				if ($application_to_build->type=="www") {
					BuildController::RebuildWWW($application_to_build);
				}
				
			}
			
			
 			//return if exists
			return 0;
		}
		
		return 0;*/
    }
}
