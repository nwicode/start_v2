<?php
/**
 * Build application conotroller
 */
namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\DB;
use Validator;
use Illuminate\Http\Request;
use App\Models\Application;
use App\Models\Colors;
use App\Models\Application_Languages;
use App\Models\Application_IAP;
use App\Models\Application_IAP_Description;
use App\Models\InAppPurchase;

class Build extends Controller
{
    //

    /**
     * get request to build android application
     */
    function buildAndroid(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'app_id' => 'required',
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = $error_message;
        } else {
            $response = response()->json(['message' => 'APPLICATION_BUILD']);
        }
        return $response;
    }
}
