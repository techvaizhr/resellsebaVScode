<?php

error_reporting(E_ALL);
ini_set('display_errors', '1');

// Quick diagnostic check: visit /api/test
$uri = $_SERVER['REQUEST_URI'] ?? '';
if (isset($_GET['test']) || str_starts_with($uri, '/api/test')) {
    header('Content-Type: application/json');
    $disabled = explode(',', ini_get('disable_functions') ?: '');
    $disabled = array_map('trim', $disabled);

    $dbStatus = 'untested';
    $dbError = null;
    $tablesCount = 0;
    try {
        require_once __DIR__ . '/standalone_backup.php';
        $pdo = get_pdo();
        $stmt = $pdo->query("SHOW FULL TABLES WHERE Table_type = 'BASE TABLE'");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        $tablesCount = count($tables);
        $dbStatus = 'connected_ok';
    } catch (\Throwable $e) {
        $dbStatus = 'connection_failed';
        $dbError = $e->getMessage();
    }

    $nodevenv = [];
    $nodeDir = '/home/zhroni367/nodevenv';
    if (is_dir($nodeDir)) {
        $nodevenv = scandir($nodeDir);
    }

    $petzavoNode = [];
    $pDir = '/home/zhroni367/nodevenv/petzavo.com';
    if (is_dir($pDir)) {
        $petzavoNode = scandir($pDir);
    }

    echo json_encode([
        'status' => 'ok',
        'php_version' => PHP_VERSION,
        'db_status' => $dbStatus,
        'db_tables_count' => $tablesCount,
        'db_error' => $dbError,
        'nodevenv' => $nodevenv,
        'petzavo_node' => $petzavoNode,
        'vendor_exists' => file_exists(__DIR__ . '/../backend/vendor/autoload.php'),
        'bootstrap_exists' => file_exists(__DIR__ . '/../backend/bootstrap/app.php'),
        'env_exists' => file_exists(__DIR__ . '/../backend/.env'),
        'pdo_mysql' => extension_loaded('pdo_mysql'),
        'zip' => extension_loaded('zip'),
        'exec_enabled' => function_exists('exec') && !in_array('exec', $disabled),
        'shell_exec_enabled' => function_exists('shell_exec') && !in_array('shell_exec', $disabled),
    ]);
    exit;
}

// If request is for Admin Backup, handle it via standalone engine
if (str_contains($uri, 'admin/backup')) {
    require_once __DIR__ . '/standalone_backup.php';
    exit;
}

define('LARAVEL_START', microtime(true));

// Check if Composer autoloader exists
$vendorAutoload = __DIR__ . '/../backend/vendor/autoload.php';
if (!file_exists($vendorAutoload)) {
    header('Content-Type: application/json', true, 503);
    echo json_encode([
        'error' => 'backend/vendor/autoload.php not found. Please run "composer install" inside the backend directory on cPanel.',
        'php_version' => PHP_VERSION,
    ]);
    exit;
}

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../backend/storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require $vendorAutoload;

// Bootstrap Laravel and handle the request...
try {
    $app = require_once __DIR__.'/../backend/bootstrap/app.php';
    $app->handleRequest(\Illuminate\Http\Request::capture());
} catch (\Throwable $e) {
    header('Content-Type: application/json', true, 500);
    echo json_encode([
        'error' => 'Laravel bootstrap error',
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => explode("\n", $e->getTraceAsString()),
    ]);
    exit;
}
