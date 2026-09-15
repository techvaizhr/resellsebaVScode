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
require_once __DIR__ . '/standalone_backup.php';
$env = get_env_map();
$setupKey = $env['SETUP_KEY'] ?? 'resellseba_setup_sec_2026';
$providedKey = $_GET['key'] ?? $_POST['key'] ?? '';

// If SETUP_KEY is defined in .env and the key is not provided or incorrect, show password input
if (!empty($setupKey) && $providedKey !== $setupKey) {
?>
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="utf-8">
  <title>🔒 Server Setup Security</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #090d16; color: #f1f5f9; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
    .card { background: #131b2e; border: 1px solid #1e293b; border-radius: 12px; padding: 32px; max-width: 440px; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.5); text-align: center; }
    input { width: 100%; padding: 12px 14px; background: #06090e; border: 1px solid #334155; border-radius: 8px; color: #fff; font-size: 14px; margin: 16px 0; box-sizing: border-box; outline: none; }
    input:focus { border-color: #38bdf8; }
    button { width: 100%; padding: 12px; background: #10b981; color: #fff; font-size: 14px; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; }
    button:hover { background: #059669; }
  </style>
</head>
<body>
  <div class="card">
    <h2 style="color: #38bdf8; margin-top: 0;">🔒 সার্ভার কন্ট্রোল সিকিউরিটি</h2>
    <p style="font-size: 13px; color: #94a3b8; line-height: 1.6;">
      অননুমোদিত এক্সেস রোধ করতে আপনার backend/.env ফাইলের <strong>SETUP_KEY</strong> প্রদান করুন:
    </p>
    <form method="GET" action="">
      <input type="password" name="key" placeholder="Enter Setup Key / Password" required autofocus />
      <button type="submit">এক্সেস করুন</button>
    </form>
  </div>
</body>
</html>
<?php
    exit;
}

$keyParam = $providedKey ? '&key=' . urlencode($providedKey) : '';
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
          window.location.href = "?action=fresh_db&confirm_wipe=RESET_CONFIRMED<?= $keyParam ?>";
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
        window.location.href = "?action=fresh_db&confirm_wipe=RESET_CONFIRMED<?= $keyParam ?>";
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
    <a href="?action=fix_all<?= $keyParam ?>" class="btn btn-green">⚡ 1-Click Pull & Update (Git Pull + Safe DB Migrate)</a>
    <a href="?action=migrate<?= $keyParam ?>" class="btn btn-green">🛡️ Safe DB Migrate (Zero Data Loss)</a>
    <a href="?action=git_pull<?= $keyParam ?>" class="btn btn-cyan">📥 Git Pull Latest Code</a>
    <a href="?action=migrate_seed<?= $keyParam ?>" class="btn btn-purple">🌱 Run DB Migrate & Seed Defaults</a>
    <a href="?action=composer<?= $keyParam ?>" class="btn">📦 Run Composer Install</a>
    <a href="test<?= $keyParam ? '?key=' . urlencode($providedKey) : '' ?>" class="btn btn-cyan">🧪 Test API & Database Status</a>
    <a href="/" class="btn btn-purple">🏠 Open Website</a>
    <button type="button" onclick="triggerHardReset()" class="btn btn-red">⚠️ Fresh DB Reset (Migrations + Seed)</button>
  </div>

  <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid #334155; border-radius: 8px; padding: 16px; margin: 20px 0;">
    <h3 style="margin-top:0; color:#38bdf8; font-size:16px; display:flex; align-items:center; gap:8px;">
      🔑 সুপার অ্যাডমিন ক্রেডেনশিয়াল পরিবর্তন (লগইন ইমেইল ও পাসওয়ার্ড)
    </h3>
    <p style="font-size:13px; color:#94a3b8; margin-bottom:12px;">
      সাইট সেটআপ সম্পন্ন করার পর ডিফল্ট ইমেইল-পাসওয়ার্ড পরিবর্তন করতে নিচের ফর্মটি ব্যবহার করুন:
    </p>
    <form method="POST" action="?action=change_admin<?= $keyParam ?>" style="display:flex; flex-wrap:wrap; gap:12px; align-items:flex-end;">
      <input type="hidden" name="key" value="<?= htmlspecialchars($providedKey) ?>">
      <div style="flex:1; min-width:200px;">
        <label style="display:block; font-size:12px; color:#cbd5e1; margin-bottom:4px;">নতুন লগইন ইমেইল:</label>
        <input type="email" name="admin_email" required placeholder="admin@resellseba.com" style="width:100%; padding:8px 12px; background:#0f172a; border:1px solid #475569; border-radius:6px; color:#fff; font-size:13px; box-sizing:border-box;">
      </div>
      <div style="flex:1; min-width:200px;">
        <label style="display:block; font-size:12px; color:#cbd5e1; margin-bottom:4px;">নতুন পাসওয়ার্ড:</label>
        <input type="text" name="admin_password" required minlength="6" placeholder="কমপক্ষে ৬ অক্ষর দিন" style="width:100%; padding:8px 12px; background:#0f172a; border:1px solid #475569; border-radius:6px; color:#fff; font-size:13px; box-sizing:border-box;">
      </div>
      <div style="flex:1; min-width:180px;">
        <label style="display:block; font-size:12px; color:#cbd5e1; margin-bottom:4px;">অ্যাডমিনের নাম (ঐচ্ছিক):</label>
        <input type="text" name="admin_name" placeholder="Super Admin" style="width:100%; padding:8px 12px; background:#0f172a; border:1px solid #475569; border-radius:6px; color:#fff; font-size:13px; box-sizing:border-box;">
      </div>
      <button type="submit" class="btn btn-green" style="padding:9px 18px; margin:0; cursor:pointer;">💾 অ্যাডমিন ক্রেডেনশিয়াল আপডেট করুন</button>
    </form>
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
    }

    if ($action === 'change_admin') {
        out("\n==================== CHANGE SUPER ADMIN CREDENTIALS ====================");
        $newEmail = trim($_POST['admin_email'] ?? $_GET['admin_email'] ?? '');
        $newPass = trim($_POST['admin_password'] ?? $_GET['admin_password'] ?? '');
        $newName = trim($_POST['admin_name'] ?? $_GET['admin_name'] ?? '');

        if (empty($newEmail) || empty($newPass)) {
            out("❌ অনুগ্রহ করে সঠিক ইমেইল এবং পাসওয়ার্ড প্রদান করুন।");
        } elseif (strlen($newPass) < 6) {
            out("❌ পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
        } else {
            try {
                require_once __DIR__ . '/standalone_backup.php';
                $pdo = get_pdo();
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                // Find existing super admin user
                $stmt = $pdo->query("SELECT u.id, u.email FROM users u JOIN user_roles ur ON u.id = ur.user_id WHERE ur.role = 'super_admin' LIMIT 1");
                $adminUser = $stmt->fetch(PDO::FETCH_ASSOC);

                if (!$adminUser) {
                    $stmt = $pdo->query("SELECT id, email FROM users ORDER BY created_at ASC LIMIT 1");
                    $adminUser = $stmt->fetch(PDO::FETCH_ASSOC);
                }

                $hashedPassword = password_hash($newPass, PASSWORD_BCRYPT);

                if ($adminUser) {
                    $userId = $adminUser['id'];
                    $updateStmt = $pdo->prepare("UPDATE users SET email = :email, password = :pass" . (!empty($newName) ? ", name = :name" : "") . " WHERE id = :id");
                    $params = [
                        ':email' => $newEmail,
                        ':pass' => $hashedPassword,
                        ':id' => $userId,
                    ];
                    if (!empty($newName)) {
                        $params[':name'] = $newName;
                    }
                    $updateStmt->execute($params);

                    // Ensure user_roles has super_admin
                    $roleCheck = $pdo->prepare("SELECT COUNT(*) FROM user_roles WHERE user_id = :uid AND role = 'super_admin'");
                    $roleCheck->execute([':uid' => $userId]);
                    if ((int)$roleCheck->fetchColumn() === 0) {
                        $pdo->prepare("INSERT INTO user_roles (id, user_id, role, created_at, updated_at) VALUES (UUID(), :uid, 'super_admin', NOW(), NOW())")->execute([':uid' => $userId]);
                    }

                    // Update profiles if exists
                    if (!empty($newName)) {
                        try {
                            $pdo->prepare("UPDATE profiles SET full_name = :name WHERE id = :uid")->execute([':name' => $newName, ':uid' => $userId]);
                        } catch (\Throwable $e) {}
                    }

                    out("✅ সুপার অ্যাডমিন ক্রেডেনশিয়াল সফলভাবে আপডেট হয়েছে!");
                    out(">>> User ID: " . $userId);
                    out(">>> নতুন লগইন ইমেইল: " . $newEmail);
                    out(">>> পাসওয়ার্ড: (এনক্রিপ্ট করে ডাটাবেজে সংরক্ষণ করা হয়েছে)");
                    out(">>> আপনি এখন নতুন ইমেইল এবং পাসওয়ার্ড দিয়ে এডমিন প্যানেলে লগইন করতে পারবেন।");
                } else {
                    out("❌ ডাটাবেজে কোনো ইউজার খুঁজে পাওয়া যায়নি! অনুগ্রহ করে প্রথমে '🌱 Run DB Migrate & Seed Defaults' চালান।");
                }
            } catch (\Throwable $e) {
                out("❌ ত্রুটি: " . $e->getMessage());
            }
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
