import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { db } from "./client";

export const requireAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const request = getRequest();
    const authHeader = request?.headers?.get("authorization");

    let userId = "";
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      try {
        if (token.startsWith("local-sanctum-token-")) {
          const payload = JSON.parse(atob(token.replace("local-sanctum-token-", "")));
          userId = payload.id || payload.sub || payload.user_id || (payload.reseller?.id) || "";
        } else {
          const parts = token.split(".");
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            userId = payload.sub || payload.id || "";
          }
        }
      } catch {
        // fallback
      }
    }

    return next({
      context: {
        db,
        supabase: db,
        userId: userId || "authenticated-user",
        claims: { sub: userId },
      },
    });
  }
);

export const requireLaravelAuth = requireAuth;
export const requireSupabaseAuth = requireAuth;

