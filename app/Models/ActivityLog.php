<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model {
    protected $primaryKey = 'id';

    /**
     * Add new record in ActivityLog.
     *
     * @param $user_id
     * @param $app_id
     * @param $name
     * @param $text
     * @return bool save result
     */
    public function setActivityLog($user_id, $app_id, $name, $text) {
        $this->user_id = $user_id;
        $this->app_id = $app_id;
        $this->name = $name;
        $this->text = $text;

        $result = $this->save();

        return $result;
    }
}
