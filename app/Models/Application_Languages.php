<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Application;

class Application_Languages extends Model
{
    use HasFactory;


    protected $table = 'application_languages';
    protected $primaryKey = 'id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'code',
        'app_id',
        'active',
    ];    


    protected $application;    

    /**
     * set model application
     */
    public function setApplication(Application $app) {
        $this->application = $app;
        return $this;
    }
    
    
    /**
     * remove all application languages
     */
    public function removeLanguages() {
        if ($this->application->id) Application_Languages::where('app_id', $this->application->id)->delete();

    }

    /**
     * Add new language code and name to application_language (or update if code exists)
     */
    public function addLanguage($code, $name,$active=1) {
        Application_Languages::updateOrCreate(
            ['code' => $code,'app_id'=>$this->application->id],
            ['name' => $name,'active'=>$active],
        );
    }

    /**
     * Get applaiction languages
     */
    public function getLanguages() {
        return Application_Languages::where("app_id",$this->application->id)->get();
    }
}
