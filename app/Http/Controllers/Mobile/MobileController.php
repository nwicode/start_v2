<?php

namespace App\Http\Controllers\Mobile;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ActivityLog;
use App\Models\ApplicationStartAnimation;
use Illuminate\Support\Facades\DB;
use Validator;
use App\Models\Application;
use App\Models\Colors;
use App\Models\Application_Languages;
use App\Models\Application_Page;
use App\Models\ApplicationMenu;
use App\Models\BuildQueryWWW;
use App\Models\Components;
use App\Models\Application_IAP;
use App\Models\ApplicationContentType;
use App\Models\ApplicationContent;
use App\Models\ApplicationPageComponent;
use App\Models\Application_IAP_Description;
use App\Models\InAppPurchase;

class MobileController extends Controller
{
    //
    /**
     * return applaiction settings.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|string
     */
    function settings(Request $request) {
		
		$validator = Validator::make(
            $request->all(),
            array(
                'sb' => 'required',
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            //$response = $error_message;
            $response = response()->json(['error' =>$error_message,403]);
        } else {
			
			$app = Application::where("sb",$request->sb)->first();
			if (!$app) {
				$response = response()->json(['error' => 'APPLICATION_NOT_FOUND'],403);
			} else {
			
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
				

				
				$response = response()->json(['settings' => $settings]);
			}

        }
        return $response;
    }     
	
	
	
   //
    /**
     * return applaiction settings.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|string
     */
    function loadList(Request $request) {
		
		$validator = Validator::make(
            $request->all(),
            array(
                //'sb' => 'required',
				'list_id' => 'required',
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            //$response = $error_message;
            $response = response()->json(['error' =>$error_message,403]);
        } else {
			
			$app = Application::where("sb",$request->sb)->first();
			if (!$app) {
				$response = response()->json(['error' => 'APPLICATION_NOT_FOUND'],403);
			} else {
				$applicationContent = new ApplicationContent();
				$applicationContent->setApplication($app);
				
				$sort_direction = "ASC";
				if ($request['sort_direction']) $sort_direction = $request['sort_direction'];				

				$filter = "";
				if ($request['filter']) $filter = $request['filter'];

				$limit = 0;
				if ($request['limit'] && $request['limit']>0) $limit = $request['limit'];	
				
				$offset = 0;
				if ($request['offset'] && $request['offset']>0) $lioffsetmit = $request['offset'];

				$language = "";
				if (isset($request['language']) && $request['language']) $language = $request['language'];

				$sort_field = "id";
				if ($request['sort_field']) $sort_field = $request['sort_field'];

				$list = $applicationContent->getContent($request['list_id'],$language, $filter,$sort_field, $sort_direction, $limit, $offset);


				/*
				$contentType = ApplicationContentType::find($request['list_id']);
				$list = [];
				if ($contentType->app_id === $app->id) {
					$fields = ApplicationContentType::getContentTypeFields($request['list_id']);

					$queryFields = [];
					if (count($fields) === 1) {
						$queryFields[0] = $fields[0]->db_field;
					} else {
						for ($i = 0; $i < count($fields); $i++) {
							$queryFields[$i] = $fields[$i]->db_field;
						}
					}
					$queryFields[count($queryFields)] = 'id';

					$fieldsValue = DB::table('application_contents')
						->where('app_id', $app->id)
						->where('content_type_id', $request['list_id']);
					if ($request['filter']) {
						$fieldsValue->where('column_title', 'like', '%' . $request['filter'] . '%');
					}
					
					$sort_direction = "ASC";
					if ($request['sort_direction']) $sort_direction = $request['sort_direction'];
					
					$sort_field = "id";
					if ($request['sort_field'] && $request['sort_field']!="-") $sort_field = $request['sort_field'];
					
					$fieldsValue->orderBy($sort_field, strtolower($sort_direction));
					
				

					if ($request['limit'] && $request['limit']>0) {
						$fieldsValue = $fieldsValue->limit($request['limit']);
					}
					if ($request['offset']) {
						$fieldsValue = $fieldsValue->offset($request['offset']);
					}
					$fieldsValue = $fieldsValue->select($queryFields)
						->get();


					foreach($fieldsValue as $fieldValue) {
						$item = [];
						foreach($fields as $field) {
							$item[$field->db_field] = $fieldValue->{$field->db_field};
							
							//add path to image
							if (substr($field->db_field,0,12)=='column_image') {
								if (substr($item[$field->db_field],0,4)!=='http') $item[$field->db_field] = "./assets/resources/".$item[$field->db_field];
							}
							
							//if ($field->multilang) {
								$strings = @json_decode($item[$field->db_field],true);
								//try to get language
								if (isset($request['language']) && $request['language'] && isset($strings[$request['language']])) $item[$field->db_field] = $strings[$request['language']];
								else if (is_array($strings)) $item[$field->db_field] = reset($strings);
							//}

						}
						$list[]=$item;
					}

					//$list = ['fields' => $fields, 'fields_value' => $fieldsValue, "list"=>$list];
					
				}
				*/

				
				$response = response()->json($list);
			}

        }
        return $response;
    }     	
	
}
