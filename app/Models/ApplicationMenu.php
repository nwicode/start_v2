<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Application;

class ApplicationMenu extends Model
{
    use HasFactory;

    protected $application;

    public static function boot()
    {
        parent::boot();

        static::creating(function (&$item) {
            if (!$item->translations) {
                $item->translations = "{}";
            }

            if (!$item->action) {
                $item->action = "-";
            }

            if (!$item->image) {
                $item->image = "";
            }

            if (!$item->visible_conditions) {
                $item->visible_conditions = "{}";
            }
        });
    }

   /**
    * set model application
    */
    public function setApplication(Application $app) {
        $this->application = $app;
        return $this;
    }


}
