<?php
/**
 * Standalone Backup & Restore Engine for ResellSeba
 * 
 * Works 100% in pure PHP — NO Composer vendor dependencies required.
 * Allows database SQL dump/restore and uploads ZIP backup/restore directly on cPanel.
 */

error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
ini_set('display_errors', '0');

function get_env_map() {
    static $env = null;
    if ($env !== null) return $env;
    $env = [];
    $candidates = [
        __DIR__ . '/../backend/.env',
        __DIR__ . '/../.env',
        __DIR__ . '/../backend/.env.example',
    ];
    foreach ($candidates as $envFile) {
        if (file_exists($envFile)) {
            $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                $line = trim($line);
                if ($line === '' || str_starts_with($line, '#')) continue;
                if (str_contains($line, '=')) {
                    list($key, $val) = explode('=', $line, 2);
                    $key = trim($key);
                    $val = trim($val);
                    if ((str_starts_with($val, '"') && str_ends_with($val, '"')) ||
                        (str_starts_with($val, "'") && str_ends_with($val, "'"))) {
                        $val = substr($val, 1, -1);
                    }
                    if (!isset($env[$key])) {
                        $env[$key] = $val;
                    }
                }
            }
        }
    }
    return $env;
}

function get_pdo() {
    $env = get_env_map();
    $host = $env['DB_HOST'] ?? '127.0.0.1';
    $port = $env['DB_PORT'] ?? '3306';
    $db   = $env['DB_DATABASE'] ?? '';
    $user = $env['DB_USERNAME'] ?? 'root';
    $pass = $env['DB_PASSWORD'] ?? '';

    if (empty($db) || $pass === 'YOUR_DB_PASSWORD_HERE') {
        throw new Exception("Please configure DB_DATABASE, DB_USERNAME, and DB_PASSWORD in backend/.env");
    }

    $dsn = "mysql:host={$host};port={$port};dbname={$db};charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    return new PDO($dsn, $user, $pass, $options);
}

function get_backup_dir() {
    $dir = __DIR__ . '/../backend/storage/app/backups';
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
        @file_put_contents($dir . '/.htaccess', "Deny from all\n");
    }
    return realpath($dir) ?: $dir;
}

function get_uploads_dir() {
    $candidates = [
        __DIR__ . '/../public/uploads',
        __DIR__ . '/../dist/client/uploads',
        __DIR__ . '/../backend/public/uploads',
    ];
    foreach ($candidates as $c) {
        if (is_dir($c)) return realpath($c) ?: $c;
    }
    $def = __DIR__ . '/../public/uploads';
    @mkdir($def, 0755, true);
    return realpath($def) ?: $def;
}

function format_bytes($bytes, $precision = 2) {
    $units = ['B', 'KB', 'MB', 'GB', 'TB'];
    $bytes = max($bytes, 0);
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
    $pow = min($pow, count($units) - 1);
    $bytes /= pow(1024, $pow);
    return round($bytes, $precision) . ' ' . $units[$pow];
}

function json_out($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
    exit;
}

// Request path parsing
$requestUri = $_SERVER['REQUEST_URI'] ?? '';
$path = parse_url($requestUri, PHP_URL_PATH);
$path = preg_replace('#^/api/#', '', ltrim($path, '/'));
$path = preg_replace('#^admin/backup/#', '', $path);
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// -------------------------------------------------------------
// 1. LIST BACKUPS: GET admin/backup/list
// -------------------------------------------------------------
if ($path === 'list' && $method === 'GET') {
    $backupDir = get_backup_dir();
    $items = [];
    $totalBackupBytes = 0;

    if (is_dir($backupDir)) {
        $files = scandir($backupDir);
        foreach ($files as $f) {
            if ($f === '.' || $f === '..' || $f === '.htaccess' || $f === '.gitignore') continue;
            $fullPath = $backupDir . '/' . $f;
            if (!is_file($fullPath)) continue;

            $size = filesize($fullPath);
            $totalBackupBytes += $size;
            $ext = strtolower(pathinfo($f, PATHINFO_EXTENSION));
            $mtime = filemtime($fullPath);

            $type = 'database';
            if (str_starts_with($f, 'images_') || str_starts_with($f, 'media_') || str_starts_with($f, 'uploads_') || $ext === 'zip') {
                $type = 'files';
            }

            $items[] = [
                'filename' => $f,
                'type' => $type,
                'extension' => $ext,
                'size' => format_bytes($size),
                'size_bytes' => $size,
                'created_at' => date('d M Y, h:i A', $mtime),
                'created_at_raw' => $mtime,
            ];
        }
    }

    // Sort newest first
    usort($items, fn($a, $b) => $b['created_at_raw'] <=> $a['created_at_raw']);

    // Measure DB size if possible
    $dbSizeMb = 0;
    try {
        $pdo = get_pdo();
        $env = get_env_map();
        $dbName = $env['DB_DATABASE'] ?? '';
        if ($dbName) {
            $stmt = $pdo->prepare("SELECT SUM(data_length + index_length) / 1024 / 1024 AS size_mb FROM information_schema.TABLES WHERE table_schema = ?");
            $stmt->execute([$dbName]);
            $row = $stmt->fetch();
            if ($row && isset($row['size_mb'])) {
                $dbSizeMb = round((float) $row['size_mb'], 2);
            }
        }
    } catch (\Throwable $e) {
        $dbSizeMb = 0;
    }

    // Measure Uploads size
    $uploadsDir = get_uploads_dir();
    $uploadBytes = 0;
    $uploadFilesCount = 0;
    if (is_dir($uploadsDir)) {
        $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($uploadsDir, FilesystemIterator::SKIP_DOTS));
        foreach ($it as $file) {
            if ($file->isFile()) {
                $uploadBytes += $file->getSize();
                $uploadFilesCount++;
            }
        }
    }

    json_out([
        'ok' => true,
        'backups' => $items,
        'stats' => [
            'total_backups' => count($items),
            'total_backup_size' => format_bytes($totalBackupBytes),
            'total_backup_bytes' => $totalBackupBytes,
            'db_size_mb' => $dbSizeMb,
            'uploads_size' => format_bytes($uploadBytes),
            'uploads_bytes' => $uploadBytes,
            'uploads_files_count' => $uploadFilesCount,
        ],
    ]);
}

// -------------------------------------------------------------
// 2. CREATE DB BACKUP: POST admin/backup/create-db
// -------------------------------------------------------------
if ($path === 'create-db' && $method === 'POST') {
    @set_time_limit(1800);
    @ini_set('memory_limit', '512M');

    try {
        $pdo = get_pdo();
        $env = get_env_map();
        $dbName = $env['DB_DATABASE'] ?? '';

        $backupDir = get_backup_dir();
        $filename = 'db_backup_' . date('Y-m-d_His') . '.sql';
        $filePath = $backupDir . '/' . $filename;

        $handle = fopen($filePath, 'w+');
        if (!$handle) {
            json_out(['ok' => false, 'error' => 'Unable to write backup file on server.'], 500);
        }

        fwrite($handle, "-- ResellSeba Master Database Backup\n");
        fwrite($handle, "-- Database: {$dbName}\n");
        fwrite($handle, "-- Generated: " . date('Y-m-d H:i:s') . "\n\n");
        fwrite($handle, "SET FOREIGN_KEY_CHECKS=0;\n");
        fwrite($handle, "SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';\n");
        fwrite($handle, "START TRANSACTION;\n");
        fwrite($handle, "SET NAMES utf8mb4;\n\n");

        $stmt = $pdo->query('SHOW FULL TABLES WHERE Table_type = "BASE TABLE"');
        $rawTables = $stmt->fetchAll(PDO::FETCH_NUM);

        foreach ($rawTables as $r) {
            $tableName = $r[0];
            fwrite($handle, "\n-- Table: `{$tableName}`\n");
            fwrite($handle, "DROP TABLE IF EXISTS `{$tableName}`;\n");

            $createStmt = $pdo->query("SHOW CREATE TABLE `{$tableName}`");
            $createRow = $createStmt->fetch(PDO::FETCH_NUM);
            if (!empty($createRow[1])) {
                fwrite($handle, $createRow[1] . ";\n\n");
            }

            // Dump data in chunks of 250 rows
            $dataStmt = $pdo->query("SELECT * FROM `{$tableName}`");
            $rowsChunk = [];

            while ($row = $dataStmt->fetch(PDO::FETCH_ASSOC)) {
                $escaped = array_map(function($v) use ($pdo) {
                    if ($v === null) return 'NULL';
                    return $pdo->quote($v);
                }, $row);
                $rowsChunk[] = '(' . implode(', ', $escaped) . ')';

                if (count($rowsChunk) >= 250) {
                    $cols = array_map(fn($c) => "`{$c}`", array_keys($row));
                    fwrite($handle, "INSERT INTO `{$tableName}` (" . implode(', ', $cols) . ") VALUES\n" . implode(",\n", $rowsChunk) . ";\n");
                    $rowsChunk = [];
                }
            }

            if (!empty($rowsChunk)) {
                $firstRow = $pdo->query("SELECT * FROM `{$tableName}` LIMIT 1")->fetch(PDO::FETCH_ASSOC);
                if ($firstRow) {
                    $cols = array_map(fn($c) => "`{$c}`", array_keys($firstRow));
                    fwrite($handle, "INSERT INTO `{$tableName}` (" . implode(', ', $cols) . ") VALUES\n" . implode(",\n", $rowsChunk) . ";\n");
                }
            }
        }

        fwrite($handle, "\nCOMMIT;\nSET FOREIGN_KEY_CHECKS=1;\n");
        fclose($handle);

        $size = filesize($filePath);
        json_out([
            'ok' => true,
            'message' => 'Database backup created successfully!',
            'filename' => $filename,
            'size' => format_bytes($size),
        ]);
    } catch (\Throwable $e) {
        json_out(['ok' => false, 'error' => $e->getMessage()], 500);
    }
}

// -------------------------------------------------------------
// 3. CREATE FILES BACKUP: POST admin/backup/create-files
// -------------------------------------------------------------
if ($path === 'create-files' && $method === 'POST') {
    @set_time_limit(1800);
    @ini_set('memory_limit', '512M');

    if (!class_exists('ZipArchive')) {
        json_out(['ok' => false, 'error' => 'ZipArchive PHP extension is not installed on this server.'], 500);
    }

    try {
        $uploadsDir = get_uploads_dir();
        $backupDir = get_backup_dir();
        $filename = 'media_backup_' . date('Y-m-d_His') . '.zip';
        $zipPath = $backupDir . '/' . $filename;

        $zip = new ZipArchive();
        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            json_out(['ok' => false, 'error' => 'Cannot create zip archive at ' . $zipPath], 500);
        }

        $filesCount = 0;
        if (is_dir($uploadsDir)) {
            $files = new RecursiveIteratorIterator(
                new RecursiveDirectoryIterator($uploadsDir, RecursiveDirectoryIterator::SKIP_DOTS),
                RecursiveIteratorIterator::LEAVES_ONLY
            );

            foreach ($files as $file) {
                if (!$file->isDir()) {
                    $filePath = $file->getRealPath();
                    $relativePath = substr($filePath, strlen($uploadsDir) + 1);
                    $zip->addFile($filePath, $relativePath);
                    $filesCount++;
                }
            }
        }

        $zip->close();
        $size = filesize($zipPath);

        json_out([
            'ok' => true,
            'message' => 'Images backup archive created successfully!',
            'filename' => $filename,
            'size' => format_bytes($size),
            'files_count' => $filesCount,
        ]);
    } catch (\Throwable $e) {
        json_out(['ok' => false, 'error' => $e->getMessage()], 500);
    }
}

// -------------------------------------------------------------
// 4. DOWNLOAD BACKUP: GET admin/backup/download/{filename}
// -------------------------------------------------------------
if (str_starts_with($path, 'download/')) {
    $filename = basename(substr($path, 9));
    $backupDir = get_backup_dir();
    $filePath = $backupDir . '/' . $filename;

    if (!file_exists($filePath) || !is_file($filePath)) {
        json_out(['ok' => false, 'error' => 'Backup file not found.'], 404);
    }

    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    $mime = $ext === 'zip' ? 'application/zip' : 'application/sql';

    header('Content-Description: File Transfer');
    header('Content-Type: ' . $mime);
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($filePath));
    readfile($filePath);
    exit;
}

// -------------------------------------------------------------
// 5. DELETE BACKUP: POST admin/backup/delete
// -------------------------------------------------------------
if ($path === 'delete' && $method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true) ?: $_POST;
    $filename = basename($data['filename'] ?? '');

    if (empty($filename)) {
        json_out(['ok' => false, 'error' => 'Filename is required.'], 422);
    }

    $backupDir = get_backup_dir();
    $filePath = $backupDir . '/' . $filename;

    if (file_exists($filePath)) {
        @unlink($filePath);
        json_out(['ok' => true, 'message' => 'Backup deleted successfully.']);
    } else {
        json_out(['ok' => false, 'error' => 'Backup file not found.'], 404);
    }
}

// -------------------------------------------------------------
// 6. RESTORE DATABASE: POST admin/backup/restore-db
// -------------------------------------------------------------
if ($path === 'restore-db' && $method === 'POST') {
    @set_time_limit(1800);
    @ini_set('memory_limit', '512M');

    $targetFile = null;
    $isUploaded = false;

    if (!empty($_FILES['file']['tmp_name'])) {
        $targetFile = $_FILES['file']['tmp_name'];
        $isUploaded = true;
    } else {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true) ?: $_POST;
        $fn = basename($data['filename'] ?? '');
        if ($fn) {
            $backupDir = get_backup_dir();
            $targetFile = $backupDir . '/' . $fn;
        }
    }

    if (!$targetFile || !file_exists($targetFile)) {
        json_out(['ok' => false, 'error' => 'No valid SQL backup file specified.'], 422);
    }

    try {
        $pdo = get_pdo();
        $pdo->exec("SET FOREIGN_KEY_CHECKS=0;");

        $handle = fopen($targetFile, "r");
        if (!$handle) {
            json_out(['ok' => false, 'error' => 'Unable to open SQL file.'], 500);
        }

        $query = '';
        $executed = 0;
        $warnings = 0;

        while (!feof($handle)) {
            $line = fgets($handle);
            $trimmed = trim($line);

            if ($trimmed === '' || str_starts_with($trimmed, '--') || str_starts_with($trimmed, '/*')) {
                continue;
            }

            $query .= $line;

            if (str_ends_with($trimmed, ';')) {
                try {
                    $pdo->exec($query);
                    $executed++;
                } catch (\Throwable $e) {
                    $warnings++;
                }
                $query = '';
            }
        }
        fclose($handle);

        $pdo->exec("SET FOREIGN_KEY_CHECKS=1;");

        json_out([
            'ok' => true,
            'message' => "Database restored successfully! ({$executed} statements executed)",
            'queries_executed' => $executed,
            'warnings' => $warnings,
        ]);
    } catch (\Throwable $e) {
        json_out(['ok' => false, 'error' => 'Database restore failed: ' . $e->getMessage()], 500);
    }
}

// -------------------------------------------------------------
// 7. RESTORE FILES: POST admin/backup/restore-files
// -------------------------------------------------------------
if ($path === 'restore-files' && $method === 'POST') {
    @set_time_limit(1800);
    @ini_set('memory_limit', '512M');

    if (!class_exists('ZipArchive')) {
        json_out(['ok' => false, 'error' => 'ZipArchive extension is not available.'], 500);
    }

    $zipFile = null;
    if (!empty($_FILES['file']['tmp_name'])) {
        $zipFile = $_FILES['file']['tmp_name'];
    } else {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true) ?: $_POST;
        $fn = basename($data['filename'] ?? '');
        if ($fn) {
            $backupDir = get_backup_dir();
            $zipFile = $backupDir . '/' . $fn;
        }
    }

    if (!$zipFile || !file_exists($zipFile)) {
        json_out(['ok' => false, 'error' => 'No valid ZIP archive found.'], 422);
    }

    try {
        $uploadsDir = get_uploads_dir();
        $zip = new ZipArchive();
        if ($zip->open($zipFile) !== true) {
            json_out(['ok' => false, 'error' => 'Unable to open ZIP archive.'], 500);
        }

        $restored = 0;
        for ($i = 0; $i < $zip->numFiles; $i++) {
            $entry = $zip->getNameIndex($i);
            // Prevent directory traversal
            if (str_contains($entry, '..')) continue;

            $dest = $uploadsDir . '/' . $entry;
            if (str_ends_with($entry, '/')) {
                @mkdir($dest, 0755, true);
            } else {
                $pdir = dirname($dest);
                if (!is_dir($pdir)) @mkdir($pdir, 0755, true);
                copy("zip://{$zipFile}#{$entry}", $dest);
                $restored++;
            }
        }
        $zip->close();

        json_out([
            'ok' => true,
            'message' => "Media restored successfully! ({$restored} files extracted)",
            'files_restored' => $restored,
        ]);
    } catch (\Throwable $e) {
        json_out(['ok' => false, 'error' => 'Files restore failed: ' . $e->getMessage()], 500);
    }
}

// Fallback if no matching action found
json_out(['ok' => false, 'error' => 'Unknown backup action: ' . $path], 404);
