<?php

namespace App\Http\Controllers;

use App\Http\Requests\GoogleAnalytics\GAGetAccessToken;
use App\Http\Requests\GoogleAnalytics\GAGetAuthUrl;
use App\Http\Requests\GoogleAnalytics\GAGetRefreshedToken;
use App\Http\Requests\GoogleAnalytics\GAGetReport;
use Google\Analytics\Data\V1beta\BetaAnalyticsDataClient;
use Google\Analytics\Data\V1beta\DateRange;
use Google\Analytics\Data\V1beta\Dimension;
use Google\Analytics\Data\V1beta\Metric;
use Google\ApiCore\ApiException;
use Google\Exception;
use Google\Service\AnalyticsReporting;
use Google_Client;
use Google_Service_Analytics;
use Google_Service_AnalyticsReporting;
use Google_Service_AnalyticsReporting_DateRange;
use Google_Service_AnalyticsReporting_Dimension;
use Google_Service_AnalyticsReporting_GetReportsRequest;
use Google_Service_AnalyticsReporting_Metric;
use Google_Service_AnalyticsReporting_ReportRequest;

class GoogleAnalyticsController extends Controller
{
    /**
     * @var Google_Client
     */
    private $client;
    /**
     * @var string
     */
    private $KEY_FILE_LOCATION;

    /**
     * GoogleAnalyticsController constructor.
     */
    public function __construct()
    {
        $this->client = new Google_Client();
        try {
            $this->KEY_FILE_LOCATION = storage_path('hpreapp.json'); // Google Service Account Key-File
            $this->client->setApplicationName('Web client 1');
            $this->client->setAuthConfig($this->KEY_FILE_LOCATION);
            $this->client->addScope(Google_Service_Analytics::ANALYTICS_READONLY);
            putenv('GOOGLE_APPLICATION_CREDENTIALS=' . $this->KEY_FILE_LOCATION);
        } catch (Exception $e) {
        }
    }

    public function test()
    {
        $client = new BetaAnalyticsDataClient();
        $metrics = [];
        $dimensions = [];
        try {
            $analyticMetrics = [];
            foreach ($metrics as $metric) {
                if (isset($metric['name'])) {
                    $analyticMetrics[] = new Metric(['name' => $metric['name']]);
                }
            }
            $analyticDimensions = [];
            foreach ($dimensions as $dimension) {
                if (isset($dimension['name'])) {
                    $analyticDimensions[] = new Dimension(['name' => $dimension['name']]);
                }
            }
            $response = $client->runReport([
                'property' => 'properties/279673299',
                'dateRanges' => [
                    new DateRange([
                        'start_date' => '30daysAgo',
                        'end_date' => 'today',
                    ]),
                ],
                'dimensions' => [new Dimension(['name' => 'date',]),
                ],
                'metrics' => [new Metric(['name' => 'totalUsers',])
                ]
            ]);
            $client->close();
            return response()->json(["result" => json_decode($response->serializeToJsonString())], 200);
        } catch (ApiException $e) {
            $client->close();
            dd($e);
        }
    }


    public function getAuthUrl(GAGetAuthUrl $GAGetAuthUrl)
    {
        $requestData = $GAGetAuthUrl->validated();
        if (isset($requestData['redirect_url'])) {
            $this->client->setRedirectUri($requestData['redirect_url']);
        }
        $authUrl = $this->client->createAuthUrl();
        return response()->json(["status" => true, "message" => "successfully fetched", "result" => $authUrl], 200);
    }

    public function getAccessToken(GAGetAccessToken $GAGetAccessToken)
    {
        $requestData = $GAGetAccessToken->validated();
        $this->client->setRedirectUri($requestData['redirect_url']);
        $this->client->authenticate($requestData['code']);
        $accessToken = $this->client->getAccessToken();
        return response()->json(["status" => true, "message" => "successfully fetched access token", "result" => $accessToken], 200);
    }


    public function getRefreshedToken(GAGetRefreshedToken $GAGetRefreshedToken)
    {
        $requestData = $GAGetRefreshedToken->validated();
        $accessToken = $this->client->refreshToken($requestData['refresh_token']);
        return response()->json(["status" => true, "message" => "successfully refreshed token", "result" => $accessToken], 200);
    }

    public function getReports(GAGetReport $GAGetReport)
    {
        $requestData = $GAGetReport->validated();
        $analytics = new Google_Service_AnalyticsReporting($this->client);
        $viewId = isset($requestData['view_id']) ? $requestData['view_id'] : null;
        $propertyId = isset($requestData['property_id']) ? $requestData['property_id'] : null;
        $startDate = isset($requestData['start_date']) ? $requestData['start_date'] : '7daysAgo';
        $endDate = isset($requestData['end_date']) ? $requestData['end_date'] : 'today';
        $metrics = isset($requestData['metrics']) && is_array($requestData['metrics']) ? $requestData['metrics'] : [];
        $dimensions = isset($requestData['dimensions']) && is_array($requestData['dimensions']) ? $requestData['dimensions'] : [];
        if ($viewId != null) {
            // Call the Analytics Reporting API UA4.
            $this->client->setAccessToken($requestData['access_token']);
            $response = $this->getAnalyticReports($analytics, $viewId, $startDate, $endDate, $metrics, $dimensions);
            return response()->json($response, 200);
        } else {
            // Call the Analytics Reporting API GA4.
            $response = $this->getAnalyticReportV4($propertyId, $startDate, $endDate, $metrics, $dimensions);
            return response()->json($response, 200);
        }
    }

    private function getAnalyticReports(AnalyticsReporting $analytics, $viewId, $startDate, $endDate, $metrics, $dimensions)
    {
        // Create the DateRange object.
        $dateRange = new Google_Service_AnalyticsReporting_DateRange();
        $dateRange->setStartDate($startDate);
        $dateRange->setEndDate($endDate);
        $analyticMetrics = [];
        foreach ($metrics as $metric) {
            if (isset($metric['expression'])) {
                $session = new Google_Service_AnalyticsReporting_Metric();
                $session->setExpression($metric['expression']);
                if (isset($metric['alias'])) {
                    $session->setAlias($metric['alias']);
                }
                $analyticMetrics[] = $session;
            }
        }
        $analyticDimensions = [];
        foreach ($dimensions as $dimension) {
            if (isset($dimension['name'])) {
                $session = new Google_Service_AnalyticsReporting_Dimension();
                $session->setName($dimension['name']);
                $analyticDimensions[] = $session;
            }
        }
        // Create the ReportRequest object.
        $request = new Google_Service_AnalyticsReporting_ReportRequest();
        $request->setViewId($viewId);
        $request->setDateRanges($dateRange);
        $request->setMetrics($analyticMetrics);
        $request->setDimensions($analyticDimensions);

        $body = new Google_Service_AnalyticsReporting_GetReportsRequest();
        $body->setReportRequests(array($request));
        return $analytics->reports->batchGet($body);
    }

    private function getAnalyticReportV4($propertyId, $startDate, $endDate, $metrics, $dimensions)
    {
        $client = new BetaAnalyticsDataClient();
        try {
            $analyticMetrics = [];
            foreach ($metrics as $metric) {
                if (isset($metric['name'])) {
                    $analyticMetrics[] = new Metric(['name' => $metric['name']]);
                }
            }
            $analyticDimensions = [];
            foreach ($dimensions as $dimension) {
                if (isset($dimension['name'])) {
                    $analyticDimensions[] = new Dimension(['name' => $dimension['name']]);
                }
            }
            $response = $client->runReport([
                'property' => 'properties/' . $propertyId,
                'dateRanges' => [
                    new DateRange([
                        'start_date' => $startDate,
                        'end_date' => $endDate,
                    ]),
                ],
                'dimensions' => $analyticDimensions,
                'metrics' => $analyticMetrics
            ]);
            $client->close();
            return response()->json(["result" => json_decode($response->serializeToJsonString())], 200);
        } catch (ApiException $e) {
            $client->close();
            return response()->json($e->getMessage(), 500);
        }
    }


}
