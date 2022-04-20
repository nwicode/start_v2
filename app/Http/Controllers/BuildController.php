<?php
/**
 * Build application conotroller
 */
namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Validator;
use Illuminate\Http\Request;
use App\Models\Application;
use App\Models\Colors;
use App\Models\BuildQuery;
use App\Models\BuildQueryWWW;
use App\Models\Application_Languages;
use App\Models\Application_IAP;
use App\Models\Application_IAP_Description;
use App\Models\InAppPurchase;
use App\Models\StartPageAnimation;
use App\Models\Application_Page;
use App\Models\ApplicationStartAnimation;
use App\Models\Builder;
use App\Http\Controllers\SdkController;

class BuildController extends Controller
{
    //

	protected $logs;	//array for log item


	function getQueue(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'app_id' => 'required',
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = $error_message;
        } else {

            $app = Application::find($request['app_id']);
            if (Application::userHasAccess($request['app_id'])) {

				$app_dir = public_path() . '/storage/application/' . $app->id . '-'.$app->unique_string_id.'/';
				$app_dir_web = 'storage/application/' . $app->id . '-'.$app->unique_string_id.'/';

				//get build history
				$queue = BuildQuery::where("app_id",$app->id)->orderByDesc('id')->get();


				$return = [];
				$return['has_building'] = false;
				$return['can_generate_apk'] = true;
				$return['can_generate_aab'] = true;
				$return['can_generate_android_sources'] = true;
				$return['can_generate_ipa'] = true;
				$return['can_generate_ios_sources'] = true;
				$return['can_generate_pwa'] = true;
				$return['can_generate_www'] = true;


                $return['www_link'] = "";
                $return['www_last_generation_date'] = "";
                if (file_exists(public_path() . '/storage/application/' . $app->id . '-'.$app->unique_string_id.'/sources/www/index.html')) {
                    $return['www_link'] = 'storage/application/' . $app->id . '-'.$app->unique_string_id.'/sources/www/index.html';
                    //last generation date
                }


				$return['queue'] = [];

				foreach($queue as $q) {
					$queue_item = $q;

					if ($queue_item->run || (!$queue_item->run && !$queue_item->ended)) $return['has_building'] = true;

					$queue_item['source_file']='';
					$queue_item['report_file']='';

					//file exists for android
					if (!empty($queue_item->file) && in_array($queue_item->type,['android_apk', 'android_aab','android_sources'])) {
						if (file_exists($app_dir . 'generated-apk/' . $queue_item->file)) $queue_item['source_file']=$app_dir_web . 'generated-apk/' . $queue_item->file;

					}

					//log exists
					if (!empty($queue_item->report)) {
						if (file_exists($app_dir . 'logs/' . $queue_item->report)) $queue_item['report_file']=$app_dir_web . 'logs/' . $queue_item->report;
					}

					//misc
					if ($queue_item->type=="android_apk") {

						if (!$queue_item->ended  ) $return['can_generate_apk'] = false;


						$queue_item['description'] = "GENERATE_ANDROID_APK";
						$return['queue'][]=$queue_item;

					} else if ($queue_item->type=="android_aab") {

						if (!$queue_item->ended ) $return['can_generate_aab'] = false;

						$queue_item['description'] = "GENERATE_ANDROID_AAB";
						$return['queue'][]=$queue_item;

					} else if ($queue_item->type=="android_sources") {

						if (!$queue_item->ended  ) $return['can_generate_android_sources'] = false;

						$queue_item['description'] = "GENERATE_ANDROID_SOURCES";
						$return['queue'][]=$queue_item;

					} else if ($queue_item->type=="www") {

						if (!$queue_item->ended  ) $return['can_generate_www'] = false;

						if ($queue_item->ended && $return['www_last_generation_date']=="" ) {
                            $return['www_last_generation_date'] = $queue_item->buld_end;
                        }

						$queue_item['description'] = "GENERATE_WWW";
						$return['queue'][]=$queue_item;

					} else if ($queue_item->type=="ios_sources") {

						if (!$queue_item->ended  ) $return['can_generate_www'] = false;

						$queue_item['description'] = "GENERATE_IOS_SOURCES";
						$return['queue'][]=$queue_item;

					}


				}

				if ($app->blocked || $app->disabled) {
					$return['can_generate_apk'] = false;
					$return['can_generate_aab'] = false;
					$return['can_generate_android_sources'] = false;
					$return['can_generate_ipa'] = false;
					$return['can_generate_ios_sources'] = false;
					$return['can_generate_pwa'] = false;
					$return['can_generate_www'] = false;
				}

				$response = response()->json($return);

			} else {

				$response = response()->json(['error' => 'NO_PERMISSION'], 403);
			}



        }
        return $response;
	}

    /**
     * Return build queue list.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|string
     */
    function getBuildQueueList(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'page' => 'required',
                'perPage' => 'required',
                'orderBy' => 'required',
                'orderDirection' => 'required',
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = $error_message;
        } else {
            $currentUser = auth()->user();
            if ($currentUser->user_type_id == 1) {

                $queryList = BuildQuery::join('applications', 'app_id', '=', 'applications.id')
                    ->join('users', 'user_id', '=', 'users.id')
                    ->select(['users.name as user_name', 'users.lastname as user_lastname', 'users.avatar as user_avatar',  'users.email as user_email', 'applications.name as app_name', 'applications.description as app_description', 'type','buld_start', 'buld_end', 'run', 'ended', 'build_queries.id', 'app_id', 'user_id', 'unique_string_id'])
                    ->offset(($request['page'] - 1) * $request['perPage'])
                    ->where("ended","=",0)
                    ->limit($request['perPage']);

                if ($request['orderBy'] == 'status') {
                    if ($request['orderDirection'] == 1) {
                        $queryList = $queryList->orderBy('run', $request['orderDirection'])
                            ->get();
                    } else {
                        $queryList = $queryList->orderBy('ended', $request['orderDirection'])
                            ->get();
                    }
                } else {
                    $queryList = $queryList->orderBy($request['orderBy'], $request['orderDirection'])
                        ->get();
                }

                $totalRecords = BuildQuery::where("ended","=",0)->count();

                $response = response()->json(['list' => $queryList, 'totalRecords' => $totalRecords]);

            } else {

                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }

        }
        return $response;
    }

    /**
     * Delete records from build queue.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|string
     */
    function deleteBuildQueue(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'delete_array' => 'required',
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = $error_message;
        } else {
            $currentUser = auth()->user();
            if ($currentUser->user_type_id == 1) {

                $delete_queue = $request['delete_array'];
                for ($i = 0; $i < count($delete_queue); $i++) {
                    $queue = BuildQuery::find($delete_queue[$i]);
                    $queue->delete();
                }

                $response = response()->json(['message' => 'DELETED']);

            } else {

                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }

        }
        return $response;
    }


    /**
     * get request to build android application
     */
    function buildAndroidRequest(Request $request) {
		ini_set('max_execution_time', 0);
        $validator = Validator::make(
            $request->all(),
            array(
                'app_id' => 'required',
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = $error_message;
        } else {

            $currentUser = auth()->user();
            $app = Application::find($request['app_id']);
            if (Application::userHasAccess($request['app_id'])) {

				//make start
				$query = (new BuildQuery())->addBuild($app, 'android_apk');
				$response = response()->json(['message' => 'APPLICATION_ADD_TO_BUILD_QUEUE']);
			} else {

				$response = response()->json(['error' => 'NO_PERMISSION'], 403);
			}



        }
        return $response;
    }

    /**
     * get request to build android source
     */
    function buildAndroidSrcRequest(Request $request) {
		ini_set('max_execution_time', 0);
        $validator = Validator::make(
            $request->all(),
            array(
                'app_id' => 'required',
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = $error_message;
        } else {

            $currentUser = auth()->user();
            $app = Application::find($request['app_id']);
            if (Application::userHasAccess($request['app_id'])) {

				//make start
				$query = (new BuildQuery())->addBuild($app, 'android_sources');
				$response = response()->json(['message' => 'APPLICATION_ADD_TO_BUILD_QUEUE']);
			} else {

				$response = response()->json(['error' => 'NO_PERMISSION'], 403);
			}



        }
        return $response;
    }

    /**
     * get request to build WWW
     */
    function buildWWWRequest(Request $request) {
		ini_set('max_execution_time', 0);
        $validator = Validator::make(
            $request->all(),
            array(
                'app_id' => 'required',
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = $error_message;
        } else {

            $currentUser = auth()->user();
            $app = Application::find($request['app_id']);
            if (Application::userHasAccess($request['app_id'])) {

				//make start
				$query = (new BuildQuery())->addBuild($app, 'www');
				$response = response()->json(['message' => 'APPLICATION_ADD_TO_BUILD_QUEUE']);
			} else {

				$response = response()->json(['error' => 'NO_PERMISSION'], 403);
			}



        }
        return $response;
    }

    /**
     * get request to build ios source
     */
    function buildIOSSrcRequest(Request $request) {
        ini_set('max_execution_time', 0);
        $validator = Validator::make(
            $request->all(),
            array(
                'app_id' => 'required',
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = $error_message;
        } else {

            $currentUser = auth()->user();
            $app = Application::find($request['app_id']);
            if (Application::userHasAccess($request['app_id'])) {

                //make start
                $query = (new BuildQuery())->addBuild($app, 'ios_sources');
                $response = response()->json(['message' => 'APPLICATION_ADD_TO_BUILD_QUEUE']);
            } else {

                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }



        }
        return $response;
    }


	/**
	* Copy application to source folder on applaiton create event
	*/
	static function FirstBuldWWW(BuildQuery $bq) {

        $app = Application::find($bq->app_id);
        $bq->run = 1;
        $bq->buld_start = now();
        $bq->save();

		$builder = new Builder();
		$builder->initApplication($app);
		$builder->_is_first_build = true;
		$builder->_remove_source_folder = true;
		$builder->_copy_full_template = true;
		$builder->_copy_resources = true;
		$builder->_generate_www = true;
		$builder->_remove_node_modules_folder = true;


		$log = $builder->run();

        $bq->run = 0;
        $bq->ended = 1;
        $bq->file = $builder->_apk_file;
        $bq->report = $bq->id . '-www.log';
        $bq->buld_end = now();
        $bq->save();

	}


	/**
	* Rebuild WWW
	*/
	static function RebuildWWW(BuildQuery $bq) {

        $app = Application::find($bq->app_id);
        $bq->run = 1;
        $bq->buld_start = now();
        $bq->save();

		$builder = new Builder();
		$builder->initApplication($app);
		$builder->_is_rebuild = true;
		$builder->_remove_source_folder = true;
		$builder->_copy_full_template = true;
		$builder->_copy_resources = true;
		$builder->_generate_www = true;
		$builder->_remove_node_modules_folder = true;

		$log = $builder->run();

        $bq->run = 0;
        $bq->ended = 1;
        $bq->file = $builder->_apk_file;
        $bq->report = $bq->id . '-www.log';
        $bq->buld_end = now();
        $bq->save();

	}

    static function BuildAndroidAPK(BuildQuery $bq) {
        $app = Application::find($bq->app_id);
        $bq->run = 1;
        $bq->buld_start = now();
        $bq->save();

        $builder = new Builder();
        $builder->initApplication($app);
        $builder->_set_path_environment = true;
        $builder->_remove_source_folder = true;
        $builder->_copy_full_template = true;
        $builder->_copy_resources = true;
        $builder->_install_ionic_capacitor = true;
        $builder->_build_ionic = true;
        $builder->_add_android_platform = true;
        $builder->_generate_splash_and_icons = true;
        $builder->_build_android_debug_apk = true;
        $builder->_copy_debug_apk_to_folder = true;
        $builder->_remove_android_folder = true;
        $builder->_remove_node_modules_folder = true;
        $builder->_capacitor_sync = true;


        $log = $builder->run();

        $bq->run = 0;
        $bq->ended = 1;
        $bq->file = $builder->_apk_file;
        $bq->report = $bq->id . '-debug.log';
        $bq->buld_end = now();
        $bq->save();

    }

    static function BuildAndroidSources(BuildQuery $bq) {
        $app = Application::find($bq->app_id);
        $bq->run = 1;
        $bq->buld_start = now();
        $bq->save();

	    $builder = new Builder();
        $builder->initApplication($app);
        $builder->_set_path_environment = true;
        $builder->_remove_source_folder = true;
        $builder->_copy_full_template = true;
        $builder->_copy_resources = true;
        $builder->_install_ionic_capacitor = true;
        $builder->_build_ionic = true;
        $builder->_add_android_platform = true;
        $builder->_generate_splash_and_icons = true;
        $builder->_make_zip_sources = true;
        $builder->_remove_android_folder = true;
        $builder->_remove_node_modules_folder = true;
		$builder->_capacitor_sync = true;

        $log = $builder->run();

        $bq->run = 0;
        $bq->ended = 1;
        $bq->file = $builder->_sources_file;
        $bq->report = $bq->id . '-debug.log';
        $bq->buld_end = now();
        $bq->save();
    }

    static function BuildIOSSources(BuildQuery $bq) {
        $app = Application::find($bq->app_id);
        $bq->run = 1;
        $bq->buld_start = now();
        $bq->save();

        $builder = new Builder();
        $builder->initApplication($app);
        $builder->_set_path_environment = true;
        $builder->_remove_source_folder = true;
        $builder->_copy_full_template = true;
        $builder->_copy_resources = true;
        $builder->_install_ionic_capacitor = true;
        $builder->_build_ionic = true;
        $builder->_capacitor_sync = true;
        $builder->_add_ios_platform = true;
        $builder->_generate_splash_and_icons_for_ios = true;
        $builder->_make_zip_ios_sources = true;
        $builder->_remove_ios_folder = true;
        $builder->_remove_node_modules_folder = true;


        $log = $builder->run();

        $bq->run = 0;
        $bq->ended = 1;
        //$bq->file = $apk_file;
        $bq->report = $bq->id . '-debug.log';
        $bq->buld_end = now();
        $bq->save();
    }

}
