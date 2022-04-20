<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Application;
use App\Models\ApplicationContentType;
use Illuminate\Support\Facades\DB;

class ApplicationContent extends Model
{
    use HasFactory;

    protected $application;


   /**
    * set model application
    */
    public function setApplication(Application $app) {
        $this->application = $app;
        return $this;
    }    

    /**
     * Return content list
     */
    public function getContent($list_id, $language="", $filter = "",$sort_field = "id", $sort_direction = "ASC", $limit = 0, $offset = 0) {
        $list = [];

        $contentType = ApplicationContentType::find($list_id);
        if ($contentType->app_id === $this->application->id) {
            $fields = ApplicationContentType::getContentTypeFields($list_id);

            $queryFields = [];
            if (count($fields) === 1) {
                $queryFields[0] = $fields[0]->db_field;
            } else {
                for ($i = 0; $i < count($fields); $i++) {
                    $queryFields[$i] = $fields[$i]->db_field;
                }
            }
            $queryFields[count($queryFields)] = 'id';

            $fieldsValue = DB::table('application_contents')
                ->where('app_id', $this->application->id)
                ->where('content_type_id', $list_id);
            if ($filter!="") {
                $fieldsValue->where('column_title', 'like', '%' . $filter . '%');
            }
            
                        
            
            $fieldsValue->orderBy($sort_field, strtolower($sort_direction));
            
        

            if ($limit>0) {
                $fieldsValue = $fieldsValue->limit($limit);
            }
            if ($offset>0) {
                $fieldsValue = $fieldsValue->offset($offset);
            }
            $fieldsValue = $fieldsValue->select($queryFields)
                ->get();


            foreach($fieldsValue as $fieldValue) {
                $item = [];
                foreach($fields as $field) {
                    $item[$field->db_field] = $fieldValue->{$field->db_field};
                    $item[$field->db_field.'_original'] = $fieldValue->{$field->db_field};

                    //add path to image
                    if (substr($field->db_field,0,12)=='column_image') {
                        if (substr($item[$field->db_field],0,4)!=='http') $item[$field->db_field] = "./assets/resources/".$item[$field->db_field];
                    }
                    
                    //if ($field->multilang) {
                        $strings = @json_decode($item[$field->db_field],true);
                        //try to get language
                        if ($language!="" && isset($strings[$language])) $item[$field->db_field] = $strings[$language];
                        else if (is_array($strings)) $item[$field->db_field] = reset($strings);
                    //}

                }
                $list[]=$item;
            }

            //$list = ['fields' => $fields, 'fields_value' => $fieldsValue, "list"=>$list];
            
        }

        return $list;
    }
}
