import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getOrderDetails = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ orderId: z.string() }).parse(data))
  .handler(async ({ data, context }) => {
    const { orderId } = data;
    const { supabase } = context;
    
    const [orderRes, itemsRes, shipmentsRes, eventsRes] = await Promise.all([
      supabase.from("orders").select("*, resellers(business_name, code, contact_phone, agents(display_name))").eq("id", orderId).maybeSingle(),
      supabase.from("order_items").select("*").eq("order_id", orderId),
      supabase.from("shipments").select("*").eq("order_id", orderId),
      supabase.from("courier_events").select("*").eq("order_id", orderId).order("event_at", { ascending: false })
    ]);


    if (orderRes.error) {
      console.error("[getOrderDetails] Order error:", orderRes.error);
    }

    return {
      order: orderRes.data,
      items: itemsRes.data || [],
      shipments: shipmentsRes.data || [],
      events: eventsRes.data || []
    };
  });

/**
 * Pull the live courier status for every shipment of an order and persist it.
 * Webhooks can be missed or misconfigured, so this is the manual safety net.
 */
export const recheckCourierStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ orderId: z.string() }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { syncShipmentStatus } = await import("@/lib/couriers.server");

    const { data: shipments } = await supabase
      .from("shipments")
      .select("id, provider, consignment_id, tracking_id, order_id, orders(order_number)")
      .eq("order_id", data.orderId);

    if (!shipments || shipments.length === 0) {
      return { success: false, message: "No courier booking found for this order." };
    }

    const statuses: string[] = [];
    const errors: string[] = [];
    for (const sh of shipments) {
      try {
        const res = await syncShipmentStatus(
          supabase,
          sh as any,
          (sh as any).orders?.order_number ?? null,
        );
        statuses.push(res.courierStatus);
      } catch (err: any) {
        errors.push(
          err instanceof Response ? await err.clone().text() : (err?.message ?? String(err)),
        );
      }
    }

    if (statuses.length === 0) {
      return { success: false, message: errors[0] ?? "Courier status could not be fetched." };
    }
    return { success: true, message: `Courier status: ${statuses.join(", ")}` };
  });

/**
 * Bulk "check courier status" for selected orders.
 * The caller's own (RLS-scoped) client decides which orders they may touch;
 * the sync itself runs privileged because courier credentials are admin-only.
 */
export const bulkRecheckCourierStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ orderIds: z.array(z.string()).min(1).max(200) }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { syncShipmentStatus } = await import("@/lib/couriers.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Only orders the caller can actually read.
    const { data: visible } = await supabase
      .from("orders")
      .select("id, order_number, status")
      .in("id", data.orderIds);
    const allowed = visible ?? [];
    if (allowed.length === 0) return { checked: 0, changed: 0, errors: ["No accessible order."] };

    const { data: shipments } = await supabaseAdmin
      .from("shipments")
      .select("id, provider, consignment_id, tracking_id, order_id")
      .in(
        "order_id",
        allowed.map((o: any) => o.id),
      );

    const before = new Map(allowed.map((o: any) => [o.id, o.status]));
    const errors: string[] = [];
    let checked = 0;
    for (const sh of shipments ?? []) {
      const num = allowed.find((o: any) => o.id === (sh as any).order_id)?.order_number ?? null;
      try {
        await syncShipmentStatus(supabaseAdmin as any, sh as any, num);
        checked += 1;
      } catch (err: any) {
        errors.push(
          `${num ?? (sh as any).order_id}: ${
            err instanceof Response ? await err.clone().text() : (err?.message ?? String(err))
          }`,
        );
      }
    }

    const { data: after } = await supabaseAdmin
      .from("orders")
      .select("id, status")
      .in(
        "id",
        allowed.map((o: any) => o.id),
      );
    const changed = (after ?? []).filter((o: any) => before.get(o.id) !== o.status).length;
    return { checked, changed, errors: errors.slice(0, 5) };
  });

/** Orders currently out with a delivery rider (admin / reseller / supplier scoped). */
export const getRiderFollowup = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("rider_followup_orders");
    if (error) throw new Error(error.message);
    return (data ?? { orders: [] }) as { orders: any[]; now?: string };
  });

