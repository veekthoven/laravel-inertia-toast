<?php

namespace InertiaToast\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use InertiaToast\Toaster;
use Symfony\Component\HttpFoundation\Response;

class ShareToasts
{
    public function __construct(protected Toaster $toaster) {}

    public function handle(Request $request, Closure $next): Response
    {
        Inertia::share($this->toaster->getPropKey(), function () {
            $this->toaster->flash();

            $toasts = $this->toaster->read();

            return ! empty($toasts) ? $toasts : null;
        });

        $response = $next($request);

        if ($this->isRedirect($response)) {
            $this->toaster->flash();
            $request->session()->keep($this->toaster->getSessionKey());
        }

        return $response;
    }

    protected function isRedirect(Response $response): bool
    {
        return $response->getStatusCode() >= 300 && $response->getStatusCode() < 400;
    }
}
