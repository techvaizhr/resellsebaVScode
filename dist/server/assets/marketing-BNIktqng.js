import { r as supabase } from "./client-Be051lUg.js";
import { r as getMyReseller } from "./app-data-CzwvE8w8.js";
import { n as PageHeader } from "./ui-kit-D-uo76H8.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Facebook, LineChart, Loader2, Zap } from "lucide-react";
//#region src/routes/_authenticated/reseller/marketing.tsx?tsr-split=component
var DEFAULTS = [
	{
		platform: "facebook",
		is_active: false,
		pixel_id: "",
		access_token: "",
		test_event_code: ""
	},
	{
		platform: "tiktok",
		is_active: false,
		pixel_id: "",
		access_token: "",
		test_event_code: ""
	},
	{
		platform: "ga4",
		is_active: false,
		pixel_id: "",
		access_token: "",
		test_event_code: ""
	}
];
function ResellerMarketing() {
	const [rows, setRows] = useState(DEFAULTS);
	const [resellerId, setResellerId] = useState(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		load();
	}, []);
	async function load() {
		setLoading(true);
		const { data: userData } = await supabase.auth.getUser();
		if (!userData.user) return;
		const rs = await getMyReseller(userData.user.id);
		if (!rs) {
			setLoading(false);
			return;
		}
		setResellerId(rs.id);
		const { data } = await supabase.from("marketing_configs").select("*").eq("reseller_id", rs.id);
		const map = new Map((data ?? []).map((r) => [r.platform, r]));
		setRows(DEFAULTS.map((d) => {
			const f = map.get(d.platform);
			return f ? {
				id: f.id,
				platform: d.platform,
				is_active: f.is_active,
				pixel_id: f.pixel_id ?? "",
				access_token: f.access_token ?? "",
				test_event_code: f.test_event_code ?? ""
			} : d;
		}));
		setLoading(false);
	}
	async function save(r) {
		if (!resellerId) return;
		const payload = {
			platform: r.platform,
			is_active: r.is_active,
			pixel_id: r.pixel_id || null,
			access_token: r.access_token || null,
			test_event_code: r.test_event_code || null,
			reseller_id: resellerId
		};
		const { error } = r.id ? await supabase.from("marketing_configs").update(payload).eq("id", r.id) : await supabase.from("marketing_configs").insert(payload);
		if (error) toast.error(error.message);
		else {
			toast.success("Saved");
			load();
		}
	}
	if (loading) return /* @__PURE__ */ jsx("div", {
		className: "grid place-items-center py-12",
		children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	const meta = {
		facebook: {
			icon: /* @__PURE__ */ jsx(Facebook, { className: "h-4 w-4" }),
			name: "Facebook Pixel + CAPI",
			pixelLabel: "Pixel ID"
		},
		tiktok: {
			icon: /* @__PURE__ */ jsx(Zap, { className: "h-4 w-4" }),
			name: "TikTok Events API",
			pixelLabel: "Pixel ID"
		},
		ga4: {
			icon: /* @__PURE__ */ jsx(LineChart, { className: "h-4 w-4" }),
			name: "Google Analytics 4",
			pixelLabel: "Measurement ID"
		}
	};
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Marketing & tracking",
		description: "Add your Pixel and Access Token — customer events go to your ads account."
	}), /* @__PURE__ */ jsx("div", {
		className: "grid gap-4 lg:grid-cols-3",
		children: rows.map((r, idx) => {
			const m = meta[r.platform];
			return /* @__PURE__ */ jsxs("div", {
				className: "surface-card p-5",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "mb-3 flex items-center gap-2",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "grid h-9 w-9 place-items-center rounded-md bg-primary-soft text-primary",
								children: m.icon
							}),
							/* @__PURE__ */ jsx("div", {
								className: "flex-1 font-semibold",
								children: m.name
							}),
							/* @__PURE__ */ jsxs("label", {
								className: "inline-flex items-center gap-2 text-xs",
								children: [/* @__PURE__ */ jsx("input", {
									type: "checkbox",
									checked: r.is_active,
									onChange: (e) => {
										const c = [...rows];
										c[idx] = {
											...r,
											is_active: e.target.checked
										};
										setRows(c);
									}
								}), " Active"]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ jsx(Field, {
								label: m.pixelLabel,
								children: /* @__PURE__ */ jsx("input", {
									value: r.pixel_id,
									onChange: (e) => {
										const c = [...rows];
										c[idx] = {
											...r,
											pixel_id: e.target.value
										};
										setRows(c);
									},
									className: inp
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Access Token / API Secret",
								children: /* @__PURE__ */ jsx("input", {
									type: "password",
									value: r.access_token,
									onChange: (e) => {
										const c = [...rows];
										c[idx] = {
											...r,
											access_token: e.target.value
										};
										setRows(c);
									},
									className: inp
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Test Event Code (optional)",
								children: /* @__PURE__ */ jsx("input", {
									value: r.test_event_code,
									onChange: (e) => {
										const c = [...rows];
										c[idx] = {
											...r,
											test_event_code: e.target.value
										};
										setRows(c);
									},
									className: inp
								})
							})
						]
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: () => save(r),
						className: "btn-brand mt-4 rounded-md px-3 py-1.5 text-xs font-medium",
						children: "Save"
					})
				]
			}, r.platform);
		})
	})] });
}
var inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
function Field({ label, children }) {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
		className: "mb-1 block text-xs font-medium",
		children: label
	}), children] });
}
//#endregion
export { ResellerMarketing as component };
