<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\BuildQuery;
use App\Models\Application;
use App\Models\BuildQueryWWW;
use App\Http\Controllers\BuildController;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class BuildApplication extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'BuildApplication:Start';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Aplication builder, worked as cron every minute';

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
        logger("BuildApplication", ["STATUS"=> "CHECKING FOR APP BUILD"]);
        //if task already run - exit
		$runnded_applications_for_build = BuildQuery::where("run",1)->where("ended",0)->first();
		if ($runnded_applications_for_build) {

 			//return if exists
			return 0;
		} else {


			//get first and start
			$application_to_build = BuildQuery::where("run",0)->where("ended",0)->first();


			//$application_to_build->run = true;
			//$application_to_build->save();

			if ($application_to_build) {

                $now_generating_www = BuildQueryWWW::where("app_id",$application_to_build->app_id)->where("run",1)->where("ended",0)->first();

                //if now processed genmeration WWW bundle - return
                if ($now_generating_www) {
                    return 0;
                }

				//create file queue
				file_put_contents(base_path() . DIRECTORY_SEPARATOR . 'builder' . DIRECTORY_SEPARATOR . 'queue.json',json_encode($application_to_build->toArray()));
				
				//Storage::disk('local')->put( 'builder' . DIRECTORY_SEPARATOR . 'queue.json', json_encode($application_to_build->toArray()));
				ob_start();
				try {

					// rung APK generation
					if ($application_to_build->type=="android_apk") {
						BuildController::BuildAndroidAPK($application_to_build);
						$application_to_build->ended = true;
						$application_to_build->run = false;
						$application_to_build->save();						
					}

					//run source generation
					if ($application_to_build->type=="android_sources") {
						BuildController::BuildAndroidSources($application_to_build);
						$application_to_build->ended = true;
						$application_to_build->run = false;
						$application_to_build->save();						
					}

					//run ios source generation
					if ($application_to_build->type=="ios_sources") {
						BuildController::BuildIOSSources($application_to_build);
						$application_to_build->ended = true;
						$application_to_build->run = false;
						$application_to_build->save();						
					}

					//run ios source generation
					if ($application_to_build->type=="www") {
						BuildController::FirstBuldWWW($application_to_build);
						$application_to_build->ended = true;
						$application_to_build->run = false;
						$application_to_build->save();						
					}
                }
				catch (\Exception $e) {
					$application_to_build->status = false;
					$application_to_build->ended = true;
					$application_to_build->run = false;
					$application_to_build->save();
					$log = ob_get_contents();
				}
				$log = ob_get_contents();
				ob_end_clean();
				
				//store log to dir
				$app = Application::where("id",$application_to_build->app_id)->first();
				$app_dir = public_path() . DIRECTORY_SEPARATOR . 'storage'. DIRECTORY_SEPARATOR .'application' . DIRECTORY_SEPARATOR . $app->id . '-'.$app->unique_string_id . DIRECTORY_SEPARATOR;
				$app_dir_logs = public_path() . DIRECTORY_SEPARATOR . 'storage'. DIRECTORY_SEPARATOR .'application' . DIRECTORY_SEPARATOR . $app->id . '-'.$app->unique_string_id . DIRECTORY_SEPARATOR .'logs'. DIRECTORY_SEPARATOR;
				if (!File::exists($app_dir_logs)) File::makeDirectory($app_dir_logs);
				$filename=$application_to_build->id."-builder.log";
				$application_to_build->refresh();
				$application_to_build->report = $filename;
				$application_to_build->save();
				file_put_contents($app_dir_logs . $filename,$log);
				
				//check results
				if ($application_to_build->type=="www") {
					if (File::exists($app_dir . DIRECTORY_SEPARATOR . "sources" . DIRECTORY_SEPARATOR . "www" )) {
						$application_to_build->status = true;						
					} else {
						$application_to_build->status = false;
					}
					$application_to_build->save();
				}
				
				if ($application_to_build->type=="android_apk") {
					if ($application_to_build->file!="" && File::exists($app_dir . DIRECTORY_SEPARATOR . "generated-apk" . DIRECTORY_SEPARATOR . $application_to_build->file )) {
						$application_to_build->status = true;						
					} else {
						$application_to_build->status = false;
					}
					$application_to_build->save();
				}
				
				if ($application_to_build->type=="android_sources") {
					if ($application_to_build->file!="" && File::exists($app_dir . DIRECTORY_SEPARATOR . "generated-apk" . DIRECTORY_SEPARATOR . $application_to_build->file )) {
						$application_to_build->status = true;						
					} else {
						$application_to_build->status = false;
					}
					$application_to_build->save();
				}
				
				if ($application_to_build->type=="ios_sources") {
					if ($application_to_build->file!="" && File::exists($app_dir . DIRECTORY_SEPARATOR . "generated-apk" . DIRECTORY_SEPARATOR . $application_to_build->file )) {
						$application_to_build->status = true;						
					} else {
						$application_to_build->status = false;
					}
					$application_to_build->save();
				}				


			}


 			//return if exists
			return 0;
		}

		return 0;
    }
}
