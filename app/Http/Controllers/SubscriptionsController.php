<?php

namespace App\Http\Controllers;

use App\Http\Requests\Subscriptions\DeleteSubscription;
use App\Http\Requests\Subscriptions\GetSubscriptions;
use App\Http\Requests\Subscriptions\UpdateSubscription;
use App\Models\ApplicationUser;
use App\Models\UserSubscription;
use Stripe\Exception\ApiErrorException;
use Stripe\Stripe;
use Stripe\StripeClient;
use Stripe\Subscription;

class SubscriptionsController extends Controller
{
    /**
     * @var StripeClient
     */
    private $stripe;
    /**
     * @var string
     */
    private $secretKey;
    /**
     * @var string
     */
    private $webHookSec;

    /**
     * SubscriptionsController constructor.
     */
    public function __construct()
    {
        $this->secretKey = 'sk_test_51K1FF8BtgHko6XgqfB40TE7CNaZRRleeqbTfsPDBMXft5LHciEmbJExAs614hRaxZgRomZLqgiGZaDa9UbFGmuIq00SnZEerEr';
        $this->webHookSec = 'whsec_VVPamcvpLQ3Hp2U9UukyUCE2EkaZXt7g';
        Stripe::setApiKey($this->secretKey);
        $this->stripe = new StripeClient($this->secretKey);
    }

    public function getSubscription($id)
    {
        $userSubscriptionsQuery = UserSubscription::query();
        $userSubscription = $userSubscriptionsQuery->where('id', '=', $id)
            ->with(['user'])->first();
        return response()->json($userSubscription, 200);
    }

    public function getSubscriptions(GetSubscriptions $request)
    {
        $requestData = $request->validated();
        $userSubscriptionsQuery = UserSubscription::query();
        $userSubscriptionsQuery->with(['user']);
        foreach ($requestData as $key => $value) {
            if ($key == "app_id") {
                $userSubscriptionsQuery->where('app_id', '=', $value);
            }
            if ($key == "is_canceled") {
                $userSubscriptionsQuery->where('is_canceled', '=', $value);
            }
            if ($key == "period") {
                $userSubscriptionsQuery->where('period', '=', $value);
            }
            if ($key == "search") {
                $userSubscriptionsQuery->orWhere('subscription_id', 'LIKE', '%' . $value . '%');
                $userSubscriptionsQuery->orWhere('amount', 'LIKE', '%' . $value . '%');
                $userSubscriptionsQuery->orWhereHas('user', function ($query) use ($value) {
                    $query->where(function ($q) use ($value) {
                        $q->where('name', 'LIKE', '%' . $value . '%');
                        $q->orWhere('email', 'LIKE', '%' . $value . '%');
                        $q->orWhere('phone', 'LIKE', '%' . $value . '%');
                        $q->orWhere('address', 'LIKE', '%' . $value . '%');
                    });
                });
            }
            if ($key == "start") {
                $userSubscriptionsQuery->offset($value);
            }
            if ($key == "limit") {
                $userSubscriptionsQuery->limit($value);
            }
        }
        $userSubscriptions = $userSubscriptionsQuery->get();
        $total = $userSubscriptionsQuery->offset(0)->limit(-1)->count();
        foreach ($requestData as $key => $value) {
            if (substr($key, 0, 1) == "|") {
                $_key = substr($key, 1);
                if ($_key == "user_id") {
                    $userSubscriptions = $userSubscriptions->sortBy('user.name', SORT_REGULAR, $value === 'desc')->values();
                } elseif ($_key == "write_off_date") {
                    $userSubscriptions = $userSubscriptions->sortBy('write_off_date', SORT_REGULAR, $value === 'desc')->values();
                } elseif ($_key == "next_write_off_date") {
                    $userSubscriptions = $userSubscriptions->sortBy('next_write_off_date', SORT_REGULAR, $value === 'desc')->values();
                }
            }
        }
        return response()->json(['count' => count($userSubscriptions), 'items' => $userSubscriptions, "total" => $total], 200);
    }

    public function getSubscriptionsPaginated(GetSubscriptions $request)
    {
        $requestData = $request->validated();
        $userSubscriptionsQuery = UserSubscription::query();
        foreach ($requestData as $key => $value) {
            if ($key == "app_id") {
                $userSubscriptionsQuery->where('app_id', '=', $value);
            }
            if ($key == "start") {
                $userSubscriptionsQuery->offset($value);
            }
            if ($key == "limit") {
                $userSubscriptionsQuery->limit($value);
            }
        }
        $appUsers = $userSubscriptionsQuery->with(['user'])->paginate(isset($requestData['per_page']) ? $requestData['per_page'] : 25);
        return response()->json($appUsers, 200);
    }

    public function UpdateSubscription(UpdateSubscription $request, $id)
    {
        $requestData = $request->validated();
        $appUsersQuery = ApplicationUser::query();
        $appUsersQuery->where('id', '=', $id);
        $appUsersQuery->update($requestData);
        $appUser = $appUsersQuery->first();
        return response()->json(["status" => true, "message" => "successfully updated", "result" => $appUser], 200);
    }

    public function cancelSubscription(DeleteSubscription $request, $id)
    {
        try {
            $userSubscription = UserSubscription::where('id', '=', $id)->where('is_canceled', '=', false)->first();
            if ($userSubscription instanceof UserSubscription) {
                $subscription = $this->stripe->subscriptions->retrieve($userSubscription->subscription_id);
                if ($subscription instanceof Subscription) {
                    $subscription->cancel();
                    $userSubscription->is_canceled = true;
                    $userSubscription->update();
                    return response()->json(["status" => true, "message" => "successfully subscription canceled!", "result" => null], 200);
                }
            }
            return response()->json(["status" => true, "message" => "whoops! unable to cancel subscription", "result" => null], 200);
        } catch (ApiErrorException $e) {
            return response()->json($e, 500);
        }
    }
}
