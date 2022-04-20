<?php

namespace App\Http\Controllers\Mobile;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\ApplicationUser;
use App\Models\Collection;
use App\Models\CollectionRecord;
use App\Models\SystemSettings;
use App\Models\ComponentRssFeed;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Validator;

class UserMobileController  extends Controller {

    /**
     * Return user data.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function currentUser(Request $request) {
        Config::set('auth.providers.users.model', ApplicationUser::class);

        $user = auth()->user();
        if ($user) {
            $response = response()->json($user);
        } else {
            $response = response()->json(['error' => 'USER_NOT_FOUND'], 401);
        }

        return $response;
    }

    /**
     * Return user name.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getUserName(Request $request) {
        Config::set('auth.providers.users.model', ApplicationUser::class);

        $user = auth()->user();
        if ($user) {
            $response = response()->json(['name' =>$user->name]);
        } else {
            $response = response()->json(['error' => 'USER_NOT_FOUND'], 401);
        }

        return $response;
    }

    /**
     * Return user login.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getUserLogin(Request $request) {
        Config::set('auth.providers.users.model', ApplicationUser::class);

        $user = auth()->user();
        if ($user) {
            $response = response()->json(['login' => $user->mail]);
        } else {
            $response = response()->json(['error' => 'USER_NOT_FOUND'], 401);
        }

        return $response;
    }

    /**
     * Set state for user topic.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function setTopic(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'topic_id' => 'required',
                'state' => 'required',
                'sb'  => 'required'
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json(['error' => $error_message, 403]);
        } else {
            $app = Application::where("sb", $request->sb)->first();
            if (!$app) {
                $response = response()->json(['error' => 'APPLICATION_NOT_FOUND'], 403);
            } else {
                Config::set('auth.providers.users.model', ApplicationUser::class);

                $user = auth()->user();
                if ($user) {

                    if ($user->topics) {
                        $topics = json_decode($user->topics, true);
                    } else {
                        $topics = [];
                    }

                    $topics['topic_'.$request->topic_id] = $request->state;

                    $user->topics = json_encode($topics);
                    $user->save();
                    $response = response()->json(['topics' => $user->topics]);
                } else {
                    $response = response()->json(['error' => 'USER_NOT_FOUND'], 401);
                }
            }
        }
        return $response;
    }

    /**
     * Return user topics json.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getTopics(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'sb'  => 'required'
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json(['error' => $error_message, 403]);
        } else {
            $app = Application::where("sb", $request->sb)->first();
            if (!$app) {
                $response = response()->json(['error' => 'APPLICATION_NOT_FOUND'], 403);
            } else {
                Config::set('auth.providers.users.model', ApplicationUser::class);

                $user = auth()->user();
                if ($user) {
                    $response = response()->json(['topics' => $user->topics]);
                } else {
                    $response = response()->json(['error' => 'USER_NOT_FOUND'], 401);
                }
            }
        }
        return $response;
    }

    /**
     * Return user topic value.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getTopic(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'sb'  => 'required',
                'topic_id' => 'required'
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json(['error' => $error_message, 403]);
        } else {
            $app = Application::where("sb", $request->sb)->first();
            if (!$app) {
                $response = response()->json(['error' => 'APPLICATION_NOT_FOUND'], 403);
            } else {
                Config::set('auth.providers.users.model', ApplicationUser::class);

                $user = auth()->user();
                if ($user) {
                    $topics = json_decode($user->topics, true);
                    foreach ($topics as $key => $value) {
                        if (substr($key, -1) == $request['topic_id']) {
                            return response()->json([substr($key, -1) => $value]);
                        }
                    }
                    $response = response()->json(['error' => 'TOPIC_NOT_FOUND'], 406);
                } else {
                    $response = response()->json(['error' => 'USER_NOT_FOUND'], 401);
                }
            }
        }
        return $response;
    }

    /**
     * Save collection record.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function saveCollectionRecord(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'sb'  => 'required',
                'collectionId' => 'required',
                'values' => 'required'
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json(['error' => $error_message, 403]);
        } else {
            $app = Application::where("sb", $request->sb)->first();
            if (!$app) {
                $response = response()->json(['error' => 'APPLICATION_NOT_FOUND'], 403);
            } else {
                Config::set('auth.providers.users.model', ApplicationUser::class);

                //$user = auth()->user();
                //if ($user) {
                    $record = new CollectionRecord();
                    $record->collection_id = $request->collectionId;
                    $record->values = $request->values;
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
                            $email_text = $email_text.$value['field_name_'.$app->default_language].' - '.$values[$value['fieldId']] . "\n";
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
                /*} else {
                    $response = response()->json(['error' => 'USER_NOT_FOUND'], 401);
                }*/
            }
        }
        return $response;
    }

    /**
     * Return data for rss component.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function getRssFeed(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'sb'  => 'required',
                'component_id' => 'required'
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json(['error' => $error_message, 403]);
        } else {
            $app = Application::where("sb", $request->sb)->first();
            if (!$app) {
                $response = response()->json(['error' => 'APPLICATION_NOT_FOUND'], 403);
            } else {
                $feed_url = ComponentRssFeed::where('component_id', $request['component_id'])->first()['feed_url'];

                $xmlString = file_get_contents($feed_url);
                $xml = simplexml_load_string($xmlString,'SimpleXMLElement',LIBXML_NOCDATA);
                $json = json_encode($xml);
                $data = json_decode($json, TRUE);

                for ($i = 0; $i < count($data['channel']['item']); $i++) {
                    if ($data['channel']['item'][$i]['description']) {
                        preg_match('/<img.*src="(.*)".*>/mU', $data['channel']['item'][$i]['description'], $images);
                        if (count($images) > 1) {
                            $data['channel']['item'][$i]['image_url'] = $images[1];
                        } else {
                            $data['channel']['item'][$i]['image_url'] = null;
                        }

                        $data['channel']['item'][$i]['description'] = strip_tags($data['channel']['item'][$i]['description']);
                        $data['channel']['item'][$i]['link'] = str_replace(["\n", ' '], '', $data['channel']['item'][$i]['link']);
                    } else {
                        $data['channel']['item'][$i]['image_url'] = null;
                        $data['channel']['item'][$i]['description'] = '';
                    }
                }

                return response()->json(['feed' => $data ]);
            }
        }

        return $response;
    }
}
