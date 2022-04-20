<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Colors extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'app_id',
        'name',
        'color_name',
        'color_type',
        'named',
        'disabled',
        'color_value',
        'color_value_rgb',
        'color_value_contrast',
        'color_value_contrast_rgb',
        'color_value_shade',
        'color_value_tint',
    ];
    

    public function getDefaultColorsArray() {
        $colors = [];


        //Text color
        $color['name'] = "Text color of the entire app";
        $color['color_name'] = "--ion-text-color";
        $color['color_value'] = "#000000";
        $color['color_value_rgb'] = "0, 0, 0";
        $colors[$color['color_name']] = $color;

        //background color
        $color['name'] = "Background color of the entire app";
        $color['color_name'] = "--ion-background-color";
        $color['color_value'] = "#fffffff";
        $color['color_value_rgb'] = "255, 255, 255";
        $colors[$color['color_name']] = $color;


        //Stepped colors
        $color['name'] = "Step color 50";
        $color['color_name'] = "--ion-color-step-50";
        $color['color_value'] = "#f2f2f2";
        $colors[$color['color_name']] = $color;

        $color['name'] = "Step color 100";
        $color['color_name'] = "--ion-color-step-100";
        $color['color_value'] = "#e6e6e6";
        $colors[$color['color_name']] = $color;

        $color['name'] = "Step color 150";
        $color['color_name'] = "--ion-color-step-150";
        $color['color_value'] = "#d9d9d9";
        $colors[$color['color_name']] = $color;

        $color['name'] = "Step color 200";
        $color['color_name'] = "--ion-color-step-200";
        $color['color_value'] = "#cccccc";
        $colors[$color['color_name']] = $color;

        $color['name'] = "Step color 250";
        $color['color_name'] = "--ion-color-step-250";
        $color['color_value'] = "#bfbfbf";
        $colors[$color['color_name']] = $color;

        $color['name'] = "Step color 300";
        $color['color_name'] = "--ion-color-step-300";
        $color['color_value'] = "#b3b3b3";
        $colors[$color['color_name']] = $color;

        $color['name'] = "Step color 350";
        $color['color_name'] = "--ion-color-step-350";
        $color['color_value'] = "#a6a6a6";
        $colors[$color['color_name']] = $color;

        $color['name'] = "Step color 400";
        $color['color_name'] = "--ion-color-step-400";
        $color['color_value'] = "#999999";
        $colors[$color['color_name']] = $color;

        $color['name'] = "Step color 450";
        $color['color_name'] = "--ion-color-step-450";
        $color['color_value'] = "#8c8c8c";
        $colors[$color['color_name']] = $color;

        $color['name'] = "Step color 500";
        $color['color_name'] = "--ion-color-step-500";
        $color['color_value'] = "#808080";
        $colors[$color['color_name']] = $color;

        $color['name'] = "Step color 550";
        $color['color_name'] = "--ion-color-step-550";
        $color['color_value'] = "#737373";
        $colors[$color['color_name']] = $color;

        $color['name'] = "Step color 600";
        $color['color_name'] = "--ion-color-step-600";
        $color['color_value'] = "#666666";
        $colors[$color['color_name']] = $color;

        $color['name'] = "Step color 650";
        $color['color_name'] = "--ion-color-step-650";
        $color['color_value'] = "#595959";
        $colors[$color['color_name']] = $color;

        $color['name'] = "Step color 700";
        $color['color_name'] = "--ion-color-step-700";
        $color['color_value'] = "#4d4d4d";
        $colors[$color['color_name']] = $color;

        $color['name'] = "Step color 750";
        $color['color_name'] = "--ion-color-step-750";
        $color['color_value'] = "#404040";
        $colors[$color['color_name']] = $color;

        $color['name'] = "Step color 800";
        $color['color_name'] = "--ion-color-step-800";
        $color['color_value'] = "#333333";
        $colors[$color['color_name']] = $color;

        $color['name'] = "Step color 850";
        $color['color_name'] = "--ion-color-step-850";
        $color['color_value'] = "#262626";
        $colors[$color['color_name']] = $color;

        $color['name'] = "Step color 900";
        $color['color_name'] = "--ion-color-step-900";
        $color['color_value'] = "#191919";
        $colors[$color['color_name']] = $color;

        $color['name'] = "Step color 950";
        $color['color_name'] = "--ion-color-step-950";
        $color['color_value'] = "#0d0d0d";
        $colors[$color['color_name']] = $color;


        // Default ionic theme color
        //Primary
        $color['name'] = "Primary";
        $color['named'] = "primary";
        $color['color_name'] = "--ion-color-primary";
        $color['color_value'] = "#3880ff";
        $color['color_value_rgb'] = "56, 128, 255";
        $color['color_value_contrast'] = "#ffffff";
        $color['color_value_contrast_rgb'] = "255, 255, 255";
        $color['color_value_shade'] = "#3171e0";
        $color['color_value_tint'] = "#4c8dff";
        $colors[$color['color_name']] = $color;


        //Secondary
        $color['name'] = "Secondary";
        $color['named'] = "secondary";
        $color['color_name'] = "--ion-color-secondary";
        $color['color_value'] = "#3dc2ff";
        $color['color_value_rgb'] = "61, 194, 255";
        $color['color_value_contrast'] = "#ffffff";
        $color['color_value_contrast_rgb'] = "255, 255, 255";
        $color['color_value_shade'] = "#36abe0";
        $color['color_value_tint'] = "#50c8ff";
        $colors[$color['color_name']] = $color;

        //Tertiary
        $color['name'] = "Tertiary";
        $color['named'] = "tertiary";
        $color['color_name'] = "--ion-color-tertiary";
        $color['color_value'] = "#5260ff";
        $color['color_value_rgb'] = "82, 96, 255";
        $color['color_value_contrast'] = "#ffffff";
        $color['color_value_contrast_rgb'] = "255, 255, 255";
        $color['color_value_shade'] = "#4854e0";
        $color['color_value_tint'] = "#6370ff";
        $colors[$color['color_name']] = $color;

        //Success
        $color['name'] = "Success";
        $color['named'] = "success";
        $color['color_name'] = "--ion-color-success";
        $color['color_value'] = "#2dd36f";
        $color['color_value_rgb'] = "45, 211, 111";
        $color['color_value_contrast'] = "#ffffff";
        $color['color_value_contrast_rgb'] = "255, 255, 255";
        $color['color_value_shade'] = "#28ba62";
        $color['color_value_tint'] = "#42d77d";
        $colors[$color['color_name']] = $color;

        //Warning
        $color['name'] = "Warning";
        $color['named'] = "warning";
        $color['color_name'] = "--ion-color-warning";
        $color['color_value'] = "#ffc409";
        $color['color_value_rgb'] = "255, 196, 9";
        $color['color_value_contrast'] = "#000000";
        $color['color_value_contrast_rgb'] = "0, 0, 0";
        $color['color_value_shade'] = "#e0ac08";
        $color['color_value_tint'] = "#ffca22";
        $colors[$color['color_name']] = $color;

        //danger
        $color['name'] = "Danger";
        $color['named'] = "danger";
        $color['color_name'] = "--ion-color-danger";
        $color['color_value'] = "#eb445a";
        $color['color_value_rgb'] = "235, 68, 90";
        $color['color_value_contrast'] = "#ffffff";
        $color['color_value_contrast_rgb'] = "255, 255, 255";
        $color['color_value_shade'] = "#cf3c4f";
        $color['color_value_tint'] = "#ed576b";
        $colors[$color['color_name']] = $color;


        //dark
        $color['name'] = "Dark";
        $color['named'] = "dark";
        $color['color_name'] = "--ion-color-dark";
        $color['color_value'] = "#222428";
        $color['color_value_rgb'] = "34, 36, 40";
        $color['color_value_contrast'] = "#ffffff";
        $color['color_value_contrast_rgb'] = "255, 255, 255";
        $color['color_value_shade'] = "#1e2023";
        $color['color_value_tint'] = "#383a3e";
        $colors[$color['color_name']] = $color;

        //medium
        $color['name'] = "Medium";
        $color['named'] = "medium";
        $color['color_name'] = "--ion-color-medium";
        $color['color_value'] = "#92949c";
        $color['color_value_rgb'] = "146, 148, 156";
        $color['color_value_contrast'] = "#ffffff";
        $color['color_value_contrast_rgb'] = "255, 255, 255";
        $color['color_value_shade'] = "#808289";
        $color['color_value_tint'] = "#9d9fa6";
        $colors[$color['color_name']] = $color;

        //light
        $color['name'] = "Light";
        $color['named'] = "light";
        $color['color_name'] = "--ion-color-light";
        $color['color_value'] = "#f4f5f8";
        $color['color_value_rgb'] = "244, 245, 248";
        $color['color_value_contrast'] = "#000000";
        $color['color_value_contrast_rgb'] = "0, 0, 0";
        $color['color_value_shade'] = "#d7d8da";
        $color['color_value_tint'] = "#f5f6f9";
        $colors[$color['color_name']] = $color;


        return $colors;
    }

    /**
     * Set default applications colors
     */
    public function setDefaultColors($app_id) {
        //$color = $this;

        $colors = $this->getDefaultColorsArray();
        foreach($colors as $c) {
            $color = new Colors();
            $color['app_id'] = $app_id;
            foreach($c as $color_field_name=>$color_field_value) {
                $color[$color_field_name] = $color_field_value;
            }

            $color->save();
        }

/*        //Primary
        $color['app_id'] = $app_id;
        $color['name'] = "Primary";
        $color['color_name'] = "--ion-color-primary";
        $color['color_value'] = "#3880ff";
        $color['color_value_rgb'] = "56, 128, 255)";
        $color['color_value_contrast'] = "#ffffff";
        $color['color_value_contrast_rgb'] = "255, 255, 255)";
        $color['color_value_shade'] = "#3171e0";
        $color['color_value_tint'] = "#4c8dff";

        //Secondary
        $color['app_id'] = $app_id;
        $color['name'] = "Secondary";
        $color['color_name'] = "--ion-color-secondary";
        $color['color_value'] = "#3dc2ff";
        $color['color_value_rgb'] = "61, 194, 255)";
        $color['color_value_contrast'] = "#ffffff";
        $color['color_value_contrast_rgb'] = "255, 255, 255)";
        $color['color_value_shade'] = "#36abe0";
        $color['color_value_tint'] = "#50c8ff";

        //Tertiary
        $color['app_id'] = $app_id;
        $color['name'] = "Tertiary";
        $color['color_name'] = "--ion-color-tertiary";
        $color['color_value'] = "#5260ff";
        $color['color_value_rgb'] = "82, 96, 255)";
        $color['color_value_contrast'] = "#ffffff";
        $color['color_value_contrast_rgb'] = "255, 255, 255)";
        $color['color_value_shade'] = "#4854e0";
        $color['color_value_tint'] = "#6370ff";

        //Success
        $color['app_id'] = $app_id;
        $color['name'] = "Success";
        $color['color_name'] = "--ion-color-success";
        $color['color_value'] = "#2dd36f";
        $color['color_value_rgb'] = "45, 211, 111)";
        $color['color_value_contrast'] = "#ffffff";
        $color['color_value_contrast_rgb'] = "255, 255, 255)";
        $color['color_value_shade'] = "#28ba62";
        $color['color_value_tint'] = "#42d77d";

        //Warning
        $color['app_id'] = $app_id;
        $color['name'] = "Warning";
        $color['color_name'] = "--ion-color-warning";
        $color['color_value'] = "#ffc409";
        $color['color_value_rgb'] = "255, 196, 9)";
        $color['color_value_contrast'] = "#000000";
        $color['color_value_contrast_rgb'] = "0, 0, 0)";
        $color['color_value_shade'] = "#e0ac08";
        $color['color_value_tint'] = "#ffca22";

        //danger
        $color['app_id'] = $app_id;
        $color['name'] = "Danger";
        $color['color_name'] = "--ion-color-danger";
        $color['color_value'] = "#eb445a";
        $color['color_value_rgb'] = "235, 68, 90)";
        $color['color_value_contrast'] = "#ffffff";
        $color['color_value_contrast_rgb'] = "255, 255, 255)";
        $color['color_value_shade'] = "#cf3c4f";
        $color['color_value_tint'] = "#ed576b";


        //dark
        $color['app_id'] = $app_id;
        $color['name'] = "Dark";
        $color['color_name'] = "--ion-color-dark";
        $color['color_value'] = "#222428";
        $color['color_value_rgb'] = "34, 36, 40)";
        $color['color_value_contrast'] = "#ffffff";
        $color['color_value_contrast_rgb'] = "255, 255, 255)";
        $color['color_value_shade'] = "#1e2023";
        $color['color_value_tint'] = "#383a3e";

        //medium
        $color['app_id'] = $app_id;
        $color['name'] = "Medium";
        $color['color_name'] = "--ion-color-medium";
        $color['color_value'] = "#92949c";
        $color['color_value_rgb'] = "146, 148, 156)";
        $color['color_value_contrast'] = "#ffffff";
        $color['color_value_contrast_rgb'] = "255, 255, 255)";
        $color['color_value_shade'] = "#808289";
        $color['color_value_tint'] = "#9d9fa6";

        //light
        $color['app_id'] = $app_id;
        $color['name'] = "Light";
        $color['color_name'] = "--ion-color-light";
        $color['color_value'] = "#f4f5f8";
        $color['color_value_rgb'] = "244, 245, 248)";
        $color['color_value_contrast'] = "#000000";
        $color['color_value_contrast_rgb'] = "0, 0, 0)";
        $color['color_value_shade'] = "#d7d8da";
        $color['color_value_tint'] = "#f5f6f9";



        $app->save();*/
        return true;
    }

    /**
     * get current applicateion colors
     */
    public function getApplicationColors($app_id) {
        $colors = Colors::where("app_id",$app_id)->get();
        return $colors;
    }

    /**
     * Convert hex to rgb format
     */
    static function hexToRgb($hex, $alpha = false) {
        $hex      = str_replace('#', '', $hex);
        $length   = strlen($hex);
        $rgb['r'] = hexdec($length == 6 ? substr($hex, 0, 2) : ($length == 3 ? str_repeat(substr($hex, 0, 1), 2) : 0));
        $rgb['g'] = hexdec($length == 6 ? substr($hex, 2, 2) : ($length == 3 ? str_repeat(substr($hex, 1, 1), 2) : 0));
        $rgb['b'] = hexdec($length == 6 ? substr($hex, 4, 2) : ($length == 3 ? str_repeat(substr($hex, 2, 1), 2) : 0));
        if ( $alpha ) {
           $rgb['a'] = $alpha;
        }
        return $rgb;
    }

    /**
     * Calculate tint color
     */
    static function getTintFromHex($hex) {

        $return = [];

        $tint_factor = 0.15;
        $hex      = str_replace('#', '', $hex);
        $length   = strlen($hex);
        $rgb['r'] = hexdec($length == 6 ? substr($hex, 0, 2) : ($length == 3 ? str_repeat(substr($hex, 0, 1), 2) : 0));
        $rgb['g'] = hexdec($length == 6 ? substr($hex, 2, 2) : ($length == 3 ? str_repeat(substr($hex, 1, 1), 2) : 0));
        $rgb['b'] = hexdec($length == 6 ? substr($hex, 4, 2) : ($length == 3 ? str_repeat(substr($hex, 2, 1), 2) : 0));

        //$return['source']['hex'] = $hex;
        //$return['source']['rgb'] = $rgb;

        //calculate tint on every color
        $rgb['r']  = $rgb['r'] + ($tint_factor * (255 - $rgb['r']));
        $rgb['g']  = $rgb['g'] + ($tint_factor * (255 - $rgb['g']));
        $rgb['b']  = $rgb['b'] + ($tint_factor * (255 - $rgb['b']));

        $return['hex'] = sprintf("#%02x%02x%02x", $rgb['r'], $rgb['g'], $rgb['b']);
        $return['rgb'] = $rgb;        

        return $return;
    }  
    
    /**
     * Calculate shade color
     */
    static function getShadeFromHex($hex) {

        $return = [];

        $shade_factor = 0.85;
        $hex      = str_replace('#', '', $hex);
        $length   = strlen($hex);
        $rgb['r'] = hexdec($length == 6 ? substr($hex, 0, 2) : ($length == 3 ? str_repeat(substr($hex, 0, 1), 2) : 0));
        $rgb['g'] = hexdec($length == 6 ? substr($hex, 2, 2) : ($length == 3 ? str_repeat(substr($hex, 1, 1), 2) : 0));
        $rgb['b'] = hexdec($length == 6 ? substr($hex, 4, 2) : ($length == 3 ? str_repeat(substr($hex, 2, 1), 2) : 0));

        //$return['source']['hex'] = $hex;
        //$return['source']['rgb'] = $rgb;

        //calculate shade on every color
        $rgb['r']  = $rgb['r'] * $shade_factor;
        $rgb['g']  = $rgb['g'] * $shade_factor;
        $rgb['b']  = $rgb['b'] * $shade_factor;

        $return['hex'] = sprintf("#%02x%02x%02x", $rgb['r'], $rgb['g'], $rgb['b']);
        $return['rgb'] = $rgb;        

        return $return;
    }    


    /**
     * return contrast color
     */
    static function getContrastColor($hexColor) 
    {
    
            // hexColor RGB
            $R1 = hexdec(substr($hexColor, 1, 2));
            $G1 = hexdec(substr($hexColor, 3, 2));
            $B1 = hexdec(substr($hexColor, 5, 2));
    
            // Black RGB
            $blackColor = "#000000";
            $R2BlackColor = hexdec(substr($blackColor, 1, 2));
            $G2BlackColor = hexdec(substr($blackColor, 3, 2));
            $B2BlackColor = hexdec(substr($blackColor, 5, 2));
    
             // Calc contrast ratio
             $L1 = 0.2126 * pow($R1 / 255, 2.2) +
                   0.7152 * pow($G1 / 255, 2.2) +
                   0.0722 * pow($B1 / 255, 2.2);
    
            $L2 = 0.2126 * pow($R2BlackColor / 255, 2.2) +
                  0.7152 * pow($G2BlackColor / 255, 2.2) +
                  0.0722 * pow($B2BlackColor / 255, 2.2);
    
            $contrastRatio = 0;
            if ($L1 > $L2) {
                $contrastRatio = (int)(($L1 + 0.05) / ($L2 + 0.05));
            } else {
                $contrastRatio = (int)(($L2 + 0.05) / ($L1 + 0.05));
            }
    
            // If contrast is more than 5, return black color
            if ($contrastRatio > 5) {
                return ["hex"=>'#000000','rgb'=>["r"=>"0","g"=>"0","b"=>"0",]];
            } else { 
                // if not, return white color.
                return ["hex"=>'#FFFFFF','rgb'=>["r"=>"255","g"=>"255","b"=>"255",]];
            }
    }    
}
