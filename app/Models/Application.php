<?php

namespace App\Models;

use App\Models\Application_Languages;
use FilesystemIterator;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Colors;
use App\Models\Application_IAP;
use App\Models\ApplicationTranslations;
use App\Models\ApplicationMenu;
use App\Models\Application_IAP_Description;
use App\Models\Application_Page;
use App\Models\BuildQueryWWW;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use App\Models\Languages;
use App\Models\TrPhrases;
use Symfony\Component\Process\Process;

class Application extends Model
{
    use HasFactory;

    protected $languages;   //app languages

    public static function boot() {
        parent::boot();

        /**
         * Call after model created.
         */
        static::created(function($item) {
            //exec('php '. base_path('artisan BuildApplication:WWW'));
        });

        static::creating(function (&$item) {
            if (!$item->google_services_json) {
                $item->google_services_json = "";
            }

            if (!$item->google_services_plist) {
                $item->google_services_plist = "";
            }

            if (!$item->privacy_text) {
                $item->privacy_text = "";
            }
        });

        /**
         * Call after model updated.
         */
        static::updated(function($item) {
            if ($item['need_first_build'] == 1 || $item['need_www_build'] == 1) {
                shell_exec('php '. base_path('artisan BuildApplication:WWW  &'));
            }
        });
    }


    /**
     * Get appliation menu as structured array
     */
    public function getMenu() {

        $menu = [];
        $menu_items = ApplicationMenu::where("app_id",$this->id)->orderBy('sort_order')->get();
        foreach ($menu_items as $menu_item) {

            //translation
            $language_data = @json_decode($menu_item->translations,true,$depth=512);
            if ($language_data === null && json_last_error() !== JSON_ERROR_NONE) {
                //echo "incorrect data";
                $name_translations = [];
            } else {
                $name_translations=$language_data;

            }

            //get first languages value
            $name = "";
            if (isset($name_translations[0]['language_value'])) $name = $name_translations[0]['language_value'];

            //visible conditions
            $visible_conditions_data = @json_decode($menu_item->visible_conditions,true,$depth=512);
            if ($visible_conditions_data === null && json_last_error() !== JSON_ERROR_NONE) {
                //echo "incorrect data";
                $visible_conditions = [];
            } else {
                $visible_conditions = $visible_conditions_data;

            }

            //load actions

            $item = [
                "name" => $name,
                "name_translations" => $name_translations,
                "visible_conditions" => $visible_conditions,
                "image" => $menu_item->image,
                "action_name" => $menu_item->action,
            ];

            $menu[] = $item;
        }


        return $menu;
    }

    /**
     * Get appliation menu as structured array
     */
    public function setMenu($menu) {

        ApplicationMenu::where("app_id",$this->id)->delete();

        $sort_order = 1;
        $sort_order = 1;

        foreach($menu as $menu_item) {
            $item = new ApplicationMenu();
            $item->app_id = $this->id;
            $item->sort_order = 1;
            $item->action = isset($menu_item['action'])?$menu_item['action']:'-';
            $item->image = $menu_item['image']?$menu_item['image']:"";
            $item->sort_order = $sort_order;
            $item->translations = isset($menu_item['name_translations'])?json_encode($menu_item['name_translations']):"{}";
            $item->visible_conditions = isset($menu_item['visible_conditions'])?json_encode($menu_item['visible_conditions']):"{}";
            $item->save();
            $sort_order++;

        }

        //print_r($menu);
        /*$menu_model = ApplicationMenu::where("app_id",$this->id)->first();
        if (!empty($menu_model)) {
            $menu_model->app_id = $this->id;
            $menu_model->menu = json_encode($menu);
            $menu_model->save();

        } else {
            $menu_model = new ApplicationMenu();
            $menu_model->app_id = $this->id;
            $menu_model->menu = json_encode($menu);
            $menu_model->save();
        }*/
    }


    /**
     * Get application translations list
     */
    public function getTranslations() {

        //get app languages
        $languages = new Application_Languages();
        $languages->setApplication($this);



        //get system phrases
        $return_translations = [];

        $all_system_translations = TrPhrases::where('section', "MOBILE")->get();
        $aplication_translations = $languages->getLanguages();

        foreach($all_system_translations as $system_translation) {
            $return_translations[$system_translation->phrase] = [];

            foreach($aplication_translations as $aplication_translation) {
                $return_translations[$system_translation->phrase][$aplication_translation->code] = $system_translation->phrase;

                //Looking default translate
                $language_from_system = Languages::where('code', $aplication_translation->code)->first();
                if (!empty($language_from_system)) {
                    foreach($all_system_translations as $f) {
                        if ($f->lang_id==$language_from_system->id && $f->phrase == $system_translation->phrase) $return_translations[$system_translation->phrase][$aplication_translation->code] = $f->translation;
                    }
                }

            }

        }

        //развернем массив
        $temp = $return_translations;
        $return_translations = [];
        foreach($temp as $phrase=>$value) {
            foreach($value as $lang_code=>$lang_value) {
                $return_translations[$lang_code][$phrase]=$lang_value;
            }
        }

        //get application languages and add it to translation table
        foreach($aplication_translations as $aplication_translation) {
            foreach($aplication_translations as $aplication_translation1) {
                $return_translations[$aplication_translation->code]['LANGUAGE_' .strtoupper($aplication_translation1->code)]=$aplication_translation1->name;
            }
        }

        //get translations from components


        //get additional language
        $additional_translations = ApplicationTranslations::where('app_id',$this->id)->first();
        if (!empty($additional_translations)) {
            try {
                $json_data = json_decode($additional_translations->translations,true,$depth=512, JSON_THROW_ON_ERROR);

                //add addtional traslate with replaces to return array
                foreach($json_data as $lang_code=>$lang_values) {
                    foreach($lang_values as $key=>$value) {
                        $return_translations[$lang_code][$key]=$value;
                    }
                }

            } catch (Exception $e) {
                // handle exception
            }
        }

        // add non exists translations to all languages
        $verify_yrray=[];
        foreach($return_translations as $lang=>$values) {
            foreach($values as $pharase=>$tr) $verify_yrray[$pharase] = $tr;
        }
        foreach($return_translations as $lang=>$values) {
            foreach($verify_yrray as $verify_item_phrase=>$verify_item_value) {
                if (!isset($values[$verify_item_phrase])) $return_translations[$lang][$verify_item_phrase]=$verify_item_phrase;
            }
        }


        return $return_translations;

    }

    /**
     * Return application colors record
     */
    public function getColors() {
        $app = $this;
        $colors = new Colors();
        return $colors->getApplicationColors($app->id);
    }


    /**
     * Add IAP in current application
     */
    public function setInAppProduct($iap) {
        $app = $this;
        $application_iap = new Application_IAP();

        //check, if new or exists

        $is_new = true;
        if ($iap['id']==0) {
            $is_new = true;
        } else {
            $products = $application_iap->getInAppProducts($app->id);
            foreach ($products as $c) {
                if ($c->id==$iap['id']) $is_new = false;
            }
        }


        if ($is_new) {
            //create new
            $new_iap = new Application_IAP();
            $new_iap->app_id = $app->id;
            $new_iap->iap_id = $iap["iap_id"];
            $new_iap->name = "";//?
            $new_iap->code = $iap["code"];
            $new_iap->disabled = $iap["disabled"]?1:0;
            $new_iap->save();

            foreach ($iap["languages"] as $iap_lang) {
                $new_iap_description = new Application_IAP_Description();
                $new_iap_description->app_id = $app->id;
                $new_iap_description->iap_id = $new_iap->id;
                $new_iap_description->lang = $iap_lang['code'];
                $new_iap_description->name = $iap_lang['name'];
                $new_iap_description->description = $iap_lang['description'];
                $new_iap_description->save();
            }

        } else {
            //update current
            Application_IAP::where("id",$iap["id"])->where("app_id",$app->id)->update(["iap_id"=>$iap["iap_id"], "code"=>$iap["code"], "disabled"=>$iap["disabled"]?1:0]);

            //remove name and description and insert new
            Application_IAP_Description::where("iap_id",$iap["id"])->delete();  // $iap["id"] not $iap["iap_id"]

            foreach ($iap["languages"] as $iap_lang) {
                $new_iap_description = new Application_IAP_Description();
                $new_iap_description->app_id = $app->id;
                $new_iap_description->iap_id = $iap['id'];
                $new_iap_description->lang = $iap_lang['code'];
                $new_iap_description->name = $iap_lang['name'];
                $new_iap_description->description = $iap_lang['description'];
                $new_iap_description->save();
            }
        }
    }

    /**
     * Return application products
     */
    public function getInAppProducts() {
        $return = [];
        $app = $this;
        $application_iap = new Application_IAP();
        $products = $application_iap->getInAppProducts($app->id);
        //$products->setApplication($app);
        foreach ($products as $c) {
            $return[] = $c;
        }
        return $return;
    }

    /**
     * Return application colors record
     */
    public function getColorsArray() {
        $return = [];
        $app = $this;
        $colors = new Colors();
        foreach ($colors->getApplicationColors($app->id) as $c) {
            $c['letter']=mb_substr($c['name'],0,1,'UTF-8');
            $return[$c['color_name']] = $c;
        }
        return $return;
    }


    public function setApplicationLanguages($languages_array) {
        $app = $this;
        $languages = new Application_Languages();
        $languages->setApplication($app);
        $languages->removeLanguages();
        foreach($languages_array as $lang) {
            $languages->addLanguage($lang['code'],$lang['name'],$lang['active']);
        }
    }

    /**
     * Fill new application fields and save application icon, splash screen.
     *
     * @param $user_id
     * @param $name
     * @param $description
     * @param $icon
     * @param $icon_background_color
     * @return bool
     */
    public function initApplication($user_id, $name, $description, $icon, $icon_background_color) {
        $app = $this;
        $unique_string_id = strtolower(Str::random(10));
        $sb = strtolower(Str::random(20));
        $token_key = strtolower(Str::random(10));
        $app['token_key'] = $token_key;
        $app['unique_string_id'] = $unique_string_id;
        $app['sb'] = $sb;
        $app['user_id'] = $user_id;
        $app['name'] = $name;
        $app['description'] = $description;
        $app['default_language'] = "en";
        $app['icon_background_color'] = $icon_background_color;
        $app['version'] = '1.0.0';
        $domain = DB::table('system_settings')->first('domain');
        $domain = explode('.' , $domain->domain);
        $bundleId = $domain[count($domain) - 1];
        for ($i = count($domain) - 2; $i >= 0; $i--) {
            $bundleId = $bundleId.'.'.$domain[$i];
        }
        $app['bundle_id'] = $bundleId.'.'.$unique_string_id;
        $app->save();

        //Add colors data
        $colors = new Colors();
        $colors->setDefaultColors($app->id);

        //Init default language (english)
        $default_languge = new Application_Languages();
        $default_languge->setApplication($app);
        $default_languge->addLanguage("en","English");
        $app['languages'] = $default_languge->getLanguages();

        //create first start page
        $first_page =  new Application_Page();
        $first_page->app_id = $app->id;
        $first_page->name = "Start";
        $first_page->type = "start";
        $first_page->can_delete = 0;
        $first_page->save();



        //inser this code to import template pages

        $appDir = public_path().'/storage/application/'.$app->id.'-'.$app->unique_string_id.'/resources/';

        if (mkdir($appDir,0777, true)) {
            $this->setApplicationIcon($icon);

            $filenameSplashScreen = "splash.png";
            copy(public_path().'/assets/images/app_splash_default.png', $appDir.$filenameSplashScreen);

            //add item to WWW builder query
            //$build_src_query = new BuildQueryWWW();
            //$build_src_query->addFirstBuildWWW($app);

            return true;
        } else {
            return false;
        }
    }

    /**
     * Delete application with associated files.
     *
     * @return bool|null
     */
    public function deleteApplication() {
        $appsDir = public_path() . '/storage/application/';
        $appDir = $this->id . '-' . $this->unique_string_id;
        $result = $this->delete();
        shell_exec("cd " . $appsDir . " && rm -rf " . $appDir . "  2>&1");

        return $result;
    }


    /**
     * Save default background image.
     *
     * @param $background_image default background image in base64 format
     * @return bool
     */
    public function setApplicationDefaultBackground($background_image) {
        $appDir = public_path().'/storage/application/'.$this->id.'-'.$this->unique_string_id.'/resources/';
        if (file_exists($appDir.'default_background.png')) {
            unlink($appDir.'default_background.png');
        }

        if (!file_exists($appDir)) {
            mkdir($appDir,0777, true);
        }

        $filenameIcon = "default_background.png";
        $this->background_image = "default_background.png";
        $output_file = $appDir.$filenameIcon;
        $ifp = fopen( $output_file, 'wb' );
        $data = explode( ',', $background_image );
        fwrite( $ifp, base64_decode($data[1] ) );
        fclose( $ifp );
        return true;
    }

    /**
     * Save application icon.
     *
     * @param $icon application icon in base64 format
     * @return bool
     */
    public function setApplicationIcon($icon) {
        $appDir = public_path().'/storage/application/'.$this->id.'-'.$this->unique_string_id.'/resources/';
        if (file_exists($appDir.'icon.png')) {
            unlink($appDir.'icon.png');
        }
        if (file_exists($appDir.'icon_100x100.png')) {
            unlink($appDir.'icon_100x100.png');
        }
        if (file_exists($appDir.'android/icon-foreground.png')) {
            unlink($appDir.'android/icon-foreground.png');
        }
        if (file_exists($appDir.'android/icon-background.png')) {
            unlink($appDir.'android/icon-background.png');
        }

        if (!file_exists($appDir)) {
            mkdir($appDir,0777, true);
        }

        $filenameIcon = "icon.png";
        $output_file = $appDir.$filenameIcon;
        $ifp = fopen( $output_file, 'wb' );
        $data = explode( ',', $icon );
        fwrite( $ifp, base64_decode($data[1] ) );
        fclose( $ifp );

        $filenameSmallIcon = "icon_100x100.png";
        $smallIcon = imagecreatetruecolor(100, 100);
        imagealphablending($smallIcon, false);
        imagesavealpha($smallIcon, true);
        imagecopyresampled($smallIcon, imagecreatefrompng($appDir.$filenameIcon), 0, 0, 0, 0, 100, 100, 1024, 1024);
        imagepng($smallIcon, $output_file = $appDir.$filenameSmallIcon);

        if (!file_exists($appDir."android/")) {
            mkdir($appDir."android/",0777, true);
        }

        $filenameAndroidIconForeground = "android/icon-foreground.png";
        $androidIconForeground = imagecreatetruecolor(432, 432);
        imagealphablending($androidIconForeground, false);
        imagesavealpha($androidIconForeground, true);
        imagecopyresampled($androidIconForeground, imagecreatefrompng($appDir . $filenameIcon), 0, 0, 0, 0, 432, 432, 1024, 1024);
        imagepng($androidIconForeground, $output_file = $appDir . $filenameAndroidIconForeground);

        $filenameAndroidIconBackground = "android/icon-background.png";
        $androidIconBackground = imagecreatetruecolor(432, 432);
        imagealphablending($androidIconBackground, false);
        imagesavealpha($androidIconBackground, true);
        imagecopyresampled($androidIconBackground, imagecreatefrompng($appDir . $filenameIcon), 0, 0, 0, 0, 432, 432, 1024, 1024);
        imagepng($androidIconBackground, $output_file = $appDir . $filenameAndroidIconBackground);

        return true;
    }

    /**
     * Save application splash screen.
     *
     * @param $splash_screen application splash screen in base64 format
     * @param $background_color color hex
     * @param $show_spinner bool is show splashscreen spinner
     * @param $spinner_color color hex
     * @param $timeout splashscreen timeout
     * @return bool
     */
    public function setApplicationSplashScreen($splash_screen, $background_color, $show_spinner, $spinner_color, $timeout) {
        $appDir = public_path().'/storage/application/'.$this->id.'-'.$this->unique_string_id.'/resources/';
        if (file_exists($appDir.'splash.png')) {
            unlink($appDir.'splash.png');
        }

        if (!file_exists($appDir)) {
            mkdir($appDir,0777, true);
        }

        $filenameIcon = "splash.png";
        $output_file = $appDir.$filenameIcon;
        $ifp = fopen( $output_file, 'wb' );
        $data = explode( ',', $splash_screen );
        fwrite( $ifp, base64_decode($data[1] ) );
        fclose( $ifp );

        $this->splashscreen_background_color = $background_color;
        $this->splashscreen_show_spinner = $show_spinner;
        $this->splashscreen_spinner_color = $spinner_color;
        $this->splashscreen_timeout = $timeout;
        $this->save();

        return true;
    }

    /**
     * Calculates the disk space occupied by the application.
     */
    public function calculatingOccupiedDiskSpace() {
        $appDir = public_path().'/storage/application/'.$this->id.'-'.$this->unique_string_id.'/';

        if (is_dir($appDir)) {
            $size = 0;
            foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($appDir, FilesystemIterator::SKIP_DOTS)) as $file) {
                $size += $file->getSize();
            }
            $this->size = number_format($size / (1024*1024), 4);
        } else if (file_exists($appDir)) {
            $this->size = number_format(filesize($appDir) / (1024*1024), 4);
        } else {
            $this->size = 0;
        }

        $this->save();
    }

    /**
     * Check if the current user has access to the application.
     *
     * @param $app_id application id
     * @return bool
     */
    static function userHasAccess($app_id): bool
    {
        $currentUser = auth()->user();
        if ($currentUser['user_type_id'] === 1) {
            return true;
        }

        $app = Application::find($app_id);
        if (empty($app)) return false;
        if ($currentUser['user_type_id'] === 2 && $currentUser['id']===$app->user_id) {
            return true;
        }

        if ($currentUser['user_type_id'] === 3) {
            $isManagerRelated = DB::table('managers_to_applications')
                ->where('manager_id',$currentUser['id'])
                ->where('app_id', $app_id)
                ->first();

            if ($isManagerRelated) {
                return true;
            }
        }

        return false;
    }

    /**
     * Save new font in application folder.
     *
     * @param $fontFamily font namme
     * @param $fontConnectionFile font connection file
     * @param $fontFiles array with font files
     */
    function saveFont($fontFamily, $fontConnectionFile, $fontFiles) {
        $fontFolder = public_path().'/storage/application/'.$this->id.'-'.$this->unique_string_id.'/fonts';

        if (!file_exists($fontFolder)) {
            mkdir($fontFolder, 0777, true);
        }

        $di = new RecursiveDirectoryIterator($fontFolder, FilesystemIterator::SKIP_DOTS);
        $ri = new RecursiveIteratorIterator($di, RecursiveIteratorIterator::CHILD_FIRST);
        foreach ( $ri as $file ) {
            $file->isDir() ?  rmdir($file) : unlink($file);
        }

        if (!file_exists($fontFolder.'/'.$fontFamily)) {
            mkdir($fontFolder.'/'.$fontFamily, 0777, true);
        }

        $str = file_get_contents($fontConnectionFile);
        $re = '/@font-face {(?:\s|.)*(?:font-style: ([A-z]*);)(?:\s|.)*(?:font-weight: (\d*);)(?:\s|.)*(url\((?:\s|.)*\)) (format\((?:\s|.)*\))(?:\s|.)*}/U';
        preg_match_all($re, $str, $matches, PREG_SET_ORDER, 0);
        for ($i = 0; $i < count($matches); $i++) {
            $pos = strpos($str, $matches[$i][3]);
            if ($matches[$i][2] == 400) {
                if ($matches[$i][1] == 'italic') {
                    $str = substr_replace($str, 'url("../fonts/' . $fontFamily . '/' . $matches[$i][1] . '.ttf")', $pos, strlen($matches[$i][3]));
                } else if ($matches[$i][1] == 'normal') {
                    $str = substr_replace($str, 'url("../fonts/' . $fontFamily . '/' . 'regular' . '.ttf")', $pos, strlen($matches[$i][3]));
                }
            } else {
                if ($matches[$i][1] == 'italic') {
                    $str = substr_replace($str, 'url("../fonts/' . $fontFamily . '/' . $matches[$i][2] . $matches[$i][1] . '.ttf")', $pos, strlen($matches[$i][3]));
                } else if ($matches[$i][1] == 'normal') {
                    $str = substr_replace($str, 'url("../fonts/' . $fontFamily . '/' . $matches[$i][2] . '.ttf")', $pos, strlen($matches[$i][3]));
                }
            }
            $str = str_replace($matches[$i][4], "format('truetype')", $str);
        }

        file_put_contents($fontConnectionFile, $str);

        copy($fontConnectionFile,$fontFolder.'/'.$fontFamily.'.css');

        foreach ($fontFiles as $key=>$value) {
            copy($value,$fontFolder.'/'.$fontFamily.'/'.$key.'.ttf');
        }
    }

    /**
     * Save custom user font.
     *
     * @param $fontFamily
     * @param $fontFilesArchive
     */
    function saveApplicationCustomFont($fontFamily, $fontFilesArchive) {
        $zip = new ZipArchive;
        $isOpen = $zip->open($fontFilesArchive);
        if ($isOpen === TRUE) {
            $extractPath = public_path().'/storage/application/'.$this->id.'-'.$this->unique_string_id.'/fonts';

            if (file_exists($extractPath.'/'.$fontFamily)) {
                $di = new RecursiveDirectoryIterator($extractPath.'/'.$fontFamily, FilesystemIterator::SKIP_DOTS);
                $ri = new RecursiveIteratorIterator($di, RecursiveIteratorIterator::CHILD_FIRST);
                foreach ( $ri as $file ) {
                    $file->isDir() ?  rmdir($file) : unlink($file);
                }
            }

            if (file_exists($extractPath.'/'.$fontFamily.'.css')) {
                unlink($extractPath.'/'.$fontFamily.'.css');
            }

            $zip->extractTo($extractPath);
        }

        $this->font = $fontFamily;
        $this->save();
    }


    /**
     * Copy application.
     *
     * @return Application copied application
     */
    function copyApplication($appId) {
        $unique_string_id = strtolower(Str::random(10));
        $sb = strtolower(Str::random(20));
        $token_key = strtolower(Str::random(10));

        $fromApp = DB::table('applications')->where('id', $appId)->first();

        foreach ($fromApp as $key => $value) {
            if ($key !== 'id') {
                $this->$key = $value;
            }
        }

        $this['token_key'] = $token_key;
        $this['unique_string_id'] = $unique_string_id;
        $this['sb'] = $sb;
        $this->save();

        $appDir = public_path().'/storage/application/'.$fromApp->id.'-'.$fromApp->unique_string_id;
        $newAppDir = public_path().'/storage/application/'.$this->id.'-'.$this->unique_string_id;
        mkdir($newAppDir);

        set_time_limit(0);
        $this->copyFiles($appDir, $newAppDir);


        $appColors = DB::table('colors')->where('app_id', $appId)->get();
        for ($i = 0; $i < count($appColors); $i++) {
            $color = new Colors();

            foreach ($appColors[$i] as $key => $value) {
                if ($key !== 'id') {
                    $color->$key = $value;
                }
            }

            $color->app_id = $this->id;
            $color->save();
        }

        $appLang = DB::table('application_languages')->where('app_id', $appId)->get();
        for ($i = 0; $i < count($appLang); $i++) {
            $lang = new Application_Languages();

            foreach ($appLang[$i] as $key => $value) {
                if ($key !== 'id') {
                    $lang->$key = $value;
                }
            }

            $lang->app_id = $this->id;
            $lang->save();
        }

        $contentTypes = DB::table('application_content_types')->where('app_id', $appId)->get();
        $contentTypesChangeId = [];
        for ($i = 0; $i < count($contentTypes); $i++) {
            $content_type = new ApplicationContentType();

            foreach ($contentTypes[$i] as $key => $value) {
                if ($key !== 'id') {
                    $content_type->$key = $value;
                }
            }

            $content_type->app_id = $this->id;
            $content_type->save();
            $contentTypesChangeId[$contentTypes[$i]->id] = $content_type->id;
        }

        $contents = DB::table('application_contents')->where('app_id', $appId)->get();
        for ($i = 0; $i < count($contents); $i++) {
            $content = new ApplicationContent();

            foreach ($contents[$i] as $key => $value) {
                if ($key !== 'id') {
                    $content->$key = $value;
                }

                if ($key === 'content_type_id') {
                    $content->$key = $contentTypesChangeId[$value];
                }
            }

            $content->app_id = $this->id;
            $content->save();
        }

        $menus = DB::table('application_menus')->where('app_id', $appId)->get();
        for ($i = 0; $i < count($menus); $i++) {
            $menu = new ApplicationMenu();

            foreach ($menus[$i] as $key => $value) {
                if ($key !== 'id') {
                    $menu->$key = $value;
                }
            }

            $menu->app_id = $this->id;
            $menu->save();
        }

        $pages = DB::table('application_pages')->where('app_id', $appId)->get();
        $pagesChangeId = [];
        for ($i = 0; $i < count($pages); $i++) {
            $page = new Application_Page();

            foreach ($pages[$i] as $key => $value) {
                if ($key !== 'id') {
                    $page->$key = $value;
                }
            }

            $page->app_id = $this->id;
            $page->save();
            $pagesChangeId[$pages[$i]->id] = $page->id;
        }

        $pages_components = DB::table('application_page_components')->where('app_id', $appId)->get();
        //Log::info('pages changes id '. json_encode($pagesChangeId, JSON_PRETTY_PRINT));
        //Log::info('pages components '. json_encode($pages_components, JSON_PRETTY_PRINT));
        for ($i = 0; $i < count($pages_components); $i++) {
            $page_component = new ApplicationPageComponent();

            foreach ($pages_components[$i] as $key => $value) {
                if ($key !== 'id') {
                    $page_component->$key = $value;
                }

                if ($key === 'page_id') {
                    if (array_key_exists($value, $pagesChangeId)) {
                        $page_component->$key = $pagesChangeId[$value];
                    }
                }
            }

            $page_component->app_id = $this->id;
            $page_component->save();
        }

        foreach ($pagesChangeId as $key => $value) {
            if (array_key_exists($value, $pagesChangeId)) {
                $custom_code = DB::table('application_pages_custom_code')->where('page_id', $key)->first();
                $custom_code->page_id = $value;
                DB::table('application_pages_custom_code')->insert($custom_code);
            }
        }

        $start_animations = DB::table('application_start_animations')->where('app_id', $appId)->get();
        for ($i = 0; $i < count($start_animations); $i++) {
            $start_animation = new ApplicationStartAnimation();

            foreach ($start_animations[$i] as $key => $value) {
                if ($key !== 'id') {
                    $start_animation->$key = $value;
                }
            }

            $start_animation->app_id = $this->id;
            $start_animation->save();
        }

        $translations = DB::table('application_translations')->where('app_id', $appId)->get();
        for ($i = 0; $i < count($translations); $i++) {
            $translation = new ApplicationTranslations();

            foreach ($translations[$i] as $key => $value) {
                if ($key !== 'id') {
                    $translation->$key = $value;
                }
            }

            $translation->app_id = $this->id;
            $translation->save();
        }



        return $this;
    }

    /**
     * Copy files into other directory.
     *
     * @param string $from
     * @param string $to
     */
    private function copyFiles(string $from, string $to)
    {
        if (is_dir($from)) {
            if (!file_exists($to)) {
                mkdir($to);
            }
            $d = dir($from);
            while (false !== ($entry = $d->read())) {
                if ($entry == "." || $entry == "..") continue;
                $this->copyFiles("$from/$entry", "$to/$entry");
            }
            $d->close();
        } else copy($from, $to);
    }

}
