<?php


namespace App\Http\Controllers\RutterControllers;


use App\Helpers\RutterAPICtl;
use App\Http\Requests\RutterRequests\Purchases\PurchaseOrders;
use Illuminate\Support\Facades\Http;

class RutterPurchaseOrdersController
{
    /**
     * @var RutterAPICtl
     */
    private $rutterCtl;

    /**
     * RutterPurchaseOrdersController constructor.
     */
    public function __construct()
    {
        $this->rutterCtl = new RutterAPICtl();
    }

    public function getPurchaseOrders(PurchaseOrders $purchaseOrders)
    {
        $requestData = $purchaseOrders->validated();
        $resp = Http::withHeaders($this->rutterCtl->getAuthHeader())
            ->get($this->rutterCtl->getUrl() . "/accounting/purchase_orders", $requestData);
        return $resp->json();
    }
}
