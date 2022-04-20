<?php


namespace App\Http\Controllers\CommerceControllers\WooCommerceControllers;


use App\Helpers\WooCommerceAPICtl;
use App\Http\Requests\CommerceRequests\WooCommerce\ProductCategories\AddProductCategory;
use App\Http\Requests\CommerceRequests\WooCommerce\ProductCategories\DeleteProductCategory;
use App\Http\Requests\CommerceRequests\WooCommerce\ProductCategories\GetProductCategories;
use App\Http\Requests\CommerceRequests\WooCommerce\ProductCategories\GetProductCategory;
use App\Http\Requests\CommerceRequests\WooCommerce\ProductCategories\UpdateProductCategory;
use Automattic\WooCommerce\Client;
use Automattic\WooCommerce\HttpClient\HttpClientException;

class ProductCategoriesController
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
     * ProductCategoriesController constructor.
     */
    public function __construct()
    {
        $this->commerceCtl = new WooCommerceAPICtl(
            isset(request()->all()['domain_url']) ? request()->all()['domain_url'] : '',
            isset(request()->all()['consumer_key']) ? request()->all()['consumer_key'] : '',
            isset(request()->all()['consumer_secret']) ? request()->all()['consumer_secret'] : '',
            null
        );
        $this->commerce = $this->commerceCtl->commerce();
    }

    public function getProductCategory(GetProductCategory $getProduct)
    {
        $requestData = $getProduct->validated();
        try {
            $result = $this->commerce->get('products/categories/' . $requestData['id']);
            return response()->json(["status" => true, "message" => "product-category fetched successfully", "result" => $result], 200);
        } catch (HttpClientException $e) {
            return response()->json(["status" => false, "message" => "whoops! error occurred!", "error" => $e->getMessage()], 200);
        }
    }

    public function getProductCategories(GetProductCategories $getProducts)
    {
        $requestData = $getProducts->all();
        try {
            $result = $this->commerce->get("products/categories", $requestData);
            return response()->json(["status" => true, "message" => "product-categories fetched successfully", "result" => $result], 200);
        } catch (HttpClientException $e) {
            return response()->json(["status" => false, "message" => "whoops! error occurred!", "error" => $e->getMessage()], 200);
        }
    }

    public function addProductCategory(AddProductCategory $addProduct)
    {
        $requestData = $addProduct->validated();
        try {
            $result = $this->commerce->post("products/categories", $requestData);
            return response()->json(["status" => true, "message" => "product-category created successfully", "result" => $result], 200);
        } catch (HttpClientException $e) {
            return response()->json(["status" => false, "message" => "whoops! error occurred!", "error" => $e->getMessage()], 200);
        }
    }

    public function updateProductCategory(UpdateProductCategory $updateProduct)
    {
        $updateProduct->validated();
        $requestData = $updateProduct->all();
        try {
            $result = $this->commerce->post("products/categories", $requestData);
            return response()->json(["status" => true, "message" => "product-category created successfully", "result" => $result], 200);
        } catch (HttpClientException $e) {
            return response()->json(["status" => false, "message" => "whoops! error occurred!", "error" => $e->getMessage()], 200);
        }
    }

    public function deleteProductCategory(DeleteProductCategory $deleteProduct)
    {
        $requestData = $deleteProduct->validated();
        $forced = isset($requestData['force']) && $requestData['force'];
        try {
            $result = $this->commerce->delete("products/categories" . $requestData['id'], ['force' => $forced]);
            return response()->json(["status" => true, "message" => "product-category deleted successfully", "result" => $result], 200);
        } catch (HttpClientException $e) {
            return response()->json(["status" => false, "message" => "whoops! error occurred!", "error" => $e->getMessage()], 200);
        }

    }
}
