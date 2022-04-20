<?php

namespace App\Http\Controllers\RutterControllers;

use App\Helpers\RutterAPICtl;
use App\Http\Controllers\Controller;
use App\Http\Requests\RutterRequests\Products\AddProduct;
use App\Http\Requests\RutterRequests\Products\DeleteProduct;
use App\Http\Requests\RutterRequests\Products\GetProduct;
use App\Http\Requests\RutterRequests\Products\GetProductCategories;
use App\Http\Requests\RutterRequests\Products\GetProducts;
use App\Http\Requests\RutterRequests\Products\UpdateProduct;
use Auth0\SDK\Auth0;
use Auth0\SDK\Configuration\SdkConfiguration;
use Automattic\WooCommerce\Client;
use Illuminate\Support\Facades\Http;

class RutterProductsController extends Controller
{
    /**
     * @var RutterAPICtl
     */
    private $rutterCtl;

    /**
     * RutterProductsController constructor.
     */
    public function __construct()
    {
        $this->rutterCtl = new RutterAPICtl();

    }

    public function getProduct(GetProduct $getProduct)
    {
        $requestData = $getProduct->validated();
        $resp = Http::withHeaders($this->rutterCtl->getAuthHeader())
            ->get($this->rutterCtl->getUrl() . "/products/" . $requestData['id'],
                ["access_token" => $requestData["access_token"]]);
        return $resp->json();
    }

    public function getProductCategories(GetProductCategories $getProductCategories)
    {
        $requestData = $getProductCategories->validated();
        $resp = Http::withHeaders($this->rutterCtl->getAuthHeader())
            ->get($this->rutterCtl->getUrl() . "/products/categories", ["access_token" => $requestData["access_token"]]);
        return $resp->json();
    }

    public function getProducts(GetProducts $getProducts)
    {
        $auth0 = new Auth0([
            'domain' => '{{YOUR_TENANT}}.auth0.com',
            'clientId' => '{{YOUR_APPLICATION_CLIENT_ID}}',
            'clientSecret' => '{{YOUR_APPLICATION_CLIENT_SECRET}}',
        ]);
        $woocommerce = new Client(
            'http://example.com',
            'ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
            'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
            [
                'version' => 'wc/v3',
            ]
        );
        $woocommerce->get("");
        $requestData = $getProducts->validated();
        $resp = Http::withHeaders($this->rutterCtl->getAuthHeader())
            ->get($this->rutterCtl->getUrl() . "/products", ["access_token" => $requestData["access_token"]]);
        return $resp->json();
    }

    public function addProduct(AddProduct $addProduct)
    {
        $requestData = $addProduct->validated();
        $resp = Http::withHeaders($this->rutterCtl->getAuthHeader())
            ->post($this->rutterCtl->getUrl() . "/products?access_token=" . $requestData["access_token"], $requestData);
        return $resp->json();
    }

    public function updateProduct(UpdateProduct $updateProduct)
    {
        $requestData = $updateProduct->validated();
        $resp = Http::withHeaders($this->rutterCtl->getAuthHeader())
            ->patch($this->rutterCtl->getUrl() . "/products/" . $requestData["id"] . "?access_token=" . $requestData["access_token"], $requestData);
        return $resp->json();
    }

    public function deleteProduct(DeleteProduct $deleteProduct)
    {
        $requestData = $deleteProduct->validated();
        $resp = Http::withHeaders($this->rutterCtl->getAuthHeader())
            ->delete($this->rutterCtl->getUrl() . "/products/" . $requestData["id"] . "?access_token=" . $requestData["access_token"]);
        return $resp->json();
    }
}
