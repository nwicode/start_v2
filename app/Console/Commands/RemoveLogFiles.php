<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class RemoveLogFiles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'RemoveLogFiles:Start';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete files form logs folder that created > 12 hours ago';

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
        $dir_with_apps = public_path().'/storage/application/';

        $dirs = scandir($dir_with_apps);

        if ($dirs) {
            $dirs = array_diff($dirs , array('..', '.'));
            if ($dirs) {
                foreach ($dirs as $key => $value) {
                    $logs_dir =  $dir_with_apps . $value . '/logs/';

                    if (file_exists($logs_dir)) {
                        $log_files = array_diff(scandir($logs_dir) , array('..', '.'));

                        foreach ($log_files as $log_key => $log_value) {
                            $file_time = filemtime($logs_dir . $log_value);

                            if (time() - $file_time > 12 * 60 * 60) {
                                $result = shell_exec("cd " . $logs_dir . " && rm " . $logs_dir . $log_value. "  2>&1");
                            }
                        }
                    }
                }
            }
        }

        return 0;
    }
}
