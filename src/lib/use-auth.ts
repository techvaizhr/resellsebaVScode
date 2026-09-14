import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { getToken, setToken, clearToken } from "@/integrations/auth/token";
import { clearAppDataCache, primeGlobalSettings, primeMyReseller } from "@/lib/app-data";
import {
  clearPanelBootstrapPayload,
  markPanelBootstrapPending,
  setPanelBootstrapPayload,
  type PanelBootstrap,
} from "@/lib/panel-bootstrap";
import type { User } from "@/types";

export type Role = "super_admin" | "reseller" | "leader" | "staff" | "supplier";

// Simulate a basic session object
export interface Session {
  user: User;
  access_token: string;
}

export interface AuthState {
  session: Session | null;
  user: User | null;
  roles: Role[];
  permissions: string[];
  loading: boolean;
  accessError: boolean;
}

const listeners = new Set<(state: AuthState) => void>();
let initialized = false;
let authVersion = 0;
let lastAppliedUser: string | null = null;

let authState: AuthState = {
  session: null,
  user: null,
  roles: [],
  permissions: [],
  loading: true,
  accessError: false,
};

function publish(next: AuthState) {
  authState = next;
  listeners.forEach((listener) => listener(authState));
}

async function loadAccessOnce(
  userId: string,
): Promise<{ roles: Role[]; permissions: string[]; error: boolean }> {
  const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 10000));
  try {
    markPanelBootstrapPending();
    const work = api.get<PanelBootstrap>("/auth/bootstrap");

    const res = await Promise.race([work, timeout]);
    if (!res) {
      setPanelBootstrapPayload(null);
      console.error("Access lookup timed out");
      return { roles: [], permissions: [], error: true };
    }

    const payload = res as PanelBootstrap;
    setPanelBootstrapPayload(payload);
    if (payload?.settings) primeGlobalSettings(payload.settings);
    if (payload?.reseller) primeMyReseller(userId, payload.reseller);

    return {
      roles: (payload?.roles ?? []) as Role[],
      permissions: (payload?.permissions ?? []) as string[],
      error: false,
    };
  } catch (err) {
    setPanelBootstrapPayload(null);
    console.error("Failed to load access data:", err);
    return { roles: [], permissions: [], error: true };
  }
}

let accessInflight: { userId: string; promise: Promise<{ roles: Role[]; permissions: string[]; error: boolean }> } | null = null;

async function loadAccess(
  userId: string,
): Promise<{ roles: Role[]; permissions: string[]; error: boolean }> {
  if (accessInflight && accessInflight.userId === userId) return accessInflight.promise;
  const promise = (async () => {
    let last = await loadAccessOnce(userId);
    for (let attempt = 0; attempt < 2; attempt++) {
      if (!last.error && last.roles.length > 0) return last;
      await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
      const next = await loadAccessOnce(userId);
      if (!next.error && next.roles.length > 0) return next;
      if (!next.error) last = next;
    }
    return last;
  })();
  accessInflight = { userId, promise };
  promise.finally(() => {
    if (accessInflight?.promise === promise) accessInflight = null;
  });
  return promise;
}

async function applySession(session: Session | null, opts: { forceAccessReload?: boolean } = {}) {
  if (!session?.user) {
    clearAppDataCache();
    clearPanelBootstrapPayload();
    authVersion++;
    lastAppliedUser = null;
    publish({ session: null, user: null, roles: [], permissions: [], loading: false, accessError: false });
    return authState;
  }

  if (authState.user?.id === session.user.id && !opts.forceAccessReload) {
    publish({
      ...authState,
      session,
    });
    return authState;
  }

  if (lastAppliedUser !== session.user.id) clearAppDataCache("reseller");
  lastAppliedUser = session.user.id;
  const version = ++authVersion;

  publish({ session, user: session.user, roles: [], permissions: [], loading: true, accessError: false });

  try {
    const { roles, permissions, error } = await loadAccess(session.user.id);
    if (version !== authVersion) return authState;
    publish({ session, user: session.user, roles, permissions, loading: false, accessError: error });
  } catch {
    if (version !== authVersion) return authState;
    publish({ session, user: session.user, roles: [], permissions: [], loading: false, accessError: true });
  }

  return authState;
}

async function fetchCurrentUser() {
  try {
    const user = await api.get<User>("/auth/user");
    const token = getToken();
    if (user && token) {
      return { user, access_token: token };
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function initAuth() {
  if (initialized) return;
  initialized = true;

  markPanelBootstrapPending();
  const token = getToken();

  if (token) {
    const session = await fetchCurrentUser();
    if (session) {
      await applySession(session);
    } else {
      clearToken();
      await applySession(null);
    }
  } else {
    await applySession(null);
  }
}

export async function refreshAuthState() {
  const session = await fetchCurrentUser();
  return applySession(session, { forceAccessReload: true });
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>(authState);

  useEffect(() => {
    initAuth();
    listeners.add(setState);
    setState(authState);

    return () => {
      listeners.delete(setState);
    };
  }, []);

  return state;
}

export function hasRole(roles: Role[], r: Role) {
  if (roles.includes("super_admin") || (roles as string[]).includes("admin")) return true;
  return roles.includes(r);
}

export function useCan() {
  const { roles, permissions, user } = useAuth();
  const userRole = (user as any)?.role;
  const isSuperAdmin =
    roles.includes("super_admin") ||
    (roles as string[]).includes("admin") ||
    userRole === "super_admin" ||
    userRole === "admin" ||
    user?.email === "admin@resellseba.com" ||
    permissions.includes("*");
  return (...needed: string[]) =>
    isSuperAdmin || permissions.includes("*") || needed.some((permission) => permissions.includes(permission));
}

// Add requested auth functions
export const login = async (email: string, password: string) => {
  const data = await api.post<{ user: User; token: string }>("/auth/login", { email, password });
  setToken(data.token);
  await applySession({ user: data.user, access_token: data.token });
  return data;
};

export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (e) {
    console.error("Logout error", e);
  } finally {
    clearToken();
    await applySession(null);
  }
};

export const register = async (email: string, password: string, name?: string) => {
  const data = await api.post<{ user: User; token: string }>("/auth/register", { email, password, name });
  setToken(data.token);
  await applySession({ user: data.user, access_token: data.token });
  return data;
};
