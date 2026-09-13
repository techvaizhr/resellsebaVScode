const WORDS = ["shop", "sell", "store", "order", "reseller", "market"];

/** Easy to type/read temporary password, e.g. "shop4821". */
export function easyPassword(): string {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  const digits = String(Math.floor(1000 + Math.random() * 9000));
  return `${word}${digits}`;
}

type DbClient = {
  from: (table: string) => any;
};

/** Keeps legacy/edge-case active reseller accounts from landing on onboarding. */
export async function ensureActiveResellerRole(supabase: DbClient, userId: string) {
  let { data: reseller, error: resellerError } = await supabase
    .from("resellers")
    .select("id,user_id,status,business_name")
    .eq("user_id", userId)
    .maybeSingle();

  if (!reseller) {
    const { data: byId } = await supabase
      .from("resellers")
      .select("id,user_id,status,business_name")
      .eq("id", userId)
      .maybeSingle();
    if (byId) reseller = byId;
  }

  if (resellerError && !reseller) throw new Response(resellerError.message, { status: 400 });
  if (!reseller) throw new Response("Reseller profile not found", { status: 404 });
  if (reseller.status !== "active") {
    throw new Response("Only active resellers can be opened", { status: 400 });
  }

  const effectiveUserId = reseller.user_id || userId;
  const { error } = await supabase
    .from("user_roles")
    .upsert({ user_id: effectiveUserId, role: "reseller" }, { onConflict: "user_id,role" });
  if (error) throw new Response(error.message, { status: 400 });

  return reseller as { id: string; user_id?: string; status: string; business_name: string | null };
}

/** Opens a reseller session for the admin without changing the reseller's password. */
export async function createImpersonationLogin(supabase: DbClient, userId: string) {
  await ensureActiveResellerRole(supabase, userId);
  const { mintImpersonationSession } = await import("@/lib/impersonation.server");
  return mintImpersonationSession(supabase, userId);
}
