<?php

namespace App\Console\Commands;

use App\Models\Application;
use App\Models\BuildQuery;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class RemoveNodeModulesFolder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'RemoveNodeModulesFolder:Start';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete node_modules folder in application sources';

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

        for ($i = 0; $i < count($applications); $i++) {
            $query = BuildQuery::where('app_id', $applications[$i]->id)->get();
            $can_delete = true;
            for ($j = 0; $j < count($query); $j++) {
                $can_delete = $can_delete && !$query[$j]->run;
            }

            if ($can_delete) {
                $appDir = public_path() . '/storage/application/' . $applications[$i]->id . '-' . $applications[$i]->unique_string_id . '/';
                if (file_exists($appDir)) {
                    if (file_exists($appDir . 'sources/')) {

                        if (file_exists($appDir . 'sources/node_modules')) {
                            $result = shell_exec("cd " . $appDir . "sources/ && rm -rf " . $appDir . "sources/node_modules  2>&1");
                        }

                        if (file_exists($appDir . "sources/.angular")) {
                            $result = shell_exec("cd " . $appDir . "sources/ && rm -rf " . $appDir . "sources/.angular  2>&1");
                        }
                    }
                }
            }
        }

        return 0;
    }
}
