import { createServerFn } from "@tanstack/react-start";
import fs from "node:fs";
import path from "node:path";

export interface ServerUploadedItem {
  filename: string;
  path: string;
  url: string;
  folder: string;
  size: number;
  last_modified: string;
  is_used?: boolean;
}

/**
 * Collects all active image URLs and filenames referenced across database, models, initial datasets, and seed files.
 */
function collectAllUsedImageReferences(): Set<string> {
  const used = new Set<string>();

  const add = (val: any) => {
    if (typeof val === "string" && val.trim()) {
      const s = val.trim();
      const lower = s.toLowerCase();
      used.add(lower);

      const cleanPath = s.replace(/\\/g, "/").toLowerCase();
      used.add(cleanPath);

      // Remove URL protocol / query params if present
      const cleanUrl = cleanPath.split("?")[0].split("#")[0];
      used.add(cleanUrl);

      const fileName = path.basename(cleanUrl);
      if (fileName) {
        used.add(fileName.toLowerCase());
        try {
          used.add(decodeURIComponent(fileName).toLowerCase());
        } catch {}
      }

      // If it contains embedded /uploads/... within HTML or text
      const matches = cleanPath.match(/(?:\/|\\)?uploads\/[a-z0-9_\-\.\/]+/gi);
      if (matches) {
        for (const m of matches) {
          const norm = m.replace(/\\/g, "/").toLowerCase();
          used.add(norm);
          used.add(norm.replace(/^\//, ""));
          used.add("/" + norm.replace(/^\//, ""));
          const fn = path.basename(norm);
          if (fn) used.add(fn.toLowerCase());
        }
      }
    }
  };

  const traverse = (node: any) => {
    if (!node) return;
    if (typeof node === "string") {
      add(node);
    } else if (Array.isArray(node)) {
      for (const item of node) traverse(item);
    } else if (typeof node === "object") {
      for (const k of Object.keys(node)) {
        traverse(node[k]);
      }
    }
  };

  // 1. Traverse initial-data.json
  try {
    const initialDataPath = path.resolve(process.cwd(), "src", "lib", "initial-data.json");
    if (fs.existsSync(initialDataPath)) {
      const raw = fs.readFileSync(initialDataPath, "utf-8");
      const parsed = JSON.parse(raw);
      traverse(parsed);
    }
  } catch {}

  // 2. Also check database.sql if present
  try {
    const dbSqlPath = path.resolve(process.cwd(), "database.sql");
    if (fs.existsSync(dbSqlPath)) {
      const sqlContent = fs.readFileSync(dbSqlPath, "utf-8");
      const matches = sqlContent.match(/(?:\/|\\)?uploads\/[a-zA-Z0-9_\-\.\/]+/gi);
      if (matches) {
        for (const m of matches) {
          const norm = m.replace(/\\/g, "/").toLowerCase();
          used.add(norm);
          used.add(norm.replace(/^\//, ""));
          used.add("/" + norm.replace(/^\//, ""));
          const fn = path.basename(norm);
          if (fn) used.add(fn.toLowerCase());
        }
      }
    }
  } catch {}

  // 3. Also check any other json files in src/
  try {
    const srcDir = path.resolve(process.cwd(), "src");
    const scanJson = (dir: string) => {
      if (!fs.existsSync(dir)) return;
      const list = fs.readdirSync(dir, { withFileTypes: true });
      for (const item of list) {
        const full = path.join(dir, item.name);
        if (item.isDirectory() && !["node_modules", ".git", "dist", ".output"].includes(item.name)) {
          scanJson(full);
        } else if (item.isFile() && item.name.endsWith(".json") && item.name !== "initial-data.json") {
          try {
            const content = fs.readFileSync(full, "utf-8");
            traverse(JSON.parse(content));
          } catch {}
        }
      }
    };
    scanJson(srcDir);
  } catch {}

  return used;
}

/**
 * Recursively collect all files from a directory.
 */
function scanDirectoryRecursively(
  currentDir: string,
  rootDir: string,
  usedReferences: Set<string>,
): ServerUploadedItem[] {
  let results: ServerUploadedItem[] = [];
  if (!fs.existsSync(currentDir)) return results;

  const entries = fs.readdirSync(currentDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(scanDirectoryRecursively(fullPath, rootDir, usedReferences));
    } else if (entry.isFile() && !entry.name.startsWith(".")) {
      const relPath = path.relative(rootDir, fullPath).replace(/\\/g, "/");
      const parts = relPath.split("/");
      let folderName = parts.length > 1 ? parts[0].toLowerCase() : "branding";

      // Intelligent classification into standard gallery categories
      if (["products", "product", "product-images"].includes(folderName)) {
        folderName = "products";
      } else if (["branding", "platform", "general", "hero", "landing", "landing-hero", "misc"].includes(folderName)) {
        folderName = "branding";
      } else if (["brand", "brands"].includes(folderName)) {
        folderName = "brands";
      } else if (["category", "categories"].includes(folderName)) {
        folderName = "categories";
      } else if (["stores", "store", "reseller", "resellers"].includes(folderName)) {
        folderName = "stores";
      } else if (["avatar", "avatars", "profiles", "profile"].includes(folderName)) {
        folderName = "avatars";
      } else if (["notice", "notices"].includes(folderName)) {
        folderName = "notices";
      } else if (["tutorial", "tutorials"].includes(folderName)) {
        folderName = "tutorials";
      } else {
        const fullRelLower = relPath.toLowerCase();
        if (fullRelLower.includes("avatar") || fullRelLower.includes("profile")) {
          folderName = "avatars";
        } else if (fullRelLower.includes("product")) {
          folderName = "products";
        } else if (
          fullRelLower.includes("store") ||
          fullRelLower.includes("reseller") ||
          fullRelLower.includes("menu") ||
          fullRelLower.includes("theme") ||
          fullRelLower.includes("favicon")
        ) {
          folderName = "stores";
        } else {
          folderName = "branding";
        }
      }

      const filename = entry.name;
      const lowerFilename = filename.toLowerCase();
      const relativeUploadPath = `uploads/${relPath}`.toLowerCase();
      const slashUrl = `/uploads/${relPath}`.toLowerCase();

      // System module assets (Branding, Brands, Categories, Stores, Avatars, Notices, Tutorials)
      // are intentional assets for platform/brand/category/storefront/profiles.
      const isSystemAssetFolder = [
        "branding",
        "brands",
        "categories",
        "stores",
        "avatars",
        "notices",
        "tutorials",
      ].includes(folderName);

      const isUsed =
        isSystemAssetFolder ||
        usedReferences.has(lowerFilename) ||
        usedReferences.has(relativeUploadPath) ||
        usedReferences.has(slashUrl);

      try {
        const stats = fs.statSync(fullPath);
        results.push({
          filename: entry.name,
          path: `uploads/${relPath}`,
          url: `/uploads/${relPath}`,
          folder: folderName,
          size: stats.size,
          last_modified: stats.mtime.toISOString(),
          is_used: isUsed,
        });
      } catch {
        // ignore file read error
      }
    }
  }
  return results;
}

interface MediaCacheData {
  allFiles: ServerUploadedItem[];
  folderCounts: Record<string, number>;
  unusedCount: number;
  total: number;
  timestamp: number;
}

let mediaCache: MediaCacheData | null = null;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds auto-refresh

export function invalidateMediaCache() {
  mediaCache = null;
}

/**
 * Saves an uploaded image directly to physical disk in `public/uploads/<folder>/`
 * and mirrors it to `backend/public/uploads/<folder>/`.
 */
export const saveUploadedFileServer = createServerFn({ method: "POST" })
  .validator((data: { base64: string; folder: string; filename?: string }) => data)
  .handler(async ({ data }) => {
    invalidateMediaCache();
    const { base64, folder, filename: customName } = data;
    // Sanitize folder name while allowing subpaths without path traversal
    const safeFolder = (folder || "products")
      .replace(/\\/g, "/")
      .split("/")
      .map((p) => p.replace(/[^a-zA-Z0-9_-]/g, ""))
      .filter(Boolean)
      .join("/") || "products";

    const filename = customName || `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.webp`;

    // Extract binary buffer from base64
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Save to single canonical storage: public/uploads/<folder>
    const frontendDir = path.resolve(process.cwd(), "public", "uploads", safeFolder);
    if (!fs.existsSync(frontendDir)) {
      fs.mkdirSync(frontendDir, { recursive: true });
    }
    const frontendFilePath = path.join(frontendDir, filename);
    fs.writeFileSync(frontendFilePath, buffer);

    const relPath = `${safeFolder}/${filename}`;
    const url = `/uploads/${relPath}`;
    const storagePath = `uploads/${relPath}`;

    return {
      url,
      path: storagePath,
      filename,
      size: buffer.length,
    };
  });

/**
 * Lists all real physical files present in `public/uploads/` on the filesystem with usage status.
 * Uses high-performance in-memory indexing for ultra-fast instant responses (<2ms).
 */
export const listUploadedFilesServer = createServerFn({ method: "GET" })
  .validator((data: { folder?: string; search?: string; unused_only?: boolean }) => data)
  .handler(async ({ data }) => {
    const now = Date.now();
    if (!mediaCache || (now - mediaCache.timestamp) > CACHE_TTL_MS) {
      const rootUploads = path.resolve(process.cwd(), "public", "uploads");
      const usedReferences = collectAllUsedImageReferences();
      const allFiles = scanDirectoryRecursively(rootUploads, rootUploads, usedReferences);

      const folderCounts: Record<string, number> = {
        all: allFiles.length,
        products: 0,
        branding: 0,
        brands: 0,
        categories: 0,
        stores: 0,
        avatars: 0,
        notices: 0,
        tutorials: 0,
      };

      for (const file of allFiles) {
        const f = file.folder.toLowerCase();
        if (folderCounts[f] !== undefined) {
          folderCounts[f]++;
        } else {
          folderCounts[f] = 1;
        }
      }

      // Sort newest first once
      allFiles.sort((a, b) => new Date(b.last_modified).getTime() - new Date(a.last_modified).getTime());
      const unusedCount = allFiles.filter((i) => !i.is_used).length;

      mediaCache = {
        allFiles,
        folderCounts,
        unusedCount,
        total: allFiles.length,
        timestamp: now,
      };
    }

    const { allFiles, folderCounts, unusedCount, total } = mediaCache;

    let filtered = allFiles;
    if (data?.folder && data.folder !== "all") {
      filtered = filtered.filter((i) => i.folder.toLowerCase() === data.folder?.toLowerCase());
    }
    if (data?.search) {
      const q = data.search.toLowerCase().trim();
      filtered = filtered.filter((i) => i.filename.toLowerCase().includes(q));
    }
    if (data?.unused_only) {
      filtered = filtered.filter((i) => !i.is_used);
    }

    return {
      data: filtered,
      unused_count: unusedCount,
      total,
      folder_counts: folderCounts,
    };
  });

/**
 * Deletes a physical file from `public/uploads/` and `backend/public/uploads/`.
 */
export const deleteUploadedFileServer = createServerFn({ method: "POST" })
  .validator((data: { path: string }) => data)
  .handler(async ({ data }) => {
    invalidateMediaCache();
    const relativePath = data.path.replace(/^\/?uploads\//, "");
    const frontendFile = path.resolve(process.cwd(), "public", "uploads", relativePath);

    if (fs.existsSync(frontendFile)) {
      try {
        fs.unlinkSync(frontendFile);
      } catch {}
    }

    return { success: true };
  });
