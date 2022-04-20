<?php


namespace App\Helpers;


use Illuminate\Support\Facades\Http;

class RutterAPICtl
{
    /**
     * @var string
     */
    private $clientId;
    /**
     * @var string
     */
    private $publicKey;
    /**
     * @var string
     */
    private $secret;
    /**
     * @var string
     */
    private $rootUrl;

    /**
     * RutterAPICtl constructor.
     */
    public function __construct()
    {
//        $this->rootUrl = "https://production.rutterapi.com";
        $this->rootUrl = env('RUTTER_ROOT_URL', "https://sandbox.rutterapi.com");
        $this->clientId = env('RUTTER_CLIENT_ID');
        $this->publicKey = env('RUTTER_PUBLIC_KEY');
        $this->secret = env('RUTTER_SECRET');
    }

    public function getAccessToken(string $publicToken)
    {
        $response = Http::asJson()->post($this->rootUrl,
            [
                "client_id" => $this->clientId,
                "public_token" => $publicToken,
                "secret" => $this->secret
            ]);
        return $response->json();
    }

    public function getAuthKey()
    {
        return base64_encode($this->clientId . ':' . $this->secret);
    }

    public function getAuthHeader()
    {
        return ["Authorization" => "Basic " . $this->getAuthKey()];
    }

    public function getUrl()
    {
        return $this->rootUrl;
    }
}
