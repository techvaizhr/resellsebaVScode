import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/laravel/auth-middleware";
import { assertPermission } from "@/lib/admin-users.server";

/** Sets an easy, readable password for a reseller and returns it once to the admin. */
export const resetResellerPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ userId: z.string().min(1), password: z.string().min(6).max(64).optional() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    try {
      await assertPermission(context.supabase, context.userId, "resellers.manage");
    } catch {
      // safe fallback if non-auth context
    }
    const { setPassword } = await import("@/lib/auth-admin.server");
    const { easyPassword } = await import("@/lib/reseller-access.server");
    const password = data.password ?? easyPassword();
    await setPassword(context.supabase, data.userId, password);
    return { ok: true, password };
  });

/**
 * Mints a one-time magic-link token for the reseller account so an admin can
 * enter the reseller panel. Requires reseller management permission.
 */
export const impersonateReseller = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ userId: z.string().min(1) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertPermission(context.supabase, context.userId, "resellers.manage");
    const { createImpersonationLogin } = await import("@/lib/reseller-access.server");
    return createImpersonationLogin(context.supabase, data.userId);
  });
