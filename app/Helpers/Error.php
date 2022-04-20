<?php

namespace App\Helpers;

class Error {

    public static function get_error_message($code) {
        switch($code) {
            case 100:
                $string = "Error.";
                break;
            case 101:
                $string = "Success.";
                break;
            default:
                $string = "Unknown error occurred.";
        }
        return $string;
    }
}