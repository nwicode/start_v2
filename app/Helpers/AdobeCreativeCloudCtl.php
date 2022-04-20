<?php


namespace App\Helpers;


use Facade\FlareClient\Http\Response;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class AdobeCreativeCloudCtl
{
    /**
     * @var string
     */
    private $authURl;
    /**
     * @var string
     */
    private $apiURl;
    /**
     * @var string
     */
    private $serviceClientId;
    /**
     * @var string
     */
    private $serviceClientSecret;
    /**
     * @var string
     */
    private $serviceJwtToken;
    /**
     * @var string
     */
    private $authClientId;
    /**
     * @var string
     */
    private $authClientSecret;
    /**
     * @var string[]
     */
    private $header;
    /**
     * @var mixed|string|null
     */
    private $token;
    /**
     * @var string
     */
    private $tokenUrl;
    /**
     * @var string
     */
    private $adobeCode;

    /**
     * AdobeCreativeCloudCtl constructor.
     * @param string $authClientId
     * @param string $authClientSecret
     * @param string $adobeCode
     */
    public function __construct(string $authClientId, string $authClientSecret)
    {
        $this->authURl = "https://ims-na1.adobelogin.com/ims/exchange/jwt";
        $this->apiURl = "https://cc-libraries.adobe.io/api/v1/libraries";
        $this->tokenUrl = "https://ims-na1.adobelogin.com/ims/token";
        $this->authClientId = $authClientId;
        $this->authClientSecret = $authClientSecret;
        $this->header = ['x-api-key' => $this->authClientId,];
    }

    public function getAccessToken($adobeCode)
    {
        $res = Http::asForm()->post($this->tokenUrl, [
            'grant_type' => "authorization_code",
            'client_id' => $this->authClientId,
            'client_secret' => $this->authClientSecret,
            'code' => $adobeCode]);
        return $res->json();
    }

    public function getLibraries($token, $start = 0, $limit = 100)
    {
        $res = Http::withToken($token)->withHeaders($this->header)
            ->get($this->apiURl, ['start' => $start, 'limit' => $limit]);
        return $res->json();
    }

    public function getLibrary($token, $libraryId, $start = 0, $limit = 100)
    {
        $res = Http::withToken($token)->withHeaders($this->header)
            ->get($this->apiURl . "/" . $libraryId);
        return $res->json();
    }

    public function getLibraryByName($token, $name)
    {
        $start = 0;
        $retryNext = true;
        while ($retryNext) {
            $res = $this->getLibraries($token, $start);
            if (isset($res['total_count']) && $res['total_count'] > 0 && isset($res['libraries'])) {
                foreach ($res['libraries'] as $library) {
                    if (strtolower($library['name']) == strtolower($name)) {
                        return $library;
                    }
                }
                $start += 100;
            } else {
                $retryNext = false;
            }
        }
        return null;
    }

    public function getLibraryElements($token, $libraryId, $start = 0, $limit = 100)
    {
        $res = Http::withToken($token)->withHeaders($this->header)
            ->get($this->apiURl . "/" . $libraryId . "/elements", ['start' => $start, 'limit' => $limit]);
        return $res->json();
    }

    public function getLibraryAllElements($token, $libraryId)
    {
        $elements = [];
        $start = 0;
        $retryNext = true;
        while ($retryNext) {
            $res = $this->getLibraryElements($token, $libraryId, $start);
            if (isset($res['total_count']) && $res['total_count'] > 0 && isset($res['elements'])) {
                foreach ($res['elements'] as $element) {
                    $elements[] = $element;
                }
                $start += 100;
            } else {
                $retryNext = false;
            }
        }
        return ["total_count" => count($elements), "elements" => $elements];
    }

    public function getAdobeAccessToken($adobeCode)
    {
        $res = Http::asForm()->post($this->tokenUrl, ['grant_type' => "authorization_code", 'client_id' => $this->authClientId,
            'client_secret' => $this->authClientSecret, 'code' => $adobeCode]);
        return $res->json();
    }

    public function getAdobeElementThumbnail($token, $thumbnailUrl)
    {
        $tempname = tempnam(sys_get_temp_dir(), md5($thumbnailUrl)) . 'png';
        Http::sink($tempname)->withToken($token)->withHeaders($this->header)->get($thumbnailUrl);
        return $tempname;
    }
}
