import { t as Route } from "./s._code.c._slug-9Iu_DQrL.js";
import { c as borderc, d as useStore, l as cx, n as GhostButton, o as ProductGrid, s as SectionHead, t as EmptyState, u as muted } from "./ui-BKy6cVLc.js";
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/s.$code.c.$slug.tsx?tsr-split=component
function CategoryPage() {
	const { code, slug } = Route.useParams();
	const { categories, listings } = useStore();
	const [sort, setSort] = useState("new");
	const category = categories.find((c) => c.slug === slug);
	const rows = useMemo(() => {
		const sorted = [...listings.filter((l) => l.product?.category_id === category?.id)];
		if (sort === "low") sorted.sort((a, b) => Number(a.selling_price) - Number(b.selling_price));
		if (sort === "high") sorted.sort((a, b) => Number(b.selling_price) - Number(a.selling_price));
		return sorted;
	}, [
		listings,
		category?.id,
		sort
	]);
	if (!category) return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-6xl px-4 py-16",
		children: [/* @__PURE__ */ jsx(EmptyState, {
			title: "Collection not found",
			hint: "This collection is no longer available."
		}), /* @__PURE__ */ jsx("div", {
			className: "mt-6 text-center",
			children: /* @__PURE__ */ jsx(Link, {
				to: "/s/$code",
				params: { code },
				children: /* @__PURE__ */ jsx(GhostButton, { children: "Back to store" })
			})
		})]
	});
	return /* @__PURE__ */ jsxs("div", { children: [category.image_url && /* @__PURE__ */ jsxs("div", {
		className: "relative h-48 overflow-hidden md:h-64",
		children: [/* @__PURE__ */ jsx("img", {
			src: category.image_url,
			alt: category.name,
			className: "h-full w-full object-cover"
		}), /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-[var(--st-bg)] to-transparent" })]
	}), /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-6xl px-4 py-10",
		children: [
			/* @__PURE__ */ jsx(SectionHead, {
				title: category.name,
				subtitle: `${rows.length} product${rows.length === 1 ? "" : "s"} available`,
				action: /* @__PURE__ */ jsxs("select", {
					value: sort,
					onChange: (e) => setSort(e.target.value),
					"aria-label": "Sort products",
					className: cx("rounded-[var(--st-radius-sm)] border bg-[var(--st-surface)] px-3 py-2 text-sm outline-none", borderc),
					children: [
						/* @__PURE__ */ jsx("option", {
							value: "new",
							children: "Newest first"
						}),
						/* @__PURE__ */ jsx("option", {
							value: "low",
							children: "Price: low to high"
						}),
						/* @__PURE__ */ jsx("option", {
							value: "high",
							children: "Price: high to low"
						})
					]
				})
			}),
			rows.length ? /* @__PURE__ */ jsx(ProductGrid, { listings: rows }) : /* @__PURE__ */ jsx(EmptyState, {
				title: "No products here yet",
				hint: "Check another collection."
			}),
			/* @__PURE__ */ jsx("div", {
				className: cx("mt-10 text-center text-sm", muted),
				children: /* @__PURE__ */ jsx(Link, {
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
