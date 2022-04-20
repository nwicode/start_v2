<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\ApplicationContentType;
use App\Models\ConstructorSideMenu;
use Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\SideMenu;
use App\Models\User;
use App\Helpers\Helper;

class MenuController extends Controller {

    /**
     * Side menu
     */
    public function getsidemenu(Request $request) {
        $user = User::where('id', $request->id)->first();
        $user_type = $user->user_type_id;
        if($user_type === 1) {
            $menus = SideMenu::orderBy('is_system', 'DESC')->orderBy('sort', 'ASC')->get();
        } else {
            $menus = SideMenu::where('is_system', 0)->orderBy('sort')->get();
        }
        $this_menu = [
            "items"=>[]
        ];
        $this_submenu = [];
        foreach ($menus as $key => $item) {
            if($item['parent_id'] == NULL){
                if($item['section']) {
                    $menu = [
                        "section"=> $item["section"],
                        "translate"=> $item["translate"],
                    ];
                } else {
                    $menu = [
                        "title"=> $item["title"],
                        "icon"=> $item["icon"],
                        "svg"=> $item["svg"],
                        "page"=> $item["page"],
                        "translate"=> $item["translate"],
                    ];
                }
                if($item['submenu'] == 1) {
                    $this_submenu = [];
                    foreach ($menus as $subitem) {
                        if($subitem['parent_id'] == $item['menu_id']) {
                            $submenu = [
                                "title"=> $subitem["title"],
                                "page"=> $subitem["page"],
                                "translate"=> $subitem["translate"],
                            ];
                            $this_submenu[] = $submenu;
                        }
                    }
                    $menu = [
                        "title"=> $item["title"],
                        "icon"=> $item["icon"],
                        "svg"=> $item["svg"],
                        "page"=> $item["page"],
                        "translate"=> $item["translate"],
                        "submenu" => $this_submenu
                    ];
                }
                $this_menu['items'][]=$menu;
            }
        }
        return $this_menu;
    }


    /**
     * Return items for constructor side menu.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getConstructorSideMenu(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'userId' => 'required'
            )
        );

        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            if (Application::userHasAccess($request['appId'])) {
                $appId = $request->appId;
                $app = Application::find($appId);

                $user = User::where('id', $request->userId)->first();
                $user_type = $user->user_type_id;
                if ($user_type === 1) {
                    $menus = ConstructorSideMenu::orderBy('is_system', 'DESC')->orderBy('sort', 'ASC')->get();
                } else if (Application::userHasAccess($request['appId'])) {
                    $menus = ConstructorSideMenu::orderBy('is_system', 'DESC')->orderBy('sort', 'ASC')->get();
                } else {
                    $menus = ConstructorSideMenu::where('is_system', 0)->orderBy('sort')->get();
                }
                $this_menu = [
                    "items" => []
                ];
                $this_submenu = [];
                foreach ($menus as $key => $item) {
                    if ($item['parent_id'] == NULL) {
                        if ($item['section']) {
                            $menu = [
                                "section" => $item["section"],
                                "translate" => $item["translate"],
                            ];
                        } else {
                            $menu = [
                                "title" => $item["title"],
                                "icon" => $item["icon"],
                                "svg" => $item["svg"],
                                "page" => '/constructor/' . $appId . $item["page"],
                                "translate" => $item["translate"],
                            ];
                        }
                        if ($item['submenu'] == 1) {
                            $this_submenu = [];
                            foreach ($menus as $subitem) {
                                if ($subitem['parent_id'] == $item['menu_id']) {
                                    $submenu = [
                                        "title" => $subitem["title"],
                                        "page" => '/constructor/' . $appId . $subitem["page"],
                                        "translate" => $subitem["translate"],
                                    ];
                                    $this_submenu[] = $submenu;
                                }
                            }
                            $menu = [
                                "title" => $item["title"],
                                "icon" => $item["icon"],
                                "svg" => $item["svg"],
                                "page" => '/constructor/' . $appId . $item["page"],
                                "translate" => $item["translate"],
                                "submenu" => $this_submenu
                            ];
                        }
                        $this_menu['items'][] = $menu;
                    }
                }


                $contentTypes = ApplicationContentType::where('app_id', $request['appId'])->get();

                for ($i = 0; $i < count($this_menu['items']); $i++) {
                    if (array_key_exists('section', $this_menu['items'][$i]) && $this_menu['items'][$i]['section'] === 'CONSTRUCTOR.MENU.COTENT_SECTION') {
                        $contentPlace = $i;
                        break;
                    }
                }

                if (count($contentTypes) > 0) {
                    foreach ($contentTypes as $item) {
                        $content[] = [
                            'menu_id' => '',
                            'title' => $item['name'],
                            'svg' => './assets/media/svg/icons/Communication/Write.svg',
                            'icon' => 'flaticon2-sort-alphabetically',
                            'page' => '/constructor/' . $request['appId'] . '/content/content-list/' . $item['id'],
                            'translate' => $item['name'],
                            'is_system' => 1,
                            'submenu' => 0,
                            'sort' => 130,
                        ];
                    }
                    array_splice($this_menu['items'], $contentPlace + 1, 0, $content);
                }

                $response = response()->json($this_menu);
            } else {
                $response = response()->json(['error' => 'NO_PERMISSION'], 403);
            }
        }

        return $response;
    }

}
