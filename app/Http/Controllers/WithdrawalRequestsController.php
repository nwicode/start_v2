<?php


namespace App\Http\Controllers;


use App\Http\Requests\Withdrawals\AddUserWithdrawalRequests;
use App\Http\Requests\Withdrawals\DeleteUserWithdrawalRequests;
use App\Http\Requests\Withdrawals\GetUserWithdrawalRequests;
use App\Http\Requests\Withdrawals\UpdateUserWithdrawalRequests;
use App\Models\WithdrawalRequest;

class WithdrawalRequestsController extends Controller
{

    /**
     * WithdrawalRequestsController constructor.
     */
    public function __construct()
    {

    }

    public function getUserWithdrawal(GetUserWithdrawalRequests $getUserWithdrawalRequests)
    {
        $reqData = $getUserWithdrawalRequests->validated();
        $user = auth()->user();
        $withdrawalRequests = WithdrawalRequest::query()
            ->with(['user'])
            ->where('user_id', '=', $user->id)
            ->when(isset($reqData['id']), function ($query) use ($reqData) {
                $query->where('id', '=', $reqData['id']);
            })
            ->first();
        return response()->json(["status" => true, "messages" => "user withdrawal", "items" => $withdrawalRequests], 200);
    }

    public function getUserWithdrawals(GetUserWithdrawalRequests $getUserWithdrawalRequests)
    {
        $reqData = $getUserWithdrawalRequests->validated();
        $req = $getUserWithdrawalRequests->all();
        $user = auth()->user();
        $withdrawalRequests = WithdrawalRequest::query()
            ->with(['user'])
            ->when(($user->user_type_id > 1 || !isset($req['is_admin'])), function ($query) use ($user) {
                $query->where('user_id', '=', $user->id);
            })
            ->when(isset($reqData['id']), function ($query) use ($reqData) {
                $query->where('id', '=', $reqData['id']);
            })
            ->when(isset($reqData['start']), function ($query) use ($reqData) {
                $query->offset($reqData['start']);
            })
            ->when(isset($reqData['limit']), function ($query) use ($reqData) {
                $query->limit($reqData['limit']);
            })
            ->orderBy('created_at', 'DESC')
            ->get();
        return response()->json(["status" => true, "messages" => "user withdrawals", "items" => $withdrawalRequests], 200);
    }

    public function getUserWithdrawalsPaginated(GetUserWithdrawalRequests $getUserWithdrawalRequests)
    {
        $reqData = $getUserWithdrawalRequests->validated();
        $user = auth()->user();
        $withdrawalRequests = WithdrawalRequest::query()
            ->with(['user'])
            ->when(($user->user_type_id > 1 || !isset($req['is_admin'])), function ($query) use ($user) {
                $query->where('user_id', '=', $user->id);
            })
            ->when(isset($reqData['id']), function ($query) use ($reqData) {
                $query->where('id', '=', $reqData['id']);
            })
            ->when(isset($reqData['start']), function ($query) use ($reqData) {
                $query->offset($reqData['start']);
            })
            ->when(isset($reqData['limit']), function ($query) use ($reqData) {
                $query->limit($reqData['limit']);
            })
            ->orderBy('created_at', 'DESC')
            ->paginate(isset($requestData['per_page']) ? $requestData['per_page'] : 10);
        return response()->json(["status" => true, "messages" => "user withdrawals", "items" => $withdrawalRequests], 200);
    }

    public function addUserWithdrawalsPaginated(AddUserWithdrawalRequests $addUserWithdrawalRequests)
    {
        $reqData = $addUserWithdrawalRequests->validated();
        $user = auth()->user();
        $withdrawalRequests = new WithdrawalRequest();
        $withdrawalRequests->user_id = $user->id;
        $withdrawalRequests->amount = isset($reqData['amount']) ? $reqData['amount'] : 0;
        $withdrawalRequests->description = isset($reqData['description']) ? $reqData['description'] : null;
        $withdrawalRequests->status = "PENDING";
        $withdrawalRequests->save();
        return response()->json(["status" => true, "messages" => "user withdrawals", "items" => $withdrawalRequests], 200);
    }

    public function updateUserWithdrawalsPaginated(UpdateUserWithdrawalRequests $updateUserWithdrawalRequests)
    {
        $reqData = $updateUserWithdrawalRequests->validated();
        $withdrawalRequest = WithdrawalRequest::query()
            ->where('id', '=', $reqData['id'])
            ->first();
        if ($withdrawalRequest instanceof WithdrawalRequest) {
            $withdrawalRequest->status = isset($reqData['status']) ? $reqData['status'] : $withdrawalRequest->status;
            $withdrawalRequest->update();
        }
        return response()->json(["status" => true, "messages" => "user withdrawal updated", "items" => $withdrawalRequest], 200);
    }

    public function deleteUserWithdrawalsPaginated(DeleteUserWithdrawalRequests $getUserWithdrawalRequests)
    {
        $reqData = $getUserWithdrawalRequests->validated();
        $user = auth()->user();
        WithdrawalRequest::query()
            ->where('user_id', '=', $user->id)
            ->when(isset($reqData['id']), function ($query) use ($reqData) {
                $query->where('id', '=', $reqData['id']);
            })
            ->delete();
        return response()->json(["status" => true, "messages" => "user withdrawal deleted", "items" => null], 200);
    }
}
