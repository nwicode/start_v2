<?php
/**
 * IAP types model
 */
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InAppPurchase extends Model
{
    use HasFactory;

    protected $table = 'in_app_purchases';
    protected $primaryKey = 'id'; 
    
    /**
     * get all product types
     */
    public function getAllProducts() {
        return InAppPurchase::all();
    }
    
    /**
     * get active product types
     */
    public function getActiveProducts() {
        return InAppPurchase::where("disabled",0)->get();
    }


    
}