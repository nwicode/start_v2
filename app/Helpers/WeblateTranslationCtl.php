<?php


namespace App\Helpers;


use Illuminate\Support\Facades\Http;

class WeblateTranslationCtl
{
    private $projectName;
    private $componentName;
    /**
     * @var string
     */
    private $weblateUrl;
    /**
     * @var string
     */
    private $apiKey;

    /**
     * TranslationFetcherCtl constructor.
     * @param string $projectName
     * @param string $componentName
     * @param string $apiKey
     */
    public function __construct(string $projectName, string $componentName, string $apiKey = "JZfOztGtAJkbaEpFrYmiRfT9vz4mH35lurFyDzUk")
    {
        $this->projectName = $projectName;
        $this->componentName = $componentName;
        $this->weblateUrl = "https://hosted.weblate.org/api/";
        $this->apiKey = $apiKey;
    }

    public function getTranslationJson(string $languageCode)
    {
        $translationJson = [];
        $page = 1;
        $checkNextPagination = true;
        while ($checkNextPagination) {
            $response = $this->getTranslation($languageCode, $page);
            if ($response->status() == 200) {
                $page = $page + 1;
                foreach ($response->json()['results'] as $result) {
                    $translationJson[] = $result;
                }
                sleep(1);
            } else {
                $checkNextPagination = false;
            }
            sleep(1);
        }
        return $translationJson;
    }

    protected function getTranslation(string $languageCode, $page)
    {
        $header = ['Authorization' => 'Token ' . $this->apiKey];
        return Http::withHeaders($header)->get($this->weblateUrl . "translations/" . $this->projectName . "/" . $this->componentName . "/" . $languageCode . "/units/", ["page" => $page]);
    }

    public function addTranslationString(string $key, string $value)
    {
        $header = ['Authorization' => 'Token ' . $this->apiKey];
        $reqData = ["key" => $key, "value" => [$value]];
        if ($value == "" || str_contains($value, "..")) {
            return null;
        } else {
            return Http::withHeaders($header)->post($this->weblateUrl . "translations/" . $this->projectName . "/" . $this->componentName . "/en/units/", $reqData);
        }
    }

    public function addComponentTranslationLanguage(string $languageCode)
    {
        $header = ['Authorization' => 'Token ' . $this->apiKey];
        $reqData = ["language_code" => $languageCode];
        return Http::withHeaders($header)->post($this->weblateUrl . "components/" . $this->projectName . "/" . $this->componentName . "/translations/", $reqData);
    }

    public function generateTranslations(string $languageCode, string $mode = "translate", string $filterType = "all", string $autoSource = "mt", $threshold = 80, $engines = "google-translate")
    {
        $header = ['Authorization' => 'Token ' . $this->apiKey];
        $reqData = ["mode" => $mode, "filter_type" => $filterType, "auto_source" => $autoSource, "threshold" => $threshold, "engines" => [$engines]];
        return Http::withHeaders($header)->post($this->weblateUrl . "translations/" . $this->projectName . "/" . $this->componentName . '/' . $languageCode . "/autotranslate/", $reqData);
    }
}
