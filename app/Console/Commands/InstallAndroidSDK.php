<?php

namespace App\Console\Commands;


use Illuminate\Console\Command;
use App\Http\Controllers\SdkController;

class InstallAndroidSDK extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'Builder:InstallAndroidSDK';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Install ANDROID SDK in build dir';

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
		$controller->installAndroidToolsCLI();		
        return 0;
    }
}
