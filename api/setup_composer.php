<?php
/**
 * 1-Click Web Composer Installer for ResellSeba
 * 
 * Allows installing Laravel dependencies (vendor/) directly from browser
 * without requiring SSH or cPanel Terminal!
 */

@set_time_limit(1800);
@ini_set('memory_limit', '512M');
@ini_set('display_errors', '1');
error_reporting(E_ALL);

header('Content-Type: text/html; charset=utf-8');

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>1-Click Composer Installer · ResellSeba</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; }
        .card { max-width: 760px; margin: 0 auto; background: #1e293b; border-radius: 1rem; border: 1px solid #334155; padding: 2rem; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
        h1 { font-size: 1.5rem; margin-top: 0; color: #38bdf8; display: flex; align-items: center; gap: 0.5rem; }
        pre { background: #020617; color: #a5f3fc; padding: 1rem; border-radius: 0.5rem; border: 1px solid #1e293b; font-size: 0.875rem; overflow-x: auto; line-height: 1.5; min-height: 120px; }
        .btn { display: inline-block; background: #4f46e5; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; text-decoration: none; border: none; cursor: pointer; font-size: 1rem; transition: background 0.2s; }
        .btn:hover { background: #4338ca; }
        .badge { display: inline-block; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: bold; }
        .badge-success { background: #065f46; color: #34d399; }
        .badge-warning { background: #854d0e; color: #fde047; }
        .badge-danger { background: #991b1b; color: #fca5a5; }
        .info-row { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #334155; font-size: 0.875rem; }
    </style>
</head>
<body>
<div class="card">
    <h1>📦 1-Click Composer Auto-Installer</h1>
    <p style="color: #94a3b8; font-size: 0.95rem;">
        This tool installs all required Laravel 11 dependencies (<code>backend/vendor/</code>) automatically on your cPanel server without needing Terminal access.
    </p>

    <div style="margin: 1.5rem 0;">
        <div class="info-row">
            <span>PHP Version</span>
            <span class="badge <?php echo version_compare(PHP_VERSION, '8.2.0', '>=') ? 'badge-success' : 'badge-warning'; ?>">
                PHP <?php echo PHP_VERSION; ?>
            </span>
        </div>
        <div class="info-row">
            <span>Vendor Status</span>
            <?php 
                $vendorExists = file_exists(__DIR__ . '/../backend/vendor/autoload.php');
            ?>
            <span class="badge <?php echo $vendorExists ? 'badge-success' : 'badge-danger'; ?>">
                <?php echo $vendorExists ? 'Installed ✓' : 'Not Installed ✗'; ?>
            </span>
        </div>
        <div class="info-row">
            <span>Backend Directory</span>
            <code><?php echo realpath(__DIR__ . '/../backend') ?: 'backend'; ?></code>
        </div>
    </div>

    <?php if (isset($_GET['run'])): ?>
        <h3>Installation Log:</h3>
        <pre><?php
            flush();
            $backendDir = realpath(__DIR__ . '/../backend');
            if (!$backendDir || !is_dir($backendDir)) {
                echo "Error: Backend directory not found!\n";
                exit;
            }

            // 1. Find suitable PHP binary
            $phpBin = PHP_BINARY;
            $possiblePhp = [
                '/usr/local/bin/ea-php83',
                '/usr/local/bin/ea-php82',
                '/opt/cpanel/ea-php83/root/usr/bin/php',
                '/opt/cpanel/ea-php82/root/usr/bin/php',
                '/usr/bin/php8.3',
                '/usr/bin/php8.2',
                '/usr/bin/php',
                PHP_BINARY,
            ];

            foreach ($possiblePhp as $bin) {
                if (file_exists($bin) && is_executable($bin)) {
                    $testVer = @shell_exec("{$bin} -v 2>&1");
                    if ($testVer && (str_contains($testVer, 'PHP 8.2') || str_contains($testVer, 'PHP 8.3') || str_contains($testVer, 'PHP 8.4'))) {
                        $phpBin = $bin;
                        break;
                    }
                }
            }

            echo "Using PHP Binary: {$phpBin}\n";

            // 2. Locate or download composer.phar
            $pharPath = $backendDir . '/composer.phar';
            if (!file_exists($pharPath) || filesize($pharPath) < 1000000) {
                echo "Downloading composer.phar from official repository...\n";
                $pharUrl = 'https://getcomposer.org/composer-stable.phar';
                $pharData = @file_get_contents($pharUrl);
                if ($pharData && strlen($pharData) > 1000000) {
                    file_put_contents($pharPath, $pharData);
                    echo "Downloaded composer.phar successfully! (" . round(strlen($pharData) / 1024 / 1024, 2) . " MB)\n";
                } else {
                    echo "Warning: Could not download composer.phar directly via file_get_contents.\n";
                }
            } else {
                echo "composer.phar already present.\n";
            }

            // 3. Execute composer install
            echo "Running: {$phpBin} composer.phar install --no-dev --optimize-autoloader --no-interaction\n";
            echo "------------------------------------------------------------\n";
            flush();

            $cmd = "cd " . escapeshellarg($backendDir) . " && {$phpBin} composer.phar install --no-dev --optimize-autoloader --no-interaction 2>&1";
            $output = @shell_exec($cmd);

            echo htmlspecialchars($output ?: "(No shell output returned - checking vendor existence...)");
            echo "\n------------------------------------------------------------\n";

            if (file_exists($backendDir . '/vendor/autoload.php')) {
                echo "\nSUCCESS! backend/vendor/autoload.php has been installed successfully!\n";
                echo "You can now return to the Admin Panel.\n";
            } else {
                echo "\nNotice: If shell execution is blocked on this shared hosting, the standalone backup engine in api/standalone_backup.php will handle all backup and restore requests independently!\n";
            }
        ?></pre>

        <p style="margin-top: 1rem;">
            <a href="/admin/backup" class="btn">Return to Backup & Restore Panel</a>
            <a href="?run=1" class="btn" style="background: #334155; margin-left: 0.5rem;">Retry Installation</a>
        </p>

    <?php else: ?>
        <p style="margin: 1.5rem 0;">
            Click the button below to start the automatic installation:
        </p>
        <a href="?run=1" class="btn">🚀 Start 1-Click Composer Install</a>
    <?php endif; ?>
</div>
</body>
</html>
