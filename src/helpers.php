<?php

use InertiaToast\PendingToast;
use InertiaToast\Toaster;

if (! function_exists('toast')) {
    /**
     * Create a toast notification.
     *
     * When called with a message, returns a PendingToast builder.
     * When called without arguments, returns the Toaster instance.
     */
    function toast(?string $message = null): PendingToast|Toaster
    {
        $toaster = app(Toaster::class);

        if ($message === null) {
            return $toaster;
        }

        return new PendingToast($message, $toaster);
    }
}
