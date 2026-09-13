import { createFileRoute } from "@tanstack/react-router";

/**
 * Pathao webhook receiver.
 *
 * Configure in Pathao merchant panel → Webhook Integration:
 *   https://<your-domain>/api/public/courier/pathao
 *   Secret: the "Webhook Secret" saved in Couriers → Pathao settings
 *
 * Requirements handled here:
 *  - every response echoes `X-Pathao-Merchant-Webhook-Integration-Secret` with
 *    the configured secret (Pathao's integration check requires it),
 *  - `X-PATHAO-Signature` header must match the configured secret,
 *  - responds fast (well within Pathao's 10s limit).
 */

const SIGNATURE_HEADER = "x-pathao-signature";
const INTEGRATION_HEADER = "X-Pathao-Merchant-Webhook-Integration-Secret";

function json(body: unknown, status: number, secret?: string) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...(secret ? { [INTEGRATION_HEADER]: secret } : {}),
    },
  });
}

export const Route = createFileRoute("/api/public/courier/pathao")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        let payload: any;
        try {
          payload = raw ? JSON.parse(raw) : null;
        } catch {
          return json({ error: true, message: "Invalid JSON" }, 400);
        }
        const events = Array.isArray(payload) ? payload : payload ? [payload] : [];

        // Pathao's integration check sends {"event":"webhook_integration"} with no
        // signature and must get HTTP 202 with the integration secret echoed back.
        // It runs BEFORE any database access so the handshake also succeeds where
        // the privileged client is unavailable (custom domains).
        const envIntegration = String(process.env["PATHAO_INTEGRATION_SECRET"] ?? "");
        const envSecret = String(process.env["PATHAO_WEBHOOK_SECRET"] ?? "");
        if (events.some((e) => String(e?.event ?? "") === "webhook_integration")) {
          let integrationSecret = envIntegration || envSecret;

          // Runtime secrets are not guaranteed to be injected on every custom-domain
          // request. Use the public, read-only handshake RPC as a reliable fallback.
          if (!integrationSecret) {
            const backendUrl = String(process.env["SUPABASE_URL"] ?? "");
            const publishableKey = String(process.env["SUPABASE_PUBLISHABLE_KEY"] ?? "");
            if (backendUrl && publishableKey) {
              try {
                const response = await fetch(`${backendUrl}/rest/v1/rpc/pathao_webhook_handshake_secret`, {
                  method: "POST",
                  headers: {
                    apikey: publishableKey,
                    "Content-Type": "application/json",
                  },
                  body: "{}",
                });
                if (response.ok) {
                  const value: unknown = await response.json();
                  if (typeof value === "string") integrationSecret = value.trim();
                }
              } catch {
                // Keep the webhook acknowledgement fast even if the fallback is unavailable.
              }
            }
          }

          return json(
            { error: false, message: "webhook_integration acknowledged" },
            202,
            integrationSecret || undefined,
          );
        }

        const { supabaseAdmin } = await import("@/integrations/laravel/client.server");
        const { applyCourierUpdate } = await import("@/lib/couriers.server");

        const { data: cfg } = await supabaseAdmin
          .from("courier_configs")
          .select("config")
          .eq("provider", "pathao")
          .maybeSingle();
        const secret = String((cfg?.config as any)?.webhook_secret ?? "") || envSecret;
        if (!secret) return json({ error: true, message: "Webhook secret not configured" }, 401);

        const signature = (request.headers.get(SIGNATURE_HEADER) ?? "").trim();


        const url = new URL(request.url);
        const tokenOk = (url.searchParams.get("token") ?? "") === secret;
        if (signature !== secret && !tokenOk)
          return json({ error: true, message: "Invalid signature" }, 401, secret);

        if (events.length === 0) return json({ error: true, message: "Empty payload" }, 400, secret);

        let matched = 0;
        for (const e of events) {
          const event = String(e?.event ?? "");
          // store.* events carry no consignment — nothing to apply to an order
          if (!event || event.startsWith("store.")) continue;
          const note =
            [e.reason, e.return_type ? `Return type: ${e.return_type}` : null, e.invoice_id ? `Invoice: ${e.invoice_id}` : null]
              .filter(Boolean)
              .join(" · ") || null;
          const res = await applyCourierUpdate(supabaseAdmin, {
            provider: "pathao",
            consignmentId: e.consignment_id != null ? String(e.consignment_id) : null,
            trackingCode: e.consignment_id != null ? String(e.consignment_id) : null,
            invoice: e.merchant_order_id ?? null,
            courierStatus: event,
            source: "webhook",
            notificationType: event,
            codAmount: e.collected_amount != null ? Number(e.collected_amount) : null,
            deliveryCharge: e.delivery_fee != null ? Number(e.delivery_fee) : null,
            note,
            payload: e,
          });
          if (res.matched) matched += 1;
        }

        return json({ error: false, message: "processed", matched }, 200, secret);
      },
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/laravel/client.server");
        const { data: cfg } = await supabaseAdmin
          .from("courier_configs")
          .select("config")
          .eq("provider", "pathao")
          .maybeSingle();
        const secret = String((cfg?.config as any)?.webhook_secret ?? "");
        return json({ error: false, message: "Pathao webhook endpoint" }, 200, secret || undefined);
      },
    },
  },
});
