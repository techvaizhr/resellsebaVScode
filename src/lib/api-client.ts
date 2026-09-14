import { getToken, clearToken, setToken } from "@/integrations/auth/token";

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

function getBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_URL;
  if (typeof window !== "undefined") {
    return envUrl || "/api";
  }
  // Server-side (Node.js SSR) requires absolute URL
  if (envUrl && envUrl.startsWith("http")) {
    return envUrl;
  }
  const host = (typeof process !== "undefined" && process.env?.APP_URL)
    ? process.env.APP_URL
    : "http://127.0.0.1:3000";
  const prefix = (envUrl || "/api").startsWith("/") ? (envUrl || "/api") : `/${envUrl || "api"}`;
  return `${host.replace(/\/$/, "")}${prefix}`;
}

async function fetchWithConfig(endpoint: string, options: RequestInit = {}) {
  const cleanEndpoint = endpoint.replace(/^\//, "");

  const token = getToken();

  const headers = new Headers(options.headers || {});

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = `${getBaseUrl().replace(/\/$/, "")}/${cleanEndpoint}`;

  const isBackupEndpoint = cleanEndpoint.startsWith("admin/backup");
  const defaultTimeout = isBackupEndpoint ? 300000 : 15000;
  const timeoutMs = (options as any)?.timeout ?? defaultTimeout;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: options.signal || controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.status === 401) {
      clearToken();
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
      throw new ApiError(401, "Unauthorized");
    }

    if (!response.ok) {
      let errorMessage = "An error occurred";
      let errors: Record<string, string[]> | undefined;

      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
        errors = errorData.errors;
      } catch (e) {
        errorMessage = response.statusText;
      }

      throw new ApiError(response.status, errorMessage, errors);
    }

    if (response.status === 204) {
      return {} as any;
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      throw new ApiError(502, "Received HTML response instead of JSON from API");
    }

    try {
      return await response.json();
    } catch (parseError: any) {
      throw new ApiError(502, "Failed to parse API response as JSON: " + (parseError?.message || String(parseError)));
    }
  } catch (error: any) {
    clearTimeout(timeoutId);
    // DO NOT fallback to mock! Only real live data from the database is allowed.
    throw error;
  }
}

export const api = {
  get<T>(path: string, params?: Record<string, any>, config?: RequestInit & { timeout?: number }): Promise<T> {
    let url = path;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const qs = searchParams.toString();
      if (qs) {
        url += `${url.includes("?") ? "&" : "?"}${qs}`;
      }
    }
    return fetchWithConfig(url, { method: "GET", ...config });
  },

  post<T>(path: string, body?: any, config?: RequestInit & { timeout?: number }): Promise<T> {
    return fetchWithConfig(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      ...config,
    });
  },

  put<T>(path: string, body?: any, config?: RequestInit & { timeout?: number }): Promise<T> {
    return fetchWithConfig(path, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
      ...config,
    });
  },

  patch<T>(path: string, body?: any, config?: RequestInit & { timeout?: number }): Promise<T> {
    return fetchWithConfig(path, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
      ...config,
    });
  },

  delete<T>(path: string, config?: RequestInit & { timeout?: number }): Promise<T> {
    return fetchWithConfig(path, { method: "DELETE", ...config });
  },

  upload<T>(path: string, formData: FormData, config?: RequestInit & { timeout?: number }): Promise<T> {
    return fetchWithConfig(path, {
      method: "POST",
      body: formData,
      ...config,
    });
  },
};
