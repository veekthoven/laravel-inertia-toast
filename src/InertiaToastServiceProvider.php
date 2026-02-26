<?php

namespace InertiaToast;

use Illuminate\Support\ServiceProvider;

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
    }
}
