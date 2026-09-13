<?php

return [
    'steadfast' => [
        'api_key' => env('STEADFAST_API_KEY'),
        'secret_key' => env('STEADFAST_SECRET_KEY'),
    ],
    'pathao' => [
        'client_id' => env('PATHAO_CLIENT_ID'),
        'client_secret' => env('PATHAO_CLIENT_SECRET'),
        'username' => env('PATHAO_USERNAME'),
        'password' => env('PATHAO_PASSWORD'),
    ],
    'carrybee' => [
        'api_key' => env('CARRYBEE_API_KEY'),
    ],
    'cloudflare' => [
        'api_key' => env('CLOUDFLARE_API_KEY'),
        'email' => env('CLOUDFLARE_EMAIL'),
        'zone_id' => env('CLOUDFLARE_ZONE_ID'),
    ],
    'sms' => [
        'provider' => env('SMS_PROVIDER', 'mock'),
        'api_key' => env('SMS_API_KEY'),
        'sender_id' => env('SMS_SENDER_ID'),
    ],
    'sslcommerz' => [
        'store_id' => env('SSLCOMMERZ_STORE_ID'),
        'store_password' => env('SSLCOMMERZ_STORE_PASSWORD'),
        'sandbox' => env('SSLCOMMERZ_SANDBOX', true),
    ],
];
