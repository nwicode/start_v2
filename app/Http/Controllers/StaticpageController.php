<?php


namespace App\Http\Controllers;

use Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Languages;
use App\Models\StaticPages;



class StaticpageController extends Controller {

    /**
     * Return static page content from static_page gy lang_id and code
     */
    public function getStaticPage(Request $request) {

        $validator = Validator::make(
            $request->all(),
            array(
                'lang' => 'required',
                'code' => 'required',
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = $error_message;
        } else {
            $langs = new Languages;
            $static_pages = new StaticPages;
            $get_lang_id = $langs::where('code', $request->lang)->first();
            $get_static_page = $static_pages::where('lang_id', $get_lang_id->id)->where('code', $request->code)->first();
            $response = response()->json($get_static_page, 200);
        }
        return $response;
    }

    /**
     * Return static content in all langs from static_pages by code
     */

    public function getStaticPagesByCode(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'code' => 'required',
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {

            $languages = new Languages;
            $language_default = Languages::where('is_default', 1)->first();
            $languages_all = Languages::all();

            $query = DB::table('static_pages')
                ->join('languages', 'lang_id', '=', 'languages.id')
                ->where('static_pages.code', $request->code)
                ->select('languages.code', 'content', 'header', 'static_pages.code as pageCode')
                ->get();

            $macros = [];
            if ($query && $request->code === 'template_app_privacy') {
                $macros = ['[USER_NAME]', '[COMPANY]', '[EMAIL]', '[PHONE]', '[APP_NAME]'];
            }


            $result = [];
            $founded_lang = [];
            foreach($query as $q) {
                $founded_lang[$q->code]=$q;
            }

            //add missed langs with def values
            foreach($languages_all as $lang) {
                
                if (!isset($founded_lang[$lang->code])) {
                    $founded_lang[$lang->code] = $founded_lang[$language_default->code];
                    //$founded_lang[$lang->code]->code = "dd";
                }
            }

            //very strange, but it work
            foreach($founded_lang as $lang_code=>$lang_value) {
                $item = clone $lang_value;
                $item->code=$lang_code;
                $result[] = $item;
            }

            $response = response()->json(['pages' => $result, 'macros' => $macros]);
        }
        return $response;
    }

    /**
     * Return static contents in all langs from static_pages by code array
     */
    public function getStaticPagesByCodes(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'codes' => 'required',
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {

            $languages = new Languages;
            $language_default = Languages::where('is_default', 1)->first();
            $languages_all = Languages::all();


            $result = array();
            $query = DB::table('static_pages')
                ->join('languages', 'lang_id', '=', 'languages.id')
                ->whereIn('static_pages.code', $request->codes)
                ->select('languages.code', 'languages.id', 'content', 'header', 'static_pages.code as pageCode')
                ->get();

            $default_data = array();
            foreach ($query as $query_item) {
                if($query_item->code==$language_default->code)  {
                    $default_data[$query_item->pageCode] = $query_item;
                }
            }
            
            foreach ($query as $query_item) {
                if ($query_item->content=="") $query_item->content=$default_data[$query_item->pageCode]->content;
                $result[$query_item->code][]= $query_item;
            }


            //if has missed languages - add missed lanugages with EN lang
            foreach($languages_all as $lang) {
                if (!isset($result[$lang->code])) {
                    $result[$lang->code] = $result[$language_default->code];
                    foreach ($result[$lang->code] as &$l) $l->code = $lang->code;
                }
                //print_r($lang);
            }

            $response = response()->json(array_values($result));
        }
        return $response;
    }

    /**
     * Get all static pages header
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getStaticPagesHeaders(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'lang' => 'required',
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {

            $languages = new Languages;
            $language_default = Languages::where('is_default', 1)->first();
            $languages_all = Languages::all();


            $query = DB::table('static_pages')
                ->join('languages', 'lang_id', '=', 'languages.id')
                ->select('static_pages.code', 'header', 'languages.code AS lang_code')
                ->get();

            //print_r($query);exit;
            $result = [];
            $founded_lang = [];
            foreach($query as $q) {
                $founded_lang[$q->lang_code][$q->code]=$q->header;
            }

            //add missed langs with def values
            foreach($languages_all as $lang) {
                if (!isset($founded_lang[$lang->code])) $founded_lang[$lang->code] = $founded_lang[$language_default->code];
            }


            foreach($founded_lang as $lang_code=>$lang_value) {
                foreach($lang_value as $code=>$header) {
                    $result[] = [
                        "lang_code"=>$lang_code,
                        "code"=>$code,
                        "header"=>$header,
                    ];
                }
            }

            $response = response()->json($query);
        }
        return $response;
    }

    /**
     * Update static pages.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateStaticPages(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'staticPages' => 'required'
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $user = auth()->user();
            if ($user['user_type_id'] === 1) {
                $pageArray = $request->staticPages;
                for ($i = 0; $i < count($pageArray); $i++) {
                    $lang = DB::table('languages')
                        ->select('id')
                        ->where('code', '=', $pageArray[$i]['code'])->get();
                    DB::table('static_pages')
                        ->where('lang_id', '=', $lang[0]->id)
                        ->where('code', '=', $pageArray[$i]['pageCode'])->update(['content' => $pageArray[$i]['content']]);
                }

                $response = response()->json(['message' => 'DATA_UPDATED']);
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }
        return $response;
    }

    /**
     * Get static page related with mail templates
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMailStaticPage(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'code' => 'required',
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {

            $languages = new Languages;
            $language_default = Languages::where('is_default', 1)->first();
            $languages_all = Languages::all();

            $macros = ['[COMPANY]', '[USER]'];

            $query = DB::table('static_pages')
                ->join('languages', 'lang_id', '=', 'languages.id')
                ->where('static_pages.code', $request->code)
                ->select('languages.code', 'content', 'header', 'static_pages.code as pageCode')
                ->get();

                $result = [];
                $founded_lang = [];
                foreach($query as $q) {
                    $founded_lang[$q->code]=$q;
                }
    
                //add missed langs with def values
                foreach($languages_all as $lang) {
                    
                    if (!isset($founded_lang[$lang->code])) {
                        $founded_lang[$lang->code] = $founded_lang[$language_default->code];
                        //$founded_lang[$lang->code]->code = "dd";
                    }
                }
    
                //very strange, but it work
                foreach($founded_lang as $lang_code=>$lang_value) {
                    $item = clone $lang_value;
                    $item->code=$lang_code;
                    $result[] = $item;
                }

            $response = response()->json(['pages' => $result, 'macros' => $macros]);
        }
        return $response;
    }


    /**
     * Update content for TITLE and DESCRIPTIONB
     */
    public function updateMetaPages(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'metas' => 'required',
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $user = auth()->user();
            if ($user['user_type_id'] === 1) {

                foreach($request->metas as $meta) {

                    $lang = DB::table('languages')->select('id')->where('code', '=', $meta['code'])->get();
                    $query = DB::table('static_pages')->where('lang_id', '=', $lang[0]->id)->where('code', '=', 'META_TITLE')->update(['content' => $meta['META_TITLE']]);
                    $query = DB::table('static_pages')->where('lang_id', '=', $lang[0]->id)->where('code', '=', 'META_DESCRIPTION')->update(['content' => $meta['META_DESCRIPTION']]);
                }

                $response = response()->json(['message' => 'DATA_UPDATED']);

            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }
        return $response;
    }

}
