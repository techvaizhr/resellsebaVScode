<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Gate;

class PermissionMiddleware
{
    public function handle(Request $request, Closure $next, $permission): Response
    {
        if (!$request->user() || !Gate::allows($permission)) {
            return response()->json(['message' => 'Unauthorized. Missing Permission.'], 403);
        }

        return $next($request);
    }
}
