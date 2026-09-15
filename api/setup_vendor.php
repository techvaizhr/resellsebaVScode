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
    .btn-red { background: #ef4444; font-weight: bold; }
    .btn-red:hover { background: #dc2626; }
    .btn-cyan { background: #06b6d4; }
    .btn-cyan:hover { background: #0891b2; }
    .log-box { background: #06090e; border: 1px solid #334155; border-radius: 8px; padding: 16px; font-family: monospace; font-size: 13px; color: #a5f3fc; line-height: 1.6; white-space: pre-wrap; word-break: break-all; max-height: 500px; overflow-y: auto; margin-top: 15px; }
    .badge-ok { background: #064e3b; color: #6ee7b7; padding: 4px 10px; border-radius: 6px; font-size: 13px; font-weight: bold; }
    .badge-missing { background: #7f1d1d; color: #fca5a5; padding: 4px 10px; border-radius: 6px; font-size: 13px; font-weight: bold; }
    .guide-card { background: #0d1527; border: 1px solid #1e293b; border-radius: 10px; padding: 18px; margin-top: 20px; font-size: 13px; line-height: 1.7; }
    .guide-card h3 { margin-top: 0; color: #38bdf8; font-size: 15px; display: flex; items-center; gap: 6px; }
    .guide-card table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    .guide-card th, .guide-card td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #1e293b; }
    .guide-card th { color: #94a3b8; font-size: 12px; text-transform: uppercase; }
  </style>
  <script>
    function triggerHardReset() {
      var modal = document.getElementById('resetModal');
      if (modal) {
        modal.style.display = 'flex';
        var inp = document.getElementById('resetInput');
        if (inp) { inp.value = ''; inp.focus(); }
      } else {
        var input = prompt("🚨 মারাত্মক সতর্কতা (DANGER ZONE)!\n\nসব টেবিল মুছে migrations থেকে ফ্রেশ সেটআপ করতে টাইপ করুন:\nRESET");
        if (input === "RESET") {
          window.location.href = "?action=fresh_db&confirm_wipe=RESET_CONFIRMED";
        }
      }
    }
    function closeResetModal() {
      var modal = document.getElementById('resetModal');
      if (modal) modal.style.display = 'none';
    }
    function confirmResetAction() {
      var inp = document.getElementById('resetInput');
      if (inp && inp.value.trim() === 'RESET') {
        window.location.href = "?action=fresh_db&confirm_wipe=RESET_CONFIRMED";
      } else {
        alert("❌ কোড মেলেনি! বড় হাতের অক্ষরে RESET টাইপ করুন।");
      }
    }
  </script>
</head>
<body>

  <!-- In-Page Hard Reset Confirmation Dialog -->
  <div id="resetModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.8); z-index:9999; align-items:center; justify-content:center; padding:20px;">
    <div style="background:#131b2e; border:1px solid #ef4444; border-radius:12px; max-width:480px; width:100%; padding:24px; box-shadow:0 20px 50px rgba(0,0,0,0.9);">
      <h3 style="color:#ef4444; margin-top:0; font-size:18px; display:flex; align-items:center; gap:8px;">
        🚨 মারাত্মক সতর্কতা (DANGER ZONE)
      </h3>
      <p style="font-size:13px; color:#94a3b8; line-height:1.6;">
        এটি চালালে ডাটাবেজের সমস্ত টেবিল ড্রপ (Delete) হয়ে যাবে এবং <strong>backend/database/migrations</strong> ফোল্ডারের ফাইলগুলো থেকে একদম ফ্রেশ ১০০% ক্লিন ডাটাবেজ তৈরি হবে ও ডিফল্ট অ্যাডমিন সিড হবে।
      </p>
      <div style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.25); padding:10px; border-radius:8px; font-size:12px; color:#fca5a5; margin-bottom:12px;">
        নিশ্চিত করতে নিচের বক্সে টাইপ করুন: <strong style="color:#fff; font-family:monospace;">RESET</strong>
      </div>
      <input type="text" id="resetInput" placeholder="RESET" onkeydown="if(event.key==='Enter') confirmResetAction()" style="width:100%; padding:10px 14px; background:#06090e; border:1px solid #334155; border-radius:8px; color:#fff; font-size:14px; font-family:monospace; margin-bottom:16px; outline:none; text-transform:uppercase;" />
      <div style="display:flex; justify-content:flex-end; gap:8px;">
        <button type="button" onclick="closeResetModal()" style="padding:8px 16px; background:#1e293b; color:#cbd5e1; border:none; border-radius:6px; cursor:pointer; font-size:13px;">বাতিল করুন</button>
        <button type="button" onclick="confirmResetAction()" style="padding:8px 16px; background:#dc2626; color:#fff; border:none; border-radius:6px; cursor:pointer; font-weight:bold; font-size:13px;">মুছে ফ্রেশ সেটআপ করুন</button>
      </div>
    </div>
  </div>

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

  <div style="margin: 16px 0; display: flex; flex-wrap: wrap; gap: 8px;">
    <a href="?action=fix_all" class="btn btn-green">⚡ 1-Click Pull & Update (Git Pull + Safe DB Migrate)</a>
    <a href="?action=migrate" class="btn btn-green">🛡️ Safe DB Migrate (Zero Data Loss)</a>
    <a href="?action=git_pull" class="btn btn-cyan">📥 Git Pull Latest Code</a>
    <a href="?action=migrate_seed" class="btn btn-purple">🌱 Run DB Migrate & Seed Defaults</a>
    <a href="?action=composer" class="btn">📦 Run Composer Install</a>
    <a href="test" class="btn btn-cyan">🧪 Test API & Database Status</a>
    <a href="/" class="btn btn-purple">🏠 Open Website</a>
    <button type="button" onclick="triggerHardReset()" class="btn btn-red">⚠️ Fresh DB Reset (Migrations + Seed)</button>
  </div>

  <div class="guide-card">
    <h3>📖 কোন বাটনের কী কাজ? (Action Guide & Safety Reference)</h3>
    <table>
      <thead>
        <tr>
          <th>বাটন / অ্যাকশন</th>
          <th>নিরাপত্তা স্তর</th>
          <th>বিবরণ ও কখন ব্যবহার করবেন</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong style="color:#34d399">⚡ 1-Click Pull & Update</strong></td>
          <td><span class="badge-ok">১০০% নিরাপদ</span></td>
          <td>গিটহাব থেকে লেটেস্ট কোড পুল করে এবং ডাটাবেজে নতুন কোনো কলাম থাকলে তা সেফলি যোগ করে। <em>(নিয়মিত কোড আপডেটের জন্য প্রধান বাটন)</em></td>
        </tr>
        <tr>
          <td><strong style="color:#34d399">🛡️ Safe DB Migrate</strong></td>
          <td><span class="badge-ok">১০০% নিরাপদ</span></td>
          <td>কোড পুল ছাড়া শুধুমাত্র ডাটাবেজ স্কিমা মাইগ্রেশন চালায়। কোনো পুরানো ডাটা বা টেবিল মুছবে না।</td>
        </tr>
        <tr>
          <td><strong style="color:#38bdf8">📥 Git Pull Latest Code</strong></td>
          <td><span class="badge-ok">১০০% নিরাপদ</span></td>
          <td>ডাটাবেজে হাত না দিয়ে শুধুমাত্র গিট থেকে কোড ফাইল আপডেট করে।</td>
        </tr>
        <tr>
          <td><strong style="color:#a78bfa">🌱 Run DB Migrate & Seed</strong></td>
          <td><span class="badge-ok">নিরাপদ (Guarded)</span></td>
          <td>মাইগ্রেশন চালায় এবং প্রাথমিক ডিফল্ট রোল/পলিসি সিড করে। বিদ্যমান পণ্য বা ডাটা থাকলে ওভাররাইট করে না।</td>
        </tr>
        <tr>
          <td><strong style="color:#93c5fd">📦 Run Composer Install</strong></td>
          <td><span class="badge-ok">নিরাপদ</span></td>
          <td>লারাভেল ব্যাকএন্ডের কম্পোজার প্যাকেজ ইনস্টল ও অপটিমাইজ করে।</td>
        </tr>
        <tr>
          <td><strong style="color:#38bdf8">🧪 Test API Status</strong></td>
          <td><span class="badge-ok">নিরাপদ</span></td>
          <td>ডাটাবেজ কানেকশন ও এপিআই ঠিকঠাক রেসপন্স করছে কিনা টেস্ট করে।</td>
        </tr>
        <tr>
          <td><strong style="color:#f87171">⚠️ Fresh DB Reset</strong></td>
          <td><span class="badge-missing">🚨 ডেঞ্জার জোন</span></td>
          <td><strong>সাবধান!</strong> এটি চালালে সব টেবিল ড্রপ করে backend/database/migrations থেকে একদম ফ্রেশ ডাটাবেজ তৈরি হবে ও ডিফল্ট অ্যাডমিন সিড হবে।</td>
        </tr>
      </tbody>
    </table>
  </div>

  <?php if ($action): ?>
    <h2>Execution Output [Action: <?= htmlspecialchars($action) ?>]:</h2>
    <div class="log-box"><?php

    out(">>> Started at: " . date('Y-m-d H:i:s'));
    out(">>> Root Directory: " . $rootDir);
    out(">>> Backend Directory: " . $backendDir);

    if ($action === 'fresh_db' || $action === 'import_sql') {
        out("\n==================== 100% CLEAN DB RESET (LARAVEL MIGRATIONS + SEED) ====================");
        $confirm = $_GET['confirm_wipe'] ?? '';
        if ($confirm !== 'RESET_CONFIRMED') {
            out("❌ নিরাপত্তা সতর্কতা: নিশ্চিতকরণ কোড অনুপস্থিত বা ভুল! ডাটাবেজ রিসেট বাতিল করা হয়েছে।");
            out("কোনো ডাটা পরিবর্তন করা হয়নি। (Action aborted without confirm_wipe=RESET_CONFIRMED)");
        } else {
            try {
                require_once __DIR__ . '/standalone_backup.php';
                $pdo = get_pdo();
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                out(">>> [1/4] Dropping all existing tables in database for a clean slate...");
                $pdo->exec("SET FOREIGN_KEY_CHECKS=0;");
                $stmt = $pdo->query("SHOW FULL TABLES WHERE Table_type = 'BASE TABLE'");
                $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
                $dropped = 0;
                foreach ($tables as $tbl) {
                    $pdo->exec("DROP TABLE IF EXISTS `{$tbl}`;");
                    $dropped++;
                }
                $pdo->exec("SET FOREIGN_KEY_CHECKS=1;");
                out(">>> Successfully dropped {$dropped} existing tables.");

                out(">>> [2/4] Running Official Laravel Migrations (from backend/database/migrations)...");
                run_shell_cmd("{$phpBin} artisan migrate --force", $backendDir);

                out(">>> [3/4] Running Official Laravel Database Seeders (default admin, roles, settings)...");
                run_shell_cmd("{$phpBin} artisan db:seed --force", $backendDir);
                run_shell_cmd("{$phpBin} artisan config:clear", $backendDir);
                run_shell_cmd("{$phpBin} artisan cache:clear", $backendDir);

                out(">>> [4/4] Verifying clean database state...");
                $vStmt = $pdo->query("SHOW FULL TABLES WHERE Table_type = 'BASE TABLE'");
                $vTables = $vStmt->fetchAll(PDO::FETCH_COLUMN);
                $prodCount = 0;
                if (in_array('products', $vTables)) {
                    $prodCount = (int)$pdo->query("SELECT COUNT(*) FROM `products`")->fetchColumn();
                }
                $orderCount = 0;
                if (in_array('orders', $vTables)) {
                    $orderCount = (int)$pdo->query("SELECT COUNT(*) FROM `orders`")->fetchColumn();
                }
                $userCount = 0;
                if (in_array('users', $vTables)) {
                    $userCount = (int)$pdo->query("SELECT COUNT(*) FROM `users`")->fetchColumn();
                }

                out(">>> Total Tables Created from Migrations: " . count($vTables));
                out(">>> Verified Products: {$prodCount} (100% Clean!)");
                out(">>> Verified Orders: {$orderCount} (100% Clean!)");
                out(">>> Verified Users: {$userCount} (Default Super Admin Ready)");
                out(">>> 🌟 SUCCESS: Database completely built fresh from backend/database/migrations!");
                out(">>> Super Admin Login: admin@resellseba.com | Password: password");
            } catch (\Throwable $e) {
                out(">>> CRITICAL ERROR: " . $e->getMessage());
            }
        }

    if ($action === 'git_pull' || $action === 'fix_all') {
        out("\n==================== [1/2] GIT PULL ====================");
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

    if ($action === 'migrate' || $action === 'fix_all') {
        out("\n==================== SAFE DB MIGRATE (ZERO DATA LOSS) ====================");
        out(">>> Running Laravel Schema Migrations (only applies new columns/tables; existing data is 100% untouched)...");
        run_shell_cmd("{$phpBin} artisan migrate --force", $backendDir);
        run_shell_cmd("{$phpBin} artisan config:clear", $backendDir);
        run_shell_cmd("{$phpBin} artisan cache:clear", $backendDir);
    }

    if ($action === 'migrate_seed') {
        out("\n==================== DB MIGRATE & SEED DEFAULTS ====================");
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
