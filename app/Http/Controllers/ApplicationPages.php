<?php
/**
 * Page manipulation
 */
namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Validator;
use Illuminate\Http\Request;
use App\Models\Application;
use App\Models\Colors;
use App\Models\Application_Languages;
use App\Models\Application_IAP;
use App\Models\Application_Page;
use App\Models\Application_IAP_Description;
use App\Models\InAppPurchase;
use App\Models\LayoutPages;
use App\Models\Components;
use App\Models\StartPageAnimation;
use App\Models\BuildQueryWWW;
use App\Models\ApplicationStartAnimation;
use App\Models\ApplicationPageComponent;
use Illuminate\Support\Facades\Schema;

class ApplicationPages extends Controller
{



    /**
     * get application pages
     */
    function appPages(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'id' => 'required',
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $currentUser = auth()->user();
            $app = Application::find($request['id']);
            $pages = [];
            if (Application::userHasAccess($request['id'])) {

                $pages = Application_Page::where("app_id",$app->id)->get();

                $response = response()->json(['pages'=>$pages]);
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }
        return $response;
    }


    /**
     * Update page position, update width and height
     */
    function updatePagePos(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'id' => 'required',
                'page_id' => 'required',
                'left' => 'required',
                'top' => 'required',
                'height' => 'required',
                'width' => 'required',
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            if (Application::userHasAccess($request['id'])) {

                $page = Application_Page::find($request['page_id']);
                if ($page->id) {
                    $page->pos_x = intval($request['left']);
                    $page->pos_y = intval($request['top']);
                    $page->width = intval($request['width']);
                    $page->height = intval($request['height']);
                    $page->save();
                }

                $response = response()->json(['message' => 'DATA_UPDATED']);
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }

        }
        return $response;
    }




    /**
     * get all items for layout services
     */
    function getLayoutItems(Request $request) {

        $validator = Validator::make(
            $request->all(),
            array(
                'id' => 'required',
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            if (Application::userHasAccess($request['id'])) {

                $pages = LayoutPages::where("disabled",0)->get();

                $components = new Components();

                $components_all = $components->getAvailableComponentsShort($request['id']);
                $headers = [];

                // create categories
                $component_tree = [];
                foreach($components_all as $component) {

                    if (!isset($component_tree[$component['category']])) {
                        $component_tree[$component['category']]['items'] = [];
                        $component_tree[$component['category']]['category'] = $component['category'];
                        $component_tree[$component['category']]['title'] = ucfirst($component['category']);
                        $component_tree[$component['category']]['description'] = "";
                    }
                    $component_tree[$component['category']]['items'][]=$component;
                }
                //Fill tree data from json
                $categories_info = $components->getDirectoriesInfo();
                foreach($component_tree as $c=>$v) {
                    if (isset($categories_info[$c])) {
                        $component_tree[$c]['title']=$categories_info[$c]['name'];
                        $component_tree[$c]['description']=$categories_info[$c]['description'];
                    }
                }

                $response = response()->json(['pages' => $pages, "components"=>array_values($component_tree)]);
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }
        return $response;
    }


    /**
     * Add page to application
     */
    function addPage(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'id' => 'required',
                'left' => 'required',
                'top' => 'required',
                'height' => 'required',
                'width' => 'required',
                'type' => 'required',
                'name' => 'required',
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $app = Application::find($request['id']);
            if (Application::userHasAccess($request['id'])) {

                $page = new Application_Page();
                $page->app_id = $app->id;
                $page->type = $request['type'];
                $page->name = $request['name'];
                $page->pos_x = intval($request['left']);
                $page->pos_y = intval($request['top']);
                $page->width = intval($request['width']);
                $page->height = intval($request['height']);
                $page->height = intval($request['height']);
                $page->save();
				$app->need_www_build = true;
				$app->save();
				
				//if it is a first added page, and start page not contains @next_page_link, add it
				$pages = Application_Page::where("app_id",$request['id'])->get();
				if ($pages->count()==2) {
					$start_page = Application_Page::where("app_id",$request['id'])->where("type","start")->first();
					$start_page->start_page_next_page = $page->id;
					$start_page->save();
				}

                $response = response()->json(['page' => $page]);
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }
        return $response;
    }



    /**
     * Remove from to application
     */
    function removePage(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'id' => 'required',
                'page_id' => 'required',
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $app = Application::find($request['id']);
            if (Application::userHasAccess($request['id'])) {

                $page = Application_Page::where("app_id",$app->id)->where("id",$request['page_id'])->delete();

				$app->need_www_build = true;
				$app->save();

                $response = response()->json(['message' => 'PAGE_DELETED']);
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }
        return $response;
    }



    /**
     * Apply modified settings page from front in core
     */
    function setPageData(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'id' => 'required',
                'page_id' => 'required',
                'page_settings' => 'required',
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $app = Application::find($request['id']);

            //get page
            $page = Application_Page::find($request['page_id']);

            if ($page->app_id==$app->id && Application::userHasAccess($request['id'])) {

                //First - change page name
                if ($page->type!='start') $page->name = $request['page_settings']['page']['name'];
                $page->background = $request['page_settings']['page']['background'];
                $page->show_admob_reward_video = $request['page_settings']['page']['show_admob_reward_video'];
                $page->show_admob_interstitial = $request['page_settings']['page']['show_admob_interstitial'];
                $page->show_admob_banner = $request['page_settings']['page']['show_admob_banner'];
                $page->current_animation = $request['page_settings']['page']['current_animation'];
                $page->start_page_next_page = $request['page_settings']['page']['start_page_next_page'];
                $page->start_page_timeout = $request['page_settings']['page']['start_page_timeout'];
                $page->ion_padding = $request['page_settings']['page']['ion_padding'];


                //page background image
                if (empty($request['page_settings']['background_image_settings']) || $request['page_settings']['background_image_settings']=="default") {
                    $page->background_image = 'default';
                } else if ($request['page_settings']['background_image_settings']=="none") {
                    $page->background_image = 'none';
                } else if ($request['page_settings']['background_image_settings']=="custom" && $request['page_settings']['page']['background_image']!="") {
                    //copy image to storage
                    $appDir = public_path().'/storage/application/'.$app->id.'-'.$app->unique_string_id.'/resources/';
                    $filenameBg = "background_page_" . $app->id . '_' . date("YmdHis") . ".png";
                    $output_file = $appDir.$filenameBg;
                    $ifp = fopen( $output_file, 'wb' );
                    $data = explode( ',', $request['page_settings']['page']['background_image'] );
                    fwrite( $ifp, base64_decode($data[1] ) );
                    fclose( $ifp );
                    $page->background_image = $filenameBg;
                    $page->background_image_mode = $request['page_settings']['page']['background_image_mode'];
                    $page->background_image_size = $request['page_settings']['page']['background_image_size'];
                } else if ($request['page_settings']['background_image_settings']=="custom" && $request['page_settings']['page']['background_image']!="") {
					$page->background_image = 'default';
				}


                //start page animation
                $page->current_animation_settings = '{}';
                if (!empty($request['page_settings']['selectedAnimation'])) {
                    $obj = new \stdClass();
                    if (isset($request['page_settings']['selectedAnimation']['color1'])) $obj->color1=$request['page_settings']['selectedAnimation']['color1'];
                    if (isset($request['page_settings']['selectedAnimation']['color2'])) $obj->color2=$request['page_settings']['selectedAnimation']['color2'];
                    if (isset($request['page_settings']['selectedAnimation']['color3'])) $obj->color3=$request['page_settings']['selectedAnimation']['color3'];
                    if (isset($request['page_settings']['selectedAnimation']['color4'])) $obj->color4=$request['page_settings']['selectedAnimation']['color4'];
                    if (isset($request['page_settings']['selectedAnimation']['color5'])) $obj->color5=$request['page_settings']['selectedAnimation']['color5'];
                    $page->current_animation_settings = json_encode($obj);
                }

                $page->save();

                //check new user colors
                foreach($request['page_settings']['colors_user'] as $color_row) {

                    //if color is new - store this to table
                    if (isset($color_row['new']) && $color_row['new']) {
                        $rgb = Colors::hexToRgb($color_row['color_value']);
                        if (!isset($color_row['disabled'])) $color_row['disabled'] = 0;
                        $color_name = $color_row['color_name'];
                        if ($color_row['named']=="") {
                            $color_row['named'] = "color".date("h:i:s");
                        }
                        if ($color_row['color_name']=="") {
                            $color_name = "--ion-color-". preg_replace("/[^0-9a-z]/","",strtolower($color_row['named']));
                        }

                        //create color
                        Colors::create(
                            [
                                "app_id"=>$app->id,
                                "color_name"=>$color_name,
                                "color_value"=>$color_row['color_value'],
                                "disabled"=>$color_row['disabled'],
                                "color_value_rgb"=>"{$rgb['r']}, {$rgb['g']}, {$rgb['b']}",
                                "color_type"=>"user",
                                "named"=>preg_replace("/[^0-9a-z]/","",strtolower($color_row['named'])),
                                "name"=>trim($color_row["name"]),
                            ]
                        );

                        $tint_color = Colors::getTintFromHex($color_row['color_value']);
                        $shade_color = Colors::getShadeFromHex($color_row['color_value']);
                        $contrast_color = Colors::getContrastColor($color_row['color_value']);
                        $contrast_color_hex = $contrast_color['hex'];
                        $contrast_color_rgb = $contrast_color['rgb']['r'] . ', '.$contrast_color['rgb']['g']. ', '.$contrast_color['rgb']['b'];

                        $named = preg_replace("/[^0-9a-z]/","",strtolower($color_row['named']));
                        Colors::where("app_id",$app->id)
                        ->where("color_name",$color_name)
                        ->update(
                            ['color_value_tint' => $tint_color['hex'],
                            'color_value_shade'=> $shade_color['hex'],
                            'color_value_contrast'=> $contrast_color_hex,
                            'color_value_contrast_rgb'=> $contrast_color_rgb,
                            ]
                        );

                    }
                }


				$app->need_www_build = true;
				$app->save();

                $response = response()->json(['message'=>"DATA_UPDATED"]);
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }
        return $response;
    }


    /**
     * get and prepare page data
     */
    function getPageData(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'id' => 'required',
                'page_id' => 'required',
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $app = Application::find($request['id']);
            if (Application::userHasAccess($request['id'])) {

                $return = [];
                $page = Application_Page::where("app_id",$app->id)->where("id",$request['page_id'])->first();
                $return['page'] = $page;    //page data
                $return['page']['application_id'] = $app->id;    //appliadtion id
                $return['page']['unique_string_id'] = $app->unique_string_id;    //appliadtion id
                $return['page']['ion_padding'] = $page->ion_padding;    //ion_padding id

                $return['admob_enabled'] = $app->admob_enabled;    //admon settings


                //Colors
                $colors = $app->getColorsArray();
                $return['colors'] = $colors;
                foreach($colors as $color) {
                    if ($color->color_type=="system" && $color->named!="") $return['colors_main'][]=$color;
                    else if ($color->color_type=="system") $return['colors_system'][]=$color;
                    else if ($color->color_type!="system") $return['colors_user'][]=$color;
                }
                if (!isset($return['colors_user'])) $return['colors_user']=[];

                //Background images
                //get default image
                $default_background_mode['background_image_size']=$app->background_image_size;
                $default_background_mode['background_image_mode']=$app->background_image_mode;
                $default_background_mode['background_image']=(!$app->background_image)?'':$app->background_image;
                $return['default_background_mode'] = $default_background_mode;

                //get current page background images and replace this with default (if null)
                /*if (empty($page->background_image)) {
                    $return['page']['background_image'] = $default_background_mode['background_image'];
                    $return['page']['background_image_mode'] = $default_background_mode['background_image_mode'];
                    $return['page']['background_image_size'] = $default_background_mode['background_image_size'];
                }
                if (empty($return['page']['background_image_mode'])) $return['page']['background_image_mode'] = "repeat";
                if (empty($return['page']['background_image_size'])) $return['page']['background_image_size'] = "auto";
                */


                //List other pages (for redirect after timeout)
                $return['pages'] = Application_Page::where("app_id",$app->id)->where("type",'<>','start')->get();

                // if page is type==start, get all aplications
                if ($page->type=="start") {
                    $start_animations = StartPageAnimation::all();
                    $return['page']['start_animations'] = $start_animations;

                    //redefine animation color, if exists
                    try {
                        $jsonObj  = json_decode($page->current_animation_settings, true);
                        if ($jsonObj === null && json_last_error() !== JSON_ERROR_NONE) {
                            $return['page']['start_animations_color_nod_defined'] = true;
                        } else {

                            foreach($start_animations as $sa_index=>$sa) {
                                if ($sa->id == $page->current_animation) {
                                    $return['page']['start_animations_color_nod_defined1'] = $sa;

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

                            $return['page']['start_animations_color_nod_defined'] = $jsonObj;
                         }

                    }
                    catch (Exception $e) {
                        //
                        $return['page']['start_animations_color_nod_defined'] = true;
                    }

                    //$return['page']['current_animation'] = 1;


					$custom_app_animations = ApplicationStartAnimation::where('app_id', $app->id)->first();
                    if ($custom_app_animations) {
						$return['page']['custom_app_animation_html']= $custom_app_animations->html;
						$return['page']['custom_app_animation_css']= $custom_app_animations->css;
                    } else {
						$return['page']['custom_app_animation_html']= "";
						$return['page']['custom_app_animation_css']= "";
                    }


                } else {

                    //just create ionic content
                    $colors = $app->getColorsArray();
                    $return['page']['ionic_html']= "";
                    $css = "";
                    $html = "";

                    //get all page components
                    $has_footer = false;
                    $has_header = false;
                    $has_menu = false;
                    $header = "";
                    $footer = "";
                    $menu = "";
                    $body = "";


                    //need to be rewrite

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
                        $data["colors"]=$app->getColors();
                        if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
                            //$components_on_page_data[] = [];
                        } else {
                            $components_on_page_data[] = $data;
                        }
                    }
                    $components = new Components();
                    $components->inner_only = true;
                    $components->setComponentDataByPage($components_on_page_data);
                    $available_conponents = $components->getAvailableComponentsByPage($app->id,$page->id); 

                    //scan pagecomponents
                    foreach($components_on_page as $page_component) {
                        
                        //scan all components and get current
                        foreach($available_conponents as $available_conponent) {
                            if ($available_conponent['code'] == $page_component->component_code  && $available_conponent['component_id']==$page_component->id) {

                                $page_component['data'] = $available_conponent;

                                if ($page_component->position=="footer") {
                                    $has_footer = true;
                                    $footer ="\n\n".$available_conponent['inner_html'];
                                } else if ($page_component->position=="header") {
                                    $has_header = true;
                                    $header ="\n\n".$available_conponent['inner_html'];
                                } else if ($page_component->position=="menu") {
                                    $has_menu = true;
                                    $menu ="\n\n".$available_conponent['inner_html'];
                                }  else if ($page_component->position=="body") {
                                    $body .="\n\n".$available_conponent['inner_html'];
                                }
                                $css .="\n\n".$available_conponent['inner_css'];
                            }
                        }
                    }


                    if ($page->ion_padding) $ion_content_class = "class='ion-padding ui-sortable'";
                    else if ($page->fullscreen) $ion_content_class = "class='ui-sortable'";
                    else $ion_content_class = "class='ion-padding-top ui-sortable'";

                    $html .='<ion-page class="ion-page-'.$page->id.'">'.$header.'<ion-content id="ion-content'.$page->id.'" '.$ion_content_class.'>'.$body.'</ion-content>'.$footer.'</ion-page>';

                    //set text and bg color
                    $color_css = "ion-page.ion-page-".$page->id." {\n";
                    foreach($colors as $color) {
                        $color_css .= $color->color_name.":".$color->color_value.";\n";
                    }
                    $color_css .="\n}\n\n";
                    $css = $color_css . "ion-page.ion-page-".$page->id." ion-content {--background: transparent;\n --color: var(".$page->text.");\n}\n".$css;


                    //wrapper for menu
                    //add in next time
                    if ($has_menu) {
                        //$html = $menu. "\n<div class='ion-page' id='main-content'>\n" . $html . "\n</div>\n";
                        /*$html .= "\n<div class='ion-page' id='main-content'>\n";
                        $html .= "\n".$menu."\n";
                        $html .= "\n</div>\n";*/
                    } else {
                        $menu = "";
                    }

                    //add wrapper
                    if ($has_footer && $has_header) {
                        $html = "<div class='page-card-wrapper-footer-header'>" . $html .'</div>';
                    } else if ($has_footer) {
                        $html = "<div class='page-card-wrapper-footer'>" . $html .'</div>';
                    } else if ($has_header) {
                        $html = "<div class='page-card-wrapper-header'>" . $html .'</div>';
                    } else {
                        $html = "<div class='page-card-wrapper'>" . $html .'</div>';
                    }
                    $return['page']['has_footer'] = $has_footer;
                    $return['page']['has_header'] = $has_header;

                    $return['page']['ionic_html']= "<style>".$css."</style>".$html;


                }

                $response = response()->json($return);
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }
        return $response;
    }

    function getPageCustomCode(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'pageId' => 'required',
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            if (Application::userHasAccess($request['appId'])) {
                $app_page = Application_Page::find($request['pageId']);
                return response()->json(['code_values' => $app_page->getCustomCode()]);
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }

        return $response;
    }

    function setPageCustomCode(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'pageId' => 'required',
                'code_values' => 'required'
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            if (Application::userHasAccess($request['appId'])) {
                $app_page = Application_Page::find($request['pageId']);
                $code_values = (object) $request['code_values'];
                $app_page->saveCustomCode($code_values->import_section, $code_values->variables, $code_values->define_constructor_objects, $code_values->constructor_code, $code_values->on_init, $code_values->on_destroy, $code_values->ion_view_will_enter, $code_values->ion_view_did_enter,
                    $code_values->ion_view_will_leave, $code_values->ion_view_did_leave, $code_values->user_functions, $code_values->header, $code_values->menu, $code_values->content_before, $code_values->content_after, $code_values->footer, $code_values->scss);
					$app = Application::find($request['appId']);
					$app->need_www_build = true;
					$app->save();
                $response = response()->json(['message' => 'DATA_UPDATED']);
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }

        return $response;
    }


    /**
     * Add page component to pages_component table
     */
    function setPageComponent(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'pageId' => 'required',
                'component' => 'required'
            )
        );

        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            if (Application::userHasAccess($request['appId'])) {
                $app_page = Application_Page::find($request['pageId']);

                //check, if component has code
                if ($request->component['package_info']['position']!='' && $request->component['package_info']['code']!='') {

                    //remove old footer, header and menu
                    if ($request->component['package_info']['position']=="menu" || $request->component['package_info']['position']=="header" || $request->component['package_info']['position']=="footer") {
                        ApplicationPageComponent::where("app_id",$request->appId)->where("page_id",$request->pageId)->where("component_code",$request->component['package_info']['code'])->delete();
                    }

                    //add new
                    $component = new ApplicationPageComponent();
                    $component->app_id = $request->appId;
                    $component->page_id = $request->pageId;
                    $component->component_code = $request->component['package_info']['code'];
                    $component->title = $request->component['package_info']['name'];
                    $component->position = $request->component['package_info']['position'];
                    $component->x = $request->component['x'];
                    $component->y = $request->component['y'];
                    $component->x0= $request->component['x0'];
                    $component->y0= $request->component['y0'];
                    $component->from_left_to_x0= $request->component['from_left_to_x0'];
                    $component->from_top_to_y0= $request->component['from_top_to_y0'];

                    // add to code default values
                    $search_in_dir = public_path() . '/storage/components/visual';
                    if (file_exists($search_in_dir. "/" . $component->component_code . "/default_values.php")) {

                        //
                        $default_values = [];
                        include $search_in_dir. "/" . $component->component_code . "/default_values.php";

                        if (isset($default_values['code'])) {
                            $component->code = json_encode($default_values['code']);
                        }
                        foreach($default_values as $key=>$value) {
                            if ($key!="code" && Schema::hasColumn('application_page_components', $key)) {
                                $component[$key] = $value;
                            }
                        }
                    }

                    //visibility
                    $visibility = [
                        "and"=>[],
                        "or"=>[],
                    ];

                    if (isset($request['visibility']['and'])) {
                        foreach($request['visibility']['and'] as $condition) $visibility["and"][]=$condition;
                    }

                    if (isset($request['visibility']['or'])) {
                        foreach($request['visibility']['or'] as $condition) $visibility["or"][]=$condition;
                    }

                    $component->visibility = json_encode($visibility);

                    $component->save();
					
					$app = Application::find($request['appId']);
					$app->need_www_build = true;
					$app->save();					

                }


                $response = response()->json(['message' => 'DATA_UPDATED']);
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }
        return $response;
    }


    /**
     * Get page components
     */
    function getPageComponents(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'pageId' => 'required',
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            if (Application::userHasAccess($request['appId'])) {
                $app_page = Application_Page::find($request['pageId']);
                return response()->json($app_page->getComponents());
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }

        return $response;
    }

    /**
     * Delete component from page
     */
    function deleteComponentFromPage(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'component_id' => 'required',
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            if (Application::userHasAccess($request['appId'])) {
                ApplicationPageComponent::where("app_id",$request['appId'])->where("id",$request['component_id'])->delete();
				
				$app = Application::find($request['appId']);
				$app->need_www_build = true;
				$app->save();
					
                return $this->getPageComponents($request);
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }

        return $response;
    }    


    /**
     * Update page component data 
     */
    public function updatePageComponentData(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'pageId' => 'required',
                'component_id' => 'required',
                'component_data' => 'required',
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            if (Application::userHasAccess($request['appId'])) {
                
                $c = ApplicationPageComponent::find($request['component_id']);
                if (!empty($c)) {

                    $data = $request->component_data;
                    $result = [];
                    foreach($data as $key=>$value) {

                        $line = $key . "=".urlencode($value);
                        
                        if (strpos($key,"[")!==false) {
                            parse_str($line,$output);
                            $result = array_merge_recursive($result,$output);
                        }
                    }

                    //fix array data
                    $data = array_merge($data,$result);
                    $c->code = json_encode($data);


                    //x,y,w,h,css_class
                    if (isset($request['position_data']['fixed_right'])) $c->fixed_right = (int)$request['position_data']['fixed_right'];
                    if (isset($request['position_data']['fixed_left'])) $c->fixed_left = (int)$request['position_data']['fixed_left'];
                    if (isset($request['position_data']['fluid_width'])) $c->fluid_width = (int)$request['position_data']['fluid_width'];
                    if (isset($request['position_data']['fluid_height'])) $c->fluid_height = (int)$request['position_data']['fluid_height'];
					
                    if (isset($request['position_data']['use_card'])) $c->use_card = (int)$request['position_data']['use_card'];
                    if (isset($request['position_data']['card_border_radius'])) $c->card_border_radius = (int)$request['position_data']['card_border_radius'];
                    if (isset($request['position_data']['card_border_width'])) $c->card_border_width = (int)$request['position_data']['card_border_width'];
                    if (isset($request['position_data']['card_opacity'])) $c->card_opacity = $request['position_data']['card_opacity'];
                    if (isset($request['position_data']['card_background_color'])) $c->card_background_color = $request['position_data']['card_background_color'];
                    if (isset($request['position_data']['card_border_color'])) $c->card_border_color = $request['position_data']['card_border_color'];
					
                    if (isset($request['position_data']['card_shadow'])) $c->card_shadow  = $request['position_data']['card_shadow'];
                    if (isset($request['position_data']['card_padding_top'])) $c->card_padding_top  = $request['position_data']['card_padding_top'];
                    if (isset($request['position_data']['card_padding_left'])) $c->card_padding_left   = $request['position_data']['card_padding_left'];
                    if (isset($request['position_data']['rotate'])) $c->rotate = $request['position_data']['rotate'];
					
					
                    if (isset($request['position_data']['fixed'])) $c->fixed = (int)$request['position_data']['fixed'];
                    if (isset($request['position_data']['height'])) $c->height = (int)$request['position_data']['height'];
                    if (isset($request['position_data']['width'])) $c->width = (int)$request['position_data']['width'];
                    if (isset($request['position_data']['rotate'])) $c->rotate = (int)$request['position_data']['rotate'];
                    if (isset($request['position_data']['css_class'])) $c->css_class = $request['position_data']['css_class'];
					
                    if (isset($request['position_data']['x0'])) {
                        $c->x0 = (int)$request['position_data']['x0'];
                        $c->x = (int)$request['position_data']['x0'];
                        $c->from_left_to_x0 = (int)$request['position_data']['x0'];
                    }
                    if (isset($request['position_data']['y0'])) {
                        $c->y0 = (int)$request['position_data']['y0'];
                        $c->y = (int)$request['position_data']['y0'];
                        $c->from_top_to_y0 = (int)$request['position_data']['y0'];
                    }

                    //visibility
                    $visibility = [
                        "and"=>[],
                        "or"=>[],
                    ];

                    if (isset($request['visibility']['and'])) {
                        foreach($request['visibility']['and'] as $condition) $visibility["and"][]=$condition;
                    }

                    if (isset($request['visibility']['or'])) {
                        foreach($request['visibility']['or'] as $condition) $visibility["or"][]=$condition;
                    }

                    $c->visibility = json_encode($visibility);

                    $c->save();
                    $response = response()->json(['message' => 'DATA_UPDATED', 'component_data'=>$request->component_data]);
                    //$response = response()->json($data);
					$app = Application::find($request['appId']);
					$app->need_www_build = true;
					$app->save();
				
                } else {
                    $response = response()->json(['error' => 'NOT_FOUND'], 403);
                }
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }
        return $response;     
    }


    /**
     * Update page component data 
     */
    public function updateComponentsPosition(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'pageId' => 'required',
                'positions' => 'required',
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            if (Application::userHasAccess($request['appId'])) {
                

                foreach($request->positions as $pos) {
                    $c = ApplicationPageComponent::find($pos['id']);
                    if (!empty($c)) {
                        $c->width = $pos['width'];
                        $c->rotate = $pos['rotate'];
                        $c->height = $pos['height'];
                        $c->x = $pos['x0'];
                        $c->y = $pos['y0'];
                        $c->x0 = $pos['x0'];
                        $c->y0 = $pos['y0'];
                        $c->x1 = $pos['x0'] + $pos['width'];
                        $c->y1 = $pos['y0'] + $pos['height'];
                        $c->from_left_to_x0 = $pos['x0'];
                        $c->from_top_to_y0 = $pos['y0'];
                        $c->from_right_to_x1 =$pos["parent_width"] - ($pos['x0'] + $pos['width']);
                        $c->from_bottom_to_y1 =$pos["parent_height"] - ($pos['y0'] + $pos['height']);
                        $c->save();
                    }
                    //print_r($c);
					$app = Application::find($request['appId']);
					$app->need_www_build = true;
					$app->save();					
                }
                $response = response()->json(['message' => 'DATA_UPDATED']);

            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }
        return $response;     
    }


    /**
     * Проанализируем компоненты, найдем в их данных все переходы и
     * сформируем массив для стрелок на экране
     */
    function getPageLines(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
              )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            if (Application::userHasAccess($request['appId'])) {
                $components_on_page = ApplicationPageComponent::where("app_id",$request['appId'])->get();
                $lines = [];
				
				//start page line
				$start_page = Application_Page::where("app_id",$request['appId'])->where("type","start")->first();
				if ($start_page->start_page_next_page>0) $lines[] = ["id"=>$start_page->id, "relations"=>[$start_page->start_page_next_page]];
				
				
                foreach($components_on_page as $page_component) {
                    $relations = [];
                    preg_match_all('/gotopage(.*).page[0-9]+/', $page_component->code, $output_array);
                    foreach ($output_array as $line) {
                        if (isset($line[0])) {
                             $parts = explode(".page",$line[0]);
                             if (isset($parts[1])) $relations[]=$parts[1];

                        }
                    }
                    if (count($relations)>0) {
						$lines_item = ["id"=>$page_component->page_id,"relations"=>$relations];
						$lines[]=$lines_item;
					}
                }
                $response = response()->json($lines);
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }        
        return $response;   
    }
}
