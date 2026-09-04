import { createFileRoute } from "@tanstack/react-router";

/**
 * Automatic courier status sync.
 *
 * Webhooks can be missed (misconfigured URL, courier outage, custom domain),
 * so this endpoint polls every shipment that is not yet in a final state and
 * applies the live courier status. Meant to be called on a schedule with the
 * cron bearer secret.
 */
export const Route = createFileRoute("/api/public/courier/sync")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { authenticateCronRequest } = await import("@/integrations/supabase/cron-auth");
        const unauthorized = await authenticateCronRequest(request);
        if (unauthorized) return unauthorized;

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { syncPendingShipments } = await import("@/lib/couriers.server");
        const result = await syncPendingShipments(supabaseAdmin as any);

        return new Response(JSON.stringify({ status: 200, ...result }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
      GET: async () =>
        new Response(JSON.stringify({ status: 200, message: "Courier sync endpoint" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
    },
  },
});
