<?php

namespace App\Http\Controllers;

use App\Http\Requests\LicensesRequests\ActivateLicense;
use App\Http\Requests\LicensesRequests\DeactivateLicense;
use App\Http\Requests\LicensesRequests\VerifyLicense;
use App\Models\License;
use Illuminate\Support\Facades\Http;
use App\Models\SystemSettings;
use App\Models\User;
use Carbon\Carbon;
use App\Http\Controllers\SystemController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;


class LicensesController extends Controller
{
    /**
     * @var string
     */
    private $rootUrl;

    private $product_keys = [
        "START" => "7825EC66"
    ];

    /**
     * LicensesController constructor.
     */
    public function __construct()
    {
        $this->rootUrl = "https://updates.nwcode.io/api/";
    }

    private function getLicenseBoxCredential()
    {

        return [
            "LB-API-KEY" => "974DB2F942277F2DCF4B",
            "LB-LANG" => "en",
            "LB-URL" => "https://updates.nwcode.io/",
            "LB-IP" => $this->getUserIpAddr()
        ];
    }

    public function getLicense()
    {
        $licensesQuery = License::query();
        $license = $licensesQuery->first();
        return response()->json(["status" => true, "message" => "license successfully fetched", "result" => $license], 200);
    }

    public function checkConnection()
    {
        $response = Http::withHeaders($this->getLicenseBoxCredential())->post($this->rootUrl . "check_connection_ext");
        $data = $response->json();
        if (isset($data['status'])) {
            return response()->json(["status" => true, "message" => $data['message']], 200);
        } else {
            return response()->json(["status" => false, "message" => "Whoops! no connection"], 500);
        }
    }

    public function checkUpdates() {
        $data = ['SOME_ERROR'];

        $system_settings = SystemSettings::first();
        $requestData['product_id'] = $this->product_keys[strtoupper($system_settings->platform)];

            $response = Http::withHeaders($this->getLicenseBoxCredential())->post($this->rootUrl . "check_update",
            [
                "product_id" => $requestData['product_id'],
                "current_version" => $system_settings->version,
            ]);
            $data = $response->json();
            $system_settings->last_check_date = Carbon::now();
            $system_settings->save();
            SystemController::saveSystemSettings();
        return response()->json($data, 200);
    }


    public function runUpdate(Request $request) {
        $data = ['SOME_ERROR'];

        $system_settings = SystemSettings::first();
        $requestData['product_id'] = $this->product_keys[strtoupper($system_settings->platform)]; 
        
        $licensesQuery = License::query();
        $license = $licensesQuery->first();         

        if ($license instanceof License) {

            $response = Http::withHeaders($this->getLicenseBoxCredential())->post($this->rootUrl . "check_update",
            [
                "product_id" => $requestData['product_id'],
                "current_version" => $system_settings->version,
            ]);
            $data = $response->json();
            $update_id = $data['update_id'];
            $version = $data['version'];

            $licensesQuery = License::query();
            $license = $licensesQuery->first();

            $ch = curl_init();
            $source = $this->rootUrl."download_update/main/".$update_id; 
			$data_array =  array(
				"license_file" => null,
				"license_code" => $license->license_key,
				"client_name" => $license->registered_to
			);            
           
            curl_setopt($ch, CURLOPT_URL, $source);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data_array);            
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'LB-API-KEY: '.$this->getLicenseBoxCredential()['LB-API-KEY'], 
                'LB-URL: '.$request->getSchemeAndHttpHost(), 
                'LB-IP: '.$this->getLicenseBoxCredential()['LB-IP'], 
                'LB-LANG: '.$this->getLicenseBoxCredential()['LB-LANG'])
            );            
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30); 
            //ob_flush();

            //print_r($this->getLicenseBoxCredential()); exit;
            $data_file = curl_exec($ch);
            $http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            if($http_status != 200){
                if($http_status == 401){
                    curl_close($ch);
                        $data = ['error'=>true, 'message'=>"Update request period expired!"];
                }else{
                    curl_close($ch);
                    $data = ['error'=>true, 'message'=>"Invalid response!"];
                }
            } else curl_close($ch);

            $destination = base_path()."/tmp/update/".$version.".zip"; 
            $destination_path = base_path()."/tmp/update/"; 
            $file = fopen($destination, "w+");
            if(!$file){
                $data = ['error'=>true, 'message'=>"Update file path error!"];
            }
            fputs($file, $data_file);
            fclose($file);            

            //ob_flush();
            $extract_command = str_replace("/","/", "cd {$destination_path} && unzip  {$version}.zip -d {$destination_path}/{$version}");
            $ret  = shell_exec($extract_command);
            unlink(base_path()."/tmp/update/{$version}.zip");
            
            //run preinstall script
            if (file_exists(base_path()."/tmp/update/".$version."/before_install.sh")) {
                $run_command = str_replace("\\","/", "cd {$destination_path}/{$version} && chmod a+x before_install.sh && sh before_install.sh");
                $ret  = shell_exec($run_command);
                unlink(base_path()."/tmp/update/".$version."/before_install.sh");
            }
            
            //copy
            $run_command = str_replace("\\","/", "cp -a {$destination_path}/{$version}/. ".base_path()."/");
            shell_exec($run_command);

            //run migrate
            $run_command = str_replace("\\","/", "cd ".base_path()." && php artisan migrate");
            $ret  = shell_exec($run_command);

            //run seeders
            $run_command = str_replace("\\","/", "cd ".base_path()." && php artisan db:seed --class=UpdateVersion".str_replace(".","",$version));
            $ret  = shell_exec($run_command); 

            //clear cache seeders
            $run_command = str_replace("\\","/", "cd ".base_path()." && php artisan cache:clear");
            $ret  = shell_exec($run_command);            


            //run afterinstall script
            if (file_exists(base_path()."/tmp/update/".$version."/after_install.sh")) {
                $run_command = str_replace("\\","/", "cd {$destination_path}/{$version} && chmod a+x before_install.sh && sh after_install.sh");
                $ret  = shell_exec($run_command);
                unlink(base_path()."/tmp/update/".$version."/after_install.sh");
            }

            //remove dir
            File::deleteDirectory(base_path()."/tmp/update/{$version}");

            SystemController::saveSystemSettings();

            if (!isset($data['error'])) {
                $data['error'] = false;
            }
        }        

        return response()->json($data, 200);
    }



    public function getUserIpAddr(){
        $ipaddress = '';
        if (isset($_SERVER['HTTP_CLIENT_IP']))
            $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
        else if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
            $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
        else if(isset($_SERVER['HTTP_X_FORWARDED']))
            $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
        else if(isset($_SERVER['HTTP_FORWARDED_FOR']))
            $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
        else if(isset($_SERVER['HTTP_FORWARDED']))
            $ipaddress = $_SERVER['HTTP_FORWARDED'];
        else if(isset($_SERVER['REMOTE_ADDR']))
            $ipaddress = $_SERVER['REMOTE_ADDR'];
        else
            $ipaddress = 'UNKNOWN';    
        return $ipaddress;
     }    
}
