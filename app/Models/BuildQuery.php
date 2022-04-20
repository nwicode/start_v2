<?php
/*
 *	Build query helpers
 */
 
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Application;

class BuildQuery extends Model
{
    use HasFactory;
	
	protected $app;
	
	/*
	* Create start row in table
	*/
	public function addBuild(Application $app, $type) {
		$this->app = $app;
		$query=$this;
		$query->app_id = $app->id;
		$query->run = false;
		$query->type = $type;
		$query->bundle_id = $app->bundle_id;
		$query->vesrion = $app->vesrion;
		$query->buld_start = now();
		$query->save();
		return $this;
	}
}
