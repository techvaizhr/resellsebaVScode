import { n as DropdownMenuContent, o as DropdownMenuTrigger, t as DropdownMenu } from "./dropdown-menu-BtjXROHi.js";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { ChevronLeft, ChevronRight, MoreHorizontal, MoreVertical } from "lucide-react";
//#region src/components/data-list.tsx
function DataToolbar({ search, onSearch, searchPlaceholder = "Search…", filters = [], perPage, onPerPage, perPageOptions = [
	10,
	20,
	50,
	100
], right }) {
	const searchInput = /* @__PURE__ */ jsx("input", {
		value: search,
		onChange: (e) => onSearch(e.target.value),
		placeholder: searchPlaceholder,
		className: "w-full min-w-0 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
	});
	const perPageSelect = /* @__PURE__ */ jsxs("select", {
		value: perPage,
		onChange: (e) => onPerPage(Number(e.target.value)),
		className: "shrink-0 rounded-md border bg-background px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-ring",
		title: "Per page",
		children: [perPageOptions.map((n) => /* @__PURE__ */ jsxs("option", {
			value: n,
			children: [n, " / page"]
		}, n)), /* @__PURE__ */ jsx("option", {
			value: -1,
			children: "All"
		})]
	});
	const filterSelects = filters.map((f) => /* @__PURE__ */ jsxs("select", {
		value: f.value,
		onChange: (e) => f.onChange(e.target.value),
		className: "w-full rounded-md border bg-background px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-ring",
		title: f.label,
		children: [/* @__PURE__ */ jsxs("option", {
			value: "",
			children: [f.label, ": All"]
		}), f.options.map((o) => /* @__PURE__ */ jsx("option", {
			value: o.value,
			children: o.label
		}, o.value))]
	}, f.key));
	return /* @__PURE__ */ jsxs("div", {
		className: "mb-4 space-y-2",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2",
			children: [searchInput, /* @__PURE__ */ jsxs("div", {
				className: "flex shrink-0 items-center gap-2",
				children: [perPageSelect, right]
			})]
		}), filters.length > 0 && /* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6",
			children: filterSelects
		})]
	});
}
function pageWindow(page, pages) {
	if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
	const half = 1;
	let start = Math.max(1, page - half);
	let end = Math.min(pages, page + half);
	if (end - start + 1 < 3) {
		if (start === 1) end = Math.min(pages, start + 2);
		else if (end === pages) start = Math.max(1, end - 2);
	}
	const out = [];
	if (start > 1) out.push(1);
	if (start > 2) out.push("…");
	for (let i = start; i <= end; i++) out.push(i);
	if (end < pages - 1) out.push("…");
	if (end < pages) out.push(pages);
	return out;
}
function Pagination({ page, perPage, total, onPage }) {
	const showAll = perPage <= 0;
	const pages = Math.max(1, Math.ceil(total / (showAll ? Math.max(total, 1) : perPage)));
	const from = total === 0 ? 0 : showAll ? 1 : (page - 1) * perPage + 1;
	const to = showAll ? total : Math.min(page * perPage, total);
	const [goTo, setGoTo] = useState("");
	const current = Math.min(Math.max(1, page), pages);
	const go = (p) => onPage(Math.min(pages, Math.max(1, p)));
	const submitGoTo = () => {
		const n = Number.parseInt(goTo, 10);
		if (Number.isFinite(n)) go(n);
		setGoTo("");
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "mt-3 flex flex-nowrap items-center justify-between gap-1.5 text-xs text-muted-foreground",
		children: [/* @__PURE__ */ jsxs("span", {
			className: "whitespace-nowrap",
			children: [
				from,
				"–",
				to,
				" of ",
				total
			]
		}), !showAll && pages > 1 && /* @__PURE__ */ jsxs("div", {
			className: "flex flex-nowrap items-center gap-0.5",
			children: [
				/* @__PURE__ */ jsx("button", {
					onClick: () => go(current - 1),
					disabled: current <= 1,
					title: "Previous",
					className: "inline-flex h-6 shrink-0 items-center rounded border px-1 disabled:opacity-40",
					children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-3 w-3" })
				}),
				pageWindow(current, pages).map((p, i) => p === "…" ? /* @__PURE__ */ jsx("span", {
					className: "px-0.5 text-muted-foreground",
					children: "…"
				}, `gap-${i}`) : /* @__PURE__ */ jsx("button", {
					onClick: () => go(p),
					"aria-current": p === current ? "page" : void 0,
					className: p === current ? "inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded border border-primary bg-primary px-1 text-[11px] font-medium text-primary-foreground" : "inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded border px-1 text-[11px] hover:bg-muted",
					children: p
				}, p)),
				/* @__PURE__ */ jsx("button", {
					onClick: () => go(current + 1),
					disabled: current >= pages,
					title: "Next",
					className: "inline-flex h-6 shrink-0 items-center rounded border px-1 disabled:opacity-40",
					children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-3 w-3" })
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-nowrap items-center gap-0.5 pl-1",
					children: [/* @__PURE__ */ jsx("input", {
						type: "number",
						min: 1,
						max: pages,
						value: goTo,
						onChange: (e) => setGoTo(e.target.value),
						onKeyDown: (e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								submitGoTo();
							}
						},
						placeholder: String(current),
						"aria-label": "Go to page",
						className: "h-6 w-9 shrink-0 rounded border bg-background px-1 text-center text-[11px] text-foreground"
					}), /* @__PURE__ */ jsx("button", {
						onClick: submitGoTo,
						disabled: !goTo,
						className: "inline-flex h-6 shrink-0 items-center rounded border px-1 text-[11px] hover:bg-muted disabled:opacity-40",
						children: "Go"
					})]
				})
			]
		})]
	});
}
function ActionMenu({ children, vertical = false }) {
	return /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ jsx("button", {
			className: "rounded-md p-2 text-muted-foreground hover:bg-muted",
			title: "Actions",
			children: /* @__PURE__ */ jsx(vertical ? MoreVertical : MoreHorizontal, { className: "h-4 w-4" })
		})
	}), /* @__PURE__ */ jsx(DropdownMenuContent, {
		align: "end",
		className: "min-w-[160px]",
		children
	})] });
}
function usePaginated(items, page, perPage) {
	if (perPage <= 0) return items;
	const start = (page - 1) * perPage;
	return items.slice(start, start + perPage);
}
//#endregion
export { usePaginated as i, DataToolbar as n, Pagination as r, ActionMenu as t };
