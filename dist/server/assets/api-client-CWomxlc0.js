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
	try {
		const defaultTimeout = cleanEndpoint.startsWith("admin/backup") ? 3e5 : 15e3;
		const timeoutMs = options?.timeout ?? defaultTimeout;
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
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
//#endregion
export { setToken as i, clearToken as n, getToken as r, api as t };
