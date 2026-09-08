import { createClient } from "@supabase/supabase-js";

/**
 * Opens another account WITHOUT breaking that person's own login.
 *
 * The old flow overwrote the account password with a temporary one, so the
 * reseller/supplier could no longer sign in afterwards. Instead we now:
 *   1. swap in a random password and keep the original hash,
 *   2. exchange it for a session on the server,
 *   3. immediately restore the original hash.
 * The account owner's password never changes.
 */
export async function mintImpersonationSession(supabase: any, userId: string) {
  const password = `imp-${crypto.randomUUID()}-${crypto.randomUUID()}`;

  const { data, error } = await supabase.rpc("admin_impersonation_begin", {
    _user_id: userId,
    _password: password,
  });
  if (error) {
    const message = error.message.replace(/^.*?(?:ERROR|error):\s*/i, "") || "Could not open that account";
    throw new Response(message, { status: /forbidden|not signed in/i.test(message) ? 403 : 400 });
  }
  const row = (Array.isArray(data) ? data[0] : data) as { email: string; prev_hash: string | null };

  try {
    const client = createClient(
      process.env["SUPABASE_URL"]!,
      process.env["SUPABASE_PUBLISHABLE_KEY"]!,
      { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
    );
    const { data: signIn, error: signInError } = await client.auth.signInWithPassword({
      email: row.email,
      password,
    });
    if (signInError || !signIn.session) {
      throw new Response(signInError?.message || "Could not open that account", { status: 400 });
    }
    return {
      ok: true as const,
      email: row.email,
      accessToken: signIn.session.access_token,
      refreshToken: signIn.session.refresh_token,
    };
  } finally {
    // Always put the real password back, even when the sign-in failed.
    try {
      await supabase.rpc("admin_impersonation_finish", {
        _user_id: userId,
        _prev_hash: row.prev_hash,
      });
    } catch (err) {
      console.error("[impersonation] failed to restore password hash", err);
    }
  }
}
