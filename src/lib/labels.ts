import JsBarcode from "jsbarcode";
import { supabase } from "@/integrations/laravel/client";
import { getGlobalSettings } from "@/lib/app-data";
import { courierBrand } from "@/components/courier-brand";

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

  const size = forceSize || (settings as any)?.label_size || "3x4";
  const siteName = settings?.site_name || "ResellHub";

  const itemsByOrder = new Map<string, any[]>();
  (items as any[] | null)?.forEach((it: any) => {
    const arr = itemsByOrder.get(it.order_id) || [];
    arr.push(it);
    itemsByOrder.set(it.order_id, arr);
  });

  const shipmentsByOrder = new Map<string, any>();
  (shipments as any[] | null)?.forEach((s: any) => shipmentsByOrder.set(s.order_id, s));

  const docs: LabelDoc[] = (orders as any[]).map((o: any) => {
    const s = shipmentsByOrder.get(o.id);
    const rawPhone = o.customer_phone || "";
    const maskedPhone = maskPhone && rawPhone
      ? rawPhone.length <= 4
        ? "****"
        : rawPhone.slice(0, 3) + "*".repeat(Math.max(rawPhone.length - 6, 4)) + rawPhone.slice(-2)
      : rawPhone;
    return {
      orderNumber: o.order_number,
      storeName: siteName,
      storeLogo: (settings as any)?.logo_url ?? null,
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
  const orderBarcodeHeight = size === "3x3" ? 30 : 38;
  const trackingBarcodeHeight = size === "3x3" ? 48 : 60;
  const trackingFontSize = size === "3x3" ? 18 : 22;

  const win = window.open("", "_blank");
  if (!win) return;

  win.document.write(`
    <html>
      <head>
        <title>Shipping Labels - ${size}</title>
        <style>
          @page { size: ${width} ${height}; margin: 0.04in; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #fff; }
          .label {
            width: calc(${width} - 0.08in);
            height: calc(${height} - 0.08in);
            padding: 0.09in;
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
            align-items: center;
            justify-content: space-between;
            gap: 4px;
            min-width: 0;
            margin-bottom: 1px;
            border-bottom: 2px solid #000;
            padding-bottom: 1px;
          }
          .brand-box { display: flex; align-items: center; flex-shrink: 0; max-width: 40%; }
          .brand-logo { max-height: 24px; max-width: 100%; object-fit: contain; }
          .site-name { font-size: 8.5pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .order-barcode { flex: 0 0 auto; min-width: 0; max-width: 58%; text-align: right; }
          .order-barcode svg { width: 100%; height: auto; display: block; max-height: ${orderBarcodeHeight}px; }

          .courier-section {
            border: 1.5px solid #000;
            border-radius: 4px;
            padding: 4px 5px;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .courier-info { display: flex; flex-direction: column; align-items: center; gap: 2px; flex-shrink: 0; width: 0.62in; }
          .courier-logo { max-height: 16px; max-width: 100%; object-fit: contain; }
          .courier-name { font-size: 6.5pt; font-weight: 900; text-transform: uppercase; color: #000; text-align: center; line-height: 1.1; }
          .courier-barcode { flex: 1; min-width: 0; text-align: center; border-left: 1px dashed #999; padding-left: 5px; }
          .courier-barcode svg { width: 100%; height: auto; display: block; max-height: ${trackingBarcodeHeight + 12}px; }
          .tracking-pending { font-size: 8pt; font-family: monospace; font-weight: bold; border: 1px dashed #000; padding: 3px 8px; border-radius: 3px; }

          .section-title { font-size: 6.5pt; text-transform: uppercase; color: #666; font-weight: bold; margin-bottom: 2px; letter-spacing: 0.4px; }

          .customer {
            border: 1.5px solid #000;
            padding: 5px;
            margin-bottom: 4px;
            border-radius: 4px;
          }
          .name { font-size: 11.5pt; font-weight: 800; margin-bottom: 2px; color: #000; }
          .phone { font-size: 10pt; font-weight: bold; margin-bottom: 3px; display: block; border-bottom: 1px dashed #000; width: fit-content; }
          .address { font-size: 8pt; line-height: 1.25; font-weight: 500; }

          .items-box {
            border: 1px solid #000;
            padding: 4px;
            flex-grow: 1;
            margin-bottom: 4px;
            border-radius: 4px;
            background: #f9f9f9;
            font-size: 7.5pt;
            overflow: hidden;
          }
          .item-row {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            gap: 6px;
            margin-bottom: 2px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 2px;
          }
          .item-row:last-child { border-bottom: none; }
          .item-name { flex: 1; min-width: 0; line-height: 1.2; font-size: 7.5pt; }
          .item-qty { font-weight: 900; color: #000; white-space: nowrap; font-size: 8.5pt; }

          .footer {
            margin-top: auto;
            border-top: 2px solid #000;
            padding-top: 3px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 6px;
          }
          .thanks { font-size: 6pt; font-weight: 700; text-transform: uppercase; color: #444; letter-spacing: 0.4px; line-height: 1.2; }
          .cod-badge { background: #000; color: #fff; padding: 3px 8px; border-radius: 4px; text-align: right; }
          .cod-label { font-size: 6pt; text-transform: uppercase; display: block; line-height: 1; }
          .cod-value { font-size: 11pt; font-weight: 900; }
        </style>
      </head>
      <body>
        ${docs.map((d) => {
          const orderBarcode = barcodeSvg(d.orderNumber, orderBarcodeHeight, 14);
          const trackingBarcode = d.courier?.tracking ? barcodeSvg(d.courier.tracking, trackingBarcodeHeight, trackingFontSize) : "";
          const brand = courierBrand(d.courier?.provider);
          const brandLogo = brand?.wordmark ?? null;
          return `
            <div class="label">
              <div class="header">
                <div class="brand-box">
                  ${d.storeLogo ? `<img src="${d.storeLogo}" class="brand-logo" />` : `<div class="site-name">${d.storeName}</div>`}
                </div>
                <div class="order-barcode">${orderBarcode || `<strong style="font-size:13pt">#${d.orderNumber}</strong>`}</div>
              </div>
              <div class="courier-section">
                <div class="courier-info">
                  ${brandLogo ? `<img src="${brandLogo}" class="courier-logo" />` : ""}
                  <div class="courier-name">${brand?.label ?? (d.courier?.provider ? String(d.courier.provider) : "MANUAL")}</div>
                </div>
                ${trackingBarcode
                  ? `<div class="courier-barcode">${trackingBarcode}</div>`
                  : `<div class="courier-barcode"><span class="tracking-pending">${d.courier?.tracking || "PENDING"}</span></div>`}
              </div>
              <div class="customer">
                ${d.customer
                  ? `<div class="section-title">Recipient</div>
                     <div class="name">${d.customer.name}</div>
                     <div class="phone">${d.customer.phone}</div>
                     <div class="address">${d.customer.address}</div>`
                  : `<div class="section-title">Parcel</div>
                     <div class="name">#${d.orderNumber}</div>`}
              </div>
              <div class="items-box">
                <div class="section-title">Order Items</div>
                ${d.items.map((it) => `<div class="item-row"><span class="item-name">${it.name}</span><span class="item-qty">x ${it.qty}</span></div>`).join("")}
              </div>
              <div class="footer">
                <div class="thanks">Thank you for<br>shopping with us</div>
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
