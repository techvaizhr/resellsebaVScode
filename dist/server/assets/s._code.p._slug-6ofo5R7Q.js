import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { t as Link } from "./link-BijU1MeZ.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { t as useNavigate } from "./useNavigate-GQPu3B30.js";
import { a as deliveryLabel } from "./delivery-DY_nRbFK.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { I as ShieldCheck, N as ShoppingBag, Qn as ChevronLeft, et as Plus, m as Truck, t as Zap, vt as Minus } from "./vendor-icons-BEaCFqaT.js";
import { t as Route } from "./s._code.p._slug-BYgVwzgY.js";
import { t as ProductCodeChip } from "./product-code-BsvmZrFA.js";
import { a as PrimaryButton, c as borderc, d as useStore, g as addToCart, h as trackViewContent, i as Price, l as cx, n as GhostButton, o as ProductGrid, p as trackAddToCart, r as Heading, s as SectionHead, t as EmptyState, u as muted } from "./ui-J5IyEES0.js";
import { i as useResellerTools, n as ImageDownloadTools, r as stripHtml, t as CopyButton } from "./reseller-tools-1GFcU1Zk.js";
//#region src/routes/s.$code.p.$slug.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductPage() {
	const { code, slug } = Route.useParams();
	const nav = useNavigate();
	const store = useStore();
	const listing = store.bySlug(slug);
	const [qty, setQty] = (0, import_react.useState)(1);
	const [idx, setIdx] = (0, import_react.useState)(0);
	const tools = useResellerTools();
	(0, import_react.useEffect)(() => {
		setQty(1);
		setIdx(0);
		if (listing) trackViewContent({
			id: listing.product.id,
			name: store.title(listing),
			price: Number(listing.selling_price)
		});
	}, [listing?.id]);
	if (!listing) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl px-4 py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Product not available",
			hint: "It may have been removed from this store."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/s/$code",
				params: { code },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostButton, { children: "Back to store" })
			})
		})]
	});
	const p = listing.product;
	const title = store.title(listing);
	const price = Number(listing.selling_price);
	const images = p.product_images ?? [];
	const active = images[idx]?.url ?? store.image(listing);
	const inStock = p.stock === null || Number(p.stock) > 0;
	const imageUrls = images.map((im) => im.url).filter(Boolean);
	const detailsText = stripHtml([listing.custom_description || p.short_description || "", p.description || ""].filter(Boolean).join("\n\n"));
	const related = store.listings.filter((l) => l.id !== listing.id && l.product?.category_id === p.category_id).slice(0, 4);
	const jsonLd = {
		"@context": "https://schema.org/",
		"@type": "Product",
		name: title,
		description: listing.custom_description || p.short_description || title,
		image: active ? [active] : void 0,
		offers: {
			"@type": "Offer",
			priceCurrency: "BDT",
			price,
			availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
		}
	};
	function add(goCheckout) {
		addToCart(code, listing.id, qty);
		trackAddToCart({
			id: p.id,
			name: title,
			price,
			qty
		});
		if (goCheckout) nav({
			to: "/s/$code/checkout",
			params: { code }
		});
		else toast.success("Added to cart");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 pb-24 pt-8 lg:pb-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLd) }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: cx("mb-5 flex items-center gap-1 text-xs", muted),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/s/$code",
						params: { code },
						className: "inline-flex items-center gap-1 hover:text-[var(--st-primary)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3 w-3" }), " Store"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate text-[var(--st-fg)]",
						children: title
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-10 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx("relative aspect-square overflow-hidden rounded-[var(--st-radius)] border bg-[var(--st-bg-alt)]", borderc),
					children: [active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: active,
						alt: title,
						className: "h-full w-full object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cx("grid h-full w-full place-items-center text-xs", muted),
						children: "No image"
					}), tools && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute right-3 top-3 z-10 flex flex-col gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageDownloadTools, {
								compact: true,
								images: imageUrls,
								activeUrl: active,
								baseName: title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, {
								value: title,
								className: "h-9 w-9 rounded-full bg-[var(--st-surface)]/90 p-0 shadow-sm backdrop-blur"
							}),
							detailsText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, {
								value: detailsText,
								label: "details",
								className: "h-9 w-9 rounded-full bg-[var(--st-surface)]/90 p-0 shadow-sm backdrop-blur"
							})
						]
					})]
				}), images.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: images.map((im, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setIdx(i),
						"aria-label": `Image ${i + 1}`,
						className: cx("h-16 w-16 flex-none overflow-hidden rounded-[var(--st-radius-sm)] border", i === idx ? "border-[var(--st-primary)]" : "border-[var(--st-border)]"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: im.url,
							alt: "",
							loading: "lazy",
							className: "h-full w-full object-cover"
						})
					}, i))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group flex items-start gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
							as: "h1",
							className: "text-2xl leading-tight md:text-4xl",
							children: title
						}), tools && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, {
							value: title,
							className: "mt-1.5 flex-none opacity-70 group-hover:opacity-100"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCodeChip, { code: p.product_code })
					}),
					(listing.custom_description || p.short_description) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cx("mt-3 text-sm leading-relaxed", "text-[var(--st-muted)]"),
						children: listing.custom_description || p.short_description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex items-baseline gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Price, {
							value: price,
							className: "text-3xl md:text-4xl"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx("rounded-full px-2.5 py-1 text-[11px] font-semibold", inStock ? "bg-[var(--st-primary)]/12 text-[var(--st-primary)]" : "bg-[var(--st-bg-alt)] text-[var(--st-muted)]"),
							children: inStock ? "In stock" : "Out of stock"
						})]
					}),
					store.content.text("pdp_urgency") && inStock && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm font-medium text-[var(--st-primary)]",
						children: store.content.text("pdp_urgency")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cx("mt-5 grid gap-2 rounded-[var(--st-radius)] border p-4 text-sm", borderc),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4 text-[var(--st-primary)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Delivery: ", deliveryLabel(p)] })]
						}), [
							1,
							2,
							3
						].map((i) => store.content.text(`pdp_trust${i}`)).filter(Boolean).map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-[var(--st-primary)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: line })]
						}, line))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cx("inline-flex items-center rounded-[var(--st-radius-sm)] border", borderc),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setQty((q) => Math.max(1, q - 1)),
										"aria-label": "Decrease",
										className: "p-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3.5 w-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "min-w-[3ch] text-center text-sm font-semibold",
										children: qty
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setQty((q) => q + 1),
										"aria-label": "Increase",
										className: "p-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" })
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PrimaryButton, {
								disabled: !inStock,
								onClick: () => add(true),
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4" }), " Order now"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GhostButton, {
								disabled: !inStock,
								onClick: () => add(false),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4" }), " Add to cart"]
							})
						]
					}),
					store.content.text("pdp_returns") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cx("mt-3 text-xs leading-relaxed", "text-[var(--st-muted)]"),
						children: store.content.text("pdp_returns")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						search: { mode: "signup" },
						className: cx("mt-6 flex items-center justify-center gap-2 rounded-[var(--st-radius)] border px-4 py-3 text-sm font-medium", "bg-[var(--st-bg-alt)] hover:border-[var(--st-primary)] hover:text-[var(--st-primary)]", borderc),
						children: "Want to sell this product?"
					})
				] })]
			}),
			p.description && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-12 lg:mt-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
						className: "text-xl",
						children: "Product details"
					}), tools && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, {
						value: detailsText,
						label: "details"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cx("prose prose-sm mt-4 max-w-none rounded-[var(--st-radius)] border p-5 text-sm leading-relaxed", "border-[var(--st-border)]", "text-[var(--st-muted)]"),
					dangerouslySetInnerHTML: { __html: p.description }
				})]
			}),
			related.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
					title: "You may also like",
					subtitle: "More from this collection"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductGrid, { listings: related })]
			}),
			store.content.flag("pdp_sticky") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx("fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t bg-[var(--st-surface)] px-4 py-3 lg:hidden", "border-[var(--st-border)]"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "truncate text-xs text-[var(--st-muted)]",
						children: title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Price, {
						value: price,
						className: "text-lg"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PrimaryButton, {
					disabled: !inStock,
					onClick: () => add(true),
					className: "px-4 py-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4" }), " Order now"]
				})]
			})
		]
	});
}
//#endregion
export { ProductPage as component };
