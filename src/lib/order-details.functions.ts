import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/laravel/auth-middleware";

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

