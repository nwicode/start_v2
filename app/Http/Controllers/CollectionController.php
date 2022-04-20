<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Validator;
use Illuminate\Http\Request;
use App\Models\Application;
use App\Models\Collection;
use App\Models\CollectionRecord;
use App\Models\SystemSettings;

class CollectionController extends Controller
{
    /**
     * Return list with collections.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getCollectionList(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required'
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $currentUser = auth()->user();
            $app = Application::find($request['appId']);
            if ($currentUser['user_type_id'] === 1 || ($currentUser['user_type_id'] === 2 && $app['user_id'] === $currentUser['id'])) {
                $collections = Collection::where('app_id', $request['appId'])->get();

                for ($i = 0; $i < count($collections); $i++) {
                    $recordsCount = CollectionRecord::where('collection_id', $collections[$i]->id)->count();
                    $collections[$i]->record_count = $recordsCount;
                }

                $response = response()->json(['collections' => $collections]);

            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }

        return $response;
    }


    /**
     * Create new collection.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function createCollection(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'name' => 'required',
                'fields' => 'required',
                'next_field_id' => 'required',
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $currentUser = auth()->user();
            $app = Application::find($request['appId']);
            if ($currentUser['user_type_id'] === 1 || ($currentUser['user_type_id'] === 2 && $app['user_id'] === $currentUser['id'])) {

                $collection = new Collection();
                $collection->app_id = $request['appId'];
                $collection->name = $request['name'];
                $collection->fields = $request['fields'];
                $collection->next_field_id = $request['next_field_id'];
                if (isset($request['emails'])) {
                    $collection->emails = $request['emails'];
                }
                $result = $collection->save();

                if ($result) {
                    $response = response()->json(['collection' => $collection]);
                } else {
                    $response = response()->json(['error' => 'NOT_SAVE'], 406);
                }

            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }

        return $response;
    }

    /**
     * Edit collection.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function editCollection(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'collectionId' => 'required',
                'name' => 'required',
                'fields' => 'required',
                'next_field_id' => 'required',
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $currentUser = auth()->user();
            $app = Application::find($request['appId']);
            if ($currentUser['user_type_id'] === 1 || ($currentUser['user_type_id'] === 2 && $app['user_id'] === $currentUser['id'])) {
                $collection = Collection::find($request['collectionId']);
                $collection->app_id = $request['appId'];
                $collection->name = $request['name'];
                $collection->fields = $request['fields'];
                $collection->next_field_id = $request['next_field_id'];
                if (isset($request['emails'])) {
                    $collection->emails = $request['emails'];
                }
                $result = $collection->save();

                if ($result) {
                    $response = response()->json(['collection' => $collection]);
                } else {
                    $response = response()->json(['error' => 'NOT_SAVE'], 406);
                }

            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }

        return $response;
    }

    /**
     * Return collection.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getCollection(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'collectionId' => 'required'
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $currentUser = auth()->user();
            $app = Application::find($request['appId']);
            if ($currentUser['user_type_id'] === 1 || ($currentUser['user_type_id'] === 2 && $app['user_id'] === $currentUser['id'])) {

                $collection = Collection::where('id', $request['collectionId'])->first();
                $response = response()->json(['collection' => $collection]);

            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }

        return $response;
    }

    /**
     * Return collection records list.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getCollectionRecordsList(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'collectionId' => 'required'
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $currentUser = auth()->user();
            $app = Application::find($request['appId']);
            if ($currentUser['user_type_id'] === 1 || ($currentUser['user_type_id'] === 2 && $app['user_id'] === $currentUser['id'])) {
                $records = CollectionRecord::where('collection_id', $request['collectionId'])->get();
                $response = response()->json(['records' => $records]);

            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }

        return $response;
    }

    /**
     * Create new record.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function createCollectionRecord(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'collectionId' => 'required',
                'values' => 'required'
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $currentUser = auth()->user();
            $app = Application::find($request['appId']);
            if ($currentUser['user_type_id'] === 1 || ($currentUser['user_type_id'] === 2 && $app['user_id'] === $currentUser['id'])) {
                $record = new CollectionRecord();
                $record->collection_id = $request['collectionId'];
                $record->values = $request['values'];
                $record->save();

                $response = response()->json(['record' => $record]);


                $collection = Collection::find($request['collectionId']);
                if ($collection->emails) {
                    $emails = explode(',', str_replace(" ", '', $collection->emails));

                    $settings = SystemSettings::first();
                    $smtp_user = $settings->smtp_user;

                    config([
                        'mail.host' => $settings->smtp_host,
                        'mail.port' => $settings->smtp_port,
                        'mail.username' => $settings->smtp_user,
                        'mail.password' => $settings->smtp_password
                    ]);

                    $mailConfig = [
                        'transport' => 'smtp',
                        'host' => $settings->smtp_host,
                        'port' => $settings->smtp_port,
                        'encryption' => "tls",
                        'username' => $settings->smtp_user,
                        'password' => $settings->smtp_password,
                        'timeout' => null
                    ];
                    config(['mail.mailers.smtp' => $mailConfig]);

                    $email_text = '';
                    $fields = json_decode($collection->fields,true);
                    $values = json_decode($request['values'],true);
                    foreach ($fields['fields'] as $key=>$value) {
                        $email_text = $email_text.$value['field_name_'.$app->default_language].' - '.$values[$value['fieldId']]  . "\n";
                    }

                    for ($i = 0; $i < count($emails); $i++) {
                        $data = array('email' => $emails[$i], 'body' => $email_text, 'smtp_user' => $smtp_user, "system_email" => $settings->system_email, "subject" => $settings->system_owner);
                        Mail::send(array(), array('data' => $data), function ($message) use ($data) {
                            $message->from($data["smtp_user"]);
                            $message->sender($data["smtp_user"]);
                            $message->to($data['email']);
                            $message->replyTo($data['system_email']);
                            $message->subject($data['subject']);
                            $message->priority(3);
                            $message->setBody($data['body'], 'text/html');
                        });
                    }
                }

            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }

        return $response;
    }

    /**
     * Edit record.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function editCollectionRecord(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'recordId' => 'required',
                'values' => 'required'
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $currentUser = auth()->user();
            $app = Application::find($request['appId']);
            if ($currentUser['user_type_id'] === 1 || ($currentUser['user_type_id'] === 2 && $app['user_id'] === $currentUser['id'])) {

                $record = CollectionRecord::find($request['recordId']);
                $record->values = $request['values'];
                $record->save();

                $response = response()->json(['record' => $record]);

            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }

        return $response;
    }

    /**
     * Return record.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getCollectionRecord(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'recordId' => 'required'
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $currentUser = auth()->user();
            $app = Application::find($request['appId']);
            if ($currentUser['user_type_id'] === 1 || ($currentUser['user_type_id'] === 2 && $app['user_id'] === $currentUser['id'])) {

                $record = CollectionRecord::find($request['recordId']);

                $response = response()->json(['record' => $record]);

            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }

        return $response;
    }

    /**
     * Delete record.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function deleteCollectionRecord(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'appId' => 'required',
                'recordId' => 'required'
            )
        );
        if($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $currentUser = auth()->user();
            $app = Application::find($request['appId']);
            if ($currentUser['user_type_id'] === 1 || ($currentUser['user_type_id'] === 2 && $app['user_id'] === $currentUser['id'])) {

                $record = CollectionRecord::find($request['recordId']);
                $record->delete();

                $response = response()->json(['message' => 'RECORD_DELETED']);

            } else {
                $response = response()->json(['error' => 'NOT_ADMIN'], 403);
            }
        }

        return $response;
    }
}
