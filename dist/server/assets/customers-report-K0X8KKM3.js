import { r as supabase } from "./client-CdRSQB5v.js";
import { t as EmptyState } from "./ui-kit-D-uo76H8.js";
import { _ as toCsv, a as downloadCsv } from "./finance-report-Dwy2dA23.js";
import { t as SearchableSelect } from "./searchable-select-CJDs5oIk.js";
import { s as sharedLoad } from "./bootstrap-mAz5ZP06.js";
import { useEffect, useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { FileSpreadsheet, FileText, Loader2, MessageCircle, Phone, Search } from "lucide-react";
//#region src/components/customers-report.tsx
var DELIVERED = /* @__PURE__ */ new Set(["delivered", "partial"]);
var LOST = /* @__PURE__ */ new Set(["returned", "cancelled"]);
function normalizePhone(p) {
	return (p || "").replace(/[^0-9]/g, "").replace(/^88/, "");
}
function useCustomers(resellerId) {
	const [rows, setRows] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		let cancelled = false;
		(async () => {
			setLoading(true);
			const load = () => {
				let q = supabase.from("orders").select("id, reseller_id, customer_name, customer_phone, customer_email, address_line, city, area, status, total, received_amount, created_at").order("created_at", { ascending: false }).limit(5e3);
				if (resellerId) q = q.eq("reseller_id", resellerId);
				return Promise.resolve(q).then((r) => ({
					data: r.data,
					error: r.error
				}));
			};
			const { data, error } = await sharedLoad(`customers:${resellerId ?? "all"}`, load);
			if (cancelled) return;
			if (error) toast.error(error.message);
			setRows(data ?? []);
			setLoading(false);
		})();
		return () => {
			cancelled = true;
		};
	}, [resellerId]);
	return {
		customers: useMemo(() => {
			const map = /* @__PURE__ */ new Map();
			for (const o of rows) {
				const key = normalizePhone(o.customer_phone) || o.customer_phone;
				const c = map.get(key) ?? {
					phone: o.customer_phone,
					name: o.customer_name,
					email: o.customer_email,
					address: o.address_line,
					city: o.city ?? "",
					area: o.area,
					orders: 0,
					delivered: 0,
					returned: 0,
					pending: 0,
					spent: 0,
					paid: 0,
					firstAt: o.created_at,
					lastAt: o.created_at,
					resellerIds: []
				};
				c.orders += 1;
				if (DELIVERED.has(o.status)) c.delivered += 1;
				else if (LOST.has(o.status)) c.returned += 1;
				else c.pending += 1;
				c.spent += Number(o.total ?? 0);
				if (DELIVERED.has(o.status)) c.paid += Number(o.received_amount ?? o.total ?? 0);
				if (o.created_at > c.lastAt) {
					c.lastAt = o.created_at;
					c.name = o.customer_name;
					c.address = o.address_line;
					c.city = o.city ?? "";
					c.area = o.area;
					c.email = o.customer_email ?? c.email;
				}
				if (o.created_at < c.firstAt) c.firstAt = o.created_at;
				if (o.reseller_id && !c.resellerIds.includes(o.reseller_id)) c.resellerIds.push(o.reseller_id);
				map.set(key, c);
			}
			return Array.from(map.values()).sort((a, b) => a.lastAt < b.lastAt ? 1 : -1);
		}, [rows]),
		loading
	};
}
var bdt = (n) => `৳${Math.round(n).toLocaleString("en-US")}`;
var day = (s) => !s || isNaN(new Date(s).getTime()) ? "—" : new Date(s).toLocaleDateString("en-GB", {
	day: "2-digit",
	month: "short",
	year: "numeric"
});
var HEADERS = [
	"Name",
	"Phone",
	"Email",
	"Address",
	"City",
	"Area",
	"Total orders",
	"Delivered",
	"Returned/Cancelled",
	"Running",
	"Order value",
	"Received",
	"First order",
	"Last order",
	"Store"
];
function CustomersReport({ resellerId, resellerNames, showStore = false, allowExport = false }) {
	const { customers, loading } = useCustomers(resellerId);
	const [q, setQ] = useState("");
	const [bucket, setBucket] = useState("all");
	const [store, setStore] = useState("");
	const storeLabel = (c) => c.resellerIds.map((id) => resellerNames?.get(id) ?? "—").join(", ") || "Admin";
	const filtered = useMemo(() => {
		const term = q.trim().toLowerCase();
		return customers.filter((c) => {
			if (store && !c.resellerIds.includes(store)) return false;
			if (bucket === "repeat" && c.orders < 2) return false;
			if (bucket === "new" && c.orders !== 1) return false;
			if (bucket === "delivered" && c.delivered === 0) return false;
			if (bucket === "returned" && c.returned === 0) return false;
			if (!term) return true;
			return c.name.toLowerCase().includes(term) || c.phone.includes(term) || normalizePhone(c.phone).includes(normalizePhone(term)) || (c.email ?? "").toLowerCase().includes(term) || c.city.toLowerCase().includes(term) || c.address.toLowerCase().includes(term);
		});
	}, [
		customers,
		q,
		bucket,
		store
	]);
	const body = () => filtered.map((c) => [
		c.name,
		c.phone,
		c.email ?? "",
		c.address,
		c.city,
		c.area === "inside_dhaka" ? "Inside Dhaka" : c.area === "sub_dhaka" ? "Sub Dhaka" : "Outside Dhaka",
		c.orders,
		c.delivered,
		c.returned,
		c.pending,
		Math.round(c.spent),
		Math.round(c.paid),
		day(c.firstAt),
		day(c.lastAt),
		storeLabel(c)
	]);
	async function exportExcel() {
		const XLSX = await import("xlsx");
		const ws = XLSX.utils.aoa_to_sheet([HEADERS, ...body()]);
		ws["!cols"] = HEADERS.map((h) => ({ wch: Math.max(12, Math.min(38, h.length + 6)) }));
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Customers");
		XLSX.writeFile(wb, `customers-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.xlsx`);
		toast.success(`${filtered.length} customer exported`);
	}
	const totals = useMemo(() => ({
		people: filtered.length,
		repeat: filtered.filter((c) => c.orders > 1).length,
		value: filtered.reduce((s, c) => s + c.spent, 0),
		received: filtered.reduce((s, c) => s + c.paid, 0)
	}), [filtered]);
	if (loading) return /* @__PURE__ */ jsx("div", {
		className: "grid place-items-center py-16",
		children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
				children: [
					{
						label: "Customers",
						value: totals.people.toLocaleString()
					},
					{
						label: "Repeat buyers",
						value: totals.repeat.toLocaleString()
					},
					{
						label: "Order value",
						value: bdt(totals.value)
					},
					{
						label: "Received (delivered)",
						value: bdt(totals.received)
					}
				].map((s) => /* @__PURE__ */ jsxs("div", {
					className: "surface-card p-3",
					children: [/* @__PURE__ */ jsx("div", {
						className: "text-[11px] font-medium text-muted-foreground",
						children: s.label
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-0.5 text-lg font-bold",
						children: s.value
					})]
				}, s.label))
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "surface-card flex flex-wrap items-end gap-2 p-3",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "relative min-w-[200px] flex-1",
						children: [/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx("input", {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Name, phone, city, address…",
							className: "w-full rounded-md border bg-background py-2 pl-8 pr-3 text-sm"
						})]
					}),
					/* @__PURE__ */ jsx(SearchableSelect, {
						label: "Type",
						value: bucket,
						onChange: setBucket,
						options: [
							{
								value: "all",
								label: "All customers"
							},
							{
								value: "new",
								label: "Single order"
							},
							{
								value: "repeat",
								label: "Repeat buyers"
							},
							{
								value: "delivered",
								label: "Has delivered order"
							},
							{
								value: "returned",
								label: "Has return/cancel"
							}
						],
						className: "w-48"
					}),
					showStore && resellerNames && /* @__PURE__ */ jsx(SearchableSelect, {
						label: "Store",
						value: store,
						onChange: setStore,
						placeholder: "All stores",
						options: Array.from(resellerNames.entries()).map(([id, label]) => ({
							value: id,
							label
						})),
						className: "w-56"
					}),
					allowExport && /* @__PURE__ */ jsxs("div", {
						className: "ml-auto flex items-center gap-2",
						children: [/* @__PURE__ */ jsxs("button", {
							onClick: exportExcel,
							className: "btn-brand inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium",
							children: [/* @__PURE__ */ jsx(FileSpreadsheet, { className: "h-4 w-4" }), " Excel"]
						}), /* @__PURE__ */ jsxs("button", {
							onClick: () => downloadCsv("customers.csv", toCsv(HEADERS, body())),
							className: "inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm hover:bg-muted",
							children: [/* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }), " CSV"]
						})]
					})
				]
			}),
			filtered.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {
				title: "No customers yet",
				description: "Customers appear here automatically once orders start coming in."
			}) : /* @__PURE__ */ jsx("div", {
				className: "surface-card overflow-x-auto",
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full min-w-[900px] text-sm",
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
						className: "border-b bg-muted/40 text-left text-[11px] uppercase tracking-wide text-muted-foreground",
						children: [
							/* @__PURE__ */ jsx("th", {
								className: "px-3 py-2 font-semibold",
								children: "Customer"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-3 py-2 font-semibold",
								children: "Location"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-3 py-2 text-center font-semibold",
								children: "Orders"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-3 py-2 text-right font-semibold",
								children: "Order value"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-3 py-2 text-right font-semibold",
								children: "Received"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-3 py-2 font-semibold",
								children: "Last order"
							}),
							showStore && /* @__PURE__ */ jsx("th", {
								className: "px-3 py-2 font-semibold",
								children: "Store"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-3 py-2 text-right font-semibold",
								children: "Contact"
							})
						]
					}) }), /* @__PURE__ */ jsx("tbody", { children: filtered.map((c) => /* @__PURE__ */ jsxs("tr", {
						className: "border-b last:border-0 hover:bg-muted/30",
						children: [
							/* @__PURE__ */ jsxs("td", {
								className: "px-3 py-2",
								children: [/* @__PURE__ */ jsx("div", {
									className: "font-medium",
									children: c.name
								}), /* @__PURE__ */ jsx("div", {
									className: "text-xs text-muted-foreground",
									children: c.phone
								})]
							}),
							/* @__PURE__ */ jsxs("td", {
								className: "max-w-[240px] px-3 py-2 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ jsx("div", {
									className: "truncate",
									children: c.address
								}), /* @__PURE__ */ jsxs("div", { children: [c.city ? `${c.city} · ` : "", c.area === "inside_dhaka" ? "Inside Dhaka" : c.area === "sub_dhaka" ? "Sub Dhaka" : "Outside Dhaka"] })]
							}),
							/* @__PURE__ */ jsxs("td", {
								className: "px-3 py-2 text-center",
								children: [/* @__PURE__ */ jsx("div", {
									className: "font-semibold",
									children: c.orders
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-[11px] text-muted-foreground",
									children: [
										/* @__PURE__ */ jsxs("span", {
											className: "text-success",
											children: [c.delivered, "D"]
										}),
										" · ",
										/* @__PURE__ */ jsxs("span", {
											className: "text-destructive",
											children: [c.returned, "R"]
										}),
										" ·",
										" ",
										c.pending,
										"P"
									]
								})]
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-3 py-2 text-right font-medium",
								children: bdt(c.spent)
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-3 py-2 text-right",
								children: bdt(c.paid)
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-3 py-2 text-xs",
								children: day(c.lastAt)
							}),
							showStore && /* @__PURE__ */ jsx("td", {
								className: "px-3 py-2 text-xs",
								children: storeLabel(c)
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-3 py-2",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-end gap-1.5",
									children: [/* @__PURE__ */ jsx("a", {
										href: `tel:${c.phone}`,
										className: "rounded-md border p-1.5 text-muted-foreground hover:bg-muted",
										"aria-label": "Call customer",
										children: /* @__PURE__ */ jsx(Phone, { className: "h-3.5 w-3.5" })
									}), /* @__PURE__ */ jsx("a", {
										href: `https://wa.me/${normalizePhone(c.phone).replace(/^0/, "88")}`,
										target: "_blank",
										rel: "noreferrer",
										className: "rounded-md border p-1.5 text-muted-foreground hover:bg-muted",
										"aria-label": "WhatsApp customer",
										children: /* @__PURE__ */ jsx(MessageCircle, { className: "h-3.5 w-3.5" })
									})]
								})
							})
						]
					}, c.phone)) })]
				})
			})
		]
	});
}
//#endregion
export { CustomersReport as t };
