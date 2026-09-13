import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import serverEntry from "./dist/server/server.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLIENT_DIR = path.join(__dirname, "dist", "client");

const MIME_TYPES = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain",
  ".xml": "application/xml",
  ".webmanifest": "application/manifest+json",
};

let lastHealthCheck = { time: 0, ok: true, error: null };

async function verifyDatabase(host) {
  const now = Date.now();
  // Check every 6 seconds when OK, or every 2 seconds on error
  if (now - lastHealthCheck.time < (lastHealthCheck.ok ? 6000 : 2000)) {
    return lastHealthCheck;
  }

  // 1. Try to query /api/test via Apache on localhost
  try {
    const domain = host ? host.split(":")[0] : "localhost";
    const protocol = domain === "localhost" || domain === "127.0.0.1" ? "http" : "https";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${protocol}://${domain}/api/test`, {
      headers: { Host: domain, Accept: "application/json" },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      lastHealthCheck.time = Date.now();
      if (data.db_status === "connection_failed") {
        lastHealthCheck = {
          time: Date.now(),
          ok: false,
          error: data.db_error || "MySQL Connection Failed. Please check .env database credentials.",
        };
        return lastHealthCheck;
      }
      lastHealthCheck = { time: Date.now(), ok: true, error: null };
      return lastHealthCheck;
    }
  } catch {}

  // 2. Direct PHP CLI verification (if php CLI exists on cPanel)
  try {
    const { execSync } = await import("node:child_process");
    const standaloneScript = path.join(__dirname, "api", "standalone_backup.php");
    if (fs.existsSync(standaloneScript)) {
      const cmd = `php -r "require_once '${standaloneScript.replace(/\\/g, "/")}'; try { get_pdo(); echo 'DB_OK'; } catch (Throwable \\$e) { echo 'DB_ERR:' . \\$e->getMessage(); }"`;
      const out = execSync(cmd, { timeout: 2500, encoding: "utf8" }).trim();
      lastHealthCheck.time = Date.now();
      if (out.startsWith("DB_ERR:")) {
        lastHealthCheck = {
          time: Date.now(),
          ok: false,
          error: out.slice(7).trim(),
        };
        return lastHealthCheck;
      } else if (out === "DB_OK") {
        lastHealthCheck = { time: Date.now(), ok: true, error: null };
        return lastHealthCheck;
      }
    }
  } catch {}

  return lastHealthCheck;
}

const server = http.createServer(async (req, res) => {
  try {
    const parsedUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    const pathname = decodeURIComponent(parsedUrl.pathname);

    // 1. Try to serve static file from dist/client or public
    if (pathname !== "/" && !pathname.endsWith("/")) {
      let filePath = path.join(CLIENT_DIR, pathname);
      if (!fs.existsSync(filePath)) {
        filePath = path.join(__dirname, "public", pathname);
      }
      // Prevent directory traversal
      if (fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
          const ext = path.extname(filePath).toLowerCase();
          const contentType = MIME_TYPES[ext] || "application/octet-stream";
          res.writeHead(200, {
            "Content-Type": contentType,
            "Content-Length": stat.size,
            "Cache-Control": pathname.startsWith("/assets/")
              ? "public, max-age=31536000, immutable"
              : "public, max-age=3600",
          });
          return fs.createReadStream(filePath).pipe(res);
        }
      }
    }

    // 2. Prevent API routes from ever falling through to SSR HTML
    if (pathname.startsWith("/api/") || pathname === "/api") {
      res.writeHead(503, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "API request reached SSR process. Ensure Apache routes /api directly.", path: pathname }));
      return;
    }

    // 3. Strict Database Gatekeeper: If database is disconnected or .env has invalid credentials, BLOCK the site immediately!
    const host = req.headers.host || "localhost";
    const dbHealth = await verifyDatabase(host);
    if (!dbHealth.ok) {
      res.writeHead(503, { "Content-Type": "text/html; charset=utf-8" });
      res.end(`<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ডাটাবেজ কানেকশন এরর | ResellSeba</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #090d16; color: #f1f5f9; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
    .box { background: #131b2e; border: 1px solid #ef4444; border-radius: 16px; max-width: 580px; width: 100%; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7); text-align: center; }
    .icon { width: 56px; height: 56px; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px; font-size: 26px; }
    h1 { color: #f87171; font-size: 22px; margin: 0 0 10px; }
    p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 8px 0; }
    .err-code { background: #0a0f1d; border: 1px solid #334155; border-radius: 8px; padding: 14px; font-family: monospace; font-size: 13px; color: #fca5a5; margin: 20px 0; text-align: left; word-break: break-all; }
    .solution { background: rgba(56, 189, 248, 0.1); border-left: 4px solid #38bdf8; border-radius: 6px; padding: 14px; font-size: 13px; color: #bae6fd; text-align: left; margin-top: 16px; }
    .btn { display: inline-block; margin-top: 24px; padding: 10px 24px; background: #ef4444; color: #fff; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; }
  </style>
</head>
<body>
  <div class="box">
    <div class="icon">⚠️</div>
    <h1>ডাটাবেজ কানেক্ট করা যায়নি</h1>
    <p>আপনার <code>.env</code> ফাইলে ডাটাবেজ তথ্য ভুল থাকায় সাইট লাইভ হতে পারছে না। রিয়েল ডাটাবেজ কানেকশন ছাড়া কোনো ফেক ডেটা দেখানো হবে না।</p>
    <div class="err-code">${dbHealth.error}</div>
    <div class="solution">
      <strong>সমাধান:</strong> cPanel ফাইল ম্যানেজারে গিয়ে <code>backend/.env</code> ফাইলে <code>DB_DATABASE</code>, <code>DB_USERNAME</code>, এবং <code>DB_PASSWORD</code> সঠিকভাবে সেট করুন।
    </div>
    <button class="btn" onclick="location.reload()">পুনরায় চেষ্টা করুন (Reload)</button>
  </div>
</body>
</html>`);
      return;
    }

    // 4. Delegate to TanStack Start SSR
    const fullUrl = `http://${req.headers.host || "localhost"}${req.url}`;
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value) {
        if (Array.isArray(value)) {
          for (const v of value) headers.append(key, v);
        } else {
          headers.set(key, value);
        }
      }
    }

    const hasBody = req.method !== "GET" && req.method !== "HEAD";
    let body = null;
    if (hasBody) {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      body = Buffer.concat(chunks);
    }

    const webRequest = new Request(fullUrl, {
      method: req.method,
      headers,
      body,
    });

    const webResponse = await serverEntry.fetch(webRequest);

    const responseHeaders = {};
    webResponse.headers.forEach((val, key) => {
      responseHeaders[key] = val;
    });

    res.writeHead(webResponse.status, responseHeaders);

    if (webResponse.body) {
      const reader = webResponse.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }
    res.end();
  } catch (err) {
    console.error("SSR Server Error:", err);
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "text/html" });
      res.end("<h1>Internal Server Error</h1>");
    }
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`ResellSeba SSR Server listening on port ${PORT}`);
});
