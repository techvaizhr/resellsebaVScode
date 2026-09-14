import { t as createServerFn } from "./createServerFn-CIHAFgYl.js";
import { r as supabase, s as createSsrRpc } from "./client-Be051lUg.js";
import { t as requireSupabaseAuth } from "./auth-middleware-l7OTet94.js";
import { d as productDeliveryCharge, i as areaOptions, o as deliveryMode } from "./delivery-DY_nRbFK.js";
import { i as courierStatusLabel } from "./courier-status-BxiQVHJB.js";
import { o as useAdvancedSettings } from "./advanced-settings-D6Wtuz1Q.js";
import { c as orderAdvance, d as orderKeptProductCost, f as orderPackaging, g as resellerHeldAdvance, h as orderShortfall, l as orderCost, m as orderReceived, o as isFailedOrder, p as orderProfit, r as bdt, u as orderDeliveryCost } from "./finance-report-Dwy2dA23.js";
import { i as courierLabel, n as CourierLogo } from "./courier-brand-CNWF3jtp.js";
import { a as sanitizeName, i as phoneError, n as nameError, r as normalizePhone, t as addressError } from "./checkout-validate-C4SpuEI3.js";
import { a as MoneyField, i as AdvanceByToggle, n as packagingModeHint, o as SectionLabel, r as packagingTotal } from "./NewOrderModal-BgYUG1_b.js";
import { useEffect, useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Minus, Plus, Search, ShoppingCart, Trash2, X } from "lucide-react";
//#region src/lib/order-details.functions.ts
var getOrderDetails = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((data) => z.object({ orderId: z.string() }).parse(data)).handler(createSsrRpc("9866f76328537afcd342bb1462aec6c6ae4b18546f6c8c8eb5b12fe84b9c6aa1"));
/**
* Pull the live courier status for every shipment of an order and persist it.
* Webhooks can be missed or misconfigured, so this is the manual safety net.
*/
var recheckCourierStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => z.object({ orderId: z.string() }).parse(data)).handler(createSsrRpc("a87394ade9e07fcb6800ba5b6e57ae4c915ca4d0514b5da41cd7c28310de862c"));
//#endregion
//#region src/components/order-money.tsx
/**
* Shared order money panel — the exact same math as the Transaction report.
* Used by the admin + reseller order list collapse and both order detail drawers.
* `role="reseller"` hides every admin-only figure (admin invoice / platform margin).
*/
var n = (v) => Number(v ?? 0) || 0;
function Row$1({ label, value, hint, tone, strong, dashed = true }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-start justify-between gap-3 py-1.5 " + (dashed ? "border-b border-dashed border-border/60" : ""),
		children: [/* @__PURE__ */ jsxs("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ jsx("span", {
				className: "text-[12px] " + (strong ? "font-bold" : "font-medium text-foreground/80"),
				children: label
			}), hint && /* @__PURE__ */ jsx("div", {
				className: "text-[10px] leading-snug text-muted-foreground",
				children: hint
			})]
		}), /* @__PURE__ */ jsx("span", {
			className: "shrink-0 tabular-nums " + (strong ? "text-[13px] font-black " : "text-[12px] font-semibold ") + (tone === "success" ? "text-success" : tone === "danger" ? "text-destructive" : tone === "primary" ? "text-primary" : tone === "muted" ? "text-muted-foreground" : ""),
			children: value
		})]
	});
}
function Block({ title, children }) {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
		className: "mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground",
		children: title
	}), children] });
}
/** Advance chip that explains the balance effect (same wording as the transaction report). */
function AdvanceChip({ order, className = "" }) {
	const adv = orderAdvance(order);
	if (adv <= 0) return null;
	const byReseller = order.advance_by !== "admin";
	return /* @__PURE__ */ jsxs("span", {
		className: "inline-flex flex-wrap items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold " + (byReseller ? "border-amber-500/30 bg-amber-500/10 text-amber-600" : "border-sky-500/30 bg-sky-500/10 text-sky-600") + " " + className,
		children: [
			"Advance ",
			bdt(adv),
			/* @__PURE__ */ jsxs("span", {
				className: "font-semibold opacity-80",
				children: ["· ", byReseller ? "reseller · deducted from balance" : "admin · balance unchanged"]
			})
		]
	});
}
function OrderMoneyPanel({ order, role, className = "" }) {
	const subtotal = n(order.subtotal);
	const discount = n(order.discount);
	const total = n(order.total);
	const advance = orderAdvance(order);
	const heldByReseller = resellerHeldAdvance(order);
	const received = orderReceived(order);
	const collected = Math.max(received - advance, 0);
	const codDue = Math.max(total - advance, 0);
	const failed = isFailedOrder(order);
	const packaging = orderPackaging(order);
	const delivery = orderDeliveryCost(order);
	const productCost = failed ? 0 : orderKeptProductCost(order);
	const cost = orderCost(order);
	const profit = orderProfit(order);
	const shortfall = orderShortfall(order);
	const pct = total > 0 ? Math.min(100, Math.round(received / total * 100)) : 0;
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-xl border bg-background p-3 shadow-sm " + className,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-2 flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ jsx("h4", {
				className: "text-[11px] font-black uppercase tracking-[0.12em] text-muted-foreground",
				children: "Money breakdown"
			}), /* @__PURE__ */ jsxs("span", {
				className: "rounded-full px-2 py-0.5 text-[10px] font-black " + (profit < 0 ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"),
				children: [
					profit < 0 ? "Loss" : "Profit",
					" ",
					bdt(profit)
				]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ jsxs(Block, {
					title: "Customer bill",
					children: [
						/* @__PURE__ */ jsx(Row$1, {
							label: "Subtotal",
							value: bdt(subtotal)
						}),
						/* @__PURE__ */ jsx(Row$1, {
							label: "Delivery charge",
							value: bdt(n(order.shipping_cost))
						}),
						discount > 0 && /* @__PURE__ */ jsx(Row$1, {
							label: "Discount",
							value: `− ${bdt(discount)}`,
							tone: "danger"
						}),
						/* @__PURE__ */ jsx(Row$1, {
							label: "Order value",
							value: bdt(total),
							tone: "primary",
							strong: true,
							dashed: false
						})
					]
				}),
				/* @__PURE__ */ jsxs(Block, {
					title: "Collection",
					children: [
						advance > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Row$1, {
							label: "Advance already paid",
							value: bdt(advance),
							hint: order.advance_by === "admin" ? "Held by admin — no plus/minus on the reseller balance" : "Held by the reseller — deducted from their final amount"
						}), /* @__PURE__ */ jsx(Row$1, {
							label: "COD to collect",
							value: bdt(codDue),
							hint: "Order value − advance"
						})] }) : /* @__PURE__ */ jsx(Row$1, {
							label: "COD to collect",
							value: bdt(codDue)
						}),
						/* @__PURE__ */ jsx(Row$1, {
							label: "Collected by courier",
							value: bdt(collected),
							tone: failed ? "danger" : void 0
						}),
						/* @__PURE__ */ jsx(Row$1, {
							label: "Received (incl. advance)",
							value: bdt(received),
							hint: advance > 0 ? `Courier ${bdt(collected)} + advance ${bdt(advance)}` : void 0,
							tone: shortfall > 0 ? "danger" : "success",
							strong: true,
							dashed: false
						}),
						total > 0 && shortfall > 0 && /* @__PURE__ */ jsxs("div", {
							className: "mt-1.5 rounded-lg border border-amber-500/30 bg-amber-500/5 px-2 py-1.5",
							children: [/* @__PURE__ */ jsx("div", {
								className: "h-1.5 overflow-hidden rounded-full bg-amber-500/15",
								children: /* @__PURE__ */ jsx("div", {
									className: "h-full rounded-full bg-amber-500",
									style: { width: `${pct}%` }
								})
							}), /* @__PURE__ */ jsxs("div", {
								className: "mt-1 flex items-center justify-between text-[10px] font-semibold",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "text-amber-600",
									children: [pct, "% received"]
								}), /* @__PURE__ */ jsxs("span", {
									className: "text-destructive",
									children: ["short ", bdt(shortfall)]
								})]
							})]
						})
					]
				}),
				/* @__PURE__ */ jsxs(Block, {
					title: role === "admin" ? "Cost side" : "Your cost",
					children: [
						/* @__PURE__ */ jsx(Row$1, {
							label: role === "admin" ? "Product cost" : "Product price (paid to admin)",
							value: bdt(productCost),
							hint: failed ? "Parcel came back — no product cost" : void 0
						}),
						/* @__PURE__ */ jsx(Row$1, {
							label: "Delivery charge (courier)",
							value: bdt(delivery)
						}),
						/* @__PURE__ */ jsx(Row$1, {
							label: "Packaging",
							value: bdt(packaging)
						}),
						/* @__PURE__ */ jsx(Row$1, {
							label: "Total cost",
							value: bdt(cost),
							strong: true,
							dashed: false
						})
					]
				}),
				/* @__PURE__ */ jsxs(Block, {
					title: "Result",
					children: [heldByReseller > 0 && /* @__PURE__ */ jsx(Row$1, {
						label: "− Advance already with reseller",
						value: bdt(heldByReseller),
						tone: "danger"
					}), /* @__PURE__ */ jsx(Row$1, {
						label: profit < 0 ? role === "admin" ? "Reseller loss" : "Your loss" : role === "admin" ? "Reseller profit" : "Your profit",
						value: bdt(profit),
						hint: failed ? "Failed delivery — delivery charge + packaging loss" : "Received − product cost − delivery − packaging",
						tone: profit < 0 ? "danger" : "success",
						strong: true,
						dashed: false
					})]
				}),
				role === "admin" && /* @__PURE__ */ jsxs("div", {
					className: "rounded-lg border border-primary/20 bg-primary/[0.04] px-2.5 py-2",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-primary",
							children: "Admin only"
						}),
						/* @__PURE__ */ jsx(Row$1, {
							label: "Reseller invoice (product + packaging)",
							value: bdt(n(order.sa_cost_total))
						}),
						/* @__PURE__ */ jsx(Row$1, {
							label: "Delivery cost set by admin",
							value: bdt(delivery)
						}),
						/* @__PURE__ */ jsx(Row$1, {
							label: "Cash that reached admin",
							value: bdt(Math.max(received - heldByReseller, 0)),
							hint: heldByReseller > 0 ? `Advance ${bdt(heldByReseller)} stayed with the reseller — not admin income, it only lowers their payout` : advance > 0 ? "Advance was collected by admin, so it is part of admin cash" : void 0,
							dashed: false
						})
					]
				})
			]
		})]
	});
}
//#endregion
//#region src/components/order-total-cell.tsx
/**
* Compact money summary shown inside the order list rows — same breakdown style
* as the Transaction report so both sides stay readable.
*
* `ResellerTotalCell` = money received + reseller buy / delivery / packaging / profit.
* `AdminTotalCell`    = admin revenue + admin buy / delivery / packaging / profit.
*
* Chips render in a fixed 2-column grid. When an advance was collected for the
* order, an `adv` chip appears on both sides following the holder logic:
*  · Reseller side — reseller-held advance is deducted from their profit
*    (shown as a cost / danger tone); admin-held advance doesn't touch the
*    reseller (neutral).
*  · Admin side — admin-held advance stays with admin (profit tone);
*    reseller-held advance doesn't reach admin (neutral).
*/
function Chip({ label, value, tone }) {
	return /* @__PURE__ */ jsxs("span", {
		className: `inline-flex items-center gap-0.5 rounded-full border px-1.5 py-[1px] text-[9px] font-bold leading-tight tabular-nums ${tone === "delivery" ? "border-sky-500/30 bg-sky-500/10 text-sky-600" : tone === "profit" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600" : tone === "loss" ? "border-destructive/30 bg-destructive/10 text-destructive" : tone === "pack" ? "border-violet-500/30 bg-violet-500/10 text-violet-600" : tone === "advance" ? "border-slate-400/30 bg-slate-400/10 text-slate-500" : "border-amber-500/30 bg-amber-500/10 text-amber-600"}`,
		children: [/* @__PURE__ */ jsx("span", {
			className: "opacity-70",
			children: label
		}), value]
	});
}
function Summary({ headLabel, headValue, headTone, buy, delivery, packaging, profit, advance, advanceTone }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-w-0 flex-col items-start gap-1",
		children: [/* @__PURE__ */ jsxs("span", {
			className: "flex items-baseline gap-1",
			children: [/* @__PURE__ */ jsx("span", {
				className: "text-[9px] font-semibold uppercase tracking-wide text-muted-foreground",
				children: headLabel
			}), /* @__PURE__ */ jsx("span", {
				className: "text-sm font-black tabular-nums " + (headTone === "primary" ? "text-primary" : "text-foreground"),
				children: bdt(headValue)
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid grid-cols-2 gap-1",
			children: [
				/* @__PURE__ */ jsx(Chip, {
					label: "buy",
					value: bdt(buy),
					tone: "cost"
				}),
				/* @__PURE__ */ jsx(Chip, {
					label: "del",
					value: bdt(delivery),
					tone: "delivery"
				}),
				/* @__PURE__ */ jsx(Chip, {
					label: "pac",
					value: bdt(packaging),
					tone: "pack"
				}),
				/* @__PURE__ */ jsx(Chip, {
					label: profit < 0 ? "loss" : "pft",
					value: bdt(profit),
					tone: profit < 0 ? "loss" : "profit"
				}),
				advance != null && advance > 0 && /* @__PURE__ */ jsx(Chip, {
					label: "adv",
					value: bdt(advance),
					tone: advanceTone ?? "advance"
				})
			]
		})]
	});
}
/** Reseller side: money received from the customer vs what the order cost them. */
function ResellerTotalCell({ order }) {
	const advance = orderAdvance(order);
	const resellerHeld = advance > 0 && resellerHeldAdvance(order) > 0;
	return /* @__PURE__ */ jsx(Summary, {
		headLabel: "sell",
		headValue: orderReceived(order),
		buy: orderKeptProductCost(order),
		delivery: orderDeliveryCost(order),
		packaging: orderPackaging(order),
		profit: orderProfit(order),
		advance: resellerHeld ? advance : void 0,
		advanceTone: resellerHeld ? "loss" : void 0
	});
}
/** Admin side: revenue = money received − what the reseller finally earns. */
function AdminTotalCell({ order, buyingCost }) {
	const advance = orderAdvance(order);
	const revenue = orderReceived(order) - orderProfit(order);
	const delivery = orderDeliveryCost(order);
	const packaging = orderPackaging(order);
	const profit = revenue - buyingCost - delivery - packaging;
	const adminHeld = advance > 0 && order.advance_by === "admin";
	return /* @__PURE__ */ jsx(Summary, {
		headLabel: "rev",
		headValue: revenue,
		headTone: "primary",
		buy: buyingCost,
		delivery,
		packaging,
		profit,
		advance: adminHeld ? advance : void 0,
		advanceTone: adminHeld ? "profit" : void 0
	});
}
//#endregion
//#region src/components/OrderEditModal.tsx
function OrderEditModal({ orderId, allProducts, onClose, onSaved, isAdmin = false }) {
	const [loading, setLoading] = useState(true);
	const [busy, setBusy] = useState(false);
	const [order, setOrder] = useState(null);
	const [items, setItems] = useState([]);
	const [originalQty, setOriginalQty] = useState({});
	const [removed, setRemoved] = useState([]);
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [area, setArea] = useState("outside_dhaka");
	const [paymentMethod, setPaymentMethod] = useState("cod");
	const [paymentStatus, setPaymentStatus] = useState("unpaid");
	const [note, setNote] = useState("");
	/** Delivery charge override — "" means use the product default for the picked area. */
	const [shipInput, setShipInput] = useState("");
	/** True once the user types a custom delivery charge; auto value follows the area otherwise. */
	const [shipTouched, setShipTouched] = useState(false);
	/** Order level adjustments — "" means keep the default value. */
	const [discount, setDiscount] = useState("");
	const [packagingInput, setPackagingInput] = useState("");
	const [deliveryCostInput, setDeliveryCostInput] = useState("");
	const [deliveryCostTouched, setDeliveryCostTouched] = useState(false);
	/** Advance already collected + who is holding that cash. */
	const [advance, setAdvance] = useState("");
	const [advanceBy, setAdvanceBy] = useState("reseller");
	/** Packaging charge rule from Admin → System → Advanced settings. */
	const { settings: advanced } = useAdvancedSettings();
	const packagingSum = advanced.packagingChargeSum;
	const effectiveProducts = useMemo(() => {
		return allProducts && allProducts.length > 0 ? allProducts : [];
	}, [allProducts]);
	/** Money actually collected by the courier. Empty = full order total received. */
	const [received, setReceived] = useState("");
	const [query, setQuery] = useState("");
	const [showDropdown, setShowDropdown] = useState(false);
	useEffect(() => {
		(async () => {
			const [{ data: o, error }, { data: its }] = await Promise.all([supabase.from("orders").select("*").eq("id", orderId).maybeSingle(), supabase.from("order_items").select("*").eq("order_id", orderId)]);
			if (error || !o) {
				toast.error(error?.message || "Order not found");
				onClose();
				return;
			}
			setOrder(o);
			setName(o.customer_name ?? "");
			setPhone(o.customer_phone ?? "");
			setAddress(o.address_line ?? "");
			const savedArea = areaOptions().some((a) => a.value === o.area) ? o.area : "outside_dhaka";
			setArea(savedArea);
			setPaymentMethod(o.payment_method ?? "cod");
			setPaymentStatus(o.payment_status ?? "unpaid");
			setNote((isAdmin ? o.admin_note : o.reseller_note) ?? "");
			/** Saved delivery charge that matches the product rule stays "auto" so area changes keep updating it. */
			const savedShip = Number(o.shipping_cost ?? 0);
			const autoShip = (its ?? []).reduce((max, it) => {
				const p = allProducts.find((x) => x.id === it.product_id);
				return p ? Math.max(max, productDeliveryCharge(p, savedArea)) : max;
			}, 0);
			const shipIsCustom = savedShip !== autoShip;
			setShipInput(shipIsCustom ? String(savedShip) : "");
			setShipTouched(shipIsCustom);
			setReceived(o.received_amount == null ? "" : String(Number(o.received_amount)));
			setDiscount(Number(o.discount ?? 0) ? String(Number(o.discount)) : "");
			setPackagingInput(o.packaging_total == null ? "" : String(Number(o.packaging_total)));
			const savedCourierCost = Number(o.delivery_cost ?? 0);
			const courierIsCustom = savedCourierCost !== autoShip;
			setDeliveryCostInput(courierIsCustom ? String(savedCourierCost) : "");
			setDeliveryCostTouched(courierIsCustom);
			setAdvance(Number(o.advance_amount ?? 0) ? String(Number(o.advance_amount)) : "");
			setAdvanceBy(o.advance_by === "admin" ? "admin" : "reseller");
			const orig = {};
			for (const it of its ?? []) if (it.id) orig[it.id] = Number(it.quantity ?? 0);
			setOriginalQty(orig);
			setItems((its ?? []).map((it) => ({
				id: it.id,
				product_id: it.product_id,
				listing_id: it.listing_id,
				product_name: it.product_name,
				product_image: it.product_image,
				quantity: Number(it.quantity ?? 1),
				sa_price: Number(it.sa_price ?? 0),
				reseller_price: Number(it.reseller_price ?? 0),
				packaging_cost: Number(it.packaging_cost ?? allProducts.find((x) => x.id === it.product_id)?.packaging_cost ?? 0)
			})));
			setLoading(false);
		})();
	}, [orderId]);
	/** Products of the current lines that exist in the catalog — used for delivery rules. */
	const lineProducts = useMemo(() => items.map((it) => effectiveProducts.find((x) => x.id === it.product_id)).filter(Boolean), [items, effectiveProducts]);
	/** Highest product delivery charge for the selected area wins. */
	const autoShipping = useMemo(() => lineProducts.reduce((max, p) => Math.max(max, productDeliveryCharge(p, area)), 0), [lineProducts, area]);
	/** Area picker only matters when charges actually vary by area (same rule as the Add Order modal). */
	const showAreaPicker = useMemo(() => {
		if (lineProducts.length === 0) return false;
		const modes = lineProducts.map((p) => deliveryMode(p));
		return !modes.every((m) => m === "free") && !modes.every((m) => m === "flat");
	}, [lineProducts]);
	/** Empty input = follow the area rule; any typed value = explicit custom charge. */
	function changeShip(v) {
		setShipInput(v);
		setShipTouched(v.trim() !== "");
	}
	function changeDeliveryCost(v) {
		setDeliveryCostInput(v);
		setDeliveryCostTouched(v.trim() !== "");
	}
	const totals = useMemo(() => {
		const subtotal = items.reduce((s, it) => s + it.reseller_price * it.quantity, 0);
		/** Product cost = item base cost minus its packaging part; packaging is tracked order-level. */
		const packagingLines = items.map((it) => ({
			packaging: Number(it.packaging_cost ?? 0),
			qty: it.quantity
		}));
		/** Always the per-item sum — sa_price already carries each item's packaging. */
		const packagingInItems = packagingTotal(packagingLines, true);
		const packagingDefault = packagingTotal(packagingLines, packagingSum);
		const itemCost = items.reduce((s, it) => s + it.sa_price * it.quantity, 0);
		const productCost = Math.max(itemCost - packagingInItems, 0);
		const packaging = packagingInput.trim() === "" ? packagingDefault : Math.max(Number(packagingInput) || 0, 0);
		const saCost = productCost + packaging;
		const shipping = shipInput.trim() === "" ? autoShipping : Math.max(Number(shipInput) || 0, 0);
		const disc = Math.min(Math.max(Number(discount) || 0, 0), subtotal + shipping);
		const total = subtotal + shipping - disc;
		const deliveryCost = deliveryCostInput.trim() === "" ? autoShipping : Math.max(Number(deliveryCostInput) || 0, 0);
		const adv = Math.min(Math.max(Number(advance) || 0, 0), total);
		const resellerAdvance = advanceBy === "reseller" ? adv : 0;
		const codDue = Math.max(total - adv, 0);
		/** Courier collected part only — advance is already in hand. */
		const collected = received.trim() === "" ? codDue : Math.max(Number(received) || 0, 0);
		/** Total money received for this order = courier collected + advance already paid. */
		const recv = collected + adv;
		return {
			subtotal,
			saCost,
			productCost,
			packagingDefault,
			packaging,
			shipping,
			deliveryCost,
			discount: disc,
			total,
			received: recv,
			collected,
			advance: adv,
			resellerAdvance,
			codDue,
			shortfall: Math.max(total - recv, 0),
			grossProfit: recv - deliveryCost - saCost,
			profit: recv - deliveryCost - saCost - resellerAdvance
		};
	}, [
		items,
		effectiveProducts,
		shipInput,
		autoShipping,
		received,
		discount,
		packagingInput,
		deliveryCostInput,
		advance,
		advanceBy,
		packagingSum
	]);
	/**
	* Minimum sell price per line = the cost frozen on that line.
	* Existing lines keep their own snapshot, so a later product price change
	* never invalidates or re-prices an old order. Only newly added lines use
	* today's catalog price.
	*/
	function minFor(it) {
		if (it.id) return Number(it.sa_price ?? 0);
		const p = effectiveProducts.find((x) => x.id === it.product_id);
		const fromProduct = p ? Number(p.reseller_price ?? 0) + Number(p.packaging_cost ?? 0) : 0;
		return Math.max(fromProduct, Number(it.sa_price ?? 0));
	}
	const results = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return effectiveProducts.slice(0, 10);
		return effectiveProducts.filter((p) => String(p.name).toLowerCase().includes(q) || String(p.product_code ?? "").toLowerCase().includes(q)).slice(0, 15);
	}, [effectiveProducts, query]);
	const errors = {
		name: nameError(name),
		phone: phoneError(phone),
		address: addressError(address)
	};
	/** Max quantity a line can reach = free catalog stock + units already held by this order line. */
	function maxQtyFor(it) {
		const p = effectiveProducts.find((x) => x.id === it.product_id);
		if (!p) return Infinity;
		const held = it.id ? Number(originalQty[it.id] ?? 0) : 0;
		return Number(p.stock ?? 0) + held;
	}
	function bumpQty(target, next) {
		const max = maxQtyFor(target);
		if (next > max) {
			toast.error(`Only ${max} available in stock`);
			return;
		}
		setItems((prev) => prev.map((x) => x === target ? {
			...x,
			quantity: Math.max(1, next)
		} : x));
	}
	function addProduct(p) {
		const stock = Number(p.stock ?? 0);
		if (stock <= 0) {
			toast.error(`${p.name} is out of stock`);
			return;
		}
		setItems((prev) => {
			const hit = prev.find((x) => x.product_id === p.id);
			if (hit) {
				const held = hit.id ? Number(originalQty[hit.id] ?? 0) : 0;
				if (hit.quantity + 1 > stock + held) {
					toast.error(`Only ${stock + held} available in stock`);
					return prev;
				}
				return prev.map((x) => x === hit ? {
					...x,
					quantity: x.quantity + 1
				} : x);
			}
			const sa = Number(p.reseller_price ?? 0) + Number(p.packaging_cost ?? 0);
			return [...prev, {
				product_id: p.id,
				listing_id: null,
				product_name: p.name,
				product_image: p.og_image_url ?? null,
				quantity: 1,
				sa_price: sa,
				reseller_price: Number(p.suggested_price ?? sa),
				packaging_cost: Number(p.packaging_cost ?? 0)
			}];
		});
		setQuery("");
	}
	async function save(e) {
		e.preventDefault();
		if (items.length === 0) return toast.error("Order needs at least one product.");
		const first = errors.name || errors.phone || errors.address;
		if (first) return toast.error(first);
		const low = items.find((it) => it.reseller_price < minFor(it));
		if (low) return toast.error(`${low.product_name}: minimum selling price is ৳${minFor(low)} — cannot save below this`);
		const short = items.find((it) => it.quantity > maxQtyFor(it));
		if (short) return toast.error(`${short.product_name}: only ${maxQtyFor(short)} available in stock`);
		setBusy(true);
		try {
			if (removed.length > 0) {
				const { error } = await supabase.from("order_items").delete().in("id", removed);
				if (error) throw error;
			}
			for (const it of items) {
				const payload = {
					order_id: orderId,
					listing_id: it.listing_id ?? null,
					product_id: it.product_id,
					product_name: it.product_name,
					product_image: it.product_image,
					quantity: it.quantity,
					sa_price: it.sa_price,
					reseller_price: it.reseller_price,
					line_total: it.reseller_price * it.quantity,
					profit: (it.reseller_price - it.sa_price) * it.quantity,
					packaging_cost: it.packaging_cost
				};
				if (it.id) {
					const { error } = await supabase.from("order_items").update(payload).eq("id", it.id);
					if (error) throw error;
				} else {
					const { error } = await supabase.from("order_items").insert(payload);
					if (error) throw error;
				}
			}
			const { error: oe } = await supabase.from("orders").update({
				customer_name: sanitizeName(name).trim(),
				customer_phone: normalizePhone(phone),
				address_line: address.trim(),
				area,
				payment_method: paymentMethod,
				...isAdmin ? { payment_status: paymentStatus } : {},
				...isAdmin ? { admin_note: note || null } : { reseller_note: note || null },
				subtotal: totals.subtotal,
				shipping_cost: totals.shipping,
				discount: totals.discount,
				total: totals.total,
				sa_cost_total: totals.saCost,
				reseller_profit: totals.profit,
				advance_amount: totals.advance,
				advance_by: totals.advance > 0 ? advanceBy : null,
				...isAdmin ? {
					packaging_total: totals.packaging,
					delivery_cost: totals.deliveryCost,
					received_amount: received.trim() === "" ? null : Number(received) || 0
				} : {}
			}).eq("id", orderId);
			if (oe) throw oe;
			toast.success("Order updated — status unchanged");
			onSaved();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to update order");
		} finally {
			setBusy(false);
		}
	}
	const inp = "w-full rounded-lg border bg-background px-3 py-2 text-[13px] focus:ring-2 focus:ring-primary/20";
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-[70] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4",
		children: /* @__PURE__ */ jsxs("form", {
			onSubmit: save,
			className: "flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border bg-background shadow-2xl sm:max-h-[90vh] sm:rounded-xl",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between gap-2 border-b bg-muted/30 px-4 py-3 sm:px-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ jsxs("h2", {
						className: "truncate text-sm font-bold sm:text-lg",
						children: ["Edit order ", order?.order_number ? `#${order.order_number}` : ""]
					}), /* @__PURE__ */ jsxs("p", {
						className: "text-[10px] uppercase tracking-tight text-muted-foreground",
						children: [
							"Status stays as it is (",
							order?.status ?? "—",
							")"
						]
					})]
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: onClose,
					className: "rounded-full p-2 transition-colors hover:bg-accent",
					children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
				})]
			}), loading ? /* @__PURE__ */ jsx("div", {
				className: "grid place-items-center py-20",
				children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" })
			}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
				className: "min-h-0 flex-1 space-y-6 overflow-y-auto p-4 sm:p-6",
				children: [
					/* @__PURE__ */ jsxs("section", {
						className: "space-y-3",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-[13px] font-bold uppercase tracking-wide text-foreground/80",
							children: "Customer information"
						}), /* @__PURE__ */ jsxs("div", {
							className: "grid gap-x-4 gap-y-3 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ jsxs("label", {
									className: "space-y-1",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-[13px] font-semibold text-foreground/80",
										children: "Name"
									}), /* @__PURE__ */ jsx("input", {
										className: inp,
										value: name,
										onChange: (e) => setName(sanitizeName(e.target.value))
									})]
								}),
								/* @__PURE__ */ jsxs("label", {
									className: "space-y-1",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-[13px] font-semibold text-foreground/80",
										children: "Mobile"
									}), /* @__PURE__ */ jsx("input", {
										className: inp,
										value: phone,
										onChange: (e) => setPhone(normalizePhone(e.target.value))
									})]
								}),
								/* @__PURE__ */ jsxs("label", {
									className: "space-y-1 sm:col-span-2",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-[13px] font-semibold text-foreground/80",
										children: "Address"
									}), /* @__PURE__ */ jsx("textarea", {
										rows: 2,
										className: inp,
										value: address,
										onChange: (e) => setAddress(e.target.value)
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1 sm:col-span-2",
									children: [
										/* @__PURE__ */ jsx("span", {
											className: "text-[13px] font-semibold text-foreground/80",
											children: "Delivery area"
										}),
										/* @__PURE__ */ jsx("div", {
											className: "grid grid-cols-3 gap-2",
											children: areaOptions().map(({ value: v, label }) => /* @__PURE__ */ jsxs("button", {
												type: "button",
												onClick: () => setArea(v),
												className: `flex items-center justify-between rounded-2xl border-2 px-4 py-3 transition-all duration-300 ${area === v ? "scale-[1.02] border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "border-muted bg-background text-muted-foreground hover:border-primary/30"}`,
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-[11px] font-black uppercase tracking-tight",
													children: label
												}), showAreaPicker && /* @__PURE__ */ jsxs("span", {
													className: `text-[10px] font-bold ${area === v ? "text-primary-foreground/90" : "text-primary"}`,
													children: ["৳", lineProducts.reduce((max, p) => Math.max(max, productDeliveryCharge(p, v)), 0)]
												})]
											}, v))
										}),
										!shipTouched && /* @__PURE__ */ jsxs("p", {
											className: "text-[11px] text-muted-foreground",
											children: [
												"Delivery charge will auto-update when the area changes (৳",
												autoShipping.toFixed(0),
												")."
											]
										})
									]
								}),
								isAdmin && /* @__PURE__ */ jsxs("label", {
									className: "space-y-1",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-[13px] font-semibold text-foreground/80",
										children: "Payment status"
									}), /* @__PURE__ */ jsxs("select", {
										className: inp,
										value: paymentStatus,
										onChange: (e) => setPaymentStatus(e.target.value),
										children: [
											/* @__PURE__ */ jsx("option", {
												value: "unpaid",
												children: "Unpaid"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "partial",
												children: "Partial"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "paid",
												children: "Paid"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "refunded",
												children: "Refunded"
											})
										]
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ jsx("h3", {
								className: "text-[13px] font-bold uppercase tracking-wide text-foreground/80",
								children: "Products & pricing"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "relative",
								children: [
									/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" }),
									/* @__PURE__ */ jsx("input", {
										value: query,
										onChange: (e) => {
											setQuery(e.target.value);
											setShowDropdown(true);
										},
										onFocus: () => setShowDropdown(true),
										placeholder: "Search product to add (by name or code)...",
										className: `${inp} px-9`
									}),
									(query.trim() !== "" || showDropdown) && results.length > 0 && /* @__PURE__ */ jsxs("div", {
										className: "absolute z-20 mt-1 max-h-64 w-full divide-y overflow-y-auto rounded-xl border bg-background shadow-xl",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "sticky top-0 z-10 flex items-center justify-between px-3 py-1.5 bg-muted/80 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b",
											children: [/* @__PURE__ */ jsx("span", { children: query ? `Search Results (${results.length})` : `Available Products (${results.length})` }), /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => {
													setShowDropdown(false);
													setQuery("");
												},
												className: "text-primary hover:underline",
												children: "Close"
											})]
										}), results.map((p) => /* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => {
												addProduct(p);
												setShowDropdown(false);
												setQuery("");
											},
											className: "flex w-full items-center gap-2.5 p-2.5 text-left text-xs hover:bg-primary/5 transition-colors",
											children: [
												/* @__PURE__ */ jsx("span", {
													className: "h-9 w-9 shrink-0 overflow-hidden rounded-md border bg-muted",
													children: p.og_image_url ? /* @__PURE__ */ jsx("img", {
														src: p.og_image_url,
														alt: "",
														className: "h-full w-full object-cover"
													}) : /* @__PURE__ */ jsx(ShoppingCart, { className: "m-2 h-5 w-5 text-muted-foreground/40" })
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "min-w-0 flex-1",
													children: [/* @__PURE__ */ jsx("div", {
														className: "truncate font-semibold text-foreground",
														children: p.name
													}), /* @__PURE__ */ jsx("div", {
														className: "text-[10px] text-muted-foreground font-mono",
														children: p.product_code
													})]
												}),
												/* @__PURE__ */ jsx("span", {
													className: `shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-black uppercase ${Number(p.stock ?? 0) <= 0 ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-600"}`,
													children: Number(p.stock ?? 0) <= 0 ? "Out" : `Stock ${Number(p.stock ?? 0)}`
												}),
												/* @__PURE__ */ jsxs("span", {
													className: "shrink-0 text-xs font-bold text-primary",
													children: ["৳", Number(p.suggested_price || p.reseller_price + (p.packaging_cost ?? 0))]
												}),
												/* @__PURE__ */ jsx("span", {
													className: "shrink-0 rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary hover:bg-primary hover:text-primary-foreground",
													children: "+ Add"
												})
											]
										}, p.id))]
									})
								]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "space-y-2",
								children: items.map((it, idx) => /* @__PURE__ */ jsxs("div", {
									className: "rounded-xl border bg-muted/10 p-3",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-3",
										children: [
											/* @__PURE__ */ jsx("div", {
												className: "h-10 w-10 shrink-0 overflow-hidden rounded-md border bg-background",
												children: it.product_image ? /* @__PURE__ */ jsx("img", {
													src: it.product_image,
													alt: "",
													className: "h-full w-full object-cover"
												}) : /* @__PURE__ */ jsx(ShoppingCart, { className: "m-2.5 h-5 w-5 text-muted-foreground/40" })
											}),
											/* @__PURE__ */ jsx("div", {
												className: "min-w-0 flex-1 text-xs font-semibold",
												children: it.product_name
											}),
											/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => {
													if (it.id) setRemoved((prev) => [...prev, it.id]);
													setItems((prev) => prev.filter((x) => x !== it));
												},
												className: "rounded-md p-1.5 text-destructive hover:bg-destructive/10",
												children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
											})
										]
									}), /* @__PURE__ */ jsxs("div", {
										className: "mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4",
										children: [
											/* @__PURE__ */ jsxs("label", {
												className: "space-y-1",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-[11px] font-semibold uppercase text-muted-foreground",
													children: "Qty"
												}), /* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-1",
													children: [
														/* @__PURE__ */ jsx("button", {
															type: "button",
															onClick: () => setItems((prev) => prev.map((x) => x === it ? {
																...x,
																quantity: Math.max(1, x.quantity - 1)
															} : x)),
															className: "rounded border p-1 hover:bg-accent",
															children: /* @__PURE__ */ jsx(Minus, { className: "h-3 w-3" })
														}),
														/* @__PURE__ */ jsx("input", {
															className: `${inp} text-center`,
															value: it.quantity,
															onChange: (e) => bumpQty(it, Math.max(1, Number(e.target.value) || 1))
														}),
														/* @__PURE__ */ jsx("button", {
															type: "button",
															onClick: () => bumpQty(it, it.quantity + 1),
															className: "rounded border p-1 hover:bg-accent",
															children: /* @__PURE__ */ jsx(Plus, { className: "h-3 w-3" })
														})
													]
												})]
											}),
											/* @__PURE__ */ jsxs("label", {
												className: "space-y-1",
												children: [/* @__PURE__ */ jsxs("span", {
													className: "text-[11px] font-semibold uppercase text-muted-foreground",
													children: ["Sell price · min ৳", minFor(it)]
												}), /* @__PURE__ */ jsx("input", {
													className: `${inp} ${it.reseller_price < minFor(it) ? "border-destructive text-destructive" : ""}`,
													value: it.reseller_price,
													inputMode: "numeric",
													onChange: (e) => setItems((prev) => prev.map((x) => x === it ? {
														...x,
														reseller_price: Number(e.target.value) || 0
													} : x)),
													onBlur: () => {
														const min = minFor(it);
														if (it.reseller_price < min) {
															setItems((prev) => prev.map((x) => x === it ? {
																...x,
																reseller_price: min
															} : x));
															toast.error(`Minimum selling price is ৳${min} — cannot go below this`);
														}
													}
												})]
											}),
											isAdmin && /* @__PURE__ */ jsxs("label", {
												className: "space-y-1",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-[11px] font-semibold uppercase text-muted-foreground",
													children: "Base cost"
												}), /* @__PURE__ */ jsx("input", {
													className: inp,
													value: it.sa_price,
													onChange: (e) => setItems((prev) => prev.map((x) => x === it ? {
														...x,
														sa_price: Number(e.target.value) || 0
													} : x))
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-[11px] font-semibold uppercase text-muted-foreground",
													children: "Line total"
												}), /* @__PURE__ */ jsxs("div", {
													className: "px-1 py-1.5 text-xs font-bold tabular-nums",
													children: ["৳", (it.reseller_price * it.quantity).toFixed(0)]
												})]
											})
										]
									})]
								}, it.id ?? `new-${idx}`))
							})
						]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ jsx(SectionLabel, { children: "Delivery & Other Charges" }),
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-3 rounded-2xl border bg-muted/20 p-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ jsx(MoneyField, {
										label: "Delivery Charge (Customer pays)",
										hint: shipTouched ? `Custom · default ৳${autoShipping.toFixed(0)}` : `Auto ৳${autoShipping.toFixed(0)}`,
										value: shipInput,
										onChange: changeShip,
										placeholder: autoShipping.toFixed(0)
									}),
									/* @__PURE__ */ jsx(MoneyField, {
										label: "Discount",
										value: discount,
										onChange: setDiscount,
										placeholder: "0"
									}),
									/* @__PURE__ */ jsx(MoneyField, {
										label: "Packaging Cost",
										hint: packagingSum ? "Sum of all items" : "Highest item only",
										disabled: !isAdmin,
										value: packagingInput,
										onChange: setPackagingInput,
										placeholder: totals.packagingDefault.toFixed(0)
									}),
									isAdmin && /* @__PURE__ */ jsx(MoneyField, {
										label: "Courier Cost (Admin cost)",
										hint: deliveryCostTouched ? `Custom · default ৳${autoShipping.toFixed(0)}` : `Auto ৳${autoShipping.toFixed(0)}`,
										value: deliveryCostInput,
										onChange: changeDeliveryCost,
										placeholder: autoShipping.toFixed(0)
									})
								]
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "text-[12px] leading-relaxed text-muted-foreground",
								children: [
									"Leave empty to use the default. Delivery charge = paid by customer, courier cost = admin's expense.",
									/* @__PURE__ */ jsx("br", {}),
									packagingModeHint(packagingSum)
								]
							}),
							/* @__PURE__ */ jsx(SectionLabel, { children: "Advance Payment" }),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-3 rounded-2xl border border-primary/20 bg-primary/[0.03] p-4",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "grid gap-3 sm:grid-cols-2",
									children: [/* @__PURE__ */ jsx(MoneyField, {
										label: "Advance Amount",
										hint: "If already received",
										value: advance,
										onChange: setAdvance,
										placeholder: "0"
									}), /* @__PURE__ */ jsx(AdvanceByToggle, {
										value: advanceBy,
										onChange: setAdvanceBy
									})]
								}), /* @__PURE__ */ jsx("p", {
									className: "text-[12px] leading-relaxed text-muted-foreground",
									children: "If taken by admin, it is not deducted from the reseller's account; if taken by the reseller, it will be deducted from the final amount."
								})]
							}),
							/* @__PURE__ */ jsx(SectionLabel, { children: "Payment Method & Note" }),
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-3 rounded-2xl border bg-muted/20 p-4 sm:grid-cols-2",
								children: [/* @__PURE__ */ jsxs("label", {
									className: "space-y-1",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-[13px] font-semibold text-foreground/80",
										children: "Payment Method"
									}), /* @__PURE__ */ jsxs("select", {
										className: inp,
										value: paymentMethod,
										onChange: (e) => setPaymentMethod(e.target.value),
										children: [
											/* @__PURE__ */ jsx("option", {
												value: "cod",
												children: "Cash on Delivery"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "bkash",
												children: "bKash"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "nagad",
												children: "Nagad"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "rocket",
												children: "Rocket"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "sslcommerz",
												children: "SSLCommerz"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "other",
												children: "Other"
											})
										]
									})]
								}), /* @__PURE__ */ jsxs("label", {
									className: "space-y-1",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-[13px] font-semibold text-foreground/80",
										children: isAdmin ? "Admin Note" : "Your Note"
									}), /* @__PURE__ */ jsx("input", {
										className: inp,
										value: note,
										onChange: (e) => setNote(e.target.value)
									})]
								})]
							}),
							isAdmin && /* @__PURE__ */ jsxs("label", {
								className: "mt-3 block",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-[13px] font-semibold text-foreground/80",
										children: "Received amount (partial delivery)"
									}),
									/* @__PURE__ */ jsx("input", {
										type: "number",
										className: inp,
										placeholder: `Empty = full ৳${totals.codDue.toFixed(0)} collected`,
										value: received,
										onChange: (e) => setReceived(e.target.value)
									}),
									/* @__PURE__ */ jsxs("span", {
										className: "mt-1 block text-[10px] text-muted-foreground",
										children: [
											"Enter only what the courier collected. Any advance (",
											`৳${totals.advance.toFixed(0)}`,
											") is added on top automatically — profit is calculated from the total received."
										]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-3 rounded-xl border bg-muted/20 p-4 text-xs",
								children: [
									/* @__PURE__ */ jsxs("div", { children: [
										/* @__PURE__ */ jsx("p", {
											className: "mb-1 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60",
											children: "Customer bill"
										}),
										/* @__PURE__ */ jsx(Row, {
											label: "Subtotal",
											value: totals.subtotal
										}),
										/* @__PURE__ */ jsx(Row, {
											label: "Delivery charge",
											value: totals.shipping
										}),
										totals.discount > 0 && /* @__PURE__ */ jsx(Row, {
											label: "Discount",
											value: -totals.discount
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "mt-1 flex justify-between border-t pt-1 text-[13px] font-bold text-primary",
											children: [/* @__PURE__ */ jsx("span", { children: "Payable total" }), /* @__PURE__ */ jsxs("span", { children: ["৳", totals.total.toFixed(0)] })]
										})
									] }),
									/* @__PURE__ */ jsxs("div", {
										className: "border-t pt-2",
										children: [
											/* @__PURE__ */ jsx("p", {
												className: "mb-1 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60",
												children: "Collection"
											}),
											totals.advance > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Row, {
												label: `Advance already paid (${advanceBy})`,
												value: totals.advance
											}), /* @__PURE__ */ jsx(Row, {
												label: "COD to collect",
												value: totals.codDue
											})] }),
											/* @__PURE__ */ jsx(Row, {
												label: "Courier collected",
												value: totals.collected
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "mt-1 flex justify-between border-t pt-1 text-[13px] font-bold text-foreground",
												children: [/* @__PURE__ */ jsx("span", { children: "Received (incl. advance)" }), /* @__PURE__ */ jsxs("span", { children: ["৳", totals.received.toFixed(0)] })]
											}),
											totals.shortfall > 0 && /* @__PURE__ */ jsxs("div", {
												className: "mt-1 flex justify-between text-[11px] font-semibold text-destructive",
												children: [/* @__PURE__ */ jsx("span", { children: "Not received" }), /* @__PURE__ */ jsxs("span", { children: ["−৳", totals.shortfall.toFixed(0)] })]
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "border-t pt-2",
										children: [
											/* @__PURE__ */ jsx("p", {
												className: "mb-1 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60",
												children: isAdmin ? "Cost" : "Your cost"
											}),
											/* @__PURE__ */ jsx(Row, {
												label: "Product cost",
												value: totals.productCost
											}),
											/* @__PURE__ */ jsx(Row, {
												label: "Delivery charge",
												value: totals.deliveryCost
											}),
											/* @__PURE__ */ jsx(Row, {
												label: "Packaging cost",
												value: totals.packaging
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "mt-1 flex justify-between border-t pt-1 text-[13px] font-bold text-foreground",
												children: [/* @__PURE__ */ jsx("span", { children: "Total cost" }), /* @__PURE__ */ jsxs("span", { children: ["৳", (totals.productCost + totals.deliveryCost + totals.packaging).toFixed(0)] })]
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "border-t-2 border-dashed pt-2",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "flex justify-between text-[13px] font-bold " + (totals.grossProfit < 0 ? "text-destructive" : "text-success"),
												children: [/* @__PURE__ */ jsx("span", { children: totals.grossProfit < 0 ? isAdmin ? "Reseller loss" : "Your loss" : isAdmin ? "Reseller profit" : "Your profit" }), /* @__PURE__ */ jsxs("span", { children: ["৳", totals.grossProfit.toFixed(0)] })]
											}),
											totals.resellerAdvance > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Row, {
												label: "Advance already in reseller hand",
												value: -totals.resellerAdvance
											}), /* @__PURE__ */ jsxs("div", {
												className: "mt-1 flex justify-between border-t pt-1 text-[13px] font-black",
												children: [/* @__PURE__ */ jsx("span", { children: "Final amount to receive" }), /* @__PURE__ */ jsxs("span", {
													className: totals.profit < 0 ? "text-destructive" : "text-success",
													children: ["৳", totals.profit.toFixed(0)]
												})]
											})] }),
											totals.advance > 0 && /* @__PURE__ */ jsx("p", {
												className: "mt-1 text-[10px] leading-snug text-muted-foreground",
												children: advanceBy === "reseller" ? "Advance is already with the reseller, so it is deducted from the final amount." : "Advance is held by admin — no plus/minus on the reseller balance."
											})
										]
									})
								]
							})
						]
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-end gap-2 border-t bg-muted/20 px-4 py-3 sm:px-6",
				children: [/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: onClose,
					className: "rounded-lg border px-4 py-2 text-xs font-semibold hover:bg-accent",
					children: "Cancel"
				}), /* @__PURE__ */ jsxs("button", {
					type: "submit",
					disabled: busy,
					className: "btn-brand inline-flex items-center gap-2 rounded-lg px-5 py-2 text-xs font-bold disabled:opacity-50",
					children: [busy && /* @__PURE__ */ jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }), "Save changes"]
				})]
			})] })]
		})
	});
}
function Row({ label, value }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex justify-between border-b border-dashed py-1",
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ jsxs("span", {
			className: "font-medium tabular-nums",
			children: ["৳", value.toFixed(0)]
		})]
	});
}
//#endregion
//#region src/components/CourierTimeline.tsx
function CourierTimeline({ events, title = "Courier live updates" }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "surface-card p-4",
		children: [/* @__PURE__ */ jsx("div", {
			className: "mb-3 text-sm font-medium",
			children: title
		}), events.length === 0 ? /* @__PURE__ */ jsx("p", {
			className: "text-xs text-muted-foreground",
			children: "No courier updates yet. Booking and live webhook updates will appear here."
		}) : /* @__PURE__ */ jsx("ol", {
			className: "relative space-y-4 border-l pl-4",
			children: events.map((e) => /* @__PURE__ */ jsxs("li", {
				className: "relative",
				children: [
					/* @__PURE__ */ jsx("span", { className: "absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" }),
					/* @__PURE__ */ jsx("div", {
						className: "text-sm font-medium",
						children: courierStatusLabel(e.courier_status)
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center gap-1 text-[11px] text-muted-foreground",
						children: [
							/* @__PURE__ */ jsx("span", { children: new Date(e.event_at).toLocaleString() }),
							/* @__PURE__ */ jsx("span", { children: "·" }),
							/* @__PURE__ */ jsx(CourierLogo, {
								provider: e.provider,
								size: 13
							}),
							/* @__PURE__ */ jsx("span", { children: courierLabel(e.provider) }),
							/* @__PURE__ */ jsxs("span", { children: ["· ", e.source] }),
							e.notification_type ? /* @__PURE__ */ jsxs("span", { children: ["· ", e.notification_type] }) : null
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-0.5 flex flex-wrap gap-1.5 text-[11px] text-muted-foreground",
						children: [
							e.tracking_code && /* @__PURE__ */ jsxs("span", { children: ["Tracking ", e.tracking_code] }),
							e.cod_amount != null && /* @__PURE__ */ jsxs("span", { children: ["COD ৳", Number(e.cod_amount).toFixed(0)] }),
							e.delivery_charge != null && /* @__PURE__ */ jsxs("span", { children: ["Charge ৳", Number(e.delivery_charge).toFixed(0)] })
						]
					}),
					e.note && /* @__PURE__ */ jsx("div", {
						className: "mt-1 text-xs",
						children: e.note
					})
				]
			}, e.id))
		})]
	});
}
//#endregion
export { AdvanceChip as a, recheckCourierStatus as c, ResellerTotalCell as i, OrderEditModal as n, OrderMoneyPanel as o, AdminTotalCell as r, getOrderDetails as s, CourierTimeline as t };
