<?php

namespace App\Http\Middleware;

use App\Models\Application;
use Closure;
use Illuminate\Http\Request;

class VerifyAppToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if ($this->verify($request)) {

            return $next($request);
        }

        return response()->json( [ 'error' => 'Unauthorized' ], 403 );
    }

    public function verify( $request ) {
        $token  = $request->bearerToken();

        return Application::where('token_key', $token)->exists();
    }
}
