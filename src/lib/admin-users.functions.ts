import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/laravel/auth-middleware";
import { assertAnyPermission, assertPermission } from "@/lib/admin-users.server";

const input = z.object({ userId: z.string().min(1) });

export const confirmUserEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => input.parse(d))
  .handler(async ({ data, context }) => {
    await assertPermission(context.supabase, context.userId, "resellers.manage");
    const { confirmEmail } = await import("@/lib/auth-admin.server");
    const res = await confirmEmail(context.supabase, data.userId);
    return { ok: true, alreadyConfirmed: res.alreadyConfirmed, email: res.email };
  });

export type EmailStatus = {
  user_id: string;
  email: string | null;
  email_confirmed: boolean;
};

export const listResellerEmailStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<EmailStatus[]> => {
    await assertPermission(context.supabase, context.userId, "resellers.manage");
    const { loadAuthUsers } = await import("@/lib/auth-admin.server");
    const users = await loadAuthUsers(context.supabase);
    return users.map((u) => ({
      user_id: u.user_id,
      email: u.email,
      email_confirmed: u.email_confirmed,
    }));
  });

export const deleteAuthUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => input.parse(d))
  .handler(async ({ data, context }) => {
    await assertAnyPermission(context.supabase, context.userId, ["staff.manage", "resellers.manage"]);
    const { deleteUser } = await import("@/lib/auth-admin.server");
    await deleteUser(context.supabase, data.userId);
    return { ok: true };
  });

export type StaffUser = {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string | null;
  role: string;
  custom_role_id: string | null;
  custom_role_name: string | null;
  created_at: string | null;
};

/** Lists only admin/staff accounts (never resellers) with their assigned custom role. */
export const listStaffUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<StaffUser[]> => {
    await assertPermission(context.supabase, context.userId, "staff.manage");
    const db = context.supabase;

    const { data: roleRows, error: roleErr } = await db
      .from("user_roles")
      .select("user_id, role, custom_role_id, roles:custom_role_id (name)")
      .in("role", ["super_admin", "staff"]);
    if (roleErr) throw new Response(roleErr.message, { status: 400 });

    const ids = (roleRows ?? []).map((r: any) => r.user_id);
    if (ids.length === 0) return [];

    const { data: profiles } = await db
      .from("profiles")
      .select("id, full_name, created_at, phone")
      .in("id", ids);

    // Emails and phones from auth users
    const { loadAuthUsers } = await import("@/lib/auth-admin.server");
    const authUsers = await loadAuthUsers(db);
    const authUserMap = Object.fromEntries(authUsers.map((u) => [u.user_id, u]));

    const profileMap: Record<string, any> = Object.fromEntries((profiles ?? []).map((p: any) => [p.id, p]));
    return (roleRows ?? []).map((r: any) => ({
      id: r.user_id,
      email: authUserMap[r.user_id]?.email ?? null,
      phone: authUserMap[r.user_id]?.phone ?? profileMap[r.user_id]?.phone ?? null,
      full_name: profileMap[r.user_id]?.full_name ?? null,
      role: r.role,
      custom_role_id: r.custom_role_id ?? null,
      custom_role_name: r.roles?.name ?? null,
      created_at: profileMap[r.user_id]?.created_at ?? null,
    }));
  });
