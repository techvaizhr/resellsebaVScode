import { n as __exportAll } from "./rolldown-runtime-JspESFgx.js";
import { i as setToken, n as clearToken, r as getToken, t as api } from "./api-client-CWomxlc0.js";
import { a as blobToDataUrl, r as saveUploadedFileServer } from "./upload.functions-wdbBXhar.js";
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
			try {
				if (typeof window !== "undefined") {
					const raw = localStorage.getItem("mock:media_library");
					if (raw) {
						const found = JSON.parse(raw).find((i) => i.path === path || i.filename === path.split("/").pop());
						if (found?.url) return { data: { publicUrl: found.url } };
					}
				}
			} catch {}
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
export { db as n, supabase as r, client_exports as t };
