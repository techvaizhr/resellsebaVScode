let memoryToken: string | null = null;

export const TOKEN_KEY = "auth_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return memoryToken;
  try {
    return localStorage.getItem(TOKEN_KEY) || memoryToken;
  } catch {
    return memoryToken;
  }
}

export function setToken(token: string): void {
  memoryToken = token;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {}
  }
}

export function clearToken(): void {
  memoryToken = null;
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
