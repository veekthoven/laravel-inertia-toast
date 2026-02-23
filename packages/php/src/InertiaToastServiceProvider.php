<?php

namespace InertiaToast;

use Illuminate\Contracts\Http\Kernel;
use Illuminate\Support\ServiceProvider;
use InertiaToast\Middleware\ShareToasts;

class InertiaToastServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__.'/../config/inertia-toast.php', 'inertia-toast');

        $this->app->singleton(Toaster::class);
    }

    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__.'/../config/inertia-toast.php' => config_path('inertia-toast.php'),
            ], 'inertia-toast-config');
        }

        $this->registerMiddleware();
    }

    protected function registerMiddleware(): void
    {
        /** @var Kernel $kernel */
        $kernel = $this->app->make(Kernel::class);

        $kernel->pushMiddleware(ShareToasts::class);
    }
}
