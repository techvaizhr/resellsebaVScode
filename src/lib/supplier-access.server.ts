const WORDS = ["shop", "sell", "store", "order", "supply", "market"];

/** Easy to type/read temporary password, e.g. "supply4821". */
export function easyPassword(): string {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  return `${word}${String(Math.floor(1000 + Math.random() * 9000))}`;
}

type DbClient = { from: (table: string) => any };

/** Keeps edge-case active supplier accounts from landing on reseller onboarding. */
export async function ensureActiveSupplierRole(supabase: DbClient, userId: string) {
  let { data: supplier, error } = await supabase
    .from("suppliers")
    .select("id,user_id,status,display_name")
    .eq("user_id", userId)
    .maybeSingle();

  if (!supplier) {
    const { data: byId } = await supabase
      .from("suppliers")
      .select("id,user_id,status,display_name")
      .eq("id", userId)
      .maybeSingle();
    if (byId) supplier = byId;
  }

  if (error && !supplier) throw new Response(error.message, { status: 400 });
  if (!supplier) throw new Response("Supplier profile not found", { status: 404 });
  if (supplier.status !== "active") {
    throw new Response("Only active suppliers can be opened", { status: 400 });
  }

  const effectiveUserId = supplier.user_id || userId;
  const { error: roleError } = await supabase
    .from("user_roles")
    .upsert({ user_id: effectiveUserId, role: "supplier" }, { onConflict: "user_id,role" });
  if (roleError) throw new Response(roleError.message, { status: 400 });

  return supplier as { id: string; user_id?: string; status: string; display_name: string | null };
}

/** Opens a supplier session for the admin without changing the supplier's password. */
export async function createSupplierImpersonationLogin(supabase: DbClient, userId: string) {
  await ensureActiveSupplierRole(supabase, userId);
  const { mintImpersonationSession } = await import("@/lib/impersonation.server");
  return mintImpersonationSession(supabase, userId);
}
