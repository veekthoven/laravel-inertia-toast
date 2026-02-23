<?php

namespace InertiaToast\Facades;

use Illuminate\Support\Facades\Facade;
use InertiaToast\Toaster;

/**
 * @method static \InertiaToast\Toaster success(string $message, ?int $duration = null)
 * @method static \InertiaToast\Toaster error(string $message, ?int $duration = null)
 * @method static \InertiaToast\Toaster info(string $message, ?int $duration = null)
 * @method static \InertiaToast\Toaster warning(string $message, ?int $duration = null)
 * @method static \InertiaToast\Toaster add(string $message, \InertiaToast\Enums\ToastLevel $level, ?int $duration = null)
 * @method static void flash()
 * @method static array read()
 * @method static string getSessionKey()
 * @method static string getPropKey()
 * @method static bool hasPending()
 *
 * @see \InertiaToast\Toaster
 */
class Toast extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return Toaster::class;
    }
}
