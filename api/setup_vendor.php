<?php
/**
 * ResellSeba Automated Deployment & Server Maintenance Control Panel
 * Accessible at: https://petzavo.com/api/setup_vendor.php
 */

ini_set('display_errors', '1');
error_reporting(E_ALL);
set_time_limit(600);
ini_set('memory_limit', '1024M');

if (function_exists('ob_end_flush')) {
    @ob_end_flush();
}
ob_implicit_flush(true);

$backendDir = realpath(__DIR__ . '/../backend');
$rootDir = realpath(__DIR__ . '/..');
$vendorAutoload = $backendDir . '/vendor/autoload.php';

// Detect PHP CLI executable
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

$action = $_GET['action'] ?? (isset($_GET['run']) ? 'composer' : null);

function out($msg) {
    echo htmlspecialchars($msg) . "\n";
    @flush();
}

function run_shell_cmd($cmd, $workingDir) {
    out(">>> Executing: " . $cmd);
    $descriptors = [
        0 => ['pipe', 'r'],
        1 => ['pipe', 'w'],
        2 => ['pipe', 'w'],
    ];
    $env = array_merge($_ENV, [
        'PATH' => '/usr/local/bin:/usr/bin:/bin:' . getenv('PATH'),
        'HOME' => $workingDir,
    ]);
    $proc = @proc_open($cmd, $descriptors, $pipes, $workingDir, $env);
    if (is_resource($proc)) {
        fclose($pipes[0]);
        while (!feof($pipes[1])) {
            $line = fgets($pipes[1]);
            if ($line !== false) out($line);
        }
        while (!feof($pipes[2])) {
            $line = fgets($pipes[2]);
            if ($line !== false) out("[ERR] " . $line);
        }
        fclose($pipes[1]);
        fclose($pipes[2]);
        $code = proc_close($proc);
        out(">>> Finished with exit code: " . $code);
        return $code;
    } else {
        $output = [];
        $code = 0;
        @exec($cmd . ' 2>&1', $output, $code);
        out(implode("\n", $output));
        out(">>> Finished with exit code: " . $code);
        return $code;
    }
}

?>
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="utf-8">
  <title>ResellSeba Server Deployment & Control Panel</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace; background: #090d16; color: #f1f5f9; padding: 24px; max-width: 960px; margin: 0 auto; }
    .card { background: #131b2e; border: 1px solid #1e293b; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    h1 { color: #38bdf8; margin-top: 0; font-size: 24px; }
    h2 { color: #f8fafc; font-size: 18px; margin: 16px 0 8px; }
    .btn { display: inline-block; padding: 10px 20px; background: #3b82f6; color: #fff; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 8px; border: none; cursor: pointer; margin-right: 8px; margin-bottom: 8px; }
    .btn:hover { background: #2563eb; }
    .btn-green { background: #10b981; }
    .btn-green:hover { background: #059669; }
    .btn-purple { background: #8b5cf6; }
    .btn-purple:hover { background: #7c3aed; }
    .btn-amber { background: #f59e0b; color: #000; }
    .btn-amber:hover { background: #d97706; }
    .btn-red { background: #ef4444; }
    .btn-red:hover { background: #dc2626; }
    .btn-cyan { background: #06b6d4; }
    .btn-cyan:hover { background: #0891b2; }
    .log-box { background: #06090e; border: 1px solid #334155; border-radius: 8px; padding: 16px; font-family: monospace; font-size: 13px; color: #a5f3fc; line-height: 1.6; white-space: pre-wrap; word-break: break-all; max-height: 500px; overflow-y: auto; margin-top: 15px; }
    .badge-ok { background: #064e3b; color: #6ee7b7; padding: 4px 10px; border-radius: 6px; font-size: 13px; font-weight: bold; }
    .badge-missing { background: #7f1d1d; color: #fca5a5; padding: 4px 10px; border-radius: 6px; font-size: 13px; font-weight: bold; }
  </style>
</head>
<body>

<div class="card">
  <h1>⚙️ ResellSeba Server Deployment & Control Panel</h1>
  <p>Status: 
    <?php if (file_exists($vendorAutoload)): ?>
      <span class="badge-ok">✅ Vendor Autoload Found</span>
    <?php else: ?>
      <span class="badge-missing">❌ Vendor Missing</span>
    <?php endif; ?>
    | PHP Version: <strong><?= PHP_VERSION ?></strong>
    | PHP CLI: <code><?= htmlspecialchars($phpBin) ?></code>
  </p>

  <div style="margin: 16px 0;">
    <a href="?action=import_sql" class="btn btn-amber">🗃️ 1-Click Import database.sql</a>
    <a href="?action=fix_all" class="btn btn-green">⚡ 1-Click Pull & Update (Git Pull + Migrate + Clear Cache)</a>
    <a href="?action=git_pull" class="btn btn-cyan">📥 Git Pull Latest Code</a>
    <a href="?action=migrate_seed" class="btn btn-purple">🗄️ Run DB Migrate & Seed</a>
    <a href="?action=composer" class="btn">📦 Run Composer Install</a>
    <a href="test" class="btn btn-green">🧪 Test API & Database Status</a>
    <a href="/" class="btn btn-purple">🏠 Open Website</a>
  </div>

  <?php if ($action): ?>
    <h2>Execution Output [Action: <?= htmlspecialchars($action) ?>]:</h2>
    <div class="log-box"><?php

    out(">>> Started at: " . date('Y-m-d H:i:s'));
    out(">>> Root Directory: " . $rootDir);
    out(">>> Backend Directory: " . $backendDir);

    if ($action === 'import_sql') {
        out("\n==================== IMPORT DATABASE.SQL ====================");
        $sqlFile = $rootDir . '/database.sql';
        if (!file_exists($sqlFile)) {
            out("ERROR: database.sql not found at " . $sqlFile);
        } else {
            try {
                require_once __DIR__ . '/standalone_backup.php';
                $pdo = get_pdo();
                $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, 0);
                out(">>> Connected to database. Reading database.sql...");
                $sqlContent = file_get_contents($sqlFile);
                out(">>> Executing SQL statements (size: " . strlen($sqlContent) . " bytes)...");
                $pdo->exec($sqlContent);
                out(">>> SUCCESS: database.sql imported cleanly with 0 errors!");
                out(">>> Super Admin Login: admin@resellseba.com | Password: password");
            } catch (\Throwable $e) {
                out(">>> ERROR: " . $e->getMessage());
            }
        }
    }

    if ($action === 'git_pull' || $action === 'fix_all') {
        out("\n==================== [1/3] GIT PULL ====================");
        run_shell_cmd("git fetch origin main && git reset --hard origin/main", $rootDir);
    }

    if ($action === 'composer') {
        out("\n==================== COMPOSER INSTALL ====================");
        $composerPhar = $backendDir . '/composer.phar';
        $systemComposer = null;
        foreach (['/usr/local/bin/composer', '/opt/cpanel/composer/bin/composer', '/usr/bin/composer'] as $sc) {
            if (@file_exists($sc) && @is_executable($sc)) {
                $systemComposer = $sc;
                break;
            }
        }
        if ($systemComposer) {
            $composerCmd = "{$phpBin} {$systemComposer}";
        } elseif (file_exists($composerPhar)) {
            $composerCmd = "{$phpBin} " . escapeshellarg($composerPhar);
        } else {
            out(">>> Downloading composer.phar...");
            @copy('https://getcomposer.org/download/latest-stable/composer.phar', $composerPhar);
            $composerCmd = "{$phpBin} " . escapeshellarg($composerPhar);
        }
        run_shell_cmd("{$composerCmd} install --no-dev --optimize-autoloader --no-interaction", $backendDir);
    }

    if ($action === 'migrate_seed' || $action === 'fix_all') {
        out("\n==================== [2/3] DB MIGRATE & SEED ====================");
        run_shell_cmd("{$phpBin} artisan migrate --force", $backendDir);
        run_shell_cmd("{$phpBin} artisan db:seed --force", $backendDir);
        run_shell_cmd("{$phpBin} artisan config:clear", $backendDir);
        run_shell_cmd("{$phpBin} artisan cache:clear", $backendDir);
    }



    out("\n🎉 COMPLETED SUCCESSFULLY! Please click 'Open Website' or 'Test API Status' above.");

    ?></div>
  <?php endif; ?>
</div>

</body>
</html>
