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
};

const server = http.createServer(async (req, res) => {
  try {
    const parsedUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    const pathname = decodeURIComponent(parsedUrl.pathname);

    // 1. Try to serve static file from dist/client
    if (pathname !== "/" && !pathname.endsWith("/")) {
      const filePath = path.join(CLIENT_DIR, pathname);
      // Prevent directory traversal
      if (filePath.startsWith(CLIENT_DIR) && fs.existsSync(filePath)) {
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

    // 2. Delegate to TanStack Start SSR
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
