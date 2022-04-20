<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Models\Application;
use App\Models\ApplicationPageComponent;
use App\Models\Components;

class Application_Page extends Model
{
    use HasFactory;


    protected $table = 'application_pages';
    protected $primaryKey = 'id';

    protected $application;


    /**
     * Return custom code values.
     *
     * @return object|null
     */
    function getCustomCode()
    {
        $res = DB::table('application_pages_custom_code')
            ->where('page_id', $this->id)
            ->get();
        if (!$res->isEmpty()) return $res->first(); else {
            $ret = new \stdClass;
            $ret->import_section = "";
            $ret->variables = "";
            $ret->define_constructor_objects = "";
            $ret->constructor_code = "";
            $ret->on_init = "";
            $ret->on_destroy = "";
            $ret->ion_view_will_enter = "";
            $ret->ion_view_did_enter = "";
            $ret->ion_view_will_leave = "";
            $ret->ion_view_did_leave = "";
            $ret->user_functions = "";
            $ret->header = "";
            $ret->menu = "";
            $ret->content_before = "";
            $ret->content_after = "";
            $ret->footer = "";
            $ret->scss = "";
            return $ret;
        };
    }

    /**
     * Save application page custom code.
     *
     * @param $import_section
     * @param $variables
     * @param $define_constructor_objects
     * @param $constructor_code
     * @param $on_init
     * @param $on_destroy
     * @param $ion_view_will_enter
     * @param $ion_view_did_enter
     * @param $ion_view_will_leave
     * @param $ion_view_did_leave
     * @param $user_functions
     * @param $header
     * @param $menu
     * @param $content_before
     * @param $content_after
     * @param $footer
     * @param $scss
     */
    function saveCustomCode($import_section, $variables, $define_constructor_objects, $constructor_code, $on_init, $on_destroy, $ion_view_will_enter, $ion_view_did_enter,
                            $ion_view_will_leave, $ion_view_did_leave, $user_functions, $header, $menu, $content_before, $content_after, $footer, $scss) {
        DB::table('application_pages_custom_code')
            ->updateOrInsert(['page_id' => $this->id], [
                'import_section' => $import_section ? $import_section : "",
                'variables' => $variables ? $variables  : "",
                'define_constructor_objects' => $define_constructor_objects ? $define_constructor_objects : "",
                'constructor_code' => $constructor_code ? $constructor_code : "",
                'on_init' => $on_init ? $on_init : "",
                'on_destroy' => $on_destroy ? $on_destroy : "",
                'ion_view_will_enter' => $ion_view_will_enter ? $ion_view_will_enter : "",
                'ion_view_did_enter' => $ion_view_did_enter ? $ion_view_did_enter : "",
                'ion_view_will_leave' => $ion_view_will_leave ? $ion_view_will_leave : "",
                'ion_view_did_leave' => $ion_view_did_leave ? $ion_view_did_leave : "",
                'user_functions' => $user_functions ? $user_functions : "",
                'header' => $header ? $header : "",
                'menu' => $menu ? $menu : "",
                'content_before' => $content_before ? $content_before : "",
                'content_after' => $content_after ? $content_after : "",
                'footer' => $footer ? $footer : "",
                'scss' => $scss ? $scss : "",
                ]);
    }


    /**
     * return page components
     */
    function getComponents() {
        $components_on_page = ApplicationPageComponent::where("app_id",$this->app_id)->where("page_id",$this->id)->get();

        $components_on_page_data = [];
        $app = Application::find($this->app_id);
        //collect all components data
        foreach($components_on_page as $page_component) {

            $visibility = json_decode($page_component->visibility,true);
            if ($visibility === null && json_last_error() !== JSON_ERROR_NONE) {
                $visibility = [
                    "and"=>[],
                    "or"=>[],
                ];
            } else {
                //
            }
            $page_component->visibility = $visibility;
			$colors =$app->getColors();
            $data = json_decode($page_component->code,true);
            $data["app_id"]=$this->app_id;
            $data["page_id"]=$this->id;
            $data["application"]=$app;
            $data["colors"]=$app->getColors();
            $data["page"]=$this;
            $data["component"]=$page_component;
            $data["page_component_id"]=$page_component->id;
            $data["page_component_code"]=$page_component->component_code;            
            $data["colors"]=$app->getColors();
            if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
                //$components_on_page_data[$page_component->component_code] = [];
            } else {
                //$components_on_page_data[$page_component->component_code] = $data;
                $components_on_page_data[] = $data;
            }
        }

        $components = new Components();
        $components->inner_only = true;
        $components->setComponentDataByPage($components_on_page_data);

        //print_r($components_on_page_data);
        //exit;

        $available_conponents = $components->getAvailableComponentsByPage($app->id,$this->id); 

        $actions_and_variables = $components->getListActionsVariables($app->id); 
        
        //scan pagecomponents
        foreach($components_on_page as $page_component) {
            
            //scan all components and get current
            foreach($available_conponents as $available_conponent) {
                if ($available_conponent['code'] == $page_component->component_code && $available_conponent['component_id']==$page_component->id) {
                    $page_component['data'] = $available_conponent;
                    $page_component['actions_and_variables'] = $actions_and_variables;
                    $page_component['colors'] = $colors;
                }

            }

        }
        if (!$components_on_page->isEmpty()) return $components_on_page; else return [];
    }
}
