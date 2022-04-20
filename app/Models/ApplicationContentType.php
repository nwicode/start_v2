<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class ApplicationContentType extends Model
{
    use HasFactory;

    /**
     * Return content type fields sort by order.
     *
     * @param $content_type_id
     * @return array
     */
    static function getContentTypeFields($content_type_id): array
    {
        $structure = DB::table('application_content_types')
            ->where('id', $content_type_id)
            ->first(['structure']);
        $fields = json_decode($structure->structure)->fields;


        for ($j = 0; $j < count($fields) - 1; $j++) {
            for ($i = 0; $i < count($fields) - $j - 1; $i++) {
                if ($fields[$i]->order > $fields[$i + 1]->order) {
                    $tmp_var = $fields[$i + 1];
                    $fields[$i + 1] = $fields[$i];
                    $fields[$i] = $tmp_var;
                }
            }
        }

        return $fields;
    }
}
