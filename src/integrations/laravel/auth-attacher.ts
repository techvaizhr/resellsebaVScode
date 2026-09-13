import { createMiddleware } from "@tanstack/react-start";
import { getToken } from "@/integrations/auth/token";

export const attachAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    const token = getToken();
    return next({
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  }
);

export const attachLaravelAuth = attachAuth;
export const attachSupabaseAuth = attachAuth;

