<?php

namespace App\Console\Commands;
use App\Http\Controllers\SdkController;

use Illuminate\Console\Command;

class InstallNpms extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'Builder:Prepare';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Prepate Builder/build folder';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        
		$controller = new SdkController();
		$controller->installIonicCLI();
		
		return 0;
    }
}
