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
        const { authenticateCronRequest } = await import("@/integrations/laravel/cron-auth");
        const authorized = await authenticateCronRequest(request);
        if (!authorized) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        const { supabaseAdmin } = await import("@/integrations/laravel/client.server");
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
