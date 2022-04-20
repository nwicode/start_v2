<?php

namespace App\Http\Controllers;

use App\Http\Requests\Referrals\GetReferralRequests;
use App\Models\ReferralLink;
use App\Models\ReferralProgram;
use App\Models\ReferralRelationship;
use phpDocumentor\Reflection\DocBlock\Tags\Uses;

class UserReferralsController extends Controller
{

    /**
     * UserReferralsController constructor.
     */
    public function __construct()
    {

    }

    public function getUserReferral(GetReferralRequests $getUserReferralsRequest)
    {
        $reqData = $getUserReferralsRequest->validated();
        $user = auth()->user();
        $userReferral = ReferralLink::query()
            ->with(['users'])
            ->where('user_id', '=', $user->id)
            ->when(isset($reqData['id']), function ($query) use ($reqData) {
                $query->where('id', '=', $reqData['id']);
            })
            ->when(isset($reqData['referral_program_id']), function ($query) use ($reqData) {
                $query->where('referral_program_id', '=', $reqData['referral_program_id']);
            })
            ->first();
        return response()->json(["status" => true, "messages" => "user referral", "items" => $userReferral], 200);
    }

    public function getUserReferrals(GetReferralRequests $getUserReferralsRequest)
    {
        $reqData = $getUserReferralsRequest->validated();
        $user = auth()->user();
        $userReferralLinkIds = ReferralLink::query()
            ->where('user_id', '=', $user->id)
            ->when(isset($reqData['referral_program_id']), function ($query) use ($reqData) {
                $query->where('referral_program_id', '=', $reqData['referral_program_id']);
            })
            ->select('id')->get();
        $userReferrals = ReferralRelationship::query()
            ->with(['user', 'referral_link'])
            ->whereIn('referral_link_id', $userReferralLinkIds)
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
        return response()->json(["status" => true, "messages" => "user referrals", "items" => $userReferrals], 200);
    }

    public function getUserReferralsPaginated(GetReferralRequests $getUserReferralsRequest)
    {
        $reqData = $getUserReferralsRequest->validated();
        $requestData = $getUserReferralsRequest->all();
        $user = auth()->user();
        $userReferralLinkIds = ReferralLink::query()
            ->where('user_id', '=', $user->id)
            ->when(isset($reqData['referral_program_id']), function ($query) use ($reqData) {
                $query->where('referral_program_id', '=', $reqData['referral_program_id']);
            })
            ->select('id')->get();
        $userReferrals = ReferralRelationship::query()
            ->with(['user', 'referral_link'])
            ->whereIn('referral_link_id', $userReferralLinkIds)
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
        return response()->json(["status" => true, "messages" => "user referrals", "items" => $userReferrals], 200);
    }

    public function getUserReferralLink(GetReferralRequests $getUserReferralsRequest)
    {
        $reqData = $getUserReferralsRequest->validated();
        $user = auth()->user();
        $referralProgram = ReferralProgram::query()
            ->when(isset($reqData['referral_program_id']), function ($query) use ($reqData) {
                $query->where('id', '=', $reqData['referral_program_id']);
            })
            ->when(isset($reqData['name']), function ($query) use ($reqData) {
                $query->where('name', '=', $reqData['name']);
            })
            ->first();
        if ($referralProgram instanceof ReferralProgram) {
            $referralLink = ReferralLink::getReferral($user, $referralProgram);
            return response()->json($referralLink, 200);
        } else {
            return response()->json(["status" => false, "messages" => "user referrals", "items" => []], 500);
        }
    }


}
