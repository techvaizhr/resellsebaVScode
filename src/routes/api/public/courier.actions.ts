import { createFileRoute } from "@tanstack/react-router";
import initialData from "@/lib/initial-data.json";

function getCourierConfigFromData(provider: string) {
  const configs = (initialData as any).courier_configs || [];
  const found = configs.find((c: any) => c.provider === provider);
  return (found?.config || {}) as Record<string, string>;
}

export const Route = createFileRoute("/api/public/courier/actions")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const action = url.searchParams.get("action");

        try {
          if (action === "steadfast-balance") {
            const conf = getCourierConfigFromData("steadfast");
            const apiKey = conf.api_key || "gjxtwjhxniitwuqkcthfnyaojqomw54y";
            const secretKey = conf.secret_key || "s1bppsevlct37lzbeovxhc8d";
            const base = (conf.base_url || "https://portal.packzy.com/api/v1").replace(/\/+$/, "");

            const res = await fetch(`${base}/get_balance`, {
              headers: {
                "Api-Key": apiKey,
                "Secret-Key": secretKey,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            });
            const text = await res.text();
            const body = text ? JSON.parse(text) : {};
            if (!res.ok) {
              return new Response(
                JSON.stringify({ success: false, message: body?.message || "Steadfast balance failed" }),
                { status: res.status, headers: { "Content-Type": "application/json" } }
              );
            }
            return new Response(
              JSON.stringify({ success: true, balance: Number(body.current_balance ?? 0) }),
              { status: 200, headers: { "Content-Type": "application/json" } }
            );
          }

          if (action === "pathao-stores") {
            const conf = getCourierConfigFromData("pathao");
            const authRes = await fetch("https://api-hermes.pathao.com/aladdin/api/v1/issue-token", {
              method: "POST",
              headers: { "Content-Type": "application/json", Accept: "application/json" },
              body: JSON.stringify({
                client_id: conf.client_id || "nXe0L65exr",
                client_secret: conf.client_secret || "4UJJZbHVoZOBzKUCZdHChjtTqqeEKhcSEbfu3HdO",
                username: conf.username || "zahidha367@gmail.com",
                password: conf.password || "Zahid367//",
                grant_type: "password",
              }),
            });
            const authBody = await authRes.json();
            const token = authBody.access_token;
            if (!token) {
              return new Response(
                JSON.stringify({ success: false, message: "Pathao authentication failed" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
              );
            }

            const storesRes = await fetch("https://api-hermes.pathao.com/aladdin/api/v1/stores", {
              headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            });
            const storesBody = await storesRes.json();
            const raw = storesBody?.data?.data || storesBody?.data || [];
            const stores = raw.map((s: any) => ({
              id: String(s.store_id ?? s.id ?? ""),
              name: String(s.store_name ?? s.name ?? ""),
              address: String(s.store_address ?? s.address ?? ""),
              isActive: Boolean(s.is_active),
              isDefaultPickup: Boolean(s.is_default_store),
            })).filter((s: any) => s.id);

            return new Response(
              JSON.stringify({
                success: true,
                stores,
                defaultStoreId: String(conf.store_id || stores[0]?.id || ""),
              }),
              { status: 200, headers: { "Content-Type": "application/json" } }
            );
          }

          if (action === "carrybee-stores") {
            const conf = getCourierConfigFromData("carrybee");
            const res = await fetch("https://developers.carrybee.com/api/v2/stores", {
              headers: {
                "Client-ID": conf.client_id || "ce4a4884-b7a0-496c-b4de-4ea70d41f7fa",
                "Client-Secret": conf.client_secret || "3a5321d9-d540-4c47-beab-e529d1fe0464",
                "Client-Context": conf.client_context || "EG3MhxLZ9ck8reBm0UyPW6j1V2vblN",
                Accept: "application/json",
              },
            });
            const body = await res.json();
            const raw = body?.data?.stores || body?.data?.items || body?.data || [];
            const stores = raw.map((s: any) => ({
              id: String(s.id ?? s.store_id ?? ""),
              name: String(s.name ?? s.store_name ?? ""),
              isApproved: s.status === "approved" || Boolean(s.is_approved),
              isActive: s.is_active !== false,
              isDefaultPickup: Boolean(s.is_default_pickup_store),
            })).filter((s: any) => s.id);

            return new Response(
              JSON.stringify({
                success: true,
                stores,
                defaultStoreId: String(conf.store_id || stores.find((s: any) => s.isDefaultPickup)?.id || stores[0]?.id || ""),
              }),
              { status: 200, headers: { "Content-Type": "application/json" } }
            );
          }

          return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400 });
        } catch (err: any) {
          return new Response(
            JSON.stringify({ success: false, message: err?.message || String(err) }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },

      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { action, provider = "steadfast", orderId, storeId } = body || {};

          if (action === "book" || provider) {
            const orders = (initialData as any).orders || [];
            const foundOrder = orders.find((o: any) => o.id === orderId || o.order_number === orderId);
            const order = body.order || foundOrder || {
              id: orderId,
              order_number: String(orderId).replace(/^order-/, "").split("-")[0] || "703280",
              customer_name: body.customer_name || "MD Jahid Hasan",
              customer_phone: body.customer_phone || "01733831300",
              address_line: body.address_line || "Dhaka",
              city: body.city || "Dhaka",
              total: body.total || 810,
              payment_method: body.payment_method || "cod",
            };

            const items = ((initialData as any).order_items || []).filter((i: any) => i.order_id === order.id || i.order_id === orderId);
            
            // Advance received (by admin or reseller) is deducted from total COD
            const total = Number(order.total || 0);
            const advance = Number(order.advance_amount || order.received_amount || order.advance || 0);
            let codAmount = 0;
            if (order.payment_status === "paid") {
              codAmount = 0;
            } else if (order.payment_method === "cod" || !order.payment_method) {
              codAmount = Math.max(0, total - advance);
            } else {
              codAmount = 0;
            }

            const fullAddress = [order.address_line, order.area, order.city].filter(Boolean).join(", ");
            const itemDesc = (items.length > 0 ? items.map((i: any) => `${i.product_name} x${i.quantity}`).join(", ") : "Parcel Items") || "Parcel Item";

            if (provider === "steadfast") {
              const conf = getCourierConfigFromData("steadfast");
              const apiKey = conf.api_key || "gjxtwjhxniitwuqkcthfnyaojqomw54y";
              const secretKey = conf.secret_key || "s1bppsevlct37lzbeovxhc8d";
              const base = (conf.base_url || "https://portal.packzy.com/api/v1").replace(/\/+$/, "");

              const sfPayload = {
                invoice: String(order.order_number),
                recipient_name: String(order.customer_name || "Customer").slice(0, 100),
                recipient_phone: String(order.customer_phone || "01700000000").replace(/[^0-9]/g, "").slice(-11),
                recipient_address: fullAddress || "Dhaka, Bangladesh",
                cod_amount: codAmount,
                note: (order.reseller_note || order.notes || "")?.slice(0, 250) || undefined,
                item_description: itemDesc.slice(0, 250),
                total_lot: items.reduce((s: number, i: any) => s + Number(i.quantity || 0), 0) || 1,
                delivery_type: 0,
              };

              const res = await fetch(`${base}/create_order`, {
                method: "POST",
                headers: {
                  "Api-Key": apiKey,
                  "Secret-Key": secretKey,
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
                body: JSON.stringify(sfPayload),
              });

              const text = await res.text();
              let resData: any = {};
              try { resData = JSON.parse(text); } catch { resData = { message: text }; }

              if (!res.ok || resData.status !== 200) {
                return new Response(
                  JSON.stringify({ success: false, message: resData.message || resData.errors || `Steadfast booking failed (${res.status})` }),
                  { status: 400, headers: { "Content-Type": "application/json" } }
                );
              }

              const consignment = resData.consignment || {};
              const trackingCode = consignment.tracking_code || String(consignment.consignment_id ?? "");
              const trackingUrl = consignment.tracking_link || `https://steadfast.com.bd/tl/${trackingCode}`;

              return new Response(
                JSON.stringify({
                  success: true,
                  provider: "steadfast",
                  trackingId: trackingCode,
                  consignmentId: String(consignment.consignment_id ?? ""),
                  trackingUrl,
                  status: consignment.status || "in_review",
                }),
                { status: 200, headers: { "Content-Type": "application/json" } }
              );
            }

            if (provider === "carrybee") {
              const conf = getCourierConfigFromData("carrybee");
              const effectiveStoreId = storeId || conf.store_id || "17199";

              const cbPayload = {
                store_id: Number(effectiveStoreId),
                merchant_order_id: String(order.order_number),
                recipient_name: String(order.customer_name || "Customer").slice(0, 100),
                recipient_phone: String(order.customer_phone || "01700000000").replace(/[^0-9]/g, "").slice(-11),
                recipient_address: fullAddress || "Dhaka, Bangladesh",
                recipient_city: 14,
                recipient_zone: 57,
                recipient_area: 2110,
                delivery_type: 1,
                product_type: 1,
                item_weight: 200, // default 200g
                item_quantity: items.reduce((s: number, i: any) => s + Number(i.quantity || 0), 0) || 1,
                collectable_amount: codAmount,
                product_description: itemDesc.slice(0, 255),
              };

              const res = await fetch("https://developers.carrybee.com/api/v2/orders", {
                method: "POST",
                headers: {
                  "Client-ID": conf.client_id || "ce4a4884-b7a0-496c-b4de-4ea70d41f7fa",
                  "Client-Secret": conf.client_secret || "3a5321d9-d540-4c47-beab-e529d1fe0464",
                  "Client-Context": conf.client_context || "EG3MhxLZ9ck8reBm0UyPW6j1V2vblN",
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
                body: JSON.stringify(cbPayload),
              });

              const text = await res.text();
              let resData: any = {};
              try { resData = JSON.parse(text); } catch { resData = { message: text }; }

              if (!res.ok || resData.error === true) {
                return new Response(
                  JSON.stringify({ success: false, message: resData.message || `Carrybee booking failed (${res.status})` }),
                  { status: 400, headers: { "Content-Type": "application/json" } }
                );
              }

              const o = resData?.data?.order || resData?.data || {};
              const consignmentId = String(o.consignment_id ?? "");

              return new Response(
                JSON.stringify({
                  success: true,
                  provider: "carrybee",
                  trackingId: consignmentId,
                  consignmentId,
                  status: "created",
                }),
                { status: 200, headers: { "Content-Type": "application/json" } }
              );
            }

            if (provider === "pathao") {
              const conf = getCourierConfigFromData("pathao");
              const effectiveStoreId = storeId || conf.store_id || "441826";

              // Auth
              const authRes = await fetch("https://api-hermes.pathao.com/aladdin/api/v1/issue-token", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({
                  client_id: conf.client_id || "nXe0L65exr",
                  client_secret: conf.client_secret || "4UJJZbHVoZOBzKUCZdHChjtTqqeEKhcSEbfu3HdO",
                  username: conf.username || "zahidha367@gmail.com",
                  password: conf.password || "Zahid367//",
                  grant_type: "password",
                }),
              });
              const authBody = await authRes.json();
              const token = authBody.access_token;
              if (!token) {
                return new Response(
                  JSON.stringify({ success: false, message: "Pathao authentication failed" }),
                  { status: 400, headers: { "Content-Type": "application/json" } }
                );
              }

              const pPayload = {
                store_id: Number(effectiveStoreId),
                merchant_order_id: String(order.order_number),
                recipient_name: String(order.customer_name || "Customer").slice(0, 100),
                recipient_phone: String(order.customer_phone || "01700000000").replace(/[^0-9]/g, "").slice(-11),
                recipient_address: fullAddress || "Dhaka, Bangladesh",
                recipient_city: 1,
                recipient_zone: 19,
                delivery_type: 48,
                item_type: 2,
                special_instruction: (order.reseller_note || order.notes || "")?.slice(0, 250) || undefined,
                item_quantity: items.reduce((s: number, i: any) => s + Number(i.quantity || 0), 0) || 1,
                item_weight: 0.2, // default 200g (0.2 kg)
                amount_to_collect: codAmount,
                item_description: itemDesc.slice(0, 250),
              };

              const pRes = await fetch("https://api-hermes.pathao.com/aladdin/api/v1/orders", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
                body: JSON.stringify(pPayload),
              });

              const pText = await pRes.text();
              let pData: any = {};
              try { pData = JSON.parse(pText); } catch { pData = { message: pText }; }

              if (!pRes.ok) {
                return new Response(
                  JSON.stringify({ success: false, message: pData.message || `Pathao booking failed (${pRes.status})` }),
                  { status: 400, headers: { "Content-Type": "application/json" } }
                );
              }

              const consignmentId = String(pData?.data?.consignment_id ?? "");

              return new Response(
                JSON.stringify({
                  success: true,
                  provider: "pathao",
                  trackingId: consignmentId,
                  consignmentId,
                  status: "Pending",
                }),
                { status: 200, headers: { "Content-Type": "application/json" } }
              );
            }
          }

          return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
        } catch (err: any) {
          return new Response(
            JSON.stringify({ success: false, message: err?.message || String(err) }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});

