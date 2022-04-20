<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Application;
use App\Models\Application_Languages;
use App\Models\Application_IAP;
use App\Models\Application_Page;
use App\Models\Components;
use App\Models\SystemSettings;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;
use App\Helpers\Helper;
use App\Http\Controllers\SdkController;

class Builder extends Model
{
    use HasFactory;

	protected $app;
	protected $pages;
	protected $start_page;
	protected $components;
	protected $components_pages = [];

	private $log = [];

	public $template = "default";
	public $_is_first_build = false;
	public $_is_rebuild = false;
	public $_copy_full_template = false;
	public $_copy_only_template = false;
	public $_remove_source_folder = false;
	public $_copy_resources = false;
	public $_generate_www = false;

	public $_set_path_environment = false;
	public $_install_ionic_capacitor = false;
	public $_build_ionic = false;
	public $_capacitor_sync = false;
	public $_add_android_platform = false;
    public $_add_ios_platform = false;
	public $_generate_splash_and_icons = false;
    public $_generate_splash_and_icons_for_ios = false;
	public $_build_android_debug_apk = false;
	public $_copy_debug_apk_to_folder = false;
	public $_make_zip_sources = false;
    public $_make_zip_ios_sources = false;
	public $_remove_android_folder = false;
    public $_remove_ios_folder = false;
	public $_remove_node_modules_folder = false;
	public $_apk_file = "";
	public $_sources_file = "";

	public function initApplication(Application $app) {
		$this->app = $app;
		$this->pages = Application_Page::where("app_id",$app->id)->where("type",'<>','start')->get();
		$this->start_page = Application_Page::where("app_id",$app->id)->where("type",'start')->first();
		$_components = new Components();
		$this->components =$_components->getAvailableModulesSystem($app->id);
	}

	/**
	 * Run commands (new version)
	 */
	public function run() {

		//set flag
		$this->app->build_now = true;
		$this->app->save();		
		
		//clear builder
		$this->clearBuilderFolder();
		
		//first, we prepate src folder, it need every build run
		$this->removeSourceFolder();
		
		//copy resource to sources
		$this->CopyResources();
		
		//copy template withou node_modules
		$this->CopyTemplate();
		
		//create ionic sources
		$this->setWidgetId();
		
		
		//add fonts

        $this->setFonts();

		//add colors
		$this->setColors();

		//set start page animation
		$this->setStartPage();

		//create environments file
		$this->createEnvironments();

		//Info-list and google-json
		$this->saveFirebaseFiles();

		//Apply changes to app.module and app.components
		$this->applyAppComponents();

		//Copy components files to source
		$this->copyComponents();

		//create page route
		$this->createRoutes();

		//Add dependency in package.json
		$this->addDependencies();

		//create pages
		$this->createPages();
		
		//copy to builder
		$this->copyToBuilder();

		//generate WWW
		if ($this->_generate_www) {
			//first, make www
			$this->buildIonicWWW();
			
			///then copy back
			$this->copyWWWtoBack();
		}

		//generate WWW for ionic
		if ($this->_build_ionic) $this->buildIonic();
		
		//add platforms
		if ($this->_add_android_platform) $this->addAndroidPlatform();
        if ($this->_add_ios_platform) $this->addIOSPlatform();
		
		//create resources
		if ($this->_generate_splash_and_icons) $this->generateSplashAndIcons();
        if ($this->_generate_splash_and_icons_for_ios) $this->generateSplashAndIconsForIOS();
		
		//sync www with platforms
        if ($this->_capacitor_sync) $this->capSync();
		
		//build APK
		if ($this->_build_android_debug_apk) {
			$this->buildAndroidDebugAPK();
			$this->_apk_file = $this->copyDebugApkToFolder();
		}

		//make android sources
		if ($this->_make_zip_sources) {
			$this->_sources_file = $this->makeZipSources();
		}

		//clear flag
		$this->app->build_now = false;
		if ($this->_is_first_build) $this->app->need_first_build = false;
		if ($this->_is_rebuild) $this->app->need_www_build = false;
		if ($this->_is_rebuild) $this->app->request_www_build = false;
		$this->app->save();

		$file_name="-" . date("YmdHis") . ".log";
		if ($this->_is_first_build) $this->storeLog("firstbuild".$file_name);
		else if ($this->_is_rebuild) $this->storeLog("rebuild".$file_name);
		else $this->storeLog("other".$file_name);
		return $this->log;
		
	}


	/**
	 * Run commands
	 * Old
	 */
	public function run1() {

		//set flag
		$this->app->build_now = true;	print_r($this->log);
		$this->app->save();

		if ($this->_set_path_environment) $this->setPathEnvironment(); print_r($this->log);

		//clear source folder, if need if
		if ($this->_remove_source_folder) $this->removeSourceFolder(); print_r($this->log);

		//copy template

		if ($this->_copy_full_template) $this->CopyTemplate(); print_r($this->log);

		//copy resource

		if ($this->_copy_resources) $this->CopyResources(); print_r($this->log);

		//next, we generate our sources
		//Set name and widget id
		print_r("setWidgetId");

		$this->setWidgetId(); print_r($this->log);
		
		
		//add fonts

        $this->setFonts();

		//add colors
		$this->setColors();

		//set start page animation
		$this->setStartPage();

		//create environments file
		$this->createEnvironments();

		//Info-list and google-json
		$this->saveFirebaseFiles();

		//Apply changes to app.module and app.components
		$this->applyAppComponents();

		//Copy components files to source
		$this->copyComponents();

		//create page route
		$this->createRoutes();

		//Add dependency in package.json
		$this->addDependencies();

		//create pages
		$this->createPages();




/*
        if ($this->_install_ionic_capacitor) $this->installIonicCapacitor();

		//install dep
		$this->installNpmDependencies();

		//generate WWW
		if ($this->_generate_www) $this->buildIonicWWW();
		$file = "";
		if ($this->_build_ionic) $this->buildIonic(); print_r($this->log);
		if ($this->_add_android_platform) $this->addAndroidPlatform(); print_r($this->log);
        if ($this->_add_ios_platform) $this->addIOSPlatform(); print_r($this->log);
        if ($this->_capacitor_sync) $this->capSync(); print_r($this->log);
		if ($this->_generate_splash_and_icons) $this->generateSplashAndIcons(); print_r($this->log);
        if ($this->_generate_splash_and_icons_for_ios) $this->generateSplashAndIconsForIOS(); print_r($this->log);
		if ($this->_build_android_debug_apk) $this->buildAndroidDebugAPK(); print_r($this->log);
		if ($this->_copy_debug_apk_to_folder) $this->_apk_file = $this->copyDebugApkToFolder(); print_r($this->log);
		if ($this->_make_zip_sources) $this->_sources_file = $this->makeZipSources(); print_r($this->log);
        if ($this->_make_zip_ios_sources) $this->makeZipIOSSources(); print_r($this->log);
		if ($this->_remove_android_folder) $this->removeAndroidFolder(); print_r($this->log);
        if ($this->_remove_ios_folder) $this->removeIOSFolder(); print_r($this->log);
        if ($this->_remove_node_modules_folder) $this->removeNodeModulesFolder(); print_r($this->log);
*/

		//clear flag
		$this->app->build_now = false;
		if ($this->_is_first_build) $this->app->need_first_build = false;
		if ($this->_is_rebuild) $this->app->need_www_build = false;
		if ($this->_is_rebuild) $this->app->request_www_build = false;
		$this->app->save();

		$file_name="-" . date("YmdHis") . ".log";
		if ($this->_is_first_build) $this->storeLog("firstbuild".$file_name);
		else if ($this->_is_rebuild) $this->storeLog("rebuild".$file_name);
		else $this->storeLog("other".$file_name);
		return $this->log;
	}

	//echo formatted operation result
	private function echoResult($title,$result) {
		echo "[{$title}]:\n=====[start]=====\n";
		echo "{$result}\n=====[end]=====\n\n\n";
		
	}

	//copy generated sources to builder
	private function copyToBuilder() {
		
		$app_dir_template = public_path() . DIRECTORY_SEPARATOR . 'storage'. DIRECTORY_SEPARATOR .'application' . DIRECTORY_SEPARATOR . $this->app->id . '-'.$this->app->unique_string_id . DIRECTORY_SEPARATOR .'sources'. DIRECTORY_SEPARATOR;
		$builder_path = base_path() . DIRECTORY_SEPARATOR . 'builder' . DIRECTORY_SEPARATOR . "build". DIRECTORY_SEPARATOR ;

		//copy root files
		$files_to_copy = File::files($app_dir_template);
		foreach($files_to_copy as $file) File::copy($file->getPathname(),$builder_path . $file->getFilename());		
		
		//copy resources dir
		File::copyDirectory($app_dir_template . DIRECTORY_SEPARATOR ."resources", $builder_path . DIRECTORY_SEPARATOR ."resources");
		
		File::copyDirectory($app_dir_template . DIRECTORY_SEPARATOR ."src", $builder_path . DIRECTORY_SEPARATOR ."src");
		
	}
	
	private function removeSourceFolder() {
		$app_dir_template = public_path() . DIRECTORY_SEPARATOR . 'storage'. DIRECTORY_SEPARATOR .'application' . DIRECTORY_SEPARATOR . $this->app->id . '-'.$this->app->unique_string_id . DIRECTORY_SEPARATOR .'sources' . DIRECTORY_SEPARATOR ;
		File::cleanDirectory($app_dir_template);
		$this->echoResult("Remove sources folder","No output");
	}
	
	//Remove all sources folder from buidler directory
	private function clearBuilderFolder() {
		//Remove in builder/build all sources, resources and other
		$build_path = base_path() . DIRECTORY_SEPARATOR ."builder" . DIRECTORY_SEPARATOR ."build";
		File::deleteDirectory($build_path . DIRECTORY_SEPARATOR . "src");
		File::deleteDirectory($build_path . DIRECTORY_SEPARATOR . "android");
		File::deleteDirectory($build_path . DIRECTORY_SEPARATOR . "ios");
		File::deleteDirectory($build_path . DIRECTORY_SEPARATOR . "resources");
		File::deleteDirectory($build_path . DIRECTORY_SEPARATOR . "www");		
		$this->echoResult("Clear builder folder","No output");
	}


	/**
	 * Store log data to file
	 */
	private function storeLog($file_name){
		$app_dir = public_path() . '/storage/application/' . $this->app->id . '-'.$this->app->unique_string_id.'/';
		//create dir if not exists
		if (!file_exists($app_dir.'logs')) {
			mkdir($app_dir.'logs', 0777, true);
		}

		$log = "";
		foreach($this->log as $k=>$value) {
			$log .= "Operation {$k}:\n{$value}\n\n";
		}

		file_put_contents($app_dir.'logs/'.$file_name,$log);
	}


    /**
     * copy selected temlplate to applciation path
     */
	private function CopyTemplate() {
		/*if (!is_dir(public_path() . '/storage/application/' . $this->app->id . '-'.$this->app->unique_string_id.'/sources')) mkdir(public_path() . '/storage/application/' . $this->app->id . '-'.$this->app->unique_string_id.'/sources');

		$app_dir_template = public_path() . '/storage/application/' . $this->app->id . '-'.$this->app->unique_string_id.'/sources/';
		$app_dir_template = str_replace("\\","/",$app_dir_template);
		$template_path = base_path() . '/templates/' . $this->template."/template";
		$template_path = str_replace("\\","/",$template_path);
		\Log::info("Try copy template {$this->template} from {$template_path} to {$app_dir_template}");

		//$this->log["CopyTemplate"] = shell_exec("cp -R " . $template_path . "/* " . $app_dir_template);

		//$copy_template_result = shell_exec("cp -R " . $template_path . " " . $app_dir_template);
		
		$copy_template_result = shell_exec("cd " . $template_path . " && tar cf - . | (cd ". $app_dir_template ." && tar xvf -) 2>&1");
		$this->log["CopyTemplate"] = $copy_template_result;*/
		
		$app_dir_template = public_path() . DIRECTORY_SEPARATOR . 'storage'. DIRECTORY_SEPARATOR .'application' . DIRECTORY_SEPARATOR . $this->app->id . '-'.$this->app->unique_string_id . DIRECTORY_SEPARATOR .'sources'. DIRECTORY_SEPARATOR;
		$template_path = base_path() . DIRECTORY_SEPARATOR . 'templates' . DIRECTORY_SEPARATOR . $this->template. DIRECTORY_SEPARATOR ."template". DIRECTORY_SEPARATOR;
		
		$files_to_copy = File::files($template_path);
		foreach($files_to_copy as $file) File::copy($file->getPathname(),$app_dir_template . $file->getFilename());

		File::copyDirectory($template_path . DIRECTORY_SEPARATOR ."src", $app_dir_template . DIRECTORY_SEPARATOR ."src");
		$this->echoResult("Copy files from template to source","No output");
	}

	/**
	 * Copy resources dir
	 */
	private function CopyResources() {
		$app_dir_template = public_path() . DIRECTORY_SEPARATOR . 'storage'. DIRECTORY_SEPARATOR .'application' . DIRECTORY_SEPARATOR . $this->app->id . '-'.$this->app->unique_string_id. DIRECTORY_SEPARATOR .'sources' . DIRECTORY_SEPARATOR;
		$app_dir = public_path() . DIRECTORY_SEPARATOR . 'storage'. DIRECTORY_SEPARATOR .'application' . DIRECTORY_SEPARATOR . $this->app->id . '-'.$this->app->unique_string_id. DIRECTORY_SEPARATOR;

		//copy and generate resources
		File::makeDirectory($app_dir_template );
		File::makeDirectory($app_dir_template. DIRECTORY_SEPARATOR . "src" );
		File::makeDirectory($app_dir_template. DIRECTORY_SEPARATOR . "src" . DIRECTORY_SEPARATOR . "assets");
		File::makeDirectory($app_dir_template. DIRECTORY_SEPARATOR . "src" . DIRECTORY_SEPARATOR . "assets". DIRECTORY_SEPARATOR . "resources");
		$copy_result = shell_exec("cp -a {$app_dir}resources/. {$app_dir_template}src/assets/resources/ 2>&1");
		$this->echoResult("Copy resources to app source assets folder",$copy_result);
		$copy_result = shell_exec("cp -a {$app_dir}resources/. {$app_dir_template}resources/ 2>&1");
		$this->echoResult("Copy resources to app source folder",$copy_result);
	}



	private function xcopy($source, $dest, $permissions = 0755)
	{
		$sourceHash = $this->hashDirectory($source);
		// Check for symlinks
		if (is_link($source)) {
			return @symlink(readlink($source), $dest);
		}

		// Simple copy for a file
		if (is_file($source)) {
			return copy($source, $dest);
		}

		// Make destination directory
		if (!is_dir($dest)) {
			mkdir($dest, $permissions);
		}

		// Loop through the folder
		$dir = dir($source);
		while (false !== $entry = $dir->read()) {
			// Skip pointers
			if ($entry == '.' || $entry == '..') {
				continue;
			}

			// Deep copy directories
			if($sourceHash != $this->hashDirectory($source."/".$entry)){
				 $this->xcopy("$source/$entry", "$dest/$entry", $permissions);
			}
		}

		// Clean up
		$dir->close();
		return true;
	}

	// In case of coping a directory inside itself, there is a need to hash check the directory otherwise and infinite loop of coping is generated

	private function hashDirectory($directory){
		if (! is_dir($directory)){ return false; }

		$files = array();
		$dir = dir($directory);

		while (false !== ($file = $dir->read())){
			if ($file != '.' and $file != '..') {
				if (is_dir($directory . '/' . $file)) { $files[] = $this->hashDirectory($directory . '/' . $file); }
				else { $files[] = md5_file($directory . '/' . $file); }
			}
		}

		$dir->close();

		return md5(implode('', $files));
	}


	/**
	 * Set applaiction widget id, name and description
	 */
	private function setWidgetId() {
		$app = $this->app;
		$app_dir_template = public_path() . '/storage/application/' . $app->id . '-'.$app->unique_string_id.'/sources/';
		$app_dir_template = str_replace("\\","/",$app_dir_template);


		$content = file_get_contents($app_dir_template .'capacitor.config.ts');
		$content = str_replace("com.application.template",$app->name,$content);
		$content = str_replace("io.ionic.starter",$app->bundle_id,$content);

		//background colors
		$splash_settings = "";
		if ($app->splashscreen_show_spinner) $splash_settings .= "showSpinner: true,\n"; else $splash_settings .= "showSpinner: false,\n";
		$splash_settings .= "spinnerColor: '".$app->splashscreen_spinner_color."',\n";
		$splash_settings .= "launchShowDuration: ".$app->splashscreen_timeout.",\n";
		$splash_settings .= "backgroundColor: '".$app->splashscreen_background_color."',\n";
		$splash_settings .= "launchAutoHide: true,\n";
		$splash_settings = "SplashScreen: {\n".$splash_settings."}\n";
		$splash_settings = "plugins: {\n".$splash_settings."},\n";
		$content = str_replace("webDir: 'www',","webDir: 'www',\n".$splash_settings,$content);

		file_put_contents($app_dir_template .'capacitor.config.ts',$content);

		$content = file_get_contents($app_dir_template .'ionic.config.json');
		$content = str_replace("com.application.template",$app->name,$content);
		$content = str_replace("io.ionic.starter",$app->bundle_id,$content);
		file_put_contents($app_dir_template .'ionic.config.json',$content);

		$content = file_get_contents($app_dir_template .'src/index.html');
		$content = str_replace("com.application.template",$app->name,$content);
		$content = str_replace("io.ionic.starter",$app->bundle_id,$content);
		file_put_contents($app_dir_template .'/src/index.html',$content);

        //run event, if need
        $this->runInstallEvent("afterSetWidgetId");
		$this->echoResult("Set widget id","No output");
	}

    /**
     * Copy fonts to application sources.
     *
     * @param string $from path where fonts are located
     * @param string $to path path where fonts are copied
     */
    private function copyFonts(string $from, string $to)
    {
        if (is_dir($from)) {
            if (!file_exists($to)) {
                mkdir($to);
            }
            $d = dir($from);
            while (false !== ($entry = $d->read())) {
                if ($entry == "." || $entry == "..") continue;
                $this->copyFonts("$from/$entry", "$to/$entry");
            }
            $d->close();
        } else copy($from, $to);
    }

    /**
     * Copy fonts and attach them global.scss.
     */
    private function setFonts() {
        $app = $this->app;
        $app_dir_template = public_path() . '/storage/application/' . $app->id . '-'.$app->unique_string_id.'/sources/';
        $app_dir_template = str_replace("\\","/",$app_dir_template);
        $content = file_get_contents($app_dir_template .'src/global.scss');

        if (file_exists(public_path() . '/storage/application/' . $app->id . '-'.$app->unique_string_id.'/fonts')) {
            $this->copyFonts(public_path() . '/storage/application/' . $app->id . '-' . $app->unique_string_id . '/fonts', public_path() . '/storage/application/' . $app->id . '-' . $app->unique_string_id . '/sources/src/assets/fonts');
            $fonts = scandir(public_path() . '/storage/application/' . $app->id . '-' . $app->unique_string_id . '/sources/src/assets/fonts');

            $content .= "\n/* User fonts */\n";

            for ($i = 0; $i < count($fonts); $i++) {
                if (!is_dir(public_path() . '/storage/application/' . $app->id . '-' . $app->unique_string_id . '/sources/src/assets/fonts/' . $fonts[$i])) {
                    $content .= "\n@import url(\"" . './assets/fonts/' . $fonts[$i] . "\");";
                }
            }

            $content .= "\n";

            file_put_contents($app_dir_template . 'src/global.scss', $content);
        }

        //run event, if need
        $this->runInstallEvent("afterSetFonts");
		$this->echoResult("Set fonts","No output");
    }

	/**
	*	Write users color and redefine system color to global.scss
	*/
	private function setColors() {
	    $app = $this->app;
		$app_dir_template = public_path() . '/storage/application/' . $app->id . '-'.$app->unique_string_id.'/sources/';
		$app_dir_template = str_replace("\\","/",$app_dir_template);
		$content = file_get_contents($app_dir_template .'src/global.scss');

        $content .= "\n /* Define user system colors */\n";
		$content .= ":root {\n";

		$colors = $app->getColorsArray();
		foreach ($colors as $color) {

			//unnamed colros
			if ($color->color_type=="system" && empty($color->named)) {
				$content .= "{$color->color_name}: {$color->color_value};\n";
			}

			//named colors
			if ($color->color_type=="system" && !empty($color->named)) {
				$content .= "--ion-color-{$color->named}: {$color->color_value};\n";
				$content .= "--ion-color-{$color->named}-rgb: {$color->color_value_rgb};\n";
				$content .= "--ion-color-{$color->named}-contrast: {$color->color_value_contrast};\n";
				$content .= "--ion-color-{$color->named}-contrast-rgb: {$color->color_value_contrast_rgb};\n";
				$content .= "--ion-color-{$color->named}-shade: {$color->color_value_shade};\n";
				$content .= "--ion-color-{$color->named}-tint: {$color->color_value_tint};\n";
				$content .= "\n";
			}

			//user defined colors colors
			if ($color->color_type=="user") {
				$content .= "--ion-color-{$color->named}: {$color->color_value};\n";
				$content .= "--ion-color-{$color->named}-rgb: {$color->color_value_rgb};\n";
				$content .= "--ion-color-{$color->named}-contrast: {$color->color_value_contrast};\n";
				$content .= "--ion-color-{$color->named}-contrast-rgb: {$color->color_value_contrast_rgb};\n";
				$content .= "--ion-color-{$color->named}-shade: {$color->color_value_shade};\n";
				$content .= "--ion-color-{$color->named}-tint: {$color->color_value_tint};\n";
				$content .= "\n";
			}


		}
		$content .= "}\n\n";

		// next part user colors
		foreach ($colors as $color) {
			if ($color->color_type=="user") {
				$content .= ".ion-color-{$color->named} {\n";
				$content .= "--ion-color-base: var(--ion-color-{$color->named});\n";
				$content .= "--ion-color-base-rgb: var(--ion-color-{$color->named}-rgb);\n";
				$content .= "--ion-color-contrast: var(--ion-color-{$color->named}-contrast);\n";
				$content .= "--ion-color-contrast-rgb: var(--ion-color-{$color->named}-contrast-rgb);\n";
				$content .= "--ion-color-shade: var(--ion-color-{$color->named}-shade);\n";
				$content .= "--ion-color-shade-rgb: var(--ion-color-{$color->named}-shade-rgb);\n";
				$content .= "}\n\n";
			}
		}
		file_put_contents($app_dir_template .'src/global.scss',$content);

        //run event, if need
        $this->runInstallEvent("afterSetColors");
		$this->echoResult("Set colors","No output");
	}


	/**
	* Create routing page
	*/

	private function createRoutes() {
		$app_dir_template = public_path() . '/storage/application/' . $this->app->id . '-'.$this->app->unique_string_id.'/sources/';
		$routes = [];
		foreach($this->pages as $page) $routes[]="{/*".$page->name.", page id ".$page->id."*/ path: 'page".$page->id."', loadChildren: () => import('./page".$page->id."/page".$page->id.".module').then( m => m.Page".$page->id."PageModule)}";

		//Load routes from modules
		$app_routes = [];
		foreach ($this->components as $component) {
		    if (file_exists(public_path() . '/storage/components/' . $component['package_info']['category'] . "/" . $component['package_info']['type'] . "/" . $component['package_info']['code'] . "/installs/component_data.php")) {
                include(public_path() . '/storage/components/' . $component['package_info']['category'] . "/" . $component['package_info']['type'] . "/" . $component['package_info']['code'] . "/installs/component_data.php");
            } else if (file_exists(public_path() . '/storage/components/' .  $component['package_info']['type'] . "/" . $component['package_info']['code'] . "/installs/component_data.php")) {
                include(public_path() . '/storage/components/' .  $component['package_info']['type'] . "/" . $component['package_info']['code'] . "/installs/component_data.php");
            }
                if (isset($component_data['app.routing-module.ts'])) {
                    foreach ($component_data['app.routing-module.ts'] as $route) {
                        $routes[] = $route;
                    }
                }

		}


		$content = "
			import { NgModule } from '@angular/core';
			import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

			const routes: Routes = [
			".implode(",\n",$routes)."
			];

			@NgModule({
			imports: [
				RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
			],
			exports: [RouterModule]
			})
			export class AppRoutingModule { }

		";
		file_put_contents($app_dir_template ."src/app/app-routing.module.ts",$content);

        //run event, if need
        $this->runInstallEvent("afterCreateRoutes");
		$this->echoResult("Make Routes file","No output");
	}


/**
	* Set appliaction start page settings
	*/
	private function setStartPage() {

		$app = $this->app;

		$app_dir_template = public_path() . '/storage/application/' . $app->id . '-'.$app->unique_string_id.'/sources/';

		$css = "";
		$html = "";
		$page = Application_Page::where("app_id",$app->id)->where("type","start")->first();
		$start_animations = StartPageAnimation::all();



		//bg image not use - simple add bg color
		if ($page->background_image=="none") {
			$css .= "	--background: var(" . $page->background . ");\n";
		} else if ($page->background_image=="default") {

			if (!empty($app->background_image) && $app->background_image!='' && $app->background_image!='none' && $app->background_image!='-') {
				$css .= "	--background: url('../../assets/resources/default_background.png') " . $app->background_image_mode." center /" .$app->background_image_size. ";\n ";
			} else {
				$css .= "	--background: var(" . $page->background . ");\n";
			}

		} else {
			// custom bg only for this page
			$css .= "	--background: url('../../assets/resources/".$page->background_image."') " . $page->background_image_mode." center /" .$page->background_image_size. ";\n ";
		}

		//start animation
		if ($page->current_animation==0) {
			$custom_app_animations = ApplicationStartAnimation::where('app_id', $app->id)->first();
			if ($custom_app_animations) {
                $html .= $custom_app_animations->html;
                $css .= $custom_app_animations->css;
			}
		} else {


			//redefine animation color, if exists
			try {
				$jsonObj  = json_decode($page->current_animation_settings, true);
				if ($jsonObj === null && json_last_error() !== JSON_ERROR_NONE) {
					// none
				} else {

					foreach($start_animations as $sa_index=>$sa) {

						if ($sa->id === $page->current_animation) {

							$html .= $sa->html;
							$css .= $sa->css;

							//print_r($sa);
							//print_r($sa_index);

							//replaces
							//$html = str_replace("{{START_LOADING_TEXT}}","Loading..",$html);
							if (isset($jsonObj['color1'])) {
								$html = str_replace("{{color1}}",$jsonObj['color1'],$html);
								$css = str_replace("{{color1}}",$jsonObj['color1'],$css);
							}
							if (isset($jsonObj['color2'])) {
								$html = str_replace("{{color2}}",$jsonObj['color2'],$html);
								$css = str_replace("{{color2}}",$jsonObj['color2'],$css);
							}
							if (isset($jsonObj['color3'])) {
								$html = str_replace("{{color3}}",$jsonObj['color3'],$html);
								$css = str_replace("{{color3}}",$jsonObj['color3'],$css);
							}
							if (isset($jsonObj['color4'])) {
								$html = str_replace("{{color4}}",$jsonObj['color4'],$html);
								$css = str_replace("{{color4}}",$jsonObj['color4'],$css);
							}
							if (isset($jsonObj['color5'])) {
								$html = str_replace("{{color5}}",$jsonObj['color5'],$html);
								$css = str_replace("{{color5}}",$jsonObj['color5'],$css);
							}

							//replace default
							$html = str_replace("{{color1}}",$sa->color1,$html);
							$html = str_replace("{{color2}}",$sa->color2,$html);
							$html = str_replace("{{color3}}",$sa->color3,$html);
							$html = str_replace("{{color4}}",$sa->color4,$html);
							$html = str_replace("{{color5}}",$sa->color5,$html);
							$css = str_replace("{{color1}}",$sa->color1,$css);
							$css = str_replace("{{color2}}",$sa->color2,$css);
							$css = str_replace("{{color3}}",$sa->color3,$css);
							$css = str_replace("{{color4}}",$sa->color4,$css);
							$css = str_replace("{{color5}}",$sa->color5,$css);

							//print_r($html);
							break;
						}

					}
				}

			}
			catch (Exception $e) {
				//none

			}


		}


		//save scss
		$content = file_get_contents($app_dir_template .'src/app/start/start.page.scss');
		$content .= "ion-content {\n";
		$content .= $css;
		$content .= "}\n";
		file_put_contents($app_dir_template .'src/app/start/start.page.scss',$content);


		//html
		$content = file_get_contents($app_dir_template .'src/app/start/start.page.html');
		$content = str_replace("<ion-content>","<ion-content class='ion-text-center'>" . $html,$content);
		file_put_contents($app_dir_template .'src/app/start/start.page.html',$content);

		//print_r($content);
		//print_r($html);


		//ts
		$content = file_get_contents($app_dir_template .'src/app/start/start.page.ts');
		$content = str_replace("123456",$page->start_page_timeout*1000,$content);
		file_put_contents($app_dir_template .'src/app/start/start.page.ts',$content);
		//exit;

        //run event, if need
        $this->runInstallEvent("afterSetStartPage");
		$this->echoResult("Set start page","No output");
	}


	//Create environments files
	private function createEnvironments() {
		$app_dir_template = public_path() . '/storage/application/' . $this->app->id . '-'.$this->app->unique_string_id.'/sources/';
		$system = SystemSettings::first();
		$content = "
			export const environment = {
			appId: '".$this->app->sb."',
			api: 'https://".$system->domain."/mobile/',
			production: false
			};
		";
		file_put_contents($app_dir_template ."src/environments/environment.ts",$content);
		$content = "
			export const environment = {
			appId: '".$this->app->sb."',
			api: 'https://".$system->domain."/mobile/',
			production: true
			};
		";
		file_put_contents($app_dir_template ."src/environments/environment.prod.ts",$content);

        //run event, if need
        $this->runInstallEvent("afterCreateEnvironments");
		$this->echoResult("Create Environments","No output");
	}

	//Store Firebase google-json and plist into app folder
	private function saveFirebaseFiles() {
		$app_dir_template = public_path() . '/storage/application/' . $this->app->id . '-'.$this->app->unique_string_id.'/sources/';
		$google_json = $this->app->google_services_json;
		$google_plist = $this->app->google_services_plist;

		if ($google_json && $google_json!="" && !empty($google_json)) {
			file_put_contents($app_dir_template ."src/google-services.json",$google_json);
			file_put_contents($app_dir_template ."src/app/google-services.json",$google_json);
			file_put_contents($app_dir_template ."google-services.json",$google_json);
		}
		if ($google_plist && $google_plist!="" && !empty($google_plist)) {
			file_put_contents($app_dir_template ."src/GoogleService-info.plist",$google_plist);
			file_put_contents($app_dir_template ."src/app/GoogleService-info.plist",$google_plist);
			file_put_contents($app_dir_template ."GoogleService-info.plist",$google_plist);
		}
		$this->runInstallEvent("afterSaveFirebaseFiles");
		$this->echoResult("Save firebase files","No output");
	}

	/*
		Create array with app module data
	*/
	private function applyAppComponents() {

		$app_module = [];
		$app_component = [];
		foreach ($this->components as $component) {

			//print_r($component);

			//run npm install
			$app_dir_template = public_path() . '/storage/application/' . $this->app->id . '-'.$this->app->unique_string_id.'/sources/';
			
			/*if (isset($component['package_info']['run_command'])) {
				foreach ($component['package_info']['run_command'] as $command) shell_exec("cd " . $app_dir_template . " && ".$command." 2>&1");
			}*/


			//inclde component_data.php
            if (file_exists(public_path() . '/storage/components/' . $component['package_info']['category'] . "/" . $component['package_info']['type'] . "/" . $component['package_info']['code'] . "/installs/component_data.php")) {
                include(public_path() . '/storage/components/' . $component['package_info']['category'] . "/" . $component['package_info']['type'] . "/" . $component['package_info']['code'] . "/installs/component_data.php");
            } else if (file_exists(public_path() . '/storage/components/' . $component['package_info']['type'] . "/" . $component['package_info']['code'] . "/installs/component_data.php")) {
                include(public_path() . '/storage/components/' . $component['package_info']['type'] . "/" . $component['package_info']['code'] . "/installs/component_data.php");
            }

			foreach ($component_data['app.module.ts'] as $key=>$value) {
				if (!isset($app_module[$key])) $app_module[$key]=[];
				if (is_array($value)) {
					foreach($value as $v) if (trim($v)!=="") $app_module[$key][]=$v;
				} else {
					if (trim($value)!=="") $app_module[$key][]=$value;
				}
			}

			foreach ($component_data['app.component.ts'] as $key=>$value) {
				if (!isset($app_component[$key])) $app_component[$key]=[];
				if (is_array($value)) {
					foreach($value as $v)  if (trim($v)!=="") $app_component[$key][]=$v;
				} else {
					 if (trim($value)!=="") $app_component[$key][]= $value;
				}
			}

		}

		//print_r($app_module);
		//print_r($app_component);

		//write data to files
		$app_dir_template = public_path() . '/storage/application/' . $this->app->id . '-'.$this->app->unique_string_id.'/sources/src/app/';
		$app_module_content = "";
            foreach ($app_module['import'] as $import) {
                $app_module_content .= $import . "\n";
            }


		if (isset($app_module['imports_after'])) {
			if (is_array($app_module['imports_after'])) $app_module_content .= "\n".implode(", ",$app_module['imports_after']) . "\n";
			else $app_module_content .= "\n" . $app_module['imports_after'] . "\n";
		}

		$app_module_content .= "\n\n@NgModule({\n";
		$app_module_content .= "	declarations: [".implode(", ",$app_module['declarations'])."],\n";
		$app_module_content .= "	entryComponents: [".implode(", ",$app_module['entryComponents'])."],\n";
		$app_module_content .= "	imports: [".implode(", ",$app_module['imports'])."],\n";
		$app_module_content .= "	providers: [".implode(", ",$app_module['providers'])."],\n";
		$app_module_content .= "	bootstrap: [".implode(", ",$app_module['bootstrap'])."],\n";
        $app_module_content .= "})\n";
        $app_module_content .= "export class AppModule {}";
		file_put_contents($app_dir_template ."app.module.ts",$app_module_content);

		//app components
		$app_component_content = "";
            foreach ($app_component['import'] as $import) {
                $app_component_content .= $import . "\n";
            }

		if (isset($app_component['imports_after'])) {
			if (is_array($app_component['imports_after'])) $app_component_content .= "\n".implode(", ",$app_component['imports_after']) . "\n";
			else $app_component_content .= "\n" . $app_component['imports_after'] . "\n";
		}
		$app_component_content .= "\n\n@Component({selector: 'app-root', templateUrl: 'app.component.html', styleUrls: ['app.component.scss'], })\n\n";
		$app_component_content .= "export class AppComponent {\n";

            foreach ($app_component['variables'] as $variables) {
                $app_component_content .= "	" . $variables . "\n";
            }

		$app_component_content .= "	constructor(".(isset($app_component['constructor_objects'])?implode(", ",$app_component['constructor_objects']):"")."){\n";
		foreach($app_component['constructor'] as $constructor) {
			$app_component_content .= "		".$constructor . "\n";
		}
		$app_component_content .= "	}\n";

		if (isset($app_component['body'])) {
			if (is_array($app_component['body'])) $app_component_content .= "\n".implode("\n\n",$app_component['body']) . "\n";
			else $app_component_content .= "\n" . $app_component['body'] . "\n";
		}

		$app_component_content .= "}\n";

		file_put_contents($app_dir_template ."app.component.ts",$app_component_content);


		//run event, if need
		$this->runInstallEvent("afterAppModuleCreate");
		$this->echoResult("Apply components to sources","No output");
	}


	/*
		Run install event
	*/
	private function runInstallEvent($event) {
		foreach ($this->components as $component) {
			if (isset($component['package_info']['class'])) {
				$install_class_file = public_path() . '/storage/components/' . $component['package_info']['category'] . "/" . $component['package_info']['type'] . "/" . $component['package_info']['code'] . "/installs/install.php";
				if (file_exists($install_class_file)) {
					if (!class_exists($component['package_info']['class'])) {
						include($install_class_file);
					}
					$class = $component['package_info']['class'];
					$install = new  $class;
					if (method_exists($install,$event)) $install->{$event}($this->app);
					unset($install);
				}

			}
		}

	}



	/*
		Copy components files to sources (if needed)
	*/
	private function copyComponents() {
        $components_on_page = ApplicationPageComponent::where("app_id",$this->app->id)->get();

        $components_on_page_data = [];

		//collect all components data
		foreach($components_on_page as $page_component) {
			$data = json_decode($page_component->code,true);
			$data["app_id"]=$this->app->id;
			$data["page_id"]=$page_component->id;
			$data["page_component_id"]=$page_component->id;
			$data["page_component_code"]=$page_component->component_code;
			$data["application"]=$this->app;
			$data["component"]=$page_component;
			$data["page"]=[];
			$data["colors"]=$this->app->getColors();
			if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
				//$components_on_page_data[] = [];
			} else {
				$components_on_page_data[] = $data;
			}
		}

		$components = new Components();
		$components->inner_only = true;
		$components->setComponentDataByPage($components_on_page_data);
		$available_conponents = $components->getAvailableComponentsByPage($this->app,0, true);
		foreach($components_on_page as $page_component) {
			foreach($available_conponents as $available_conponent) {
				if ($available_conponent['code'] == $page_component->component_code  && $available_conponent['component_id']==$page_component->id) {
                    $this->components[$available_conponent['code']] = $available_conponent;
                    $this->components[$available_conponent['code']]['component'] = $page_component;

                    $available_conponent['page_id'] = $page_component->page_id;
                    $available_conponent['component'] = $page_component;
                    $this->components_pages[] = $available_conponent;
				}
			}
		}


		$app_dir_template = public_path() . '/storage/application/' . $this->app->id . '-'.$this->app->unique_string_id.'/sources/src/app/';
		foreach ($this->components as $component) {
			if (file_exists(public_path() . '/storage/components/' . $component['package_info']['category'] . "/" . $component['package_info']['type'] . "/" . $component['package_info']['code'] . "/app")) {
                $component_path = public_path() . '/storage/components/' . $component['package_info']['category'] . "/" . $component['package_info']['type'] . "/" . $component['package_info']['code'] . "/app";
            } else if (file_exists(public_path() . '/storage/components/' . $component['package_info']['type'] . "/" . $component['package_info']['code'] . "/app")) {
                $component_path = public_path() . '/storage/components/' . $component['package_info']['type'] . "/" . $component['package_info']['code'] . "/app";
            }
			if (is_dir($component_path)) {
				$this->xcopy($component_path, $app_dir_template);
			}
		}

		//run event, if need
		$this->runInstallEvent("afterCopyComponentSources");
		$this->echoResult("Copy components to sources","No output");
	}


	/*
		Add dependency in package.json
	*/
	private function addDependencies() {

		$app_dir_template = public_path() . '/storage/application/' . $this->app->id . '-'.$this->app->unique_string_id.'/sources/';
		$dependencies = [];
		$devDependencies = [];
		foreach ($this->components as $component) {
			if (isset($component['package_info']['dependencies'])) {

				if (is_array($component['package_info']['dependencies'])) {
					foreach($component['package_info']['dependencies'] as $d) $dependencies[]=trim($d);
				} else {
					$dependencies[]=trim($component['package_info']['dependencies']);
				}
			}


			if (isset($component['package_info']['devDependencies'])) {

				if (is_array($component['package_info']['devDependencies'])) {
					foreach($component['package_info']['devDependencies'] as $d) $devDependencies[]=trim($d);
				} else {
					$devDependencies[]=trim($component['package_info']['devDependencies']);
				}
			}
		}

		$content = file_get_contents($app_dir_template . 'package.json');

		if ($dependencies) $content = str_replace("\"dependencies\": {", "\"dependencies\": {\n".implode(",\n",$dependencies) . ",\n",$content);
		if ($devDependencies) $content = str_replace("\"devDependencies\": {", "\"devDependencies\": {\n".implode(",\n",$devDependencies). ",\n",$content);


		file_put_contents($app_dir_template . 'package.json',$content);
		//print_r($dependencies);
		//print_r($devDependencies);

		//run event, if need
		$this->runInstallEvent("afterAddDependencies");
		$this->echoResult("Add dependecies to package.json","No output");
	}


	private function installNpmDependencies() {
		$app_dir_template = public_path() . '/storage/application/' . $this->app->id . '-'.$this->app->unique_string_id.'/sources/';
		$app_dir_template = str_replace("\\","/",$app_dir_template);
		$generate_result = shell_exec("cd " . $app_dir_template . " && npm install 2>&1");
		$this->runInstallEvent("afterInstallNpmDependencies");
		$this->log["installNpmDependencies"] = $generate_result;
	}


/*
		create pages
	*/
	private function createPages() {
		$app_dir_template = public_path() . '/storage/application/' . $this->app->id . '-'.$this->app->unique_string_id.'/sources/src/app/';

		// read components and create component_data
		$app_module = [];
		$app_component = [];

        foreach ($this->components as $component) {
            //inclde component_data.php
            if (file_exists(public_path() . '/storage/components/' . $component['package_info']['category'] . "/" . $component['package_info']['type'] . "/" . $component['package_info']['code'] . "/installs/component_data.php")) {
                include(public_path() . '/storage/components/' . $component['package_info']['category'] . "/" . $component['package_info']['type'] . "/" . $component['package_info']['code'] . "/installs/component_data.php");
            } else if (file_exists(public_path() . '/storage/components/' . $component['package_info']['type'] . "/" . $component['package_info']['code'] . "/installs/component_data.php")) {
                include(public_path() . '/storage/components/' . $component['package_info']['type'] . "/" . $component['package_info']['code'] . "/installs/component_data.php");
            }

            if (isset($component_data['*.module.ts'])) foreach ($component_data['*.module.ts'] as $key => $value) {
                if (!isset($app_module[$key])) $app_module[$key] = [];
                if (is_array($value)) {
                    foreach ($value as $v) if (trim($v) !== "") $app_module[$key][] = $v;
                } else {
                    if (trim($value) !== "") $app_module[$key][] = $value;
                }
            }

            if (isset($component_data['*.component.ts'])) foreach ($component_data['*.component.ts'] as $key => $value) {
                if (!isset($app_component[$key])) $app_component[$key] = [];
                if (is_array($value)) {
                    foreach ($value as $v) if (trim($v) !== "") $app_component[$key][] = $v;
                } else {
                    if (trim($value) !== "") $app_component[$key][] = $value;
                }
            }
        }

			$components_1 = new Components();
			$cv_a_v = $components_1->getListActionsVariables($this->app->id);


            foreach ($this->pages as $page) if ($page->type != "start") {
                if (isset($component_data[$page->name . '.module.ts'])) foreach ($component_data[$page->name . '.module.ts'] as $key => $value) {
                    if (!isset($app_module[$key])) $app_module[$key] = [];
                    if (is_array($value)) {
                        foreach ($value as $v) if (trim($v) !== "") $app_module[$key][] = $v;
                    } else {
                        if (trim($value) !== "") $app_module[$key][] = $value;
                    }
                }

                if (isset($component_data[$page->name . '.component.ts'])) foreach ($component_data[$page->name . '.component.ts'] as $key => $value) {
                    if (!isset($app_component[$key])) $app_component[$key] = [];
                    if (is_array($value)) {
                        foreach ($value as $v) if (trim($v) !== "") $app_component[$key][] = $v;
                    } else {
                        if (trim($value) !== "") $app_component[$key][] = $value;
                    }
                }


				//remove duplicates from app_components and app_module
				foreach($app_component as $key=>$values) {
					$new_values = array_unique($values);
					$app_component[$key] = $new_values;
				}

				foreach($app_module as $key=>$values) {
					$new_values = array_unique($values);
					$app_module[$key] = $new_values;
				}


                $page_code = "page" . $page->id;
                $page_name = "Page" . $page->id;

                $imports = [];
                $imports_after = [];
                $variables = [];
                $constructor_objects = [];
                $constructor = [];
                $ngOnOnit = [];

                if (!file_exists($app_dir_template . $page_code)) mkdir($app_dir_template . $page_code);

                //$content_page_spec_ts
                $content_page_spec_ts = "
				import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
				import { IonicModule } from '@ionic/angular';

				import { " . $page_name . "Page } from './" . $page_code . ".page';

				describe('" . $page_name . "Page', () => {
				  let component: " . $page_name . "Page;
				  let fixture: ComponentFixture<" . $page_name . "Page>;

				  beforeEach(waitForAsync(() => {
					TestBed.configureTestingModule({
					  declarations: [ " . $page_name . "Page ],
					  imports: [IonicModule.forRoot()]
					}).compileComponents();

					fixture = TestBed.createComponent(" . $page_name . "Page);
					component = fixture.componentInstance;
					fixture.detectChanges();
				  }));

				  it('should create', () => {
					expect(component).toBeTruthy();
				  });
				});";
                file_put_contents($app_dir_template . $page_code . "/" . $page_code . ".page.spec.ts", $content_page_spec_ts);


                // create page.mage.ts
                $app_page = Application_Page::find($page->id);
                $custom_code = $app_page->getCustomCode();
                $page_content = "";
                $import = ["import { Component, OnInit, OnDestroy } from '@angular/core';"];
                //$import [] = "import {SystemSettingsService} from './../_services/system/system-settings.service';";
                //$import [] = "import { NavController } from '@ionic/angular';";

                if ($custom_code->import_section != "") {
                    $import [] = $custom_code->import_section;    //custom code
                }

                //add components data
                if (isset($app_component['import'])) foreach ($app_component['import'] as $v) if (trim($v) != '') $import[] = $v;


                $variables = ["test:any = {}"];
                if ($custom_code->variables != "") {
                    $variables[] = $custom_code->variables;    //custom code
                }

                //add components data
                if (isset($app_component['variables'])) foreach ($app_component['variables'] as $v) if (trim($v) != '') $variables[] = $v;

                $constructor_object = [];
                if ($custom_code->define_constructor_objects != "") {
                    $constructor_object[] = $custom_code->define_constructor_objects;    //custom code;
                }

                //add components data
                if (isset($app_component['constructor_objects'])) foreach ($app_component['constructor_objects'] as $v) if (trim($v) != '') $constructor_object[] = $v;

                $constructor = [];
                if ($custom_code->constructor_code != "") {
                    $constructor[] = $custom_code->constructor_code;    //custom code;
                }

                //add components data
                if (isset($app_component['constructor'])) foreach ($app_component['constructor'] as $v) if (trim($v) != '') $constructor[] = $v;


                $body = [];
                //add components data
                if (isset($app_component['body'])) foreach ($app_component['body'] as $v) if (trim($v) != '') $body[] = $v;
                if ($custom_code->user_functions != "") {
                    $body[] = $custom_code->user_functions;
                }

                $page_content .= implode("\n", $import) . "\n\n";
                $page_content .= "@Component({selector: 'app-" . $page_code . "',templateUrl: '" . $page_code . ".page.html',styleUrls: ['" . $page_code . ".page.scss'],})\n";
                $page_content .= "export class " . $page_name . "Page implements OnInit,OnDestroy {\n";

                //varibles
                if ($variables) $page_content .= "\n//Variables\n" . implode(";\n", $variables) . ";\n";


                //define objects in constructor
                $page_content .= "	constructor(" . ($constructor_object ? implode(", ", $constructor_object) : "") . ") {\n";
                if ($constructor) $page_content .= "	\n//Constructor methods and functions\n" . implode("\n", $constructor) . "\n";
                $page_content .= "	}\n";

                //events on page
                $ngOnInit = [];
                if (isset($app_component['ngOnInit'])) foreach ($app_component['ngOnInit'] as $v) if (trim($v) != '') $ngOnInit[] = $v;
                if ($custom_code->on_init != "") {
                    $ngOnInit[] = $custom_code->on_init;
                }

                $ngOnDestroy = [];
                if (isset($app_component['ngOnDestroy'])) foreach ($app_component['ngOnDestroy'] as $v) if (trim($v) != '') $ngOnDestroy[] = $v;
                if ($custom_code->on_destroy != "") {
                    $ngOnDestroy[] = $custom_code->on_destroy;
                }

                $ionViewWillEnter = [];
                if (isset($app_component['ionViewWillEnter'])) foreach ($app_component['ionViewWillEnter'] as $v) if (trim($v) != '') $ionViewWillEnter[] = $v;
                if ($custom_code->ion_view_will_enter != "") {
                    $ionViewWillEnter[] = $custom_code->ion_view_will_enter;
                }

                $ionViewDidEnter = [];
                if (isset($app_component['ionViewDidEnter'])) foreach ($app_component['ionViewDidEnter'] as $v) if (trim($v) != '') $ionViewDidEnter[] = $v;
                if ($custom_code->ion_view_did_enter != "") {
                    $ionViewDidEnter[] = $custom_code->ion_view_did_enter;
                }

                $ionViewWillLeave = [];
                if (isset($app_component['ionViewWillLeave'])) foreach ($app_component['ionViewWillLeave'] as $v) if (trim($v) != '') $ionViewWillLeave[] = $v;
                if ($custom_code->ion_view_will_leave != "") {
                    $ionViewWillLeave[] = $custom_code->ion_view_will_leave;
                }

                $ionViewDidLeave = [];
                if (isset($app_component['ionViewDidLeave'])) foreach ($app_component['ionViewDidLeave'] as $v) if (trim($v) != '') $ionViewDidLeave[] = $v;
                if ($custom_code->ion_view_did_leave != "") {
                    $ionViewDidLeave[] = $custom_code->ion_view_did_leave;
                }


                //ngOnInit
                $page_content .= "\n	ngOnInit() {\n";
                $page_content .= "\n		console.log('" . $page_name . " ngOnInit fired.');\n";
                if ($ngOnInit) $page_content .= "		\n//Methods in ngOnInit\n" . implode("\n\n", $ngOnInit) . "\n";
                $page_content .= "	}\n\n";

                //ngOnDestroy
                $page_content .= "\n	ngOnDestroy() {\n";
                $page_content .= "\n		console.log('" . $page_name . " ngOnDestroy fired.');\n";
                if ($ngOnDestroy) $page_content .= "		\n//Methods in ngOnDestroy\n" . implode("\n\n", $ngOnDestroy) . "\n";
                $page_content .= "	}\n\n";

                //ionViewWillEnter
                $page_content .= "\n	ionViewWillEnter() {\n";
                $page_content .= "\n		console.log('" . $page_name . " ionViewWillEnter fired.');\n";
                if ($ionViewWillEnter) $page_content .= "		\n//Methods in ionViewWillEnter\n" . implode("\n\n", $ionViewWillEnter) . "\n";
                $page_content .= "	}\n\n";

                //ionViewDidEnter
                $page_content .= "\n	ionViewDidEnter() {\n";
                $page_content .= "\n		console.log('" . $page_name . " ionViewDidEnter fired.');\n";
                if ($ionViewDidEnter) $page_content .= "		\n//Methods in ionViewDidEnter\n" . implode("\n\n", $ionViewDidEnter) . "\n";
                $page_content .= "	}\n\n";

                //ionViewWillLeave
                $page_content .= "\n	ionViewWillLeave() {\n";
                $page_content .= "\n		console.log('" . $page_name . " ionViewWillLeave fired.');\n";
                if ($ionViewWillLeave) $page_content .= "		\n//Methods in ionViewWillLeave\n" . implode("\n\n", $ionViewWillLeave) . "\n";
                $page_content .= "	}\n\n";

                //ionViewDidLeave
                $page_content .= "\n	ionViewDidLeave() {\n";
                $page_content .= "\n		console.log('" . $page_name . " ionViewDidLeave fired.');\n";
                if ($ionViewDidLeave) $page_content .= "		\n//Methods in ionViewDidLeave\n" . implode("\n\n", $ionViewDidLeave) . "\n";
                $page_content .= "	}\n\n";


                if ($body) $page_content .= "	\n//Methods in body\n" . implode("\n\n", $body) . "\n";

                $page_content .= "}";
                file_put_contents($app_dir_template . $page_code . "/" . $page_code . ".page.ts", $page_content);


				//get all page components
				$has_footer = false;
				$has_header = false;
				$has_menu = false;
				$header = "";
				$footer = "";
				$menu = "";
				$body = "";
				$css = [];


				//Для компонентов отдельно читаем, в старом алгоритиме где то нестыковка
				$components_on_page = ApplicationPageComponent::where("app_id",$this->app->id)->where("page_id",$page->id)->get();
				$components_on_page_data = [];
				//collect all components data
				foreach($components_on_page as $page_component) {
					$data = json_decode($page_component->code,true);
					$data["app_id"]=$this->app->id;
					$data["page_id"]=$page->id;
					$data["page_component_id"]=$page_component->id;
					$data["page_component_code"]=$page_component->component_code;
					$data["application"]=$this->app;
					$data["component"]=$page_component;
					$data["page"]=$page;
					$data["colors"]=$this->app->getColors();
					if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
						//$components_on_page_data[] = [];
					} else {
						$components_on_page_data[] = $data;
					}
				}
				$components = new Components();
				$body_components = [];
				$components->setComponentDataByPage($components_on_page_data);
				$available_conponents = $components->getAvailableComponentsByPage($this->app->id,$page->id);

				//scan pagecomponents
				foreach($components_on_page as $page_component) {

					//scan all components and get current
					foreach($available_conponents as $available_conponent) {
						if ($available_conponent['code'] == $page_component->component_code  && $available_conponent['component_id']==$page_component->id) {

							$page_component['data'] = $available_conponent;

							if ($page_component->position=="footer") {
								$has_footer = true;
								$footer ="\n\n"."<!-- ".$page_component->component_code." #".$page_component->id." -->"."\n\n".$available_conponent['ionic_html'];
							} else if ($page_component->position=="header") {
								$has_header = true;
								$header ="\n\n"."<!-- ".$page_component->component_code." #".$page_component->id." -->"."\n\n".$available_conponent['ionic_html'];
							} else if ($page_component->position=="menu") {
								$has_menu = true;
								$menu ="\n\n"."<!-- ".$page_component->component_code." #".$page_component->id." -->"."\n\n".$available_conponent['ionic_html'];
							}  else if ($page_component->position=="body") {
								//$body .="\n\n"."<!-- ".$page_component->component_code." #".$page_component->id." -->"."\n\n".$available_conponent['ionic_html'];
								$body_components[]=["page_component"=>$page_component,"ionic_html"=>$available_conponent['ionic_html'],'visibility_conditions'=>$cv_a_v['visibility_conditions']];
							}
							$css[$page_component->component_code]="\n\n"."/*".$page_component->component_code." #".$page_component->id."*/"."\n\n".$available_conponent['ionic_css'];
						}
					}
				}

				//sort body components and reorder by Y
				$body_components = $components->sortComponentsY($body_components,$has_header,$has_footer);
				foreach ($body_components as $c) {
					$body .="\n\n"."<!-- ".$c['page_component']->component_code." #".$c['page_component']->id." -->"."\n\n".$c['ionic_html'];


				}

                $app_page = Application_Page::find($page->id);
                $custom_code = $app_page->getCustomCode();

                //$routing
                $content_page_scss = "/* customer SCSS codes*/";
                $content_page_scss .= "\n\n" . $custom_code->scss;    //custom code;

                $content_page_scss .= "\n/* From ionic.css  */\n";
                $content_page_scss .= implode("\n",$css);


                file_put_contents($app_dir_template . $page_code . "/" . $page_code . ".page.scss", $content_page_scss);

                //$content_page_spec_ts
                $content_page_routing = "import { NgModule } from '@angular/core';
				import { Routes, RouterModule } from '@angular/router';

				import { " . $page_name . "Page } from './" . $page_code . ".page';

				const routes: Routes = [
				  {
					path: '',
					component: " . $page_name . "Page
				  }
				];

				@NgModule({
				  imports: [RouterModule.forChild(routes)],
				  exports: [RouterModule],
				})
				export class " . $page_name . "PageRoutingModule {}
				";
                file_put_contents($app_dir_template . $page_code . "/" . $page_code . "-routing.module.ts", $content_page_routing);




                //$content_page_spec_ts
                $content_page_html = "";

				if ($has_menu && $custom_code->menu != "")  {
					$content_page_html .= "<!-- user custom menu start-->\n" . $custom_code->menu . "\n<!-- user custom menu end-->\n\n";;
				} else if ($has_menu) {
					$content_page_html .= "<!-- user custom menu start-->\n" . $menu . "\n<!-- user custom menu end-->\n\n";;
				}

				if ($has_menu) {
					$content_page_html .= "\n<div class='ion-page' id='main-content'>\n";
				}

				if ($has_header) {
					$content_page_html .= $header;
				}

				if ($page->ion_padding) $content_page_html .= "<ion-content class='ion-padding'>\n";
				else if ($page->fullscreen) $content_page_html .= "<ion-content>\n";
				else $content_page_html .= "<ion-content class='ion-padding-top'>\n";

				//add language switch
                $content_page_html .= '

				<ion-popover [isOpen]="translationService.showLanguagesList" [dismissOnSelect]="true" class="langugage-switcher">
				<ng-template>
				  <ion-content class="ion-padding" color="light" class="langugage-switcher-content">

					<ion-list>
						<!-- Default List Header -->
						<ion-list-header>
							<ion-label>{{"CHANGE_LANGUAGE" | translate}}</ion-label>
						</ion-list-header>
						<ion-item *ngFor="let item of translationService.getLanguagesList()" button (click)="translationService.changeLanguageTo(item.code)">
						  <ion-label>{{item.text | translate}}</ion-label>
						</ion-item>
					  </ion-list>

				  </ion-content>
				</ng-template>
			  </ion-popover>

				';    //custom code;

                $content_page_html .= "<!-- user custom before content start-->\n" . $custom_code->content_before . "\n<!-- user custom before content end-->\n\n";    //custom code;

				$content_page_html .= $body;

                $content_page_html .= "\n\n<!-- user custom after content start-->\n" . $custom_code->content_after . "\n<!-- user custom after content end-->\n";    //custom code;

                $content_page_html .= '</ion-content>';


                if ($has_menu) {
                    $content_page_html .= "\n</div>";
                }

                file_put_contents($app_dir_template . $page_code . "/" . $page_code . ".page.html", $content_page_html);


                //create module page
                $import = [];
                $imports = [];
                $imports_after = [];
                $providers = [];
                $declarations = [$page_name . "Page"];

                $import [] = "import { NgModule } from '@angular/core';";
                $import [] = "import { Component, OnInit, NgZone  } from '@angular/core';";
                $import [] = "import { CommonModule } from '@angular/common';";
                $import [] = "import { IonicModule } from '@ionic/angular';";
                $import [] = "import { FormsModule } from '@angular/forms';";
                $import [] = "import { " . $page_name . "Page } from './" . $page_code . ".page';";
                $import [] = "import { " . $page_name . "PageRoutingModule } from './" . $page_code . "-routing.module';";

                //add components data
                if (isset($app_module['import'])) foreach ($app_module['import'] as $v) if (trim($v) != '') $import[] = $v;

                $imports [] = "CommonModule";
                $imports [] = "FormsModule";
                $imports [] = "IonicModule";
                $imports [] = $page_name . "PageRoutingModule";

                //add components data
                if (isset($app_module['imports'])) foreach ($app_module['imports'] as $v) if (trim($v) != '') $imports[] = $v;

                //add components data
                if (isset($app_module['providers'])) foreach ($app_module['providers'] as $v) if (trim($v) != '') $providers[] = $v;


                //add components data
                if (isset($app_module['declarations'])) foreach ($app_module['declarations'] as $v) if (trim($v) != '') $declarations[] = $v;

                $module_content = implode("\n", $import) . "\n\n";
                $module_content .= "@NgModule({\n";
                $module_content .= "	providers: [" . implode(",", $providers) . "],\n";
                $module_content .= "	imports: [" . implode(",", $imports) . "],\n";
                $module_content .= "	declarations: [" . implode(",", $declarations) . "],\n";
                $module_content .= "})\n export class " . $page_name . "PageModule {}";
                file_put_contents($app_dir_template . $page_code . "/" . $page_code . ".module.ts", $module_content);



            }
			
			$this->echoResult("Create pages done","No output");
	}



	/**
	 * Build WWW for ionic app
	 */
    private function buildIonic() {
		$app = $this->app;
		$builder_dir = base_path() . DIRECTORY_SEPARATOR . 'builder'. DIRECTORY_SEPARATOR .'build';
		$generate_result = shell_exec("cd " . $builder_dir . " && ionic build 2>&1");
		$this->echoResult("Build Ionic App",$generate_result);
    }

	/**
	 * Build WWW for ionic www
	 */
	private function buildIonicWWW() {
		$app = $this->app;
		$builder_dir = base_path() . DIRECTORY_SEPARATOR . 'builder'. DIRECTORY_SEPARATOR .'build';
		$generate_result = shell_exec("cd " . $builder_dir . " && ionic build -- --base-href /storage/application/".$app->id."-".$app->unique_string_id."/sources/www/ 2>&1");
		$this->echoResult("Build Ionic WWW",$generate_result);
	}

	/*
		Copy generated WWW folder back to app sources
	*/
	private function copyWWWtoBack(){
		$builder_dir = base_path() . DIRECTORY_SEPARATOR . 'builder'. DIRECTORY_SEPARATOR .'build';
		$app_dir_template = public_path() . DIRECTORY_SEPARATOR . 'storage'. DIRECTORY_SEPARATOR .'application' . DIRECTORY_SEPARATOR . $this->app->id . '-'.$this->app->unique_string_id . DIRECTORY_SEPARATOR .'sources' . DIRECTORY_SEPARATOR;
		File::copyDirectory($builder_dir . DIRECTORY_SEPARATOR ."www", $app_dir_template . DIRECTORY_SEPARATOR ."www");
		$this->echoResult("Copy WWW dir back to app sources folder","No output");
	}

    private function addAndroidPlatform() {
		$builder_dir = base_path() . DIRECTORY_SEPARATOR . 'builder'. DIRECTORY_SEPARATOR .'build';
		shell_exec("cd " . $builder_dir . " && rm android -r  2>&1");
        $generate_result = shell_exec("cd " . $builder_dir . " && npx cap add android 2>&1");
		$this->echoResult("Add Android platform",$generate_result);
    }

    private function addIOSPlatform() {
		$builder_dir = base_path() . DIRECTORY_SEPARATOR . 'builder'. DIRECTORY_SEPARATOR .'build';
		shell_exec("cd " . $builder_dir . " && rm android -r  2>&1");
        $generate_result = shell_exec("cd " . $builder_dir . " && npx cap add android 2>&1");
		$this->echoResult("Add ios platform",$generate_result);
    }


    private function generateSplashAndIcons() {
		$builder_dir = base_path() . DIRECTORY_SEPARATOR . 'builder'. DIRECTORY_SEPARATOR .'build';
        $generate_result = shell_exec("cd " . $builder_dir . " && cordova-res android --skip-config --copy --icon-background-source '".$this->app->icon_background_color."' 2>&1");
        $this->echoResult("Generate Icon and Splash resources for android",$generate_result);
    }

    private function generateSplashAndIconsForIOS() {
		$builder_dir = base_path() . DIRECTORY_SEPARATOR . 'builder'. DIRECTORY_SEPARATOR .'build';
        $generate_result = shell_exec("cd " . $builder_dir . " && cordova-res ios --skip-config --copy --icon-background-source '".$this->app->icon_background_color."' 2>&1");
        $this->echoResult("Generate Icon and Splash resources for IOS",$generate_result);
    }


    private function capSync() {
        $builder_dir = base_path() . DIRECTORY_SEPARATOR . 'builder'. DIRECTORY_SEPARATOR .'build';
        $generate_result = shell_exec("cd " . $builder_dir . " && npx cap sync 2>&1");
		$this->echoResult("Capacitor Sync",$generate_result);
    }
	
    private function buildAndroidDebugAPK() {
        $builder_dir = base_path() . DIRECTORY_SEPARATOR . 'builder'. DIRECTORY_SEPARATOR .'build';
		$sdk_config = $this->getSDKPath();
		$commands = implode(" && ",$sdk_config['bash_commands']);
        //$generate_result = shell_exec('export ANDROID_HOME=/usr/lib/android-sdk && export PATH=$ANDROID_HOME/cmdline-tools/tools/bin/:$PATH && export PATH=$ANDROID_HOME/emulator/:$PATH && export PATH=$ANDROID_HOME/platform-tools/:$PATH '." && cd /usr/lib/android-sdk && cd " . $app_dir_template . "android && ./gradlew assembleDebug 2>&1");
         $generate_result = shell_exec("{$commands} && cd " . $builder_dir . DIRECTORY_SEPARATOR . "android && ./gradlew assembleDebug 2>&1");

        $this->echoResult("Build Adnroid debug APK",$generate_result);
    }	
	
	// get PATH from SDK from SDK
	private function getSDKPath() {
		$controller = new SdkController();
		$controller->json = true;
		$sdk_config = $controller->checkSDK();
		return $sdk_config;
	}
	
	
    private function copyDebugApkToFolder() {
		$builder_dir = base_path() . DIRECTORY_SEPARATOR . 'builder'. DIRECTORY_SEPARATOR .'build' . DIRECTORY_SEPARATOR;
		$new_file_name = 'app-debug-'.date("YmdHis").'.apk';
		$app_dir = public_path() . DIRECTORY_SEPARATOR . 'storage'. DIRECTORY_SEPARATOR .'application' . DIRECTORY_SEPARATOR . $this->app->id . '-'.$this->app->unique_string_id;

        //create dir if not exists
        if (!file_exists($app_dir. DIRECTORY_SEPARATOR .'generated-apk')) {
            mkdir($app_dir. DIRECTORY_SEPARATOR .'generated-apk', 0777, true);
        }
        
        copy($builder_dir . 'android'. DIRECTORY_SEPARATOR .'app'. DIRECTORY_SEPARATOR .'build'. DIRECTORY_SEPARATOR .'outputs'. DIRECTORY_SEPARATOR .'apk'. DIRECTORY_SEPARATOR .'debug'. DIRECTORY_SEPARATOR .'app-debug.apk', $app_dir . DIRECTORY_SEPARATOR .'generated-apk' . DIRECTORY_SEPARATOR . $new_file_name);

		$generate_result = "from: " . $builder_dir . 'android'. DIRECTORY_SEPARATOR .'app'. DIRECTORY_SEPARATOR .'build'. DIRECTORY_SEPARATOR .'outputs'. DIRECTORY_SEPARATOR .'apk'. DIRECTORY_SEPARATOR .'debug'. DIRECTORY_SEPARATOR .'app-debug.apk';
		$generate_result .= "\nto: " . $app_dir . DIRECTORY_SEPARATOR .'generated-apk' . DIRECTORY_SEPARATOR . $new_file_name;

        $this->log['copyDebugApkToFolder'] = $new_file_name;
		$this->echoResult("copy Debug Apk to app folder",$generate_result);
        return $new_file_name;
    }	
	
    private function makeZipSources() {
        $builder_dir = base_path() . DIRECTORY_SEPARATOR . 'builder'. DIRECTORY_SEPARATOR .'build' . DIRECTORY_SEPARATOR;
        $app_dir = public_path() . DIRECTORY_SEPARATOR . 'storage'. DIRECTORY_SEPARATOR .'application' . DIRECTORY_SEPARATOR . $this->app->id . '-'.$this->app->unique_string_id;

        //create dir if not exists
        if (!file_exists($app_dir.'generated-apk')) {
            mkdir($app_dir.'generated-apk', 0777, true);
        }

        $new_file_name = 'app-sources-'.date("YmdHis").'.zip';
        $generate_result = shell_exec("cd " . $builder_dir . " && zip -r ".$app_dir . DIRECTORY_SEPARATOR ."generated-apk" . DIRECTORY_SEPARATOR .$new_file_name." android node_modules/@capacitor node_modules/@capacitor-community 2>&1");
		$this->echoResult("Make zip Android sources",$generate_result);
        return $new_file_name;
    }	
	
	
    private function setPathEnvironment() {
        shell_exec('export ANDROID_HOME=/usr/lib/android-sdk');
        shell_exec('export PATH=$ANDROID_HOME/cmdline-tools/tools/bin/:$PATH');
        shell_exec('export PATH=$ANDROID_HOME/emulator/:$PATH');
        shell_exec('export PATH=$ANDROID_HOME/platform-tools/:$PATH');
    }

    private function installIonicCapacitor() {
        $app_dir_template = public_path() . '/storage/application/' . $this->app->id . '-'.$this->app->unique_string_id.'/sources/';
        $app_dir = public_path() . '/storage/application/' . $this->app->id . '-'.$this->app->unique_string_id.'/';
        $generate_result = shell_exec("cd " . $app_dir_template . " && npm install @capacitor/core @capacitor/cli @capacitor/app @capacitor/haptics @capacitor/keyboard @capacitor/status-bar @capacitor/ios cordova-res 2>&1");

        $this->log['installIonicCapacitor'] = $generate_result;
    }








    private function removeAndroidFolder() {
        $app_dir_template = public_path() . '/storage/application/' . $this->app->id . '-'.$this->app->unique_string_id.'/sources/';
        $app_dir = public_path() . '/storage/application/' . $this->app->id . '-'.$this->app->unique_string_id.'/';
        $generate_result = shell_exec("cd " . $app_dir_template . " && rm -rf android  2>&1");

        $this->log['removeAndroidFolder'] = $generate_result;
    }

    private function removeIOSFolder() {
        $app_dir_template = public_path() . '/storage/application/' . $this->app->id . '-'.$this->app->unique_string_id.'/sources/';
        $app_dir = public_path() . '/storage/application/' . $this->app->id . '-'.$this->app->unique_string_id.'/';
        $generate_result = shell_exec("cd " . $app_dir_template . " && rm -rf ios  2>&1");

        $this->log['removeIOSFolder'] = $generate_result;
    }

    private function removeNodeModulesFolder() {
        $app_dir_template = public_path() . '/storage/application/' . $this->app->id . '-'.$this->app->unique_string_id.'/sources/';
        $app_dir = public_path() . '/storage/application/' . $this->app->id . '-'.$this->app->unique_string_id.'/';
        $generate_result = shell_exec("cd " . $app_dir_template . " && rm -rf node_modules  2>&1");

        $this->log['removeNodeModulesFolder'] = $generate_result;
    }


    private function makeZipIOSSources() {
        $app_dir_template = public_path() . '/storage/application/' . $this->app->id . '-'.$this->app->unique_string_id.'/sources/';
        $app_dir = public_path() . '/storage/application/' . $this->app->id . '-'.$this->app->unique_string_id.'/';

        //create dir if not exists
        if (!file_exists($app_dir.'generated-apk')) {
            mkdir($app_dir.'generated-apk', 0777, true);
        }

        $new_file_name = 'app-sources-'.date("YmdHis").'.zip';
        $generate_result = shell_exec("cd " . $app_dir . " && zip -r ".$app_dir."generated-apk/".$new_file_name." sources/ios sources/node_modules/@capacitor sources/node_modules/@capacitor-community 2>&1");

        $this->log['makeZipIOSSources'] = $new_file_name;
        return $new_file_name;
    }
}
