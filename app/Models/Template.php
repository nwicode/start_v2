<?php

namespace App\Models;

use DOMDocument;
use DOMXPath;
use Illuminate\Database\Eloquent\Model;

class Template extends Model {

    /**
     * Replace macros in text.
     * Return text with replacements and list with macros.
     *
     * @param string $text source text
     * @param array $macrosData macros data
     * @return array text with replacements and list with macros
     */
    function replaceMacros(string $text, array $macrosData) {
        $macrosList = [];
        $patterns = array();
        $replacements = array();

        foreach ($macrosData as $key => $value) {
            $macrosList[] = strtoupper($key);
            $patterns[] = '/\['.strtoupper($key).'\]/i';
            $replacements[] = $value;
        }

        $result = preg_replace($patterns, $replacements, $text);

        return ["result" =>$result, "makros" => $macrosList];

    }
}
