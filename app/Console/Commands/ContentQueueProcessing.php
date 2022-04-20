<?php

namespace App\Console\Commands;

use App\Models\ApplicationContent;
use App\Models\ApplicationContentType;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ContentQueueProcessing extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ProcessingAddedContent:Start';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Processing requests for adding application content';

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
        $numberOfProcessedRecords = 1;

        for ($i = 0; $i < $numberOfProcessedRecords; $i++) {
            $recordWithContents = DB::table('application_content_queue')->first();
            if ($recordWithContents) {
                $file = file_get_contents(public_path().'/storage/'.$recordWithContents->file_name);
                $dataObject = json_decode($file, true);

                $contentTypeFields = ApplicationContentType::getContentTypeFields($recordWithContents->content_type_id);

                for ($j = 0; $j < count($dataObject); $j++) {
                    $content = new ApplicationContent();
                    $content->app_id = $recordWithContents->app_id;
                    $content->content_type_id = $recordWithContents->content_type_id;

                    for ($i = 0; $i < count($contentTypeFields); $i++) {
                        if (array_key_exists($contentTypeFields[$i]->name, $dataObject[$j])) {
                            if (str_starts_with($contentTypeFields[$i]->db_field, 'column_date')) {
                                $content[$contentTypeFields[$i]->db_field] = Carbon::parse($dataObject[$j][$contentTypeFields[$i]->name])->toDateTime();
                            } else {
                                $content[$contentTypeFields[$i]->db_field] = $dataObject[$j][$contentTypeFields[$i]->name];
                            }
                        }
                    }
                    $content->save();
                }

                unlink(public_path().'/storage/'.$recordWithContents->file_name);
                DB::table('application_content_queue')->delete($recordWithContents->id);
            } else {
                return 0;
            }
        }
        return 0;
    }
}
