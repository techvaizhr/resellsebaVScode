import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { t as Link } from "./link-BijU1MeZ.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { t as useNavigate } from "./useNavigate-GQPu3B30.js";
import { r as supabase } from "./client-fziyWHNw.js";
import { t as useServerFn } from "./useServerFn-mrQ2htrR.js";
import { d as productDeliveryCharge, i as areaOptions } from "./delivery-DY_nRbFK.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { I as ShieldCheck, Nt as LoaderCircle, er as ChevronDown, m as Truck, tt as Plus, v as Trash2, yt as Minus } from "./vendor-icons-DF2A5Z8S.js";
import { t as Route } from "./s._code.checkout-HN9fDPb0.js";
import { o as useAdvancedSettings } from "./advanced-settings-VndvKEQI.js";
import { i as startGatewayPayment, t as listActiveGateways } from "./gateways.functions-D6lXJY3e.js";
import { t as PaymentLogo } from "./payment-brand-DOxAYgjm.js";
import { a as sanitizeName, i as phoneError, n as nameError, r as normalizePhone, t as addressError } from "./checkout-validate-C4SpuEI3.js";
import { _ as bdt, a as PrimaryButton, b as setCartQty, c as borderc, d as useStore, g as addToCart, l as cx, n as GhostButton, r as Heading, t as EmptyState, u as muted, v as clearCart, y as removeFromCart } from "./ui-v9g8zAru.js";
//#region src/routes/s.$code.checkout.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Area names come from Admin → Advanced settings → Delivery charge. */
function useAreas() {
	const { settings } = useAdvancedSettings();
	return areaOptions(settings.delivery);
}
function Checkout() {
	const AREAS = useAreas();
	const { code } = Route.useParams();
	const { l: directListing, q: directQty, pay: payFlag } = Route.useSearch();
	const nav = useNavigate();
	const store = useStore();
	/** Manual methods arrive with the storefront bootstrap payload — no extra call. */
	const methods = store.paymentMethods.map((m) => ({
		method: m.method,
		label: m.label ?? m.method,
		instructions: m.instructions
	}));
	const [payMethod, setPayMethod] = (0, import_react.useState)("cod");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [noteOpen, setNoteOpen] = (0, import_react.useState)(false);
	const [touched, setTouched] = (0, import_react.useState)({});
	const [gateways, setGateways] = (0, import_react.useState)([]);
	const loadGateways = useServerFn(listActiveGateways);
	const startPayment = useServerFn(startGatewayPayment);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		phone: "",
		address: "",
		area: "outside_dhaka",
		notes: ""
	});
	/** Direct "Order now" links still work: merge into the cart once. */
	(0, import_react.useEffect)(() => {
		if (directListing) {
			addToCart(code, directListing, directQty && directQty > 0 ? directQty : 1);
			nav({
				to: "/s/$code/checkout",
				params: { code },
				search: {},
				replace: true
			});
		}
	}, [
		directListing,
		directQty,
		code,
		nav
	]);
	/**
	* The shopper came back from a gateway without paying (cancelled or failed).
	* They land here, on their own store, so they can retry or switch to COD.
	*/
	(0, import_react.useEffect)(() => {
		if (!payFlag) return;
		toast.error(payFlag === "cancelled" ? "Payment was cancelled — your cart is still here, try again or choose Cash on Delivery." : "Payment did not go through — please try again or choose Cash on Delivery.");
		nav({
			to: "/s/$code/checkout",
			params: { code },
			search: {},
			replace: true
		});
	}, [
		payFlag,
		code,
		nav
	]);
	/** Automatic gateways come from the server (credentials never reach the browser). */
	(0, import_react.useEffect)(() => {
		loadGateways({ data: { code } }).then((rows) => setGateways(rows)).catch(() => setGateways([]));
	}, [code, loadGateways]);
	const lines = (0, import_react.useMemo)(() => store.cart.map((c) => ({
		line: c,
		listing: store.byListingId(c.listingId)
	})).filter((x) => x.listing), [store.cart, store]);
	const totals = (0, import_react.useMemo)(() => {
		const subtotal = lines.reduce((s, x) => s + Number(x.listing.selling_price) * x.line.qty, 0);
		/**
		* Delivery is never summed across products. Each product carries its own
		* delivery method (area / flat / free) and the cart charges only the
		* single highest one — same rule the backend applies.
		*/
		const perItem = lines.map((x) => ({
			name: x.listing.custom_title || x.listing.product?.name || "Product",
			charge: productDeliveryCharge(x.listing.product ?? {}, form.area, {
				inside: x.listing.extra_delivery_inside,
				outside: x.listing.extra_delivery_outside
			})
		}));
		const top = perItem.reduce((best, i) => !best || i.charge > best.charge ? i : best, null);
		const ship = top ? top.charge : 0;
		return {
			subtotal,
			ship,
			total: subtotal + ship,
			shipFrom: top?.name ?? null,
			multi: perItem.length > 1
		};
	}, [lines, form.area]);
	const errors = {
		name: nameError(form.name),
		phone: phoneError(form.phone),
		address: addressError(form.address)
	};
	const valid = !errors.name && !errors.phone && !errors.address;
	/** Extra payment options only render when the reseller actually enabled one. */
	const extraMethods = methods.filter((m) => m.method !== "cod");
	const gatewayOptions = gateways.map((g) => ({
		value: `api:${g.provider}`,
		method: g.method,
		label: g.label,
		instructions: null,
		provider: g.provider
	}));
	const codMeta = methods.find((m) => m.method === "cod");
	async function submit(e) {
		e.preventDefault();
		if (!lines.length) return;
		setTouched({
			name: true,
			phone: true,
			address: true
		});
		if (!valid) {
			toast.error(errors.name || errors.phone || errors.address || "Please check your details");
			return;
		}
		setBusy(true);
		const gateway = gatewayOptions.find((g) => g.value === payMethod);
		const { data, error } = await supabase.rpc("create_public_order", {
			_reseller_code: code,
			_customer_name: sanitizeName(form.name).trim(),
			_customer_phone: normalizePhone(form.phone),
			_customer_email: null,
			_address_line: form.address.trim(),
			_city: null,
			_area: form.area,
			_landmark: null,
			_payment_method: gateway ? gateway.method : payMethod,
			_notes: form.notes.trim() || null,
			_items: lines.map((x) => ({
				listing_id: x.listing.id,
				quantity: x.line.qty
			}))
		});
		if (error) {
			setBusy(false);
			toast.error(error.message);
			return;
		}
		const row = Array.isArray(data) ? data[0] : data;
		if (!row?.order_number) {
			setBusy(false);
			toast.error("Order could not be created");
			return;
		}
		if (gateway) try {
			const r = await startPayment({ data: {
				orderNumber: row.order_number,
				code,
				provider: gateway.provider,
				storeOrigin: window.location.origin
			} });
			clearCart(code);
			window.location.href = r.redirectUrl;
			return;
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Payment could not be started");
			setBusy(false);
			return;
		}
		clearCart(code);
		setBusy(false);
		nav({
			to: "/s/$code/thanks",
			params: { code },
			search: { n: row.order_number }
		});
	}
	const inp = cx("w-full rounded-[var(--st-radius-sm)] border bg-[var(--st-surface)] px-3.5 py-3 text-base text-[var(--st-fg)] outline-none placeholder:text-[var(--st-muted)] focus:border-[var(--st-primary)] sm:text-sm", borderc);
	if (!lines.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-4 py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Your cart is empty",
			hint: "Add a product to continue to checkout."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/s/$code",
				params: { code },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostButton, { children: "Browse products" })
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 pb-28 pt-6 sm:pb-10 sm:pt-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center sm:text-left",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
				as: "h1",
				className: "text-2xl sm:text-3xl",
				children: store.content.text("co_headline")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx("mx-auto mt-1.5 max-w-xl text-sm sm:mx-0", muted),
				children: store.content.text("co_note")
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-5 lg:grid-cols-[1fr_380px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				noValidate: true,
				className: cx("space-y-4 rounded-[var(--st-radius)] border bg-[var(--st-surface)] p-4 sm:p-5", borderc),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Your name",
							required: true,
							error: touched.name ? errors.name : null,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: form.name,
								onChange: (e) => setForm({
									...form,
									name: sanitizeName(e.target.value)
								}),
								onBlur: () => setTouched((t) => ({
									...t,
									name: true
								})),
								autoComplete: "name",
								inputMode: "text",
								placeholder: "Full name",
								className: inp
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Mobile number",
							required: true,
							error: touched.phone ? errors.phone : null,
							hint: "11 digits, starts with 01",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: form.phone,
								onChange: (e) => setForm({
									...form,
									phone: normalizePhone(e.target.value)
								}),
								onBlur: () => setTouched((t) => ({
									...t,
									phone: true
								})),
								autoComplete: "tel",
								inputMode: "numeric",
								placeholder: "01XXXXXXXXX",
								className: cx(inp, "tracking-[0.06em]")
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Full address",
						required: true,
						error: touched.address ? errors.address : null,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 3,
							value: form.address,
							onChange: (e) => setForm({
								...form,
								address: e.target.value
							}),
							onBlur: () => setTouched((t) => ({
								...t,
								address: true
							})),
							autoComplete: "street-address",
							placeholder: "House / road, area, upazila, district",
							className: inp
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-1.5 text-xs font-medium",
						children: "Delivery area"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-2",
						children: AREAS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setForm({
								...form,
								area: a.value
							}),
							"aria-pressed": form.area === a.value,
							className: cx("rounded-[var(--st-radius-sm)] border px-2 py-2.5 text-xs font-medium sm:text-sm", form.area === a.value ? "border-[var(--st-primary)] bg-[var(--st-primary)] text-[var(--st-on-primary)]" : cx(borderc, "text-[var(--st-fg)] hover:border-[var(--st-primary)]")),
							children: a.label
						}, a.value))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setNoteOpen((v) => !v),
						className: cx("inline-flex items-center gap-1.5 text-xs font-medium", muted, "hover:text-[var(--st-primary)]"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: cx("h-3.5 w-3.5 transition-transform", noteOpen && "rotate-45") }), "Add note (optional)"]
					}), noteOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 2,
						autoFocus: true,
						value: form.notes,
						onChange: (e) => setForm({
							...form,
							notes: e.target.value
						}),
						placeholder: "Anything we should know about your order?",
						className: cx(inp, "mt-2")
					})] }),
					extraMethods.length + gatewayOptions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2.5 flex items-baseline justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-semibold uppercase tracking-[0.14em]",
							children: "Payment method"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx("text-[11px]", "text-[var(--st-muted)]"),
							children: "Choose one"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-2.5 sm:grid-cols-2",
						children: [
							{
								value: "cod",
								method: "cod",
								label: "Cash on Delivery",
								instructions: codMeta?.instructions ?? "Pay the courier when your parcel arrives."
							},
							...extraMethods.map((m) => ({
								...m,
								value: m.method
							})),
							...gatewayOptions
						].map((m) => {
							const selected = payMethod === m.value;
							const online = "provider" in m;
							const logoFor = online ? m.provider : m.method;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setPayMethod(m.value),
								"aria-pressed": selected,
								className: cx("group relative flex items-center gap-3 rounded-[var(--st-radius-sm)] border p-3 text-left transition-colors", selected ? "border-[var(--st-primary)] bg-[var(--st-primary)]/[0.07]" : cx("border-[var(--st-border)]", "hover:border-[var(--st-primary)]")),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cx("grid h-12 w-16 shrink-0 place-items-center overflow-hidden rounded-[var(--st-radius-sm)] border bg-[var(--st-bg)] p-1", selected ? "border-[var(--st-primary)]" : "border-[var(--st-border)]"),
										children: m.value === "cod" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-6 w-6 text-[var(--st-primary)]" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentLogo, {
											method: logoFor,
											width: 60,
											height: 40,
											fit: "contain",
											alt: m.label
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate text-sm font-semibold text-[var(--st-fg)]",
												children: m.label
											}), online && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-full bg-[var(--st-primary)]/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[var(--st-primary)]",
												children: "instant"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cx("mt-0.5 line-clamp-2 block text-[11px] leading-snug", "text-[var(--st-muted)]"),
											children: online ? "Pay securely online and confirm instantly." : m.instructions || "Manual payment"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										"aria-hidden": true,
										className: cx("grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full border", selected ? "border-[var(--st-primary)] bg-[var(--st-primary)]" : "border-[var(--st-border)]"),
										children: selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-[var(--st-on-primary)]" })
									})
								]
							}, m.value);
						})
					})] }),
					extraMethods.length + gatewayOptions.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cx("flex items-start gap-2 rounded-[var(--st-radius-sm)] border border-dashed p-3 text-xs", "border-[var(--st-border)]", "text-[var(--st-muted)]"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "mt-0.5 h-4 w-4 shrink-0 text-[var(--st-primary)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cash on Delivery — pay the courier when your parcel arrives." })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden sm:block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PrimaryButton, {
							disabled: busy,
							className: "w-full",
							children: [
								busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
								" Place order — ",
								bdt(totals.total)
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: cx("flex items-center justify-center gap-2 text-xs sm:justify-start", muted),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 shrink-0 text-[var(--st-primary)]" }),
							" ",
							store.content.text("co_trust")
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cx("fixed inset-x-0 bottom-0 z-30 border-t bg-[var(--st-surface)] p-3 shadow-[0_-10px_30px_-24px_rgba(0,0,0,0.6)] sm:hidden", borderc),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PrimaryButton, {
							disabled: busy,
							className: "w-full",
							children: [
								busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
								" Place order — ",
								bdt(totals.total)
							]
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: cx("h-fit space-y-4 rounded-[var(--st-radius)] border bg-[var(--st-surface)] p-4 sm:p-5", borderc),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Heading, {
						className: "text-base",
						children: [
							"Your cart (",
							store.cartCount,
							")"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: lines.map(({ line, listing }) => {
							const img = store.image(listing);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cx("flex gap-3 rounded-[var(--st-radius-sm)] border p-3", borderc),
								children: [img && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: img,
									alt: "",
									className: "h-16 w-16 shrink-0 rounded-[var(--st-radius-sm)] object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "line-clamp-2 text-sm text-[var(--st-fg)]",
										children: store.title(listing)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1.5 flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: cx("inline-flex items-center rounded-[var(--st-radius-sm)] border", borderc),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														"aria-label": "Decrease",
														onClick: () => setCartQty(code, listing.id, line.qty - 1),
														className: "px-2.5 py-1.5",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3 w-3" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "min-w-[2.5ch] text-center text-xs font-semibold",
														children: line.qty
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														"aria-label": "Increase",
														onClick: () => setCartQty(code, listing.id, line.qty + 1),
														className: "px-2.5 py-1.5",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" })
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												"aria-label": "Remove",
												onClick: () => removeFromCart(code, listing.id),
												className: cx("p-1.5", muted, "hover:text-[var(--st-primary)]"),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "ml-auto text-sm font-semibold text-[var(--st-fg)]",
												children: bdt(Number(listing.selling_price) * line.qty)
											})
										]
									})]
								})]
							}, listing.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cx("space-y-1.5 border-t pt-3 text-sm", borderc),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Subtotal",
								value: bdt(totals.subtotal)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Delivery charge",
								value: totals.ship ? bdt(totals.ship) : "Free"
							}),
							totals.multi && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: cx("text-[11px] leading-snug", "text-[var(--st-muted)]"),
								children: totals.ship ? `Highest single-product delivery charge applied${totals.shipFrom ? ` (${totals.shipFrom})` : ""} — charges are not added up.` : "Free delivery on this cart."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Total payable",
								value: bdt(totals.total),
								bold: true
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/s/$code",
						params: { code },
						className: cx("flex items-center justify-center gap-1 text-xs hover:text-[var(--st-primary)]", muted),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3.5 w-3.5 rotate-90" }), " Continue shopping"]
					})
				]
			})]
		})]
	});
}
function Field({ label, required, hint, error, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-1.5 flex items-baseline justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "text-xs font-medium text-[var(--st-fg)]",
				children: [
					label,
					" ",
					required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[var(--st-primary)]",
						children: "*"
					})
				]
			}), hint && !error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx("text-[11px]", "text-[var(--st-muted)]"),
				children: hint
			})]
		}),
		children,
		error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-[11px] font-medium text-[var(--st-primary)]",
			children: error
		})
	] });
}
function Row({ label, value, bold }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx("flex justify-between", bold ? "text-base font-semibold text-[var(--st-fg)]" : muted),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: value })]
	});
}
//#endregion
export { Checkout as component };
