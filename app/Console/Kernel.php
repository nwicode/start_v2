<?php

namespace App\Console;

use Carbon\Carbon;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\DB;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        Commands\ApplicationsDiskSpaceUpdate::class,
        Commands\BuildApplication::class,
        Commands\RemoveNodeModulesFolder::class,
        Commands\RemoveLogFiles::class,
        Commands\RemoveGeneratedApkFiles::class
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('ApplicationsDiskSpace:Update')->dailyAt('13:00')
            ->before(function() {
                DB::table('cron_log')->insert(['command'=>'ApplicationsDiskSpace:Update', 'start'=>Carbon::now()]);
            })
            ->onSuccess(function () {
                DB::table('cron_log')->where('command', 'ApplicationsDiskSpace:Update')->orderByDesc('id')->limit(1)->update(['result'=>0,'end'=>Carbon::now()]);
            })
            ->onFailure(function () {
                DB::table('cron_log')->where('command', 'ApplicationsDiskSpace:Update')->orderByDesc('id')->limit(1)->update(['result'=>1,'end'=>Carbon::now()]);
            });

			//$schedule->command('BuildApplication:Start')->everyMinute();
			$schedule->command('BuildApplication:Start')->everyMinute();
			//$schedule->command('BuildApplication:WWW')->cron('* * * * *');

			$schedule->command('Builder:Prepare')->everyMinute();
			
			$schedule->command('Builder:InstallAndroidSDK')->everyMinute();
			
			$schedule->command('ProcessingAddedContent:Start')->everyMinute();

            $schedule->command('RemoveNodeModulesFolder:Start')->everyFifteenMinutes();

            $schedule->command('RemoveLogFiles:Start')->everyThreeHours();

            $schedule->command('RemoveGeneratedApkFiles:Start')->everyTwoHours();

    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
