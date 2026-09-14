<?php
/**
 * ResellSeba Automated Vendor Installer & Health Fixer
 * Visit: https://petzavo.com/api/setup_vendor.php
 */

ini_set('display_errors', '1');
error_reporting(E_ALL);
set_time_limit(600);
ini_set('memory_limit', '1024M');

// Flush output continuously
if (function_exists('ob_end_flush')) {
    @ob_end_flush();
}
ob_implicit_flush(true);

$backendDir = realpath(__DIR__ . '/../backend');
if (!$backendDir || !is_dir($backendDir)) {
    die("Error: backend directory not found at " . __DIR__ . '/../backend');
}

$vendorAutoload = $backendDir . '/vendor/autoload.php';

?>
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="utf-8">
  <title>ResellSeba Backend Vendor Installer</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace; background: #090d16; color: #f1f5f9; padding: 24px; max-width: 900px; margin: 0 auto; }
    .card { background: #131b2e; border: 1px solid #1e293b; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    h1 { color: #38bdf8; margin-top: 0; font-size: 24px; }
    h2 { color: #f8fafc; font-size: 18px; margin: 16px 0 8px; }
    .btn { display: inline-block; padding: 12px 28px; background: #3b82f6; color: #fff; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 8px; border: none; cursor: pointer; }
    .btn:hover { background: #2563eb; }
    .log-box { background: #06090e; border: 1px solid #334155; border-radius: 8px; padding: 16px; font-family: monospace; font-size: 13px; color: #a5f3fc; line-height: 1.6; white-space: pre-wrap; word-break: break-all; max-height: 500px; overflow-y: auto; margin-top: 15px; }
    .badge-ok { background: #064e3b; color: #6ee7b7; padding: 4px 10px; border-radius: 6px; font-size: 13px; font-weight: bold; }
    .badge-missing { background: #7f1d1d; color: #fca5a5; padding: 4px 10px; border-radius: 6px; font-size: 13px; font-weight: bold; }
  </style>
</head>
<body>

<div class="card">
  <h1>⚙️ ResellSeba Backend Vendor & Dependency Manager</h1>
  <p>Status: 
    <?php if (file_exists($vendorAutoload)): ?>
      <span class="badge-ok">✅ Vendor Autoload Found</span>
    <?php else: ?>
      <span class="badge-missing">❌ Vendor Folder Missing</span>
    <?php endif; ?>
    | PHP Version: <strong><?= PHP_VERSION ?></strong>
  </p>

  <?php if (!isset($_GET['run'])): ?>
    <p>এই টুলটি স্বয়ংক্রিয়ভাবে cPanel-এ লারাভেলের <code>composer install</code> সম্পন্ন করবে এবং ব্যাকএন্ড চালু করবে।</p>
    <a href="?run=1" class="btn">🚀 Start Composer Install Now</a>
  <?php else: ?>
    <h2>Installation Progress:</h2>
    <div class="log-box"><?php

    function out($msg) {
        echo htmlspecialchars($msg) . "\n";
        @flush();
    }

    out(">>> PHP Version: " . PHP_VERSION);
    out(">>> Backend Directory: " . $backendDir);

    // 1. Detect PHP CLI executable
    $phpCandidates = [
        '/usr/local/bin/ea-php83',
        '/usr/local/bin/ea-php82',
        '/opt/cpanel/ea-php83/root/usr/bin/php',
        '/opt/cpanel/ea-php82/root/usr/bin/php',
        '/usr/bin/php8.3',
        '/usr/bin/php8.2',
        PHP_BINARY,
        'php',
    ];
    $phpBin = 'php';
    foreach ($phpCandidates as $candidate) {
        if ($candidate && @file_exists($candidate) && @is_executable($candidate)) {
            $phpBin = $candidate;
            break;
        }
    }
    out(">>> Selected PHP CLI: " . $phpBin);

    // 2. Locate or Download composer.phar
    $composerPhar = $backendDir . '/composer.phar';
    $systemComposer = null;
    foreach (['/usr/local/bin/composer', '/opt/cpanel/composer/bin/composer', '/usr/bin/composer'] as $sc) {
        if (@file_exists($sc) && @is_executable($sc)) {
            $systemComposer = $sc;
            break;
        }
    }

    $composerCmd = "";
    if ($systemComposer) {
        out(">>> Found System Composer: " . $systemComposer);
        $composerCmd = "{$phpBin} -d memory_limit=1024M {$systemComposer}";
    } else {
        if (!file_exists($composerPhar) || filesize($composerPhar) < 1000000) {
            out(">>> Downloading standalone composer.phar from getcomposer.org...");
            $composerUrl = 'https://getcomposer.org/download/latest-stable/composer.phar';
            $pharData = @file_get_contents($composerUrl);
            if (!$pharData && function_exists('curl_init')) {
                $ch = curl_init($composerUrl);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                $pharData = curl_exec($ch);
                curl_close($ch);
            }
            if ($pharData && strlen($pharData) > 1000000) {
                file_put_contents($composerPhar, $pharData);
                chmod($composerPhar, 0755);
                out(">>> Successfully downloaded composer.phar (" . round(strlen($pharData) / 1048576, 2) . " MB)");
            } else {
                out(">>> WARNING: Could not auto-download composer.phar directly.");
            }
        }
        if (file_exists($composerPhar)) {
            $composerCmd = "{$phpBin} -d memory_limit=1024M " . escapeshellarg($composerPhar);
        }
    }

    if (!$composerCmd) {
        out(">>> ERROR: No composer binary found. Please run 'composer install' via cPanel Terminal.");
    } else {
        out(">>> Executing: {$composerCmd} install --no-dev --optimize-autoloader --no-interaction");
        out(">>> This may take 30-90 seconds. Please wait...\n");

        $descriptors = [
            0 => ['pipe', 'r'],
            1 => ['pipe', 'w'],
            2 => ['pipe', 'w'],
        ];

        $env = array_merge($_ENV, [
            'COMPOSER_HOME' => $backendDir . '/storage/framework/cache/composer',
            'HOME' => $backendDir . '/storage/framework/cache',
        ]);

        $cmd = "cd " . escapeshellarg($backendDir) . " && {$composerCmd} install --no-dev --optimize-autoloader --no-interaction 2>&1";
        
        $proc = @proc_open($cmd, $descriptors, $pipes, $backendDir, $env);
        if (is_resource($proc)) {
            fclose($pipes[0]);
            while (!feof($pipes[1])) {
                $line = fgets($pipes[1]);
                if ($line !== false) {
                    out($line);
                }
            }
            fclose($pipes[1]);
            fclose($pipes[2]);
            $returnCode = proc_close($proc);
            out("\n>>> Composer process finished with code: " . $returnCode);
        } else {
            out(">>> Fallback to exec()...");
            $output = [];
            @exec($cmd, $output, $returnCode);
            out(implode("\n", $output));
            out("\n>>> Finished with code: " . $returnCode);
        }

        // Verify if autoload exists now
        if (file_exists($vendorAutoload)) {
            out("\n🎉 SUCCESS! backend/vendor/autoload.php was successfully generated!");
            out(">>> Testing artisan bootstrap...");
            $artisanOut = [];
            @exec("cd " . escapeshellarg($backendDir) . " && {$phpBin} artisan --version 2>&1", $artisanOut);
            out(">>> " . implode(" ", $artisanOut));
        } else {
            out("\n❌ Warning: vendor/autoload.php is still missing. Please check permissions or run composer via cPanel Terminal.");
        }
    }

    ?></div>
    <p style="margin-top: 20px;">
      <a href="setup_vendor.php" class="btn">🔄 Re-check Status</a>
      <a href="test" class="btn" style="background: #10b981; margin-left: 10px;">🧪 Test API Status</a>
      <a href="/" class="btn" style="background: #6366f1; margin-left: 10px;">🏠 Back to Site</a>
    </p>
  <?php endif; ?>
</div>

</body>
</html>
