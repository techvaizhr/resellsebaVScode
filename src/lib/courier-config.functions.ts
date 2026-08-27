import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getActiveCouriers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data } = await supabase
      .from("courier_configs")
      .select("provider, is_active")
      .eq("is_active", true);

    if (data && data.length) return data.map((c) => c.provider);

    // Suppliers have no row access to courier configs, but they book couriers for
    // their own orders — expose only the active provider names in that case.
    const { data: supplierId } = await supabase.rpc("current_supplier_id");
    if (!supplierId) return [];

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows } = await supabaseAdmin
      .from("courier_configs")
      .select("provider")
      .eq("is_active", true);
    return (rows ?? []).map((c: { provider: string }) => c.provider);
  });
