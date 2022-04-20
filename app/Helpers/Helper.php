<?php

namespace App\Helpers;

use Hash;

class Helper {

    public static function null_safe($arr) {
        $newArr = array();
        foreach ($arr as $key => $value) {
            $newArr[$key] = ($value == NULL) ? "" : $value;
        }
        return $newArr;
    }

    public static function generate_token() {
        return Helper::clean(Hash::make(rand() . time() . rand()));
    }

    public static function clean($string) {
        $string = str_replace(' ', '-', $string);
        return preg_replace('/[^A-Za-z0-9\-]/', '', $string);
    }

    public static function generateUniqueKey($length) {
        if(isset($length)){
            $num_segments = 1;
            $segment_chars = $length;
        }else{
            $num_segments = 1;
            $segment_chars = 6;
        }
        $tokens = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789_';
        $license_string = '';
        for ($i = 0; $i < $num_segments; $i++) {
            $segment = '';
            for ($j = 0; $j < $segment_chars; $j++) {
                $segment .= $tokens[rand(0, strlen($tokens)-1)];
            }
            $license_string .= $segment;
            if ($i < ($num_segments - 1)) {
                $license_string .= '-';
            }
        }
        if(isset($suffix)){
            if(is_numeric($suffix)) {
                $license_string .= '-'.strtoupper(base_convert($suffix,10,36));
            }else{
                $long = sprintf("%u\n", ip2long($suffix),true);
                if($suffix === long2ip($long) ) {
                    $license_string .= '-'.strtoupper(base_convert($long,10,36));
                }else{
                    $license_string .= '-'.strtoupper(str_ireplace(' ','-',$suffix));
                }
            }
        }
        return $license_string;
    }
}