import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { t as useNavigate } from "./useNavigate-GQPu3B30.js";
import { r as supabase } from "./client-BZQd8T2B.js";
import { t as useServerFn } from "./useServerFn-mrQ2htrR.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { Bt as Link2, I as ShieldCheck, In as CloudDownload, K as Save, Nt as LoaderCircle, r as X, st as Pencil } from "./vendor-icons-DF2A5Z8S.js";
import { n as uniqueProductSlug } from "./slug-hc2dm6m-.js";
import { a as importProductFromUrl, i as fetchImportImage, n as saveImportDraft, t as importImagesToStorage } from "./product-import-CuDRR9CO.js";
//#region src/components/ProductImportModal.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
/**
* Paste a marketplace product link (Daraz / Alibaba / AliExpress / Amazon /
* WooCommerce or any OG-tagged shop) and either save it straight away as an
* inactive draft, or open the product form pre-filled for editing.
*/
function ProductImportModal({ open, onClose, onSaved }) {
	const nav = useNavigate();
	const runImport = useServerFn(importProductFromUrl);
	const pullImage = useServerFn(fetchImportImage);
	const [url, setUrl] = (0, import_react.useState)("");
	const [mode, setMode] = (0, import_react.useState)("edit");
	const [step, setStep] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (!open) return null;
	async function go(e) {
		e.preventDefault();
		if (busy) return;
		setBusy(true);
		try {
			setStep("Reading the product page…");
			const data = await runImport({ data: { url: url.trim() } });
			setStep(`Downloading ${Math.min(data.images.length, 6)} image(s)…`);
			const images = await importImagesToStorage(data.images, pullImage, 6, (d, t) => setStep(`Downloading image ${d}/${t}…`));
			if (mode === "edit") {
				saveImportDraft({
					...data,
					images
				});
				toast.success(`${data.source} theke data ready — ekhon edit kore save korun.`);
				onClose();
				nav({ to: "/admin/products/new" });
				return;
			}
			setStep("Saving product…");
			const price = data.price ?? 0;
			const adminPrice = data.adminPrice ?? price;
			const buyingPrice = data.buyingPrice ?? adminPrice;
			const [{ data: brandRow }, { data: catRow }] = await Promise.all([data.brand ? supabase.from("brands").select("id").ilike("name", data.brand).maybeSingle() : Promise.resolve({ data: null }), data.category ? supabase.from("categories").select("id").ilike("name", data.category).maybeSingle() : Promise.resolve({ data: null })]);
			const slug = await uniqueProductSlug(data.name);
			const { data: p, error } = await supabase.from("products").insert({
				name: data.name,
				slug,
				sku: data.sku || null,
				description: data.description || null,
				short_description: data.shortDescription || null,
				brand_id: brandRow?.id ?? null,
				category_id: catRow?.id ?? null,
				buying_price: buyingPrice,
				reseller_price: adminPrice,
				suggested_price: price || adminPrice,
				packaging_cost: 0,
				delivery_mode: "area",
				delivery_inside: 60,
				delivery_outside: 130,
				stock: 0,
				is_active: false,
				og_image_url: images[0]?.url ?? null,
				meta_title: data.metaTitle || null,
				meta_description: data.metaDescription || null
			}).select("id").single();
			if (error) throw new Error(error.message);
			if (images.length && p) await supabase.from("product_images").insert(images.map((im, i) => ({
				product_id: p.id,
				url: im.url,
				is_primary: i === 0,
				sort_order: i
			})));
			toast.success("Product saved as inactive draft — price check kore active korun.");
			setUrl("");
			onSaved?.();
			onClose();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Import failed");
		} finally {
			setBusy(false);
			setStep("");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-xl overflow-hidden rounded-xl border bg-card shadow-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3 border-b bg-primary/10 px-5 py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/15 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudDownload, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-semibold",
							children: "Import product from URL"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Panel/store product link, or Daraz, Alibaba, AliExpress, Amazon, WooCommerce — auto details & media"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						"aria-label": "Close",
						className: "rounded p-1 hover:bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: go,
				className: "space-y-4 px-5 py-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium",
							children: "Target product link *"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 rounded-md border bg-background px-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "h-4 w-4 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "url",
								value: url,
								onChange: (e) => setUrl(e.target.value),
								placeholder: "https://your-panel.com/catalog/product-slug",
								className: "w-full bg-transparent py-2.5 text-sm outline-none"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-emerald-600" }), "Panel links (…/catalog/slug, …/s/CODE/p/slug, …/p/slug) import instantly. https only, scripts stripped, images re-encoded to ≤200KB WebP."]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeCard, {
							active: mode === "direct",
							onPick: () => setMode("direct"),
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }),
							title: "Just add",
							text: "Ja data pabe tai save hobe (inactive draft), modal asbe na."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeCard, {
							active: mode === "edit",
							onPick: () => setMode("edit"),
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" }),
							title: "Edit then save",
							text: "Product form prefilled hobe — poriborton kore save korben."
						})]
					}),
					busy && step && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }),
							" ",
							step
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2 pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							className: "rounded-md border px-4 py-2 text-sm",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							disabled: busy,
							className: "btn-brand inline-flex items-center gap-2 rounded-md px-5 py-2 text-sm font-medium disabled:opacity-50",
							children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudDownload, { className: "h-4 w-4" }), mode === "direct" ? "Import & save" : "Import & edit"]
						})]
					})
				]
			})]
		})
	});
}
function ModeCard({ active, onPick, icon, title, text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: onPick,
		className: `rounded-lg border p-3 text-left transition ${active ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted/50"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-center gap-2 text-sm font-medium",
			children: [
				icon,
				" ",
				title
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mt-1 block text-[11px] leading-relaxed text-muted-foreground",
			children: text
		})]
	});
}
//#endregion
export { ProductImportModal as t };
