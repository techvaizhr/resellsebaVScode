import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/laravel/auth-middleware";

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
  // their own orders — a security-definer RPC exposes only what booking needs.
  const { data: opts } = await supabase.rpc("courier_booking_options");
  const list = Array.isArray(opts) ? opts : [];
  return list.map((o: any) => ({
    provider: o.provider,
    is_active: true,
    config: { stores_json: o.stores ?? [], ...(o.defaultStoreId ? { store_id: o.defaultStoreId } : {}) },
  }));
}


export const getActiveCouriers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<string[]> => {
    const rows = await loadConfigs(context.supabase);
    return rows.map((c: any) => String(c.provider));
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
