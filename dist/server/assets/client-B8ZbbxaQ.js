import { n as __exportAll } from "./rolldown-runtime-JspESFgx.js";
import { d as TSS_SERVER_FUNCTION, t as createServerFn } from "./createServerFn-BhXNZl1x.js";
import { t as getServerFnById } from "./__23tanstack-start-server-fn-resolver-ByQDtF8t.js";
//#region src/integrations/auth/token.ts
var memoryToken = null;
var TOKEN_KEY = "auth_token";
function getToken() {
	if (typeof window === "undefined") return memoryToken;
	try {
		return localStorage.getItem("auth_token") || memoryToken;
	} catch {
		return memoryToken;
	}
}
function setToken(token) {
	memoryToken = token;
	if (typeof window !== "undefined") try {
		localStorage.setItem(TOKEN_KEY, token);
	} catch {}
}
function clearToken() {
	memoryToken = null;
	if (typeof window !== "undefined") try {
		localStorage.removeItem(TOKEN_KEY);
	} catch {}
}
//#endregion
//#region src/lib/api-client.ts
var ApiError = class extends Error {
	status;
	errors;
	constructor(status, message, errors) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.errors = errors;
	}
};
var BASE_URL = "/api";
async function fetchWithConfig(endpoint, options = {}) {
	const cleanEndpoint = endpoint.replace(/^\//, "");
	const token = getToken();
	const headers = new Headers(options.headers || {});
	if (!headers.has("Accept")) headers.set("Accept", "application/json");
	if (!(options.body instanceof FormData) && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
	if (token) headers.set("Authorization", `Bearer ${token}`);
	const url = `${BASE_URL.replace(/\/$/, "")}/${cleanEndpoint}`;
	const defaultTimeout = cleanEndpoint.startsWith("admin/backup") ? 3e5 : 15e3;
	const timeoutMs = options?.timeout ?? defaultTimeout;
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
	try {
		const response = await fetch(url, {
			...options,
			headers,
			signal: options.signal || controller.signal
		});
		clearTimeout(timeoutId);
		if (response.status === 401) {
			clearToken();
			if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) window.location.href = "/login";
			throw new ApiError(401, "Unauthorized");
		}
		if (!response.ok) {
			let errorMessage = "An error occurred";
			let errors;
			try {
				const errorData = await response.json();
				errorMessage = errorData.error || errorData.message || errorMessage;
				errors = errorData.errors;
			} catch (e) {
				errorMessage = response.statusText;
			}
			throw new ApiError(response.status, errorMessage, errors);
		}
		if (response.status === 204) return {};
		if ((response.headers.get("content-type") || "").includes("text/html")) throw new ApiError(502, "Received HTML response instead of JSON from API");
		try {
			return await response.json();
		} catch (parseError) {
			throw new ApiError(502, "Failed to parse API response as JSON: " + (parseError?.message || String(parseError)));
		}
	} catch (error) {
		clearTimeout(timeoutId);
		throw error;
	}
}
var api = {
	get(path, params, config) {
		let url = path;
		if (params) {
			const searchParams = new URLSearchParams();
			Object.entries(params).forEach(([key, value]) => {
				if (value !== void 0 && value !== null) searchParams.append(key, String(value));
			});
			const qs = searchParams.toString();
			if (qs) url += `${url.includes("?") ? "&" : "?"}${qs}`;
		}
		return fetchWithConfig(url, {
			method: "GET",
			...config
		});
	},
	post(path, body, config) {
		return fetchWithConfig(path, {
			method: "POST",
			body: body ? JSON.stringify(body) : void 0,
			...config
		});
	},
	put(path, body, config) {
		return fetchWithConfig(path, {
			method: "PUT",
			body: body ? JSON.stringify(body) : void 0,
			...config
		});
	},
	patch(path, body, config) {
		return fetchWithConfig(path, {
			method: "PATCH",
			body: body ? JSON.stringify(body) : void 0,
			...config
		});
	},
	delete(path, config) {
		return fetchWithConfig(path, {
			method: "DELETE",
			...config
		});
	},
	upload(path, formData, config) {
		return fetchWithConfig(path, {
			method: "POST",
			body: formData,
			...config
		});
	}
};
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
//#region src/integrations/laravel/client.ts
var client_exports = /* @__PURE__ */ __exportAll({
	db: () => db,
	supabase: () => supabase
});
var QueryBuilder = class {
	table;
	operation = "select";
	selectColumns = "*";
	filters = [];
	payload = null;
	onConflict;
	orderClauses = [];
	limitCount;
	offsetCount;
	isSingle = false;
	isMaybeSingle = false;
	constructor(table) {
		this.table = table;
	}
	select(columns = "*", _options) {
		if (this.operation === "select") this.operation = "select";
		this.selectColumns = columns;
		return this;
	}
	insert(values) {
		this.operation = "insert";
		this.payload = values;
		return this;
	}
	upsert(values, options) {
		this.operation = "upsert";
		this.payload = values;
		this.onConflict = options?.onConflict;
		return this;
	}
	update(values) {
		this.operation = "update";
		this.payload = values;
		return this;
	}
	delete() {
		this.operation = "delete";
		return this;
	}
	eq(column, value) {
		this.filters.push({
			column,
			operator: "eq",
			value
		});
		return this;
	}
	neq(column, value) {
		this.filters.push({
			column,
			operator: "neq",
			value
		});
		return this;
	}
	gt(column, value) {
		this.filters.push({
			column,
			operator: "gt",
			value
		});
		return this;
	}
	gte(column, value) {
		this.filters.push({
			column,
			operator: "gte",
			value
		});
		return this;
	}
	lt(column, value) {
		this.filters.push({
			column,
			operator: "lt",
			value
		});
		return this;
	}
	lte(column, value) {
		this.filters.push({
			column,
			operator: "lte",
			value
		});
		return this;
	}
	like(column, pattern) {
		this.filters.push({
			column,
			operator: "like",
			value: pattern
		});
		return this;
	}
	ilike(column, pattern) {
		this.filters.push({
			column,
			operator: "ilike",
			value: pattern
		});
		return this;
	}
	is(column, value) {
		this.filters.push({
			column,
			operator: "is",
			value
		});
		return this;
	}
	in(column, values) {
		this.filters.push({
			column,
			operator: "in",
			value: values
		});
		return this;
	}
	contains(column, value) {
		this.filters.push({
			column,
			operator: "contains",
			value
		});
		return this;
	}
	containedBy(column, value) {
		this.filters.push({
			column,
			operator: "containedBy",
			value
		});
		return this;
	}
	or(filterString) {
		this.filters.push({
			column: "__or__",
			operator: "or",
			value: filterString
		});
		return this;
	}
	not(column, operator, value) {
		this.filters.push({
			column,
			operator: `not_${operator}`,
			value
		});
		return this;
	}
	order(column, options) {
		this.orderClauses.push({
			column,
			ascending: options?.ascending !== false
		});
		return this;
	}
	limit(count) {
		this.limitCount = count;
		return this;
	}
	range(from, to) {
		this.offsetCount = from;
		this.limitCount = to - from + 1;
		return this;
	}
	single() {
		this.isSingle = true;
		return this;
	}
	maybeSingle() {
		this.isMaybeSingle = true;
		return this;
	}
	async execute() {
		try {
			const body = {
				table: this.table,
				operation: this.operation,
				select: this.selectColumns,
				filters: this.filters,
				payload: this.payload,
				onConflict: this.onConflict,
				order: this.orderClauses,
				limit: this.limitCount,
				offset: this.offsetCount,
				single: this.isSingle,
				maybeSingle: this.isMaybeSingle
			};
			const res = await api.post(`/crud/${this.table}`, body);
			return {
				data: res?.data ?? res ?? null,
				error: null,
				count: res?.count ?? null
			};
		} catch (err) {
			return {
				data: null,
				error: {
					message: err?.message || String(err),
					status: err?.status || 500
				}
			};
		}
	}
	then(onfulfilled, onrejected) {
		return this.execute().then(onfulfilled, onrejected);
	}
};
var authListeners = /* @__PURE__ */ new Set();
var db = {
	from: (table) => new QueryBuilder(table),
	rpc: async (functionName, args) => {
		try {
			const data = await api.post(`/rpc/${functionName}`, args || {});
			return {
				data: data?.data ?? data ?? null,
				error: null
			};
		} catch (err) {
			return {
				data: null,
				error: {
					message: err?.message || String(err),
					status: err?.status || 500
				}
			};
		}
	},
	auth: {
		getSession: async () => {
			const token = getToken();
			if (!token) return {
				data: { session: null },
				error: null
			};
			try {
				return {
					data: { session: {
						access_token: token,
						refresh_token: token,
						user: await api.get("/auth/user")
					} },
					error: null
				};
			} catch {
				return {
					data: { session: null },
					error: null
				};
			}
		},
		getUser: async () => {
			try {
				return {
					data: { user: await api.get("/auth/user") },
					error: null
				};
			} catch (err) {
				return {
					data: { user: null },
					error: err
				};
			}
		},
		signInWithPassword: async (credentials) => {
			try {
				const res = await api.post("/auth/login", credentials);
				if (res?.token) {
					setToken(res.token);
					const session = {
						access_token: res.token,
						user: res.user
					};
					authListeners.forEach((fn) => fn("SIGNED_IN", session));
					return {
						data: {
							user: res.user,
							session
						},
						error: null
					};
				}
				return {
					data: {
						user: null,
						session: null
					},
					error: { message: "Invalid credentials" }
				};
			} catch (err) {
				return {
					data: {
						user: null,
						session: null
					},
					error: { message: err?.message || "Sign in failed" }
				};
			}
		},
		signUp: async (data) => {
			try {
				const payload = {
					email: data.email,
					password: data.password,
					name: data.options?.data?.full_name || data.email.split("@")[0],
					phone: data.options?.data?.phone,
					role: data.options?.data?.role || "reseller"
				};
				const res = await api.post("/auth/register", payload);
				if (res?.token) {
					setToken(res.token);
					const session = {
						access_token: res.token,
						user: res.user
					};
					authListeners.forEach((fn) => fn("SIGNED_IN", session));
					return {
						data: {
							user: res.user,
							session
						},
						error: null
					};
				}
				return {
					data: {
						user: null,
						session: null
					},
					error: { message: "Registration failed" }
				};
			} catch (err) {
				return {
					data: {
						user: null,
						session: null
					},
					error: { message: err?.message || "Registration failed" }
				};
			}
		},
		signOut: async () => {
			try {
				await api.post("/auth/logout");
			} catch {} finally {
				clearToken();
				authListeners.forEach((fn) => fn("SIGNED_OUT", null));
			}
			return { error: null };
		},
		onAuthStateChange: (callback) => {
			authListeners.add(callback);
			return { data: { subscription: { unsubscribe: () => {
				authListeners.delete(callback);
			} } } };
		},
		updateUser: async (attributes) => {
			try {
				const res = await api.post("/auth/update", attributes);
				return {
					data: { user: res?.user || res },
					error: null
				};
			} catch (err) {
				return {
					data: { user: null },
					error: { message: err?.message || "Failed to update profile" }
				};
			}
		},
		resetPasswordForEmail: async (email) => {
			try {
				return {
					data: await api.post("/auth/forgot-password", { email }),
					error: null
				};
			} catch (err) {
				return {
					data: null,
					error: { message: err?.message || "Failed to request password reset" }
				};
			}
		},
		setSession: async (tokens) => {
			if (tokens?.access_token) {
				setToken(tokens.access_token);
				const userRes = await db.auth.getUser();
				const session = {
					access_token: tokens.access_token,
					user: userRes.data.user
				};
				authListeners.forEach((fn) => fn("TOKEN_REFRESHED", session));
				return {
					data: {
						session,
						user: userRes.data.user
					},
					error: null
				};
			}
			return {
				data: {
					session: null,
					user: null
				},
				error: { message: "No token provided" }
			};
		}
	},
	storage: { from: (bucket) => ({
		upload: async (path, fileBody, _options) => {
			try {
				const formData = new FormData();
				formData.append("file", fileBody);
				formData.append("path", path);
				formData.append("bucket", bucket);
				formData.append("folder", bucket);
				const res = await api.upload("/upload/image", formData);
				if (res?.url && !res.url.includes("/placeholder.svg")) return {
					data: {
						path: res.path || path,
						fullPath: res.url
					},
					error: null
				};
			} catch {}
			try {
				if (fileBody instanceof Blob) {
					const saved = await saveUploadedFileServer({ data: {
						base64: await blobToDataUrl(fileBody),
						folder: bucket,
						filename: path.split("/").pop()
					} });
					return {
						data: {
							path: saved.path,
							fullPath: saved.url
						},
						error: null
					};
				}
			} catch (err) {
				console.error("Local disk file save error:", err);
			}
			return {
				data: {
					path,
					fullPath: path
				},
				error: null
			};
		},
		createSignedUrl: async (path, _expiresIn) => {
			if (path.startsWith("http") || path.startsWith("blob:") || path.startsWith("data:")) return {
				data: { signedUrl: path },
				error: null
			};
			return {
				data: { signedUrl: `${"/api".replace(/\/api$/, "") || (typeof window !== "undefined" ? "" : "http://127.0.0.1:8000")}/storage/${bucket}/${path.replace(/^\//, "")}` },
				error: null
			};
		},
		getPublicUrl: (path) => {
			if (path.startsWith("http") || path.startsWith("blob:") || path.startsWith("data:")) return { data: { publicUrl: path } };
			return { data: { publicUrl: `${"/api".replace(/\/api$/, "") || (typeof window !== "undefined" ? "" : "http://127.0.0.1:8000")}/storage/${bucket}/${path.replace(/^\//, "")}` } };
		},
		remove: async (paths) => {
			try {
				await api.post("/upload/delete", {
					bucket,
					paths
				});
				return {
					data: paths,
					error: null
				};
			} catch (err) {
				return {
					data: null,
					error: { message: err?.message || "Delete failed" }
				};
			}
		}
	}) }
};
var supabase = db;
//#endregion
export { listUploadedFilesServer as a, blobToDataUrl as c, clearToken as d, getToken as f, deleteUploadedFileServer as i, validateAndCompress as l, db as n, saveUploadedFileServer as o, supabase as r, createSsrRpc as s, client_exports as t, api as u };
