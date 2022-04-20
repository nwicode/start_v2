<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemSettings extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'system_email',
        'system_owner',
        'left_logo_img',
        'auth_color',
        'top_logo',
        'inner_logo',
        'spinner_logo',
        'text_logo_color',
        'domain',
    ];


   /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
    ];    
}
