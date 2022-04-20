<?php

namespace App\Http\Controllers;

use Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Helpers\Helper;
use App\Models\ActivityLog;
use App\Models\SystemSettings;
use App\Models\Languages;
use App\Models\StaticPages;
use Illuminate\Support\Str;
use PostScripton\Money\Currency;
use App\Http\Controllers\SystemController;


class SystemController extends Controller {

    public function setActivityLog(Request $request) {

        $validator = Validator::make(
            $request->all(),
            array(
                'user_id' => 'required',
                'app_id' => 'required',
                'name' => 'required',
                'text' => 'required',
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = $error_message;
        } else {
            $log = new ActivityLog;
            $log->user_id = $request->user_id;
            $log->app_id = $request->app_id;
            $log->name = $request->name;
            $log->text = $request->text;
            $log->save();
            if($log->save()) {
                $response = 'success';
            } else {
                $response = 'error';
            }
        }
        return $response;
    }

    public static function setActivityLogthis($user_id, $app_id, $name, $user) {
        $log = new ActivityLog;
        $isSave = $log->setActivityLog($user_id, $app_id, $name, $user);

        if ($isSave) {
            $response = 'success';
        } else {
            $response = 'error';
        }
        return $response;
    }

    public function getActivityLog(Request $request) {

        $validator = Validator::make(
            $request->all(),
            array(
                'user_id' => 'required',
            )
        );

        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = $error_message;
        } else {
            $user_id = $request->user_id;
            $app_id = $request->app_id;
            if(!$app_id) {
                $app_id = 0;
            }
            $log = new ActivityLog;
            $get_log = $log::where('user_id' , $user_id)->where('app_id', $app_id)->orderByDesc('created_at')->get();
        }
        return $get_log;
    }


    /**
     * Generate auth_settings.json in /assets/settings folder
     * this method deprecated
     */
    public function makeAuthSettings(Request $request) {
        $response_array = SystemSettings::first();
        if (!$response_array) $response_array = [];
        file_put_contents(public_path()."/assets/settings/auth_settings.json",json_encode($response_array,JSON_FORCE_OBJECT+JSON_UNESCAPED_UNICODE+JSON_PRETTY_PRINT));
        $response = response()->json("success", 200);
        return $response;
    }


    static function saveSystemSettings() {
        $request = new Request();
        $controller = new SystemController();
        $controller->makeSystemSettings($request);
    }

    /**
     * Generate system_settings file
     */

    public function makeSystemSettings(Request $request) {

        $response_array = SystemSettings::first();
        if (!$response_array) $response_array = [];

        //add languages meta
        $meta=[];
        $languages = new Languages;
        $language_default = Languages::where('is_default', 1)->first();

        $query = DB::table('static_pages')
            ->join('languages', 'lang_id', '=', 'languages.id')
            ->whereIn('static_pages.code', ['META_TITLE','META_DESCRIPTION'])
            ->select('languages.code', 'languages.id', 'content', 'header', 'static_pages.code as pageCode')
            ->get();

        $default_data = array();
        foreach ($query as $query_item) {
            if($query_item->code==$language_default->code)  {
                $default_data[$query_item->pageCode] = $query_item;
            }
        }
        foreach ($query as $query_item) {
            if ($query_item->content=="") $query_item->content=$default_data[$query_item->pageCode]->content;
            $meta[$query_item->code][]= $query_item;
        }
        foreach($meta as $lang=>$values) {
            foreach ($values as $values_item) $meta['meta'][$lang][$values_item->pageCode]=$values_item->content;
        }

        $response_array['meta']=$meta['meta'];

        //remove some settgins from json
        unset($response_array['smtp_host']);
        unset($response_array['smtp_port']);
        unset($response_array['smtp_user']);
        unset($response_array['smtp_password']);
        //unset($response_array['google_web_client_id']);
        //unset($response_array['google_web_client_id']);

        //store to file
        file_put_contents(public_path()."/assets/settings/system_settings.json",json_encode($response_array,JSON_FORCE_OBJECT+JSON_UNESCAPED_UNICODE+JSON_PRETTY_PRINT));
        $response = response()->json("success", 200);
        return $response;
    }

    /**
     * Save sytem settings to BD from front
     */
    public function saveSystemGeneral(Request $request) {

        $validator = Validator::make(
            $request->all(),
            array(
                'settings' => 'required',
            )
        );

        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = $error_message;
        } else {

            $settings = SystemSettings::first();
            $settings->domain = $request['settings']['domain'];
            $settings->system_email = $request['settings']['email'];
            $settings->system_owner = $request['settings']['owner'];
            $settings->save();
            $this->makeSystemSettings($request);
            $response = response()->json(['message' => 'DATA_UPDATED']);
        }

    }

    /**
     * Save brand image
     */
    public function saveBrandImage(Request $request) {

        $validator = Validator::make(
            $request->all(),
            array(
                'field' => 'required',
                'image' => 'required',
            )
        );

        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = $error_message;
        } else {
            $output_file = "";
            $user = auth()->user();
            if ($user['user_type_id'] === 1) {

                $settings = SystemSettings::first();
                //$settings->domain = $request['settings']['domain'];
                //$settings->system_email = $request['settings']['email'];
                //$settings->system_owner = $request['settings']['owner'];


                if ($request->image!="-") {
                    $filename= "spinner_logo-" . Str::random(9) . ".png";
                    $output_file = 'assets/images/'.$filename;

                    if ($request['field']=="spinner_logo") {
                        $filename= "spinner_logo-" . Str::random(9) . ".png";
                        $output_file = 'assets/images/'.$filename;
                        $settings->spinner_logo = "/" . $output_file;

                    } else if ($request['field']=="inner_logo") {
                        $filename= "inner_logo-" . Str::random(9) . ".png";
                        $output_file = 'assets/images/'.$filename;
                        $settings->inner_logo = "/" . $output_file;
                    } else if ($request['field']=="left_logo_img") {
                        $filename= "left_logo_img-" . Str::random(9) . ".png";
                        $output_file = 'assets/images/'.$filename;
                        $settings->left_logo_img = "/" . $output_file;

                    } else if ($request['field']=="logo_img") {
                        $filename= "logo_img-" . Str::random(9) . ".png";
                        $output_file = 'assets/images/'.$filename;
                        $settings->logo_img = "/" . $output_file;

                    }


                    $ifp = fopen( $output_file, 'wb' );
                    $data = explode( ',', $request->image );
                    fwrite( $ifp, base64_decode($data[1] ) );
                    fclose( $ifp );
                }

                if ($request->field2!="") {
                    if ($request->field2=="auth_color") $settings->auth_color = $request->color;
                    if ($request->field2=="text_logo_color") $settings->text_logo_color = $request->color;
                }
                if ($request->field3!="") {
                    if ($request->field3=="auth_color") $settings->auth_color = $request->color2;
                    if ($request->field3=="text_logo_color") $settings->text_logo_color = $request->color2;
                }

                $settings->save();
                $this->makeSystemSettings($request);
                $response = response()->json(['message' => 'DATA_UPDATED', 'image'=>"/" . $output_file]);
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }

        }
        return $response;

    }

    /**
     * get currencies list
     *
     * @param Request $request
     * @return void
     */
    public function getcurrencies(Request $request) {
        Currency::setCurrencyList(Currency::LIST_ALL);
        $list = Currency::getCurrencies();
        $response_array = Helper::null_safe($list);
        $response = response()->json($response_array, 200);
        return $response;
    }

    /**
     * get default currency
     *
     * @return void
     */
    public function getdefaultcurrency() {
        $default_currency = SystemSettings::first();
        $response = response()->json($default_currency->default_currency, 200);
        return $response;
    }

    /**
     * set default currency
     *
     * @param Request $request
     * @return void
     */
    public function setdefaultcurrency(Request $request) {
        $default_currency = SystemSettings::first();
        $user = auth()->user();
        if ($user['user_type_id'] === 1) {
            if($request->code) {
                $default_currency->default_currency = $request->code;
                $default_currency->save();
                $response = response()->json(['message' => 'DATA_UPDATED']);
            } else {
                $default_currency->default_currency = $default_currency->default_currency;
                $default_currency->save();
                $response = response()->json(['message' => 'DATA_UPDATED']);
            }
            $this->makeSystemSettings($request);
        } else {
            $response = response()->json(['error' => 'NOT_ADMIN'], 403);
        }
        return $response;
    }

    public function saveSystemSmtp(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'settings' => 'required',
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = $error_message;
        } else {
            $user = auth()->user();
            if ($user['user_type_id'] === 1) {
                $settings = SystemSettings::first();
				
				if (!$request['settings']['smtp_host'] || is_null($request['settings']['smtp_host'])) $smtp_host = ""; else $smtp_host = $request['settings']['smtp_host'];
				if (!$request['settings']['smtp_port'] || is_null($request['settings']['smtp_port'])) $smtp_port = ""; else $smtp_port = $request['settings']['smtp_port'];
				if (!$request['settings']['smtp_user'] || is_null($request['settings']['smtp_user'])) $smtp_user = ""; else $smtp_user = $request['settings']['smtp_user'];
				if (!$request['settings']['smtp_password'] || is_null($request['settings']['smtp_password'])) $smtp_password = ""; else $smtp_password = $request['settings']['smtp_password'];				
				
                $settings->smtp_host = $smtp_host;
                $settings->smtp_port = $smtp_port;
                $settings->smtp_user = $smtp_user;
                $settings->smtp_password = $smtp_password;
                $settings->save();
                $this->makeSystemSettings($request);
                $response = response()->json(['message' => 'DATA_UPDATED']);
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }
        return $response;
    }

    /**
     * Update trial day in system settings.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function saveTrialDay(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'trial_day' => 'required',
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $user = auth()->user();
            if ($user['user_type_id'] === 1) {
                $settings = SystemSettings::first();
                $settings->trial_day = $request['trial_day'];
                $settings->save();
                $this->makeSystemSettings($request);
                $response = response()->json(['message' => 'DATA_UPDATED']);
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }
        return $response;
    }

    /**
     * Update field users_registration_enabled in system settings.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function saveUsersRegistrationPossibility(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'users_registration_enabled' => 'required',
                'google_registration' => 'required',
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $user = auth()->user();
            if ($user['user_type_id'] === 1) {
                $settings = SystemSettings::first();
                $settings->users_registration_enabled = $request['users_registration_enabled'];
                $settings->google_web_client_id = $request['google_web_client_id'];
                $settings->google_registration = $request['google_registration'];
                $settings->save();
                $this->makeSystemSettings($request);
                $response = response()->json(['message' => 'DATA_UPDATED']);
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }
        return $response;
    }

    function getSmtpSettings(Request $request) {

        $user = auth()->user();
        if ($user['user_type_id'] === 1) {
            $settings = SystemSettings::first();
			

            $response = response()->json(['smtp_host' => $settings->smtp_host, 'smtp_port' => $settings->smtp_port, 'smtp_user' => $settings->smtp_user, 'smtp_password' => $settings->smtp_password]);
        } else {
            $response = response()->json(['error' => 'NOT_ADMIN'], 403);
        }

        return $response;
    }

    /**
     * Set favicon image.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|string
     */
    public function setFavicon(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'favicon' => 'required',
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = $error_message;
        } else {
            $user = auth()->user();
            if ($user['user_type_id'] === 1) {
                $data = explode(',', $request->favicon);
                $binary = base64_decode($data[1]);
                $iconSize = getimagesizefromstring($binary);

                if ($iconSize && $iconSize[0] === 16 && $iconSize[1] === 16) {
                    $output_file = public_path() . '/assets/media/logos/favicon.ico';
                    $ifp = fopen($output_file, 'wb');
                    $data = explode(',', $request->favicon);
                    fwrite($ifp, base64_decode($data[1]));
                    fclose($ifp);

                    $response = response()->json(['message' => 'DATA_UPDATED']);
                } else {
                    $response = response()->json(['error' => 'WROND_IMAGE'], 403);
                }

            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }

        }
        return $response;
    }

    /**
     * Return favicon image.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFavicon(Request $request) {
        $user = auth()->user();
        if ($user['user_type_id'] === 1) {
            $img = file_get_contents(public_path() . '/assets/media/logos/favicon.ico');
            $favicon = 'data:image/png;base64,' . base64_encode($img);

            $response = response()->json(['favicon' => $favicon]);
        } else {
            $response = response()->json(['error' => 'NOT_ADMIN'], 403);
        }


        return $response;
    }

    //function getAvailable
}
