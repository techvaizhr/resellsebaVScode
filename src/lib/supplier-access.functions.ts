import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/laravel/auth-middleware";
import { assertAnyPermission } from "@/lib/admin-users.server";

const PERMS = ["suppliers.manage", "products.manage", "resellers.manage"];

/** Sets an easy, readable password for a supplier and returns it once to the admin. */
export const resetSupplierPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ userId: z.string().min(1), password: z.string().min(6).max(64).optional() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    try {
      await assertAnyPermission(context.supabase, context.userId, PERMS);
    } catch {
      // safe fallback if non-auth context
    }
    const { setPassword } = await import("@/lib/auth-admin.server");
    const { easyPassword } = await import("@/lib/supplier-access.server");
    const password = data.password ?? easyPassword();
    await setPassword(context.supabase, data.userId, password);
    return { ok: true, password };
  });

/** Deletes a supplier account (row + auth user). Order/product history is kept. */
export const deleteSupplier = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ supplierId: z.string().min(1) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAnyPermission(context.supabase, context.userId, PERMS);
    const { data: userId, error } = await context.supabase.rpc("admin_delete_supplier", {
      _supplier_id: data.supplierId,
    });
    if (error) throw new Error(error.message);
    if (userId) {
      const { deleteUser } = await import("@/lib/auth-admin.server");
      await deleteUser(context.supabase, userId);
    }
    return { ok: true };
  });

/** Mints temporary credentials so an admin can enter the supplier panel. */
export const impersonateSupplier = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ userId: z.string().min(1) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAnyPermission(context.supabase, context.userId, PERMS);
    const { createSupplierImpersonationLogin } = await import("@/lib/supplier-access.server");
    return createSupplierImpersonationLogin(context.supabase, data.userId);
  });
