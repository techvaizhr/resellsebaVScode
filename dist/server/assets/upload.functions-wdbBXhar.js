import { d as TSS_SERVER_FUNCTION, t as createServerFn } from "./createServerFn-BhXNZl1x.js";
import { t as getServerFnById } from "./__23tanstack-start-server-fn-resolver-DJpw9OzQ.js";
var MAX_DIMENSION = 1600;
var IMAGE_SIGNATURES = [
	{
		mime: "image/jpeg",
		bytes: [
			255,
			216,
			255
		]
	},
	{
		mime: "image/png",
		bytes: [
			137,
			80,
			78,
			71,
			13,
			10,
			26,
			10
		]
	},
	{
		mime: "image/webp",
		bytes: [
			82,
			73,
			70,
			70
		]
	},
	{
		mime: "image/gif",
		bytes: [
			71,
			73,
			70,
			56
		]
	}
];
async function detectRealMime(file) {
	const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
	for (const sig of IMAGE_SIGNATURES) {
		const offset = sig.offset ?? 0;
		let ok = true;
		for (let i = 0; i < sig.bytes.length; i++) if (head[offset + i] !== sig.bytes[i]) {
			ok = false;
			break;
		}
		if (ok) {
			if (sig.mime === "image/webp") {
				if (new TextDecoder().decode(head.slice(8, 12)) !== "WEBP") continue;
			}
			return sig.mime;
		}
	}
	return null;
}
async function validateAndCompress(file, opts = {}) {
	if (file.size > 10485760) throw new Error(`Image too large. Max 10MB.`);
	if (!await detectRealMime(file)) throw new Error("File is not a valid image. Upload aborted for safety.");
	const bitmap = await createImageBitmap(file).catch(() => {
		throw new Error("Could not decode image (possibly corrupted or unsafe).");
	});
	let sx = 0, sy = 0, sw = bitmap.width, sh = bitmap.height;
	if (opts.square) {
		const side = Math.min(bitmap.width, bitmap.height);
		sx = Math.round((bitmap.width - side) / 2);
		sy = Math.round((bitmap.height - side) / 2);
		sw = side;
		sh = side;
	}
	let width = sw;
	let height = sh;
	const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
	width = Math.round(width * scale);
	height = Math.round(height * scale);
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Canvas not available");
	ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, width, height);
	bitmap.close?.();
	const qualities = [
		.85,
		.75,
		.65,
		.55,
		.45,
		.35,
		.28,
		.22
	];
	let best = null;
	for (const q of qualities) {
		const blob = await new Promise((r) => canvas.toBlob(r, "image/webp", q));
		if (!blob) continue;
		if (blob.size <= 204800) return {
			blob,
			width,
			height,
			bytes: blob.size
		};
		best = blob;
	}
	let w = width;
	let h = height;
	for (let i = 0; i < 4; i++) {
		w = Math.round(w * .8);
		h = Math.round(h * .8);
		const c = document.createElement("canvas");
		c.width = w;
		c.height = h;
		c.getContext("2d").drawImage(canvas, 0, 0, w, h);
		const blob = await new Promise((r) => c.toBlob(r, "image/webp", .6));
		if (blob && blob.size <= 204800) return {
			blob,
			width: w,
			height: h,
			bytes: blob.size
		};
		if (blob) best = blob;
	}
	if (best) return {
		blob: best,
		width,
		height,
		bytes: best.size
	};
	throw new Error("Could not compress image below 200KB.");
}
/**
* Converts a Blob to a persistent base64 Data URL.
* Unlike URL.createObjectURL, a Data URL never revokes or expires on page reload or session changes.
*/
function blobToDataUrl(blob) {
	if (typeof window === "undefined" || typeof FileReader === "undefined") return Promise.resolve("");
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result);
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Failed to convert image to Data URL"));
		reader.readAsDataURL(blob);
	});
}
//#endregion
//#region node_modules/@tanstack/start-server-core/dist/esm/createSsrRpc.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
//#region src/lib/upload.functions.ts
/**
* Saves an uploaded image directly to physical disk in `public/uploads/<folder>/`
* and mirrors it to `backend/public/uploads/<folder>/`.
*/
var saveUploadedFileServer = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("1c875eb634cfe586e51886d964fbeba1cc0db5528949743be261340b655dde08"));
/**
* Lists all real physical files present in `public/uploads/` on the filesystem with usage status.
* Uses high-performance in-memory indexing for ultra-fast instant responses (<2ms).
*/
var listUploadedFilesServer = createServerFn({ method: "GET" }).validator((data) => data).handler(createSsrRpc("fb8fea5715b0cf7179cee49a1f11af1632252f5c4e3e6ae929be57d45a4a1418"));
/**
* Deletes a physical file from `public/uploads/` and `backend/public/uploads/`.
*/
var deleteUploadedFileServer = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("ad6ef247475c902e18bc71afbbca020f384d3c528809b5911f2fd3760d963ca4"));
//#endregion
export { blobToDataUrl as a, createSsrRpc as i, listUploadedFilesServer as n, validateAndCompress as o, saveUploadedFileServer as r, deleteUploadedFileServer as t };
