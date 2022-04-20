<?php

/**
 * Preview controller
 * generate web preview withot IONIC and angular
 */

namespace App\Http\Controllers;

use ScssPhp\ScssPhp\Compiler;
use App\Models\ActivityLog;
use App\Models\ApplicationContent;
use App\Models\ApplicationContentType;
use App\Models\ApplicationStartAnimation;
use App\Models\StaticPages;
use App\Models\Tarif;
use App\Models\ApplicationPageComponent;
use App\Models\Components;
use App\Models\Template;
use App\Models\User;
use App\Models\Topic;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Validator;
use Illuminate\Http\Request;
use App\Models\Application;
use App\Models\Colors;
use App\Models\Application_Languages;
use App\Models\Application_Page;
use App\Models\BuildQueryWWW;
use App\Models\ApplicationTranslations;
use App\Models\ApplicationMenu;
use App\Models\Application_IAP;
use App\Models\Application_IAP_Description;
use App\Models\InAppPurchase;
use App\Models\StartPageAnimation;
use App\Models\LayoutPages;
use Illuminate\Support\Facades\File;

class PreviewController extends Controller
{
    


    /**
     * Set application translations
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|string
     */
    function get_preview (Request $request)
    {

        $validator = Validator::make(
            $request->all(),
            array(
                'app_id' => 'required',
            )
        );        
        $response = [];
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $app = Application::find($request['app_id']);
            if (Application::userHasAccess($request['app_id'])) {

                $result = [];

                //Создадим директорию для превью
                $resource_url = '/storage/application/' .$app->id . '-'. $app->unique_string_id .'/resources/';
                $www_dir = public_path() . '/storage/application/' .$app->id . '-'. $app->unique_string_id .'/preview/';
                $www_url = 'storage/application/' .$app->id . '-'. $app->unique_string_id .'/preview/';
                if (!file_exists($www_dir)) mkdir($www_dir);

                //Удалим там все файлы
                $files_to_delete = glob('path/to/temp/*'); // get all file names
                foreach($files_to_delete as $file){ // iterate files
                  if(is_file($file)) {
                    unlink($file); // delete file
                  } else if(is_dir($file)) {
                      rmdir($file);
                  }
                }

                $result['dir'] = $www_dir;
                $result['url'] = "";

                //Прочитаем шаблоны
                $start_template = file_get_contents(public_path() . '/ionic/start_template.html');
                $page_template = file_get_contents(public_path() . '/ionic/page_template.html');

                //Получим цвета
                $colors = $this->makeColors($app);
                $app_colors = $app->getColors();

                //настройки
                $settings = $this->getSettings($app);

                $components_1 = new Components();
			    $cv_a_v = $components_1->getListActionsVariables($app->id);

                //Глобалльные настройки фона и картинки
                $background_image_size=$app->background_image_size;
                $background_image_mode=$app->background_image_mode;
                $background_image=(!$app->background_image)?'':$app->background_image;                


                //Скопируем файлы из preview систимных модулей в папку с превью
                $js_modules = [];
                $search_in_dir = public_path() . '/storage/components/modules/system';
                $modules_dirs = scandir($search_in_dir);
                $modules_dirs = array_diff($modules_dirs, array('.', '..'));
                foreach($modules_dirs as $module_dir) {
                    if (file_exists($search_in_dir. "/" . $module_dir . "/preview")) {
                        File::copyDirectory($search_in_dir. "/" . $module_dir . "/preview", $www_dir);

                        foreach (File::allFiles($search_in_dir. "/" . $module_dir . "/preview") as $file) {
                            if ($file->getExtension()=="js") {
                                $relative_path = str_replace($search_in_dir. "/" . $module_dir . "/preview","",$file->getPathname());
                                $relative_path = str_replace("\\","/",$relative_path);
                                $relative_path = substr($relative_path,1);
                                $js_modules[$file->getFilename()]=$relative_path;
                            }
                        }
                    }
                }

                //Получим список страниц (для навигации)
                //сформируем файлы
                $result['pages'] = [];
                $return['page']['start_animations_color_nod_defined'] = true;
                $pages = DB::table('application_pages')->where('app_id', $app->id)->get();
                foreach($pages as $page) {
                    $page->url   =   $www_url . "page".$page->id.".php";
                    $result['pages'][] = $page;
                    $return = [];   //Эта часть взята изиApplciationPAge 
                    
                    //Фомируем стартовую страинцу
                    if ($page->type=="start") {
                        $start_animations = StartPageAnimation::all();
                        $page->url    =   $www_url . "start.html";
                    //redefine animation color, if exists
                    try {
                        $jsonObj  = json_decode($page->current_animation_settings, true);
                        if ($jsonObj === null && json_last_error() !== JSON_ERROR_NONE) {
                            $return['page']['start_animations_color_nod_defined'] = true;
                        } else {

                            foreach($start_animations as $sa_index=>$sa) {
                                if ($sa->id == $page->current_animation) {
                                    $return['page']['start_animations_color_nod_defined'] = false;
                                    $return['page']['start_animation'] = $sa;

                                    if (isset($jsonObj['color1'])) {
                                        $return['page']['start_animations'][$sa_index]['color1'] = $jsonObj['color1'];
                                    }

                                    if (isset($jsonObj['color2'])) {
                                        $return['page']['start_animations'][$sa_index]['color2'] = $jsonObj['color2'];
                                    }

                                    if (isset($jsonObj['color3'])) {
                                        $return['page']['start_animations'][$sa_index]['color3'] = $jsonObj['color3'];
                                    }

                                    if (isset($jsonObj['color4'])) {
                                        $return['page']['start_animations'][$sa_index]['color4'] = $jsonObj['color4'];
                                    }

                                    if (isset($jsonObj['color5'])) {
                                        $return['page']['start_animations'][$sa_index]['color5'] = $jsonObj['color5'];
                                    }

                                }



                            }
                            $return['page']['start_animations_color_nod_defined'] = false;
                            $return['page']['start_animations_data'] = $jsonObj;
                         }

                        }
                        catch (Exception $e) {
                            //
                            $return['page']['start_animations_color_nod_defined'] = true;
                        }
                        $result['start_page'] = $return;

                        //Сохраним стартовую страницы
                        $content = str_replace("<!-- scripts_module -->","",$start_template);

                        //Заменим цвета
                        //Заменим слова

                        if (isset($return['page']['start_animation']['css']) ) $css = $return['page']['start_animation']['css']; else $css="";
                        if (isset($return['page']['start_animation']['html'])) $html = $return['page']['start_animation']['html']; else $html = "";
                        $css.= $colors;
                        //$css .= "body.start {background-color: var(".$page->background."); color: var(".$page->text.");}";

                        //Фоновые рисунки, если они есть - впишем
                        if ($page->background_image=="default") {
                            //По умолчанию - смотрим на настройки приложения
                            if ($background_image!="") {
                                $css .= "body.start {background: url('".$resource_url.$background_image."') ".$background_image_mode."  var(".$page->background."); background-size: ".$background_image_size.";}";
                            } else {
                                $css .= "body.start {background-color: var(".$page->background."); color: var(".$page->text.");}";
                            }
                        } else if ($page->background_image=="none") {   //на странице нет рисунка, просто фон
                            $css .= "body.start {background-color: var(".$page->background."); color: var(".$page->text.");}";
                        } else {    //Указан отдельный рисунок, используем его
                            $css .= "body.start {background: url('".$resource_url.$page->background_image."') ".$background_image_mode."  var(".$page->background."); background-size: ".$background_image_size.";}";
                        }

                        $result['background_image'] = $background_image;

                        //Если есть кастомная анимация
                        $custom_app_animations = ApplicationStartAnimation::where('app_id', $app->id)->first();
                        if ($custom_app_animations) {
                            $html = $custom_app_animations->html;
                            $css = $custom_app_animations->css;
                        }                       

                        if (isset($return['page']['start_animations_data'] )) {
                            foreach($return['page']['start_animations_data'] as $color=>$value) {
                                $css = str_replace("{{".$color."}}", $value, $css);
                                $html = str_replace("{{".$color."}}", $value, $html);
                            }
                        }


                        //Скомпилируем css
                        $css_compiler = new Compiler();
                        $css = $css_compiler->compileString($css)->getCss();


                        $content = str_replace("<!-- ion_css -->",$css,$content);
                        $content = str_replace("<!-- ion_content -->",$html,$content);
                        if (!$return['page']['start_animations_color_nod_defined']) $content = str_replace("<!-- ion_content -->",$html,$content);
                        $content = str_replace("{{'START_LOADING_TEXT' | translate}}","Loading...",$content);
                        $content = str_replace('{{"START_LOADING_TEXT" | translate}}',"Loading...",$content);
                        $content = str_replace('<!-- next_page1 -->', "page".$page->start_page_next_page."",$content);

                        file_put_contents($www_dir . "start.html",$content);
                        $result["url"]= 'storage/application/' .$app->id . '-'. $app->unique_string_id .'/preview/start.html';
                    } else {
                        

                        $content = $page_template;
                        
                        //some replaces
                        $content = str_replace('<!-- page_id -->',$page->id,$content);
                        $content = str_replace('<!-- page_name -->',$page->name,$content);

                        //make css
                        $css = $colors;

                        //Фоновые рисунки, если они есть - впишем
                        if ($page->background_image=="default") {
                            //По умолчанию - смотрим на настройки приложения
                            if ($background_image!="") {
                                $css .= "ion-content {--background: url('".$resource_url.$background_image."') ".$background_image_mode."  var(".$page->background."); background-size: ".$background_image_size.";}";
                            } else {
                                $css .= "ion-content {--background: var(".$page->background."); color: var(".$page->text.");}";
                            }
                        } else if ($page->background_image=="none") {   //на странице нет рисунка, просто фон
                            $css .= "ion-content {--background: var(".$page->background."); color: var(".$page->text.");}";
                        } else {    //Указан отдельный рисунок, используем его
                            $css .= "ion-content {--background: url('".$resource_url.$page->background_image."') ".$background_image_mode."  var(".$page->background."); background-size: ".$background_image_size.";}";
                        }

                        //Прочитаем и впишем компоненты

                        //get all page components
                        $has_footer = false;
                        $has_header = false;
                        $has_menu = false;
                        $header = "";
                        $footer = "";
                        $menu = "";
                        $body = "";               
                        
                        //Этот код надо отпрофилироват и сделать ревью
                        $components_on_page = ApplicationPageComponent::where("app_id",$app->id)->where("page_id",$page->id)->get();
                        $components_on_page_data = [];
                        //collect all components data
                        foreach($components_on_page as $page_component) {
                            $data = json_decode($page_component->code,true);
                            $data["app_id"]=$app->id;
                            $data["page_id"]=$page->id;
                            $data["page_component_id"]=$page_component->id;
                            $data["page_component_code"]=$page_component->component_code;
                            $data["application"]=$app;
                            $data["component"]=$page_component;
                            $data["page"]=$page;
                            $data["request"]=$request->all();
                            $data["colors"]=$app_colors;
                            if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
                                //$components_on_page_data[] = [];
                            } else {
                                $components_on_page_data[] = $data;
                            }
                        }



                        $components = new Components();
                        $body_components = [];
                        $components_css = [];
                        $components->setComponentDataByPage($components_on_page_data);
                        $available_conponents = $components->getAvailableComponentsByPage($app->id,$page->id);
        
                        //scan pagecomponents
                        foreach($components_on_page as $page_component) {
        
                            //scan all components and get current
                            foreach($available_conponents as $available_conponent) {
                                if ($available_conponent['code'] == $page_component->component_code  && $available_conponent['component_id']==$page_component->id) {
        
                                    $page_component['data'] = $available_conponent;
                                    $page_component['request'] = $request;
        
                                    if ($page_component->position=="footer") {
                                        $has_footer = true;
                                        $footer ="\n\n"."<!-- ".$page_component->component_code." #".$page_component->id." -->"."\n\n".$available_conponent['preview_html'];
                                    } else if ($page_component->position=="header") {
                                        $has_header = true;
                                        $header ="\n\n"."<!-- ".$page_component->component_code." #".$page_component->id." -->"."\n\n".$available_conponent['preview_html'];
                                    } else if ($page_component->position=="menu") {
                                        $has_menu = true;
                                        $menu ="\n\n"."<!-- ".$page_component->component_code." #".$page_component->id." -->"."\n\n".$available_conponent['preview_html'];
                                    }  else if ($page_component->position=="body") {
                                        //$body .="\n\n"."<!-- ".$page_component->component_code." #".$page_component->id." -->"."\n\n".$available_conponent['preview_html'];
                                        $body_components[]=["page_component"=>$page_component,"preview_html"=>$available_conponent['preview_html'],"preview_js"=>$available_conponent['preview_js'],'visibility_conditions'=>$cv_a_v['visibility_conditions']];
                                    }
                                    $components_css[$page_component->component_code]="\n\n"."/*".$page_component->component_code." #".$page_component->id."*/"."\n\n".$available_conponent['preview_css'];
                                }
                            }
                        }                        

                        //print_r($body_components);
                        //sort body components and reorder by Y
                        $body_components = $components->sortComponentsY($body_components,$has_header,$has_footer, true);
                        $body_js_code = [];
                        foreach ($body_components as $c) {
                            $body .="\n\n"."<!-- ".$c['page_component']->component_code." #".$c['page_component']->id." -->"."\n\n".$c['preview_html'];

                            //Скопируем компоненты превьвера
                            if (file_exists(public_path() . '/storage/components/visual/'.$c['page_component']->component_code.'/preview')) {
                                $search_in_dir = public_path() . '/storage/components/visual/'.$c['page_component']->component_code.'/preview';
                                $modules_dirs = scandir($search_in_dir);
                                $modules_dirs = array_diff($modules_dirs, array('.', '..'));
                                foreach($modules_dirs as $module_dir) {
                                    if (file_exists($search_in_dir. "/" . $module_dir . "/preview")) {
                                        File::copyDirectory($search_in_dir. "/" . $module_dir . "/preview", $www_dir);
                
                                        foreach (File::allFiles($search_in_dir. "/" . $module_dir . "/preview") as $file) {
                                            if ($file->getExtension()=="js") {
                                                $relative_path = str_replace($search_in_dir. "/" . $module_dir . "/preview","",$file->getPathname());
                                                $relative_path = str_replace("\\","/",$relative_path);
                                                $relative_path = substr($relative_path,1);
                                                $js_modules[$file->getFilename()]=$relative_path;
                                            }
                                        }
                                    }
                                }                             
                            }
                            
                            $body_js_code[] = $c['preview_js']."\n";
                        }
                        //print_r($body_components);
                        //exit;
                      

                        //Соберем это все в одно целое
                        $app_page = Application_Page::find($page->id);
                        $custom_code = $app_page->getCustomCode();
                        $content_page_scss = "/* customer SCSS codes*/";
                        $content_page_scss .= "\n\n" . $custom_code->scss;    //custom code;
                        $content_page_scss .= "\n/* From ionic.css  */\n";
                        $content_page_scss .= implode("\n",$components_css);
                        $css.=$content_page_scss;

                        //Скомпилируем css
                        $css_compiler = new Compiler();
                        $css = $css_compiler->compileString($css)->getCss();

                        if ($page->ion_padding) $ion_content_class = "class='ion-padding'";
                        else if ($page->fullscreen) $ion_content_class = "";
                        else $ion_content_class = "class='ion-padding-top'";

                        $ion_content = "";
                        if ($has_menu) {
                            $ion_content = ' <ion-menu side="start" content-id="main-content">'.$menu.'</ion-menu><div class="ion-page" id="main-content">'.$header.'<ion-content id="ion-content'.$page->id.'" '.$ion_content_class.'>'.$body.'</ion-content>'.$footer.'</div>';
                        } else {
                            $ion_content = $header.'<ion-content id="ion-content'.$page->id.'" '.$ion_content_class.'>'.$body.'</ion-content>'.$footer;

                        }



                        //Сделаем в контенте замену языков
                        $result['default_language'] = $settings['default_language'];
                        $result['languages']=[];
                        foreach($settings['languages'] as $language) $result['languages'][]=$language['language'];
                        
                        //заменим язык
                        if ($request['language'] && $request['language']!="") $result['default_language'] = $request['language'];

                        //Произведем замены текста
                        foreach($settings['languages'] as $language) {

                            if ($language['language'] == $result['default_language']) {
                                foreach($language['items'] as $language_code=>$language_item) {
                                    $ion_content = str_replace("{{translationService.translatePhrase('".$language_code."')}}", $language_item, $ion_content);
                                    $ion_content = str_replace('{{translationService.translatePhrase("'.$language_code.'")}}', $language_item, $ion_content);
                                    //$ion_content = str_replace($language_code, $language_item, $ion_content);
                                }
                                

                            }

                        }

                        //сделаем замену (click)
                        $ion_content = str_replace('(click)', 'ng-click', $ion_content);
                        $ion_content = str_replace('ng-click="-"', 'ng-click="dummyClick()"', $ion_content);
                        
                        //Прочие настройки
                        $result['settings'] = $settings;
                        $result['request'] = $request->all();

                        //Впишем скрипты
                        $js_modules_path = [];
                        $js_modules_includes = [];
                        foreach($js_modules as $script=>$script_path) $js_modules_path[$script] = "<script src='{$script_path}'></script>";
                        foreach($js_modules as $script=>$script_path) $js_modules_includes[] = str_replace(".js","",$script);
                        $content = str_replace('<!-- scripts_bottom_module -->',implode("\n",$js_modules_path),$content);
                        if (count($js_modules_includes)>0) $content = str_replace('/* module includes */',implode(",",$js_modules_includes),$content);

                        //скприты компонентов
                        $content = str_replace('/* module functions */',implode("\n",$body_js_code),$content);

                        //Прочие замены, могут понадобиться
                        $content = str_replace('<!-- ion_css -->',$css,$content);
                        $content = str_replace('<!-- sb -->',$app->sb,$content);
                        $content = str_replace('environment.appId','"'.$app->sb.'"',$content);
                        $content = str_replace('<!-- ion_content -->',$ion_content,$content);
                        $content = str_replace('<!-- scripts_module -->',"",$content);
                        $content = str_replace('<!-- base_href -->',$www_url,$content);
                        file_put_contents($www_dir . "page".$page->id.".php",$content);


                    }


                }

                //Заменим в скриптах переменные sb и апп_ид
                foreach (File::allFiles($www_dir) as $file) {
                    // $file->getFilename()
                    //print_r($file->getPathname ());
                    if ($file->getExtension()=="js") {
                        $content = file_get_contents($file->getPathname());
                        $content = str_replace('<!-- sb -->',$app->sb,$content);
                        $content = str_replace('environment.appId','"'.$app->sb.'"',$content);
                        file_put_contents($file->getPathname(),$content);
                    }
                }
                $response = response()->json($result);

            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }
        }
        return $response;
    }


    /**
     * Сформируем цвета для вставки в стили
     */
    private function makeColors(Application $app) {

        $colors = $app->getColorsArray();
        $content = "\n /* Define user system colors */\n";
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
        
        return $content;
    }

    
    /**
     * Вернем настройки приложение - метод повторяет аналогичный из MobileController
     */
    private function getSettings(Application $app) {
        $settings = [];
        $settings['bundle_id'] = $app->bundle_id;
        $settings['version'] = $app->version;
        $settings['default_language'] = $app->default_language;
        $settings['disabled'] = $app->disabled;
        $settings['blocked'] = $app->blocked;




        //next page
        $settings['next_page'] = "";
        $first_page =  Application_Page::where("app_id",$app->id)->where("type","start")->first();
        if (!empty($first_page)) $settings['next_page'] = 'page'.$first_page->start_page_next_page;

        
        //translations from system
        $translations = $app->getTranslations();
        foreach ($translations as $tr_code=>$tr_values) {
            $settings['languages'][]=["language"=>$tr_code,'items'=>$tr_values];
        }
        


        //get translations from compoenents
        $components_on_page = ApplicationPageComponent::where("app_id",$app->id)->get();
        foreach($components_on_page as $page_component) {
            $code = json_decode($page_component->code,true);
            if ($code === null && json_last_error() !== JSON_ERROR_NONE) {
                //echo "incorrect data";

            } else {

                // component has translation section
                if (isset($code['TRANSLATIONS'])) {
                    //add this translation to all translations
                    foreach($settings['languages'] as &$settings_language) {
                        if (isset($code['TRANSLATIONS'][$settings_language['language']])) {
                            foreach($code['TRANSLATIONS'][$settings_language['language']] as $key=>$value) {
                                $settings_language['items']["PAGE_".$page_component->page_id."_".$page_component->id."_".$key] =$value;
                            }
                        }
                        //$settings_language['items']=array_merge($settings_language['items'],$code['TRANSLATIONS'][$settings_language['language']]);
                    }
                }							
                
                //print_r($code);
            }					
        }


        //get menu, create translations from them and return list
        $menu = [];
        $actions["-"] = "console.log('clicked')";
        $menu_dev = $app->getMenu();
        $menu_pos = 1;
        $actions_list = new Components;
        $constructor_avvc = $actions_list->getListActionsVariables($app->id);
        foreach($constructor_avvc['actions'] as $av) {
            $actions[$av['code']]=$av['angular'];
        }				

        foreach($menu_dev as $menu_item) {
            $item = [
                "image"=>$menu_item['image'],
                "action"=>isset($actions[$menu_item['action_name']])?$actions[$menu_item['action_name']]:$actions["-"],
                "name" => "MENU_ITEM_" . $menu_pos
            ];

            //add to languages
            foreach($settings['languages'] as &$settings_language) {
                foreach($menu_item['name_translations'] as $tr) {
                    if ($settings_language['language']==$tr['language_code']) $settings_language['items']["MENU_ITEM_" . $menu_pos] =$tr['language_value'];
                }
            }

            $menu[]= $item;
            $menu_pos++;
        }



        /*if (!empty($menu_model)) {
            try {
                $json_data = json_decode($menu_model->menu,true,$depth=512, JSON_THROW_ON_ERROR);

                $menu_dev = $json_data;
                foreach($menu_dev as $menu_item) {

                }

            } catch (Exception $e) {
                // handle exception
            }
        }

        $menu = [];
        $menu[] = ["MENU_POS_1","url.page1"];
        $menu[] = ["MENU_POS_2","url.page2"];
        $menu[] = ["MENU_POS_3","url.page3"];
        $menu[] = ["MENU_POS_4","url.page4"];
        $menu[] = ["MENU_POS_5","url.page5"];
        $menu[] = ["MENU_POS_6","url.page6"];*/
        $settings['menu'] = $menu;
        return $settings;
    }



    /**
     * Вернем меню приложение - метод повторяет аналогичный из MobileController
     */
    private function getMenu(Application $app) {


    }

}
