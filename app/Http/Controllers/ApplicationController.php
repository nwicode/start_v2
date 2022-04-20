<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\ApplicationContent;
use App\Models\ApplicationContentType;
use App\Models\ApplicationStartAnimation;
use App\Models\StaticPages;
use App\Models\Template;
use App\Models\User;
use App\Models\Topic;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Validator;
use Illuminate\Http\Request;
use App\Models\Application;
use App\Models\Colors;
use App\Models\Components;
use App\Models\Application_Languages;
use App\Models\Application_Page;
use App\Models\BuildQueryWWW;
use App\Models\ApplicationTranslations;
use App\Models\ApplicationMenu;
use App\Models\Application_IAP;
use App\Models\Application_IAP_Description;
use App\Models\InAppPurchase;
use ZipArchive;

class ApplicationController extends Controller
{


    /**
     * Set application translations
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|string
     */
    function setApplicationTranlsation(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'id' => 'required',
                'translations' => 'required',
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = $error_message;
        } else {
            $app = Application::find($request['id']);
            if (Application::userHasAccess($request['id'])) {

                $json = [];
                $additional_translations = ApplicationTranslations::where('app_id', $request['id'])->first();
                foreach ($request->translations as $translation) {
                    $json[$translation['language']] = $translation['items'];
                }
                if (!empty($additional_translations)) {
                    $additional_translations->translations = json_encode($json);
                    $additional_translations->save();

                } else {
                    $additional_translations = new ApplicationTranslations();
                    $additional_translations->translations = json_encode($json);
                    $additional_translations->app_id = $app->id;
                    $additional_translations->save();
                }
                $response = response()->json($json);
            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }

        }
        return $response;
    }

    /**
     * Get application translations
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|string
     */
    function getApplicationTranlsation(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'id' => 'required',
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = $error_message;
        } else {
            $app = Application::find($request['id']);
            if (Application::userHasAccess($request['id'])) {

                $translations = $app->getTranslations();
                foreach ($translations as $tr_code => $tr_values) {
                    $settings[] = ["language" => $tr_code, 'items' => $tr_values];
                }
                $response = response()->json($settings);
            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }

        }
        return $response;
    }

   /**
     * Get application left side menu
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|string
     */
    function getApplicationMenu(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'id' => 'required',
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = $error_message;
        } else {
            $app = Application::find($request['id']);
            if (Application::userHasAccess($request['id'])) {

                $menu = $app->getMenu();
                $languages = new Application_Languages();
                $languages->setApplication($app);

                //actions
                $actions = [];
                $visibility_conditions = [];
                $actions_list = new Components;
                $constructor_avvc = $actions_list->getListActionsVariables($app->id);

                // get available actions from
                foreach($constructor_avvc['actions'] as $av) {
                    $actions[]=["text"=>"","target"=>$av['code'], "name"=>$av['description']];
                }
                foreach($constructor_avvc['visibility_conditions'] as $av) {
                    $visibility_conditions[]=$av;
                }

                $response = response()->json(
                    [
                        "menu"=>$menu,
                        "actions"=>$actions,
                        "visibility_conditions"=>$visibility_conditions,
                        'languages'=>$languages->getLanguages(),
                        'resources_dir'=>'storage/application/'.$app->id."-".$app->unique_string_id."/resources//",
                        "default_language"=>$app->default_language
                    ]
                );
            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }

        }
        return $response;
    }


    /**
     * set application left side menu
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|string
     */
    function setApplicationMenu(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'id' => 'required',
                'menu' => 'required',
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = $error_message;
        } else {
            $app = Application::find($request['id']);
            if (Application::userHasAccess($request['id'])) {
                $app->setMenu($request->menu);
                $response = response()->json(['message' => 'APPLICATION_UPDATED']);
            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }

        }
        return $response;
    }


    /**
     * Create new application.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|string
     */
    function application(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'icon' => 'required',
                'icon_background_color' => 'required',
                'name' => 'required',
                'description' => 'required'
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = $error_message;
        } else {
            $findDuplicate = DB::table('applications')
                ->where('name', $request->name)
                ->select('name')
                ->first();

            if (!$findDuplicate) {
                $spamWordsArray = ['БЕСПЛАТНО', ' ТОП ', 'БЕЗ РЕКЛАМЫ И РЕГИСТРАЦИИ', 'Тестовое', 'Первое'];
                $hasSpam = false;

                $nameLowerCase = strtolower($request->name);
                for ($i = 0; $i < count($spamWordsArray); $i++) {
                    if (strpos($nameLowerCase, $spamWordsArray[$i]) !== false) {
                        $hasSpam = true;
                        break;
                    }
                }

                if (!$hasSpam) {
                    $data = explode(',', $request->icon);
                    $binary = base64_decode($data[1]);
                    $iconSize = getimagesizefromstring($binary);

                    if ($iconSize && $iconSize[0] === 1024 && $iconSize[1] === 1024 && $iconSize[2] === 3) {
                        $app = new Application();
                        $is_created = $app->initApplication(auth()->id(), $request->name, $request->description, $request->icon, $request->icon_background_color);
                        if ($is_created) {
                            $log = new ActivityLog();
                            $log->setActivityLog(auth()->user()['id'], $app->id, 'CREATE_NEW_APP', $app);

                            $response = response()->json($app);
                        } else {
                            $response = response()->json(['error' => 'INCORRECT_DATA'], 406);
                        }
                    } else {
                        $response = response()->json(['error' => 'BAD_PNG'], 406);
                    }
                } else {
                    $response = response()->json(['error' => 'CONTAINS_SPAM_WORD_IN_NAME'], 406);
                }
            } else {
                $response = response()->json(['error' => 'DUPLICATE_NAME'], 406);
            }
        }
        return $response;
    }

    /**
     * Return current user applications.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    function getCurrentUserApplications()
    {
        $user_id = auth()->id();

        $query = DB::table('applications')
            ->where('user_id', $user_id)
            ->select('id', 'unique_string_id', 'name', 'description', 'blocked', 'disabled')
            ->get();
        $response = response()->json($query);

        return $response;
    }

    /**
     * Change application disabled field.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function changeDisabledApplication(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'id' => 'required',
                'disabled' => 'required'
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $currentUser = auth()->user();
            $app = Application::find($request['id']);
            if ($currentUser['user_type_id'] === 1 || ($currentUser['user_type_id'] === 2 && $app['user_id'] === $currentUser['id'])) {
                DB::table('applications')
                    ->where('id', $request['id'])
                    ->update(['disabled' => $request['disabled']]);

                $response = response()->json(['message' => 'APPLICATION_UPDATED']);
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }

        return $response;
    }

    /**
     * Change application disabled field.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function changeBlockedApplication(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'id' => 'required',
                'blocked' => 'required'
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $currentUser = auth()->user();
            $app = Application::find($request['id']);
            if ($currentUser['user_type_id'] === 1 || ($currentUser['user_type_id'] === 2 && $app['user_id'] === $currentUser['id'])) {
                DB::table('applications')
                    ->where('id', $request['id'])
                    ->update(['blocked' => $request['blocked']]);

                $response = response()->json(['message' => 'APPLICATION_UPDATED']);
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }

        return $response;
    }

    /**
     * Delete application by id.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function deleteApplication(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'id' => 'required'
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $currentUser = auth()->user();
            if ($currentUser['user_type_id'] === 1) {
                $app = Application::find($request['id']);

                if ($app) $app->deleteApplication();

                $response = response()->json(['message' => 'APPLICATION_DELETED']);
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }

        return $response;
    }

    /**
     * Update application icon.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function updateApplicationIcon(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'id' => 'required',
                'icon' => 'required',
                'icon_background_color' => 'required'
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $currentUser = auth()->user();
            $app = Application::find($request['id']);
            if (Application::userHasAccess($request['id'])) {
                $data = explode(',', $request->icon);
                $binary = base64_decode($data[1]);
                $iconSize = getimagesizefromstring($binary);

                if ($iconSize && $iconSize[0] === 1024 && $iconSize[1] === 1024 && $iconSize[2] === 3) {
                    $app->setApplicationIcon($request['icon']);
                    $app->icon_background_color = $request['icon_background_color'];
                    $app->save();
                    $response = response()->json(['message' => 'ICON_UPDATED']);
                } else {
                    $response = response()->json(['error' => 'BAD_PNG'], 406);
                }
            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }
        }

        return $response;
    }

    /**
     * Update application splash screen.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function updateApplicationSplashScreen(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'id' => 'required',
                'splash_screen' => 'required',
                'splashscreen_background_color' => 'required',
                'splashscreen_show_spinner' => 'required',
                'splashscreen_spinner_color' => 'required',
                'splashscreen_timeout' => 'required'
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $currentUser = auth()->user();
            $app = Application::find($request['id']);
            if (Application::userHasAccess($request['id'])) {
                $data = explode(',', $request->splash_screen);
                $binary = base64_decode($data[1]);
                $iconSize = getimagesizefromstring($binary);

                if ($iconSize && $iconSize[0] === 2732 && $iconSize[1] === 2732 && $iconSize[2] === 3) {
                    $app->setApplicationSplashScreen($request['splash_screen'], $request['splashscreen_background_color'], $request['splashscreen_show_spinner'], $request['splashscreen_spinner_color'], $request['splashscreen_timeout']);
                    $response = response()->json(['message' => 'SPLASH_SCREEN_UPDATED']);
                } else {
                    $response = response()->json(['error' => 'BAD_PNG'], 406);
                }
            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }
        }

        return $response;
    }

    /**
     * Return application with certain id.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getApplicationById(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'id' => 'required',
                'language' => 'required',
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $application = Application::find($request['id']);

            //Languages
            $languages = new Application_Languages();
            $languages->setApplication($application);


            //Get in_app_products title and description
            $in_app_products = $application->getInAppProducts();
            foreach ($in_app_products as $iap_index => $iap) {
                $in_app_products[$iap_index]['name'] = $in_app_products[$iap_index]['code'];
                $in_app_products[$iap_index]['description'] = $in_app_products[$iap_index]['code'];

                //Set default name and description for iap products
                if (isset($iap['languages'][$request['language']])) {
                    $in_app_products[$iap_index]['name'] = $iap['languages'][$request['language']]['name'];
                    $in_app_products[$iap_index]['description'] = $iap['languages'][$request['language']]['description'];
                } else {
                    //if not found language - get first language for use as default
                    // add later
                }
            }

            //Add fields to base model
            $colors = $application->getColorsArray();

            $application['colors'] = $colors;
            $application['languages'] = $languages->getLanguages();
            $application['in_app_products'] = $in_app_products;
            $application['in_app_types'] = InAppPurchase::where("disabled", 0)->get();

            //get build data
            //$current_query = BuildQueryWWW::where("app_id",$application->id)->where("run",1)->where("ended",0)->get();
            //$application->need_www_build = true;
            //$application->save();

			if ($application->build_now) {
				$application['www_updating_in_query'] = true;
			} else if ($application->request_www_build) {
				$application['www_updating_in_query'] = false;
			} else {
				$application['www_updating_in_query'] = false;
			}

			//null fixes
			if (!$application->background_image) $application->background_image = '';


            $response = response()->json($application);
        }

        return $response;
    }

    /**
     * get application subscriptions and array
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getApplicationInAppProducts(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'id' => 'required'
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $currentUser = auth()->user();
            if (Application::userHasAccess($request['id'])) {
                $app = Application::find($request['id']);
                $colors = [];
                if ($app->id) {
                    $products = $app->getInAppProducts();
                }
                $response = response()->json(['products' => $products]);
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }

        return $response;
    }


    /**
     * get application css colors
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getApplicationColors(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'id' => 'required'
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $currentUser = auth()->user();
            if (Application::userHasAccess($request['id'])) {
                $app = Application::find($request['id']);
                $colors = [];
                if ($app->id) {
                    $colors = $app->getColorsArray();
                }
                //$colors = $app->getColorsArray();
                $response = response()->json(['colors' => $colors]);
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }

        return $response;
    }


    /**
     * set application color from named array
     * @param Request $request
     */
    function setApplicationColors(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'id' => 'required'
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            if (Application::userHasAccess($request['id'])) {
                $app = Application::find($request['id']);
                $colors = $request['colors'];
                if ($app->id) {
                    foreach ($request['colors'] as $color_row) {

                        //update base color
                        $rgb = Colors::hexToRgb($color_row['color_value']);

                        //not disbled by default
                        if (!isset($color_row['disabled'])) $color_row['disabled'] = 0;

                        //Create color name from named and insert into DB (if color name is empty)
                        $color_name = $color_row['color_name'];

                        //if named (name identifier) is empty - generate customs
                        $color_row['named'] = preg_replace("/[^0-9a-z]/", "", strtolower($color_row['named']));
                        if ($color_row['named'] == "") {
                            $color_row['named'] = "color" . date("h:i:s");
                        }

                        if ($color_row['color_name'] == "") {
                            $color_name = "--ion-color-" . preg_replace("/[^0-9a-z]/", "", strtolower($color_row['named']));
                        }

                        $founded_color = Colors::where("app_id", $app->id)->where("color_name", $color_name)->first();
                        $is_new_color = true;
                        if ($founded_color) $is_new_color = false;

                        if (!$is_new_color) {
                            Colors::where("app_id", $app->id)
                                ->where("color_name", $color_name)
                                ->update(['color_value' => $color_row['color_value'], "disabled" => $color_row['disabled'], 'color_value_rgb' => "{$rgb['r']}, {$rgb['g']}, {$rgb['b']}"]);
                        } else {

                            Colors::create(
                                [
                                    "app_id" => $app->id,
                                    "color_name" => $color_name,
                                    "color_value" => $color_row['color_value'],
                                    "disabled" => $color_row['disabled'],
                                    "color_value_rgb" => "{$rgb['r']}, {$rgb['g']}, {$rgb['b']}",
                                    "color_type" => "user",
                                    "named" => preg_replace("/[^0-9a-z]/", "", strtolower($color_row['named'])),
                                    "name" => trim($color_row["name"]),
                                ]
                            );

                        }


                        //update tint and shade, if needed
                        if ($color_row["named"] != "") {

                            $tint_color = Colors::getTintFromHex($color_row['color_value']);
                            $shade_color = Colors::getShadeFromHex($color_row['color_value']);
                            $contrast_color = Colors::getContrastColor($color_row['color_value']);
                            $contrast_color_hex = $contrast_color['hex'];
                            $contrast_color_rgb = $contrast_color['rgb']['r'] . ', ' . $contrast_color['rgb']['g'] . ', ' . $contrast_color['rgb']['b'];

                            $named = preg_replace("/[^0-9a-z]/", "", strtolower($color_row['named']));

                            Colors::where("app_id", $app->id)
                                ->where("color_name", $color_name)
                                ->update(
                                    ['color_value_tint' => $tint_color['hex'],
                                        'color_value_shade' => $shade_color['hex'],
                                        'color_value_contrast' => $contrast_color_hex,
                                        'color_value_contrast_rgb' => $contrast_color_rgb,
                                    ]
                                );
                        }

                        //update bg images
                        if (isset($request['background_mode']['background_image_size'])) $app->background_image_size = $request['background_mode']['background_image_size'];
                        if (isset($request['background_mode']['background_image_mode'])) $app->background_image_mode = $request['background_mode']['background_image_mode'];
                        if (isset($request['background_mode']['background_image'])) {

                            if ($request['background_mode']['background_image'] == '' || $request['background_mode']['background_image'] == '-') $app->background_image = "";
                            else if (strpos($request['background_mode']['background_image'], 'data:image') !== false) $app->setApplicationDefaultBackground($request['background_mode']['background_image']);

                        };
                        $app->need_www_build = true;
                        $app->save();


                    }

                }
                $response = response()->json(['message' => 'DATA_UPDATED', 'b' => $request['background_mode']]);
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }
        return $response;
    }

    /**
     * add or update application IAP
     * @param Request $request
     */
    function setApplicationIAP(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'id' => 'required',
                'iap' => 'required',
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            if (Application::userHasAccess($request['id'])) {
                $app = Application::find($request['id']);


                $app->setInAppProduct($request['iap']);

                $response = response()->json(['message' => 'DATA_UPDATED']);

            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }
        return $response;
    }

    /**
     * delete application IAP
     * @param Request $request
     */
    function removeApplicationIAP(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'id' => 'required',
                'iap_id' => 'required',
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            if (Application::userHasAccess($request['id'])) {
                $app = Application::find($request['id']);

                Application_IAP::where("id", $request["iap_id"])->where("app_id", $app->id)->delete();
                Application_IAP_Description::where("iap_id", $request["iap_id"])->delete();

                //iap_id in Application_IAP and in Application_IAP_Description - are different!!!

                //call get application by id method
                $response = $this->getApplicationById($request);
                //$response = response()->json(['message' => 'DATA_UPDATED']);

            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }
        return $response;
    }


    /**
     * set application languages
     * @param Request $request
     */
    function setApplicationLanguages(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'id' => 'required',
                'languages' => 'required',
                'default_language' => 'required',

            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            if (Application::userHasAccess($request['id'])) {
                $app = Application::find($request['id']);
                $colors = $request['colors'];
                if ($app->id) {
                    $app->setApplicationLanguages($request['languages']);
                    $app->default_language = $request['default_language'];
                    $app->need_www_build = true;
                    $app->save();
                    $languages = new Application_Languages();
                    $languages->setApplication($app);
                    $app['languages'] = $languages->getLanguages();
                    $response = response()->json($app);
                }

            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }

        }

        return $response;
    }

    /**
     * Return application languages list.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getApplicationLanguages(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required'

            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            if (Application::userHasAccess($request['appId'])) {
                $languages = Application_Languages::where('app_id', $request['appId'])->get();
                $response = response()->json(['languages' => $languages]);
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }

        }

        return $response;
    }

    /**
     * Return applications list.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getApplications(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                //'limit' => 'required',
                //'filter' => 'required',
                //'sort' => 'required',
                //'order' => 'required',
                //'start' => 'required',
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $currentUser = auth()->user();
            if ($currentUser['user_type_id'] === 1) {

                $applications = DB::table('applications')
                    ->join('users', 'user_id', '=', 'users.id');
                $applications = $applications->select([
                    'applications.id',
                    'applications.unique_string_id',
                    'applications.name',
                    'applications.description',
                    'applications.disabled',
                    'applications.blocked',
                    'applications.created_at',
                    'applications.size',
                    'applications.user_id',
                    'users.avatar as user_avatar',
                    'users.name as user_name',
                    'users.lastname as user_lastname',
                    'users.email as user_email'
                ])->get();


                $response = response()->json(['applications' => $applications]);
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }
        return $response;
    }

    /**
     * Return application settings.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getApplicationSettings(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $app = Application::find($request['appId']);

            if (Application::userHasAccess($request['appId'])) {
                $response = response()->json(['name' => $app->name, 'description' => $app->description, 'version' => $app->version,
                    'bundleId' => $app->bundle_id, 'android' => $app->android, 'ios' => $app->ios, 'pwa' => $app->pwa, 'screen_mode' => $app->screen_mode]);
            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }
        }

        return $response;
    }

    /**
     * Set application settings.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function setApplicationSettings(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'name' => 'required',
                'description' => 'required',
                'version' => 'required',
                'bundleId' => 'required',
                'android' => 'required',
                'ios' => 'required',
                'pwa' => 'required',
                'screenMode' => 'required'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $app = Application::find($request['appId']);

            if (Application::userHasAccess($request['appId'])) {
                $app->name = $request['name'];
                $app->description = $request['description'];
                $app->version = $request['version'];
                $app->bundle_id = $request['bundleId'];
                $app->android = $request['android'];
                $app->ios = $request['ios'];
                $app->pwa = $request['pwa'];
                $app->screen_mode = $request['screenMode'];
                $app->need_www_build = true;
                $app->save();

                $response = response()->json($app);
            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }

        }

        return $response;
    }

    /**
     * Return AdMob settings.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getAdMobSettings(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $app = Application::find($request['appId']);

            if (Application::userHasAccess($request['appId'])) {
                $response = response()->json(['adMobBannerId' => $app->admob_banner_id, 'adMobInterstitialId' => $app->admob_interstitial_id, 'rewardVideoAd' => $app->reward_video_ad,
                    'adMobEnabled' => $app->admob_enabled]);
            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }
        }

        return $response;
    }

    /**
     * Set AdMob settings.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function setAdMobSettings(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $currentUser = auth()->user();
            $app = Application::find($request['appId']);

            if (Application::userHasAccess($request['appId'])) {
                $app->admob_banner_id = $request['adMobBannerId'];
                $app->admob_interstitial_id = $request['adMobInterstitialId'];
                $app->reward_video_ad = $request['rewardVideoAd'];
                $app->admob_enabled = $request['adMobEnabled'];
                $app->save();

                $response = response()->json($app);
            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }
        }

        return $response;
    }

    /**
     * Set application css.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function setApplicationCss(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'application_css' => 'required'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $app = Application::find($request['appId']);
            if (Application::userHasAccess($request['appId'])) {
                $app->application_css = $request['application_css'];
                $app->need_www_build = true;
                $app->save();

                $response = response()->json($app);
            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }

        }

        return $response;
    }

    /**
     * Get application css.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getApplicationCss(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $app = Application::find($request['appId']);
            $application_css = $app->application_css;

            $response = response()->json(['application_css' => $application_css]);
        }

        return $response;
    }

    /**
     * Set OneSignal settings.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function setOneSignalSettings(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'one_signal_enabled' => 'required'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $app = Application::find($request['appId']);
            if (Application::userHasAccess($request['appId'])) {
                if ($request['one_signal_id']) {
                    $app->one_signal_id = $request['one_signal_id'];
                } else {
                    $app->one_signal_id = "";
                }

                if ($request['one_signal_api_key']) {
                    $app->one_signal_api_key = $request['one_signal_api_key'];
                } else {
                    $app->one_signal_api_key = "";
                }

                $app->one_signal_enabled = $request['one_signal_enabled'];
                $app->save();

                $response = response()->json($app);
            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }
        }

        return $response;
    }

    /**
     * Return OneSignal settings.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getOneSignalSettings(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            if (Application::userHasAccess($request['appId'])) {
                $app = Application::find($request['appId']);
                $one_signal_id = $app->one_signal_id;
                $one_signal_enabled = $app->one_signal_enabled;
                $one_signal_api_key = $app->one_signal_api_key;

                $response = response()->json(['one_signal_id' => $one_signal_id, 'one_signal_enabled' => $one_signal_enabled, 'one_signal_api_key' => $one_signal_api_key]);
            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }
        }

        return $response;
    }

    /**
     * Set Firebase settings.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function setFirebaseSettings(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'use_crashlytics' => 'required'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $app = Application::find($request['appId']);
            if (Application::userHasAccess($request['appId'])) {
                if ($request['google_services_json']) {
                    $app->google_services_json = $request['google_services_json'];
                } else {
                    $app->google_services_json = "";
                }

                if ($request['google_services_plist']) {
                    $app->google_services_plist = $request['google_services_plist'];
                } else {
                    $app->google_services_plist = "";
                }

                $app->use_crashlytics = $request['use_crashlytics'];

                $app->save();

                $response = response()->json($app);
            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }
        }

        return $response;
    }

    /**
     * Return Firebase settings.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getFirebaseSettings(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $app = Application::find($request['appId']);
            $google_services_json = $app->google_services_json;
            $google_services_plist = $app->google_services_plist;
            $use_crashlytics = $app->use_crashlytics;

            $response = response()->json(['google_services_json' => $google_services_json, 'google_services_plist' => $google_services_plist, 'use_crashlytics' => $use_crashlytics]);
        }

        return $response;
    }

    /**
     * Return custom start animation settings.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getCustomStartAnimationSettings(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $app = ApplicationStartAnimation::where('app_id', $request['appId'])->first();
            if ($app) {
                $html = $app->html;
                $css = $app->css;
            } else {
                $html = "";
                $css = "";
            }

            $response = response()->json(['html' => $html, 'css' => $css]);
        }

        return $response;
    }

    /**
     * Save custom start animation settings.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function setCustomStartAnimationSettings(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $app = ApplicationStartAnimation::where('app_id', $request['appId'])->first();
            $application = Application::find($request['appId']);
            if (!$app) {
                $app = new ApplicationStartAnimation();
            }

            $app->app_id = $request['appId'];
            if ($request['html']) {
                $app->html = $request['html'];
            } else {
                $app->html = "";
            }
            if ($request['css']) {
                $app->css = $request['css'];
            } else {
                $app->css = "";
            }
            $application->need_www_build = true;
            $app->save();
            $application->save();
            $response = response()->json($app);
        }

        return $response;
    }

    /**
     * Set MixPanel settings.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function setMixPanelSettings(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'mixpanel_enabled' => 'required'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $app = Application::find($request['appId']);
            if (Application::userHasAccess($request['appId'])) {
                if ($request['mixpanel_token']) {
                    $app->mixpanel_token = $request['mixpanel_token'];
                } else {
                    $app->mixpanel_token = "";
                }
                $app->mixpanel_enabled = $request['mixpanel_enabled'];
                $app->save();

                $response = response()->json($app);
            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }
        }

        return $response;
    }

    /**
     * Return MixPanel settings.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getMixPanelSettings(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            if (Application::userHasAccess($request['appId'])) {
                $app = Application::find($request['appId']);
                $mixpanel_token = $app->mixpanel_token;
                $mixpanel_enabled = $app->mixpanel_enabled;

                $response = response()->json(['mixpanel_token' => $mixpanel_token, 'mixpanel_enabled' => $mixpanel_enabled]);
            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }
        }

        return $response;
    }

    /**
     * Set Google Analytics settings.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function setGoogleAnalyticsSettings(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'app_id' => 'required',
                'analytics_view_id' => 'nullable'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $app = Application::find($request['app_id']);
            if (Application::userHasAccess($request['app_id'])) {
                if ($request['analytics_view_id']) {
                    $app->google_analytics_view_id = $request['analytics_view_id'];
                } else {
                    $app->google_analytics_view_id = null;
                }
                $app->save();
                $response = response()->json($app);
            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }
        }

        return $response;
    }

    /**
     * Return Google Analytics settings.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getGoogleAnalyticsSettings(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'app_id' => 'required'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            if (Application::userHasAccess($request['app_id'])) {
                $app = Application::find($request['app_id']);
                $google_analytics_view_id = $app->google_analytics_view_id;
                $response = response()->json(['google_analytics_view_id' => $google_analytics_view_id]);
            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }
        }

        return $response;
    }

    /**
     * Set application privacy.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function setApplicationPrivacy(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'useDefaultPrivacy' => 'required'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $app = Application::find($request['appId']);
            if (Application::userHasAccess($request['appId'])) {
                if ($request['privacyText']) {
                    $app->privacy_text = $request['privacyText'];
                } else {
                    $app->privacy_text = "";
                }
                $app->use_default_privacy = $request['useDefaultPrivacy'];
                $app->save();

                $response = response()->json($app);
            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }
        }

        return $response;
    }

    /**
     * Return public application privacy text.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getPublicApplicationPrivacy(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'unique_string_id' => 'required'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $app = Application::where('unique_string_id', '=', $request['unique_string_id'])->first();

            if ($app) {
                if ($app->use_default_privacy) {
                    $customer = User::find($app->user_id);
                    $macrosData = [
                        'user_name' => $customer->name,
                        'email' => $customer->email,
                        'company' => $customer->company,
                        'app_name' => $app->name,
                        'phone' => $customer->phone
                    ];
                    $appPrivacyTemplate = StaticPages::where('code', '=', 'template_app_privacy')->first();

                    $template = new Template();
                    $text = $template->replaceMacros($appPrivacyTemplate->content, $macrosData)['result'];
                    $text = preg_replace('#<script(.*?)>(.*?)</script>#is', '', $text);
                    $text = preg_replace('#<a(.*?)>(.*?)</a>#is', '', $text);

                    $response = response()->json(['privacy' => $text]);
                } else {
                    $response = response()->json($app->privacy_text);
                }
            } else {
                $response = response()->json('NOT FOUND', 404);
            }
        }

        return $response;
    }

    /**
     * Return default application privacy text with macros replacements.
     */
    function getDefaultApplicationPrivacy(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            if (Application::userHasAccess($request['appId'])) {
                $app = Application::find($request['appId']);
                $customer = User::find($app->user_id);
                $macrosData = [
                    'user_name' => $customer->name,
                    'email' => $customer->email,
                    'company' => $customer->company,
                    'app_name' => $app->name,
                    'phone' => $customer->phone
                ];
                $appPrivacyTemplate = StaticPages::where('code', '=', 'template_app_privacy')->first();

                $template = new Template();
                $text = $template->replaceMacros($appPrivacyTemplate->content, $macrosData)['result'];

                $response = response()->json(['defaultPrivacy' => $text]);
            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }
        }

        return $response;
    }

    /**
     * Return application push message list.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getApplicationPushMessageList(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'limit' => 'required',
                'offset' => 'required'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            if (Application::userHasAccess($request['appId'])) {
                $messages = DB::table('application_push_message')
                    ->where('app_id', $request['appId'])
                    ->limit($request['limit'])
                    ->offset($request['offset'])
                    ->get();

                $totalCount = DB::table('application_push_message')->count();

                $response = response()->json(['messages' => $messages, 'total_count' => $totalCount]);
            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }
        }

        return $response;
    }

    /**
     * Save push message information.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function saveApplicationPushMessage(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'title' => 'required',
                'message' => 'required',
                'sentDate' => 'required',
                'status' => 'required'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            if (Application::userHasAccess($request['appId'])) {
                DB::table('application_push_message')
                    ->insert([
                        'app_id' => $request['appId'],
                        'push_id' => $request['pushId'],
                        'header' => $request['title'],
                        'preview_text' => $request['message'],
                        'full_text' => $request['fullText'] ? $request['fullText'] : '',
                        'image' => $request['image'] ? $request['image'] : '',
                        'sent_date' => $request['sentDate'],
                        'status' => $request['status'],
                    ]);

                $response = response()->json(['message' => 'DATA_UPDATED']);
            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }
        }

        return $response;
    }

    /**
     * Create new content type in application.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function createContentType(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'name' => 'required',
                'structure' => 'required'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            if (Application::userHasAccess($request['appId'])) {

                $contentType = new ApplicationContentType();
                $contentType->app_id = $request['appId'];
                $contentType->name = $request['name'];
                $contentType->structure = $request['structure'];
                $contentType->save();


                $response = response()->json(['contentType' => $contentType]);
            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }
        }

        return $response;
    }

    /**
     * Return application content list.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getApplicationContentList(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'content_type_id' => 'required'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $contentType = ApplicationContentType::find($request['content_type_id']);
            if (Application::userHasAccess($request['appId']) && $contentType->app_id === $request['appId']) {

                $fields = ApplicationContentType::getContentTypeFields($request['content_type_id']);

                $queryFields = [];
                if (count($fields) === 1) {
                    $queryFields[0] = $fields[0]->db_field;
                } else {
                    for ($i = 0; $i < count($fields); $i++) {
                        $queryFields[$i] = $fields[$i]->db_field;
                    }
                }
                $queryFields[count($queryFields)] = 'id';

                $fieldsValue = DB::table('application_contents')
                    ->where('app_id', $request['appId'])
                    ->where('content_type_id', $request['content_type_id']);
                if ($request['filter']) {
                    $fieldsValue->where('column_title', 'like', '%' . $request['filter'] . '%');
                }
                if ($request['sortField'] && $request['sortDirection']) {
                    $fieldsValue->orderBy($request['sortField'], $request['sortDirection']);
                }
                if ($request['limit']) {
                    $fieldsValue = $fieldsValue->limit($request['limit']);
                }
                if ($request['offset']) {
                    $fieldsValue = $fieldsValue->offset($request['offset']);
                }
                $fieldsValue = $fieldsValue->select($queryFields)
                    ->get();

                $total = DB::table('application_contents')
                    ->where('app_id', $request['appId'])
                    ->where('content_type_id', $request['content_type_id'])
                    ->count();

                $app = Application::find($request['appId']);
                $languages = new Application_Languages();
                $languages->setApplication($app);

                $response = response()->json(['fields' => $fields, 'fields_value' => $fieldsValue, 'total' => $total, 'languages'=>$languages->getLanguages(), "default_language"=>$app->default_language]);
            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }
        }

        return $response;
    }

    /**
     * Return application content.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getApplicationContent(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'contentTypeId' => 'required',
                'contentId' => 'required'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $contentType = ApplicationContentType::find($request['contentTypeId']);
            if (Application::userHasAccess($request['appId']) && $contentType->app_id === $request['appId']) {
                $fields = ApplicationContentType::getContentTypeFields($request['contentTypeId']);
                $queryFields = [];
                if (count($fields) === 1) {
                    $queryFields[0] = $fields[0]->db_field;
                } else {
                    for ($i = 0; $i < count($fields); $i++) {
                        $queryFields[$i] = $fields[$i]->db_field;
                    }
                }

                $fieldsValue = [];
                if ($request['contentId'] != 0) {
                    $fieldsValue = DB::table('application_contents')
                        ->where('id', $request['contentId'])
                        ->select($queryFields)
                        ->first();
                }

                $app = Application::find($request['appId']);
                $languages = DB::table('application_languages')->where('app_id', $request['appId'])->get();

                $response = response()->json(['fields' => $fields, 'fields_value' => $fieldsValue, 'languages'=>$languages, "default_language"=>$app->default_language]);

            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }
        }

        return $response;
    }

    /**
     * Save application content values.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function setApplicationContent(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'contentTypeId' => 'required',
                'contentId' => 'required',
                'values' => 'required'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $contentType = ApplicationContentType::find($request['contentTypeId']);
            if (Application::userHasAccess($request['appId']) && $contentType->app_id === $request['appId']) {

                if ($request['contentId'] === 0) {
                    $content = new ApplicationContent();
                    $content->app_id = $request['appId'];
                    $content->content_type_id = $request['contentTypeId'];
                    foreach ($request['values'] as $key => $value) {
                        if (str_starts_with($key, 'column_date')) {
                            $content[$key] = Carbon::parse($value)->toDateTime();
                        } else if (str_starts_with($key, 'column_text')) {
                            $content[$key] = json_encode($value, JSON_UNESCAPED_UNICODE);
                        } else if (str_starts_with($key, 'column_string')) {
                            $content[$key] = json_encode($value, JSON_UNESCAPED_UNICODE);
                        } else if (str_starts_with($key, 'column_title')) {
                            $content[$key] = json_encode($value, JSON_UNESCAPED_UNICODE);
                        }
                        else {
                            $content[$key] = $value;
                        }
                    }
                    $content->save();
                    $response = response()->json($content);
                } else {
                    $content = ApplicationContent::find($request['contentId']);
                    foreach ($request['values'] as $key => $value) {
                        if (str_starts_with($key, 'column_date')) {
                            $content[$key] = Carbon::parse($value)->toDateTime();
                        } else {
                            $content[$key] = $value;
                        }
                    }
                    $content->save();
                    $response = response()->json($content);
                }
            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }
        }

        return $response;
    }

    /**
     * Delete application content.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function deleteApplicationContent(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'contentId' => 'required'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $content = ApplicationContent::find($request['contentId']);
            if (Application::userHasAccess($request['appId']) && $content->app_id === $request['appId']) {
                $delete = ApplicationContent::find($request['contentId'])->delete();

                $response = response()->json(['message' => 'CONTENT_DELETED']);

            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }
        }

        return $response;
    }

    /**
     * Return content type list associated with the application.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getApplicationContentTypesList(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            if (Application::userHasAccess($request['appId'])) {
                $content_types = ApplicationContentType::where('app_id', $request['appId'])->get();

                $response = response()->json(['content_types' => $content_types]);

            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }
        }

        return $response;
    }

    /**
     * Delete application content type with associated content.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function deleteApplicationContentType(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'contentTypeId' => 'required',
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $contentType = ApplicationContentType::find($request['contentTypeId']);
            if (Application::userHasAccess($request['appId']) && $contentType->app_id === $request['appId']) {
                ApplicationContent::where('content_type_id', $request['contentTypeId'])->delete();
                $contentType->delete();

                $response = response()->json(['message' => 'CONTENT_TYPE_DELETED']);

            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }
        }

        return $response;
    }

    /**
     * Edit application content type.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function editApplicationContentType(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'contentTypeId' => 'required',
                'name' => 'required',
                'structure' => 'required'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $contentType = ApplicationContentType::find($request['contentTypeId']);
            if (Application::userHasAccess($request['appId']) && $contentType->app_id === $request['appId']) {
                $contentType->app_id = $request['appId'];
                $contentType->name = $request['name'];
                $contentType->structure = $request['structure'];
                $contentType->save();

                $response = response()->json(['contentType' => $contentType]);

            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }
        }

        return $response;
    }

    /**
     * Return application content type by id.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getApplicationContentType(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'contentTypeId' => 'required',
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $contentType = ApplicationContentType::find($request['contentTypeId']);
            if (Application::userHasAccess($request['appId']) && $contentType->app_id === $request['appId']) {
                $response = response()->json(['content_type' => $contentType]);
            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }
        }

        return $response;
    }


    /**
     * Return application content list.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getApplicationContentByKey(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'contentTypeName' => 'required',
                'exportFormat' => 'required'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $app = Application::where('token_key', $request->bearerToken())->first();

            if ($app->last_export_time === null || Carbon::parse($app->last_export_time)->diffInSeconds(Carbon::now()) > 15) {
                $contentType = ApplicationContentType::where('app_id', $app->id)
                    ->where('name', $request['contentTypeName'])->first();
                if ($contentType) {
                    $result = ApplicationContent::where('app_id', $app->id)
                        ->where('content_type_id', $contentType->id);

                    if ($request['created_at']) {
                        $result->where('created_at', '>', $request['created_at']);
                    }

                    if ($request['updated_at']) {
                        $result->where('updated_at', '>', $request['updated_at']);
                    }

                    if ($request['title']) {
                        $result->where('column_title', 'like', '%' . $request['title'] . '%');
                    }

                    $fields = ApplicationContentType::getContentTypeFields($contentType->id);

                    $queryFields = [];
                    if (count($fields) === 1) {
                        $queryFields[0] = $fields[0]->db_field . ' AS ' . $fields[0]->name;
                    } else {
                        for ($i = 0; $i < count($fields); $i++) {
                            $queryFields[$i] = $fields[$i]->db_field . ' AS ' . $fields[$i]->name;
                        }
                    }
                    $queryFields[count($queryFields)] = 'created_at';
                    $queryFields[count($queryFields)] = 'updated_at';

                    $result = $result->select($queryFields)->get();

                    if ($request['exportFormat'] === 'json') {
                        $response = response()->json(['result' => $result]);
                    } else if ($request['exportFormat'] === 'csv') {
                        $csv_string = '';
                        for ($i = 0; $i < count($fields); $i++) {
                            if ($i !== count($fields) - 1) {
                                $csv_string = $csv_string . $fields[$i]->name . ',';
                            } else {
                                $csv_string = $csv_string . $fields[$i]->name . PHP_EOL;
                            }
                        }
                        for ($i = 0; $i < count($result); $i++) {
                            for ($j = 0; $j < count($fields); $j++) {
                                if ($j !== count($fields) - 1) {
                                    $csv_string = $csv_string . $result[$i][$fields[$j]->name] . ',';
                                } else {
                                    $csv_string = $csv_string . $result[$i][$fields[$j]->name] . PHP_EOL;
                                }
                            }
                        }

                        $response = response()->json(['result' => $csv_string]);
                    }

                    $app->last_export_time = Carbon::now();
                    $app->save();
                } else {
                    $response = response()->json(['error' => 'NO_SUCH_CONTENT_TYPE'], 406);
                }
            } else {
                $response = response()->json(['error' => 'TRY_AGAIN_LATER'], 403);
            }

        }

        return $response;
    }

    /**
     * Add content to the queue for recording.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function setApplicationContentByKey(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'contentTypeName' => 'required',
                'data' => 'required'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $app = Application::where('token_key', $request->bearerToken())->first();

            $contentType = ApplicationContentType::where('app_id', $app->id)
                ->where('name', $request['contentTypeName'])->first();

            if ($contentType) {
                $json = json_encode($request['data']);
                $file_name = $contentType->id . Str::random(20) . '.json';
                $file = fopen(public_path() . '/storage/' . $file_name, 'w+');
                fwrite($file, $json);
                fclose($file);

                DB::table('application_content_queue')->insert(['app_id' => $app->id, 'content_type_id' => $contentType->id, 'file_name' => $file_name]);
                $response = response()->json(['message' => 'DATA_ADDED_TO_QUEUE']);
            } else {
                $response = response()->json(['error' => 'NO_SUCH_CONTENT_TYPE'], 406);
            }

        }

        return $response;
    }

    /**
     * Save new font for application.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function setApplicationFont(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'fontFamily' => 'required',
                'fontConnectionFile' => 'required'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            if (Application::userHasAccess($request['appId'])) {
                $app = Application::find($request['appId']);

                $fontFiles = [];
                foreach ($request->all() as $key=>$value) {
                    if ($key !== 'appId' && $key !== 'fontFamily' && $key !== 'fontConnectionFile') {
                        $fontFiles[$key] = $value;
                    }
                }

                $app->saveFont($request['fontFamily'], $request['fontConnectionFile'], $fontFiles);

                $response = response()->json(['message' => 'FONT_LOADED']);

            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }
        }

        return $response;
    }

    /**
     * Save custom font for application.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function setApplicationCustomFont(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'fontFamily' => 'required',
                'fontFilesArchive' => 'required'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            if (Application::userHasAccess($request['appId'])) {
                $app = Application::find($request['appId']);
                $app->saveCustomFont($request['fontFamily'], $request['fontFilesArchive']);

                $response = response()->json(['message' => 'FONT_LOADED']);

            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }
        }

        return $response;
    }

    /**
     * Return application font list.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getApplicationFonts(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            if (Application::userHasAccess($request['appId'])) {
                $app = Application::find($request['appId']);

                $fontsConnection = [];
                if (file_exists(public_path() . '/storage/application/' . $app->id . '-' . $app->unique_string_id . '/fonts')) {
                    $fontsFolderFiles = scandir(public_path() . '/storage/application/' . $app->id . '-' . $app->unique_string_id . '/fonts');

                    for ($i = 0; $i < count($fontsFolderFiles); $i++) {
                        if (!is_dir(public_path() . '/storage/application/' . $app->id . '-' . $app->unique_string_id . '/fonts/' . $fontsFolderFiles[$i])) {
                            $connection = file_get_contents(public_path() . '/storage/application/' . $app->id . '-' . $app->unique_string_id . '/fonts/' . $fontsFolderFiles[$i]);
                            $fontsConnection[] = $connection;
                        }
                    }
                }

                $response = response()->json(['fontsConnections' => $fontsConnection]);
            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }
        }

        return $response;
    }



    /**
     * return application colors
     */
    function getApplicationColorsInLayouts(Request $request) {
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
            $app = Application::find($request['id']);
            if (Application::userHasAccess($request['id'])) {
                //Colors
                $colors = $app->getColorsArray();
                $return['colors'] = $colors;
                foreach($colors as $color) {
                    if ($color->color_type=="system" && $color->named!="") $return['colors_main'][]=$color;
                    else if ($color->color_type=="system") $return['colors_system'][]=$color;
                    else if ($color->color_type!="system") $return['colors_user'][]=$color;
                }
                if (!isset($return['colors_user'])) $return['colors_user']=[];
                $response = response()->json($return);

            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }
        return $response;
    }

    /**
     * set application colors
     */
    function setApplicationColorsInLayouts(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'id' => 'required',
                'colors' => 'required',
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $app = Application::find($request['id']);
            if (Application::userHasAccess($request['id'])) {
                //Colors
                //check new user colors
                foreach($request['colors']['colors_user'] as $color_row) {

                    //if color is new - store this to table
                    if (isset($color_row['new']) && $color_row['new']) {
                        $rgb = Colors::hexToRgb($color_row['color_value']);
                        if (!isset($color_row['disabled'])) $color_row['disabled'] = 0;
                        $color_name = $color_row['color_name'];
                        if ($color_row['named']=="") {
                            $color_row['named'] = "color".date("h:i:s");
                        }
                        if ($color_row['color_name']=="") {
                            $color_name = "--ion-color-". preg_replace("/[^0-9a-z]/","",strtolower($color_row['named']));
                        }

                        //create color
                        Colors::create(
                            [
                                "app_id"=>$app->id,
                                "color_name"=>$color_name,
                                "color_value"=>$color_row['color_value'],
                                "disabled"=>$color_row['disabled'],
                                "color_value_rgb"=>"{$rgb['r']}, {$rgb['g']}, {$rgb['b']}",
                                "color_type"=>"user",
                                "named"=>preg_replace("/[^0-9a-z]/","",strtolower($color_row['named'])),
                                "name"=>trim($color_row["name"]),
                            ]
                        );

                        $tint_color = Colors::getTintFromHex($color_row['color_value']);
                        $shade_color = Colors::getShadeFromHex($color_row['color_value']);
                        $contrast_color = Colors::getContrastColor($color_row['color_value']);
                        $contrast_color_hex = $contrast_color['hex'];
                        $contrast_color_rgb = $contrast_color['rgb']['r'] . ', '.$contrast_color['rgb']['g']. ', '.$contrast_color['rgb']['b'];

                        $named = preg_replace("/[^0-9a-z]/","",strtolower($color_row['named']));
                        Colors::where("app_id",$app->id)
                        ->where("color_name",$color_name)
                        ->update(
                            ['color_value_tint' => $tint_color['hex'],
                            'color_value_shade'=> $shade_color['hex'],
                            'color_value_contrast'=> $contrast_color_hex,
                            'color_value_contrast_rgb'=> $contrast_color_rgb,
                            ]
                        );

                    }
                }


                $app->need_www_build = true;
                $app->save();
                //$response = response()->json(['message'=>"DATA_UPDATED"]);
                $response = $this->getApplicationColorsInLayouts($request);

            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }
        return $response;
    }

    /**
     * Copy application.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function copyApplication(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required'
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $currentUser = auth()->user();
            $app = Application::find($request['appId']);
            if ($currentUser['user_type_id'] === 1 || ($currentUser['user_type_id'] === 2 && $app['user_id'] === $currentUser['id'])) {
                $userAppCount = Application::where('user_id', $currentUser['id'])->count();
                $new_app = new Application();
                $new_app = $new_app->copyApplication($request['appId']);
                $response = response()->json($new_app);
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }

        return $response;
    }

    /**
     * Return list with templates name and image
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getApplicationTemplateList(Request $request) {
        $template_path = base_path() . '/templates/';
        $template_path = str_replace("\\","/",$template_path);

        $templatesFiles = array_diff(scandir($template_path), array('..', '.', '.git'));

        $templates = [];
        if ($templatesFiles) {
            foreach ($templatesFiles as $key => $value) {
                if (is_dir($template_path . $value)) {
                    if (file_exists($template_path . $value . '/cover.png')) {
                        $img = file_get_contents($template_path . $value . '/cover.png');
                        $data = 'data:image/png;base64,' . base64_encode($img);
                    } else {
                        $data = false;
                    }
                    $templates[] = ['name' => $value, 'image' => $data];
                }
            }
        }
        $response = response()->json(['templates' => $templates]);
        return $response;
    }

    /**
     * rebuild www sources
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function rebuildSources(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required'
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $currentUser = auth()->user();
            $app = Application::find($request['appId']);
            if ($currentUser['user_type_id'] === 1 || ($currentUser['user_type_id'] === 2 && $app['user_id'] === $currentUser['id'])) {

				if (!$app->request_www_build) {
					$app->request_www_build = true;
					$app->save();
					shell_exec('php '. base_path('artisan BuildApplication:WWW  &'));
				}

            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }

        return $response;
    }


    /**
     * Return list with topics.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getTopics(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required'
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $currentUser = auth()->user();
            $app = Application::find($request['appId']);
            if ($currentUser['user_type_id'] === 1 || ($currentUser['user_type_id'] === 2 && $app['user_id'] === $currentUser['id'])) {
                $topics = Topic::where('app_id', $request['appId'])->get();

                $response = response()->json(['topics' => $topics]);

            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }

        return $response;
    }

    /**
     * Edit or create topic.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function setTopic(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'name' => 'required'
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $currentUser = auth()->user();
            $app = Application::find($request['appId']);
            if ($currentUser['user_type_id'] === 1 || ($currentUser['user_type_id'] === 2 && $app['user_id'] === $currentUser['id'])) {

                if ($request['topic_id']) {
                    $topic = Topic::find($request['topic_id']);
                } else {
                    $topic = new Topic();
                }

                $topic->name = $request['name'];
                $topic->app_id = $request['appId'];
                $topic->save();

                $response = response()->json(['topic' => $topic]);

            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }

        return $response;
    }


    /**
     * Delete topic.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function deleteTopic(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'topic_id' => 'required'
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $currentUser = auth()->user();
            $app = Application::find($request['appId']);
            if ($currentUser['user_type_id'] === 1 || ($currentUser['user_type_id'] === 2 && $app['user_id'] === $currentUser['id'])) {

                $topic = Topic::find($request['topic_id']);
                $topic->delete();

                $response = response()->json(['message' => 'DATA_DELETED']);

            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }

        return $response;
    }
}
