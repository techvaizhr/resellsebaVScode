import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { t as Link } from "./link-BijU1MeZ.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { t as Route } from "./s._code.c._slug-BUJnC8vX.js";
import { c as borderc, d as useStore, l as cx, n as GhostButton, o as ProductGrid, s as SectionHead, t as EmptyState, u as muted } from "./ui-D6L_gDCi.js";
//#region src/routes/s.$code.c.$slug.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CategoryPage() {
	const { code, slug } = Route.useParams();
	const { categories, listings } = useStore();
	const [sort, setSort] = (0, import_react.useState)("new");
	const category = categories.find((c) => c.slug === slug);
	const rows = (0, import_react.useMemo)(() => {
		const sorted = [...listings.filter((l) => l.product?.category_id === category?.id)];
		if (sort === "low") sorted.sort((a, b) => Number(a.selling_price) - Number(b.selling_price));
		if (sort === "high") sorted.sort((a, b) => Number(b.selling_price) - Number(a.selling_price));
		return sorted;
	}, [
		listings,
		category?.id,
		sort
	]);
	if (!category) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Collection not found",
			hint: "This collection is no longer available."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/s/$code",
				params: { code },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostButton, { children: "Back to store" })
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [category.image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-48 overflow-hidden md:h-64",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: category.image_url,
			alt: category.name,
			className: "h-full w-full object-cover"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-[var(--st-bg)] to-transparent" })]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
				title: category.name,
				subtitle: `${rows.length} product${rows.length === 1 ? "" : "s"} available`,
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: sort,
					onChange: (e) => setSort(e.target.value),
					"aria-label": "Sort products",
					className: cx("rounded-[var(--st-radius-sm)] border bg-[var(--st-surface)] px-3 py-2 text-sm outline-none", borderc),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "new",
							children: "Newest first"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "low",
							children: "Price: low to high"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "high",
							children: "Price: high to low"
						})
					]
				})
			}),
			rows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductGrid, { listings: rows }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No products here yet",
				hint: "Check another collection."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx("mt-10 text-center text-sm", muted),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/s/$code",
					params: { code },
					className: "hover:text-[var(--st-primary)]",
					children: "← Continue shopping"
				})
			})
		]
	})] });
}
//#endregion
export { CategoryPage as component };
