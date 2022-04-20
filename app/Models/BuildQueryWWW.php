<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Application;

class BuildQueryWWW extends Model
{
    use HasFactory;

    protected $table = 'build_queries_www';
    protected $primaryKey = 'id';

	protected $app;
	
	/*
	* Create start row in table
	*/
	public function addFirstBuildWWW(Application $app) {
		$this->app = $app;
		$query=$this;
		$query->app_id = $app->id;
		$query->run = false;
		$query->type = "first_www";
		$query->bundle_id = $app->bundle_id;
		$query->vesrion = $app->vesrion;
		$query->buld_start = now();
		$query->save();
		return $this;
	}  
	
	/*
	* Create start row in table
	*/
	public function addBuildWWW(Application $app) {
		$this->app = $app;
		$query=$this;
		$query->app_id = $app->id;
		$query->run = false;
		$query->type = "www";
		$query->bundle_id = $app->bundle_id;
		$query->vesrion = $app->vesrion;
		$query->buld_start = now();
		$query->save();
		return $this;
	}    
}
