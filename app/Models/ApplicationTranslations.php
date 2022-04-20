<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApplicationTranslations extends Model
{
    use HasFactory;

    public static function boot()
    {
        parent::boot();

        static::creating(function (&$item) {
            if (!$item->translations) {
                $item->translations = "";
            }
        });
    }
}
