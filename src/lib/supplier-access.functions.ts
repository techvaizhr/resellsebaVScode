import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertAnyPermission } from "@/lib/admin-users.server";

const PERMS = ["suppliers.manage", "products.manage", "resellers.manage"];

/** Sets an easy, readable password for a supplier and returns it once to the admin. */
export const resetSupplierPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ userId: z.string().uuid(), password: z.string().min(6).max(64).optional() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAnyPermission(context.supabase, context.userId, PERMS);
    const { setPassword } = await import("@/lib/auth-admin.server");
    const { easyPassword } = await import("@/lib/supplier-access.server");
    const password = data.password ?? easyPassword();
    await setPassword(context.supabase, data.userId, password);
    return { ok: true, password };
  });

/** Mints temporary credentials so an admin can enter the supplier panel. */
export const impersonateSupplier = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ userId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAnyPermission(context.supabase, context.userId, PERMS);
    const { createSupplierImpersonationLogin } = await import("@/lib/supplier-access.server");
    return createSupplierImpersonationLogin(context.supabase, data.userId);
  });
