<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Helpers\Helper;
use App\Helpers\Error;
use Validator;
use Illuminate\Support\Facades\DB;

class UsersController extends Controller
{
    /**
     * Create a new UsersController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => []]);
    }


    /**
     * return current user info
     *
     * @return @return \Illuminate\Http\JsonResponse
     */
    public function current() {
        $user = auth()->user();
        if ($user) {

            //Short name
            $short_name = $user['name'] . ' ' . $user['lastname'];
            $user['letter']=trim(mb_substr($user['name'] . ' ' . $user['lastname'],0,1));
            $user['short_name']=trim(explode(" ",$user['name'] . ' ' . $user['lastname'])[0]);
            if (isset(explode(" ",$user['name'] . ' ' . $user['lastname'])[1])) {
                $user['short_name'] .= " ". mb_substr(explode(" ",$user['name'] . ' ' . $user['lastname'])[1],0,1);
            }

            if (!file_exists(public_path('storage/users/avatars/'.$user['avatar']))) $user['avatar']="";

            return response()->json($user);
        } else {
            return response()->json(['error' => 'AUTH_REQUIRED'], 401);
        }
    }

    /**
     * Update personal information of the current user.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|string
     */
    public function savePersonalInformation(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'name' => 'required',
                'lastname' => 'required',
                'phone' => 'required',
                'country' => 'required',
                'address' => 'required',
                'avatar' => 'required',
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $user_id = auth()->id();
            $currentUser = User::find($user_id);
            $currentUser->updatePersonalInformation($request['name'], $request['lastname'], $request['phone'], $request['country'], $request['address'], $request['company'], $request['avatar']);
            //$this->saveavatar($request['avatar'], $user_id);

            $response = response()->json($currentUser);
        }

        return $response;
    }

    /**
     * Update account information of the current user.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function saveAccountInformation(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'email' => 'required',
                'defaultLanguage' => 'required'
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $user_id = auth()->id();
            $currentUser = User::find($user_id);
            $currentUser->updateAccountInformation($request['email'], $request['defaultLanguage'], $request['defaultLanguage'], 1);

            $response = response()->json($currentUser);
        }

        return $response;
    }

    /**
     * Block account of the user.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function blockAccount(Request $request) {
        $currentUser = auth()->user();
        if ($request['id'] && $currentUser['id'] != $request['id']) {
            if ($currentUser['user_type_id'] === 1) {
                $user = User::find($request['id']);
            } else {
                return response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        } else {
            $user = User::find($currentUser['id']);
        }

        $isBlocked = $user->blockAccount();
        if ($isBlocked) {
            return response()->json(['message' => "ACCOUNT_BLOCKED"]);
        } else {
            return response()->json(['error' => "ACCOUNT_BLOCKED"]);
        }
    }

    /**
     * Update password of the current user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function changePassword() {
        $data = request(['oldPassword', 'newPassword']);

        $user = User::find(auth()->id());
        $isChange = $user->changePassword($data['oldPassword'], $data['newPassword']);

        if ($isChange) {
            return response()->json(['message' => "PASSWORD_UPDATE"]);
        } else {
            return response()->json(['error' => "WRONG_PASSWORD"], 403);
        }
    }


    /**
     * Return user information by user id and his applications.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getUserById(Request $request) {
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
                $user = DB::table('users')
                    ->where('id','=', $request['id'])
                    ->select('id', 'avatar', 'name', 'lastname', 'user_type_id', 'email', 'blocked', 'phone', 'address', 'country' , 'default_language','company')->get();
                if ($user[0]) {
                    $user_applications = DB::table('applications')
                        ->where('user_id','=', $request['id'])
                        ->select('id', 'unique_string_id', 'name', 'description', 'pwa', 'android', 'ios', 'blocked', 'disabled' , 'size')->get();

                    for ($i = 0; $i < count($user_applications); $i++) {
                        $user_applications[$i]->sizeOf = 650;
                        $user_applications[$i]->icon = "storage/application/".$user_applications[$i]->id."-".$user_applications[$i]->unique_string_id.'/resources/icon_100x100.png';
                    }

                    $user[0]->applications = $user_applications;
                    $response = response()->json($user[0]);
                } else {
                    $response = response()->json(['error' => 'USER_NOT_FOUND'], 406);
                }
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }
        return $response;
    }

    /**
     * Update personal information of the user with certain id.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|string
     */
    public function editUserPersonalInformation(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'id' => 'required',
                'name' => 'required',
                'lastname' => 'required',
                'phone' => 'required',
                'country' => 'required',
                'address' => 'required',
                'avatar' => 'required',
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $currentUser = auth()->user();
            if ($currentUser['user_type_id'] === 1) {
                $user = User::find($request['id']);
                $user->updatePersonalInformation($request['name'], $request['lastname'], $request['phone'], $request['country'], $request['address'], $request['company'], $request['avatar']);
                $response = response()->json($user);
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }

        return $response;
    }

    /**
     * Update account information of the user with certain id.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function editUserAccountInformation(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'email' => 'required',
                'defaultLanguage' => 'required'
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $currentUser = auth()->user();
            if ($currentUser['user_type_id'] === 1) {
                $user = User::find($request['id']);

                $user->updateAccountInformation($request['email'], $request['defaultLanguage'], $request['role']);

                $response = response()->json($user);
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }

        return $response;
    }

    /**
     * Change password user with certain id.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function editUserPassword(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'id' => 'required',
                'newPassword' => 'required'
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $currentUser = auth()->user();
            if ($currentUser['user_type_id'] === 1) {
                $user = User::find($request['id']);
                $user->update(['password'=>$request['newPassword']]);

                $response = response()->json(['message' => 'DATA_UPDATED']);
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }

        return $response;
    }

	

    /**
     * Check user email exists
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */	
	function checkEmail(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'email' => 'required',
            )
        );		
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {

			

			$response = response()->json($request);
		}
		return $response;		
	}

}
