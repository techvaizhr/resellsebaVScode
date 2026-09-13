import { mapCourierStatus, normalizeCourierStatus } from "@/lib/courier-status";

export type Cfg = Record<string, string>;

export async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_any_permission", {
    _user_id: userId,
    _permissions: ["couriers.manage", "orders.edit"],
  });
  if (error || !data) throw new Response("Forbidden", { status: 403 });
}

/**
 * Booking access: admins/staff use their own (RLS-scoped) client.
 * A supplier that owns items in the order books through the privileged client,
 * since suppliers have no direct row access to orders/shipments.
 */
export async function courierActorClient(userClient: any, userId: string, orderId: string) {
  const { data: allowed } = await userClient.rpc("has_any_permission", {
    _user_id: userId,
    _permissions: ["couriers.manage", "orders.edit"],
  });
  if (allowed) return userClient;

  const { data: supplierOk } = await userClient.rpc("supplier_can_book_order", { _order: orderId });
  if (!supplierOk) throw new Response("Forbidden", { status: 403 });

  const { supabaseAdmin } = await import("@/integrations/laravel/client.server");
  return supabaseAdmin as any;
}



export async function getCourierConfig(supabase: any, provider: string): Promise<Cfg> {
  const { data: cfg } = await supabase
    .from("courier_configs")
    .select("config, is_active")
    .eq("provider", provider)
    .maybeSingle();
  if (!cfg || !cfg.is_active) throw new Response(`${provider} not configured`, { status: 400 });
  return (cfg.config ?? {}) as Cfg;
}

/** Human readable name of a saved pickup store (multi-store setups). */
export function courierStoreName(conf: Cfg, storeId?: string | number | null): string | null {
  const id = storeId != null ? String(storeId) : "";
  if (!id) return null;
  try {
    const raw = (conf as any).stores_json;
    const list = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!Array.isArray(list)) return null;
    const hit = list.find((s: any) => String(s?.id) === id);
    return hit?.name ? String(hit.name) : null;
  } catch {
    return null;
  }
}

/** Saved pickup stores of a provider (empty when never loaded). */
export function savedCourierStores(conf: Cfg): { id: string; name: string }[] {
  try {
    const raw = (conf as any).stores_json;
    const list = typeof raw === "string" ? JSON.parse(raw || "[]") : raw;
    if (!Array.isArray(list)) return [];
    return list
      .filter((s: any) => s && s.id != null && String(s.id) !== "")
      .map((s: any) => ({ id: String(s.id), name: String(s.name ?? s.id) }));
  } catch {
    return [];
  }
}

/**
 * A pickup store can be deactivated or deleted from the courier's own panel at
 * any time. Fail with a clear, actionable message instead of letting the
 * provider API answer with a cryptic validation error.
 */
export function assertCourierStore(conf: Cfg, provider: string, storeId: string | number) {
  const id = String(storeId ?? "");
  const saved = savedCourierStores(conf);
  if (!id) throw new Response(`${provider} pickup store select korun`, { status: 400 });
  // Never loaded a list yet — let the provider validate it.
  if (saved.length === 0) return;
  if (!saved.some((s) => s.id === id)) {
    throw new Response(
      `Ei pickup store ta ${provider} panel e ar nei (inactive ba delete kora hoyeche). Admin → Couriers e "Load stores" chepe notun store select korun.`,
      { status: 400 },
    );
  }
}

/**
 * Save a freshly loaded pickup-store list into courier_configs so booking can use
 * it without the admin pressing Save (and it survives a page reload).
 * Returns the default store id that ended up saved.
 */
export async function persistCourierStores(
  db: any,
  provider: string,
  conf: Cfg,
  stores: { id: string; name?: string; isDefaultPickup?: boolean; isActive?: boolean }[],
): Promise<string> {
  // Inactive stores can't accept parcels — keep them out of the saved list.
  const usable = stores.filter((s) => s.isActive !== false);
  const saved = usable.map((s) => ({ id: String(s.id), name: String(s.name ?? s.id) }));
  const keep = saved.some((s) => s.id === String(conf.store_id ?? ""));
  const defaultStoreId = keep
    ? String(conf.store_id)
    : String(usable.find((s) => s.isDefaultPickup)?.id ?? saved[0]?.id ?? "");
  const nextConfig: Cfg = {
    ...conf,
    stores_json: JSON.stringify(saved),
    // A store that disappeared upstream must not stay as the saved default.
    store_id: defaultStoreId,
  };
  if (!defaultStoreId) delete (nextConfig as any).store_id;
  await db.from("courier_configs").update({ config: nextConfig }).eq("provider", provider);
  return defaultStoreId;
}


export function steadfastBase(conf: Cfg) {
  return (conf.base_url || "https://portal.packzy.com/api/v1").replace(/\/+$/, "");
}

export function steadfastHeaders(conf: Cfg) {
  if (!conf.api_key || !conf.secret_key)
    throw new Response("Missing Steadfast credentials", { status: 400 });
  return {
    "Api-Key": conf.api_key,
    "Secret-Key": conf.secret_key,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

export async function steadfastRequest(conf: Cfg, path: string, init?: RequestInit) {
  const res = await fetch(`${steadfastBase(conf)}${path}`, {
    ...init,
    headers: { ...steadfastHeaders(conf), ...(init?.headers ?? {}) },
  });
  const text = await res.text();
  let body: any = {};
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text };
  }
  if (!res.ok) {
    console.error(`Steadfast ${path} failed [${res.status}]: ${text}`);
    throw new Response(body?.message || `Steadfast request failed (${res.status})`, { status: 502 });
  }
  return body;
}

export async function getOrderForBooking(supabase: any, orderId: string) {
  const { data: order, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, status, customer_name, customer_phone, address_line, city, area, landmark, total, payment_method, payment_status, advance_amount, advance_by, received_amount, notes, reseller_note",
    )
    .eq("id", orderId)
    .maybeSingle();
  if (error || !order) throw new Response("Order not found", { status: 404 });
  return order;
}

export function calculateCodAmount(order: {
  total?: number | string | null;
  advance_amount?: number | string | null;
  received_amount?: number | string | null;
  payment_method?: string | null;
  payment_status?: string | null;
}): number {
  if (order.payment_status === "paid") return 0;
  if (order.payment_method && order.payment_method !== "cod") return 0;
  const total = Number(order.total || 0);
  const advance = Number(order.advance_amount || order.received_amount || 0);
  return Math.max(0, total - advance);
}

export function normalizePhone(phone: string) {
  const digits = String(phone ?? "").replace(/\D/g, "");
  if (digits.length === 13 && digits.startsWith("880")) return digits.slice(2);
  if (digits.length === 10 && digits.startsWith("1")) return `0${digits}`;
  return digits;
}

export function fullAddress(order: {
  address_line: string;
  city?: string | null;
  area?: string | null;
  landmark?: string | null;
}) {
  // The inside/outside Dhaka zone is a pricing flag, not part of the customer's
  // address — never send it to any courier.
  const parts = [order.address_line, order.landmark, order.city]
    .map((p) => (p ?? "").trim())
    .filter(Boolean);
  return parts.join(", ").slice(0, 250);
}

/**
 * Persist a courier status update: append a courier event, update the shipment
 * and move the order status accordingly. Used by both manual sync and webhook.
 */
export async function applyCourierUpdate(
  db: any,
  args: {
    provider?: string | null;
    consignmentId?: string | null;
    trackingCode?: string | null;
    invoice?: string | null;
    courierStatus: string;
    source: "webhook" | "sync";
    notificationType?: string | null;
    codAmount?: number | null;
    deliveryCharge?: number | null;
    note?: string | null;
    payload?: unknown;
    bypassFinalLock?: boolean;
  },
) {
  let shipment: any = null;
  if (args.consignmentId) {
    const { data } = await db
      .from("shipments")
      .select("id, order_id, provider")
      .eq("consignment_id", String(args.consignmentId))
      .maybeSingle();
    shipment = data ?? null;
  }
  if (!shipment && args.trackingCode) {
    const { data } = await db
      .from("shipments")
      .select("id, order_id, provider")
      .eq("tracking_id", String(args.trackingCode))
      .maybeSingle();
    shipment = data ?? null;
  }
  let orderId: string | null = shipment?.order_id ?? null;
  if (!orderId && args.invoice) {
    const { data } = await db
      .from("orders")
      .select("id")
      .eq("order_number", args.invoice)
      .maybeSingle();
    orderId = data?.id ?? null;
  }
  if (!orderId) return { matched: false as const };

  const provider = shipment?.provider ?? args.provider ?? "steadfast";
  const statusKey = normalizeCourierStatus(provider, args.courierStatus) || "unknown";
  const mapped = mapCourierStatus(provider, args.courierStatus);
  const nowIso = new Date().toISOString();

  await db.from("courier_events").insert({
    order_id: orderId,
    shipment_id: shipment?.id ?? null,
    provider,
    source: args.source,
    notification_type: args.notificationType ?? null,
    courier_status: statusKey,
    consignment_id: args.consignmentId ? String(args.consignmentId) : null,
    tracking_code: args.trackingCode ? String(args.trackingCode) : null,
    cod_amount: args.codAmount ?? null,
    delivery_charge: args.deliveryCharge ?? null,
    note: args.note ?? null,
    payload: (args.payload ?? {}) as any,
    event_at: nowIso,
  });

  if (shipment?.id) {
    // Steadfast (and friends) sometimes echo the real per-consignment tracking page
    // on later events. Keep it if we don't have one saved yet — never overwrite.
    const pl: any = args.payload ?? {};
    const echoedLink =
      typeof pl?.tracking_link === "string" && pl.tracking_link
        ? pl.tracking_link
        : typeof pl?.consignment?.tracking_link === "string" && pl.consignment.tracking_link
          ? pl.consignment.tracking_link
          : null;
    let keepLink: string | undefined = undefined;
    if (echoedLink) {
      const { data: cur } = await db
        .from("shipments")
        .select("tracking_url")
        .eq("id", shipment.id)
        .maybeSingle();
      if (!cur?.tracking_url) keepLink = echoedLink;
    }
    await db
      .from("shipments")
      .update({
        tracking_url: keepLink,
        status: mapped.ship,
        courier_status: statusKey,
        cod_amount: args.codAmount ?? undefined,
        delivery_charge: args.deliveryCharge ?? undefined,
        courier_note: args.note ?? undefined,
        last_event_at: nowIso,
        last_synced_at: nowIso,
        response_payload: (args.payload ?? {}) as any,
      })
      .eq("id", shipment.id);
  }

  const { data: order } = await db.from("orders").select("status").eq("id", orderId).maybeSingle();
  // "returned" and "cancelled" are final, manually-confirmed states — courier
  // events must never overwrite them.
  const finalStates = ["returned", "cancelled"];
  const isLocked = order && finalStates.includes(order.status) && !args.bypassFinalLock;
  
  // Courier-collected money (partial delivery = less than the order total).
  // Stored on the order so every profit/loss calculation uses what was really received.
  if (order && !isLocked && args.codAmount != null && (mapped.order === "delivered" || mapped.order === "partial")) {
    await db.from("orders").update({ received_amount: args.codAmount }).eq("id", orderId);
  }

  if (order && order.status !== mapped.order && !isLocked) {
    await db.from("orders").update({ status: mapped.order }).eq("id", orderId);
    await db.from("order_status_history").insert({
      order_id: orderId,
      status: mapped.order,
      note: `${provider} update (${args.source}): ${statusKey}${args.bypassFinalLock ? " (Admin Override)" : ""}`,
    });
  }


  return { matched: true as const, orderId, shipmentId: shipment?.id ?? null, mapped };
}


/**
 * Pull the live status of one shipment from its courier and persist it.
 * Provider agnostic — used by the manual "Recheck status" button and by the
 * automatic sync job (webhooks can be missed or misconfigured, so polling is
 * the safety net that keeps order statuses correct).
 */
export async function syncShipmentStatus(
  db: any,
  shipment: { id: string; provider: string; consignment_id: string | null; tracking_id: string | null; order_id: string },
  orderNumber?: string | null,
) {
  const provider = String(shipment.provider);
  const cid = shipment.consignment_id || shipment.tracking_id;
  const conf = await getCourierConfig(db, provider);

  if (provider === "steadfast") {
    const path = shipment.consignment_id
      ? `/status_by_cid/${shipment.consignment_id}`
      : shipment.tracking_id
        ? `/status_by_trackingcode/${shipment.tracking_id}`
        : `/status_by_invoice/${orderNumber ?? ""}`;
    const body = await steadfastRequest(conf, path);
    const courierStatus = String(body.delivery_status || body.status || "unknown").toLowerCase();
    const result = await applyCourierUpdate(db, {
      provider,
      consignmentId: shipment.consignment_id,
      trackingCode: shipment.tracking_id,
      invoice: orderNumber ?? null,
      courierStatus,
      source: "sync",
      notificationType: "auto_sync",
      payload: body,
    });
    return { courierStatus, matched: result.matched };
  }

  if (provider === "pathao") {
    if (!cid) throw new Response("Shipment has no Pathao consignment id", { status: 400 });
    const { pathaoOrderInfo } = await import("@/lib/pathao.server");
    const info = await pathaoOrderInfo(db, conf, cid);
    const result = await applyCourierUpdate(db, {
      provider,
      consignmentId: shipment.consignment_id ?? cid,
      trackingCode: shipment.tracking_id,
      invoice: info.merchantOrderId ?? orderNumber ?? null,
      courierStatus: info.status,
      source: "sync",
      notificationType: "auto_sync",
      payload: info,
    });
    return { courierStatus: info.status, matched: result.matched };
  }

  if (provider === "carrybee") {
    if (!cid) throw new Response("Shipment has no Carrybee consignment id", { status: 400 });
    const { carrybeeRequest } = await import("@/lib/carrybee.server");
    const body = await carrybeeRequest(conf, `/api/v2/orders/${encodeURIComponent(cid)}/details`);
    const d = body?.data ?? {};
    const courierStatus = String(d.transfer_status ?? "unknown");
    const result = await applyCourierUpdate(db, {
      provider,
      consignmentId: shipment.consignment_id ?? cid,
      trackingCode: shipment.tracking_id,
      courierStatus,
      source: "sync",
      notificationType: "auto_sync",
      codAmount: d.collected_amount != null ? Number(d.collected_amount) : null,
      deliveryCharge: d.delivery_fee != null ? Number(d.delivery_fee) : null,
      note: d.reason ?? null,
      payload: body,
    });
    return { courierStatus, matched: result.matched };
  }

  throw new Response(`Sync not supported for ${provider}`, { status: 400 });
}

/** Statuses that never change again — skipped by the polling job. */
export const FINAL_COURIER_SHIP_STATUSES = ["delivered", "returned", "cancelled", "failed"];

/**
 * Poll every still-moving shipment and persist status changes.
 * Safe to call repeatedly; errors on one shipment never abort the rest.
 */
export async function syncPendingShipments(db: any, limit = 40, staleMinutes = 0) {
  let query = db
    .from("shipments")
    .select("id, provider, consignment_id, tracking_id, order_id, orders(order_number)")
    .not("status", "in", `(${FINAL_COURIER_SHIP_STATUSES.join(",")})`)
    .order("last_synced_at", { ascending: true, nullsFirst: true })
    .limit(limit);
  if (staleMinutes > 0) {
    const cutoff = new Date(Date.now() - staleMinutes * 60 * 1000).toISOString();
    query = query.or(`last_synced_at.is.null,last_synced_at.lt.${cutoff}`);
  }
  const { data: rows } = await query;

  let synced = 0;
  const errors: string[] = [];
  for (const sh of rows ?? []) {
    try {
      await syncShipmentStatus(db, sh as any, (sh as any).orders?.order_number ?? null);
      synced += 1;
    } catch (err: any) {
      errors.push(`${(sh as any).id}: ${err?.message ?? String(err)}`);
    }
  }
  return { checked: rows?.length ?? 0, synced, errors };
}
