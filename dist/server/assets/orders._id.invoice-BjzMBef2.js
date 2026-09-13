import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { r as supabase } from "./client-DdbbmuGT.js";
import { Mt as LoaderCircle, Q as Printer } from "./vendor-icons-BWIzFOtW.js";
import { t as Route } from "./orders._id.invoice-BWsETOoO.js";
//#region src/routes/_authenticated/reseller/orders.$id.invoice.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InvoicePage() {
	const { id } = Route.useParams();
	const [order, setOrder] = (0, import_react.useState)(null);
	const [items, setItems] = (0, import_react.useState)([]);
	const [store, setStore] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data: o } = await supabase.from("orders").select("id,order_number,customer_name,customer_phone,address_line,city,area,landmark,subtotal,shipping_cost,discount,total,payment_method,status,created_at,notes,reseller_id").eq("id", id).maybeSingle();
			if (!o) return;
			const [{ data: it }, { data: r }] = await Promise.all([supabase.from("order_items").select("id,product_name,quantity,reseller_price,line_total").eq("order_id", id), supabase.from("resellers").select("business_name, reseller_settings(*)").eq("id", o.reseller_id).maybeSingle()]);
			setOrder(o);
			setItems(it ?? []);
			const s = r?.reseller_settings ? Array.isArray(r.reseller_settings) ? r.reseller_settings[0] : r.reseller_settings : null;
			setStore(r ? {
				business_name: r.business_name,
				settings: s
			} : null);
		})();
	}, [id]);
	if (!order || !store) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	const primary = store.settings?.primary_color || "#111";
	const name = store.settings?.store_name || store.business_name;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl bg-white p-8 text-slate-900 print:p-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-center justify-between border-b pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [store.settings?.logo_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: store.settings.logo_url,
						alt: name,
						className: "h-12 w-12 rounded object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-12 w-12 place-items-center rounded font-bold text-white",
						style: { background: primary },
						children: name.charAt(0)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xl font-semibold",
							children: name
						}),
						store.settings?.tagline && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-slate-500",
							children: store.settings.tagline
						}),
						store.settings?.whatsapp && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-slate-500",
							children: ["WhatsApp: ", store.settings.whatsapp]
						})
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs uppercase tracking-wider text-slate-500",
							children: "Invoice"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono font-semibold",
							children: order.order_number
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-slate-500",
							children: new Date(order.created_at).toLocaleString()
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 grid grid-cols-2 gap-4 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-1 text-xs font-semibold uppercase text-slate-500",
						children: "Bill to"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: order.customer_name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: order.customer_phone }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-slate-600",
						children: order.address_line
					}),
					order.city && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-slate-600",
						children: order.city
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-slate-500",
						children: order.area.replace("_", " ")
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-1 text-xs font-semibold uppercase text-slate-500",
							children: "Payment"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "capitalize",
							children: order.payment_method
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-slate-500",
							children: ["Status: ", order.status]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b bg-slate-50 text-left",
						style: { background: `${primary}15` },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2",
								children: "Product"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2 text-right",
								children: "Qty"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2 text-right",
								children: "Price"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2 text-right",
								children: "Total"
							})
						]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-2",
								children: it.product_name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-2 text-right",
								children: it.quantity
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "p-2 text-right",
								children: ["৳", Number(it.reseller_price).toFixed(0)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "p-2 text-right",
								children: ["৳", Number(it.line_total).toFixed(0)]
							})
						]
					}, it.id)) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tfoot", {
						className: "text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 3,
								className: "p-2 text-right text-slate-500",
								children: "Subtotal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "p-2 text-right",
								children: ["৳", Number(order.subtotal).toFixed(0)]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 3,
								className: "p-2 text-right text-slate-500",
								children: "Shipping"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "p-2 text-right",
								children: ["৳", Number(order.shipping_cost).toFixed(0)]
							})] }),
							Number(order.discount) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 3,
								className: "p-2 text-right text-slate-500",
								children: "Discount"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "p-2 text-right",
								children: ["-৳", Number(order.discount).toFixed(0)]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 3,
									className: "p-2 text-right",
									children: "Grand total"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "p-2 text-right",
									style: { color: primary },
									children: ["৳", Number(order.total).toFixed(0)]
								})]
							})
						]
					})
				]
			}),
			order.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded border p-3 text-xs text-slate-600",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Notes:" }),
					" ",
					order.notes
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 border-t pt-4 text-center text-xs text-slate-500",
				children: store.settings?.footer_text || `Thank you for shopping with ${name}!`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex justify-end print:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => window.print(),
					className: "inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm text-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "h-4 w-4" }), " Print / Save PDF"]
				})
			})
		]
	});
}
//#endregion
export { InvoicePage as component };
