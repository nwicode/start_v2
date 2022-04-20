<?php


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});*/

use App\Models\Country;

Route::group([

    'middleware' => 'mobile',
    //'prefix' => 'auth'

], function () {


    Route::post('settings', 'Mobile\MobileController@settings');
    Route::post('getList', 'Mobile\MobileController@getList');
    Route::post('loadList', 'Mobile\MobileController@loadList');

    Route::post('login', 'Mobile\AuthMobileController@login');
    Route::post('logout', 'Mobile\AuthMobileController@logout');
    Route::post('register', 'Mobile\AuthMobileController@register');
    Route::post('reset_password', 'Mobile\AuthMobileController@reset_password');
    Route::post('isUserLogin', 'Mobile\AuthMobileController@isUserLogin');

    Route::post('currentUser', 'Mobile\UserMobileController@currentUser');
    Route::post('getUserLogin', 'Mobile\UserMobileController@getUserLogin');
    Route::post('getUserName', 'Mobile\UserMobileController@getUserName');
    Route::post('setTopic', 'Mobile\UserMobileController@setTopic');
    Route::post('getTopics', 'Mobile\UserMobileController@getTopics');
    Route::post('getTopic', 'Mobile\UserMobileController@getTopic');
    Route::post('saveCollectionRecord', 'Mobile\UserMobileController@saveCollectionRecord');
    Route::post('getRssFeed', 'Mobile\UserMobileController@getRssFeed');
});
