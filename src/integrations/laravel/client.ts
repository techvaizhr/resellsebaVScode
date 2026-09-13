import { api } from "@/lib/api-client";
import { getToken, setToken, clearToken } from "@/integrations/auth/token";
import { blobToDataUrl } from "@/lib/image-upload";
import { saveUploadedFileServer } from "@/lib/upload.functions";

class QueryBuilder<T = any> implements PromiseLike<{ data: T | null; error: any; count?: number | null }> {
  private table: string;
  private operation: "select" | "insert" | "update" | "delete" | "upsert" = "select";
  private selectColumns = "*";
  private filters: Array<{ column: string; operator: string; value: any }> = [];
  private payload: any = null;
  private onConflict?: string;
  private orderClauses: Array<{ column: string; ascending: boolean }> = [];
  private limitCount?: number;
  private offsetCount?: number;
  private isSingle = false;
  private isMaybeSingle = false;

  constructor(table: string) {
    this.table = table;
  }

  select(columns: string = "*", _options?: { count?: "exact" | "planned" | "estimated"; head?: boolean }) {
    if (this.operation === "select") {
      this.operation = "select";
    }
    this.selectColumns = columns;
    return this;
  }

  insert(values: any) {
    this.operation = "insert";
    this.payload = values;
    return this;
  }

  upsert(values: any, options?: { onConflict?: string; ignoreDuplicates?: boolean }) {
    this.operation = "upsert";
    this.payload = values;
    this.onConflict = options?.onConflict;
    return this;
  }

  update(values: any) {
    this.operation = "update";
    this.payload = values;
    return this;
  }

  delete() {
    this.operation = "delete";
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push({ column, operator: "eq", value });
    return this;
  }

  neq(column: string, value: any) {
    this.filters.push({ column, operator: "neq", value });
    return this;
  }

  gt(column: string, value: any) {
    this.filters.push({ column, operator: "gt", value });
    return this;
  }

  gte(column: string, value: any) {
    this.filters.push({ column, operator: "gte", value });
    return this;
  }

  lt(column: string, value: any) {
    this.filters.push({ column, operator: "lt", value });
    return this;
  }

  lte(column: string, value: any) {
    this.filters.push({ column, operator: "lte", value });
    return this;
  }

  like(column: string, pattern: string) {
    this.filters.push({ column, operator: "like", value: pattern });
    return this;
  }

  ilike(column: string, pattern: string) {
    this.filters.push({ column, operator: "ilike", value: pattern });
    return this;
  }

  is(column: string, value: any) {
    this.filters.push({ column, operator: "is", value });
    return this;
  }

  in(column: string, values: any[]) {
    this.filters.push({ column, operator: "in", value: values });
    return this;
  }

  contains(column: string, value: any) {
    this.filters.push({ column, operator: "contains", value });
    return this;
  }

  containedBy(column: string, value: any) {
    this.filters.push({ column, operator: "containedBy", value });
    return this;
  }

  or(filterString: string) {
    this.filters.push({ column: "__or__", operator: "or", value: filterString });
    return this;
  }

  not(column: string, operator: string, value: any) {
    this.filters.push({ column, operator: `not_${operator}`, value });
    return this;
  }

  order(column: string, options?: { ascending?: boolean; nullsFirst?: boolean }) {
    this.orderClauses.push({
      column,
      ascending: options?.ascending !== false,
    });
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  range(from: number, to: number) {
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

  async execute(): Promise<{ data: any; error: any; count?: number | null }> {
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
        maybeSingle: this.isMaybeSingle,
      };

      const res = await api.post<any>(`/crud/${this.table}`, body);
      return { data: res?.data ?? res ?? null, error: null, count: res?.count ?? null };
    } catch (err: any) {
      return { data: null, error: { message: err?.message || String(err), status: err?.status || 500 } };
    }
  }

  then<TResult1 = { data: T | null; error: any; count?: number | null }, TResult2 = never>(
    onfulfilled?: ((value: { data: T | null; error: any; count?: number | null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }
}

const authListeners = new Set<(event: string, session: any) => void>();

export const db = {
  from: <T = any>(table: string) => new QueryBuilder<T>(table),

  rpc: async <T = any>(functionName: string, args?: Record<string, any>): Promise<{ data: T | null; error: any }> => {
    try {
      const data = await api.post<T>(`/rpc/${functionName}`, args || {});
      return { data: (data as any)?.data ?? data ?? null, error: null };
    } catch (err: any) {
      return { data: null, error: { message: err?.message || String(err), status: err?.status || 500 } };
    }
  },

  auth: {
    getSession: async () => {
      const token = getToken();
      if (!token) return { data: { session: null }, error: null };
      try {
        const user = await api.get<any>("/auth/user");
        const session = { access_token: token, refresh_token: token, user };
        return { data: { session }, error: null };
      } catch {
        return { data: { session: null }, error: null };
      }
    },

    getUser: async () => {
      try {
        const user = await api.get<any>("/auth/user");
        return { data: { user }, error: null };
      } catch (err: any) {
        return { data: { user: null }, error: err };
      }
    },

    signInWithPassword: async (credentials: { email?: string; phone?: string; password: string }) => {
      try {
        const res = await api.post<{ token: string; user: any }>("/auth/login", credentials);
        if (res?.token) {
          setToken(res.token);
          const session = { access_token: res.token, user: res.user };
          authListeners.forEach((fn) => fn("SIGNED_IN", session));
          return { data: { user: res.user, session }, error: null };
        }
        return { data: { user: null, session: null }, error: { message: "Invalid credentials" } };
      } catch (err: any) {
        return { data: { user: null, session: null }, error: { message: err?.message || "Sign in failed" } };
      }
    },

    signUp: async (data: { email: string; password: string; options?: any }) => {
      try {
        const payload = {
          email: data.email,
          password: data.password,
          name: data.options?.data?.full_name || data.email.split("@")[0],
          phone: data.options?.data?.phone,
          role: data.options?.data?.role || "reseller",
        };
        const res = await api.post<{ token: string; user: any }>("/auth/register", payload);
        if (res?.token) {
          setToken(res.token);
          const session = { access_token: res.token, user: res.user };
          authListeners.forEach((fn) => fn("SIGNED_IN", session));
          return { data: { user: res.user, session }, error: null };
        }
        return { data: { user: null, session: null }, error: { message: "Registration failed" } };
      } catch (err: any) {
        return { data: { user: null, session: null }, error: { message: err?.message || "Registration failed" } };
      }
    },

    signOut: async () => {
      try {
        await api.post("/auth/logout");
      } catch {
        // ignore logout network errors
      } finally {
        clearToken();
        authListeners.forEach((fn) => fn("SIGNED_OUT", null));
      }
      return { error: null };
    },

    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      authListeners.add(callback);
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              authListeners.delete(callback);
            },
          },
        },
      };
    },

    updateUser: async (attributes: { password?: string; email?: string; data?: any }) => {
      try {
        const res = await api.post<any>("/auth/update", attributes);
        const user = res?.user || res;
        return { data: { user }, error: null };
      } catch (err: any) {
        return { data: { user: null }, error: { message: err?.message || "Failed to update profile" } };
      }
    },

    resetPasswordForEmail: async (email: string) => {
      try {
        const res = await api.post<any>("/auth/forgot-password", { email });
        return { data: res, error: null };
      } catch (err: any) {
        return { data: null, error: { message: err?.message || "Failed to request password reset" } };
      }
    },

    setSession: async (tokens: { access_token: string; refresh_token?: string }) => {
      if (tokens?.access_token) {
        setToken(tokens.access_token);
        const userRes = await db.auth.getUser();
        const session = { access_token: tokens.access_token, user: userRes.data.user };
        authListeners.forEach((fn) => fn("TOKEN_REFRESHED", session));
        return { data: { session, user: userRes.data.user }, error: null };
      }
      return { data: { session: null, user: null }, error: { message: "No token provided" } };
    },
  },

  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, fileBody: any, _options?: any) => {
        try {
          const formData = new FormData();
          formData.append("file", fileBody);
          formData.append("path", path);
          formData.append("bucket", bucket);
          formData.append("folder", bucket);

          const res = await api.upload<{ url: string; path: string }>("/upload/image", formData);
          if (res?.url && !res.url.includes("/placeholder.svg")) {
            return { data: { path: res.path || path, fullPath: res.url }, error: null };
          }
        } catch {
          // Backend API is offline, save directly to physical disk on local system
        }

        try {
          if (fileBody instanceof Blob) {
            const base64 = await blobToDataUrl(fileBody);
            const filename = path.split("/").pop();
            const saved = await saveUploadedFileServer({
              data: {
                base64,
                folder: bucket,
                filename,
              },
            });
            return { data: { path: saved.path, fullPath: saved.url }, error: null };
          }
        } catch (err: any) {
          console.error("Local disk file save error:", err);
        }

        return { data: { path, fullPath: path }, error: null };
      },

      createSignedUrl: async (path: string, _expiresIn?: number) => {
        if (path.startsWith("http") || path.startsWith("blob:") || path.startsWith("data:")) {
          return { data: { signedUrl: path }, error: null };
        }
        const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/api$/, "") || (typeof window !== "undefined" ? "" : "http://127.0.0.1:8000");
        const cleanPath = `${baseUrl}/storage/${bucket}/${path.replace(/^\//, "")}`;
        return { data: { signedUrl: cleanPath }, error: null };
      },

      getPublicUrl: (path: string) => {
        if (path.startsWith("http") || path.startsWith("blob:") || path.startsWith("data:")) {
          return { data: { publicUrl: path } };
        }
        try {
          if (typeof window !== "undefined") {
            const raw = localStorage.getItem("mock:media_library");
            if (raw) {
              const list = JSON.parse(raw);
              const found = list.find((i: any) => i.path === path || i.filename === path.split("/").pop());
              if (found?.url) return { data: { publicUrl: found.url } };
            }
          }
        } catch {}
        const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/api$/, "") || (typeof window !== "undefined" ? "" : "http://127.0.0.1:8000");
        const cleanPath = `${baseUrl}/storage/${bucket}/${path.replace(/^\//, "")}`;
        return { data: { publicUrl: cleanPath } };
      },

      remove: async (paths: string[]) => {
        try {
          await api.post("/upload/delete", { bucket, paths });
          return { data: paths, error: null };
        } catch (err: any) {
          return { data: null, error: { message: err?.message || "Delete failed" } };
        }
      },
    }),
  },
};

// Aliases for seamless compatibility
export const laravelApi = db;
export const laravelDb = db;
export const supabase = db;

