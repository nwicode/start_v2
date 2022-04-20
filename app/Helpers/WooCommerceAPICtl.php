<?php


namespace App\Helpers;


use Automattic\WooCommerce\Client;

class WooCommerceAPICtl
{
    /**
     * @var Client
     */
    private $commerce;

    /**
     * WooCommerceAPICtl constructor.
     * @param string $url
     * @param string $clientId
     * @param string $clientSecret
     * @param string|null $version
     */
    public function __construct(string $url, string $clientId, string $clientSecret, string $version = null)
    {
        $this->commerce = new Client(
            $url,
            $clientId,
            $clientSecret,
            [
                'version' => 'wc/v3',
            ]
        );


    }

    public function getCommerce()
    {
        return $this->commerce;
    }

    public function commerce()
    {
        return $this->commerce;
    }
}
