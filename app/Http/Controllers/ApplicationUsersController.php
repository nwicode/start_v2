<?php

namespace App\Http\Controllers;

use App\Http\Requests\ApplicationUsers\AddApplicationUserRequest;
use App\Http\Requests\ApplicationUsers\DeleteApplicationUserRequest;
use App\Http\Requests\ApplicationUsers\GetApplicationUsersRequest;
use App\Http\Requests\ApplicationUsers\UpdateApplicationUserRequest;
use App\Models\ApplicationUser;
use App\Models\Application;

class ApplicationUsersController extends Controller
{

    /**
     * ApplicationUsersController constructor.
     */
    public function __construct()
    {

    }

    public function getAppUser($app_id, $id)
    {
        if (Application::userHasAccess($app_id)) {
            $appUsers = ApplicationUser::where('app_id', '=', $app_id)->where('id', '=', $id)->first();
            return response()->json($appUsers, 200);
        } else {
            return response()->json(['error' => 'NOT_ADMIN'], 403);
        }
    }

    public function getAppUsers(GetApplicationUsersRequest $request, $app_id)
    {
        $requestData = $request->validated();
        if (Application::userHasAccess($app_id)) {
            $appUsersQuery = ApplicationUser::query();
            $appUsersQuery->where('app_id', $app_id);
            foreach ($requestData as $key => $value) {
                if ($key == "app_id") {
                    $appUsersQuery->where('app_id', '=', $value);
                }
                if ($key == "start") {
                    $appUsersQuery->offset($value);
                }
                if ($key == "limit") {
                    $appUsersQuery->limit($value);
                }
            }
            $appUsers = $appUsersQuery->get();
            return response()->json($appUsers, 200);
        } else {
            return response()->json(['error' => 'NOT_ADMIN'], 403);
        }
    }

    public function getAppUsersPaginated(GetApplicationUsersRequest $request, $app_i)
    {
        $requestData = $request->validated();
        if (Application::userHasAccess($app_id)) {
            $appUsersQuery = ApplicationUser::query();
            $appUsersQuery->where('app_id', '=', $app_id);
            $appUsers = $appUsersQuery->paginate(isset($requestData['per_page']) ? $requestData['per_page'] : 10);
            return response()->json($appUsers, 200);
        } else {
            return response()->json(['error' => 'NOT_ADMIN'], 403);
        }
    }

    public function AddAppUser(AddApplicationUserRequest $request)
    {

        $requestData = $request->validated();
        $appUser = new ApplicationUser();
        $app = Application::find($requestData['app_id']);
        if (Application::userHasAccess($requestData['app_id'])) {

            $appUser->app_id = $requestData['app_id'];
            $appUser->name = isset($requestData['name']) ? $requestData['name'] : null;
            $appUser->lastname = isset($requestData['lastname']) ? $requestData['lastname'] : '';
            $appUser->password = isset($requestData['password']) ? $requestData['password'] : null;
            $appUser->mail = isset($requestData['mail']) ? $requestData['mail'] : null;
            $appUser->phone = isset($requestData['phone']) ? $requestData['phone'] : null;
            $appUser->balance = isset($requestData['balance']) ? $requestData['balance'] : 0;
            $appUser->blocked = isset($requestData['blocked']) ? $requestData['blocked'] : false;
            $appUser->role = isset($requestData['role']) ? $requestData['role'] : 1;
            $appUser->avatar = isset($requestData['avatar']) ? $requestData['avatar'] : null;
            $appUser->last_date = isset($requestData['last_date']) ? $requestData['last_date'] : null;
            $appUser->save();
            return response()->json(["status" => true, "message" => "successfully created", "result" => $appUser], 200);
        } else {
            return response()->json(['error' => 'NOT_ADMIN'], 403);
        }

    }

    public function UpdateAppUser(UpdateApplicationUserRequest $request, $id)
    {
        $requestData = $request->validated();
        if (Application::userHasAccess($request['app_id'])) {

            $appUsersQuery = ApplicationUser::query();
            $appUsersQuery->where('id', '=', $id);
            $appUsersQuery->update($requestData);
            $appUser = $appUsersQuery->first();
            return response()->json(["status" => true, "message" => "successfully updated", "result" => $appUser], 200);
        } else {
            return response()->json(['error' => 'NOT_ADMIN'], 403);
        }

    }

    public function DeleteAppUser(DeleteApplicationUserRequest $request, $app_id, $id)
    {
        $requestData = $request->validated();
        if (Application::userHasAccess($app_id)) {
            $appUsersQuery = ApplicationUser::query();
            $appUsersQuery->where('id', '=', $id);
            $appUsersQuery->where('app_id', '=', $app_id);
            $appUsersQuery->delete();
            return response()->json(["status" => true, "message" => "successfully deleted", "result" => null], 200);
        } else {
            return response()->json(['error' => 'NOT_ADMIN'], 403);
        }

    }
}
