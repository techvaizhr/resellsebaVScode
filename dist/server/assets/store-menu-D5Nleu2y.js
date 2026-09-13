import { r as supabase } from "./client-CLBrUPi_.js";
function buildMenuTree(rows) {
	const map = /* @__PURE__ */ new Map();
	rows.forEach((r) => map.set(r.id, {
		...r,
		children: []
	}));
	const roots = [];
	rows.forEach((r) => {
		const node = map.get(r.id);
		const parent = r.parent_id ? map.get(r.parent_id) : null;
		if (parent) parent.children.push(node);
		else roots.push(node);
	});
	const sort = (list) => {
		list.sort((a, b) => a.sort_order - b.sort_order);
		list.forEach((n) => sort(n.children));
	};
	sort(roots);
	return roots;
}
/** Tree -> flat (depth) list used by the builder UI. */
function flattenMenu(nodes, depth = 0) {
	const out = [];
	nodes.forEach((n) => {
		const { children, ...row } = n;
		out.push({
			...row,
			depth
		});
		out.push(...flattenMenu(children, depth + 1));
	});
	return out;
}
/** Flat (depth) list -> rows with parent_id + sort_order, ready to persist. */
function unflattenMenu(items) {
	const stack = [];
	const counters = /* @__PURE__ */ new Map();
	return items.map((item) => {
		stack.length = item.depth;
		const parent_id = item.depth > 0 ? stack[item.depth - 1] ?? null : null;
		stack[item.depth] = item.id;
		const key = parent_id ?? "root";
		const next = (counters.get(key) ?? 0) + 1;
		counters.set(key, next);
		const { depth: _depth, ...row } = item;
		return {
			...row,
			parent_id,
			sort_order: next
		};
	});
}
/** First item is always a root; nothing may skip more than one level. */
function normalizeDepths(items) {
	let prev = -1;
	return items.map((item) => {
		const depth = Math.min(Math.max(0, item.depth), prev + 1, 2);
		prev = depth;
		return item.depth === depth ? item : {
			...item,
			depth
		};
	});
}
/** Item + everything nested under it (contiguous deeper rows). */
function subtreeSize(items, index) {
	const base = items[index]?.depth ?? 0;
	let n = 1;
	while (index + n < items.length && items[index + n].depth > base) n++;
	return n;
}
function moveMenuItem(items, from, to) {
	const size = subtreeSize(items, from);
	if (to >= from && to <= from + size) return items;
	const block = items.slice(from, from + size);
	const rest = [...items.slice(0, from), ...items.slice(from + size)];
	const target = to > from ? to - size : to;
	rest.splice(Math.max(0, Math.min(rest.length, target)), 0, ...block);
	return normalizeDepths(rest);
}
function shiftMenuItem(items, index, delta) {
	const size = subtreeSize(items, index);
	const current = items[index];
	const prev = items[index - 1];
	const nextDepth = current.depth + delta;
	if (nextDepth < 0 || nextDepth > 2) return items;
	if (delta === 1 && (!prev || nextDepth > prev.depth + 1)) return items;
	const copy = [...items];
	for (let i = index; i < index + size; i++) copy[i] = {
		...copy[i],
		depth: copy[i].depth + delta
	};
	return normalizeDepths(copy);
}
function newMenuItem(partial) {
	return {
		id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
		parent_id: null,
		ref_slug: null,
		url: null,
		image_url: null,
		description: null,
		open_new_tab: false,
		layout: "dropdown",
		sort_order: 0,
		is_active: true,
		depth: 0,
		...partial
	};
}
var COLUMNS = "id,parent_id,label,kind,ref_slug,url,image_url,description,open_new_tab,layout,sort_order,is_active";
async function fetchMenuRows(resellerId, activeOnly) {
	let q = supabase.from("reseller_menu_items").select(COLUMNS).eq("reseller_id", resellerId).order("sort_order", { ascending: true });
	if (activeOnly) q = q.eq("is_active", true);
	const { data } = await q;
	return data ?? [];
}
/** Replaces the whole menu: safe because nothing else references these rows. */
async function saveMenuRows(resellerId, items) {
	const rows = unflattenMenu(normalizeDepths(items));
	const del = await supabase.from("reseller_menu_items").delete().eq("reseller_id", resellerId);
	if (del.error) throw del.error;
	const byDepth = /* @__PURE__ */ new Map();
	normalizeDepths(items).forEach((item, i) => {
		const list = byDepth.get(item.depth) ?? [];
		list.push(rows[i]);
		byDepth.set(item.depth, list);
	});
	for (const depth of [...byDepth.keys()].sort((a, b) => a - b)) {
		const batch = (byDepth.get(depth) ?? []).map((r) => ({
			...r,
			reseller_id: resellerId
		}));
		if (!batch.length) continue;
		const { error } = await supabase.from("reseller_menu_items").insert(batch);
		if (error) throw error;
	}
}
function menuTarget(row, code) {
	switch (row.kind) {
		case "home":
		case "all_products": return {
			kind: "route",
			to: "/s/$code",
			params: { code }
		};
		case "category": return row.ref_slug ? {
			kind: "route-slug",
			to: "/s/$code/c/$slug",
			params: {
				code,
				slug: row.ref_slug
			}
		} : { kind: "none" };
		case "product": return row.ref_slug ? {
			kind: "route-slug",
			to: "/s/$code/p/$slug",
			params: {
				code,
				slug: row.ref_slug
			}
		} : { kind: "none" };
		default: {
			const url = row.url?.trim();
			if (!url) return { kind: "none" };
			if (/^https?:\/\//i.test(url) || url.startsWith("tel:") || url.startsWith("mailto:")) return {
				kind: "external",
				href: url
			};
			return {
				kind: "external",
				href: url.startsWith("/") ? url : `/${url}`
			};
		}
	}
}
//#endregion
export { moveMenuItem as a, shiftMenuItem as c, menuTarget as i, subtreeSize as l, fetchMenuRows as n, newMenuItem as o, flattenMenu as r, saveMenuRows as s, buildMenuTree as t };
