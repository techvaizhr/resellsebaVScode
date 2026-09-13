import { t as createServerFn } from "./createServerFn-BhXNZl1x.js";
import { t as createServerRpc } from "./createServerRpc-BQTLusYf.js";
import fs from "node:fs";
import path from "node:path";
//#region src/lib/upload.functions.ts?tss-serverfn-split
/**
* Collects all active image URLs and filenames referenced across database, models, initial datasets, and seed files.
*/
function collectAllUsedImageReferences() {
	const used = /* @__PURE__ */ new Set();
	const add = (val) => {
		if (typeof val === "string" && val.trim()) {
			const s = val.trim();
			const lower = s.toLowerCase();
			used.add(lower);
			const cleanPath = s.replace(/\\/g, "/").toLowerCase();
			used.add(cleanPath);
			const cleanUrl = cleanPath.split("?")[0].split("#")[0];
			used.add(cleanUrl);
			const fileName = path.basename(cleanUrl);
			if (fileName) {
				used.add(fileName.toLowerCase());
				try {
					used.add(decodeURIComponent(fileName).toLowerCase());
				} catch {}
			}
			const matches = cleanPath.match(/(?:\/|\\)?uploads\/[a-z0-9_\-\.\/]+/gi);
			if (matches) for (const m of matches) {
				const norm = m.replace(/\\/g, "/").toLowerCase();
				used.add(norm);
				used.add(norm.replace(/^\//, ""));
				used.add("/" + norm.replace(/^\//, ""));
				const fn = path.basename(norm);
				if (fn) used.add(fn.toLowerCase());
			}
		}
	};
	const traverse = (node) => {
		if (!node) return;
		if (typeof node === "string") add(node);
		else if (Array.isArray(node)) for (const item of node) traverse(item);
		else if (typeof node === "object") for (const k of Object.keys(node)) traverse(node[k]);
	};
	try {
		const initialDataPath = path.resolve(process.cwd(), "src", "lib", "initial-data.json");
		if (fs.existsSync(initialDataPath)) {
			const raw = fs.readFileSync(initialDataPath, "utf-8");
			traverse(JSON.parse(raw));
		}
	} catch {}
	try {
		const dbSqlPath = path.resolve(process.cwd(), "database.sql");
		if (fs.existsSync(dbSqlPath)) {
			const matches = fs.readFileSync(dbSqlPath, "utf-8").match(/(?:\/|\\)?uploads\/[a-zA-Z0-9_\-\.\/]+/gi);
			if (matches) for (const m of matches) {
				const norm = m.replace(/\\/g, "/").toLowerCase();
				used.add(norm);
				used.add(norm.replace(/^\//, ""));
				used.add("/" + norm.replace(/^\//, ""));
				const fn = path.basename(norm);
				if (fn) used.add(fn.toLowerCase());
			}
		}
	} catch {}
	try {
		const srcDir = path.resolve(process.cwd(), "src");
		const scanJson = (dir) => {
			if (!fs.existsSync(dir)) return;
			const list = fs.readdirSync(dir, { withFileTypes: true });
			for (const item of list) {
				const full = path.join(dir, item.name);
				if (item.isDirectory() && ![
					"node_modules",
					".git",
					"dist",
					".output"
				].includes(item.name)) scanJson(full);
				else if (item.isFile() && item.name.endsWith(".json") && item.name !== "initial-data.json") try {
					const content = fs.readFileSync(full, "utf-8");
					traverse(JSON.parse(content));
				} catch {}
			}
		};
		scanJson(srcDir);
	} catch {}
	return used;
}
/**
* Recursively collect all files from a directory.
*/
function scanDirectoryRecursively(currentDir, rootDir, usedReferences) {
	let results = [];
	if (!fs.existsSync(currentDir)) return results;
	const entries = fs.readdirSync(currentDir, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = path.join(currentDir, entry.name);
		if (entry.isDirectory()) results = results.concat(scanDirectoryRecursively(fullPath, rootDir, usedReferences));
		else if (entry.isFile() && !entry.name.startsWith(".")) {
			const relPath = path.relative(rootDir, fullPath).replace(/\\/g, "/");
			const parts = relPath.split("/");
			let folderName = parts.length > 1 ? parts[0].toLowerCase() : "branding";
			if ([
				"products",
				"product",
				"product-images"
			].includes(folderName)) folderName = "products";
			else if ([
				"branding",
				"platform",
				"general",
				"hero",
				"landing",
				"landing-hero",
				"misc"
			].includes(folderName)) folderName = "branding";
			else if (["brand", "brands"].includes(folderName)) folderName = "brands";
			else if (["category", "categories"].includes(folderName)) folderName = "categories";
			else if ([
				"stores",
				"store",
				"reseller",
				"resellers"
			].includes(folderName)) folderName = "stores";
			else if ([
				"avatar",
				"avatars",
				"profiles",
				"profile"
			].includes(folderName)) folderName = "avatars";
			else if (["notice", "notices"].includes(folderName)) folderName = "notices";
			else if (["tutorial", "tutorials"].includes(folderName)) folderName = "tutorials";
			else {
				const fullRelLower = relPath.toLowerCase();
				if (fullRelLower.includes("avatar") || fullRelLower.includes("profile")) folderName = "avatars";
				else if (fullRelLower.includes("product")) folderName = "products";
				else if (fullRelLower.includes("store") || fullRelLower.includes("reseller") || fullRelLower.includes("menu") || fullRelLower.includes("theme") || fullRelLower.includes("favicon")) folderName = "stores";
				else folderName = "branding";
			}
			const lowerFilename = entry.name.toLowerCase();
			const relativeUploadPath = `uploads/${relPath}`.toLowerCase();
			const slashUrl = `/uploads/${relPath}`.toLowerCase();
			const isUsed = [
				"branding",
				"brands",
				"categories",
				"stores",
				"avatars",
				"notices",
				"tutorials"
			].includes(folderName) || usedReferences.has(lowerFilename) || usedReferences.has(relativeUploadPath) || usedReferences.has(slashUrl);
			try {
				const stats = fs.statSync(fullPath);
				results.push({
					filename: entry.name,
					path: `uploads/${relPath}`,
					url: `/uploads/${relPath}`,
					folder: folderName,
					size: stats.size,
					last_modified: stats.mtime.toISOString(),
					is_used: isUsed
				});
			} catch {}
		}
	}
	return results;
}
var mediaCache = null;
var CACHE_TTL_MS = 60 * 1e3;
function invalidateMediaCache() {
	mediaCache = null;
}
var saveUploadedFileServer_createServerFn_handler = createServerRpc({
	id: "1c875eb634cfe586e51886d964fbeba1cc0db5528949743be261340b655dde08",
	name: "saveUploadedFileServer",
	filename: "src/lib/upload.functions.ts"
}, (opts) => saveUploadedFileServer.__executeServer(opts));
var saveUploadedFileServer = createServerFn({ method: "POST" }).validator((data) => data).handler(saveUploadedFileServer_createServerFn_handler, async ({ data }) => {
	invalidateMediaCache();
	const { base64, folder, filename: customName } = data;
	const safeFolder = (folder || "products").replace(/\\/g, "/").split("/").map((p) => p.replace(/[^a-zA-Z0-9_-]/g, "")).filter(Boolean).join("/") || "products";
	const filename = customName || `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.webp`;
	const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
	const buffer = Buffer.from(base64Data, "base64");
	const frontendDir = path.resolve(process.cwd(), "public", "uploads", safeFolder);
	if (!fs.existsSync(frontendDir)) fs.mkdirSync(frontendDir, { recursive: true });
	const frontendFilePath = path.join(frontendDir, filename);
	fs.writeFileSync(frontendFilePath, buffer);
	const relPath = `${safeFolder}/${filename}`;
	return {
		url: `/uploads/${relPath}`,
		path: `uploads/${relPath}`,
		filename,
		size: buffer.length
	};
});
var listUploadedFilesServer_createServerFn_handler = createServerRpc({
	id: "fb8fea5715b0cf7179cee49a1f11af1632252f5c4e3e6ae929be57d45a4a1418",
	name: "listUploadedFilesServer",
	filename: "src/lib/upload.functions.ts"
}, (opts) => listUploadedFilesServer.__executeServer(opts));
var listUploadedFilesServer = createServerFn({ method: "GET" }).validator((data) => data).handler(listUploadedFilesServer_createServerFn_handler, async ({ data }) => {
	const now = Date.now();
	if (!mediaCache || now - mediaCache.timestamp > CACHE_TTL_MS) {
		const rootUploads = path.resolve(process.cwd(), "public", "uploads");
		const allFiles = scanDirectoryRecursively(rootUploads, rootUploads, collectAllUsedImageReferences());
		const folderCounts = {
			all: allFiles.length,
			products: 0,
			branding: 0,
			brands: 0,
			categories: 0,
			stores: 0,
			avatars: 0,
			notices: 0,
			tutorials: 0
		};
		for (const file of allFiles) {
			const f = file.folder.toLowerCase();
			if (folderCounts[f] !== void 0) folderCounts[f]++;
			else folderCounts[f] = 1;
		}
		allFiles.sort((a, b) => new Date(b.last_modified).getTime() - new Date(a.last_modified).getTime());
		mediaCache = {
			allFiles,
			folderCounts,
			unusedCount: allFiles.filter((i) => !i.is_used).length,
			total: allFiles.length,
			timestamp: now
		};
	}
	const { allFiles, folderCounts, unusedCount, total } = mediaCache;
	let filtered = allFiles;
	if (data?.folder && data.folder !== "all") filtered = filtered.filter((i) => i.folder.toLowerCase() === data.folder?.toLowerCase());
	if (data?.search) {
		const q = data.search.toLowerCase().trim();
		filtered = filtered.filter((i) => i.filename.toLowerCase().includes(q));
	}
	if (data?.unused_only) filtered = filtered.filter((i) => !i.is_used);
	return {
		data: filtered,
		unused_count: unusedCount,
		total,
		folder_counts: folderCounts
	};
});
var deleteUploadedFileServer_createServerFn_handler = createServerRpc({
	id: "ad6ef247475c902e18bc71afbbca020f384d3c528809b5911f2fd3760d963ca4",
	name: "deleteUploadedFileServer",
	filename: "src/lib/upload.functions.ts"
}, (opts) => deleteUploadedFileServer.__executeServer(opts));
var deleteUploadedFileServer = createServerFn({ method: "POST" }).validator((data) => data).handler(deleteUploadedFileServer_createServerFn_handler, async ({ data }) => {
	invalidateMediaCache();
	const relativePath = data.path.replace(/^\/?uploads\//, "");
	const frontendFile = path.resolve(process.cwd(), "public", "uploads", relativePath);
	if (fs.existsSync(frontendFile)) try {
		fs.unlinkSync(frontendFile);
	} catch {}
	return { success: true };
});
//#endregion
export { deleteUploadedFileServer_createServerFn_handler, listUploadedFilesServer_createServerFn_handler, saveUploadedFileServer_createServerFn_handler };
