<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Application;
use voku\helper\HtmlDomParser;
use Illuminate\Support\Facades\Log;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;

class Components extends Model
{
    use HasFactory;

    /**
     * Get all available modules for this application
    */

    protected $_available_modules_system;
    protected $_available_components;
    protected $_components_on_page_data;
    protected $_components_on_page_data_by_page;
    protected $_application;

    protected $_actions = [];
    protected $_variables = [];
    protected $_visibility_conditions = [];

    public $inner_only = false;


    public function setComponentData($data) {
        $this->_components_on_page_data = $data;
    }

    public function setComponentDataByPage($data) {
        $this->_components_on_page_data_by_page = $data;
    }

    /**
     * Return directory descriptions
     */
    public function getDirectoriesInfo() {
        $result = [];
        $search_in_dir = public_path() . '/storage/components/visual';
        if (file_exists($search_in_dir. "/components.json")) {
            $json_content = file_get_contents($search_in_dir. "/components.json");
            $package_json = json_decode($json_content,true);

            if ($package_json === null && json_last_error() !== JSON_ERROR_NONE) {
               // echo "incorrect data";
            } else {
               $result = $package_json;
            }
        }
        return $result;
    }


    /**
     * Return availables system modules
     */
    public function getAvailableModulesSystem($app_id, $force = false) {
        if ($force || !$this->_available_modules_system) {

            $this->_available_modules_system = $this->_getAvailableModulesSystem($app_id);
        }
        return $this->_available_modules_system;
    }

    /**
     * Return availables visual components (short, wo form and other)
     */
    public function getAvailableComponentsShort($app_id, $force = false) {
        if ($force || !$this->_available_components) {

            $this->_available_components = $this->_getAvailableComponents($app_id, true);
        }
		
        return $this->_available_components;
    }

    /**
     * Return availables visual components
     */
    public function getAvailableComponents($app_id, $force = false) {
        if ($force || !$this->_available_components) {

            $this->_available_components = $this->_getAvailableComponents($app_id);
        }
        return $this->_available_components;
    }


    /**
     * Подбираем компоненты по page_id
     * метод подогнан под задачу, потом оптимизировать
     */
    public function getAvailableComponentsByPage($app_id, $page_id, $short = false) {
        
        $search_in_dir = public_path() . '/storage/components/visual';
        $app = Application::find($app_id);
        $this->_application = $app;
        if (!$short) $this->makeFullActionsVariablesList();
        $modules = [];
        $modules_dirs = scandir($search_in_dir);
        $modules_dirs = array_diff($modules_dirs, array('.', '..'));;


        //Сканируем компоненты со страниы, и осуществляем поис по их кодам
        foreach($this->_components_on_page_data_by_page as $page_component) {
            //echo $search_in_dir. "/" . $page_component['page_component_code'] . "/package.json\n";
            if (file_exists($search_in_dir. "/" . $page_component['page_component_code'] . "/package.json")) {
                //echo $search_in_dir. "/" . $page_component['page_component_code'] . "/package.json\n";
                //обнулим массивс данными, и положим туда только актуальные
                $this->_components_on_page_data = [];
                $this->_components_on_page_data[$page_component['page_component_code']] =  $page_component;
                $this->_components_on_page_data[$page_component['page_component_code']]['page_id'] =  $page_id;
                //dd($this->_components_on_page_data);
               // print_r($this->_components_on_page_data);
                //exit;
                $json_content = file_get_contents($search_in_dir. "/" . $page_component['page_component_code']. "/package.json");
                $package_json = json_decode($json_content,true);
                if ($package_json === null && json_last_error() !== JSON_ERROR_NONE) {
                   // echo "incorrect data";

                } else {
                    if (!$short) $module_info = $this->makePackageJsonInfo($package_json, $search_in_dir, $page_component['page_component_code'], false);
                    else $module_info = $this->makePackageJsonInfo($package_json, $search_in_dir, $page_component['page_component_code'], true);
                    $module_info['page_id'] =  $page_id;
                    $module_info['component_id'] =  $page_component['component']->id;
                    ///print_r($module_info);
                    $modules[]=$module_info;
                }                
                
            }
        }
        
        //print_r($this->_components_on_page_data_by_page);
        //print_r($modules);
        //exit;
        return $modules;
    }


    
    /**
     * Return package_json info as array
     */
    private function makePackageJsonInfo($package_json, $search_in_dir, $module_dir, $short = false) {


        //$this->makeVisibilityConditionList($package_json, $search_in_dir, $module_dir);
        //$this->makeActionsList($package_json, $search_in_dir, $module_dir);
        //$this->makeVariablesList($package_json, $search_in_dir, $module_dir);

        $module_info = [];

        $module_info['package_info'] = $package_json;
        $module_info['name'] = $package_json['name'];
        $module_info['code'] = $package_json['code'];
        $module_info['type'] = $package_json['type'];
        $module_info['category'] = $package_json['category'];
        $module_info['description'] = $package_json['description'];
        $module_info['position'] = isset($package_json['position'])?$package_json['position']:'content';
        $module_info['image'] = "";
        $module_info['form_html'] = "";
        if (file_exists($search_in_dir. "/" . $module_dir . "/icon.svg")) {
            $module_info['image'] = file_get_contents($search_in_dir. "/" . $module_dir . "/icon.svg");
        }

        if (file_exists($search_in_dir. "/" . $module_dir . "/form.js")) {
            $module_info['form_js'] = file_get_contents($search_in_dir. "/" . $module_dir . "/form.js");
        } else {
            $module_info['form_js'] = "";
        }

        if (file_exists($search_in_dir. "/" . $module_dir . "/inner.css")) {
            $module_info['inner_css'] = file_get_contents($search_in_dir. "/" . $module_dir . "/inner.css");
        } else {
            $module_info['inner_css'] = "";
        }


        //if simple html for inner component
        if (file_exists($search_in_dir. "/" . $module_dir . "/inner.html") && !$short) {
            $module_info['inner_html'] = file_get_contents($search_in_dir. "/" . $module_dir . "/inner.html");
        } else {
            $module_info['inner_html'] = "";
        }

        //advanced php generate for inner component
        if (file_exists($search_in_dir. "/" . $module_dir . "/inner.php")  && !$short) {
            ob_start();

            unset($component_data);
            global $component_data;
            $component_data = [];

            //старая проверка, для глобальных системных модулей
            if (isset($this->_components_on_page_data[$package_json['code']])) $component_data = $this->_components_on_page_data[$package_json['code']];


            // set some functions
            if (!isset($component_data["app_id"])) $component_data["app_id"]=$this->_application->id;
            if (!isset($component_data["application"])) $component_data["application"]=$this->_application;
            if (!isset($component_data["page"])) $component_data["page"]=[];
            if (!isset($component_data["page_id"])) $component_data["page_id"]=[];
            if (!isset($component_data["colors"])) $component_data["colors"]=$this->_application->getColors();

            $component_data["actions"]=$this->_actions;
            $component_data["visibility_conditions"]=$this->_visibility_conditions;
            $component_data["variables"]=$this->_variables;

            include($search_in_dir. "/" . $module_dir . "/inner.php");
            $out = ob_get_clean();
            $module_info['inner_html'] = $out;
        }

        //advanced php generate for preview component
        if (file_exists($search_in_dir. "/" . $module_dir . "/preview.php")  && !$short) {
            ob_start();

            unset($component_data);
            global $component_data;
            $component_data = [];

            //старая проверка, для глобальных системных модулей
            if (isset($this->_components_on_page_data[$package_json['code']])) $component_data = $this->_components_on_page_data[$package_json['code']];


            // set some functions
            if (!isset($component_data["app_id"])) $component_data["app_id"]=$this->_application->id;
            if (!isset($component_data["application"])) $component_data["application"]=$this->_application;
            if (!isset($component_data["page"])) $component_data["page"]=[];
            if (!isset($component_data["page_id"])) $component_data["page_id"]=[];
            if (!isset($component_data["colors"])) $component_data["colors"]=$this->_application->getColors();

            $component_data["actions"]=$this->_actions;
            $component_data["visibility_conditions"]=$this->_visibility_conditions;
            $component_data["variables"]=$this->_variables;

            include($search_in_dir. "/" . $module_dir . "/preview.php");
            $out = ob_get_clean();
            $module_info['preview_html'] = $out;
        } else $module_info['preview_html'] = $module_info['inner_html'];


        //advanced php generate for inner component
        if (file_exists($search_in_dir. "/" . $module_dir . "/preview_js.php")  && !$short) {
            ob_start();

            unset($component_data);
            global $component_data;
            $component_data = [];

            //старая проверка, для глобальных системных модулей
            if (isset($this->_components_on_page_data[$package_json['code']])) $component_data = $this->_components_on_page_data[$package_json['code']];


            // set some functions
            if (!isset($component_data["app_id"])) $component_data["app_id"]=$this->_application->id;
            if (!isset($component_data["application"])) $component_data["application"]=$this->_application;
            if (!isset($component_data["page"])) $component_data["page"]=[];
            if (!isset($component_data["page_id"])) $component_data["page_id"]=[];
            if (!isset($component_data["colors"])) $component_data["colors"]=$this->_application->getColors();

            $component_data["actions"]=$this->_actions;
            $component_data["visibility_conditions"]=$this->_visibility_conditions;
            $component_data["variables"]=$this->_variables;

            include($search_in_dir. "/" . $module_dir . "/preview_js.php");
            $out = ob_get_clean();
            $module_info['preview_js'] = $out;
        } else $module_info['preview_js'] = "";


        if (!$this->inner_only) {
            if (file_exists($search_in_dir. "/" . $module_dir . "/ionic.css")) {
                $module_info['ionic_css'] = file_get_contents($search_in_dir. "/" . $module_dir . "/ionic.css");
            } else {
                $module_info['ionic_css'] = "";
            }
            if (file_exists($search_in_dir. "/" . $module_dir . "/preview.css")) {
                $module_info['preview_css'] = file_get_contents($search_in_dir. "/" . $module_dir . "/preview.css");
            } else {
                $module_info['preview_css'] = $module_info['ionic_css'];
            }

            if (file_exists($search_in_dir. "/" . $module_dir . "/ionic.html") && !$short) {
                $module_info['ionic_html'] = file_get_contents($search_in_dir. "/" . $module_dir . "/ionic.html");
            } else {
                $module_info['ionic_html'] = "";
            }

            if (file_exists($search_in_dir. "/" . $module_dir . "/ionic.php")  && !$short) {
                ob_start();

                unset($component_data);
                global $component_data;
                $component_data = [];

                if (isset($this->_components_on_page_data[$package_json['code']])) $component_data = $this->_components_on_page_data[$package_json['code']];

                // set some functions
                if (!isset($component_data["app_id"])) $component_data["app_id"]=$this->_application->id;
                if (!isset($component_data["application"])) $component_data["application"]=$this->_application;
                if (!isset($component_data["page"])) $component_data["page"]=[];
                if (!isset($component_data["page_id"])) $component_data["page_id"]=[];
                if (!isset($component_data["colors"])) $component_data["colors"]=$this->_application->getColors();

                $component_data["actions"]=$this->_actions;
                $component_data["visibility_conditions"]=$this->_visibility_conditions;
                $component_data["variables"]=$this->_variables;            

                include($search_in_dir. "/" . $module_dir . "/ionic.php");
                $out = ob_get_clean();
                $module_info['ionic_html'] = $out;
            }
        }



        //load static from
        if (file_exists($search_in_dir. "/" . $module_dir . "/form.html")  && !$short) {
            $module_info['form_html'] = file_get_contents($search_in_dir. "/" . $module_dir . "/form.html");
        }

        $module_info['form_tabs']=[];        
        if (file_exists($search_in_dir. "/" . $module_dir . "/form.php")  && !$short) {
            //print_r($this->_components_on_page_data[$package_json['code']]);
            //if ($package_json['code']=="default_button") print_r($this->_components_on_page_data[$package_json['code']]);
            
            ob_start();

            unset($component_data);
            global $component_data;
            $component_data = [];
  
            if (isset($this->_components_on_page_data[$package_json['code']])) $component_data = $this->_components_on_page_data[$package_json['code']];

            // set some functions
            if (!isset($component_data["app_id"])) $component_data["app_id"]=$this->_application->id;
            if (!isset($component_data["application"])) $component_data["application"]=$this->_application;
            if (!isset($component_data["page"])) $component_data["page"]=[];
            if (!isset($component_data["page_id"])) $component_data["page_id"]=[];
            if (!isset($component_data["colors"])) $component_data["colors"]=$this->_application->getColors();

            $component_data["actions"]=$this->_actions;
            $component_data["visibility_conditions"]=$this->_visibility_conditions;
            $component_data["variables"]=$this->_variables;

            include($search_in_dir. "/" . $module_dir . "/form.php");
            $out = ob_get_clean();
            //if ($package_json['code']=="default_button") print_r($out);
            $module_info['form_html'] = $out;

            //try to explode on tabs
            //echo $module_info['form_html'];
            $dom = HtmlDomParser::str_get_html($module_info['form_html']);
            $tabs = $dom->findMultiOrFalse('form-tab');
            if ($tabs !== false) {
                foreach ($tabs as $tab) {
                    $module_info['form_tabs'][]=[
                        "title"=>$tab->getAttribute('name'),
                        "html"=>$tab->innertext
                    ];
                }
                $module_info['form_html'] = ""; //clear form html
            }

        
        }

        return $module_info;
    }

    /**
     *  Take list from visibility_conditions.php (if exists) and put it to _components_on_page_data.
     */
    function makeVisibilityConditionList($package_json, $search_in_dir, $module_dir) {
        if (file_exists($search_in_dir. "/" . $module_dir . "/visibility_conditions.php")) {
            include($search_in_dir. "/" . $module_dir . "/visibility_conditions.php");

            if (isset($visibility_conditions)) $this->_components_on_page_data[$package_json['code']]['visibility_conditions'] = $visibility_conditions;

        }
    }

    /**
     *  Take list from actions.php (if exists) and put it to _components_on_page_data.
     */
    function makeActionsList($package_json, $search_in_dir, $module_dir) {
        if (file_exists($search_in_dir. "/" . $module_dir . "/actions.php")) {
            include($search_in_dir. "/" . $module_dir . "/actions.php");

            if (isset($actions)) $this->_components_on_page_data[$package_json['code']]['actions'] = $actions;
        }
    }

    /**
     *  Take list from variables.php (if exists) and put it to _components_on_page_data.
     */
    function makeVariablesList($package_json, $search_in_dir, $module_dir) {
        if (file_exists($search_in_dir. "/" . $module_dir . "/variables.php")) {
            include($search_in_dir. "/" . $module_dir . "/variables.php");

            if (isset($variables)) $this->_components_on_page_data[$package_json['code']]['variables'] = $variables;
        }
    }


    /**
     * get availables system module (private)
     */
    private function _getAvailableModulesSystem($app_id) {

        $search_in_dir = public_path() . '/storage/components/modules/system';
        //$search_in_dir = str_replace("\\","/",$search_in_dir);

        $app = Application::find($app_id);
        $this->_application = $app;
        $modules = [];
        if (!empty($app)) {

            $modules_dirs = scandir($search_in_dir);
            $modules_dirs = array_diff($modules_dirs, array('.', '..'));;
            foreach($modules_dirs as $module_dir) {
                if (file_exists($search_in_dir. "/" . $module_dir . "/package.json")) {

                    $json_content = file_get_contents($search_in_dir. "/" . $module_dir . "/package.json");
                    $package_json = json_decode($json_content,true);


                    if ($package_json === null && json_last_error() !== JSON_ERROR_NONE) {
                        //echo "incorrect data";
                    } else {

                        $module_info = $this->makePackageJsonInfo($package_json, $search_in_dir, $module_dir);
                        $modules[]=$module_info;
                    }
                    //$modules[] = $module_dir;
                }

            }


        }
        return $modules;
    }



    /**
     * get availables system module (private)
     */
    private function _getAvailableComponents($app_id, $short = false) {

        $app = Application::find($app_id);
        $this->_application = $app;

        $this->makeFullActionsVariablesList();

        $search_in_dir = public_path() . '/storage/components/visual';


        $modules = [];
        if (!empty($app)) {

            $modules_dirs = scandir($search_in_dir);
            $modules_dirs = array_diff($modules_dirs, array('.', '..'));;
            foreach($modules_dirs as $module_dir) {
                if (file_exists($search_in_dir. "/" . $module_dir . "/package.json")) {

                    $json_content = file_get_contents($search_in_dir. "/" . $module_dir . "/package.json");
                    $package_json = json_decode($json_content,true);
                    /*$module_info['package_info'] = $package_json;
                    $module_info['name'] = $package_json['name'];
                    $module_info['description'] = $package_json['description'];
                    $modules[]=$module_info;*/

                    if ($package_json === null && json_last_error() !== JSON_ERROR_NONE) {
                        //echo "incorrect data";
                    } else {
                        $module_info = $this->makePackageJsonInfo($package_json, $search_in_dir, $module_dir, $short);

                        $modules[]=$module_info;
                    }
                    //$modules[] = $module_dir;
                }

            }


        }
        return $modules;
    }

    /**
     * Create full actions list from system modules and visual components
     */
    private function makeFullActionsVariablesList() {

        $this->_actions = [];
        $this->_variables = [];
        $this->_visibility_conditions = [];

        global $component_data;

        $component_data['application'] = $this->_application;

        // get system actions, variables and visility conditions
        $search_in_dir = public_path() . '/storage/components/modules/system';
        $modules_dirs = scandir($search_in_dir);
        $modules_dirs = array_diff($modules_dirs, array('.', '..'));;
        foreach($modules_dirs as $module_dir) {

            if (file_exists($search_in_dir. "/" . $module_dir . "/actions.php")) {
                include($search_in_dir. "/" . $module_dir . "/actions.php");
                if (isset($actions)) $this->_actions = array_merge($this->_actions, $actions);
            }

            if (file_exists($search_in_dir. "/" . $module_dir . "/variables.php")) {
                include($search_in_dir. "/" . $module_dir . "/variables.php");
                if (isset($variables)) $this->_variables = array_merge($this->_variables, $variables);
            }

            if (file_exists($search_in_dir. "/" . $module_dir . "/visibility_conditions.php")) {
                include($search_in_dir. "/" . $module_dir . "/visibility_conditions.php");
                if (isset($visibility_conditions)) $this->_visibility_conditions = array_merge($this->_visibility_conditions, $visibility_conditions);
            }

        }


        //get visual components actions, variables and visibility_conditions 
        $search_in_dir = public_path() . '/storage/components/visual';
        $modules_dirs = scandir($search_in_dir);
        $modules_dirs = array_diff($modules_dirs, array('.', '..'));;
        foreach($modules_dirs as $module_dir) {

            if (file_exists($search_in_dir. "/" . $module_dir . "/actions.php")) {
                include($search_in_dir. "/" . $module_dir . "/actions.php");
                if (isset($actions)) $this->_actions = array_merge($this->_actions, $actions);
            }

            if (file_exists($search_in_dir. "/" . $module_dir . "/variables.php")) {
                include($search_in_dir. "/" . $module_dir . "/variables.php");
                if (isset($variables)) $this->_variables = array_merge($this->_variables, $variables);
            }

            if (file_exists($search_in_dir. "/" . $module_dir . "/visibility_conditions.php")) {
                include($search_in_dir. "/" . $module_dir . "/visibility_conditions.php");
                if (isset($visibility_conditions)) $this->_visibility_conditions = array_merge($this->_visibility_conditions, $visibility_conditions);
            }

        }



    }

    /**
     * Return array with actions and variables
     */
    public function getListActionsVariables($app_id) {
        $app = Application::find($app_id);
        $this->_application = $app;        
        $this->makeFullActionsVariablesList();
        return [
            "actions"=>$this->_actions,
            "variables"=>$this->_variables,
            "visibility_conditions"=>$this->_visibility_conditions,
        ];
    }


    /**
     * Sort components and calculate margin and
     */
    public function sortComponentsY($components, $has_header = false, $has_footer = false, $preview = false) {
        $return = [];
		//print_r($components);
        //sort by Y
        usort($components, function($a, $b) {
            return $a['page_component']['y0'] <=> $b['page_component']['y0'];
        });

		$visibility_code = [];
		if (isset($components[0]['visibility_conditions'])) {
			foreach($components[0]['visibility_conditions'] as $condition) {
				$visibility_code[$condition['code']] = $condition['angular'];
			}
		}


        //create top margin
        $prev_component = null;
        $ordered_components = [];


		//print_r($visibility_code);
        foreach($components as &$component) {


		//visibility cases
		$visibility = [];
		$visibility_case = "";



		$visibility_and = [];
		$visibility_or = [];
		if (isset($component["page_component"]['visibility'])) {
			$visibility_data = @json_decode($component["page_component"]['visibility'],true);
			if ($visibility_data === null && json_last_error() !== JSON_ERROR_NONE) {
				//error
			} else {
				//create cases for and
				if (isset($visibility_data['and'])) {
					foreach($visibility_data['and'] as $and_cases) {
						$visibility_and[]=$visibility_code[$and_cases];
					}
				}
				//create cases for pr
				if (isset($visibility_data['or'])) {
					foreach($visibility_data['or'] as $or_cases) {
						$visibility_or[]=$visibility_code[$or_cases];
					}
				}
				
				
			}
		}

		if (count($visibility_and)>0) $visibility []= "(" . implode(" && ",$visibility_and) . ")";
		if (count($visibility_or)>0) $visibility []= "(" . implode(" || ",$visibility_or) . ")";
		if (count($visibility)>0) $visibility_case = implode(" && ",$visibility);

		/*print_r($visibility_and);
		print_r($visibility_or);
		print_r($visibility);
		print_r($visibility_case);*/
		
            //те, которые выстраиваются
            if ($component["page_component"]['position']=="body") {

                $style = [];

                //relative position
                if ($component['page_component']['fixed'] !="1") {

                    $header_shift = 0;
                    if ($has_header && !isset($prev_component)) $header_shift = -15;   //shift for first component if header exists
                    //if ($has_header) $header_shift = -15;

                    $style["margin-top"]= $component["page_component"]["y0"] + $header_shift; $style["margin-top"] .='px';
                    //calc top pos
                    if (isset($prev_component)) {
                        $style["margin-top"]= $component["page_component"]["y0"] - ($prev_component["page_component"]["y0"] + $prev_component["page_component"]["height"])  + $header_shift;
                        $style["margin-top"] .='px';
                    }

                    $prev_component = $component;
                } else if ($component['page_component']['fixed'] =="1") {
                    
                    //fixed pos

                    //$style["left"]= $component["page_component"]["x0"]; $style["left"] .='px';
                    $style["top"]= $component["page_component"]["y0"]; $style["top"] .='px';
                    $style["position"]= 'fixed';

                    if ($has_header) $style["padding-top"]= '56px';//учтем хидер     
                }


                //set width (pixel or percent)
                if ($component['page_component']['fluid_width'] !="1") {
                    $style["width"]= $component["page_component"]["width"]; $style["width"] .='px';
                } else {
                    $dim = (375 / 100);
                    $width = (int)$component["page_component"]["width"] / $dim;
                    $style["width"]= intval($width); $style["width"] .='%';
                }

                //set height (pixel or percent)
                if ($component['page_component']['fluid_height'] !="1") {
                    $style["height"]= $component["page_component"]["height"]; $style["height"] .='px';
                } else {
                    $style["height"]= 'auto';
                }


                //calculate left and right
                if ($component['page_component']['fixed_left'] =="1" && $component['page_component']['fixed_right'] =="1") {
                    $left = $component['page_component']['x'];
                    $right = 375 - $left - $component['page_component']['width'];
                    $style["width"]= "auto";
                    $style["margin-left"]= "{$left}px";
                    $style["margin-right"]= "{$right}px";
                } else if ($component['page_component']['fixed_left'] =="1" && $component['page_component']['fixed_right'] !="1") {
                    $left = $component['page_component']['x'];
                    $style["margin-left"]= "{$left}px";
                    //$style["position"]= "absolute";
                } else if ($component['page_component']['fixed_left'] =="0" && $component['page_component']['fixed_right'] =="1") {
                    $left = $component['page_component']['x'];
                    $width = $component['page_component']['width'];
                    $right = 375 - $left - $component['page_component']['width'];
                    $style["right"]= "{$right}px";
                    $style["position"]= "relative";
                    $style["left"]= "calc(100% - {$right}px - {$width}px)";
                   
                } else if ($component['page_component']['fixed_left'] =="0" && $component['page_component']['fixed_right'] =="0") {
                    $left = $component['page_component']['x'];
                    $width = $component['page_component']['width'];
                    $right = 375 - $left - $component['page_component']['width'];
                    $style["position"]= "relative";
                    $style["left"]= "{$left}px";                    
                    $style["width"]= "{$width}px";                    
                }

                //add styles
                $styles = "";
                foreach($style as $style_param=>$style_value) $styles .= $style_param .": ".$style_value.';';
                //print_r($style);

                
                if (isset($component["page_component"]['data']['package_info']['static']) && $component["page_component"]['data']['package_info']['static']==true) {
                    //wrapper
                    if ($visibility_case!="") $visibility_case = '*ngIf="'.$visibility_case.'"';
                    //$component['ionic_html'] = "<div id='id_{$component["page_component"]["id"]}'  style='".$styles."' {$visibility_case}>".$component['ionic_html'] ."</div>";                
                    if (!$preview) $component['ionic_html'] = $component['ionic_html'];
                    else $component['preview_html'] = $component['preview_html'] ;                
                } else {
                    //wrapper
                    if ($visibility_case!="") $visibility_case = '*ngIf="'.$visibility_case.'"';
                    //$component['ionic_html'] = "<div id='id_{$component["page_component"]["id"]}'  style='".$styles."' {$visibility_case}>".$component['ionic_html'] ."</div>";                
                    if (!$preview) $component['ionic_html'] = "<div id='id_{$component["page_component"]["id"]}'  style='".$styles."' {$visibility_case}>".$component['ionic_html'] ."</div>";
                    else $component['preview_html'] = "<div id='id_{$component["page_component"]["id"]}'  style='".$styles."' {$visibility_case}>".$component['preview_html'] ."</div>";                
                }
            }

            //add preview js code
            

        }
        $return = $components;
        //print_r("----");
        return $return;
    }

}
