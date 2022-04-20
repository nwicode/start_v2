<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Notifications extends Model
{
    use HasFactory;

    // public static function unread() {
    //     return static::where('read', 0)->get;
    // }

    // public static function getall() {
    //     return static::all()->get;
    // }
}