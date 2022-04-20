<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApplicationPageComponent extends Model
{
    use HasFactory;

    public static function boot()
    {
        parent::boot();

        static::creating(function (&$item) {
            if (!$item->code) {
                $item->code = "";
            }

            if (!$item->visibility) {
                $item->visibility = "";
            }
        });
    }
}
