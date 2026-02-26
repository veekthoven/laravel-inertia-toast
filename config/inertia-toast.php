<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Duration
    |--------------------------------------------------------------------------
    |
    | The default duration (in milliseconds) before a toast auto-dismisses.
    | This is sent to the frontend and can be overridden per-toast.
    |
    */
    'duration' => 5000,

    /*
    |--------------------------------------------------------------------------
    | Default Position
    |--------------------------------------------------------------------------
    |
    | Where toasts appear on screen. Options: top-right, top-left, top-center,
    | bottom-right, bottom-left, bottom-center.
    |
    */
    'position' => 'top-right',

    /*
    |--------------------------------------------------------------------------
    | Max Visible Toasts
    |--------------------------------------------------------------------------
    |
    | The maximum number of toasts visible at once. Oldest toasts are removed
    | first when the limit is exceeded.
    |
    */
    'max_visible' => 5,

    /*
    |--------------------------------------------------------------------------
    | Inertia Flash Key
    |--------------------------------------------------------------------------
    |
    | The key used when flashing toast data via Inertia::flash().
    |
    */
    'prop_key' => 'toasts',

];
