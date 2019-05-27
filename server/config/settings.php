<?php

use Illuminate\Support\Str;

return [

    /*
    |--------------------------------------------------------------------------
    | Main Application Settings
    |--------------------------------------------------------------------------
    |
    | This option controls the default session "driver" that will be used on
    | requests. By default, we will use the lightweight native driver but
    | you may specify any of the other wonderful drivers provided here.
    |
    | Supported: "file", "cookie", "database", "apc",
    |            "memcached", "redis", "dynamodb", "array"
    |
    */

    'app_env' => env('APP_ENV', 'development'),

    /*
    |--------------------------------------------------------------------------
    | Twilio Application Settings
    |--------------------------------------------------------------------------
    |
    | This option controls the default session "driver" that will be used on
    | requests. By default, we will use the lightweight native driver but
    | you may specify any of the other wonderful drivers provided here.
    |
    |
    */

    'twilio_sid' => env('TWILIO_SID'),
    'twilio_app_sid' => env('TWILIO_APP_SID'),
    'twilio_auth_token' => env('TWILIO_AUTH_TOKEN'),
    'twilio_phone_number' => env('TWILIO_PHONE_NUMBER'),

];
