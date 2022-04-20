<?php

/**
 * News and Event system
 */

namespace App\Http\Controllers;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Validator;
use Illuminate\Http\Request;
use App\Models\Application;
use App\Models\News;
use Carbon\Carbon;

class NewsController extends Controller
{
    //return news list
    function getNews(Request $request) {

        $news = News::orderBy('item_date','desc')->get();
        $response = response()->json($news);
        return $response;
    }
    //return news list
    function getNewsList(Request $request) {

        $news = News::where("is_active",true)->orderBy('item_date','desc')->get();
        $response = response()->json($news);
        return $response;
    }

    //update or create news item
    function updateNewsItem(Request $request) {

        $validator = Validator::make(
            $request->all(),
            array(
                'id' => 'required',
                'form' => 'required',

            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {

            if ($request['id']!="0") {
                $news_item = News::where("id",$request['id'])->first();
                $news_item->title = $request['form']['title'];
                $news_item->description = $request['form']['description'];
                $news_item->item_url = $request['form']['item_url'];
                $news_item->is_active = $request['form']['is_active'];
                $news_item->item_date = $request['form']['item_date'];
                $news_item->save();
                
                $response = response()->json($news_item);
            } else {
                $news_item = new News();
                $news_item->type = "news";
                $news_item->title = $request['form']['title'];
                $news_item->description = $request['form']['description'];
                $news_item->item_url = $request['form']['item_url'];
                $news_item->is_active = $request['form']['is_active'];
                $news_item->item_date = $request['form']['item_date'];
                $news_item->save();
                $response = response()->json($news_item);
            }
        }
        $response = response()->json($news_item);
        return $response;
    }


    //remove item
    function removeNewsItem(Request $request) {

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

            if ($request['id']!="0") {
                News::where("id",$request['id'])->delete();
                $response = response()->json(['message' => 'ITEM_DELETED']);
            } else {
                $response = response()->json(['error' => 'NOT_FOUND'], 403);
            }
        }
        return $response;
    }


    //return news list item
    function getNewsItem(Request $request) {

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

            if ($request['id']!="0") {
                $news_item = News::where("id",$request['id'])->first();
                $response = response()->json($news_item);
            } else {
                $news_item = new News();
                $news_item->type = "news";
                $news_item->title = "";
                $news_item->description = "";
                $news_item->item_url = "";
                $news_item->is_active = false;
                $news_item->item_date = Carbon::now()->toDateString();
                //$news_item->save();
                $response = response()->json($news_item);
            }
        }
        $response = response()->json($news_item);
        return $response;
    }
    
    
    /**
     * get news list
     * @param Request $request
     * @return JsonResponse
     */
    function editItem(Request $request) {
        $dashboard = [];

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

                

                $response = response()->json($dashboard);
            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }

        return $response;
    }
}
