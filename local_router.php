<?php
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

// Serve uploads if exists
if (str_starts_with($uri, '/uploads/')) {
    $candidates = [
        __DIR__ . $uri,
        __DIR__ . '/public' . $uri,
        __DIR__ . '/backend/public' . $uri,
    ];
    foreach ($candidates as $c) {
        if (file_exists($c) && !is_dir($c)) {
            $ext = strtolower(pathinfo($c, PATHINFO_EXTENSION));
            $mime = match($ext) {
                'jpg', 'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'webp' => 'image/webp',
                'gif' => 'image/gif',
                'svg' => 'image/svg+xml',
                default => 'application/octet-stream',
            };
            header("Content-Type: $mime");
            readfile($c);
            exit;
        }
    }
}

// Route API requests
if (str_starts_with($uri, '/api/')) {
    try {
        require_once __DIR__ . '/api/standalone_backup.php';
        $pdo = get_pdo();
        // If DB connected, run local engine
        require __DIR__ . '/api/index.php';
        exit;
    } catch (\Throwable $e) {
        // If local DB is not reachable (e.g. MySQL not installed locally),
        // seamlessly proxy to live production backend
        $remoteUrl = 'https://petzavo.com' . $_SERVER['REQUEST_URI'];
        $ch = curl_init($remoteUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        
        $headers = [];
        if (function_exists('getallheaders')) {
            foreach (getallheaders() as $k => $v) {
                if (strtolower($k) !== 'host') {
                    $headers[] = "$k: $v";
                }
            }
        }
        if (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
            $headers[] = 'Authorization: ' . $_SERVER['HTTP_AUTHORIZATION'];
        }
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        
        $body = file_get_contents('php://input');
        if (!empty($body)) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
        }
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
        curl_close($ch);
        
        http_response_code($httpCode ?: 200);
        if ($contentType) header("Content-Type: $contentType");
        echo $response;
        exit;
    }
}

// Fallback to static files
if ($uri !== '/' && file_exists(__DIR__ . $uri) && !is_dir(__DIR__ . $uri)) {
    return false;
}
if (file_exists(__DIR__ . '/index.html')) {
    require __DIR__ . '/index.html';
    exit;
}
