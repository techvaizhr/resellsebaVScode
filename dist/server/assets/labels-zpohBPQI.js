import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { t as createServerFn } from "./createServerFn-BhXNZl1x.js";
import { t as require_JsBarcode } from "./vendor-barcode-CVWVXWYQ.js";
import { r as supabase, s as createSsrRpc } from "./client-DipTEthi.js";
import { t as useServerFn } from "./useServerFn-mrQ2htrR.js";
import { t as requireSupabaseAuth } from "./auth-middleware-XRMpJ1R8.js";
import { f as useQuery } from "./order-search-bAlDZ8I2.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { Nt as LoaderCircle, S as Store, h as TriangleAlert, m as Truck } from "./vendor-icons-DF2A5Z8S.js";
import { n as Dialog, o as DialogHeader, r as DialogContent, s as DialogTitle } from "./ConfirmModal-DSu87j9m.js";
import { n as getGlobalSettings } from "./app-data-Di_u0JOy.js";
import { c as bookSteadfast, n as CourierLogo, o as bookCarrybee, r as courierBrand, s as bookPathao, t as COURIER_BRANDS } from "./courier-brand-CQNMOlnC.js";
//#region src/lib/courier-config.functions.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var getActiveCouriers = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("02213bd497c0eaf0a2687ab1b01d71f96e5763da0a2546216be66a5f5f034170"));
/** Active providers plus their saved pickup stores (multi-store booking). */
var getCourierBookingOptions = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("c73cecbaf7348f9b524e70bab5e2011554ed424328568749bec2a7e553ed6610"));
//#endregion
//#region src/lib/supplier-colors.ts
/**
* Dynamic, unlimited per-supplier row tinting.
*
* Each supplier id is hashed into a stable hue, so every supplier gets its own
* soft pastel row colour without any hardcoded palette. Orders that contain
* products from more than one supplier get a gradient of those hues.
* Admin-only orders (no supplier) stay neutral.
*/
function hashHue(id) {
	let h = 0;
	for (let i = 0; i < id.length; i++) h = h * 31 + id.charCodeAt(i) >>> 0;
	return Math.round(h % 360 * .618033988749895 * 360) % 360;
}
/** Soft background colour for a single supplier. */
function supplierTintColor(id, alpha = .14) {
	return `hsl(${hashHue(id)} 85% 60% / ${alpha})`;
}
/** Stronger accent (border / dot) for a single supplier. */
function supplierAccentColor(id) {
	return `hsl(${hashHue(id)} 70% 50% / 0.55)`;
}
/**
* Build the row tint for an order from the supplier ids of its items.
* `null`/undefined ids (admin's own products) are ignored.
*/
function orderSupplierTint(ids) {
	const unique = Array.from(new Set(ids.filter((x) => !!x)));
	if (unique.length === 0) return null;
	if (unique.length === 1) {
		const id = unique[0];
		return {
			mixed: false,
			style: {
				backgroundColor: supplierTintColor(id),
				borderLeft: `3px solid ${supplierAccentColor(id)}`
			}
		};
	}
	return {
		mixed: true,
		style: {
			backgroundImage: `linear-gradient(100deg, ${unique.slice(0, 4).map((id, i, arr) => `${supplierTintColor(id, .18)} ${Math.round(i / Math.max(arr.length - 1, 1) * 100)}%`).join(", ")})`,
			borderLeft: `3px solid ${supplierAccentColor(unique[0])}`
		}
	};
}
//#endregion
//#region src/components/ShipmentBookingModal.tsx
var import_jsx_runtime = require_jsx_runtime();
function ShipmentBookingModal({ isOpen, onClose, orderIds, onSuccess }) {
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [provider, setProvider] = (0, import_react.useState)("steadfast");
	const [storeId, setStoreId] = (0, import_react.useState)("");
	const fetchOptions = useServerFn(getCourierBookingOptions);
	const { data: options = [] } = useQuery({
		queryKey: ["courier-booking-options"],
		queryFn: () => fetchOptions()
	});
	const activeProviders = (0, import_react.useMemo)(() => options.map((o) => o.provider), [options]);
	const activeCourierList = (0, import_react.useMemo)(() => activeProviders.map((id) => COURIER_BRANDS[id]).filter(Boolean), [activeProviders]);
	const current = (0, import_react.useMemo)(() => options.find((o) => o.provider === provider) ?? null, [options, provider]);
	const stores = current?.stores ?? [];
	const needsStoreChoice = stores.length > 1;
	(0, import_react.useEffect)(() => {
		if (activeProviders.length > 0 && !activeProviders.includes(provider)) setProvider(activeProviders[0]);
	}, [activeProviders]);
	(0, import_react.useEffect)(() => {
		if (!current) return;
		const remembered = typeof window !== "undefined" ? window.localStorage.getItem(`courier-store:${current.provider}`) ?? "" : "";
		const fallback = current.stores.some((s) => s.id === remembered) && remembered || current.defaultStoreId || current.stores[0]?.id || "";
		setStoreId(current.stores.some((s) => s.id === storeId) ? storeId : fallback);
	}, [current]);
	const pickStore = (id) => {
		setStoreId(id);
		if (typeof window !== "undefined") window.localStorage.setItem(`courier-store:${provider}`, id);
	};
	const doSteadfast = useServerFn(bookSteadfast);
	const doPathao = useServerFn(bookPathao);
	const doCarrybee = useServerFn(bookCarrybee);
	const handleBook = async () => {
		if (orderIds.length === 0) return;
		setLoading(true);
		let successCount = 0;
		let failCount = 0;
		let lastErrorMessage = "";
		for (const id of orderIds) try {
			try {
				const apiData = await (await fetch("/api/public/courier/actions", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						action: "book",
						provider,
						orderId: id,
						storeId: storeId || void 0
					})
				})).json();
				if (apiData && apiData.success) res = apiData;
			} catch {}
			if (!res) {
				if (provider === "steadfast") res = await doSteadfast({ data: { orderId: id } });
				else if (provider === "pathao") res = await doPathao({ data: {
					orderId: id,
					...storeId ? { storeId } : {}
				} });
				else if (provider === "carrybee") res = await doCarrybee({ data: {
					orderId: id,
					...storeId ? { storeId } : {}
				} });
			}
			successCount++;
		} catch (err) {
			console.error(`Booking failed for ${id}:`, err);
			failCount++;
			if (err instanceof Response) try {
				const txt = await err.text();
				if (txt) lastErrorMessage = txt;
			} catch {}
			else if (err?.message) lastErrorMessage = err.message;
		}
		if (successCount > 0) {
			toast.success(`Successfully booked ${successCount} order(s) with ${provider}`);
			onSuccess();
			onClose();
		}
		if (failCount > 0) toast.error(lastErrorMessage ? `Booking failed: ${lastErrorMessage}` : `Failed to book ${failCount} order(s). Please check courier settings.`);
		setLoading(false);
	};
	const autoBook = activeProviders.length === 1 && !needsStoreChoice;
	(0, import_react.useEffect)(() => {
		if (isOpen && !loading && autoBook && orderIds.length > 0) handleBook();
	}, [
		isOpen,
		autoBook,
		orderIds
	]);
	if (autoBook && isOpen) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: isOpen,
		onOpenChange: (open) => !loading && !open && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			className: "max-w-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center py-8 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary mb-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm font-medium",
					children: [
						"Booking ",
						orderIds.length,
						" order(s) with ",
						activeCourierList[0]?.label,
						"..."
					]
				})]
			})
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: isOpen,
		onOpenChange: (open) => !loading && !open && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-5 w-5 text-primary" }), "Courier Booking"]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mb-4 text-sm text-muted-foreground",
							children: [
								"Select a courier provider to book ",
								orderIds.length,
								" selected order(s)."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 gap-3",
							children: activeCourierList.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setProvider(p.id),
								className: `flex items-center justify-between rounded-lg border p-4 text-left transition-all hover:bg-accent ${provider === p.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourierLogo, {
										provider: p.id,
										size: 30
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										children: p.label
									})]
								}), provider === p.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-2 rounded-full bg-primary" })]
							}, p.id))
						}),
						stores.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mb-1 flex items-center gap-1.5 text-xs font-medium",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-3.5 w-3.5" }),
									" Pickup store",
									stores.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: [
											"(",
											stores.length,
											" saved)"
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: storeId,
								onChange: (e) => pickStore(e.target.value),
								className: "w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring",
								children: stores.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: s.id,
									children: [s.name || s.id, current?.defaultStoreId === s.id ? " (default)" : ""]
								}, s.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex items-start gap-3 rounded-lg bg-amber-50 p-3 text-amber-800 border border-amber-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs leading-relaxed",
								children: "Booking will create live consignments in the courier panel. Ensure store configurations are correct before proceeding."
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-end gap-3 border-t pt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled: loading,
						onClick: onClose,
						className: "rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						disabled: loading || activeProviders.length === 0,
						onClick: handleBook,
						className: "btn-brand flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold disabled:opacity-50",
						children: [
							loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
							"Confirm ",
							provider ? COURIER_BRANDS[provider]?.label : "Courier",
							" Booking"
						]
					})]
				})
			]
		})
	});
}
//#endregion
//#region src/lib/labels.ts
var import_JsBarcode = /* @__PURE__ */ __toESM(require_JsBarcode(), 1);
async function printShippingLabels(orderIds, forceSize, options) {
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
	const size = forceSize || settings?.label_size || "3x4";
	const siteName = settings?.site_name || "ResellHub";
	const itemsByOrder = /* @__PURE__ */ new Map();
	items?.forEach((it) => {
		const arr = itemsByOrder.get(it.order_id) || [];
		arr.push(it);
		itemsByOrder.set(it.order_id, arr);
	});
	const shipmentsByOrder = /* @__PURE__ */ new Map();
	shipments?.forEach((s) => shipmentsByOrder.set(s.order_id, s));
	printLabelDocs(orders.map((o) => {
		const s = shipmentsByOrder.get(o.id);
		const rawPhone = o.customer_phone || "";
		const maskedPhone = maskPhone && rawPhone ? rawPhone.length <= 4 ? "****" : rawPhone.slice(0, 3) + "*".repeat(Math.max(rawPhone.length - 6, 4)) + rawPhone.slice(-2) : rawPhone;
		return {
			orderNumber: o.order_number,
			storeName: siteName,
			storeLogo: settings?.logo_url ?? null,
			area: o.area,
			customer: hideCustomer ? null : {
				name: o.customer_name,
				phone: maskedPhone,
				address: o.address_line
			},
			items: (itemsByOrder.get(o.id) || []).map((it) => ({
				name: it.product_name,
				qty: it.quantity
			})),
			courier: {
				provider: s?.provider ?? null,
				tracking: s?.tracking_id || s?.consignment_id || null
			},
			cod: hideCustomer ? null : Number(o.total)
		};
	}), size);
}
/** Render a CODE128 barcode as inline SVG markup (serialized from a detached node). */
function barcodeSvg(value, height = 34, fontSize = 11) {
	if (!value) return "";
	try {
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		(0, import_JsBarcode.default)(svg, String(value), {
			format: "CODE128",
			displayValue: true,
			height,
			margin: 0,
			fontSize,
			fontOptions: "bold",
			textMargin: 2,
			lineColor: "#000",
			background: "transparent"
		});
		svg.setAttribute("style", "width:100%;height:auto;display:block;");
		svg.removeAttribute("width");
		return svg.outerHTML;
	} catch {
		return "";
	}
}
function printLabelDocs(docs, size = "3x4") {
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
                ${trackingBarcode ? `<div class="courier-barcode">${trackingBarcode}</div>` : `<div class="courier-barcode"><span class="tracking-pending">${d.courier?.tracking || "PENDING"}</span></div>`}
              </div>
              <div class="customer">
                ${d.customer ? `<div class="section-title">Recipient</div>
                     <div class="name">${d.customer.name}</div>
                     <div class="phone">${d.customer.phone}</div>
                     <div class="address">${d.customer.address}</div>` : `<div class="section-title">Parcel</div>
                     <div class="name">#${d.orderNumber}</div>`}
              </div>
              <div class="items-box">
                <div class="section-title">Order Items</div>
                ${d.items.map((it) => `<div class="item-row"><span class="item-name">${it.name}</span><span class="item-qty">x ${it.qty}</span></div>`).join("")}
              </div>
              <div class="footer">
                <div class="thanks">Thank you for<br>shopping with us</div>
                ${d.cod == null ? "" : `<div class="cod-badge">
                       <span class="cod-label">Cash to Collect</span>
                       <span class="cod-value">৳${Number(d.cod).toFixed(0)}</span>
                     </div>`}
              </div>
            </div>
          `;
	}).join("")}
        <script>window.onload = () => { window.print(); setTimeout(() => window.close(), 500); }<\/script>
      </body>
    </html>
  `);
	win.document.close();
}
//#endregion
export { getActiveCouriers as a, orderSupplierTint as i, printShippingLabels as n, ShipmentBookingModal as r, printLabelDocs as t };
