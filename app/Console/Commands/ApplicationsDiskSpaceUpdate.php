<?php

namespace App\Console\Commands;

use App\Models\Application;
use Illuminate\Console\Command;

class ApplicationsDiskSpaceUpdate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ApplicationsDiskSpace:Update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Updating the disk space occupied by applications';

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
        $applications = Application::all();

        foreach ($applications as $application) {
            $application->calculatingOccupiedDiskSpace();
        }
		\Log::info("calculatingOccupiedDiskSpace is working fine!");
        return 0;
    }
}
