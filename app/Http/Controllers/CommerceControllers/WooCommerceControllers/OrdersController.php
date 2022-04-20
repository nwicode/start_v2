<?php


namespace App\Http\Controllers\CommerceControllers\WooCommerceControllers;


use App\Helpers\WooCommerceAPICtl;
use App\Http\Requests\CommerceRequests\WooCommerce\Orders\AddOrder;
use App\Http\Requests\CommerceRequests\WooCommerce\Orders\DeleteOrder;
use App\Http\Requests\CommerceRequests\WooCommerce\Orders\GetOrder;
use App\Http\Requests\CommerceRequests\WooCommerce\Orders\GetOrders;
use App\Http\Requests\CommerceRequests\WooCommerce\Orders\UpdateOrder;
use Automattic\WooCommerce\HttpClient\HttpClientException;

class OrdersController
{
    /**
     * @var WooCommerceAPICtl
     */
    private $commerce;
    /**
     * @var WooCommerceAPICtl
     */
    private $commerceCtl;

    /**
     * OrdersController constructor.
     */
    public function __construct()
    {
        $this->commerceCtl = new WooCommerceAPICtl(
            "https://wordpress.negarit.net",
            "ck_f2c9bfadb4043c4b941da545a62a52509435b741",
            "cs_64f41637dbdbf6f6af5d5cb5b5153fe644b30acc",
            null
        );
        $this->commerce = $this->commerceCtl->commerce();
    }

    public function getOrder(GetOrder $getOrder)
    {
        $requestData = $getOrder->all();
        try {
            $result = $this->commerce->get('orders/' . $requestData['id']);
            return response()->json(["status" => true, "message" => "order fetched successfully", "result" => $result], 200);
        } catch (HttpClientException $e) {
            return response()->json(["status" => false, "message" => "whoops! error occurred!", "error" => $e->getMessage()], 200);
        }
    }

    public function getOrders(GetOrders $getOrders)
    {
        $requestData = $getOrders->all();
        try {
            $result = $this->commerce->get("orders", $requestData);
            return response()->json(["status" => true, "message" => "orders fetched successfully", "result" => $result], 200);
        } catch (HttpClientException $e) {
            return response()->json(["status" => false, "message" => "whoops! error occurred!", "error" => $e->getMessage()], 200);
        }
    }

    public function addOrder(AddOrder $addOrder)
    {
        $requestData = $addOrder->validated();
        try {
            $result = $this->commerce->post("orders", $requestData);
            return response()->json(["status" => true, "message" => "order created successfully", "result" => $result], 200);
        } catch (HttpClientException $e) {
            return response()->json(["status" => false, "message" => "whoops! error occurred!", "error" => $e->getMessage()], 200);
        }
    }

    public function updateOrder(UpdateOrder $addOrder)
    {
        $addOrder->validated();
        $requestData = $addOrder->all();
        try {
            $result = $this->commerce->put("orders/" . $requestData['id'], $requestData);
            return response()->json(["status" => true, "message" => "order updated successfully", "result" => $result], 200);
        } catch (HttpClientException $e) {
            return response()->json(["status" => false, "message" => "whoops! error occurred!", "error" => $e->getMessage()], 200);
        }
    }

    public function deleteOrder(DeleteOrder $deleteOrder)
    {
        $requestData = $deleteOrder->validated();
        try {
            $result = $this->commerce->delete("orders/" . $requestData['id']);
            return response()->json(["status" => true, "message" => "order delete successfully", "result" => $result], 200);
        } catch (HttpClientException $e) {
            return response()->json(["status" => false, "message" => "whoops! error occurred!", "error" => $e->getMessage()], 200);
        }
    }


}
