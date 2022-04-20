<?php

namespace App\Http\Controllers\Mobile;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\ApplicationUser;
use App\Models\SystemSettings;
use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Validator;

class AuthMobileController extends Controller
{
    /**
     * Login application user.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function login(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'mail' => 'required',
                'password' => 'required',
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
                $credentials = ['mail'=> $request['mail'], 'password' => $request['password'], 'app_id' => $app->id];
                Config::set('auth.providers.users.model', ApplicationUser::class);

                if (!$token = auth()->attempt($credentials)) {
                    return response()->json(['error' => 'USER_NOT_FOUND'], 401);
                }

                return $this->respondWithToken($token);
            }
        }

        return $response;
    }

    /**
     * Logout application user.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function logout(Request $request) {
        Config::set('auth.providers.users.model', ApplicationUser::class);

        auth()->logout();

        return response()->json(['message' => 'LOGOUT_OK']);
    }

    /**
     * Registration new application user.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function register(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            array(
                'mail' => 'required',
                'password' => 'required',
                'sb'  => 'required',
                'name'  => 'required',
                'lastname'  => 'required'
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
                $user = new ApplicationUser();
                $user->name = $request['name'];
                $user->lastname = $request['lastname'];
                $user->mail = $request['mail'];
                $user->app_id = $app->id;
                $user->password = $request['password'];
                $user->save();

                return $this->login($request);
            }
        }

        return $response;
    }

    /**
     * Reset application user password.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function reset_password(Request $request) {
        $validator = Validator::make(
            $request->all(),
            array(
                'mail' => 'required',
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
                $user = ApplicationUser::where('mail', $request['mail'])->where('app_id', $app->id)->first();
                if ($user) {
                    $pwd = Str::random(9);

                    $user->update(['password'=>$pwd]);

                    $this->sendRestoreLink($request['mail'], $pwd, $app);

                    $response = response()->json(['message' => "NEW_PASSWORD_SEND_TO_EMAIL"]);
                } else {
                    $response = response()->json(['error' => 'EMAIL_NOT_FOUND'], 403);
                }
            }
        }

        return $response;
    }

    /**
     * Send restore email.
     *
     * @param $mail
     * @param $pwd
     * @param $app
     */
    public function sendRestoreLink($mail, $pwd, $app) {
        $user = ApplicationUser::where('mail', $mail)->first();
        $lang_code = $app->default_language;
        $lang_id = DB::table('application_languages')->where('code', $lang_code)->where('app_id', $app->id)->select('id')->get()[0]->id;

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

        $data = array('email'=>$mail, 'name'=>$user->name, 'pwd'=>$pwd, 'body'=>$text, 'smtp_user' => $smtp_user, "system_email"=>$settings->system_email, "subject" =>$settings->system_owner . " - restore password");
        Mail::send(array(), array('data' => $data), function ($message) use ($data) {
            $message->from($data["smtp_user"]);
            $message->sender($data["smtp_user"]);
            $message->to($data['email'], $data['name']);
            $message->replyTo($data['system_email']);
            $message->subject($data['subject']);
            $message->priority(3);
            $message->setBody($data['body'],'text/html');
        });

    }

    /**
     * Check if user authorized.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    function isUserLogin(Request $request) {
        Config::set('auth.providers.users.model', ApplicationUser::class);

        $response = response()->json(['isLogin' => auth()->check()]);

        return $response;
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
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
}
