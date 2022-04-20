<?php


namespace App\Http\Controllers\CommerceControllers\WooCommerceControllers;


use App\Helpers\WooCommerceAPICtl;
use App\Http\Requests\CommerceRequests\WooCommerce\Products\AddProduct;
use App\Http\Requests\CommerceRequests\WooCommerce\Products\DeleteProduct;
use App\Http\Requests\CommerceRequests\WooCommerce\Products\GetProduct;
use App\Http\Requests\CommerceRequests\WooCommerce\Products\GetProducts;
use App\Http\Requests\CommerceRequests\WooCommerce\Products\UpdateProduct;
use Automattic\WooCommerce\Client;
use Automattic\WooCommerce\HttpClient\HttpClientException;

class ProductsController
{
    /**
     * @var WooCommerceAPICtl
     */
    private $commerceCtl;
    /**
     * @var Client
     */
    private $commerce;

    /**
     * ProductsController constructor.
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

    public function getProduct(GetProduct $getProduct)
    {
        $requestData = $getProduct->validated();
        try {
            $result = $this->commerce->get('products/' . $requestData['id']);
            return response()->json(["status" => true, "message" => "product fetched successfully", "result" => $result], 200);
        } catch (HttpClientException $e) {
            return response()->json(["status" => false, "message" => "whoops! error occurred!", "error" => $e->getMessage()], 200);
        }
    }

    public function getProducts(GetProducts $getProducts)
    {
        $requestData = $getProducts->all();
        try {
            $result = $this->commerce->get("products", $requestData);
            return response()->json(["status" => true, "message" => "products fetched successfully", "result" => $result], 200);
        } catch (HttpClientException $e) {
            return response()->json(["status" => false, "message" => "whoops! error occurred!", "error" => $e->getMessage()], 200);
        }
    }

    public function addProduct(AddProduct $addProduct)
    {
        $requestData = $addProduct->validated();
        try {
            $result = $this->commerce->post("products", $requestData);
            return response()->json(["status" => true, "message" => "product created successfully", "result" => $result], 200);
        } catch (HttpClientException $e) {
            return response()->json(["status" => false, "message" => "whoops! error occurred!", "error" => $e->getMessage()], 200);
        }
    }

    public function updateProduct(UpdateProduct $updateProduct)
    {
        $updateProduct->validated();
        $requestData = $updateProduct->all();
        try {
            $result = $this->commerce->put("products/" . $requestData['id'], $requestData);
            return response()->json(["status" => true, "message" => "product updated successfully", "result" => $result], 200);
        } catch (HttpClientException $e) {
            return response()->json(["status" => false, "message" => "whoops! error occurred!", "error" => $e->getMessage()], 200);
        }
    }

    public function deleteProduct(DeleteProduct $deleteProduct)
    {
        $requestData = $deleteProduct->validated();
        $forced = isset($requestData['force']) && $requestData['force'];
        try {
            $result = $this->commerce->delete("products/" . $requestData['id'], ['force' => $forced]);
            return response()->json(["status" => true, "message" => "product deleted successfully", "result" => $result], 200);
        } catch (HttpClientException $e) {
            return response()->json(["status" => false, "message" => "whoops! error occurred!", "error" => $e->getMessage()], 200);
        }
    }
}
