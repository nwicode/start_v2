<?php


namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Validator;

class ActivityLogController extends Controller
{

    /**
     * Return list with activity log record for admin.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getAdminActivityLogList(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'limit' => 'required',
                'offset' => 'required'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $currentUser = auth()->user();
            if ($currentUser['user_type_id'] === 1) {
                $logList = DB::table('activity_logs')
                    ->orderBy('created_at', 'DESC')
                    ->limit($request['limit'])
                    ->offset($request['offset'])
                    ->get();

                for ($i = 0; $i < count($logList); $i++) {
                    $text = json_decode($logList[$i]->text);
                    $logList[$i]->created_at = date("d.m.Y H:i", strtotime($logList[$i]->created_at));
                    if ($logList[$i]->name === 'CREATE_NEW_USER') {
                        $logList[$i]->iconColor = 'primary';
                        $logList[$i]->iconCode = './assets/media/svg/icons/General/User.svg';
                        //$logList[$i]->labelText = 'New';
                        //$logList[$i]->labelColor = 'light-primary';
                        $logList[$i]->labelText = '';
                        $logList[$i]->labelColor = '';
                        $logList[$i]->link = '/edit-user/'.$text->id;
                        $logList[$i]->linkText = $text->name . ' ' . $text->lastname;
                    } else if ($logList[$i]->name === 'CREATE_NEW_APP') {
                        $logList[$i]->iconColor = 'primary';
                        $logList[$i]->iconCode = './assets/media/svg/icons/Files/Folder-plus.svg';
                        $logList[$i]->labelText = '';
                        $logList[$i]->labelColor = '';
                        $logList[$i]->link = '/constructor/'.$text->id;
                        $logList[$i]->linkText = $text->name;
                    } else if ($logList[$i]->name ==='CHANGE_TARIFF') {
                        $logList[$i]->iconColor = 'warning';
                        $logList[$i]->iconCode = './assets/media/svg/icons/Design/Edit.svg';
                        $logList[$i]->labelText = '';
                        $logList[$i]->labelColor = '';
                        $user = User::find($text->userId);
                        $logList[$i]->link = '/edit-user/'.$user->id;
                        $logList[$i]->linkText = $user->name;
                    } else if ($logList[$i]->name ==='MANAGER_DELETED') {
                        $logList[$i]->iconColor = 'danger';
                        $logList[$i]->iconCode = './assets/media/svg/icons/General/User.svg';
                        $logList[$i]->labelText = '';
                        $logList[$i]->labelColor = '';
                        $logList[$i]->link = '';
                        $logList[$i]->linkText = '';
                        $logList[$i]->noLinkText = $text->name . ' ' . $text->lastname;
                    }
                }

                $totalRecords = DB::table('activity_logs')->count();

                $response = response()->json(['totalRecords' => $totalRecords, 'logList' => $logList]);
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }

        return $response;
    }
}
