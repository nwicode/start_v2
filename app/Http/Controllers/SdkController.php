<?php

namespace App\Http\Controllers;

use Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use App\Helpers\Helper;
use App\Models\Components;


class SdkController extends Controller
{
    //
	protected $_gradle_version = "7.4.2";
	protected $_android_commandline_tools_file = "commandlinetools-linux-8092744_latest.zip";
	protected $_android_api_level = "30";
	protected $_android_build_tools_version = "30.0.2";
	
	public $json = false;

	//check settigns
    public function checkSDK() {
        $user = auth()->user();
		$return = [];
        if ( $this->json || $user['user_type_id'] === 1) {

            $return = [];
			
			// gradle
            $gradle_dir = base_path() . DIRECTORY_SEPARATOR ."builder" . DIRECTORY_SEPARATOR . "tools" . DIRECTORY_SEPARATOR . "gradle-" . $this->_gradle_version;
            $return['gradle_dir'] = $gradle_dir;
            if(!File::exists($gradle_dir . DIRECTORY_SEPARATOR ."bin" )) {
                // path does not exist
                $return['gradle_installed'] = false;
            } else {
                $return['gradle_installed'] = true;
            }
			
			//node_modules
			$ionic_dir = base_path() . DIRECTORY_SEPARATOR ."builder" . DIRECTORY_SEPARATOR . "build";
			$return['ionic_dir'] = $ionic_dir;
			$return['ionic_installing'] = false;
			$return['ionic_installed'] = false;
			if(File::exists(base_path() . DIRECTORY_SEPARATOR . "builder" .DIRECTORY_SEPARATOR. "ionic_installing.txt" ) || File::exists(base_path() . DIRECTORY_SEPARATOR . "builder" .DIRECTORY_SEPARATOR. "ionic_installing.process" )) {
					$return['ionic_installing'] = true;
					$return['ionic_installed'] = false;
			} else if(!File::exists($ionic_dir . DIRECTORY_SEPARATOR ."node_modules" )) {
				$return['ionic_installed'] = false;
				$return['ionic_installing'] = false;
			} else if(File::exists($ionic_dir . DIRECTORY_SEPARATOR ."node_modules" )) {
				$return['ionic_installed'] = true;
				$return['ionic_installing'] = false;
			}
			
			//android build tools
            $android_sdk_dir = base_path() . DIRECTORY_SEPARATOR ."builder" . DIRECTORY_SEPARATOR . "tools" . DIRECTORY_SEPARATOR . "android-sdk" ;
            $android_build_tools_dir = base_path() . DIRECTORY_SEPARATOR ."builder" . DIRECTORY_SEPARATOR . "tools" . DIRECTORY_SEPARATOR . "android-sdk" . DIRECTORY_SEPARATOR . "cmdline-tools" . DIRECTORY_SEPARATOR . "tools";
            $return['android_build_tools_dir'] = $android_build_tools_dir;
			if(File::exists(base_path() . DIRECTORY_SEPARATOR . "builder" .DIRECTORY_SEPARATOR. "android_sdk_installing.txt" ) || File::exists(base_path() . DIRECTORY_SEPARATOR . "builder" .DIRECTORY_SEPARATOR. "android_sdk_installing.process" )) {
				$return['android_build_tools_installed'] = false;
				$return['android_build_tools_installing'] = true;
			} else if(!File::exists($android_build_tools_dir . DIRECTORY_SEPARATOR ."bin" )) {
				$return['android_build_tools_installed'] = false;
				$return['android_build_tools_installing'] = false;
			} else if(File::exists($android_build_tools_dir . DIRECTORY_SEPARATOR ."bin" )) {
				$return['android_build_tools_installed'] = true;
				$return['android_build_tools_installing'] = false;
			}

			$is_linux = true;
			if (strpos(php_uname(),'Windows')!==false) $is_linux = false;			
			
			//cron
			$cron_found = false;
			$return['cron_run'] = "php ".base_path()."/artisan schedule:run";
			
			if ($is_linux) {
				exec('crontab -l', $data);
				foreach ($data as $r) {
					if (strpos($r,"schedule:run")!==false) $cron_found = true;
				}
				
			}
			$return['cron_found'] = $cron_found;



			//SourceGuardian = true;
			$SourceGuardian = false;
			if (!$this->json && $is_linux) {
				$actual_link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]/sourceguardian.php";
				$result = file_get_contents($actual_link);
				if ($result=="1") $SourceGuardian = true;
			}
			$return['sourceguardian'] = $SourceGuardian;
			
			//bash commands
			$bash_commands = [];
			$bash_commands[] = "export GRADLE_HOME={$gradle_dir}";
			$bash_commands[] = 'export PATH=$PATH:$GRADLE_HOME/bin';
			$bash_commands[] = 'export PATH=$PATH:'.$android_build_tools_dir.'/bin';
			$bash_commands[] = "export ANDROID_SDK_ROOT={$android_sdk_dir}";
			$return['bash_commands'] = $bash_commands;
			
			
			//check all errors
			$return['errors'] = !(/*$return['sourceguardian'] && */$return['android_build_tools_installed'] && $return['ionic_installed'] && $return['gradle_installed']);
			
            $response = response()->json($return, 200);
        } else {
            $response = response()->json(['error' => 'NOT_ADMIN'], 403);
        }
        
		if ($this->json) return $return; else return $response;
    }
	
	
	// install gradle script
    public function installGradle(Request $request) {
		set_time_limit(0);
        $user = auth()->user();
        if ($user['user_type_id'] === 1) {

            $log = [];
            $return = [];

			//make path
            $builder_dir = base_path() . DIRECTORY_SEPARATOR ."builder";
            $builder_tools_dir = base_path() . DIRECTORY_SEPARATOR ."builder" . DIRECTORY_SEPARATOR . "tools";
            $gradle_dir = base_path() . DIRECTORY_SEPARATOR ."builder" . DIRECTORY_SEPARATOR . "tools" . DIRECTORY_SEPARATOR . "gradle-" . $this->_gradle_version;
            $return['gradle_dir'] = $gradle_dir;

			//remove old dir
			File::deleteDirectory($gradle_dir);

			//download gradle
			$_gradle_url = "https://services.gradle.org/distributions/gradle-{$this->_gradle_version}-bin.zip";
			$command = "cd {$builder_tools_dir} && export GRADLE_VERSION={$this->_gradle_version} && wget {$_gradle_url} && unzip -d {$builder_tools_dir} gradle-{$this->_gradle_version}-bin.zip";
			$log["download_gradle"]['command'] = $command;
			$exec_result = shell_exec($command . " 2>&1");
			$log["download_gradle"]['log'] = $exec_result;

			//export PATH VALUES
			$command = "export GRADLE_HOME={$gradle_dir}";
			$exec_result = shell_exec($command . " 2>&1");
			$log["export_gradle_path"] = ['command'=>$command, "log"=>$exec_result];
			
			//set PATH VALUES
			$command = 'export PATH=$PATH:$GRADLE_HOME/bin';
			$exec_result = shell_exec($command . " 2>&1");
			$log["set_gradle_path"] = ['command'=>$command, "log"=>$exec_result];
			
			
			
			//remove archive
			File::delete($builder_tools_dir . DIRECTORY_SEPARATOR . "gradle-{$this->_gradle_version}-bin.zip" );

			//store log
			file_put_contents($builder_dir . "/install-gradle-".date("YmdHis").".log", print_r($log, true));
			
			$return['success'] = false;
            $gradle_dir = base_path() . DIRECTORY_SEPARATOR ."builder" . DIRECTORY_SEPARATOR . "tools" . DIRECTORY_SEPARATOR . "gradle-" . $this->_gradle_version;
            $return['gradle_dir'] = $gradle_dir;
            if(!File::exists($gradle_dir . DIRECTORY_SEPARATOR ."bin" )) {
                // path does not exist
                $return['gradle_installed'] = false;
            } else {
                $return['gradle_installed'] = true;;
                $return['success'] = true;;
            }


			$return['log'] = $log;
            $response = response()->json($return, 200);
        } else {
            $response = response()->json(['error' => 'NOT_ADMIN'], 403);
        }
        
        return $response;
    }	
	
	
	//isntall android sdk
	public function installAndroidTools() {
		set_time_limit(0);
        $user = auth()->user();
        if ($user['user_type_id'] === 1) {		
			
			//just create flag
			file_put_contents(base_path() . DIRECTORY_SEPARATOR ."builder". DIRECTORY_SEPARATOR .'android_sdk_installing.txt','This flag for installAndroidToolsCLI in schedule command');
		
			$response = response()->json(['UDPATE_PLANNED'], 200);
        } else {
            $response = response()->json(['error' => 'NOT_ADMIN'], 403);
        }		
		return $response;		
	}
	
	
	public function installAndroidToolsCLI() {

		//check flag 
		if(File::exists(base_path() . DIRECTORY_SEPARATOR . "builder" .DIRECTORY_SEPARATOR. "android_sdk_installing.txt" )) {
			//remove old flag and set new indicator
			file_put_contents(base_path() . DIRECTORY_SEPARATOR ."builder". DIRECTORY_SEPARATOR .'android_sdk_installing.process','NPM installs is running');
			File::delete(base_path() . DIRECTORY_SEPARATOR . "builder" .DIRECTORY_SEPARATOR. "android_sdk_installing.txt" );
			
		} else if(File::exists(base_path() . DIRECTORY_SEPARATOR . "builder" .DIRECTORY_SEPARATOR. "android_sdk_installing.process" )) {
			return;
		} else if(!File::exists(base_path() . DIRECTORY_SEPARATOR . "builder" .DIRECTORY_SEPARATOR. "android_sdk_installing.txt" )) {
			return;
		}
		
		
		set_time_limit(0);

            $log = [];
            $return = [];

			//make path
            $builder_dir = base_path() . DIRECTORY_SEPARATOR ."builder";
            $builder_tools_dir = base_path() . DIRECTORY_SEPARATOR ."builder" . DIRECTORY_SEPARATOR . "tools";
            $sdk_dir = base_path() . DIRECTORY_SEPARATOR ."builder" . DIRECTORY_SEPARATOR . "tools" . DIRECTORY_SEPARATOR . "android-sdk";
            $return['sdk_dir'] = $sdk_dir;

			//remove old dir
			File::deleteDirectory($sdk_dir);

			//download tools
			$_sdk_url = "https://dl.google.com/android/repository/".$this->_android_commandline_tools_file;
			$command = "cd {$builder_tools_dir} && wget {$_sdk_url} && unzip -d android-sdk {$this->_android_commandline_tools_file}";
			$log["download_commandlinetools"]['command'] = $command;
			$exec_result = shell_exec($command . " 2>&1");
			$log["download_commandlinetools"]['log'] = $exec_result;
			
		
			//https://stackoverflow.com/questions/65262340/cmdline-tools-could-not-determine-sdk-root
			/*
			Since new updates, there are some changes that are not mentioned in the documentation. After unzipping the command line tools package,
			the top-most directory you'll get is cmdline-tools. Rename the unpacked directory from cmdline-tools to tools, and place it under $C:/Android/cmdline-tools
			*/

			//move ^^^^^^^^^^^
			File::moveDirectory($sdk_dir . DIRECTORY_SEPARATOR ."cmdline-tools", $sdk_dir . DIRECTORY_SEPARATOR . "cmdline-tools-back");
			File::makeDirectory($sdk_dir . DIRECTORY_SEPARATOR ."cmdline-tools");
			File::makeDirectory($sdk_dir . DIRECTORY_SEPARATOR ."cmdline-tools" . DIRECTORY_SEPARATOR . "tools");
			File::copyDirectory($sdk_dir . DIRECTORY_SEPARATOR ."cmdline-tools-back", $sdk_dir . DIRECTORY_SEPARATOR ."cmdline-tools" . DIRECTORY_SEPARATOR . "tools");
			File::deleteDirectory($sdk_dir . DIRECTORY_SEPARATOR ."cmdline-tools-back");
			
			$command = 'export PATH=$PATH:'.$sdk_dir.'/cmdline-tools/tools/bin';
			$path = $command;
			$exec_result = shell_exec($command . " 2>&1");
			$log["export_android_tools_path"] = ['command'=>$command, "log"=>$exec_result];

			//chmod
			$command = "chmod -R 777 {$sdk_dir}";
			$exec_result = shell_exec($command . " 2>&1");
			$log["chmod_android_tools_path"] = ['command'=>$command, "log"=>$exec_result];			
			
			//set

			//download pladtforms
			//$command = $path . ' && yes | sdkmanager "platform-tools" "platforms;android-'.$this->_android_api_level.'" "build-tools;'.$this->_android_build_tools_version.'" "tools"';
			$command = $path . ' && yes | sdkmanager "platforms;android-'.$this->_android_api_level.'" "build-tools;'.$this->_android_build_tools_version.'" "tools"';
			$exec_result = shell_exec($command . " 2>&1");
			$log["install_platoforms_and_tools"] = ['command'=>$command, "log"=>$exec_result];

			
			//accept licenses with prev export path
			$command = $path . " && yes | sdkmanager --licenses";
			$exec_result = shell_exec($command . " 2>&1");
			$log["license_commandlinetools"] = ['command'=>$command, "log"=>$exec_result];
			
			
			//remove archive
			File::delete($builder_tools_dir . DIRECTORY_SEPARATOR . $this->_android_commandline_tools_file );

			//store log
			file_put_contents($builder_dir . "/install-commandlinetools-".date("YmdHis").".log", print_r($log, true));
			
			//if dir is created 
			$return['success'] = false;
            $android_build_tools_dir = base_path() . DIRECTORY_SEPARATOR ."builder" . DIRECTORY_SEPARATOR . "tools" . DIRECTORY_SEPARATOR . "android-sdk" . DIRECTORY_SEPARATOR . "cmdline-tools";
            $return['android_build_tools_dir'] = $android_build_tools_dir;
            if(!File::exists($android_build_tools_dir . DIRECTORY_SEPARATOR ."bin" )) {
                // path does not exist
                $return['android_build_tools_installed'] = false;
            } else {
                $return['android_build_tools_installed'] = true;
                $return['success'] = true;
            }

			File::delete(base_path() . DIRECTORY_SEPARATOR . "builder" .DIRECTORY_SEPARATOR. "android_sdk_installing.txt" );
			File::delete(base_path() . DIRECTORY_SEPARATOR . "builder" .DIRECTORY_SEPARATOR. "android_sdk_installing.process" );
			
			$return['log'] = $log;
            $response = response()->json($return, 200);
        
        return $response;		
	}
	
	//make flag to prepare build folder and install NPM pacakges
	public function installIonic(Request $request) {
		set_time_limit(0);
        $user = auth()->user();
        if ($user['user_type_id'] === 1) {		
			
			//just create flag
			file_put_contents(base_path() . DIRECTORY_SEPARATOR ."builder". DIRECTORY_SEPARATOR .'ionic_installing.txt','This flag for installIonicCLI in schedule command');
		
			$response = response()->json(['UDPATE_PLANNED'], 200);
        } else {
            $response = response()->json(['error' => 'NOT_ADMIN'], 403);
        }		
		return $response;
	}
	
	
	//intall NPM packages
	public function installIonicCLI() {
		//check flag 
		if(File::exists(base_path() . DIRECTORY_SEPARATOR . "builder" .DIRECTORY_SEPARATOR. "ionic_installing.txt" )) {
			//remove old flag and set new indicator
			file_put_contents(base_path() . DIRECTORY_SEPARATOR ."builder". DIRECTORY_SEPARATOR .'ionic_installing.process','NPM installs is running');
			File::delete(base_path() . DIRECTORY_SEPARATOR . "builder" .DIRECTORY_SEPARATOR. "ionic_installing.txt" );
			
		} else if(File::exists(base_path() . DIRECTORY_SEPARATOR . "builder" .DIRECTORY_SEPARATOR. "ionic_installing.process" )) {
			return;
		} else if(!File::exists(base_path() . DIRECTORY_SEPARATOR . "builder" .DIRECTORY_SEPARATOR. "ionic_installing.txt" )) {
			return;
		}
		
		set_time_limit(0);
			
		$log = [];
		$return = [];			
		
		

		$builder_dir = base_path() . DIRECTORY_SEPARATOR ."builder";
		$ionic_dir = base_path() . DIRECTORY_SEPARATOR ."builder" . DIRECTORY_SEPARATOR . "build";
		$ionic_empty = base_path() . DIRECTORY_SEPARATOR ."builder" . DIRECTORY_SEPARATOR . "empty";
		
		//remove old build
		File::deleteDirectory($ionic_dir);
		
		//copy from empty project
		File::copyDirectory($ionic_empty,$ionic_dir);
		file_put_contents($ionic_dir.'/read.me','This folder need to build application');
		$package_json_content = file_get_contents($ionic_dir.'/package.json');

			
		//Scan modules visual
		$search_in_dir = public_path() . '/storage/components/visual';
		$modules = [];
		$modules_dirs = scandir($search_in_dir);
		$modules_dirs = array_diff($modules_dirs, array('.', '..'));
		foreach($modules_dirs as $module_dir) {
			if (file_exists($search_in_dir. "/" . $module_dir . "/package.json")) {
				$json_content = file_get_contents($search_in_dir. "/" . $module_dir . "/package.json");
				$package_json = json_decode($json_content,true);
				if ($package_json === null && json_last_error() !== JSON_ERROR_NONE) {
					//echo "incorrect data";
				} else {
					$modules[]=$package_json;
				}					
			}
		}
		
		$search_in_dir = public_path() . '/storage/components/modules/system';
		$modules_dirs = scandir($search_in_dir);
		$modules_dirs = array_diff($modules_dirs, array('.', '..'));
		foreach($modules_dirs as $module_dir) {
			if (file_exists($search_in_dir. "/" . $module_dir . "/package.json")) {
				$json_content = file_get_contents($search_in_dir. "/" . $module_dir . "/package.json");
				$package_json = json_decode($json_content,true);
				if ($package_json === null && json_last_error() !== JSON_ERROR_NONE) {
					//echo "incorrect data";
				} else {
					$modules[]=$package_json;
				}					
			}
		}			
		
		
		// run npm install
		$command = "cd {$ionic_dir} && npm install";
		$exec_result = shell_exec($command . " 2>&1");
		$log["install_npm_modules"] = ['command'=>$command, "log"=>$exec_result];	
		
		// run cordova resources
		$command = "cd {$ionic_dir} && npm install cordova-res";
		$exec_result = shell_exec($command . " 2>&1");
		$log["install_npm_cordova_res"] = ['command'=>$command, "log"=>$exec_result];			
		
		$return['modules'] = $modules;
		foreach ($modules as $module) {
			if (isset($module['run_command']) && is_array($module['run_command'])) {
				foreach($module['run_command'] as $run) {
					$command = "cd {$ionic_dir} && ".$run;
					$exec_result = shell_exec($command . " 2>&1");
					$log["install_npm_modules_".$module['code']] = ['command'=>$command, "log"=>$exec_result];
				}
			}
			
		}

		$return['log'] = $log;
		
		file_put_contents($ionic_dir.'/package.json',$package_json_content);
		file_put_contents($builder_dir . "/install-ionic-".date("YmdHis").".log", print_r($log, true));
		File::delete(base_path() . DIRECTORY_SEPARATOR . "builder" .DIRECTORY_SEPARATOR. "ionic_installing.txt" );
		File::delete(base_path() . DIRECTORY_SEPARATOR . "builder" .DIRECTORY_SEPARATOR. "ionic_installing.process" );
		
		$response = response()->json($return, 200);

        return $response;
    }			
}
