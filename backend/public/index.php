<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Check if Composer autoloader exists
if (!file_exists(__DIR__.'/../vendor/autoload.php')) {
    header('Content-Type: application/json', true, 503);
    echo json_encode([
        'error' => 'backend/vendor/autoload.php not found. Please run "composer install" inside the backend directory on cPanel.',
        'php_version' => PHP_VERSION,
    ]);
    exit;
}
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->handleRequest(Request::capture());
