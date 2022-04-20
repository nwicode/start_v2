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


use App\Http\Controllers\ApplicationUsersController;
use App\Http\Controllers\CommerceControllers\WooCommerceControllers\OrdersController;
use App\Http\Controllers\CommerceControllers\WooCommerceControllers\ProductCategoriesController;
use App\Http\Controllers\CommerceControllers\WooCommerceControllers\ProductsController;
use App\Http\Controllers\GoogleAnalyticsController;
use App\Http\Controllers\LicensesController;
use App\Http\Controllers\PaymentsController;
use App\Http\Controllers\ReferralProgramsController;
use App\Http\Controllers\SubscriptionsController;
use App\Http\Controllers\UserReferralsController;
use App\Http\Controllers\WithdrawalRequestsController;
use App\Models\Country;
use App\Http\Controllers\GalleryImagesController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\PreviewController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RutterControllers\RutterOrdersController;
use App\Http\Controllers\RutterControllers\RutterProductsController;
use App\Http\Controllers\RutterControllers\RutterPurchaseOrdersController;

Route::group([

    'middleware' => 'api',
    //'prefix' => 'auth'

], function () { 

    Route::post('getAdminDashboard', 'DashboardController@getAdminDashboard');

    Route::post('dashboard', 'ConstructorDashBoard@dashboard');
    Route::post('appPages', 'ApplicationPages@appPages');
    Route::post('updatePagePos', 'ApplicationPages@updatePagePos');
    Route::post('deletePage', 'ApplicationPages@deletePage');
    Route::post('getlayoutItems', 'ApplicationPages@getlayoutItems');
    Route::post('addPage', 'ApplicationPages@addPage');
    Route::post('removePage', 'ApplicationPages@removePage');
    Route::post('getPageData', 'ApplicationPages@getPageData');
    Route::post('setPageData', 'ApplicationPages@setPageData');
    Route::post('getPageCustomCode', 'ApplicationPages@getPageCustomCode');
    Route::post('setPageCustomCode', 'ApplicationPages@setPageCustomCode');
    Route::post('setPageComponent', 'ApplicationPages@setPageComponent');
    Route::post('getPageComponents', 'ApplicationPages@getPageComponents');
    Route::post('updatePageComponentData', 'ApplicationPages@updatePageComponentData');
    Route::post('deleteComponentFromPage', 'ApplicationPages@deleteComponentFromPage');
    Route::post('updateComponentsPosition', 'ApplicationPages@updateComponentsPosition');
    Route::post('getPageLines', 'ApplicationPages@getPageLines');


    Route::post('buildAndroid', 'BuildController@buildAndroidRequest');
    Route::post('buildAndroidSrc', 'BuildController@buildAndroidSrcRequest');
    Route::post('buildIOSSrc', 'BuildController@buildIOSSrcRequest');
    Route::post('buildWWW', 'BuildController@buildWWWRequest');
    Route::post('getQueue', 'BuildController@getQueue');
    Route::post('getBuildQueueList', 'BuildController@getBuildQueueList');
    Route::post('deleteBuildQueue', 'BuildController@deleteBuildQueue');

    Route::post('getNews', 'NewsController@getNews');
    Route::post('getNewsItem', 'NewsController@getNewsItem');
    Route::post('updateNewsItem', 'NewsController@updateNewsItem');
    Route::post('removeNewsItem', 'NewsController@removeNewsItem');
    Route::post('getNewsList', 'NewsController@getNewsList');


    Route::post('login', 'AuthController@login');
    Route::post('logout', 'AuthController@logout');
    Route::post('refresh', 'AuthController@refresh');
    Route::post('reset', 'AuthController@reset_password');
    Route::post('me', 'AuthController@me');
    Route::post('mailconfirm', 'AuthController@mailconfirm');
    Route::post('resendcode', 'AuthController@resendcode');
    Route::post('googleLogin', 'AuthController@googleLogin');

    Route::post('current', 'UsersController@current');
    Route::post('savePersonalInformation', 'UsersController@savePersonalInformation');
    Route::post('saveAccountInformation', 'UsersController@saveAccountInformation');
    Route::post('blockAccount', 'UsersController@blockAccount');
    Route::post('changePassword', 'UsersController@changePassword');
    Route::post('editUserPassword', 'UsersController@editUserPassword');
    Route::post('editUserPersonalInformation', 'UsersController@editUserPersonalInformation');
    Route::post('editUserAccountInformation', 'UsersController@editUserAccountInformation');
    Route::post('checkEmail', 'UsersController@checkEmail'); 
    Route::post('getCountries', function () {
        return Country::all();
    });

    Route::post('getStaticPagesByCode', 'StaticpageController@getStaticPagesByCode');
    Route::post('getStaticPagesByCodes', 'StaticpageController@getStaticPagesByCodes');
    Route::post('getStaticPagesHeaders', 'StaticpageController@getStaticPagesHeaders');
    Route::post('updateStaticPages', 'StaticpageController@updateStaticPages');
    Route::post('updateMetaPages', 'StaticpageController@updateMetaPages');
    Route::post('getMailStaticPage', 'StaticpageController@getMailStaticPage');

    Route::get('buildtranslations', 'LanguagesController@buildtranslations');
    Route::post('set_default_language', 'LanguagesController@setDefaultLanguage');
    Route::post('add_language', 'LanguagesController@AddNewLanguage');
    Route::post('delete_language', 'LanguagesController@DeleteLanguage');
    Route::post('get_translations', 'LanguagesController@getTranslations');
    Route::post('update_translations', 'LanguagesController@updateTranslations');
    Route::post('download_language_pack', 'LanguagesController@downloadLanguagePack');

    Route::get('getstaticpage', 'StaticpageController@getStaticPage');

    Route::get('setactivitylog', 'SystemController@setActivityLog');

    Route::get('getactivitylog', 'SystemController@getActivityLog');

    Route::get('make_auth_settings', 'SystemController@makeAuthSettings');
    Route::post('make_system_settings', 'SystemController@makeSystemSettings');
    Route::post('saveSystemGeneral', 'SystemController@saveSystemGeneral');
    Route::post('saveBrandImage', 'SystemController@saveBrandImage');
    Route::post('saveSystemSmtp', 'SystemController@saveSystemSmtp');
    Route::post('saveTrialDay', 'SystemController@saveTrialDay');
    Route::post('getSmtpSettings', 'SystemController@getSmtpSettings');
    Route::post('saveUsersRegistrationPossibility', 'SystemController@saveUsersRegistrationPossibility');

    Route::post('getsidemenu', 'MenuController@getsidemenu');
    Route::post('getConstructorSideMenu', 'MenuController@getConstructorSideMenu');

    Route::post('short_notification', 'NotificationsController@shortNotification');

    Route::get('short_notification', 'NotificationsController@shortNotification');

    Route::post('saveavatar', 'UsersController@saveavatar');

    Route::post('removeavatar', 'UsersController@removeavatar');

    Route::post('application', 'ApplicationController@application');
    Route::post('getCurrentUserApplications', 'ApplicationController@getCurrentUserApplications');
    Route::post('changeDisabledApplication', 'ApplicationController@changeDisabledApplication');
    Route::post('changeBlockedApplication', 'ApplicationController@changeBlockedApplication');
    Route::post('deleteApplication', 'ApplicationController@deleteApplication');
    Route::post('getApplicationColors', 'ApplicationController@getApplicationColors');
    Route::post('setApplicationColors', 'ApplicationController@setApplicationColors');
    Route::post('setApplicationIAP', 'ApplicationController@setApplicationIAP');
    Route::post('removeApplicationIAP', 'ApplicationController@removeApplicationIAP');
    Route::post('setApplicationLanguages', 'ApplicationController@setApplicationLanguages');
    Route::post('getApplicationLanguages', 'ApplicationController@getApplicationLanguages');
    Route::post('getApplicationInAppProducts', 'ApplicationController@getApplicationInAppProducts');
    Route::post('updateApplicationIcon', 'ApplicationController@updateApplicationIcon');
    Route::post('updateApplicationSplashScreen', 'ApplicationController@updateApplicationSplashScreen');
    Route::post('getApplicationById', 'ApplicationController@getApplicationById');
    Route::post('getApplications', 'ApplicationController@getApplications');
    Route::post('getApplicationSettings', 'ApplicationController@getApplicationSettings');
    Route::post('setApplicationSettings', 'ApplicationController@setApplicationSettings');
    Route::post('getAdMobSettings', 'ApplicationController@getAdMobSettings');
    Route::post('setAdMobSettings', 'ApplicationController@setAdMobSettings');
    Route::post('setApplicationCss', 'ApplicationController@setApplicationCss');
    Route::post('getApplicationCss', 'ApplicationController@getApplicationCss');
    Route::post('setOneSignalSettings', 'ApplicationController@setOneSignalSettings');
    Route::post('getOneSignalSettings', 'ApplicationController@getOneSignalSettings');
    Route::post('setFirebaseSettings', 'ApplicationController@setFirebaseSettings');
    Route::post('getFirebaseSettings', 'ApplicationController@getFirebaseSettings');
    Route::post('getCustomStartAnimationSettings', 'ApplicationController@getCustomStartAnimationSettings');
    Route::post('setCustomStartAnimationSettings', 'ApplicationController@setCustomStartAnimationSettings');
    Route::post('setMixPanelSettings', 'ApplicationController@setMixPanelSettings');
    Route::post('getMixPanelSettings', 'ApplicationController@getMixPanelSettings');
    Route::post('setApplicationPrivacy', 'ApplicationController@setApplicationPrivacy');
    Route::post('getDefaultApplicationPrivacy', 'ApplicationController@getDefaultApplicationPrivacy');
    Route::post('getPublicApplicationPrivacy', 'ApplicationController@getPublicApplicationPrivacy')->withoutMiddleware(['auth:api']);
    Route::post('saveApplicationPushMessage', 'ApplicationController@saveApplicationPushMessage');
    Route::post('getApplicationPushMessageList', 'ApplicationController@getApplicationPushMessageList');
    Route::post('getApplicationTranlsation', 'ApplicationController@getApplicationTranlsation');
    Route::post('setApplicationTranlsation', 'ApplicationController@setApplicationTranlsation');
    Route::post('getApplicationColorsInLayouts', 'ApplicationController@getApplicationColorsInLayouts');
    Route::post('setApplicationColorsInLayouts', 'ApplicationController@setApplicationColorsInLayouts');
    Route::post('getApplicationMenu', 'ApplicationController@getApplicationMenu');
    Route::post('setApplicationMenu', 'ApplicationController@setApplicationMenu');
    Route::post('getApplicationContentList', 'ApplicationController@getApplicationContentList');
    Route::post('createContentType', 'ApplicationController@createContentType');
    Route::post('getApplicationContent', 'ApplicationController@getApplicationContent');
    Route::post('setApplicationContent', 'ApplicationController@setApplicationContent');
    Route::post('setGoogleAnalyticsSettings', 'ApplicationController@setGoogleAnalyticsSettings');
    Route::post('getGoogleAnalyticsSettings', 'ApplicationController@getGoogleAnalyticsSettings');
    Route::post('deleteApplicationContent', 'ApplicationController@deleteApplicationContent');
    Route::post('getApplicationContentTypesList', 'ApplicationController@getApplicationContentTypesList');
    Route::post('deleteApplicationContentType', 'ApplicationController@deleteApplicationContentType');
    Route::post('editApplicationContentType', 'ApplicationController@editApplicationContentType');
    Route::post('getApplicationContentType', 'ApplicationController@getApplicationContentType');
    Route::post('getApplicationContentByKey', 'ApplicationController@getApplicationContentByKey')->withoutMiddleware(['auth:api'])->middleware([\App\Http\Middleware\VerifyAppToken::class]);
    Route::post('setApplicationContentByKey', 'ApplicationController@setApplicationContentByKey')->withoutMiddleware(['auth:api'])->middleware([\App\Http\Middleware\VerifyAppToken::class]);
    Route::post('setApplicationFont', 'ApplicationController@setApplicationFont');
    Route::post('setApplicationCustomFont', 'ApplicationController@setApplicationCustomFont');
    Route::post('getApplicationFonts', 'ApplicationController@getApplicationFonts');
    Route::post('copyApplication', 'ApplicationController@copyApplication');
    Route::post('getApplicationTemplateList', 'ApplicationController@getApplicationTemplateList');
    Route::post('rebuildSources', 'ApplicationController@rebuildSources');
    Route::post('getTopics', 'ApplicationController@getTopics');
    Route::post('setTopic', 'ApplicationController@setTopic');
    Route::post('deleteTopic', 'ApplicationController@deleteTopic');


    Route::get('/gallery_images/from_file', [GalleryImagesController::class, 'getImagesFromDirectory']);
    Route::get('/gallery_images/adobe_libraries', [GalleryImagesController::class, 'getAdobeLibraries']);
    Route::get('/gallery_images/adobe_library_elements', [GalleryImagesController::class, 'getAdobeLibraryElements']);
    Route::get('/gallery_images/image_base64', [GalleryImagesController::class, 'getAdobeElementImageInBase64']);
    Route::post('/gallery_images/upload_file', [GalleryImagesController::class, 'uploadFileData']);
    Route::get('/adobe_cc/get_access_token', [GalleryImagesController::class, 'getAdobeAccessToken']);

    Route::post('getcurrencies', 'SystemController@getcurrencies');
    Route::post('getdefaultcurrency', 'SystemController@getdefaultcurrency');
    Route::post('setdefaultcurrency', 'SystemController@setdefaultcurrency');

    Route::post('createTarif', 'TarifController@createTarif');
    Route::post('updateTarif', 'TarifController@updateTarif');
    Route::post('getTarif', 'TarifController@getTarif');
    Route::post('getTarifs', 'TarifController@getTarifs');
    Route::post('deleteTarif', 'TarifController@deleteTarif');

    Route::post('getCollectionList', 'CollectionController@getCollectionList');
    Route::post('createCollection', 'CollectionController@createCollection');
    Route::post('editCollection', 'CollectionController@editCollection');
    Route::post('getCollection', 'CollectionController@getCollection');
    Route::post('getCollectionRecordsList', 'CollectionController@getCollectionRecordsList');
    Route::post('createCollectionRecord', 'CollectionController@createCollectionRecord');
    Route::post('editCollectionRecord', 'CollectionController@editCollectionRecord');
    Route::post('getCollectionRecord', 'CollectionController@getCollectionRecord');
    Route::post('deleteCollectionRecord', 'CollectionController@deleteCollectionRecord');

    Route::post('getAdminActivityLogList', 'ActivityLogController@getAdminActivityLogList');

    Route::get('/licenses/getLicense', [LicensesController::class, 'getLicense']);
    Route::post('/licenses/check', [LicensesController::class, 'checkConnection']);
    Route::post('/licenses/activate', [LicensesController::class, 'activateLicense']);
    Route::post('/licenses/verify', [LicensesController::class, 'verifyLicense']);
    Route::post('/licenses/deactivate', [LicensesController::class, 'deactivateLicense']);
    Route::post('/licenses/checkupdates', [LicensesController::class, 'checkUpdates']);
    Route::post('/licenses/runUpdate', [LicensesController::class, 'runUpdate']);

    /**
     * Preview work
     */
    Route::post('checkSDK', 'SdkController@checkSDK');
    Route::post('getGradle', 'SdkController@getGradle');
    Route::post('installGradle', 'SdkController@installGradle');
    Route::post('installAndroidTools', 'SdkController@installAndroidTools');
    Route::post('installIonic', 'SdkController@installIonic');

    /**
     * SDK routes
     */
    Route::post('get_preview', [PreviewController::class, 'get_preview']);


    Route::get('/application_users/{id}', [ApplicationUsersController::class, 'getAppUsers']);
    Route::get('/application_users/{app_id}/{id}', [ApplicationUsersController::class, 'getAppUser']);
    Route::get('/application_users_paginated', [ApplicationUsersController::class, 'getAppUsersPaginated']);
    Route::post('/application_users', [ApplicationUsersController::class, 'AddAppUser']);
    Route::put('/application_users/{id}', [ApplicationUsersController::class, 'UpdateAppUser']);
    Route::delete('/application_users/{app_id}/{id}', [ApplicationUsersController::class, 'DeleteAppUser']);

    Route::get('/subscriptions/{id}', [SubscriptionsController::class, 'getSubscription']);
    Route::get('/subscriptions', [SubscriptionsController::class, 'getSubscriptions']);
    Route::get('/subscriptions_paginated', [SubscriptionsController::class, 'getSubscriptionsPaginated']);
    Route::delete('/subscriptions/{id}', [SubscriptionsController::class, 'cancelSubscription']);

    Route::get('/google_analytics_test', [GoogleAnalyticsController::class, 'test']);
    Route::get('/google_analytics_auth_url', [GoogleAnalyticsController::class, 'getAuthUrl']);
    Route::get('/google_analytics_access_token', [GoogleAnalyticsController::class, 'getAccessToken']);
    Route::get('/google_analytics_refreshed_access_token', [GoogleAnalyticsController::class, 'getRefreshedToken']);
    Route::post('/google_analytics_reports', [GoogleAnalyticsController::class, 'getReports']);


    //    Rutter Orders
    Route::get('rutter/order', [RutterOrdersController::class, 'getOrder']);
    Route::get('rutter/orders', [RutterOrdersController::class, 'getOrders']);
    Route::post('rutter/order', [RutterOrdersController::class, 'addOrder']);
    //    Rutter Products
    Route::get('rutter/product', [RutterProductsController::class, 'getProduct']);
    Route::get('rutter/product_categories', [RutterProductsController::class, 'getProductCategories']);
    Route::get('rutter/products', [RutterProductsController::class, 'getProducts']);
    Route::post('rutter/product', [RutterProductsController::class, 'addProduct']);
    Route::patch('rutter/product', [RutterProductsController::class, 'updateProduct']);
    Route::delete('rutter/product', [RutterProductsController::class, 'deleteProduct']);
    //  Purchase Orders
    Route::get('rutter/purchase_orders', [RutterPurchaseOrdersController::class, 'getPurchaseOrders']);

    // WooCommerce Orders
    Route::get('woo_commerce/order', [OrdersController::class, 'getOrder']);
    Route::get('woo_commerce/orders', [OrdersController::class, 'getOrders']);
    Route::post('woo_commerce/order', [OrdersController::class, 'addOrder']);
    Route::patch('woo_commerce/order', [OrdersController::class, 'updateOrder']);
    Route::delete('woo_commerce/order', [OrdersController::class, 'deleteOrder']);

    // WooCommerce Products
    Route::get('woo_commerce/product', [ProductsController::class, 'getProduct']);
    Route::get('woo_commerce/products', [ProductsController::class, 'getProducts']);
    Route::post('woo_commerce/product', [ProductsController::class, 'addProduct']);
    Route::patch('woo_commerce/product', [ProductsController::class, 'updateProduct']);
    Route::delete('woo_commerce/product', [ProductsController::class, 'deleteProduct']);

    // WooCommerce Product-Categories
    Route::get('woo_commerce/product/category', [ProductCategoriesController::class, 'getProductCategory']);
    Route::get('woo_commerce/product/categories', [ProductCategoriesController::class, 'getProductCategories']);
    Route::post('woo_commerce/product/category', [ProductCategoriesController::class, 'addProductCategory']);
    Route::patch('woo_commerce/product/category', [ProductCategoriesController::class, 'updateProductCategory']);
    Route::delete('woo_commerce/product/category', [ProductCategoriesController::class, 'deleteProductCategory']);

    // Referral Programs Requests
    Route::get('referral_program/{id}', [ReferralProgramsController::class, 'getReferralProgram']);
    Route::get('referral_program', [ReferralProgramsController::class, 'getReferralPrograms']);
    Route::get('referral_programs', [ReferralProgramsController::class, 'getReferralPrograms']);
    Route::get('referral_programs_paginated', [ReferralProgramsController::class, 'getReferralProgramsPaginated']);
    Route::post('referral_program', [ReferralProgramsController::class, 'createReferralProgram']);
    Route::patch('referral_program', [ReferralProgramsController::class, 'updateReferralProgram']);
    Route::delete('referral_program/{id}', [ReferralProgramsController::class, 'deleteReferralProgram']);

    // Referrals Requests
    Route::get('user_referral', [UserReferralsController::class, 'getUserReferrals']);
    Route::get('user_referrals', [UserReferralsController::class, 'getUserReferrals']);
    Route::get('user_referrals_paginated', [UserReferralsController::class, 'getUserReferralsPaginated']);
    Route::get('get_user_referral', [UserReferralsController::class, 'getUserReferralLink']);
    Route::post('get_user_referral', [UserReferralsController::class, 'getUserReferralLink']);

    // User Withdrawal Requests
    Route::get('user_withdrawal', [WithdrawalRequestsController::class, 'getUserWithdrawals']);
    Route::get('user_withdrawals', [WithdrawalRequestsController::class, 'getUserWithdrawals']);
    Route::get('user_withdrawals_paginated', [WithdrawalRequestsController::class, 'getUserWithdrawalsPaginated']);
    Route::post('user_withdrawal', [WithdrawalRequestsController::class, 'addUserWithdrawalsPaginated']);
    Route::patch('user_withdrawal', [WithdrawalRequestsController::class, 'updateUserWithdrawalsPaginated']);
    Route::delete('user_withdrawal', [WithdrawalRequestsController::class, 'deleteUserWithdrawalsPaginated']);
});
