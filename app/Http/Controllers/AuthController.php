<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\ReferralLink;
use App\Models\ReferralRelationship;
use App\Models\SystemSettings;
use App\Models\Template;
use Google_Client;
use Hash;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

use Illuminate\Support\Facades\Log;

use Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Requests\SignUpRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Helpers\Helper;
use App\Http\Controllers\SystemController;
use App\Models\MailActivations;


class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'signup', 'reset_password', 'me', 'mailconfirm', 'googleLogin']]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        $credentials = request(['email', 'password']);

        //Log::info("credentials : $credentials");


        if (!$token = auth()->attempt($credentials)) {

            return response()->json(['error' => 'USER_NOT_FOUND'], 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        $user = auth()->user();
        if ($user) {
            $user["logined"] = true;

            //Update last_update
            $user_id = auth()->id();
            $u = User::find($user_id);
            $u->timestamps = false;
            $u->update(['last_updated' => Carbon::now()]);
            $u->save();
        } else {
            $user["logined"] = false;
        }
        return response()->json($user);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'LOGOUT_OK']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    public function resendcode(Request $request)
    {
        $emailvalidcode = $this->generateUniqueKey();
        $user = User::find($request->id);
        $user->email_activation_code = $emailvalidcode;
        $user->save();


        $lang_id = DB::table('languages')->where('code', $request->language)->select('id')->get()[0]->id;
        $source_text = (DB::table('static_pages')
            ->where('code', '=', 'MAIL_ACTIVATION_CODE')
            ->where('lang_id', $lang_id)
            ->select('content')
            ->get())[0]->content;
        $template = new Template();
        $text = $template->replaceMacros($source_text, ['code' => $emailvalidcode, 'name' => $request->name])['result'];

        //Send code to mail
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
        $data = array('email' => $request->email, 'body' => $text, 'smtp_user' => $smtp_user, 'name' => $request->name, 'system_email' => $settings->system_email, 'system_owner' => $settings->system_owner, 'subject' => $settings->system_owner . " - confirmation code");

        Mail::send(array(), array('data' => $data), function ($message) use ($data) {
            $message->from($data["system_email"], $data["system_owner"]);
            $message->sender($data["smtp_user"]);
            $message->to($data['email'], $data['name']);
            $message->replyTo($data['system_email']);
            $message->subject($data['subject']);
            $message->priority(3);
            $message->setBody($data['body'], 'text/html');
        });


        $response_array = ['success' => true];
        $response = response()->json($response_array, 200);
        return $response;
    }

    public function mailconfirm(Request $request)
    {
        $emailvalidcode = $this->generateUniqueKey();
        $emailValidator = Validator::make(
            $request->all(), [
                'email' => 'required|unique:users,email'
            ]
        );
        if ($emailValidator->fails()) {
            return response()->json(['error' => 'EMAIL_ALREADY_EXISTS'], 401);
        } else {
            $user_mail = new MailActivations;
            $check_copy = $user_mail::where('email', $request->email)->first();
            if ($check_copy) {
                $check_copy->delete();
            }
            $user_mail->email = $request->email;
            $user_mail->email_activation_code = $emailvalidcode;
            $user_mail->save();
            $array = [
                'success' => true,
                //'code' => $emailvalidcode
            ];

            $lang_id = DB::table('languages')->where('code', $request->language)->select('id')->get()[0]->id;
            $source_text = (DB::table('static_pages')
                ->where('code', '=', 'MAIL_ACTIVATION_CODE')
                ->where('lang_id', $lang_id)
                ->select('content')
                ->get())[0]->content;
            $template = new Template();
            $text = $template->replaceMacros($source_text, ['code' => $emailvalidcode, 'name' => $request->name])['result'];

            //Send code to mail
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
            $data = array('email' => $request->email, 'body' => $text, 'smtp_user' => $smtp_user, 'name' => $request->name, 'system_email' => $settings->system_email, 'system_owner' => $settings->system_owner, 'subject' => $settings->system_owner . " - confirmation code");

            Mail::send(array(), array('data' => $data), function ($message) use ($data) {
                $message->from($data["system_email"], $data["system_owner"]);
                $message->sender($data["smtp_user"]);
                $message->to($data['email'], $data['name']);
                $message->replyTo($data['system_email']);
                $message->subject($data['subject']);
                $message->priority(3);
                $message->setBody($data['body'], 'text/html');
            });


            $response_array = Helper::null_safe($array);
            $response = response()->json($response_array, 200);

            return $response;
        }
    }

    public function generateUniqueKey($suffix = null)
    {
        if (isset($suffix)) {
            $num_segments = 1;
            $segment_chars = 6;
        } else {
            $num_segments = 1;
            $segment_chars = 6;
        }
        $tokens = '123456789';
        $license_string = '';
        for ($i = 0; $i < $num_segments; $i++) {
            $segment = '';
            for ($j = 0; $j < $segment_chars; $j++) {
                $segment .= $tokens[rand(0, strlen($tokens) - 1)];
            }
            $license_string .= $segment;
            if ($i < ($num_segments - 1)) {
                $license_string .= '-';
            }
        }
        if (isset($suffix)) {
            if (is_numeric($suffix)) {
                $license_string .= '-' . strtoupper(base_convert($suffix, 10, 36));
            } else {
                $long = sprintf("%u\n", ip2long($suffix), true);
                if ($suffix === long2ip($long)) {
                    $license_string .= '-' . strtoupper(base_convert($long, 10, 36));
                } else {
                    $license_string .= '-' . strtoupper(str_ireplace(' ', '-', $suffix));
                }
            }
        }
        return $license_string;
    }

    public function reset_password(Request $request)
    {
        $postData = request(['email', 'language']);
        if ($this->validateEmail($postData['email'])) {

            //Reset password
            $pwd = Str::random(9);

            $user = User::whereEmail($postData['email'])->first();
            $user->update(['password' => $pwd]);

            $this->sendRestoreLink($postData['email'], $pwd);
            return response()->json(['message' => "NEW_PASSWORD_SEND_TO_EMAIL"]);
        } else {
            return response()->json(['error' => 'EMAIL_NOT_FOUND'], 401);
        }

    }

    /**
     * send restore email
     *
     * @param $email user email
     * @param $pwd user new password
     *
     * @return boolean
     */
    public function sendRestoreLink($email, $pwd)
    {
        $user = User::whereEmail($email)->first();
        $lang_code = $user->default_language;
        $lang_id = DB::table('languages')->where('code', $lang_code)->select('id')->get()[0]->id;
        $source_text = DB::table('static_pages')
            ->where('code', '=', 'MAIL_RESTORE_PASSWORD_TEMPLATE')
            ->where('lang_id', $lang_id)
            ->select('content')
            ->get()[0]->content;
        $template = new Template();
        $text = $template->replaceMacros($source_text, ['name' => $user->name, 'new_password' => $pwd])['result'];

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


//        Config::set('mail.host', $settings->smtp_host);
//        Config::set('mail.port', $settings->smtp_port);
//        Config::set('mail.username', $settings->smtp_user);
//        Config::set('mail.password', $settings->smtp_password);

        $data = array('email' => $email, 'name' => $user->name, 'pwd' => $pwd, 'body' => $text, 'smtp_user' => $smtp_user, 'system_email' => $settings->system_email, 'system_owner' => $settings->system_owner, "subject" => $settings->system_owner . " - restore password");
        Mail::send(array(), array('data' => $data), function ($message) use ($data) {
            $message->from($data["system_email"], $data["system_owner"]);
            $message->sender($data["smtp_user"]);
            $message->to($data['email'], $data['name']);
            $message->replyTo($data['system_email']);
            $message->subject($data['subject']);
            $message->priority(3);
            $message->setBody($data['body'], 'text/html');
        });
    }

    /**
     * Send signup email.
     *
     * @param $lang_code current language code
     * @param $name user name
     * @param $email user email
     * @param $password user password
     */
    function sendSignupEmail($lang_code, $name, $email, $password)
    {
        $lang_id = DB::table('languages')->where('code', $lang_code)->select('id')->get()[0]->id;
        $source_text = (DB::table('static_pages')
            ->where('code', '=', 'MAIL_REGISTRATION_TEMPLATE')
            ->where('lang_id', $lang_id)
            ->select('content')
            ->get())[0]->content;
        $template = new Template();
        $text = $template->replaceMacros($source_text, ['name' => $name, 'password' => $password, 'email' => $email])['result'];

        $settings = SystemSettings::first();
        $smtp_user = $settings->smtp_user;

        /*config([
            'mail.host' => $settings->smtp_host,
            'mail.port' => $settings->smtp_port,
            'mail.username' => $settings->smtp_user,
            'mail.password' => $settings->smtp_password
        ]);*/

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


        $data = array('email' => $email, 'name' => $name, 'password' => $password, 'body' => $text, 'smtp_user' => $smtp_user, 'system_email' => $settings->system_email, 'system_owner' => $settings->system_owner, 'subject' => $settings->system_owner . " - Registration email");
        Mail::send(array(), array('data' => $data), function ($message) use ($data) {
            $message->from($data["system_email"], $data["system_owner"]);
            $message->sender($data["smtp_user"]);
            $message->to($data['email'], $data['name']);
            $message->replyTo($data['system_email']);
            $message->subject($data['subject']);
            $message->priority(3);
            $message->setBody($data["body"], 'text/html');
        });
    }

    /**
     * Check if user with this email is exists
     *
     * @param string $email
     *
     * @return boolean
     */
    public function validateEmail($email)
    {
        return !!User::where('email', $email)->first();
    }

    /**
     * Get the token array structure.
     *
     * @param string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => auth()->user()
        ]);
    }

    /**
     * Login user from google.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function googleLogin(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'name' => 'required',
                'email' => 'required',
                'idToken' => 'required'
            )
        );
        if ($validator->fails()) {
            $error_message = implode(',', $validator->messages()->all());
            $response = response()->json($error_message);
        } else {
            $client_id = DB::table('system_settings')->first();
            $client_id = $client_id->google_web_client_id;

            $client = new Google_Client(['client_id' => $client_id]);
            $payload = $client->verifyIdToken($request['idToken']);

            if ($payload) {
                $isUserExists = DB::table('users')->where('email', $request['email'])->first();

                $request['password'] = Str::random(20);

                if (!$isUserExists) {
                    $user = new User;
                    $user->name = $request->name;
                    $user->email = $request->email;
                    $user->password = $request->password;
                    $user->user_type_id = 2;
                    $user->remember_token = Helper::generate_token();
                    $user->save();
                    $user->setDefaultAvatar();

                    $log = new ActivityLog();
                    $log->setActivityLog(0, 0, 'CREATE_NEW_USER', $user);
                }

                $credentials = request(['email', 'password']);

                if (!$isUserExists) {
                    if (!$token = auth()->setTTL(7200)->attempt($credentials)) {
                        $response = response()->json(['error' => 'USER_NOT_FOUND'], 401);
                    } else {
                        $response = $this->respondWithToken($token);
                    }
                } else {

                    $user = $user = User::where('email', $request['email'])->first();
                    if (!$token = auth()->login($user)) {
                        $response = response()->json(['error' => 'USER_NOT_FOUND'], 401);
                    } else {
                        $response = $this->respondWithToken($token);
                    }
                }


            } else {
                $response = response()->json(['error' => 'INVALID_ID_TOKEN'], 401);
            }
        }
        return $response;
    }

}
