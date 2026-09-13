import { supabase } from "@/integrations/laravel/client";
import { getToken } from "@/integrations/auth/token";
import { refreshAuthState } from "@/lib/use-auth";

const KEY = "impersonation:admin-session";
const RETURN_KEY = "impersonation:return-to";

export type ImpersonationSnapshot = {
  access_token: string;
  refresh_token: string;
  returnTo: string;
  label: string;
};

export function readImpersonation(): ImpersonationSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ImpersonationSnapshot) : null;
  } catch {
    return null;
  }
}

export function clearImpersonation() {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
}

export function consumeImpersonationReturnTarget() {
  if (typeof window === "undefined") return null;
  const target = sessionStorage.getItem(RETURN_KEY);
  if (target) sessionStorage.removeItem(RETURN_KEY);
  return target;
}

export function rememberImpersonationReturnTarget(target: string) {
  if (typeof window !== "undefined") sessionStorage.setItem(RETURN_KEY, target);
}

/**
 * Swaps the current admin session for the target account's session, remembering
 * where the admin came from. The target account's own password is untouched —
 * the server hands us a ready session instead of temporary credentials.
 */
export async function startImpersonation(opts: {
  accessToken: string;
  refreshToken?: string;
  label: string;
  returnTo: string;
}) {
  const { data: current } = await supabase.auth.getSession();
  const session = current?.session;
  const currentToken = session?.access_token || getToken();
  if (!currentToken) throw new Error("Your admin session expired — sign in again.");

  const snapshot: ImpersonationSnapshot = {
    access_token: currentToken,
    refresh_token: session?.refresh_token || currentToken,
    returnTo: opts.returnTo,
    label: opts.label,
  };
  localStorage.setItem(KEY, JSON.stringify(snapshot));

  const { error } = await supabase.auth.setSession({
    access_token: opts.accessToken,
    refresh_token: opts.refreshToken || opts.accessToken,
  });
  if (error) {
    clearImpersonation();
    throw new Error(error.message);
  }
  await refreshAuthState();
}

/** Restores the stored admin session and returns the page the admin left. */
export async function stopImpersonation(): Promise<string> {
  const snapshot = readImpersonation();
  if (!snapshot) return "/admin";
  rememberImpersonationReturnTarget(snapshot.returnTo || "/admin");
  const { error } = await supabase.auth.setSession({
    access_token: snapshot.access_token,
    refresh_token: snapshot.refresh_token,
  });
  clearImpersonation();
  if (error) throw new Error(error.message);
  await refreshAuthState();
  return snapshot.returnTo || "/admin";
}
