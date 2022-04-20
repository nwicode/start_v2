<?php
/**
 * In app purchases in applications
 */
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\InAppPurchase;
use App\Models\Application;
use App\Models\Application_IAP_Description;

class Application_IAP extends Model
{
    use HasFactory;

    protected $table = 'application_i_a_p_s';
    protected $primaryKey = 'id';

    protected $application;


    /**
     * Set application
     */
    public function setApplication(Appilcation $app) {
        $this->application = $app;
        return $this;
    }



    /**
     * get application products
     */
    public function getInAppProducts($app_id) {
        $products_array = [];
        $products = Application_IAP::where("application_i_a_p_s.app_id",$app_id)->get();
        foreach($products as $p) {
            $languages = Application_IAP_Description::where('app_id',$app_id)->where("iap_id",$p->id)->get();

            //type
            $type = InAppPurchase::where("id",$p->iap_id)->get();
            $p['type']=$type;
            //$p['type_name']=$type->type_name;

            //languages array
            $languages_array = [];
            foreach($languages as $l) {
                $languages_array[$l->lang] = $l;
            }
            $p['languages'] = $languages_array;
            $languages_array = [];
            foreach($languages as $l) {
                $languages_array[] = $l;
            }
            $p['languages_array'] = $languages_array;

            $products_array[]=$p;
        }

        /*->join('application_i_a_p_descriptions', function($join) {
            $join->on('application_i_a_p_descriptions.app_id', '=', 'application_i_a_p_s.app_id');
            $join->on('application_i_a_p_descriptions.iap_id', '=', 'application_i_a_p_s.id');
        })->get();*/

        return $products_array;
    }
}
