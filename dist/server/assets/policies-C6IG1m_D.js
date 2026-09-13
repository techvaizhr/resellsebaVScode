import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { t as Link } from "./link-BijU1MeZ.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { F as pointsToText, N as fetchAllPolicies, P as pointsFromText, r as supabase } from "./client-DdbbmuGT.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { D as Sparkles, G as Save, Mt as LoaderCircle, Rn as CirclePlus, U as ScrollText, Vn as CircleCheck, _n as ExternalLink, et as Plus, gn as EyeOff, hn as Eye, st as Pen, v as Trash2 } from "./vendor-icons-BWIzFOtW.js";
import { t as cn } from "./utils-UzdMQEyF.js";
import { n as PageHeader } from "./ui-kit-QFWJ0cl0.js";
import { t as AppModal } from "./AppModal-Cs8dgOpL.js";
//#region src/routes/_authenticated/admin/policies.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMPTY_FORM = {
	id: null,
	title: "",
	summary: "",
	points: [""],
	sort_order: 1,
	is_active: true
};
var PRESET_TEMPLATES = [
	{
		title: "ডেলিভারি চার্জ",
		summary: "প্রতিটি অর্ডারে ডেলিভারি চার্জ কীভাবে নির্ধারণ হয়।",
		points: [
			"ডিফল্ট ডেলিভারি রুল: সাধারণ ডেলিভারি চার্জ এলাকা অনুযায়ী (Inside Dhaka / Sub Dhaka / Outside Dhaka) নির্ধারিত হবে।",
			"বিশেষ প্রোডাক্ট বা অফার: কিছু প্রোডাক্টে নির্দিষ্ট ডেলিভারি চার্জ বা ফ্রি-শিপিং প্রযোজ্য হতে পারে। অ্যাডমিন ফ্রি-শিপিং দিলে কোনো ডেলিভারি চার্জ লাগবে না।",
			"ফ্লেক্সিবল ডেলিভারি চার্জ: রিসেলার চাইলে প্রফিট মার্জিন হিসাব করে কাস্টমার থেকে ডেলিভারি চার্জ কম-বেশি বা ফ্রি করতে পারেন।",
			"হিসাবের নিয়ম: সিস্টেম থেকে শুধু নির্ধারিত চার্জটিই (যেমন: ৬০ টাকা) কাটা হবে। কাস্টমারের থেকে বেশি চার্জ নিলে (যেমন: ১০০ টাকা) বাড়তি ৪০ টাকা রিসেলারের অতিরিক্ত প্রফিট হবে; আবার ডেলিভারি ফ্রি দিলে সেই অনুযায়ী প্রফিট কমবে।",
			"চার্জ পরিবর্তন: বিশেষ প্রয়োজনে অ্যাডমিন ডেলিভারি চার্জ পরিবর্তন করতে পারেন, যা প্রোডাক্ট নোটে জানিয়ে দেওয়া হবে।"
		]
	},
	{
		title: "প্রফিট হিসাব",
		summary: "একটি অর্ডারে আপনার প্রফিট কীভাবে হিসাব হয়।",
		points: [
			"প্রফিট = কাস্টমারের কাছ থেকে প্রাপ্ত টাকা - প্রোডাক্ট খরচ - ডেলিভারি খরচ - প্যাকেজিং খরচ।",
			"উদাহরণঃ ১০০০-৫০০-১০০-২০=৩৮০ টাকা প্রফিট",
			"প্রোডাক্ট খরচ হলো কাস্টমার যে প্রোডাক্টগুলো রেখেছে সেগুলোর অ্যাডমিন (রিসেলার) প্রাইস।",
			"প্যাকেজিং খরচ প্রোডাক্ট সেটিংস থেকে আসে এবং প্রতি অর্ডারে যোগ হয়।",
			"আপনি যে ডিস্কাউন্ট দেন তা আপনার নিজের প্রফিট থেকে কাটা হয়, অ্যাডমিন প্রাইস থেকে নয়।",
			"অর্ডার সেটেল (delivered / partial / returned) না হওয়া পর্যন্ত প্রফিট চূড়ান্ত হয় না।"
		]
	},
	{
		title: "ডেলিভারি ব্যর্থ বা রিটার্ন",
		summary: "পার্সেল ফিরে এলে কী হয়।",
		points: [
			"পার্সেল সম্পূর্ণ রিটার্ন হলে কাস্টমারের কাছ থেকে কোনো টাকা পাওয়া যায় না।",
			"তবুও সেই অর্ডারের ডেলিভারি (রিটার্ন) চার্জ ও প্যাকেজিং খরচ আপনাকে বহন করতে হবে।",
			"অর্থাৎ রিটার্ন অর্ডারে লোকসান = ডেলিভারি + প্যাকেজিং।",
			"বারবার ফেক বা উদাসীন অর্ডার হলে অ্যাকাউন্টে সীমাবদ্ধতা আসতে পারে।"
		]
	},
	{
		title: "আংশিক ডেলিভারি",
		summary: "কাস্টমার অর্ডারের অংশ রাখলে যা হয়।",
		points: [
			"অ্যাডমিন কাস্টমারের কাছ থেকে প্রাপ্ত প্রকৃত টাকার পরিমাণ record করেন।",
			"ফুল-আইটেম পারশাল: কাস্টমার সব প্রোডাক্ট রাখে কিন্তু কম বা বেশি টাকা দেয়; পুরো খরচ প্রযোজ্য থাকে।",
			"আইটেম পারশাল: শুধু রাখা প্রোডাক্টের টাকা ধরা হয়; ফেরত প্রোডাক্ট স্টকে ফিরে যায়।",
			"ডেলিভারি-অনলি পারশাল: কাস্টমার শুধু ডেলিভারি চার্জ দেয় এবং সব প্রোডাক্ট ফেরত দেয়।",
			"প্রতিটি পারশালে প্রফিট = প্রাপ্ত টাকা - প্রযোজ্য খরচ।"
		]
	},
	{
		title: "অর্ডার ফ্লো ও স্ট্যাটাস",
		summary: "কে কী পরিবর্তন করতে পারবেন এবং কখন।",
		points: [
			"অর্ডার Pending থাকা অবস্থায় আপনি তৈরি, এডিট, ডিলিট ও স্ট্যাটাস পরিবর্তন করতে পারবেন।",
			"Send to admin করার পর অর্ডারটি আপনার জন্য লক হয়ে যায় এবং অ্যাডমিন যাচাই শুরু হয়।",
			"অ্যাডমিন অর্ডারটি Confirmed, Packaging, Ready to ship ও Courier booking ধাপে এগিয়ে নেন।",
			"কুরিয়ার ওয়েবহুক Delivered, Partial ও Return স্ট্যাটাস স্বয়ংক্রিয়ভাবে আপডেট করে।",
			"চূড়ান্ত সেটেলমেন্ট (রিটার্ন রিসিভ, পারশাল টাইপ, ড্যামেজড) শুধু অ্যাডমিন করেন।"
		]
	},
	{
		title: "ড্যামেজড বা হারানো প্রোডাক্ট",
		summary: "প্রোডাক্ট ড্যামেজ হয়ে ফিরে এলে যা হয়।",
		points: [
			"ডেলিভারি, রিটার্ন বা পারশাল সেটেলমেন্টের পর অর্ডারটি Damaged চিহ্নিত করা যায়।",
			"কাস্টমারের কাছ থেকে যা সংগ্রহ হয়েছে তা প্রাপ্ত হিসেবে ধরা হয়।",
			"এই ক্ষেত্রে রিসেলার কে প্রোডাক্ট এর কোনো ক্ষতি পূরণ দিতে হবে না।"
		]
	},
	{
		title: "পেমেন্ট, ব্যালেন্স ও পেআউট",
		summary: "আপনার টাকা কীভাবে আসে-যায়।",
		points: [
			"অর্ডার সেটেল হওয়ার পরই প্রফিট আপনার ব্যালেন্সে যোগ হয়।",
			"রিটার্ন  অর্ডারের লোকসান একই ব্যালেন্স থেকে কাটা হয়।",
			"পেআউট রিকোয়েস্ট অ্যাডমিন রিভিউ করে আপনার সংরক্ষিত পেআউট মেথডে পেমেন্ট করা হয়।",
			"ফ্রোজন বা রিকোয়ার্ড ডিপোজিট অংশ উত্তোলনযোগ্য নয়।",
			"প্রতিটি ক্রেডিট ও ডেবিট Transactions রিপোর্টে দেখা যায়।"
		]
	},
	{
		title: "সাবস্ক্রিপশন ও অ্যাক্সেস",
		summary: "প্ল্যান, ট্রায়াল ও গ্রেস পিরিয়ডের নিয়ম।",
		points: [
			"প্যানেল (এবং অন্তর্ভুক্ত থাকলে স্টোরফ্রন্ট) চালু রাখতে একটি প্ল্যান প্রয়োজন।",
			"সাবস্ক্রিপশন ফি আপনার আর্নিং থেকে কাটা যায় অথবা উপলভ্য পেমেন্ট মেথডে পরিশোধ করা যায়।",
			"ট্রায়াল পিরিয়ডে কোনো খরচ ছাড়াই পূর্ণ অ্যাক্সেস পাবেন।",
			"মেয়াদ শেষ হলে গ্রেস পিরিয়ড প্রযোজ্য হয়; গ্রেস শেষে অ্যাক্সেস সীমিত হয়ে যায়।"
		]
	},
	{
		title: "প্রোডাক্ট, প্রাইস ও স্টক",
		summary: "আপনার স্টোরের ক্যাটালগ নিয়ম।",
		points: [
			"বিক্রয় মূল্য আপনি নিজে ঠিক করবেন, তবে তা অ্যাডমিন প্রাইসের নিচে হতে পারবে না।",
			"লাইভ স্টক অনুযায়ী অর্ডার গৃহীত হয়; স্টক শেষ হলে প্রোডাক্ট স্টোর থেকে স্বয়ংক্রিয়ভাবে হাইড হয়।",
			"আপনার স্টোরে লিস্ট করা না থাকলেও যেকোনো অ্যাক্টিভ ক্যাটালগ প্রোডাক্টের অর্ডার তৈরি করতে পারবেন।",
			"প্রোডাক্টের ছবি ও বিবরণ শুধুমাত্র নিজের স্টোরের মার্কেটিংয়ে ব্যবহার করা যাবে।"
		]
	},
	{
		title: "অ্যাকাউন্ট ও নিরাপত্তা",
		summary: "আপনার অ্যাকাউন্ট নিরাপদ রাখার নিয়ম।",
		points: [
			"লগইন তথ্য গোপন রাখুন; আপনার অ্যাকাউন্টে হওয়া সব কাজের দায়িত্ব আপনার।",
			"ভুল বা ভুয়া তথ্য দিলে অ্যাকাউন্ট স্থগিত হতে পারে।",
			"প্ল্যাটফর্মের নিয়ম লঙ্ঘন করলে নোটিশ ছাড়াই অ্যাক্সেস বন্ধ হতে পারে।",
			"যেকোনো সমস্যায় সাপোর্টের সাথে যোগাযোগ করুন।"
		]
	}
];
function PoliciesAdmin() {
	const [policies, setPolicies] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [modalOpen, setModalOpen] = (0, import_react.useState)(false);
	const [formData, setFormData] = (0, import_react.useState)(EMPTY_FORM);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [bulkMode, setBulkMode] = (0, import_react.useState)(false);
	const [bulkText, setBulkText] = (0, import_react.useState)("");
	async function load() {
		setLoading(true);
		try {
			const list = await fetchAllPolicies();
			setPolicies(list);
		} catch (e) {
			toast.error(e.message ?? "Could not load policies");
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const openNewModal = () => {
		setFormData({
			...EMPTY_FORM,
			sort_order: (policies.length ? Math.max(...policies.map((p) => p.sort_order)) : 0) + 1
		});
		setBulkMode(false);
		setBulkText("");
		setModalOpen(true);
	};
	const openEditModal = (p) => {
		setFormData({
			id: p.id,
			title: p.title,
			summary: p.summary || "",
			points: p.points.length ? p.points : [""],
			sort_order: p.sort_order,
			is_active: p.is_active
		});
		setBulkMode(false);
		setBulkText(pointsToText(p.points));
		setModalOpen(true);
	};
	const applyTemplate = (template) => {
		setFormData((prev) => ({
			...prev,
			title: template.title,
			summary: template.summary,
			points: [...template.points]
		}));
		setBulkText(pointsToText(template.points));
		toast.success(`"${template.title}" টেমপ্লেট লোড হয়েছে!`);
	};
	const handlePointChange = (index, val) => {
		const updated = [...formData.points];
		updated[index] = val;
		setFormData({
			...formData,
			points: updated
		});
	};
	const addPoint = () => {
		setFormData({
			...formData,
			points: [...formData.points, ""]
		});
	};
	const removePoint = (index) => {
		if (formData.points.length <= 1) {
			setFormData({
				...formData,
				points: [""]
			});
			return;
		}
		const updated = formData.points.filter((_, i) => i !== index);
		setFormData({
			...formData,
			points: updated
		});
	};
	const toggleBulkMode = () => {
		if (!bulkMode) setBulkText(pointsToText(formData.points.filter((p) => p.trim() !== "")));
		else {
			const fromText = pointsFromText(bulkText);
			setFormData({
				...formData,
				points: fromText.length ? fromText : [""]
			});
		}
		setBulkMode(!bulkMode);
	};
	async function handleSave(e) {
		e.preventDefault();
		if (!formData.title.trim()) {
			toast.error("পলিসির শিরোনাম (Title) দিন");
			return;
		}
		const cleanPoints = bulkMode ? pointsFromText(bulkText) : formData.points.map((p) => p.trim()).filter(Boolean);
		if (cleanPoints.length === 0) {
			toast.error("অন্তত ১টি নিয়ম বা বুলেট পয়েন্ট যুক্ত করুন");
			return;
		}
		setBusy(true);
		const payload = {
			title: formData.title.trim(),
			summary: formData.summary.trim() || null,
			points: cleanPoints,
			sort_order: Number(formData.sort_order) || 1,
			is_active: formData.is_active,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		};
		try {
			if (formData.id) {
				const { error } = await supabase.from("reseller_policies").update(payload).eq("id", formData.id);
				if (error) throw error;
				toast.success("পলিসি সফলভাবে আপডেট হয়েছে!");
			} else {
				const { error } = await supabase.from("reseller_policies").insert(payload);
				if (error) throw error;
				toast.success("নতুন পলিসি সফলভাবে তৈরি হয়েছে!");
			}
			setModalOpen(false);
			await load();
		} catch (err) {
			toast.error(err.message || "পলিসি সংরক্ষণ করতে সমস্যা হয়েছে");
		} finally {
			setBusy(false);
		}
	}
	async function toggleActive(p) {
		try {
			const { error } = await supabase.from("reseller_policies").update({
				is_active: !p.is_active,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", p.id);
			if (error) throw error;
			setPolicies((prev) => prev.map((item) => item.id === p.id ? {
				...item,
				is_active: !item.is_active
			} : item));
			toast.success(p.is_active ? "পলিসি হাইড করা হয়েছে" : "পলিসি পাবলিশ করা হয়েছে");
		} catch (err) {
			toast.error(err.message || "Failed to update status");
		}
	}
	async function handleDelete(p) {
		if (!confirm(`"${p.title}" পলিসিটি মুছে ফেলতে চান?`)) return;
		try {
			const { error } = await supabase.from("reseller_policies").delete().eq("id", p.id);
			if (error) throw error;
			toast.success("পলিসি ডিলিট করা হয়েছে");
			setPolicies((prev) => prev.filter((item) => item.id !== p.id));
		} catch (err) {
			toast.error(err.message || "Failed to delete");
		}
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-[400px] place-items-center py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-6xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
					title: "Reseller Platform Policies",
					description: "রিসেলারদের জন্য প্ল্যাটফর্মের ডেলিভারি, উইথড্র ও রিটার্ন পলিসি ম্যানেজ করুন। এখানে যুক্ত করা পলিসিগুলো রিসেলার প্যানেলে স্বয়ংক্রিয়ভাবে প্রদর্শিত হবে।"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/reseller/policies",
						target: "_blank",
						className: "inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted shadow-2xs transition-all",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Reseller View" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: openNewModal,
						className: "btn-brand inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold shadow-md cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add New Policy" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card p-5 rounded-2xl border border-border/80 shadow-2xs flex flex-wrap items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollText, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-sm font-bold text-foreground",
						children: [
							"মোট পলিসি সেকশন: ",
							policies.length,
							"টি"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"সক্রিয় রয়েছে: ",
							policies.filter((p) => p.is_active).length,
							"টি"
						]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium text-muted-foreground",
						children: "রেডিমেড টেমপ্লেট:"
					}), PRESET_TEMPLATES.map((t, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setFormData({
								...EMPTY_FORM,
								title: t.title,
								summary: t.summary,
								points: [...t.points],
								sort_order: policies.length + 1
							});
							setBulkMode(false);
							setModalOpen(true);
						},
						className: "inline-flex items-center gap-1 rounded-lg border border-border/70 bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:border-primary/50 hover:text-primary transition-all shadow-2xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.title.split(" ")[0] })]
					}, idx))]
				})]
			}),
			policies.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card p-12 text-center rounded-2xl border border-dashed border-border/80",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary mx-auto mb-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollText, { className: "h-7 w-7" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-bold text-foreground",
						children: "কোনো পলিসি যুক্ত করা হয়নি"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-1 max-w-md mx-auto",
						children: "রিসেলারদের জন্য ডেলিভারি, কমিশন বা রিটার্ন সংক্রান্ত নীতিমালা তৈরি করতে উপরের \"Add New Policy\" বাটনে ক্লিক করুন।"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: openNewModal,
						className: "btn-brand inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold mt-4 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " প্রথম পলিসি যুক্ত করুন"]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: policies.map((p, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("surface-card relative flex flex-col justify-between rounded-2xl border p-5 shadow-2xs transition-all", p.is_active ? "border-border/80 bg-card hover:border-primary/40" : "border-border/40 bg-muted/20 opacity-70"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3 mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary font-bold text-sm",
								children: p.sort_order || index + 1
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-bold text-foreground leading-snug",
								children: p.title
							}), p.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: p.summary
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold shrink-0", p.is_active ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-muted text-muted-foreground border border-border/50"),
							children: p.is_active ? "Active" : "Hidden"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2 my-4 pl-1",
						children: p.points.map((pt, ptIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-2 text-xs sm:text-sm text-muted-foreground leading-relaxed",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground/90",
								children: pt
							})]
						}, ptIdx))
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-t border-border/50 pt-3 mt-2 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground font-medium",
							children: [p.points.length, "টি পয়েন্ট"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => toggleActive(p),
									className: "inline-flex items-center gap-1 rounded-lg border border-border/60 bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all",
									children: [p.is_active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.is_active ? "Hide" : "Show" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => openEditModal(p),
									className: "inline-flex items-center gap-1 rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Edit" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => handleDelete(p),
									className: "inline-flex items-center gap-1 rounded-lg border border-destructive/30 bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
								})
							]
						})]
					})]
				}, p.id))
			}),
			modalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppModal, {
				open: true,
				onClose: () => setModalOpen(false),
				size: "lg",
				title: formData.id ? "Edit Policy Section" : "Add New Policy Section",
				subtitle: "সহজ ভাষায় রিসেলারদের জন্য নিয়ম বা পয়েন্ট যুক্ত করুন。",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSave,
					className: "space-y-4",
					children: [
						!formData.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-primary/20 bg-primary/5 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] font-bold text-primary mb-2 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "দ্রুত রেডিমেড টেমপ্লেট ব্যবহার করুন:" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: PRESET_TEMPLATES.map((t, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => applyTemplate(t),
									className: "rounded-lg border border-primary/30 bg-background px-2.5 py-1 text-[11px] font-semibold text-foreground hover:bg-primary hover:text-primary-foreground transition-all",
									children: t.title
								}, idx))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-4 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:col-span-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "mb-1 block text-xs font-bold text-foreground",
									children: ["পলিসির নাম / শিরোনাম ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-destructive",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									value: formData.title,
									onChange: (e) => setFormData({
										...formData,
										title: e.target.value
									}),
									placeholder: "যেমন: ডেলিভারি চার্জ ও কুরিয়ার নীতি",
									className: "w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-sm text-foreground font-semibold outline-none focus:ring-2 focus:ring-primary/40"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-bold text-foreground",
								children: "ক্রম (Order)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 1,
								value: formData.sort_order,
								onChange: (e) => setFormData({
									...formData,
									sort_order: Number(e.target.value) || 1
								}),
								className: "w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40 text-center font-bold"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-bold text-foreground",
							children: "এক লাইনে বিবরণ / সাব-টাইটেল (Optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: formData.summary,
							onChange: (e) => setFormData({
								...formData,
								summary: e.target.value
							}),
							placeholder: "যেমন: কুরিয়ার বুকিং ও পার্সেল হ্যান্ডলিং নিয়মাবলী",
							className: "w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-xs sm:text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs font-bold text-foreground flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "পলিসির পয়েন্ট ও নিয়মাবলী" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: toggleBulkMode,
								className: "text-xs font-bold text-primary hover:underline",
								children: bulkMode ? "Switch to Point-by-Point" : "Switch to Bulk Text Mode"
							})]
						}), bulkMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 6,
							value: bulkText,
							onChange: (e) => setBulkText(e.target.value),
							placeholder: "প্রতি লাইনে ১টি করে নিয়ম লিখুন...",
							className: "w-full rounded-xl border border-border/80 bg-background p-3 text-xs sm:text-sm leading-relaxed text-foreground outline-none focus:ring-2 focus:ring-primary/40 font-mono"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground mt-1",
							children: "প্রতিটি নতুন লাইনে একটি করে বুলেট পয়েন্ট তৈরি হবে।"
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2.5 max-h-[220px] overflow-y-auto pr-1 no-scrollbar",
							children: [formData.points.map((pt, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid h-6 w-6 place-items-center rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0",
										children: idx + 1
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: pt,
										onChange: (e) => handlePointChange(idx, e.target.value),
										placeholder: `পয়েন্ট #${idx + 1} লিখুন...`,
										className: "flex-1 rounded-xl border border-border/80 bg-background px-3 py-2 text-xs sm:text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => removePoint(idx),
										className: "p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors",
										title: "Delete point",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
									})
								]
							}, idx)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: addPoint,
								className: "inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "নতুন পয়েন্ট যোগ করুন (+ Add Point)" })]
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-xl border border-border/70 bg-muted/20 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-bold text-foreground",
								children: "রিসেলারদের কাছে দৃশ্যমান (Active Status)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-muted-foreground",
								children: "সক্রিয় রাখলে রিসেলাররা তাদের ড্যাশবোর্ডে দেখতে পারবে।"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setFormData({
									...formData,
									is_active: !formData.is_active
								}),
								className: cn("rounded-xl px-3 py-1.5 text-xs font-bold transition-all border", formData.is_active ? "bg-emerald-500 text-white border-emerald-600 shadow-xs" : "bg-muted text-muted-foreground border-border/80"),
								children: formData.is_active ? "Published" : "Hidden"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-2 pt-2 border-t border-border/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setModalOpen(false),
								className: "rounded-xl border border-border/80 px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted transition-all",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: busy,
								className: "btn-brand inline-flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-bold shadow-md cursor-pointer disabled:opacity-50",
								children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formData.id ? "Update Policy" : "Create Policy" })]
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { PoliciesAdmin as component };
