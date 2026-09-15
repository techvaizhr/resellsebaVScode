<?php

error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
ini_set('display_errors', '0');

$uri = $_SERVER['REQUEST_URI'] ?? '';

// 1. Diagnostics endpoint (/api/test)
if (isset($_GET['test']) || str_starts_with($uri, '/api/test')) {
    header('Content-Type: application/json; charset=utf-8');
    require_once __DIR__ . '/standalone_backup.php';
    try {
        $pdo = get_pdo();
        $stmt = $pdo->query("SHOW FULL TABLES WHERE Table_type = 'BASE TABLE'");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        $dbStatus = 'connected_ok';
        $tablesCount = count($tables);
        $dbError = null;
    } catch (\Throwable $e) {
        $dbStatus = 'connection_failed';
        $tablesCount = 0;
        $dbError = $e->getMessage();
    }

    $vendorExists = file_exists(__DIR__ . '/../backend/vendor/autoload.php');

    echo json_encode([
        'status' => 'ok',
        'php_version' => PHP_VERSION,
        'db_status' => $dbStatus,
        'db_tables_count' => $tablesCount,
        'db_error' => $dbError,
        'vendor_exists' => $vendorExists,
        'engine' => $vendorExists ? 'laravel' : 'standalone_pure_php',
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// 2. Backup & Restore engine
if (str_contains($uri, 'admin/backup')) {
    require_once __DIR__ . '/standalone_backup.php';
    handle_backup_request();
    exit;
}


// 4. Standalone Pure-PHP Engine (Fast, zero-dependency, matches production)

// 4. Standalone Pure-PHP Engine (Zero Composer Dependencies Needed!)
require_once __DIR__ . '/standalone_engine.php';
handle_standalone_request();
