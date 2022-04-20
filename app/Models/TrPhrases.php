<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrPhrases extends Model
{
    protected $primaryKey = 'lang_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'lang_id',
        'section',
        'phrase',
        'translation',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function (&$item) {
            if (!$item->translation) {
                $item->translation = "";
            }
        });
    }
}
