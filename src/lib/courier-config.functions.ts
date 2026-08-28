import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type CourierStoreOption = { id: string; name: string };
export type CourierBookingOption = {
  provider: string;
  stores: CourierStoreOption[];
  defaultStoreId: string | null;
};

function parseStores(config: any): CourierStoreOption[] {
  const raw = config?.stores_json;
  if (!raw) return [];
  try {
    const list = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!Array.isArray(list)) return [];
    return list
      .map((s: any) => ({ id: String(s?.id ?? ""), name: String(s?.name ?? s?.id ?? "") }))
      .filter((s) => s.id);
  } catch {
    return [];
  }
}

async function loadConfigs(supabase: any) {
  const { data } = await supabase
    .from("courier_configs")
    .select("provider, is_active, config")
    .eq("is_active", true);
  if (data && data.length) return data;

  // Suppliers have no row access to courier configs, but they book couriers for
  // their own orders — expose only what booking needs in that case.
  const { data: supplierId } = await supabase.rpc("current_supplier_id");
  if (!supplierId) return [];
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: rows } = await supabaseAdmin
    .from("courier_configs")
    .select("provider, is_active, config")
    .eq("is_active", true);
  return rows ?? [];
}

export const getActiveCouriers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const rows = await loadConfigs(context.supabase);
    return rows.map((c: any) => c.provider as string);
  });

/** Active providers plus their saved pickup stores (multi-store booking). */
export const getCourierBookingOptions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CourierBookingOption[]> => {
    const rows = await loadConfigs(context.supabase);
    return rows.map((c: any) => ({
      provider: String(c.provider),
      stores: parseStores(c.config),
      defaultStoreId: c.config?.store_id ? String(c.config.store_id) : null,
    }));
  });
