<?php

namespace App\Http\Controllers\RutterControllers;

use App\Helpers\RutterAPICtl;
use App\Http\Controllers\Controller;
use App\Http\Requests\RutterRequests\Orders\AddOrder;
use App\Http\Requests\RutterRequests\Orders\GetOrder;
use App\Http\Requests\RutterRequests\Orders\GetOrders;
use Illuminate\Support\Facades\Http;

class RutterOrdersController extends Controller
{
    /**
     * @var RutterAPICtl
     */
    private $rutterCtl;

    /**
     * RutterOrdersController constructor.
     */
    public function __construct()
    {
        $this->rutterCtl = new RutterAPICtl();
    }

    public function getOrder(GetOrder $getOrder)
    {
        $requestData = $getOrder->validated();
        $resp = Http::withHeaders($this->rutterCtl->getAuthHeader())
            ->get($this->rutterCtl->getUrl() . "/orders/" . $requestData['id'],
                ["access_token" => $requestData["access_token"]]);
        return $resp->json();
    }

    public function getOrders(GetOrders $getOrders)
    {
        $requestData = $getOrders->validated();
        $resp = Http::withHeaders($this->rutterCtl->getAuthHeader())
            ->get($this->rutterCtl->getUrl() . "/orders", ["access_token" => $requestData["access_token"]]);
        return $resp->json();
    }

    public function addOrder(AddOrder $addOrder)
    {
        $requestData = $addOrder->validated();
        $resp = Http::withHeaders($this->rutterCtl->getAuthHeader())
            ->post($this->rutterCtl->getUrl() . "/orders?access_token=" . $requestData["access_token"]);
        return $resp->json();
    }
}
