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

// 2. Dynamic PWA Web Manifest (Uses Admin Settings Favicon & Site Name)
if (isset($_GET['manifest']) || str_ends_with(parse_url($uri, PHP_URL_PATH) ?? '', 'manifest.webmanifest')) {
    header('Content-Type: application/manifest+json; charset=utf-8');
    header('Cache-Control: public, max-age=60');
    require_once __DIR__ . '/standalone_backup.php';

    $siteName = 'ResellSeba';
    $shortName = 'ResellSeba';
    $primaryColor = '#4f46e5';
    $faviconUrl = null;

    try {
        $pdo = get_pdo();
        // Check key-value rows
        $stmt = $pdo->prepare("SELECT `key`, `value` FROM `global_settings` WHERE `key` IN ('favicon_url', 'site_name', 'primary_color')");
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
        if (!empty($rows)) {
            if (!empty($rows['favicon_url'])) {
                $dec = json_decode($rows['favicon_url'], true);
                $faviconUrl = $dec ?: trim($rows['favicon_url'], '"');
            }
            if (!empty($rows['site_name'])) {
                $dec = json_decode($rows['site_name'], true);
                $siteName = $dec ?: trim($rows['site_name'], '"');
                $shortName = mb_substr($siteName, 0, 12);
            }
            if (!empty($rows['primary_color'])) {
                $dec = json_decode($rows['primary_color'], true);
                $primaryColor = $dec ?: trim($rows['primary_color'], '"');
            }
        } else {
            // Check column-based table
            $cStmt = $pdo->query("SELECT * FROM `global_settings` LIMIT 1");
            $cRow = $cStmt->fetch(PDO::FETCH_ASSOC);
            if ($cRow) {
                if (!empty($cRow['favicon_url'])) $faviconUrl = $cRow['favicon_url'];
                if (!empty($cRow['site_name'])) {
                    $siteName = $cRow['site_name'];
                    $shortName = mb_substr($siteName, 0, 12);
                }
                if (!empty($cRow['primary_color'])) $primaryColor = $cRow['primary_color'];
            }
        }
    } catch (\Throwable $e) {}

    if ($faviconUrl) {
        $icons = [
            [
                'src' => $faviconUrl,
                'sizes' => '192x192',
                'type' => 'image/png',
                'purpose' => 'any'
            ],
            [
                'src' => $faviconUrl,
                'sizes' => '512x512',
                'type' => 'image/png',
                'purpose' => 'any'
            ],
            [
                'src' => $faviconUrl,
                'sizes' => '512x512',
                'type' => 'image/png',
                'purpose' => 'maskable'
            ]
        ];
    } else {
        $icons = [
            [
                'src' => '/favicon.ico',
                'sizes' => '64x64 32x32 24x24 16x16',
                'type' => 'image/x-icon'
            ],
            [
                'src' => '/icon-192.png',
                'sizes' => '192x192',
                'type' => 'image/png',
                'purpose' => 'any'
            ],
            [
                'src' => '/icon-512.png',
                'sizes' => '512x512',
                'type' => 'image/png',
                'purpose' => 'any'
            ],
            [
                'src' => '/icon-512.png',
                'sizes' => '512x512',
                'type' => 'image/png',
                'purpose' => 'maskable'
            ]
        ];
    }

    echo json_encode([
        'name' => $siteName . ' - Reseller Platform',
        'short_name' => $shortName,
        'description' => 'Bangladesh premier reseller platform. Start your online business with zero investment.',
        'start_url' => '/',
        'scope' => '/',
        'display' => 'standalone',
        'orientation' => 'portrait-primary',
        'background_color' => '#ffffff',
        'theme_color' => $primaryColor,
        'icons' => $icons,
        'categories' => ['shopping', 'business', 'productivity']
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    exit;
}

// 3. Backup & Restore engine
if (str_contains($uri, 'admin/backup')) {
    require_once __DIR__ . '/standalone_backup.php';
    handle_backup_request();
    exit;
}


// 4. Standalone Pure-PHP Engine (Fast, zero-dependency, matches production)

// 4. Standalone Pure-PHP Engine (Zero Composer Dependencies Needed!)
require_once __DIR__ . '/standalone_engine.php';
handle_standalone_request();
