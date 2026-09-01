import JsBarcode from "jsbarcode";
import { supabase } from "@/integrations/supabase/client";
import { getGlobalSettings } from "@/lib/app-data";
import { courierLabel } from "@/components/courier-brand";

export type LabelDoc = {
  orderNumber: string;
  storeName: string;
  storeLogo?: string | null;
  area: string;
  customer?: { name: string; phone: string; address: string } | null;
  items: { name: string; qty: number }[];
  courier?: { provider: string | null; tracking: string | null } | null;
  cod?: number | null;
};

export async function printShippingLabels(
  orderIds: string[],
  forceSize?: "3x3" | "3x4",
  options?: { hideCustomer?: boolean; maskPhone?: boolean },
) {
  const hideCustomer = options?.hideCustomer === true;
  const maskPhone = options?.maskPhone === true;
  if (!orderIds.length) return;

  const [settings, { data: orders }, { data: items }, { data: shipments }] = await Promise.all([
    getGlobalSettings(),
    supabase.from("orders").select("id,order_number,customer_name,customer_phone,address_line,area,total,reseller_id").in("id", orderIds),
    supabase.from("order_items").select("order_id,product_name,quantity").in("order_id", orderIds),
    supabase.from("shipments").select("order_id,provider,tracking_id,consignment_id").in("order_id", orderIds)
  ]);

  if (!orders || orders.length === 0) return;

  const resellerIds = [...new Set(orders.map((o) => o.reseller_id).filter((x): x is string => Boolean(x)))];
  const { data: resellers } = await supabase
    .from("resellers")
    .select("id,business_name,reseller_settings(logo_url,store_name)")
    .in("id", resellerIds);

  const resellerMap = new Map();
  resellers?.forEach(r => {
    const s = Array.isArray(r.reseller_settings) ? r.reseller_settings[0] : r.reseller_settings;
    resellerMap.set(r.id, {
      name: s?.store_name || r.business_name,
      logo: s?.logo_url
    });
  });

  const size = forceSize || (settings as any)?.label_size || "3x4";
  const siteName = settings?.site_name || "ResellHub";

  const itemsByOrder = new Map<string, any[]>();
  items?.forEach(it => {
    const arr = itemsByOrder.get(it.order_id) || [];
    arr.push(it);
    itemsByOrder.set(it.order_id, arr);
  });

  const shipmentsByOrder = new Map<string, any>();
  shipments?.forEach(s => shipmentsByOrder.set(s.order_id, s));

  const docs: LabelDoc[] = orders.map((o) => {
    const reseller = resellerMap.get(o.reseller_id);
    const s = shipmentsByOrder.get(o.id);
    const rawPhone = o.customer_phone || "";
    const maskedPhone = maskPhone && rawPhone
      ? rawPhone.length <= 4
        ? "****"
        : rawPhone.slice(0, 3) + "*".repeat(Math.max(rawPhone.length - 6, 4)) + rawPhone.slice(-2)
      : rawPhone;
    return {
      orderNumber: o.order_number,
      storeName: reseller?.name || siteName,
      storeLogo: reseller?.logo ?? null,
      area: o.area,
      customer: hideCustomer
        ? null
        : { name: o.customer_name, phone: maskedPhone, address: o.address_line },
      items: (itemsByOrder.get(o.id) || []).map((it) => ({ name: it.product_name, qty: it.quantity })),
      courier: { provider: s?.provider ?? null, tracking: s?.tracking_id || s?.consignment_id || null },
      cod: hideCustomer ? null : Number(o.total),
    };
  });

  printLabelDocs(docs, size);
}

/** Render a CODE128 barcode as inline SVG markup (serialized from a detached node). */
function barcodeSvg(value: string, height = 34, fontSize = 11): string {
  if (!value) return "";
  try {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    JsBarcode(svg, String(value), {
      format: "CODE128",
      displayValue: true,
      height,
      margin: 0,
      fontSize,
      fontOptions: "bold",
      textMargin: 2,
      lineColor: "#000",
      background: "transparent",
    });
    svg.setAttribute("style", "width:100%;height:auto;display:block;");
    svg.removeAttribute("width");
    return svg.outerHTML;
  } catch {
    return "";
  }
}

export function printLabelDocs(docs: LabelDoc[], size: "3x3" | "3x4" = "3x4") {
  if (!docs.length) return;
  const width = size === "3x3" ? "3in" : "3in";
  const height = size === "3x3" ? "3in" : "4in";

  const win = window.open("", "_blank");
  if (!win) return;

  win.document.write(`
    <html>
      <head>
        <title>Shipping Labels - ${size}</title>
        <style>
          @page { size: ${width} ${height}; margin: 0; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #fff; }
          .label {
            width: ${width};
            height: ${height};
            padding: 0.12in;
            box-sizing: border-box;
            border: 2px solid #000;
            page-break-after: always;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            position: relative;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 6px;
          }
          .reseller-info { display: flex; align-items: center; gap: 6px; min-width: 0; }
          .reseller-logo { width: 30px; height: 30px; object-fit: contain; border: 1px solid #eee; border-radius: 4px; }
          .site-name { font-size: 10pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .order-tag { font-size: 7pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; background: #000; color: #fff; padding: 3px 8px; border-radius: 3px; white-space: nowrap; }

          .order-barcode {
            border-top: 2px solid #000;
            border-bottom: 2px solid #000;
            margin: 5px 0 7px;
            padding: 3px 4px 1px;
            text-align: center;
          }
          .order-barcode svg { max-height: 40px; }

          .section-title { font-size: 6.5pt; text-transform: uppercase; color: #666; font-weight: bold; margin-bottom: 2px; letter-spacing: 0.4px; }

          .customer {
            border: 1.5px solid #000;
            padding: 7px;
            margin-bottom: 7px;
            border-radius: 4px;
          }
          .name { font-size: 12.5pt; font-weight: 800; margin-bottom: 2px; color: #000; }
          .phone { font-size: 11pt; font-weight: bold; margin-bottom: 4px; display: block; border-bottom: 1px dashed #000; width: fit-content; }
          .address { font-size: 8.5pt; line-height: 1.3; font-weight: 500; }

          .items-box {
            border: 1px solid #000;
            padding: 6px;
            flex-grow: 1;
            margin-bottom: 7px;
            border-radius: 4px;
            background: #f9f9f9;
            font-size: 8pt;
            overflow: hidden;
          }
          .item-row { display: block; margin-bottom: 2px; border-bottom: 1px solid #ddd; padding-bottom: 2px; }
          .item-row:last-child { border-bottom: none; }

          .courier-box {
            border: 1.5px solid #000;
            border-radius: 4px;
            padding: 6px;
            margin-bottom: 7px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 8px;
          }
          .courier-info { display: flex; flex-direction: column; min-width: 0; }
          .courier { font-size: 10pt; font-weight: 900; text-transform: uppercase; color: #000; }
          .courier-barcode { flex: 1; min-width: 0; text-align: center; }
          .courier-barcode svg { max-height: 32px; max-width: 100%; }
          .tracking-pending { font-size: 8pt; font-family: monospace; font-weight: bold; border: 1px dashed #000; padding: 3px 8px; border-radius: 3px; }

          .footer {
            border-top: 2px solid #000;
            padding-top: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .thanks { font-size: 7pt; font-weight: 700; text-transform: uppercase; color: #444; letter-spacing: 0.5px; }
          .cod-badge {
            background: #000;
            color: #fff;
            padding: 4px 10px;
            border-radius: 4px;
            text-align: right;
          }
          .cod-label { font-size: 6.5pt; text-transform: uppercase; display: block; line-height: 1; }
          .cod-value { font-size: 13pt; font-weight: 900; }
        </style>
      </head>
      <body>
        ${docs.map((d) => {
          const orderBarcode = barcodeSvg(d.orderNumber, 34, 10);
          const trackingBarcode = d.courier?.tracking ? barcodeSvg(d.courier.tracking, 26, 9) : "";
          return `
            <div class="label">
              <div class="header">
                <div class="reseller-info">
                  ${d.storeLogo ? `<img src="${d.storeLogo}" class="reseller-logo" />` : ""}
                  <div class="site-name">${d.storeName}</div>
                </div>
                <div class="order-tag">Order ID</div>
              </div>
              <div class="order-barcode">${orderBarcode || `<strong>#${d.orderNumber}</strong>`}</div>
              <div class="customer">
                ${d.customer
                  ? `<div class="section-title">Recipient</div>
                     <div class="name">${d.customer.name}</div>
                     <div class="phone">${d.customer.phone}</div>
                     <div class="address">${d.customer.address}<br><strong>${d.area.replace("_", " ")}</strong></div>`
                  : `<div class="section-title">Parcel</div>
                     <div class="name">#${d.orderNumber}</div>
                     <div class="address"><strong>${d.area.replace("_", " ")}</strong></div>`}
              </div>
              <div class="items-box">
                <div class="section-title">Order Items</div>
                ${d.items.map((it) => `<span class="item-row">${it.name} <strong>x ${it.qty}</strong></span>`).join("")}
              </div>
              <div class="courier-box">
                <div class="courier-info">
                  <div class="section-title">Courier</div>
                  <div class="courier">${courierLabel(d.courier?.provider as never) === "—" ? "Manual" : courierLabel(d.courier?.provider as never)}</div>
                </div>
                ${trackingBarcode
                  ? `<div class="courier-barcode">${trackingBarcode}</div>`
                  : `<div class="tracking-pending">${d.courier?.tracking || "PENDING"}</div>`}
              </div>
              <div class="footer">
                <div class="thanks">Thank you for shopping with us</div>
                ${d.cod == null
                  ? ""
                  : `<div class="cod-badge">
                       <span class="cod-label">Cash to Collect</span>
                       <span class="cod-value">৳${Number(d.cod).toFixed(0)}</span>
                     </div>`}
              </div>
            </div>
          `;
        }).join("")}
        <script>window.onload = () => { window.print(); setTimeout(() => window.close(), 500); }</script>
      </body>
    </html>
  `);
  win.document.close();
}
