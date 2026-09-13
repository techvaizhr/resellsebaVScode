<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Laravel\Sanctum\PersonalAccessToken;
use ZipArchive;

class BackupController extends Controller
{
    /**
     * Authorize that the request comes from an authenticated user.
     * Checks Bearer header or ?token= query parameter.
     */
    private function authorizeAdmin(Request $request)
    {
        $user = $request->user('sanctum') ?? $request->user();

        if (!$user) {
            $tokenString = $request->bearerToken() ?? $request->query('token');
            if ($tokenString) {
                $token = PersonalAccessToken::findToken($tokenString);
                if ($token && (!$token->expires_at || $token->expires_at->isFuture())) {
                    $user = $token->tokenable;
                }
            }
        }

        if (!$user) {
            return false;
        }

        // Allow super admin by email shortcut
        if ($user->email === 'zahidha367@gmail.com' || str_contains($user->email ?? '', 'admin@')) {
            return true;
        }

        // Check role on user model attribute, relation, or user_roles table
        $role = $user->role?->value ?? (string) ($user->role ?? '');
        if (empty($role)) {
            $userRole = \App\Models\UserRole::where('user_id', $user->id)->first();
            $role = is_object($userRole?->role) ? ($userRole->role->value ?? (string) $userRole->role) : ($userRole?->role ?? '');
        }
        if (empty($role)) {
            $role = DB::table('user_roles')->where('user_id', $user->id)->value('role') ?? '';
        }

        return in_array(strtolower((string) $role), ['super_admin', 'admin', 'staff', 'owner', 'manager']);
    }

    /**
     * Get or create the secure backups storage path.
     */
    private function getBackupPath($filename = '')
    {
        $dir = storage_path('app/backups');
        if (!File::isDirectory($dir)) {
            File::makeDirectory($dir, 0755, true, true);
            // Protect backup directory against direct web access
            File::put($dir . '/.htaccess', "Deny from all\n");
        }
        return $filename ? ($dir . '/' . basename($filename)) : $dir;
    }

    /**
     * Get the canonical public uploads storage directory.
     */
    private function getUploadBasePath($subpath = '')
    {
        $rootPath = base_path('../public/uploads' . ($subpath ? '/' . ltrim($subpath, '/') : ''));
        if (File::isDirectory(base_path('../public'))) {
            return $rootPath;
        }
        return public_path('uploads' . ($subpath ? '/' . ltrim($subpath, '/') : ''));
    }

    /**
     * Format bytes to human readable format.
     */
    private function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        return round($bytes, $precision) . ' ' . $units[$pow];
    }

    /**
     * List all database and image backups with system metrics.
     */
    public function listBackups(Request $request)
    {
        if (!$this->authorizeAdmin($request)) {
            return response()->json(['error' => 'Unauthorized access.'], 401);
        }

        $dir = $this->getBackupPath();
        $files = File::files($dir);

        $backups = [];
        $totalBackupBytes = 0;

        foreach ($files as $file) {
            $filename = $file->getFilename();
            if ($filename === '.htaccess' || $filename === '.gitignore') {
                continue;
            }

            $sizeBytes = $file->getSize();
            $totalBackupBytes += $sizeBytes;
            $extension = strtolower($file->getExtension());

            $type = 'database';
            if (str_starts_with($filename, 'images_') || str_starts_with($filename, 'media_') || str_starts_with($filename, 'uploads_') || $extension === 'zip') {
                $type = 'files';
            } elseif (str_starts_with($filename, 'db_') || $extension === 'sql') {
                $type = 'database';
            }

            $backups[] = [
                'filename' => $filename,
                'type' => $type,
                'extension' => $extension,
                'size' => $this->formatBytes($sizeBytes),
                'size_bytes' => $sizeBytes,
                'created_at' => date('d M Y, h:i A', $file->getMTime()),
                'created_at_raw' => $file->getMTime(),
            ];
        }

        // Sort backups newest first
        usort($backups, fn($a, $b) => $b['created_at_raw'] <=> $a['created_at_raw']);

        // System Database Size
        $dbSizeMb = 0;
        try {
            $dbName = DB::connection()->getDatabaseName();
            $res = DB::select("SELECT SUM(data_length + index_length) / 1024 / 1024 AS size_mb 
                              FROM information_schema.TABLES 
                              WHERE table_schema = ?", [$dbName]);
            if (!empty($res) && isset($res[0]->size_mb)) {
                $dbSizeMb = round((float) $res[0]->size_mb, 2);
            }
        } catch (\Throwable $e) {
            $dbSizeMb = 0;
        }

        // System Uploads Directory Size
        $uploadDir = $this->getUploadBasePath();
        $uploadBytes = 0;
        $uploadFilesCount = 0;
        if (File::isDirectory($uploadDir)) {
            $iterator = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($uploadDir, \FilesystemIterator::SKIP_DOTS)
            );
            foreach ($iterator as $item) {
                if ($item->isFile()) {
                    $uploadBytes += $item->getSize();
                    $uploadFilesCount++;
                }
            }
        }

        return response()->json([
            'ok' => true,
            'backups' => $backups,
            'stats' => [
                'total_backups' => count($backups),
                'total_backup_size' => $this->formatBytes($totalBackupBytes),
                'total_backup_bytes' => $totalBackupBytes,
                'db_size_mb' => $dbSizeMb,
                'uploads_size' => $this->formatBytes($uploadBytes),
                'uploads_bytes' => $uploadBytes,
                'uploads_files_count' => $uploadFilesCount,
            ],
        ]);
    }

    /**
     * Dynamically create a complete database SQL backup.
     * Works 100% in pure PHP, without requiring external mysqldump CLI.
     */
    public function createDbBackup(Request $request)
    {
        if (!$this->authorizeAdmin($request)) {
            return response()->json(['error' => 'Unauthorized access.'], 401);
        }

        @set_time_limit(1800);
        @ini_set('memory_limit', '512M');

        try {
            $backupDir = $this->getBackupPath();
            $filename = 'db_backup_' . date('Y-m-d_His') . '.sql';
            $filePath = $backupDir . '/' . $filename;

            $handle = fopen($filePath, 'w+');
            if (!$handle) {
                return response()->json(['error' => 'Unable to open file for writing at ' . $filePath], 500);
            }

            $dbName = DB::connection()->getDatabaseName();

            // Header comments
            fwrite($handle, "-- --------------------------------------------------------\n");
            fwrite($handle, "-- ResellSeba Platform Database Backup\n");
            fwrite($handle, "-- Database: " . $dbName . "\n");
            fwrite($handle, "-- Generated: " . date('Y-m-d H:i:s') . "\n");
            fwrite($handle, "-- --------------------------------------------------------\n\n");
            fwrite($handle, "SET FOREIGN_KEY_CHECKS=0;\n");
            fwrite($handle, "SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';\n");
            fwrite($handle, "SET AUTOCOMMIT = 0;\n");
            fwrite($handle, "START TRANSACTION;\n");
            fwrite($handle, "SET NAMES utf8mb4;\n\n");

            // Fetch all base tables dynamically
            $rawTables = DB::select('SHOW FULL TABLES WHERE Table_type = "BASE TABLE"');
            $tableCount = 0;
            $rowCount = 0;

            foreach ($rawTables as $rawTable) {
                $tableProp = 'Tables_in_' . $dbName;
                $tableName = $rawTable->$tableProp ?? array_values((array) $rawTable)[0] ?? null;

                if (!$tableName) {
                    continue;
                }

                $tableCount++;

                // Table structure
                fwrite($handle, "-- --------------------------------------------------------\n");
                fwrite($handle, "-- Table structure for table `{$tableName}`\n");
                fwrite($handle, "-- --------------------------------------------------------\n\n");
                fwrite($handle, "DROP TABLE IF EXISTS `{$tableName}`;\n");

                $createTable = DB::select("SHOW CREATE TABLE `{$tableName}`");
                if (!empty($createTable)) {
                    $createSql = $createTable[0]->{'Create Table'} ?? null;
                    if ($createSql) {
                        fwrite($handle, $createSql . ";\n\n");
                    }
                }

                // Table data in safe offset/limit batches (requires zero table key assumptions)
                fwrite($handle, "-- Dumping data for table `{$tableName}`\n\n");

                $totalRows = DB::table($tableName)->count();
                $batchSize = 250;

                for ($offset = 0; $offset < $totalRows; $offset += $batchSize) {
                    $rows = DB::table($tableName)->offset($offset)->limit($batchSize)->get();
                    if ($rows->isEmpty()) {
                        break;
                    }

                    $first = true;
                    $columns = [];

                    foreach ($rows as $row) {
                        $rowArray = (array) $row;
                        $rowCount++;

                        if ($first) {
                            $columns = array_keys($rowArray);
                            $colList = implode('`, `', $columns);
                            fwrite($handle, "INSERT INTO `{$tableName}` (`{$colList}`) VALUES\n");
                            $first = false;
                        } else {
                            fwrite($handle, ",\n");
                        }

                        $values = [];
                        foreach ($columns as $col) {
                            $val = $rowArray[$col] ?? null;
                            if (is_null($val)) {
                                $values[] = 'NULL';
                            } elseif (is_bool($val)) {
                                $values[] = $val ? '1' : '0';
                            } elseif (is_int($val) || (is_numeric($val) && !is_string($val))) {
                                $values[] = $val;
                            } else {
                                $escaped = addslashes((string) $val);
                                $escaped = str_replace(["\n", "\r"], ['\n', '\r'], $escaped);
                                $values[] = "'" . $escaped . "'";
                            }
                        }

                        fwrite($handle, "(" . implode(', ', $values) . ")");
                    }

                    fwrite($handle, ";\n\n");
                }
            }

            fwrite($handle, "COMMIT;\n");
            fwrite($handle, "SET FOREIGN_KEY_CHECKS=1;\n");
            fclose($handle);

            $sizeBytes = File::size($filePath);

            return response()->json([
                'ok' => true,
                'message' => "Database backup created successfully! ({$tableCount} tables, {$rowCount} rows)",
                'filename' => $filename,
                'size' => $this->formatBytes($sizeBytes),
                'size_bytes' => $sizeBytes,
                'table_count' => $tableCount,
                'row_count' => $rowCount,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Failed to create database backup: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Restore database from an existing backup file or an uploaded SQL file.
     * Uses a robust state machine tokenizer to safely handle semicolons inside quotes.
     */
    public function restoreDbBackup(Request $request)
    {
        if (!$this->authorizeAdmin($request)) {
            return response()->json(['error' => 'Unauthorized access.'], 401);
        }

        @set_time_limit(1800);
        @ini_set('memory_limit', '512M');

        try {
            // Check if upload exceeded post_max_size
            if (empty($_FILES) && empty($_POST) && isset($_SERVER['CONTENT_LENGTH']) && (int) $_SERVER['CONTENT_LENGTH'] > 0) {
                $postMax = ini_get('post_max_size');
                return response()->json([
                    'error' => "Uploaded file exceeds server post_max_size limit ({$postMax}). Please increase post_max_size and upload_max_filesize in cPanel PHP Selector, or place the backup file in storage/app/backups to restore directly from server."
                ], 413);
            }

            $filePath = null;

            if ($request->hasFile('file')) {
                $file = $request->file('file');
                if (!$file->isValid()) {
                    $uploadError = match ($file->getError()) {
                        UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize (' . ini_get('upload_max_filesize') . ') in php.ini.',
                        UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE.',
                        UPLOAD_ERR_PARTIAL => 'File was only partially uploaded.',
                        UPLOAD_ERR_NO_FILE => 'No file was uploaded.',
                        default => 'Upload error code: ' . $file->getError(),
                    };
                    return response()->json(['error' => 'Upload failed: ' . $uploadError], 400);
                }

                $ext = strtolower($file->getClientOriginalExtension());
                if ($ext !== 'sql') {
                    return response()->json(['error' => 'Invalid file format. Please upload a .sql backup file.'], 400);
                }

                $filename = 'db_backup_imported_' . date('Y-m-d_His') . '.sql';
                $targetPath = $this->getBackupPath($filename);
                $file->move($this->getBackupPath(), $filename);
                $filePath = $targetPath;
            } elseif ($request->filled('filename')) {
                $filename = basename($request->input('filename'));
                $targetPath = $this->getBackupPath($filename);
                if (!File::exists($targetPath)) {
                    return response()->json(['error' => 'Backup file not found on server.'], 404);
                }
                $filePath = $targetPath;
            } else {
                return response()->json(['error' => 'No backup file selected or uploaded.'], 400);
            }

            // Disable foreign key checks for clean restore
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');

            // Execute SQL file statements efficiently with state machine tokenizer
            $handle = fopen($filePath, 'r');
            if (!$handle) {
                return response()->json(['error' => 'Could not read SQL backup file.'], 500);
            }

            $query = '';
            $inQuotes = false;
            $quoteChar = null;
            $escaped = false;
            $executedQueries = 0;
            $failedQueries = 0;
            $lastError = null;

            while (($chunk = fread($handle, 65536)) !== false && strlen($chunk) > 0) {
                $len = strlen($chunk);
                for ($i = 0; $i < $len; $i++) {
                    $char = $chunk[$i];
                    $query .= $char;

                    if ($char === '\\' && $inQuotes) {
                        $escaped = !$escaped;
                        continue;
                    }

                    if (($char === "'" || $char === '"') && !$escaped) {
                        if (!$inQuotes) {
                            $inQuotes = true;
                            $quoteChar = $char;
                        } elseif ($char === $quoteChar) {
                            $inQuotes = false;
                            $quoteChar = null;
                        }
                    }

                    if ($char === ';' && !$inQuotes) {
                        // Strip leading whitespace and comments (-- or # or /* ... */)
                        $stmt = preg_replace('/^\s*(--[^\r\n]*[\r\n]+|#[^\r\n]*[\r\n]+|\/\*(?![\!])[\s\S]*?\*\/)+/s', '', $query);
                        $stmt = trim($stmt ?? '');

                        if (!empty($stmt)) {
                            try {
                                DB::unprepared($stmt);
                                $executedQueries++;
                            } catch (\Throwable $qe) {
                                $failedQueries++;
                                $lastError = $qe->getMessage();
                            }
                        }
                        $query = '';
                    }

                    $escaped = false;
                }
            }

            // Run any remaining query in buffer
            if (!empty($query)) {
                $stmt = preg_replace('/^\s*(--[^\r\n]*[\r\n]+|#[^\r\n]*[\r\n]+|\/\*(?![\!])[\s\S]*?\*\/)+/s', '', $query);
                $stmt = trim($stmt ?? '');
                if (!empty($stmt)) {
                    try {
                        DB::unprepared($stmt);
                        $executedQueries++;
                    } catch (\Throwable $qe) {
                        $failedQueries++;
                        $lastError = $qe->getMessage();
                    }
                }
            }

            fclose($handle);

            // Re-enable foreign key checks
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');

            // Flush application caches
            Cache::flush();
            try {
                \Illuminate\Support\Facades\Artisan::call('cache:clear');
            } catch (\Throwable $ignored) {}

            if ($executedQueries === 0 && $failedQueries > 0) {
                throw new \Exception('Failed executing SQL statements: ' . $lastError);
            }

            return response()->json([
                'ok' => true,
                'message' => "Database restored successfully! ({$executedQueries} statement batches executed)",
                'queries_executed' => $executedQueries,
                'warnings' => $failedQueries,
            ]);
        } catch (\Throwable $e) {
            try {
                DB::statement('SET FOREIGN_KEY_CHECKS=1;');
            } catch (\Throwable $ignored) {}

            return response()->json([
                'error' => 'Database restore failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Dynamically create a complete zip backup of all media/image uploads.
     */
    public function createFilesBackup(Request $request)
    {
        if (!$this->authorizeAdmin($request)) {
            return response()->json(['error' => 'Unauthorized access.'], 401);
        }

        @set_time_limit(1800);
        @ini_set('memory_limit', '512M');

        if (!class_exists('ZipArchive')) {
            return response()->json(['error' => 'ZipArchive extension is not available on this server.'], 500);
        }

        try {
            $uploadDir = $this->getUploadBasePath();
            if (!File::isDirectory($uploadDir)) {
                return response()->json(['error' => 'Upload directory does not exist at ' . $uploadDir], 404);
            }

            $backupDir = $this->getBackupPath();
            $filename = 'images_backup_' . date('Y-m-d_His') . '.zip';
            $zipPath = $backupDir . '/' . $filename;

            $zip = new ZipArchive();
            if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
                return response()->json(['error' => 'Failed to create zip archive.'], 500);
            }

            $files = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($uploadDir, \FilesystemIterator::SKIP_DOTS),
                \RecursiveIteratorIterator::LEAVES_ONLY
            );

            $fileCount = 0;
            $baseLength = strlen(rtrim($uploadDir, '/\\')) + 1;

            foreach ($files as $file) {
                if ($file->isFile()) {
                    $realPath = $file->getRealPath();
                    $relativePath = substr($realPath, $baseLength);
                    // Normalize forward slashes for cross-platform archive compatibility
                    $relativePath = str_replace('\\', '/', $relativePath);

                    // Skip OS junk files
                    $bn = basename($relativePath);
                    if ($bn === '.DS_Store' || $bn === 'Thumbs.db' || str_starts_with($bn, '._')) {
                        continue;
                    }

                    $zip->addFile($realPath, $relativePath);
                    $fileCount++;
                }
            }

            if ($fileCount === 0) {
                $zip->addFromString('.resellseba-media', 'ResellSeba Media Backup Archive');
            }

            $zip->close();

            $sizeBytes = File::size($zipPath);

            return response()->json([
                'ok' => true,
                'message' => "Media & images backup created successfully! ({$fileCount} files packed)",
                'filename' => $filename,
                'files_count' => $fileCount,
                'size' => $this->formatBytes($sizeBytes),
                'size_bytes' => $sizeBytes,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Failed to create media backup: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Restore media and images from an existing zip backup or an uploaded zip file.
     * Safely normalizes paths to ensure no nested `public/uploads/uploads/` directory nesting.
     */
    public function restoreFilesBackup(Request $request)
    {
        if (!$this->authorizeAdmin($request)) {
            return response()->json(['error' => 'Unauthorized access.'], 401);
        }

        @set_time_limit(1800);
        @ini_set('memory_limit', '512M');

        if (!class_exists('ZipArchive')) {
            return response()->json(['error' => 'ZipArchive extension is not available on this server.'], 500);
        }

        try {
            // Check if upload exceeded post_max_size
            if (empty($_FILES) && empty($_POST) && isset($_SERVER['CONTENT_LENGTH']) && (int) $_SERVER['CONTENT_LENGTH'] > 0) {
                $postMax = ini_get('post_max_size');
                return response()->json([
                    'error' => "Uploaded archive exceeds server post_max_size limit ({$postMax}). Please increase post_max_size and upload_max_filesize in cPanel PHP Selector, or place the backup file in storage/app/backups to restore directly from server."
                ], 413);
            }

            $zipPath = null;

            if ($request->hasFile('file')) {
                $file = $request->file('file');
                if (!$file->isValid()) {
                    $uploadError = match ($file->getError()) {
                        UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize (' . ini_get('upload_max_filesize') . ') in php.ini.',
                        UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE.',
                        UPLOAD_ERR_PARTIAL => 'File was only partially uploaded.',
                        UPLOAD_ERR_NO_FILE => 'No file was uploaded.',
                        default => 'Upload error code: ' . $file->getError(),
                    };
                    return response()->json(['error' => 'Upload failed: ' . $uploadError], 400);
                }

                $ext = strtolower($file->getClientOriginalExtension());
                if ($ext !== 'zip') {
                    return response()->json(['error' => 'Invalid file format. Please upload a .zip archive.'], 400);
                }

                $filename = 'images_backup_imported_' . date('Y-m-d_His') . '.zip';
                $targetPath = $this->getBackupPath($filename);
                $file->move($this->getBackupPath(), $filename);
                $zipPath = $targetPath;
            } elseif ($request->filled('filename')) {
                $filename = basename($request->input('filename'));
                $targetPath = $this->getBackupPath($filename);
                if (!File::exists($targetPath)) {
                    return response()->json(['error' => 'Backup archive not found on server.'], 404);
                }
                $zipPath = $targetPath;
            } else {
                return response()->json(['error' => 'No backup archive selected or uploaded.'], 400);
            }

            $destDir = $this->getUploadBasePath();
            if (!File::isDirectory($destDir)) {
                File::makeDirectory($destDir, 0755, true, true);
            }

            $zip = new ZipArchive();
            if ($zip->open($zipPath) !== true) {
                return response()->json(['error' => 'Could not open zip archive.'], 500);
            }

            $extractedCount = 0;

            for ($i = 0; $i < $zip->numFiles; $i++) {
                $entryName = $zip->getNameIndex($i);

                // Security check: prevent path traversal attacks (e.g. ../../)
                if (str_contains($entryName, '..') || str_starts_with($entryName, '/') || str_starts_with($entryName, '\\')) {
                    continue;
                }

                // Strip any redundant leading `uploads/` or `public/uploads/` prefix from the zip entry
                $cleanEntry = ltrim($entryName, '/\\');
                $cleanEntry = preg_replace('/^(public\/)?uploads\//i', '', $cleanEntry);

                $bn = basename($cleanEntry);
                if (empty($cleanEntry) || $bn === '.DS_Store' || $bn === 'Thumbs.db' || str_starts_with($bn, '._') || $bn === '.resellseba-media') {
                    continue;
                }

                $targetFilePath = $destDir . '/' . $cleanEntry;

                // If entry is a directory, ensure directory exists
                if (str_ends_with($entryName, '/')) {
                    if (!File::isDirectory($targetFilePath)) {
                        File::makeDirectory($targetFilePath, 0755, true, true);
                    }
                    continue;
                }

                // Ensure parent directory exists
                $parentDir = dirname($targetFilePath);
                if (!File::isDirectory($parentDir)) {
                    File::makeDirectory($parentDir, 0755, true, true);
                }

                // Extract stream
                $stream = $zip->getStream($entryName);
                if ($stream) {
                    $destHandle = fopen($targetFilePath, 'w+');
                    if ($destHandle) {
                        stream_copy_to_stream($stream, $destHandle);
                        fclose($destHandle);
                        $extractedCount++;
                    }
                    fclose($stream);
                }
            }

            $zip->close();

            // Invalidate media library cached metadata and page caches
            Cache::forget('media_library_scanned_index');
            Cache::forget('media_library_used_tokens');
            Cache::forget('lp_bootstrap_cache');
            Cache::forget('reseller_catalog_products');

            return response()->json([
                'ok' => true,
                'message' => "Images restored successfully! ({$extractedCount} files restored into uploads storage)",
                'files_restored' => $extractedCount,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Failed to restore media: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Securely download a backup file.
     */
    public function downloadBackup(Request $request, $filename)
    {
        if (!$this->authorizeAdmin($request)) {
            return response()->json(['error' => 'Unauthorized access.'], 401);
        }

        $cleanFilename = basename($filename);
        $filePath = $this->getBackupPath($cleanFilename);

        if (!File::exists($filePath)) {
            return response()->json(['error' => 'File not found.'], 404);
        }

        return response()->download($filePath, $cleanFilename, [
            'Content-Type' => 'application/octet-stream',
            'Content-Disposition' => 'attachment; filename="' . $cleanFilename . '"',
        ]);
    }

    /**
     * Delete a backup file.
     */
    public function deleteBackup(Request $request)
    {
        if (!$this->authorizeAdmin($request)) {
            return response()->json(['error' => 'Unauthorized access.'], 401);
        }

        $filename = basename($request->input('filename', ''));
        if (empty($filename)) {
            return response()->json(['error' => 'Filename is required.'], 400);
        }

        $filePath = $this->getBackupPath($filename);
        if (!File::exists($filePath)) {
            return response()->json(['error' => 'File does not exist.'], 404);
        }

        File::delete($filePath);

        return response()->json([
            'ok' => true,
            'message' => "Backup {$filename} deleted successfully.",
        ]);
    }
}
