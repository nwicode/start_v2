<?php


namespace App\Http\Controllers;


use App\Http\Requests\Referrals\Programs\AddReferralProgramRequests;
use App\Http\Requests\Referrals\Programs\DeleteReferralProgramRequests;
use App\Http\Requests\Referrals\Programs\GetReferralProgramRequests;
use App\Http\Requests\Referrals\Programs\UpdateReferralProgramRequests;
use App\Models\ReferralProgram;

class ReferralProgramsController
{

    /**
     * ReferralProgramsController constructor.
     */
    public function __construct()
    {
    }

    public function getReferralProgram($id, GetReferralProgramRequests $getReferralProgramRequests)
    {
        $reqData = $getReferralProgramRequests->validated();
        $referralProgram = ReferralProgram::query()
            ->when(isset($id), function ($query) use ($id) {
                $query->where('id', '=', $id);
            })
            ->when(isset($reqData['name']), function ($query) use ($reqData) {
                $query->where('name', '=', $reqData['name']);
            })
            ->first();
        return response()->json(["status" => true, "messages" => "referral program", "item" => $referralProgram], 200);
    }

    public function getReferralPrograms(GetReferralProgramRequests $getReferralProgramRequests)
    {
        $reqData = $getReferralProgramRequests->validated();
        $referralPrograms = ReferralProgram::query()
            ->when(isset($reqData['id']), function ($query) use ($reqData) {
                $query->where('id', '=', $reqData['id']);
            })
            ->when(isset($reqData['name']), function ($query) use ($reqData) {
                $query->where('name', '=', $reqData['name']);
            })
            ->orderBy('created_at', 'DESC')
            ->get();
        return response()->json(["status" => true, "messages" => "referrals programs", "items" => $referralPrograms], 200);
    }

    public function getReferralProgramsPaginated(GetReferralProgramRequests $getReferralProgramRequests)
    {
        $reqData = $getReferralProgramRequests->validated();
        $requestData = $getReferralProgramRequests->all();
        $referralPrograms = ReferralProgram::query()
            ->when(isset($reqData['id']), function ($query) use ($reqData) {
                $query->where('id', '=', $reqData['id']);
            })
            ->when(isset($reqData['name']), function ($query) use ($reqData) {
                $query->where('name', '=', $reqData['name']);
            })
            ->orderBy('created_at', 'DESC')
            ->paginate(isset($requestData['per_page']) ? $requestData['per_page'] : 10);
        return response()->json(["status" => true, "messages" => "referrals programs", "items" => $referralPrograms], 200);
    }

    public function createReferralProgram(AddReferralProgramRequests $getReferralProgramRequests)
    {
        $reqData = $getReferralProgramRequests->validated();
        $referralProgram = new ReferralProgram();
        $referralProgram->name = isset($reqData['name']) ? $reqData['name'] : null;
        $referralProgram->uri = isset($reqData['uri']) ? $reqData['uri'] : null;
        $referralProgram->lifetime_minutes = isset($reqData['life_time_minutes']) ? $reqData['life_time_minutes'] : 60 * 24 * 7;
        $referralProgram->save();
        return response()->json(["status" => true, "messages" => "referrals created", "items" => $referralProgram], 200);
    }

    public function updateReferralProgram(UpdateReferralProgramRequests $getReferralProgramRequests)
    {
        $reqData = $getReferralProgramRequests->validated();
        $referralProgram = ReferralProgram::query()->where('id', '=', $reqData['id'])->first();
        if ($referralProgram instanceof ReferralProgram) {
            $referralProgram->name = isset($reqData['name']) ? $reqData['name'] : $referralProgram->name;
            $referralProgram->uri = isset($reqData['uri']) ? $reqData['uri'] : $referralProgram->uri;
            $referralProgram->lifetime_minutes = isset($reqData['lifeTimeMinutes']) ? $reqData['lifeTimeMinutes'] : $referralProgram->lifetime_minutes;
            $referralProgram->update();
        }
        return response()->json(["status" => true, "messages" => "referrals updated", "item" => $referralProgram], 200);
    }

    public function deleteReferralProgram($id, DeleteReferralProgramRequests $getReferralProgramRequests)
    {
        $reqData = $getReferralProgramRequests->validated();
        ReferralProgram::query()
            ->when(isset($id), function ($query) use ($id) {
                $query->where('id', '=', $id);
            })
            ->delete();
        return response()->json(["status" => true, "messages" => "referrals updated", "item" => null], 200);
    }
}
