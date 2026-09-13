import { i as __toESM, t as __commonJSMin } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { t as createServerFn } from "./createServerFn-BhXNZl1x.js";
import { r as supabase, s as createSsrRpc } from "./client-DdbbmuGT.js";
import { t as useServerFn } from "./useServerFn-mrQ2htrR.js";
import { t as requireSupabaseAuth } from "./auth-middleware-f2jdqIGt.js";
import { f as useQuery } from "./order-search-72uX7t63.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { Mt as LoaderCircle, S as Store, h as TriangleAlert, m as Truck } from "./vendor-icons-BWIzFOtW.js";
import { n as Dialog, o as DialogHeader, r as DialogContent, s as DialogTitle } from "./ConfirmModal-B_9J8UhI.js";
import { n as getGlobalSettings } from "./app-data-DwbOGY7V.js";
import { c as bookSteadfast, n as CourierLogo, o as bookCarrybee, r as courierBrand, s as bookPathao, t as COURIER_BRANDS } from "./courier-brand-W952v6Tp.js";
//#region src/lib/courier-config.functions.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var getActiveCouriers = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("02213bd497c0eaf0a2687ab1b01d71f96e5763da0a2546216be66a5f5f034170"));
/** Active providers plus their saved pickup stores (multi-store booking). */
var getCourierBookingOptions = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("c73cecbaf7348f9b524e70bab5e2011554ed424328568749bec2a7e553ed6610"));
//#endregion
//#region src/lib/supplier-colors.ts
/**
* Dynamic, unlimited per-supplier row tinting.
*
* Each supplier id is hashed into a stable hue, so every supplier gets its own
* soft pastel row colour without any hardcoded palette. Orders that contain
* products from more than one supplier get a gradient of those hues.
* Admin-only orders (no supplier) stay neutral.
*/
function hashHue(id) {
	let h = 0;
	for (let i = 0; i < id.length; i++) h = h * 31 + id.charCodeAt(i) >>> 0;
	return Math.round(h % 360 * .618033988749895 * 360) % 360;
}
/** Soft background colour for a single supplier. */
function supplierTintColor(id, alpha = .14) {
	return `hsl(${hashHue(id)} 85% 60% / ${alpha})`;
}
/** Stronger accent (border / dot) for a single supplier. */
function supplierAccentColor(id) {
	return `hsl(${hashHue(id)} 70% 50% / 0.55)`;
}
/**
* Build the row tint for an order from the supplier ids of its items.
* `null`/undefined ids (admin's own products) are ignored.
*/
function orderSupplierTint(ids) {
	const unique = Array.from(new Set(ids.filter((x) => !!x)));
	if (unique.length === 0) return null;
	if (unique.length === 1) {
		const id = unique[0];
		return {
			mixed: false,
			style: {
				backgroundColor: supplierTintColor(id),
				borderLeft: `3px solid ${supplierAccentColor(id)}`
			}
		};
	}
	return {
		mixed: true,
		style: {
			backgroundImage: `linear-gradient(100deg, ${unique.slice(0, 4).map((id, i, arr) => `${supplierTintColor(id, .18)} ${Math.round(i / Math.max(arr.length - 1, 1) * 100)}%`).join(", ")})`,
			borderLeft: `3px solid ${supplierAccentColor(unique[0])}`
		}
	};
}
//#endregion
//#region src/components/ShipmentBookingModal.tsx
var import_jsx_runtime = require_jsx_runtime();
function ShipmentBookingModal({ isOpen, onClose, orderIds, onSuccess }) {
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [provider, setProvider] = (0, import_react.useState)("steadfast");
	const [storeId, setStoreId] = (0, import_react.useState)("");
	const fetchOptions = useServerFn(getCourierBookingOptions);
	const { data: options = [] } = useQuery({
		queryKey: ["courier-booking-options"],
		queryFn: () => fetchOptions()
	});
	const activeProviders = (0, import_react.useMemo)(() => options.map((o) => o.provider), [options]);
	const activeCourierList = (0, import_react.useMemo)(() => activeProviders.map((id) => COURIER_BRANDS[id]).filter(Boolean), [activeProviders]);
	const current = (0, import_react.useMemo)(() => options.find((o) => o.provider === provider) ?? null, [options, provider]);
	const stores = current?.stores ?? [];
	const needsStoreChoice = stores.length > 1;
	(0, import_react.useEffect)(() => {
		if (activeProviders.length > 0 && !activeProviders.includes(provider)) setProvider(activeProviders[0]);
	}, [activeProviders]);
	(0, import_react.useEffect)(() => {
		if (!current) return;
		const remembered = typeof window !== "undefined" ? window.localStorage.getItem(`courier-store:${current.provider}`) ?? "" : "";
		const fallback = current.stores.some((s) => s.id === remembered) && remembered || current.defaultStoreId || current.stores[0]?.id || "";
		setStoreId(current.stores.some((s) => s.id === storeId) ? storeId : fallback);
	}, [current]);
	const pickStore = (id) => {
		setStoreId(id);
		if (typeof window !== "undefined") window.localStorage.setItem(`courier-store:${provider}`, id);
	};
	const doSteadfast = useServerFn(bookSteadfast);
	const doPathao = useServerFn(bookPathao);
	const doCarrybee = useServerFn(bookCarrybee);
	const handleBook = async () => {
		if (orderIds.length === 0) return;
		setLoading(true);
		let successCount = 0;
		let failCount = 0;
		let lastErrorMessage = "";
		for (const id of orderIds) try {
			let res = null;
			let orderObj = null;
			try {
				if (typeof window !== "undefined") {
					const rawOrders = localStorage.getItem("mock:orders");
					if (rawOrders) orderObj = JSON.parse(rawOrders).find((o) => o.id === id || o.order_number === id);
				}
			} catch {}
			try {
				const apiData = await (await fetch("/api/public/courier/actions", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						action: "book",
						provider,
						orderId: id,
						storeId: storeId || void 0,
						order: orderObj || void 0
					})
				})).json();
				if (apiData && apiData.success) res = apiData;
			} catch {}
			if (!res) {
				if (provider === "steadfast") res = await doSteadfast({ data: { orderId: id } });
				else if (provider === "pathao") res = await doPathao({ data: {
					orderId: id,
					...storeId ? { storeId } : {}
				} });
				else if (provider === "carrybee") res = await doCarrybee({ data: {
					orderId: id,
					...storeId ? { storeId } : {}
				} });
			}
			if (res && (res.trackingId || res.consignmentId || res.success)) try {
				if (typeof window !== "undefined") {
					const trackId = res.trackingId || res.consignmentId;
					const trackUrl = res.trackingUrl || (provider === "steadfast" ? `https://steadfast.com.bd/tl/${trackId}` : void 0);
					const raw = localStorage.getItem("mock:shipments") || "[]";
					const list = JSON.parse(raw);
					const idx = list.findIndex((s) => s.order_id === id || orderObj?.order_number && s.order_id === orderObj.order_number);
					const total = Number(orderObj?.total || 0);
					const advance = Number(orderObj?.advance_amount || orderObj?.received_amount || orderObj?.advance || 0);
					const codAmount = orderObj?.payment_status === "paid" ? 0 : orderObj?.payment_method === "cod" || !orderObj?.payment_method ? Math.max(0, total - advance) : 0;
					const sData = {
						id: res.shipmentId || `sh-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
						order_id: id,
						provider,
						tracking_id: trackId,
						tracking_url: trackUrl,
						consignment_id: res.consignmentId || trackId,
						cod_amount: codAmount,
						status: "booked",
						courier_status: res.status || "in_review",
						booked_at: (/* @__PURE__ */ new Date()).toISOString()
					};
					if (idx >= 0) list[idx] = {
						...list[idx],
						...sData
					};
					else list.unshift(sData);
					localStorage.setItem("mock:shipments", JSON.stringify(list));
					const rawOrders = localStorage.getItem("mock:orders");
					if (rawOrders) {
						const oList = JSON.parse(rawOrders);
						const oIdx = oList.findIndex((o) => o.id === id || o.order_number === id);
						if (oIdx >= 0) {
							oList[oIdx] = {
								...oList[oIdx],
								courier_provider: provider,
								courier_tracking_id: trackId,
								courier_status: res.status || "in_review",
								updated_at: (/* @__PURE__ */ new Date()).toISOString()
							};
							localStorage.setItem("mock:orders", JSON.stringify(oList));
						}
					}
				}
			} catch {}
			successCount++;
		} catch (err) {
			console.error(`Booking failed for ${id}:`, err);
			failCount++;
			if (err instanceof Response) try {
				const txt = await err.text();
				if (txt) lastErrorMessage = txt;
			} catch {}
			else if (err?.message) lastErrorMessage = err.message;
		}
		if (successCount > 0) {
			toast.success(`Successfully booked ${successCount} order(s) with ${provider}`);
			onSuccess();
			onClose();
		}
		if (failCount > 0) toast.error(lastErrorMessage ? `Booking failed: ${lastErrorMessage}` : `Failed to book ${failCount} order(s). Please check courier settings.`);
		setLoading(false);
	};
	const autoBook = activeProviders.length === 1 && !needsStoreChoice;
	(0, import_react.useEffect)(() => {
		if (isOpen && !loading && autoBook && orderIds.length > 0) handleBook();
	}, [
		isOpen,
		autoBook,
		orderIds
	]);
	if (autoBook && isOpen) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: isOpen,
		onOpenChange: (open) => !loading && !open && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			className: "max-w-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center py-8 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary mb-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm font-medium",
					children: [
						"Booking ",
						orderIds.length,
						" order(s) with ",
						activeCourierList[0]?.label,
						"..."
					]
				})]
			})
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: isOpen,
		onOpenChange: (open) => !loading && !open && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-5 w-5 text-primary" }), "Courier Booking"]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mb-4 text-sm text-muted-foreground",
							children: [
								"Select a courier provider to book ",
								orderIds.length,
								" selected order(s)."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 gap-3",
							children: activeCourierList.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setProvider(p.id),
								className: `flex items-center justify-between rounded-lg border p-4 text-left transition-all hover:bg-accent ${provider === p.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourierLogo, {
										provider: p.id,
										size: 30
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										children: p.label
									})]
								}), provider === p.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-2 rounded-full bg-primary" })]
							}, p.id))
						}),
						stores.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mb-1 flex items-center gap-1.5 text-xs font-medium",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-3.5 w-3.5" }),
									" Pickup store",
									stores.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: [
											"(",
											stores.length,
											" saved)"
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: storeId,
								onChange: (e) => pickStore(e.target.value),
								className: "w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring",
								children: stores.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: s.id,
									children: [s.name || s.id, current?.defaultStoreId === s.id ? " (default)" : ""]
								}, s.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex items-start gap-3 rounded-lg bg-amber-50 p-3 text-amber-800 border border-amber-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs leading-relaxed",
								children: "Booking will create live consignments in the courier panel. Ensure store configurations are correct before proceeding."
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-end gap-3 border-t pt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled: loading,
						onClick: onClose,
						className: "rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						disabled: loading || activeProviders.length === 0,
						onClick: handleBook,
						className: "btn-brand flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold disabled:opacity-50",
						children: [
							loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
							"Confirm ",
							provider ? COURIER_BRANDS[provider]?.label : "Courier",
							" Booking"
						]
					})]
				})
			]
		})
	});
}
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/Barcode.js
var require_Barcode = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	exports.default = function Barcode(data, options) {
		_classCallCheck(this, Barcode);
		this.data = data;
		this.text = options.text || data;
		this.options = options;
	};
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/CODE39/index.js
var require_CODE39 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.CODE39 = void 0;
	var _createClass = function() {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}
		return function(Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();
	var _Barcode3 = _interopRequireDefault(require_Barcode());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	function _possibleConstructorReturn(self, call) {
		if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}
	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
			value: subClass,
			enumerable: false,
			writable: true,
			configurable: true
		} });
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	var CODE39 = function(_Barcode) {
		_inherits(CODE39, _Barcode);
		function CODE39(data, options) {
			_classCallCheck(this, CODE39);
			data = data.toUpperCase();
			if (options.mod43) data += getCharacter(mod43checksum(data));
			return _possibleConstructorReturn(this, (CODE39.__proto__ || Object.getPrototypeOf(CODE39)).call(this, data, options));
		}
		_createClass(CODE39, [{
			key: "encode",
			value: function encode() {
				var result = getEncoding("*");
				for (var i = 0; i < this.data.length; i++) result += getEncoding(this.data[i]) + "0";
				result += getEncoding("*");
				return {
					data: result,
					text: this.text
				};
			}
		}, {
			key: "valid",
			value: function valid() {
				return this.data.search(/^[0-9A-Z\-\.\ \$\/\+\%]+$/) !== -1;
			}
		}]);
		return CODE39;
	}(_Barcode3.default);
	var characters = [
		"0",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"A",
		"B",
		"C",
		"D",
		"E",
		"F",
		"G",
		"H",
		"I",
		"J",
		"K",
		"L",
		"M",
		"N",
		"O",
		"P",
		"Q",
		"R",
		"S",
		"T",
		"U",
		"V",
		"W",
		"X",
		"Y",
		"Z",
		"-",
		".",
		" ",
		"$",
		"/",
		"+",
		"%",
		"*"
	];
	var encodings = [
		20957,
		29783,
		23639,
		30485,
		20951,
		29813,
		23669,
		20855,
		29789,
		23645,
		29975,
		23831,
		30533,
		22295,
		30149,
		24005,
		21623,
		29981,
		23837,
		22301,
		30023,
		23879,
		30545,
		22343,
		30161,
		24017,
		21959,
		30065,
		23921,
		22385,
		29015,
		18263,
		29141,
		17879,
		29045,
		18293,
		17783,
		29021,
		18269,
		17477,
		17489,
		17681,
		20753,
		35770
	];
	function getEncoding(character) {
		return getBinary(characterValue(character));
	}
	function getBinary(characterValue) {
		return encodings[characterValue].toString(2);
	}
	function getCharacter(characterValue) {
		return characters[characterValue];
	}
	function characterValue(character) {
		return characters.indexOf(character);
	}
	function mod43checksum(data) {
		var checksum = 0;
		for (var i = 0; i < data.length; i++) checksum += characterValue(data[i]);
		checksum = checksum % 43;
		return checksum;
	}
	exports.CODE39 = CODE39;
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/CODE128/constants.js
var require_constants$3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _SET_BY_CODE;
	function _defineProperty(obj, key, value) {
		if (key in obj) Object.defineProperty(obj, key, {
			value,
			enumerable: true,
			configurable: true,
			writable: true
		});
		else obj[key] = value;
		return obj;
	}
	var SET_A = exports.SET_A = 0;
	var SET_B = exports.SET_B = 1;
	var SET_C = exports.SET_C = 2;
	exports.SHIFT = 98;
	var START_A = exports.START_A = 103;
	var START_B = exports.START_B = 104;
	var START_C = exports.START_C = 105;
	exports.MODULO = 103;
	exports.STOP = 106;
	exports.FNC1 = 207;
	exports.SET_BY_CODE = (_SET_BY_CODE = {}, _defineProperty(_SET_BY_CODE, START_A, SET_A), _defineProperty(_SET_BY_CODE, START_B, SET_B), _defineProperty(_SET_BY_CODE, START_C, SET_C), _SET_BY_CODE);
	exports.SWAP = {
		101: SET_A,
		100: SET_B,
		99: SET_C
	};
	exports.A_START_CHAR = String.fromCharCode(208);
	exports.B_START_CHAR = String.fromCharCode(209);
	exports.C_START_CHAR = String.fromCharCode(210);
	exports.A_CHARS = "[\0-_È-Ï]";
	exports.B_CHARS = "[ -È-Ï]";
	exports.C_CHARS = "(Ï*[0-9]{2}Ï*)";
	exports.BARS = [
		11011001100,
		11001101100,
		11001100110,
		10010011e3,
		10010001100,
		10001001100,
		10011001e3,
		10011000100,
		10001100100,
		11001001e3,
		11001000100,
		11000100100,
		10110011100,
		10011011100,
		10011001110,
		10111001100,
		10011101100,
		10011100110,
		11001110010,
		11001011100,
		11001001110,
		11011100100,
		11001110100,
		11101101110,
		11101001100,
		11100101100,
		11100100110,
		11101100100,
		11100110100,
		11100110010,
		11011011e3,
		11011000110,
		11000110110,
		10100011e3,
		10001011e3,
		10001000110,
		10110001e3,
		10001101e3,
		10001100010,
		11010001e3,
		11000101e3,
		11000100010,
		10110111e3,
		10110001110,
		10001101110,
		10111011e3,
		10111000110,
		10001110110,
		11101110110,
		11010001110,
		11000101110,
		11011101e3,
		11011100010,
		11011101110,
		11101011e3,
		11101000110,
		11100010110,
		11101101e3,
		11101100010,
		11100011010,
		11101111010,
		11001000010,
		11110001010,
		1010011e4,
		10100001100,
		1001011e4,
		10010000110,
		10000101100,
		10000100110,
		1011001e4,
		10110000100,
		1001101e4,
		10011000010,
		10000110100,
		10000110010,
		11000010010,
		1100101e4,
		11110111010,
		11000010100,
		10001111010,
		10100111100,
		10010111100,
		10010011110,
		10111100100,
		10011110100,
		10011110010,
		11110100100,
		11110010100,
		11110010010,
		11011011110,
		11011110110,
		11110110110,
		10101111e3,
		10100011110,
		10001011110,
		10111101e3,
		10111100010,
		11110101e3,
		11110100010,
		10111011110,
		10111101110,
		11101011110,
		11110101110,
		11010000100,
		1101001e4,
		11010011100,
		1100011101011
	];
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/CODE128/CODE128.js
var require_CODE128$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _createClass = function() {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}
		return function(Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();
	var _Barcode3 = _interopRequireDefault(require_Barcode());
	var _constants = require_constants$3();
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	function _possibleConstructorReturn(self, call) {
		if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}
	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
			value: subClass,
			enumerable: false,
			writable: true,
			configurable: true
		} });
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	exports.default = function(_Barcode) {
		_inherits(CODE128, _Barcode);
		function CODE128(data, options) {
			_classCallCheck(this, CODE128);
			var _this = _possibleConstructorReturn(this, (CODE128.__proto__ || Object.getPrototypeOf(CODE128)).call(this, data.substring(1), options));
			_this.bytes = data.split("").map(function(char) {
				return char.charCodeAt(0);
			});
			return _this;
		}
		_createClass(CODE128, [
			{
				key: "valid",
				value: function valid() {
					return /^[\x00-\x7F\xC8-\xD3]+$/.test(this.data);
				}
			},
			{
				key: "encode",
				value: function encode() {
					var bytes = this.bytes;
					var startIndex = bytes.shift() - 105;
					var startSet = _constants.SET_BY_CODE[startIndex];
					if (startSet === void 0) throw new RangeError("The encoding does not start with a start character.");
					if (this.shouldEncodeAsEan128() === true) bytes.unshift(_constants.FNC1);
					var encodingResult = CODE128.next(bytes, 1, startSet);
					return {
						text: this.text === this.data ? this.text.replace(/[^\x20-\x7E]/g, "") : this.text,
						data: CODE128.getBar(startIndex) + encodingResult.result + CODE128.getBar((encodingResult.checksum + startIndex) % _constants.MODULO) + CODE128.getBar(_constants.STOP)
					};
				}
			},
			{
				key: "shouldEncodeAsEan128",
				value: function shouldEncodeAsEan128() {
					var isEAN128 = this.options.ean128 || false;
					if (typeof isEAN128 === "string") isEAN128 = isEAN128.toLowerCase() === "true";
					return isEAN128;
				}
			}
		], [
			{
				key: "getBar",
				value: function getBar(index) {
					return _constants.BARS[index] ? _constants.BARS[index].toString() : "";
				}
			},
			{
				key: "correctIndex",
				value: function correctIndex(bytes, set) {
					if (set === _constants.SET_A) {
						var charCode = bytes.shift();
						return charCode < 32 ? charCode + 64 : charCode - 32;
					} else if (set === _constants.SET_B) return bytes.shift() - 32;
					else return (bytes.shift() - 48) * 10 + bytes.shift() - 48;
				}
			},
			{
				key: "next",
				value: function next(bytes, pos, set) {
					if (!bytes.length) return {
						result: "",
						checksum: 0
					};
					var nextCode = void 0, index = void 0;
					if (bytes[0] >= 200) {
						index = bytes.shift() - 105;
						var nextSet = _constants.SWAP[index];
						if (nextSet !== void 0) nextCode = CODE128.next(bytes, pos + 1, nextSet);
						else {
							if ((set === _constants.SET_A || set === _constants.SET_B) && index === _constants.SHIFT) bytes[0] = set === _constants.SET_A ? bytes[0] > 95 ? bytes[0] - 96 : bytes[0] : bytes[0] < 32 ? bytes[0] + 96 : bytes[0];
							nextCode = CODE128.next(bytes, pos + 1, set);
						}
					} else {
						index = CODE128.correctIndex(bytes, set);
						nextCode = CODE128.next(bytes, pos + 1, set);
					}
					var enc = CODE128.getBar(index);
					var weight = index * pos;
					return {
						result: enc + nextCode.result,
						checksum: weight + nextCode.checksum
					};
				}
			}
		]);
		return CODE128;
	}(_Barcode3.default);
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/CODE128/auto.js
var require_auto = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _constants = require_constants$3();
	var matchSetALength = function matchSetALength(string) {
		return string.match(new RegExp("^" + _constants.A_CHARS + "*"))[0].length;
	};
	var matchSetBLength = function matchSetBLength(string) {
		return string.match(new RegExp("^" + _constants.B_CHARS + "*"))[0].length;
	};
	var matchSetC = function matchSetC(string) {
		return string.match(new RegExp("^" + _constants.C_CHARS + "*"))[0];
	};
	function autoSelectFromAB(string, isA) {
		var ranges = isA ? _constants.A_CHARS : _constants.B_CHARS;
		var untilC = string.match(new RegExp("^(" + ranges + "+?)(([0-9]{2}){2,})([^0-9]|$)"));
		if (untilC) return untilC[1] + String.fromCharCode(204) + autoSelectFromC(string.substring(untilC[1].length));
		var chars = string.match(new RegExp("^" + ranges + "+"))[0];
		if (chars.length === string.length) return string;
		return chars + String.fromCharCode(isA ? 205 : 206) + autoSelectFromAB(string.substring(chars.length), !isA);
	}
	function autoSelectFromC(string) {
		var cMatch = matchSetC(string);
		var length = cMatch.length;
		if (length === string.length) return string;
		string = string.substring(length);
		var isA = matchSetALength(string) >= matchSetBLength(string);
		return cMatch + String.fromCharCode(isA ? 206 : 205) + autoSelectFromAB(string, isA);
	}
	exports.default = function(string) {
		var newString = void 0;
		if (matchSetC(string).length >= 2) newString = _constants.C_START_CHAR + autoSelectFromC(string);
		else {
			var isA = matchSetALength(string) > matchSetBLength(string);
			newString = (isA ? _constants.A_START_CHAR : _constants.B_START_CHAR) + autoSelectFromAB(string, isA);
		}
		return newString.replace(/[\xCD\xCE]([^])[\xCD\xCE]/, function(match, char) {
			return String.fromCharCode(203) + char;
		});
	};
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/CODE128/CODE128_AUTO.js
var require_CODE128_AUTO = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _CODE3 = _interopRequireDefault(require_CODE128$1());
	var _auto2 = _interopRequireDefault(require_auto());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	function _possibleConstructorReturn(self, call) {
		if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}
	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
			value: subClass,
			enumerable: false,
			writable: true,
			configurable: true
		} });
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	exports.default = function(_CODE) {
		_inherits(CODE128AUTO, _CODE);
		function CODE128AUTO(data, options) {
			_classCallCheck(this, CODE128AUTO);
			if (/^[\x00-\x7F\xC8-\xD3]+$/.test(data)) var _this = _possibleConstructorReturn(this, (CODE128AUTO.__proto__ || Object.getPrototypeOf(CODE128AUTO)).call(this, (0, _auto2.default)(data), options));
			else var _this = _possibleConstructorReturn(this, (CODE128AUTO.__proto__ || Object.getPrototypeOf(CODE128AUTO)).call(this, data, options));
			return _possibleConstructorReturn(_this);
		}
		return CODE128AUTO;
	}(_CODE3.default);
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/CODE128/CODE128A.js
var require_CODE128A = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _createClass = function() {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}
		return function(Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();
	var _CODE3 = _interopRequireDefault(require_CODE128$1());
	var _constants = require_constants$3();
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	function _possibleConstructorReturn(self, call) {
		if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}
	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
			value: subClass,
			enumerable: false,
			writable: true,
			configurable: true
		} });
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	exports.default = function(_CODE) {
		_inherits(CODE128A, _CODE);
		function CODE128A(string, options) {
			_classCallCheck(this, CODE128A);
			return _possibleConstructorReturn(this, (CODE128A.__proto__ || Object.getPrototypeOf(CODE128A)).call(this, _constants.A_START_CHAR + string, options));
		}
		_createClass(CODE128A, [{
			key: "valid",
			value: function valid() {
				return new RegExp("^" + _constants.A_CHARS + "+$").test(this.data);
			}
		}]);
		return CODE128A;
	}(_CODE3.default);
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/CODE128/CODE128B.js
var require_CODE128B = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _createClass = function() {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}
		return function(Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();
	var _CODE3 = _interopRequireDefault(require_CODE128$1());
	var _constants = require_constants$3();
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	function _possibleConstructorReturn(self, call) {
		if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}
	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
			value: subClass,
			enumerable: false,
			writable: true,
			configurable: true
		} });
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	exports.default = function(_CODE) {
		_inherits(CODE128B, _CODE);
		function CODE128B(string, options) {
			_classCallCheck(this, CODE128B);
			return _possibleConstructorReturn(this, (CODE128B.__proto__ || Object.getPrototypeOf(CODE128B)).call(this, _constants.B_START_CHAR + string, options));
		}
		_createClass(CODE128B, [{
			key: "valid",
			value: function valid() {
				return new RegExp("^" + _constants.B_CHARS + "+$").test(this.data);
			}
		}]);
		return CODE128B;
	}(_CODE3.default);
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/CODE128/CODE128C.js
var require_CODE128C = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _createClass = function() {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}
		return function(Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();
	var _CODE3 = _interopRequireDefault(require_CODE128$1());
	var _constants = require_constants$3();
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	function _possibleConstructorReturn(self, call) {
		if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}
	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
			value: subClass,
			enumerable: false,
			writable: true,
			configurable: true
		} });
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	exports.default = function(_CODE) {
		_inherits(CODE128C, _CODE);
		function CODE128C(string, options) {
			_classCallCheck(this, CODE128C);
			return _possibleConstructorReturn(this, (CODE128C.__proto__ || Object.getPrototypeOf(CODE128C)).call(this, _constants.C_START_CHAR + string, options));
		}
		_createClass(CODE128C, [{
			key: "valid",
			value: function valid() {
				return new RegExp("^" + _constants.C_CHARS + "+$").test(this.data);
			}
		}]);
		return CODE128C;
	}(_CODE3.default);
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/CODE128/index.js
var require_CODE128 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.CODE128C = exports.CODE128B = exports.CODE128A = exports.CODE128 = void 0;
	var _CODE128_AUTO2 = _interopRequireDefault(require_CODE128_AUTO());
	var _CODE128A2 = _interopRequireDefault(require_CODE128A());
	var _CODE128B2 = _interopRequireDefault(require_CODE128B());
	var _CODE128C2 = _interopRequireDefault(require_CODE128C());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	exports.CODE128 = _CODE128_AUTO2.default;
	exports.CODE128A = _CODE128A2.default;
	exports.CODE128B = _CODE128B2.default;
	exports.CODE128C = _CODE128C2.default;
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/EAN_UPC/constants.js
var require_constants$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SIDE_BIN = "101";
	exports.MIDDLE_BIN = "01010";
	exports.BINARIES = {
		"L": [
			"0001101",
			"0011001",
			"0010011",
			"0111101",
			"0100011",
			"0110001",
			"0101111",
			"0111011",
			"0110111",
			"0001011"
		],
		"G": [
			"0100111",
			"0110011",
			"0011011",
			"0100001",
			"0011101",
			"0111001",
			"0000101",
			"0010001",
			"0001001",
			"0010111"
		],
		"R": [
			"1110010",
			"1100110",
			"1101100",
			"1000010",
			"1011100",
			"1001110",
			"1010000",
			"1000100",
			"1001000",
			"1110100"
		],
		"O": [
			"0001101",
			"0011001",
			"0010011",
			"0111101",
			"0100011",
			"0110001",
			"0101111",
			"0111011",
			"0110111",
			"0001011"
		],
		"E": [
			"0100111",
			"0110011",
			"0011011",
			"0100001",
			"0011101",
			"0111001",
			"0000101",
			"0010001",
			"0001001",
			"0010111"
		]
	};
	exports.EAN2_STRUCTURE = [
		"LL",
		"LG",
		"GL",
		"GG"
	];
	exports.EAN5_STRUCTURE = [
		"GGLLL",
		"GLGLL",
		"GLLGL",
		"GLLLG",
		"LGGLL",
		"LLGGL",
		"LLLGG",
		"LGLGL",
		"LGLLG",
		"LLGLG"
	];
	exports.EAN13_STRUCTURE = [
		"LLLLLL",
		"LLGLGG",
		"LLGGLG",
		"LLGGGL",
		"LGLLGG",
		"LGGLLG",
		"LGGGLL",
		"LGLGLG",
		"LGLGGL",
		"LGGLGL"
	];
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/EAN_UPC/encoder.js
var require_encoder = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _constants = require_constants$2();
	exports.default = function encode(data, structure, separator) {
		var encoded = data.split("").map(function(val, idx) {
			return _constants.BINARIES[structure[idx]];
		}).map(function(val, idx) {
			return val ? val[data[idx]] : "";
		});
		if (separator) {
			var last = data.length - 1;
			encoded = encoded.map(function(val, idx) {
				return idx < last ? val + separator : val;
			});
		}
		return encoded.join("");
	};
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/EAN_UPC/EAN.js
var require_EAN = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _createClass = function() {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}
		return function(Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();
	var _constants = require_constants$2();
	var _encoder2 = _interopRequireDefault(require_encoder());
	var _Barcode3 = _interopRequireDefault(require_Barcode());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	function _possibleConstructorReturn(self, call) {
		if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}
	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
			value: subClass,
			enumerable: false,
			writable: true,
			configurable: true
		} });
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	exports.default = function(_Barcode) {
		_inherits(EAN, _Barcode);
		function EAN(data, options) {
			_classCallCheck(this, EAN);
			var _this = _possibleConstructorReturn(this, (EAN.__proto__ || Object.getPrototypeOf(EAN)).call(this, data, options));
			_this.fontSize = !options.flat && options.fontSize > options.width * 10 ? options.width * 10 : options.fontSize;
			_this.guardHeight = options.height + _this.fontSize / 2 + options.textMargin;
			return _this;
		}
		_createClass(EAN, [
			{
				key: "encode",
				value: function encode() {
					return this.options.flat ? this.encodeFlat() : this.encodeGuarded();
				}
			},
			{
				key: "leftText",
				value: function leftText(from, to) {
					return this.text.substr(from, to);
				}
			},
			{
				key: "leftEncode",
				value: function leftEncode(data, structure) {
					return (0, _encoder2.default)(data, structure);
				}
			},
			{
				key: "rightText",
				value: function rightText(from, to) {
					return this.text.substr(from, to);
				}
			},
			{
				key: "rightEncode",
				value: function rightEncode(data, structure) {
					return (0, _encoder2.default)(data, structure);
				}
			},
			{
				key: "encodeGuarded",
				value: function encodeGuarded() {
					var textOptions = { fontSize: this.fontSize };
					var guardOptions = { height: this.guardHeight };
					return [
						{
							data: _constants.SIDE_BIN,
							options: guardOptions
						},
						{
							data: this.leftEncode(),
							text: this.leftText(),
							options: textOptions
						},
						{
							data: _constants.MIDDLE_BIN,
							options: guardOptions
						},
						{
							data: this.rightEncode(),
							text: this.rightText(),
							options: textOptions
						},
						{
							data: _constants.SIDE_BIN,
							options: guardOptions
						}
					];
				}
			},
			{
				key: "encodeFlat",
				value: function encodeFlat() {
					return {
						data: [
							_constants.SIDE_BIN,
							this.leftEncode(),
							_constants.MIDDLE_BIN,
							this.rightEncode(),
							_constants.SIDE_BIN
						].join(""),
						text: this.text
					};
				}
			}
		]);
		return EAN;
	}(_Barcode3.default);
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/EAN_UPC/EAN13.js
var require_EAN13 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _createClass = function() {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}
		return function(Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();
	var _get = function get(object, property, receiver) {
		if (object === null) object = Function.prototype;
		var desc = Object.getOwnPropertyDescriptor(object, property);
		if (desc === void 0) {
			var parent = Object.getPrototypeOf(object);
			if (parent === null) return;
			else return get(parent, property, receiver);
		} else if ("value" in desc) return desc.value;
		else {
			var getter = desc.get;
			if (getter === void 0) return;
			return getter.call(receiver);
		}
	};
	var _constants = require_constants$2();
	var _EAN3 = _interopRequireDefault(require_EAN());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	function _possibleConstructorReturn(self, call) {
		if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}
	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
			value: subClass,
			enumerable: false,
			writable: true,
			configurable: true
		} });
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	var checksum = function checksum(number) {
		return (10 - number.substr(0, 12).split("").map(function(n) {
			return +n;
		}).reduce(function(sum, a, idx) {
			return idx % 2 ? sum + a * 3 : sum + a;
		}, 0) % 10) % 10;
	};
	exports.default = function(_EAN) {
		_inherits(EAN13, _EAN);
		function EAN13(data, options) {
			_classCallCheck(this, EAN13);
			if (data.search(/^[0-9]{12}$/) !== -1) data += checksum(data);
			var _this = _possibleConstructorReturn(this, (EAN13.__proto__ || Object.getPrototypeOf(EAN13)).call(this, data, options));
			_this.lastChar = options.lastChar;
			return _this;
		}
		_createClass(EAN13, [
			{
				key: "valid",
				value: function valid() {
					return this.data.search(/^[0-9]{13}$/) !== -1 && +this.data[12] === checksum(this.data);
				}
			},
			{
				key: "leftText",
				value: function leftText() {
					return _get(EAN13.prototype.__proto__ || Object.getPrototypeOf(EAN13.prototype), "leftText", this).call(this, 1, 6);
				}
			},
			{
				key: "leftEncode",
				value: function leftEncode() {
					var data = this.data.substr(1, 6);
					var structure = _constants.EAN13_STRUCTURE[this.data[0]];
					return _get(EAN13.prototype.__proto__ || Object.getPrototypeOf(EAN13.prototype), "leftEncode", this).call(this, data, structure);
				}
			},
			{
				key: "rightText",
				value: function rightText() {
					return _get(EAN13.prototype.__proto__ || Object.getPrototypeOf(EAN13.prototype), "rightText", this).call(this, 7, 6);
				}
			},
			{
				key: "rightEncode",
				value: function rightEncode() {
					var data = this.data.substr(7, 6);
					return _get(EAN13.prototype.__proto__ || Object.getPrototypeOf(EAN13.prototype), "rightEncode", this).call(this, data, "RRRRRR");
				}
			},
			{
				key: "encodeGuarded",
				value: function encodeGuarded() {
					var data = _get(EAN13.prototype.__proto__ || Object.getPrototypeOf(EAN13.prototype), "encodeGuarded", this).call(this);
					if (this.options.displayValue) {
						data.unshift({
							data: "000000000000",
							text: this.text.substr(0, 1),
							options: {
								textAlign: "left",
								fontSize: this.fontSize
							}
						});
						if (this.options.lastChar) {
							data.push({ data: "00" });
							data.push({
								data: "00000",
								text: this.options.lastChar,
								options: { fontSize: this.fontSize }
							});
						}
					}
					return data;
				}
			}
		]);
		return EAN13;
	}(_EAN3.default);
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/EAN_UPC/EAN8.js
var require_EAN8 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _createClass = function() {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}
		return function(Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();
	var _get = function get(object, property, receiver) {
		if (object === null) object = Function.prototype;
		var desc = Object.getOwnPropertyDescriptor(object, property);
		if (desc === void 0) {
			var parent = Object.getPrototypeOf(object);
			if (parent === null) return;
			else return get(parent, property, receiver);
		} else if ("value" in desc) return desc.value;
		else {
			var getter = desc.get;
			if (getter === void 0) return;
			return getter.call(receiver);
		}
	};
	var _EAN3 = _interopRequireDefault(require_EAN());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	function _possibleConstructorReturn(self, call) {
		if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}
	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
			value: subClass,
			enumerable: false,
			writable: true,
			configurable: true
		} });
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	var checksum = function checksum(number) {
		return (10 - number.substr(0, 7).split("").map(function(n) {
			return +n;
		}).reduce(function(sum, a, idx) {
			return idx % 2 ? sum + a : sum + a * 3;
		}, 0) % 10) % 10;
	};
	exports.default = function(_EAN) {
		_inherits(EAN8, _EAN);
		function EAN8(data, options) {
			_classCallCheck(this, EAN8);
			if (data.search(/^[0-9]{7}$/) !== -1) data += checksum(data);
			return _possibleConstructorReturn(this, (EAN8.__proto__ || Object.getPrototypeOf(EAN8)).call(this, data, options));
		}
		_createClass(EAN8, [
			{
				key: "valid",
				value: function valid() {
					return this.data.search(/^[0-9]{8}$/) !== -1 && +this.data[7] === checksum(this.data);
				}
			},
			{
				key: "leftText",
				value: function leftText() {
					return _get(EAN8.prototype.__proto__ || Object.getPrototypeOf(EAN8.prototype), "leftText", this).call(this, 0, 4);
				}
			},
			{
				key: "leftEncode",
				value: function leftEncode() {
					var data = this.data.substr(0, 4);
					return _get(EAN8.prototype.__proto__ || Object.getPrototypeOf(EAN8.prototype), "leftEncode", this).call(this, data, "LLLL");
				}
			},
			{
				key: "rightText",
				value: function rightText() {
					return _get(EAN8.prototype.__proto__ || Object.getPrototypeOf(EAN8.prototype), "rightText", this).call(this, 4, 4);
				}
			},
			{
				key: "rightEncode",
				value: function rightEncode() {
					var data = this.data.substr(4, 4);
					return _get(EAN8.prototype.__proto__ || Object.getPrototypeOf(EAN8.prototype), "rightEncode", this).call(this, data, "RRRR");
				}
			}
		]);
		return EAN8;
	}(_EAN3.default);
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/EAN_UPC/EAN5.js
var require_EAN5 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _createClass = function() {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}
		return function(Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();
	var _constants = require_constants$2();
	var _encoder2 = _interopRequireDefault(require_encoder());
	var _Barcode3 = _interopRequireDefault(require_Barcode());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	function _possibleConstructorReturn(self, call) {
		if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}
	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
			value: subClass,
			enumerable: false,
			writable: true,
			configurable: true
		} });
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	var checksum = function checksum(data) {
		return data.split("").map(function(n) {
			return +n;
		}).reduce(function(sum, a, idx) {
			return idx % 2 ? sum + a * 9 : sum + a * 3;
		}, 0) % 10;
	};
	exports.default = function(_Barcode) {
		_inherits(EAN5, _Barcode);
		function EAN5(data, options) {
			_classCallCheck(this, EAN5);
			return _possibleConstructorReturn(this, (EAN5.__proto__ || Object.getPrototypeOf(EAN5)).call(this, data, options));
		}
		_createClass(EAN5, [{
			key: "valid",
			value: function valid() {
				return this.data.search(/^[0-9]{5}$/) !== -1;
			}
		}, {
			key: "encode",
			value: function encode() {
				var structure = _constants.EAN5_STRUCTURE[checksum(this.data)];
				return {
					data: "1011" + (0, _encoder2.default)(this.data, structure, "01"),
					text: this.text
				};
			}
		}]);
		return EAN5;
	}(_Barcode3.default);
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/EAN_UPC/EAN2.js
var require_EAN2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _createClass = function() {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}
		return function(Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();
	var _constants = require_constants$2();
	var _encoder2 = _interopRequireDefault(require_encoder());
	var _Barcode3 = _interopRequireDefault(require_Barcode());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	function _possibleConstructorReturn(self, call) {
		if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}
	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
			value: subClass,
			enumerable: false,
			writable: true,
			configurable: true
		} });
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	exports.default = function(_Barcode) {
		_inherits(EAN2, _Barcode);
		function EAN2(data, options) {
			_classCallCheck(this, EAN2);
			return _possibleConstructorReturn(this, (EAN2.__proto__ || Object.getPrototypeOf(EAN2)).call(this, data, options));
		}
		_createClass(EAN2, [{
			key: "valid",
			value: function valid() {
				return this.data.search(/^[0-9]{2}$/) !== -1;
			}
		}, {
			key: "encode",
			value: function encode() {
				var structure = _constants.EAN2_STRUCTURE[parseInt(this.data) % 4];
				return {
					data: "1011" + (0, _encoder2.default)(this.data, structure, "01"),
					text: this.text
				};
			}
		}]);
		return EAN2;
	}(_Barcode3.default);
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/EAN_UPC/UPC.js
var require_UPC = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _createClass = function() {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}
		return function(Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();
	exports.checksum = checksum;
	var _encoder2 = _interopRequireDefault(require_encoder());
	var _Barcode3 = _interopRequireDefault(require_Barcode());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	function _possibleConstructorReturn(self, call) {
		if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}
	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
			value: subClass,
			enumerable: false,
			writable: true,
			configurable: true
		} });
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	var UPC = function(_Barcode) {
		_inherits(UPC, _Barcode);
		function UPC(data, options) {
			_classCallCheck(this, UPC);
			if (data.search(/^[0-9]{11}$/) !== -1) data += checksum(data);
			var _this = _possibleConstructorReturn(this, (UPC.__proto__ || Object.getPrototypeOf(UPC)).call(this, data, options));
			_this.displayValue = options.displayValue;
			if (options.fontSize > options.width * 10) _this.fontSize = options.width * 10;
			else _this.fontSize = options.fontSize;
			_this.guardHeight = options.height + _this.fontSize / 2 + options.textMargin;
			return _this;
		}
		_createClass(UPC, [
			{
				key: "valid",
				value: function valid() {
					return this.data.search(/^[0-9]{12}$/) !== -1 && this.data[11] == checksum(this.data);
				}
			},
			{
				key: "encode",
				value: function encode() {
					if (this.options.flat) return this.flatEncoding();
					else return this.guardedEncoding();
				}
			},
			{
				key: "flatEncoding",
				value: function flatEncoding() {
					var result = "";
					result += "101";
					result += (0, _encoder2.default)(this.data.substr(0, 6), "LLLLLL");
					result += "01010";
					result += (0, _encoder2.default)(this.data.substr(6, 6), "RRRRRR");
					result += "101";
					return {
						data: result,
						text: this.text
					};
				}
			},
			{
				key: "guardedEncoding",
				value: function guardedEncoding() {
					var result = [];
					if (this.displayValue) result.push({
						data: "00000000",
						text: this.text.substr(0, 1),
						options: {
							textAlign: "left",
							fontSize: this.fontSize
						}
					});
					result.push({
						data: "101" + (0, _encoder2.default)(this.data[0], "L"),
						options: { height: this.guardHeight }
					});
					result.push({
						data: (0, _encoder2.default)(this.data.substr(1, 5), "LLLLL"),
						text: this.text.substr(1, 5),
						options: { fontSize: this.fontSize }
					});
					result.push({
						data: "01010",
						options: { height: this.guardHeight }
					});
					result.push({
						data: (0, _encoder2.default)(this.data.substr(6, 5), "RRRRR"),
						text: this.text.substr(6, 5),
						options: { fontSize: this.fontSize }
					});
					result.push({
						data: (0, _encoder2.default)(this.data[11], "R") + "101",
						options: { height: this.guardHeight }
					});
					if (this.displayValue) result.push({
						data: "00000000",
						text: this.text.substr(11, 1),
						options: {
							textAlign: "right",
							fontSize: this.fontSize
						}
					});
					return result;
				}
			}
		]);
		return UPC;
	}(_Barcode3.default);
	function checksum(number) {
		var result = 0;
		var i;
		for (i = 1; i < 11; i += 2) result += parseInt(number[i]);
		for (i = 0; i < 11; i += 2) result += parseInt(number[i]) * 3;
		return (10 - result % 10) % 10;
	}
	exports.default = UPC;
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/EAN_UPC/UPCE.js
var require_UPCE = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _createClass = function() {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}
		return function(Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();
	var _encoder2 = _interopRequireDefault(require_encoder());
	var _Barcode3 = _interopRequireDefault(require_Barcode());
	var _UPC = require_UPC();
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	function _possibleConstructorReturn(self, call) {
		if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}
	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
			value: subClass,
			enumerable: false,
			writable: true,
			configurable: true
		} });
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	var EXPANSIONS = [
		"XX00000XXX",
		"XX10000XXX",
		"XX20000XXX",
		"XXX00000XX",
		"XXXX00000X",
		"XXXXX00005",
		"XXXXX00006",
		"XXXXX00007",
		"XXXXX00008",
		"XXXXX00009"
	];
	var PARITIES = [
		["EEEOOO", "OOOEEE"],
		["EEOEOO", "OOEOEE"],
		["EEOOEO", "OOEEOE"],
		["EEOOOE", "OOEEEO"],
		["EOEEOO", "OEOOEE"],
		["EOOEEO", "OEEOOE"],
		["EOOOEE", "OEEEOO"],
		["EOEOEO", "OEOEOE"],
		["EOEOOE", "OEOEEO"],
		["EOOEOE", "OEEOEO"]
	];
	var UPCE = function(_Barcode) {
		_inherits(UPCE, _Barcode);
		function UPCE(data, options) {
			_classCallCheck(this, UPCE);
			var _this = _possibleConstructorReturn(this, (UPCE.__proto__ || Object.getPrototypeOf(UPCE)).call(this, data, options));
			_this.isValid = false;
			if (data.search(/^[0-9]{6}$/) !== -1) {
				_this.middleDigits = data;
				_this.upcA = expandToUPCA(data, "0");
				_this.text = options.text || "" + _this.upcA[0] + data + _this.upcA[_this.upcA.length - 1];
				_this.isValid = true;
			} else if (data.search(/^[01][0-9]{7}$/) !== -1) {
				_this.middleDigits = data.substring(1, data.length - 1);
				_this.upcA = expandToUPCA(_this.middleDigits, data[0]);
				if (_this.upcA[_this.upcA.length - 1] === data[data.length - 1]) _this.isValid = true;
				else return _possibleConstructorReturn(_this);
			} else return _possibleConstructorReturn(_this);
			_this.displayValue = options.displayValue;
			if (options.fontSize > options.width * 10) _this.fontSize = options.width * 10;
			else _this.fontSize = options.fontSize;
			_this.guardHeight = options.height + _this.fontSize / 2 + options.textMargin;
			return _this;
		}
		_createClass(UPCE, [
			{
				key: "valid",
				value: function valid() {
					return this.isValid;
				}
			},
			{
				key: "encode",
				value: function encode() {
					if (this.options.flat) return this.flatEncoding();
					else return this.guardedEncoding();
				}
			},
			{
				key: "flatEncoding",
				value: function flatEncoding() {
					var result = "";
					result += "101";
					result += this.encodeMiddleDigits();
					result += "010101";
					return {
						data: result,
						text: this.text
					};
				}
			},
			{
				key: "guardedEncoding",
				value: function guardedEncoding() {
					var result = [];
					if (this.displayValue) result.push({
						data: "00000000",
						text: this.text[0],
						options: {
							textAlign: "left",
							fontSize: this.fontSize
						}
					});
					result.push({
						data: "101",
						options: { height: this.guardHeight }
					});
					result.push({
						data: this.encodeMiddleDigits(),
						text: this.text.substring(1, 7),
						options: { fontSize: this.fontSize }
					});
					result.push({
						data: "010101",
						options: { height: this.guardHeight }
					});
					if (this.displayValue) result.push({
						data: "00000000",
						text: this.text[7],
						options: {
							textAlign: "right",
							fontSize: this.fontSize
						}
					});
					return result;
				}
			},
			{
				key: "encodeMiddleDigits",
				value: function encodeMiddleDigits() {
					var numberSystem = this.upcA[0];
					var checkDigit = this.upcA[this.upcA.length - 1];
					var parity = PARITIES[parseInt(checkDigit)][parseInt(numberSystem)];
					return (0, _encoder2.default)(this.middleDigits, parity);
				}
			}
		]);
		return UPCE;
	}(_Barcode3.default);
	function expandToUPCA(middleDigits, numberSystem) {
		var expansion = EXPANSIONS[parseInt(middleDigits[middleDigits.length - 1])];
		var result = "";
		var digitIndex = 0;
		for (var i = 0; i < expansion.length; i++) {
			var c = expansion[i];
			if (c === "X") result += middleDigits[digitIndex++];
			else result += c;
		}
		result = "" + numberSystem + result;
		return "" + result + (0, _UPC.checksum)(result);
	}
	exports.default = UPCE;
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/EAN_UPC/index.js
var require_EAN_UPC = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.UPCE = exports.UPC = exports.EAN2 = exports.EAN5 = exports.EAN8 = exports.EAN13 = void 0;
	var _EAN2 = _interopRequireDefault(require_EAN13());
	var _EAN4 = _interopRequireDefault(require_EAN8());
	var _EAN6 = _interopRequireDefault(require_EAN5());
	var _EAN8 = _interopRequireDefault(require_EAN2());
	var _UPC2 = _interopRequireDefault(require_UPC());
	var _UPCE2 = _interopRequireDefault(require_UPCE());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	exports.EAN13 = _EAN2.default;
	exports.EAN8 = _EAN4.default;
	exports.EAN5 = _EAN6.default;
	exports.EAN2 = _EAN8.default;
	exports.UPC = _UPC2.default;
	exports.UPCE = _UPCE2.default;
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/ITF/constants.js
var require_constants$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.START_BIN = "1010";
	exports.END_BIN = "11101";
	exports.BINARIES = [
		"00110",
		"10001",
		"01001",
		"11000",
		"00101",
		"10100",
		"01100",
		"00011",
		"10010",
		"01010"
	];
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/ITF/ITF.js
var require_ITF$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _createClass = function() {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}
		return function(Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();
	var _constants = require_constants$1();
	var _Barcode3 = _interopRequireDefault(require_Barcode());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	function _possibleConstructorReturn(self, call) {
		if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}
	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
			value: subClass,
			enumerable: false,
			writable: true,
			configurable: true
		} });
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	exports.default = function(_Barcode) {
		_inherits(ITF, _Barcode);
		function ITF() {
			_classCallCheck(this, ITF);
			return _possibleConstructorReturn(this, (ITF.__proto__ || Object.getPrototypeOf(ITF)).apply(this, arguments));
		}
		_createClass(ITF, [
			{
				key: "valid",
				value: function valid() {
					return this.data.search(/^([0-9]{2})+$/) !== -1;
				}
			},
			{
				key: "encode",
				value: function encode() {
					var _this2 = this;
					var encoded = this.data.match(/.{2}/g).map(function(pair) {
						return _this2.encodePair(pair);
					}).join("");
					return {
						data: _constants.START_BIN + encoded + _constants.END_BIN,
						text: this.text
					};
				}
			},
			{
				key: "encodePair",
				value: function encodePair(pair) {
					var second = _constants.BINARIES[pair[1]];
					return _constants.BINARIES[pair[0]].split("").map(function(first, idx) {
						return (first === "1" ? "111" : "1") + (second[idx] === "1" ? "000" : "0");
					}).join("");
				}
			}
		]);
		return ITF;
	}(_Barcode3.default);
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/ITF/ITF14.js
var require_ITF14 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _createClass = function() {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}
		return function(Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();
	var _ITF3 = _interopRequireDefault(require_ITF$1());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	function _possibleConstructorReturn(self, call) {
		if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}
	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
			value: subClass,
			enumerable: false,
			writable: true,
			configurable: true
		} });
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	var checksum = function checksum(data) {
		var res = data.substr(0, 13).split("").map(function(num) {
			return parseInt(num, 10);
		}).reduce(function(sum, n, idx) {
			return sum + n * (3 - idx % 2 * 2);
		}, 0);
		return Math.ceil(res / 10) * 10 - res;
	};
	exports.default = function(_ITF) {
		_inherits(ITF14, _ITF);
		function ITF14(data, options) {
			_classCallCheck(this, ITF14);
			if (data.search(/^[0-9]{13}$/) !== -1) data += checksum(data);
			return _possibleConstructorReturn(this, (ITF14.__proto__ || Object.getPrototypeOf(ITF14)).call(this, data, options));
		}
		_createClass(ITF14, [{
			key: "valid",
			value: function valid() {
				return this.data.search(/^[0-9]{14}$/) !== -1 && +this.data[13] === checksum(this.data);
			}
		}]);
		return ITF14;
	}(_ITF3.default);
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/ITF/index.js
var require_ITF = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ITF14 = exports.ITF = void 0;
	var _ITF2 = _interopRequireDefault(require_ITF$1());
	var _ITF4 = _interopRequireDefault(require_ITF14());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	exports.ITF = _ITF2.default;
	exports.ITF14 = _ITF4.default;
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/MSI/MSI.js
var require_MSI$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _createClass = function() {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}
		return function(Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();
	var _Barcode3 = _interopRequireDefault(require_Barcode());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	function _possibleConstructorReturn(self, call) {
		if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}
	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
			value: subClass,
			enumerable: false,
			writable: true,
			configurable: true
		} });
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	var MSI = function(_Barcode) {
		_inherits(MSI, _Barcode);
		function MSI(data, options) {
			_classCallCheck(this, MSI);
			return _possibleConstructorReturn(this, (MSI.__proto__ || Object.getPrototypeOf(MSI)).call(this, data, options));
		}
		_createClass(MSI, [{
			key: "encode",
			value: function encode() {
				var ret = "110";
				for (var i = 0; i < this.data.length; i++) {
					var bin = parseInt(this.data[i]).toString(2);
					bin = addZeroes(bin, 4 - bin.length);
					for (var b = 0; b < bin.length; b++) ret += bin[b] == "0" ? "100" : "110";
				}
				ret += "1001";
				return {
					data: ret,
					text: this.text
				};
			}
		}, {
			key: "valid",
			value: function valid() {
				return this.data.search(/^[0-9]+$/) !== -1;
			}
		}]);
		return MSI;
	}(_Barcode3.default);
	function addZeroes(number, n) {
		for (var i = 0; i < n; i++) number = "0" + number;
		return number;
	}
	exports.default = MSI;
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/MSI/checksums.js
var require_checksums = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.mod10 = mod10;
	exports.mod11 = mod11;
	function mod10(number) {
		var sum = 0;
		for (var i = 0; i < number.length; i++) {
			var n = parseInt(number[i]);
			if ((i + number.length) % 2 === 0) sum += n;
			else sum += n * 2 % 10 + Math.floor(n * 2 / 10);
		}
		return (10 - sum % 10) % 10;
	}
	function mod11(number) {
		var sum = 0;
		var weights = [
			2,
			3,
			4,
			5,
			6,
			7
		];
		for (var i = 0; i < number.length; i++) {
			var n = parseInt(number[number.length - 1 - i]);
			sum += weights[i % weights.length] * n;
		}
		return (11 - sum % 11) % 11;
	}
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/MSI/MSI10.js
var require_MSI10 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _MSI3 = _interopRequireDefault(require_MSI$1());
	var _checksums = require_checksums();
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	function _possibleConstructorReturn(self, call) {
		if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}
	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
			value: subClass,
			enumerable: false,
			writable: true,
			configurable: true
		} });
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	exports.default = function(_MSI) {
		_inherits(MSI10, _MSI);
		function MSI10(data, options) {
			_classCallCheck(this, MSI10);
			return _possibleConstructorReturn(this, (MSI10.__proto__ || Object.getPrototypeOf(MSI10)).call(this, data + (0, _checksums.mod10)(data), options));
		}
		return MSI10;
	}(_MSI3.default);
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/MSI/MSI11.js
var require_MSI11 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _MSI3 = _interopRequireDefault(require_MSI$1());
	var _checksums = require_checksums();
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	function _possibleConstructorReturn(self, call) {
		if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}
	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
			value: subClass,
			enumerable: false,
			writable: true,
			configurable: true
		} });
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	exports.default = function(_MSI) {
		_inherits(MSI11, _MSI);
		function MSI11(data, options) {
			_classCallCheck(this, MSI11);
			return _possibleConstructorReturn(this, (MSI11.__proto__ || Object.getPrototypeOf(MSI11)).call(this, data + (0, _checksums.mod11)(data), options));
		}
		return MSI11;
	}(_MSI3.default);
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/MSI/MSI1010.js
var require_MSI1010 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _MSI3 = _interopRequireDefault(require_MSI$1());
	var _checksums = require_checksums();
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	function _possibleConstructorReturn(self, call) {
		if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}
	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
			value: subClass,
			enumerable: false,
			writable: true,
			configurable: true
		} });
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	exports.default = function(_MSI) {
		_inherits(MSI1010, _MSI);
		function MSI1010(data, options) {
			_classCallCheck(this, MSI1010);
			data += (0, _checksums.mod10)(data);
			data += (0, _checksums.mod10)(data);
			return _possibleConstructorReturn(this, (MSI1010.__proto__ || Object.getPrototypeOf(MSI1010)).call(this, data, options));
		}
		return MSI1010;
	}(_MSI3.default);
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/MSI/MSI1110.js
var require_MSI1110 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _MSI3 = _interopRequireDefault(require_MSI$1());
	var _checksums = require_checksums();
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	function _possibleConstructorReturn(self, call) {
		if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}
	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
			value: subClass,
			enumerable: false,
			writable: true,
			configurable: true
		} });
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	exports.default = function(_MSI) {
		_inherits(MSI1110, _MSI);
		function MSI1110(data, options) {
			_classCallCheck(this, MSI1110);
			data += (0, _checksums.mod11)(data);
			data += (0, _checksums.mod10)(data);
			return _possibleConstructorReturn(this, (MSI1110.__proto__ || Object.getPrototypeOf(MSI1110)).call(this, data, options));
		}
		return MSI1110;
	}(_MSI3.default);
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/MSI/index.js
var require_MSI = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MSI1110 = exports.MSI1010 = exports.MSI11 = exports.MSI10 = exports.MSI = void 0;
	var _MSI2 = _interopRequireDefault(require_MSI$1());
	var _MSI4 = _interopRequireDefault(require_MSI10());
	var _MSI6 = _interopRequireDefault(require_MSI11());
	var _MSI8 = _interopRequireDefault(require_MSI1010());
	var _MSI10 = _interopRequireDefault(require_MSI1110());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	exports.MSI = _MSI2.default;
	exports.MSI10 = _MSI4.default;
	exports.MSI11 = _MSI6.default;
	exports.MSI1010 = _MSI8.default;
	exports.MSI1110 = _MSI10.default;
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/pharmacode/index.js
var require_pharmacode = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.pharmacode = void 0;
	var _createClass = function() {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}
		return function(Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();
	var _Barcode3 = _interopRequireDefault(require_Barcode());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	function _possibleConstructorReturn(self, call) {
		if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}
	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
			value: subClass,
			enumerable: false,
			writable: true,
			configurable: true
		} });
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	exports.pharmacode = function(_Barcode) {
		_inherits(pharmacode, _Barcode);
		function pharmacode(data, options) {
			_classCallCheck(this, pharmacode);
			var _this = _possibleConstructorReturn(this, (pharmacode.__proto__ || Object.getPrototypeOf(pharmacode)).call(this, data, options));
			_this.number = parseInt(data, 10);
			return _this;
		}
		_createClass(pharmacode, [{
			key: "encode",
			value: function encode() {
				var z = this.number;
				var result = "";
				while (!isNaN(z) && z != 0) if (z % 2 === 0) {
					result = "11100" + result;
					z = (z - 2) / 2;
				} else {
					result = "100" + result;
					z = (z - 1) / 2;
				}
				result = result.slice(0, -2);
				return {
					data: result,
					text: this.text
				};
			}
		}, {
			key: "valid",
			value: function valid() {
				return this.number >= 3 && this.number <= 131070;
			}
		}]);
		return pharmacode;
	}(_Barcode3.default);
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/codabar/index.js
var require_codabar = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.codabar = void 0;
	var _createClass = function() {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}
		return function(Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();
	var _Barcode3 = _interopRequireDefault(require_Barcode());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	function _possibleConstructorReturn(self, call) {
		if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}
	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
			value: subClass,
			enumerable: false,
			writable: true,
			configurable: true
		} });
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	exports.codabar = function(_Barcode) {
		_inherits(codabar, _Barcode);
		function codabar(data, options) {
			_classCallCheck(this, codabar);
			if (data.search(/^[0-9\-\$\:\.\+\/]+$/) === 0) data = "A" + data + "A";
			var _this = _possibleConstructorReturn(this, (codabar.__proto__ || Object.getPrototypeOf(codabar)).call(this, data.toUpperCase(), options));
			_this.text = _this.options.text || _this.text.replace(/[A-D]/g, "");
			return _this;
		}
		_createClass(codabar, [
			{
				key: "valid",
				value: function valid() {
					return this.data.search(/^[A-D][0-9\-\$\:\.\+\/]+[A-D]$/) !== -1;
				}
			},
			{
				key: "encode",
				value: function encode() {
					var result = [];
					var encodings = this.getEncodings();
					for (var i = 0; i < this.data.length; i++) {
						result.push(encodings[this.data.charAt(i)]);
						if (i !== this.data.length - 1) result.push("0");
					}
					return {
						text: this.text,
						data: result.join("")
					};
				}
			},
			{
				key: "getEncodings",
				value: function getEncodings() {
					return {
						"0": "101010011",
						"1": "101011001",
						"2": "101001011",
						"3": "110010101",
						"4": "101101001",
						"5": "110101001",
						"6": "100101011",
						"7": "100101101",
						"8": "100110101",
						"9": "110100101",
						"-": "101001101",
						"$": "101100101",
						":": "1101011011",
						"/": "1101101011",
						".": "1101101101",
						"+": "1011011011",
						"A": "1011001001",
						"B": "1001001011",
						"C": "1010010011",
						"D": "1010011001"
					};
				}
			}
		]);
		return codabar;
	}(_Barcode3.default);
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/CODE93/constants.js
var require_constants = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SYMBOLS = [
		"0",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"A",
		"B",
		"C",
		"D",
		"E",
		"F",
		"G",
		"H",
		"I",
		"J",
		"K",
		"L",
		"M",
		"N",
		"O",
		"P",
		"Q",
		"R",
		"S",
		"T",
		"U",
		"V",
		"W",
		"X",
		"Y",
		"Z",
		"-",
		".",
		" ",
		"$",
		"/",
		"+",
		"%",
		"($)",
		"(%)",
		"(/)",
		"(+)",
		"ÿ"
	];
	exports.BINARIES = [
		"100010100",
		"101001000",
		"101000100",
		"101000010",
		"100101000",
		"100100100",
		"100100010",
		"101010000",
		"100010010",
		"100001010",
		"110101000",
		"110100100",
		"110100010",
		"110010100",
		"110010010",
		"110001010",
		"101101000",
		"101100100",
		"101100010",
		"100110100",
		"100011010",
		"101011000",
		"101001100",
		"101000110",
		"100101100",
		"100010110",
		"110110100",
		"110110010",
		"110101100",
		"110100110",
		"110010110",
		"110011010",
		"101101100",
		"101100110",
		"100110110",
		"100111010",
		"100101110",
		"111010100",
		"111010010",
		"111001010",
		"101101110",
		"101110110",
		"110101110",
		"100100110",
		"111011010",
		"111010110",
		"100110010",
		"101011110"
	];
	exports.MULTI_SYMBOLS = {
		"\0": ["(%)", "U"],
		"": ["($)", "A"],
		"": ["($)", "B"],
		"": ["($)", "C"],
		"": ["($)", "D"],
		"": ["($)", "E"],
		"": ["($)", "F"],
		"\x07": ["($)", "G"],
		"\b": ["($)", "H"],
		"	": ["($)", "I"],
		"\n": ["($)", "J"],
		"\v": ["($)", "K"],
		"\f": ["($)", "L"],
		"\r": ["($)", "M"],
		"": ["($)", "N"],
		"": ["($)", "O"],
		"": ["($)", "P"],
		"": ["($)", "Q"],
		"": ["($)", "R"],
		"": ["($)", "S"],
		"": ["($)", "T"],
		"": ["($)", "U"],
		"": ["($)", "V"],
		"": ["($)", "W"],
		"": ["($)", "X"],
		"": ["($)", "Y"],
		"": ["($)", "Z"],
		"\x1B": ["(%)", "A"],
		"": ["(%)", "B"],
		"": ["(%)", "C"],
		"": ["(%)", "D"],
		"": ["(%)", "E"],
		"!": ["(/)", "A"],
		"\"": ["(/)", "B"],
		"#": ["(/)", "C"],
		"&": ["(/)", "F"],
		"'": ["(/)", "G"],
		"(": ["(/)", "H"],
		")": ["(/)", "I"],
		"*": ["(/)", "J"],
		",": ["(/)", "L"],
		":": ["(/)", "Z"],
		";": ["(%)", "F"],
		"<": ["(%)", "G"],
		"=": ["(%)", "H"],
		">": ["(%)", "I"],
		"?": ["(%)", "J"],
		"@": ["(%)", "V"],
		"[": ["(%)", "K"],
		"\\": ["(%)", "L"],
		"]": ["(%)", "M"],
		"^": ["(%)", "N"],
		"_": ["(%)", "O"],
		"`": ["(%)", "W"],
		"a": ["(+)", "A"],
		"b": ["(+)", "B"],
		"c": ["(+)", "C"],
		"d": ["(+)", "D"],
		"e": ["(+)", "E"],
		"f": ["(+)", "F"],
		"g": ["(+)", "G"],
		"h": ["(+)", "H"],
		"i": ["(+)", "I"],
		"j": ["(+)", "J"],
		"k": ["(+)", "K"],
		"l": ["(+)", "L"],
		"m": ["(+)", "M"],
		"n": ["(+)", "N"],
		"o": ["(+)", "O"],
		"p": ["(+)", "P"],
		"q": ["(+)", "Q"],
		"r": ["(+)", "R"],
		"s": ["(+)", "S"],
		"t": ["(+)", "T"],
		"u": ["(+)", "U"],
		"v": ["(+)", "V"],
		"w": ["(+)", "W"],
		"x": ["(+)", "X"],
		"y": ["(+)", "Y"],
		"z": ["(+)", "Z"],
		"{": ["(%)", "P"],
		"|": ["(%)", "Q"],
		"}": ["(%)", "R"],
		"~": ["(%)", "S"],
		"": ["(%)", "T"]
	};
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/CODE93/CODE93.js
var require_CODE93$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _createClass = function() {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}
		return function(Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();
	var _constants = require_constants();
	var _Barcode3 = _interopRequireDefault(require_Barcode());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	function _possibleConstructorReturn(self, call) {
		if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}
	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
			value: subClass,
			enumerable: false,
			writable: true,
			configurable: true
		} });
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	exports.default = function(_Barcode) {
		_inherits(CODE93, _Barcode);
		function CODE93(data, options) {
			_classCallCheck(this, CODE93);
			return _possibleConstructorReturn(this, (CODE93.__proto__ || Object.getPrototypeOf(CODE93)).call(this, data, options));
		}
		_createClass(CODE93, [{
			key: "valid",
			value: function valid() {
				return /^[0-9A-Z\-. $/+%]+$/.test(this.data);
			}
		}, {
			key: "encode",
			value: function encode() {
				var symbols = this.data.split("").flatMap(function(c) {
					return _constants.MULTI_SYMBOLS[c] || c;
				});
				var encoded = symbols.map(function(s) {
					return CODE93.getEncoding(s);
				}).join("");
				var csumC = CODE93.checksum(symbols, 20);
				var csumK = CODE93.checksum(symbols.concat(csumC), 15);
				return {
					text: this.text,
					data: CODE93.getEncoding("ÿ") + encoded + CODE93.getEncoding(csumC) + CODE93.getEncoding(csumK) + CODE93.getEncoding("ÿ") + "1"
				};
			}
		}], [
			{
				key: "getEncoding",
				value: function getEncoding(symbol) {
					return _constants.BINARIES[CODE93.symbolValue(symbol)];
				}
			},
			{
				key: "getSymbol",
				value: function getSymbol(symbolValue) {
					return _constants.SYMBOLS[symbolValue];
				}
			},
			{
				key: "symbolValue",
				value: function symbolValue(symbol) {
					return _constants.SYMBOLS.indexOf(symbol);
				}
			},
			{
				key: "checksum",
				value: function checksum(symbols, maxWeight) {
					var csum = symbols.slice().reverse().reduce(function(sum, symbol, idx) {
						var weight = idx % maxWeight + 1;
						return sum + CODE93.symbolValue(symbol) * weight;
					}, 0);
					return CODE93.getSymbol(csum % 47);
				}
			}
		]);
		return CODE93;
	}(_Barcode3.default);
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/CODE93/CODE93FullASCII.js
var require_CODE93FullASCII = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _createClass = function() {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}
		return function(Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();
	var _CODE3 = _interopRequireDefault(require_CODE93$1());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	function _possibleConstructorReturn(self, call) {
		if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}
	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
			value: subClass,
			enumerable: false,
			writable: true,
			configurable: true
		} });
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	exports.default = function(_CODE) {
		_inherits(CODE93FullASCII, _CODE);
		function CODE93FullASCII(data, options) {
			_classCallCheck(this, CODE93FullASCII);
			return _possibleConstructorReturn(this, (CODE93FullASCII.__proto__ || Object.getPrototypeOf(CODE93FullASCII)).call(this, data, options));
		}
		_createClass(CODE93FullASCII, [{
			key: "valid",
			value: function valid() {
				return /^[\x00-\x7f]+$/.test(this.data);
			}
		}]);
		return CODE93FullASCII;
	}(_CODE3.default);
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/CODE93/index.js
var require_CODE93 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.CODE93FullASCII = exports.CODE93 = void 0;
	var _CODE2 = _interopRequireDefault(require_CODE93$1());
	var _CODE93FullASCII2 = _interopRequireDefault(require_CODE93FullASCII());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	exports.CODE93 = _CODE2.default;
	exports.CODE93FullASCII = _CODE93FullASCII2.default;
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/GenericBarcode/index.js
var require_GenericBarcode = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.GenericBarcode = void 0;
	var _createClass = function() {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}
		return function(Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();
	var _Barcode3 = _interopRequireDefault(require_Barcode());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	function _possibleConstructorReturn(self, call) {
		if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}
	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
			value: subClass,
			enumerable: false,
			writable: true,
			configurable: true
		} });
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	exports.GenericBarcode = function(_Barcode) {
		_inherits(GenericBarcode, _Barcode);
		function GenericBarcode(data, options) {
			_classCallCheck(this, GenericBarcode);
			return _possibleConstructorReturn(this, (GenericBarcode.__proto__ || Object.getPrototypeOf(GenericBarcode)).call(this, data, options));
		}
		_createClass(GenericBarcode, [{
			key: "encode",
			value: function encode() {
				return {
					data: "10101010101010101010101010101010101010101",
					text: this.text
				};
			}
		}, {
			key: "valid",
			value: function valid() {
				return true;
			}
		}]);
		return GenericBarcode;
	}(_Barcode3.default);
}));
//#endregion
//#region node_modules/jsbarcode/bin/barcodes/index.js
var require_barcodes = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _CODE = require_CODE39();
	var _CODE2 = require_CODE128();
	var _EAN_UPC = require_EAN_UPC();
	var _ITF = require_ITF();
	var _MSI = require_MSI();
	var _pharmacode = require_pharmacode();
	var _codabar = require_codabar();
	var _CODE3 = require_CODE93();
	var _GenericBarcode = require_GenericBarcode();
	exports.default = {
		CODE39: _CODE.CODE39,
		CODE128: _CODE2.CODE128,
		CODE128A: _CODE2.CODE128A,
		CODE128B: _CODE2.CODE128B,
		CODE128C: _CODE2.CODE128C,
		EAN13: _EAN_UPC.EAN13,
		EAN8: _EAN_UPC.EAN8,
		EAN5: _EAN_UPC.EAN5,
		EAN2: _EAN_UPC.EAN2,
		UPC: _EAN_UPC.UPC,
		UPCE: _EAN_UPC.UPCE,
		ITF14: _ITF.ITF14,
		ITF: _ITF.ITF,
		MSI: _MSI.MSI,
		MSI10: _MSI.MSI10,
		MSI11: _MSI.MSI11,
		MSI1010: _MSI.MSI1010,
		MSI1110: _MSI.MSI1110,
		pharmacode: _pharmacode.pharmacode,
		codabar: _codabar.codabar,
		CODE93: _CODE3.CODE93,
		CODE93FullASCII: _CODE3.CODE93FullASCII,
		GenericBarcode: _GenericBarcode.GenericBarcode
	};
}));
//#endregion
//#region node_modules/jsbarcode/bin/help/merge.js
var require_merge = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _extends = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	exports.default = function(old, replaceObj) {
		return _extends({}, old, replaceObj);
	};
}));
//#endregion
//#region node_modules/jsbarcode/bin/help/linearizeEncodings.js
var require_linearizeEncodings = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = linearizeEncodings;
	function linearizeEncodings(encodings) {
		var linearEncodings = [];
		function nextLevel(encoded) {
			if (Array.isArray(encoded)) for (var i = 0; i < encoded.length; i++) nextLevel(encoded[i]);
			else {
				encoded.text = encoded.text || "";
				encoded.data = encoded.data || "";
				linearEncodings.push(encoded);
			}
		}
		nextLevel(encodings);
		return linearEncodings;
	}
}));
//#endregion
//#region node_modules/jsbarcode/bin/help/fixOptions.js
var require_fixOptions = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = fixOptions;
	function fixOptions(options) {
		options.marginTop = options.marginTop || options.margin;
		options.marginBottom = options.marginBottom || options.margin;
		options.marginRight = options.marginRight || options.margin;
		options.marginLeft = options.marginLeft || options.margin;
		return options;
	}
}));
//#endregion
//#region node_modules/jsbarcode/bin/help/optionsFromStrings.js
var require_optionsFromStrings = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = optionsFromStrings;
	function optionsFromStrings(options) {
		var intOptions = [
			"width",
			"height",
			"textMargin",
			"fontSize",
			"margin",
			"marginTop",
			"marginBottom",
			"marginLeft",
			"marginRight"
		];
		for (var intOption in intOptions) if (intOptions.hasOwnProperty(intOption)) {
			intOption = intOptions[intOption];
			if (typeof options[intOption] === "string") options[intOption] = parseInt(options[intOption], 10);
		}
		if (typeof options["displayValue"] === "string") options["displayValue"] = options["displayValue"] != "false";
		return options;
	}
}));
//#endregion
//#region node_modules/jsbarcode/bin/options/defaults.js
var require_defaults = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {
		width: 2,
		height: 100,
		format: "auto",
		displayValue: true,
		fontOptions: "",
		font: "monospace",
		text: void 0,
		textAlign: "center",
		textPosition: "bottom",
		textMargin: 2,
		fontSize: 20,
		background: "#ffffff",
		lineColor: "#000000",
		margin: 10,
		marginTop: void 0,
		marginBottom: void 0,
		marginLeft: void 0,
		marginRight: void 0,
		valid: function valid() {}
	};
}));
//#endregion
//#region node_modules/jsbarcode/bin/help/getOptionsFromElement.js
var require_getOptionsFromElement = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _optionsFromStrings2 = _interopRequireDefault(require_optionsFromStrings());
	var _defaults2 = _interopRequireDefault(require_defaults());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function getOptionsFromElement(element) {
		var options = {};
		for (var property in _defaults2.default) if (_defaults2.default.hasOwnProperty(property)) {
			if (element.hasAttribute("jsbarcode-" + property.toLowerCase())) options[property] = element.getAttribute("jsbarcode-" + property.toLowerCase());
			if (element.hasAttribute("data-" + property.toLowerCase())) options[property] = element.getAttribute("data-" + property.toLowerCase());
		}
		options["value"] = element.getAttribute("jsbarcode-value") || element.getAttribute("data-value");
		options = (0, _optionsFromStrings2.default)(options);
		return options;
	}
	exports.default = getOptionsFromElement;
}));
//#endregion
//#region node_modules/jsbarcode/bin/renderers/shared.js
var require_shared = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getTotalWidthOfEncodings = exports.calculateEncodingAttributes = exports.getBarcodePadding = exports.getEncodingHeight = exports.getMaximumHeightOfEncodings = void 0;
	var _merge2 = _interopRequireDefault(require_merge());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function getEncodingHeight(encoding, options) {
		return options.height + (options.displayValue && encoding.text.length > 0 ? options.fontSize + options.textMargin : 0) + options.marginTop + options.marginBottom;
	}
	function getBarcodePadding(textWidth, barcodeWidth, options) {
		if (options.displayValue && barcodeWidth < textWidth) {
			if (options.textAlign == "center") return Math.floor((textWidth - barcodeWidth) / 2);
			else if (options.textAlign == "left") return 0;
			else if (options.textAlign == "right") return Math.floor(textWidth - barcodeWidth);
		}
		return 0;
	}
	function calculateEncodingAttributes(encodings, barcodeOptions, context) {
		for (var i = 0; i < encodings.length; i++) {
			var encoding = encodings[i];
			var options = (0, _merge2.default)(barcodeOptions, encoding.options);
			var textWidth;
			if (options.displayValue) textWidth = messureText(encoding.text, options, context);
			else textWidth = 0;
			var barcodeWidth = encoding.data.length * options.width;
			encoding.width = Math.ceil(Math.max(textWidth, barcodeWidth));
			encoding.height = getEncodingHeight(encoding, options);
			encoding.barcodePadding = getBarcodePadding(textWidth, barcodeWidth, options);
		}
	}
	function getTotalWidthOfEncodings(encodings) {
		var totalWidth = 0;
		for (var i = 0; i < encodings.length; i++) totalWidth += encodings[i].width;
		return totalWidth;
	}
	function getMaximumHeightOfEncodings(encodings) {
		var maxHeight = 0;
		for (var i = 0; i < encodings.length; i++) if (encodings[i].height > maxHeight) maxHeight = encodings[i].height;
		return maxHeight;
	}
	function messureText(string, options, context) {
		var ctx;
		if (context) ctx = context;
		else if (typeof document !== "undefined") ctx = document.createElement("canvas").getContext("2d");
		else return 0;
		ctx.font = options.fontOptions + " " + options.fontSize + "px " + options.font;
		var measureTextResult = ctx.measureText(string);
		if (!measureTextResult) return 0;
		return measureTextResult.width;
	}
	exports.getMaximumHeightOfEncodings = getMaximumHeightOfEncodings;
	exports.getEncodingHeight = getEncodingHeight;
	exports.getBarcodePadding = getBarcodePadding;
	exports.calculateEncodingAttributes = calculateEncodingAttributes;
	exports.getTotalWidthOfEncodings = getTotalWidthOfEncodings;
}));
//#endregion
//#region node_modules/jsbarcode/bin/renderers/canvas.js
var require_canvas = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _createClass = function() {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}
		return function(Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();
	var _merge2 = _interopRequireDefault(require_merge());
	var _shared = require_shared();
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	exports.default = function() {
		function CanvasRenderer(canvas, encodings, options) {
			_classCallCheck(this, CanvasRenderer);
			this.canvas = canvas;
			this.encodings = encodings;
			this.options = options;
		}
		_createClass(CanvasRenderer, [
			{
				key: "render",
				value: function render() {
					if (!this.canvas.getContext) throw new Error("The browser does not support canvas.");
					this.prepareCanvas();
					for (var i = 0; i < this.encodings.length; i++) {
						var encodingOptions = (0, _merge2.default)(this.options, this.encodings[i].options);
						this.drawCanvasBarcode(encodingOptions, this.encodings[i]);
						this.drawCanvasText(encodingOptions, this.encodings[i]);
						this.moveCanvasDrawing(this.encodings[i]);
					}
					this.restoreCanvas();
				}
			},
			{
				key: "prepareCanvas",
				value: function prepareCanvas() {
					var ctx = this.canvas.getContext("2d");
					ctx.save();
					(0, _shared.calculateEncodingAttributes)(this.encodings, this.options, ctx);
					var totalWidth = (0, _shared.getTotalWidthOfEncodings)(this.encodings);
					var maxHeight = (0, _shared.getMaximumHeightOfEncodings)(this.encodings);
					this.canvas.width = totalWidth + this.options.marginLeft + this.options.marginRight;
					this.canvas.height = maxHeight;
					ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
					if (this.options.background) {
						ctx.fillStyle = this.options.background;
						ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
					}
					ctx.translate(this.options.marginLeft, 0);
				}
			},
			{
				key: "drawCanvasBarcode",
				value: function drawCanvasBarcode(options, encoding) {
					var ctx = this.canvas.getContext("2d");
					var binary = encoding.data;
					var yFrom;
					if (options.textPosition == "top") yFrom = options.marginTop + options.fontSize + options.textMargin;
					else yFrom = options.marginTop;
					ctx.fillStyle = options.lineColor;
					for (var b = 0; b < binary.length; b++) {
						var x = b * options.width + encoding.barcodePadding;
						if (binary[b] === "1") ctx.fillRect(x, yFrom, options.width, options.height);
						else if (binary[b]) ctx.fillRect(x, yFrom, options.width, options.height * binary[b]);
					}
				}
			},
			{
				key: "drawCanvasText",
				value: function drawCanvasText(options, encoding) {
					var ctx = this.canvas.getContext("2d");
					var font = options.fontOptions + " " + options.fontSize + "px " + options.font;
					if (options.displayValue) {
						var x, y;
						if (options.textPosition == "top") y = options.marginTop + options.fontSize - options.textMargin;
						else y = options.height + options.textMargin + options.marginTop + options.fontSize;
						ctx.font = font;
						if (options.textAlign == "left" || encoding.barcodePadding > 0) {
							x = 0;
							ctx.textAlign = "left";
						} else if (options.textAlign == "right") {
							x = encoding.width - 1;
							ctx.textAlign = "right";
						} else {
							x = encoding.width / 2;
							ctx.textAlign = "center";
						}
						ctx.fillText(encoding.text, x, y);
					}
				}
			},
			{
				key: "moveCanvasDrawing",
				value: function moveCanvasDrawing(encoding) {
					this.canvas.getContext("2d").translate(encoding.width, 0);
				}
			},
			{
				key: "restoreCanvas",
				value: function restoreCanvas() {
					this.canvas.getContext("2d").restore();
				}
			}
		]);
		return CanvasRenderer;
	}();
}));
//#endregion
//#region node_modules/jsbarcode/bin/renderers/svg.js
var require_svg = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _createClass = function() {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}
		return function(Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();
	var _merge2 = _interopRequireDefault(require_merge());
	var _shared = require_shared();
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	var svgns = "http://www.w3.org/2000/svg";
	exports.default = function() {
		function SVGRenderer(svg, encodings, options) {
			_classCallCheck(this, SVGRenderer);
			this.svg = svg;
			this.encodings = encodings;
			this.options = options;
			this.document = options.xmlDocument || document;
		}
		_createClass(SVGRenderer, [
			{
				key: "render",
				value: function render() {
					var currentX = this.options.marginLeft;
					this.prepareSVG();
					for (var i = 0; i < this.encodings.length; i++) {
						var encoding = this.encodings[i];
						var encodingOptions = (0, _merge2.default)(this.options, encoding.options);
						var group = this.createGroup(currentX, encodingOptions.marginTop, this.svg);
						this.setGroupOptions(group, encodingOptions);
						this.drawSvgBarcode(group, encodingOptions, encoding);
						this.drawSVGText(group, encodingOptions, encoding);
						currentX += encoding.width;
					}
				}
			},
			{
				key: "prepareSVG",
				value: function prepareSVG() {
					while (this.svg.firstChild) this.svg.removeChild(this.svg.firstChild);
					(0, _shared.calculateEncodingAttributes)(this.encodings, this.options);
					var totalWidth = (0, _shared.getTotalWidthOfEncodings)(this.encodings);
					var maxHeight = (0, _shared.getMaximumHeightOfEncodings)(this.encodings);
					var width = totalWidth + this.options.marginLeft + this.options.marginRight;
					this.setSvgAttributes(width, maxHeight);
					if (this.options.background) this.drawRect(0, 0, width, maxHeight, this.svg).setAttribute("fill", this.options.background);
				}
			},
			{
				key: "drawSvgBarcode",
				value: function drawSvgBarcode(parent, options, encoding) {
					var binary = encoding.data;
					var yFrom;
					if (options.textPosition == "top") yFrom = options.fontSize + options.textMargin;
					else yFrom = 0;
					var barWidth = 0;
					var x = 0;
					for (var b = 0; b < binary.length; b++) {
						x = b * options.width + encoding.barcodePadding;
						if (binary[b] === "1") barWidth++;
						else if (barWidth > 0) {
							this.drawRect(x - options.width * barWidth, yFrom, options.width * barWidth, options.height, parent);
							barWidth = 0;
						}
					}
					if (barWidth > 0) this.drawRect(x - options.width * (barWidth - 1), yFrom, options.width * barWidth, options.height, parent);
				}
			},
			{
				key: "drawSVGText",
				value: function drawSVGText(parent, options, encoding) {
					var textElem = this.document.createElementNS(svgns, "text");
					if (options.displayValue) {
						var x, y;
						textElem.setAttribute("font-family", options.font);
						textElem.setAttribute("font-size", options.fontSize);
						if (options.fontOptions.includes("bold")) textElem.setAttribute("font-weight", "bold");
						if (options.fontOptions.includes("italic")) textElem.setAttribute("font-style", "italic");
						if (options.textPosition == "top") y = options.fontSize - options.textMargin;
						else y = options.height + options.textMargin + options.fontSize;
						if (options.textAlign == "left" || encoding.barcodePadding > 0) {
							x = 0;
							textElem.setAttribute("text-anchor", "start");
						} else if (options.textAlign == "right") {
							x = encoding.width - 1;
							textElem.setAttribute("text-anchor", "end");
						} else {
							x = encoding.width / 2;
							textElem.setAttribute("text-anchor", "middle");
						}
						textElem.setAttribute("x", x);
						textElem.setAttribute("y", y);
						textElem.appendChild(this.document.createTextNode(encoding.text));
						parent.appendChild(textElem);
					}
				}
			},
			{
				key: "setSvgAttributes",
				value: function setSvgAttributes(width, height) {
					var svg = this.svg;
					svg.setAttribute("width", width + "px");
					svg.setAttribute("height", height + "px");
					svg.setAttribute("x", "0px");
					svg.setAttribute("y", "0px");
					svg.setAttribute("viewBox", "0 0 " + width + " " + height);
					svg.setAttribute("xmlns", svgns);
					svg.setAttribute("version", "1.1");
				}
			},
			{
				key: "createGroup",
				value: function createGroup(x, y, parent) {
					var group = this.document.createElementNS(svgns, "g");
					group.setAttribute("transform", "translate(" + x + ", " + y + ")");
					parent.appendChild(group);
					return group;
				}
			},
			{
				key: "setGroupOptions",
				value: function setGroupOptions(group, options) {
					group.setAttribute("fill", options.lineColor);
				}
			},
			{
				key: "drawRect",
				value: function drawRect(x, y, width, height, parent) {
					var rect = this.document.createElementNS(svgns, "rect");
					rect.setAttribute("x", x);
					rect.setAttribute("y", y);
					rect.setAttribute("width", width);
					rect.setAttribute("height", height);
					parent.appendChild(rect);
					return rect;
				}
			}
		]);
		return SVGRenderer;
	}();
}));
//#endregion
//#region node_modules/jsbarcode/bin/renderers/object.js
var require_object = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _createClass = function() {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}
		return function(Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	exports.default = function() {
		function ObjectRenderer(object, encodings, options) {
			_classCallCheck(this, ObjectRenderer);
			this.object = object;
			this.encodings = encodings;
			this.options = options;
		}
		_createClass(ObjectRenderer, [{
			key: "render",
			value: function render() {
				this.object.encodings = this.encodings;
			}
		}]);
		return ObjectRenderer;
	}();
}));
//#endregion
//#region node_modules/jsbarcode/bin/renderers/index.js
var require_renderers = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _canvas2 = _interopRequireDefault(require_canvas());
	var _svg2 = _interopRequireDefault(require_svg());
	var _object2 = _interopRequireDefault(require_object());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	exports.default = {
		CanvasRenderer: _canvas2.default,
		SVGRenderer: _svg2.default,
		ObjectRenderer: _object2.default
	};
}));
//#endregion
//#region node_modules/jsbarcode/bin/exceptions/exceptions.js
var require_exceptions = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	function _possibleConstructorReturn(self, call) {
		if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}
	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
			value: subClass,
			enumerable: false,
			writable: true,
			configurable: true
		} });
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}
	var InvalidInputException = function(_Error) {
		_inherits(InvalidInputException, _Error);
		function InvalidInputException(symbology, input) {
			_classCallCheck(this, InvalidInputException);
			var _this = _possibleConstructorReturn(this, (InvalidInputException.__proto__ || Object.getPrototypeOf(InvalidInputException)).call(this));
			_this.name = "InvalidInputException";
			_this.symbology = symbology;
			_this.input = input;
			_this.message = "\"" + _this.input + "\" is not a valid input for " + _this.symbology;
			return _this;
		}
		return InvalidInputException;
	}(Error);
	var InvalidElementException = function(_Error2) {
		_inherits(InvalidElementException, _Error2);
		function InvalidElementException() {
			_classCallCheck(this, InvalidElementException);
			var _this2 = _possibleConstructorReturn(this, (InvalidElementException.__proto__ || Object.getPrototypeOf(InvalidElementException)).call(this));
			_this2.name = "InvalidElementException";
			_this2.message = "Not supported type to render on";
			return _this2;
		}
		return InvalidElementException;
	}(Error);
	var NoElementException = function(_Error3) {
		_inherits(NoElementException, _Error3);
		function NoElementException() {
			_classCallCheck(this, NoElementException);
			var _this3 = _possibleConstructorReturn(this, (NoElementException.__proto__ || Object.getPrototypeOf(NoElementException)).call(this));
			_this3.name = "NoElementException";
			_this3.message = "No element to render on.";
			return _this3;
		}
		return NoElementException;
	}(Error);
	exports.InvalidInputException = InvalidInputException;
	exports.InvalidElementException = InvalidElementException;
	exports.NoElementException = NoElementException;
}));
//#endregion
//#region node_modules/jsbarcode/bin/help/getRenderProperties.js
var require_getRenderProperties = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
		return typeof obj;
	} : function(obj) {
		return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};
	var _getOptionsFromElement2 = _interopRequireDefault(require_getOptionsFromElement());
	var _renderers2 = _interopRequireDefault(require_renderers());
	var _exceptions = require_exceptions();
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	function getRenderProperties(element) {
		if (typeof element === "string") return querySelectedRenderProperties(element);
		else if (Array.isArray(element)) {
			var returnArray = [];
			for (var i = 0; i < element.length; i++) returnArray.push(getRenderProperties(element[i]));
			return returnArray;
		} else if (typeof HTMLCanvasElement !== "undefined" && element instanceof HTMLImageElement) return newCanvasRenderProperties(element);
		else if (element && element.nodeName && element.nodeName.toLowerCase() === "svg" || typeof SVGElement !== "undefined" && element instanceof SVGElement) return {
			element,
			options: (0, _getOptionsFromElement2.default)(element),
			renderer: _renderers2.default.SVGRenderer
		};
		else if (typeof HTMLCanvasElement !== "undefined" && element instanceof HTMLCanvasElement) return {
			element,
			options: (0, _getOptionsFromElement2.default)(element),
			renderer: _renderers2.default.CanvasRenderer
		};
		else if (element && element.getContext) return {
			element,
			renderer: _renderers2.default.CanvasRenderer
		};
		else if (element && (typeof element === "undefined" ? "undefined" : _typeof(element)) === "object" && !element.nodeName) return {
			element,
			renderer: _renderers2.default.ObjectRenderer
		};
		else throw new _exceptions.InvalidElementException();
	}
	function querySelectedRenderProperties(string) {
		var selector = document.querySelectorAll(string);
		if (selector.length === 0) return;
		else {
			var returnArray = [];
			for (var i = 0; i < selector.length; i++) returnArray.push(getRenderProperties(selector[i]));
			return returnArray;
		}
	}
	function newCanvasRenderProperties(imgElement) {
		var canvas = document.createElement("canvas");
		return {
			element: canvas,
			options: (0, _getOptionsFromElement2.default)(imgElement),
			renderer: _renderers2.default.CanvasRenderer,
			afterRender: function afterRender() {
				imgElement.setAttribute("src", canvas.toDataURL());
			}
		};
	}
	exports.default = getRenderProperties;
}));
//#endregion
//#region node_modules/jsbarcode/bin/exceptions/ErrorHandler.js
var require_ErrorHandler = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var _createClass = function() {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}
		return function(Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
	}
	exports.default = function() {
		function ErrorHandler(api) {
			_classCallCheck(this, ErrorHandler);
			this.api = api;
		}
		_createClass(ErrorHandler, [{
			key: "handleCatch",
			value: function handleCatch(e) {
				if (e.name === "InvalidInputException") if (this.api._options.valid !== this.api._defaults.valid) this.api._options.valid(false);
				else throw e.message;
				else throw e;
				this.api.render = function() {};
			}
		}, {
			key: "wrapBarcodeCall",
			value: function wrapBarcodeCall(func) {
				try {
					var result = func.apply(void 0, arguments);
					this.api._options.valid(true);
					return result;
				} catch (e) {
					this.handleCatch(e);
					return this.api;
				}
			}
		}]);
		return ErrorHandler;
	}();
}));
//#endregion
//#region src/lib/labels.ts
var import_JsBarcode = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var _barcodes2 = _interopRequireDefault(require_barcodes());
	var _merge2 = _interopRequireDefault(require_merge());
	var _linearizeEncodings2 = _interopRequireDefault(require_linearizeEncodings());
	var _fixOptions2 = _interopRequireDefault(require_fixOptions());
	var _getRenderProperties2 = _interopRequireDefault(require_getRenderProperties());
	var _optionsFromStrings2 = _interopRequireDefault(require_optionsFromStrings());
	var _ErrorHandler2 = _interopRequireDefault(require_ErrorHandler());
	var _exceptions = require_exceptions();
	var _defaults2 = _interopRequireDefault(require_defaults());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}
	var API = function API() {};
	var JsBarcode = function JsBarcode(element, text, options) {
		var api = new API();
		if (typeof element === "undefined") throw Error("No element to render on was provided.");
		api._renderProperties = (0, _getRenderProperties2.default)(element);
		api._encodings = [];
		api._options = _defaults2.default;
		api._errorHandler = new _ErrorHandler2.default(api);
		if (typeof text !== "undefined") {
			options = options || {};
			if (!options.format) options.format = autoSelectBarcode();
			api.options(options)[options.format](text, options).render();
		}
		return api;
	};
	JsBarcode.getModule = function(name) {
		return _barcodes2.default[name];
	};
	for (var name in _barcodes2.default) if (_barcodes2.default.hasOwnProperty(name)) registerBarcode(_barcodes2.default, name);
	function registerBarcode(barcodes, name) {
		API.prototype[name] = API.prototype[name.toUpperCase()] = API.prototype[name.toLowerCase()] = function(text, options) {
			var api = this;
			return api._errorHandler.wrapBarcodeCall(function() {
				options.text = typeof options.text === "undefined" ? void 0 : "" + options.text;
				var newOptions = (0, _merge2.default)(api._options, options);
				newOptions = (0, _optionsFromStrings2.default)(newOptions);
				var Encoder = barcodes[name];
				var encoded = encode(text, Encoder, newOptions);
				api._encodings.push(encoded);
				return api;
			});
		};
	}
	function encode(text, Encoder, options) {
		text = "" + text;
		var encoder = new Encoder(text, options);
		if (!encoder.valid()) throw new _exceptions.InvalidInputException(encoder.constructor.name, text);
		var encoded = encoder.encode();
		encoded = (0, _linearizeEncodings2.default)(encoded);
		for (var i = 0; i < encoded.length; i++) encoded[i].options = (0, _merge2.default)(options, encoded[i].options);
		return encoded;
	}
	function autoSelectBarcode() {
		if (_barcodes2.default["CODE128"]) return "CODE128";
		return Object.keys(_barcodes2.default)[0];
	}
	API.prototype.options = function(options) {
		this._options = (0, _merge2.default)(this._options, options);
		return this;
	};
	API.prototype.blank = function(size) {
		var zeroes = new Array(size + 1).join("0");
		this._encodings.push({ data: zeroes });
		return this;
	};
	API.prototype.init = function() {
		if (!this._renderProperties) return;
		if (!Array.isArray(this._renderProperties)) this._renderProperties = [this._renderProperties];
		var renderProperty;
		for (var i in this._renderProperties) {
			renderProperty = this._renderProperties[i];
			var options = (0, _merge2.default)(this._options, renderProperty.options);
			if (options.format == "auto") options.format = autoSelectBarcode();
			this._errorHandler.wrapBarcodeCall(function() {
				var text = options.value;
				var Encoder = _barcodes2.default[options.format.toUpperCase()];
				var encoded = encode(text, Encoder, options);
				render(renderProperty, encoded, options);
			});
		}
	};
	API.prototype.render = function() {
		if (!this._renderProperties) throw new _exceptions.NoElementException();
		if (Array.isArray(this._renderProperties)) for (var i = 0; i < this._renderProperties.length; i++) render(this._renderProperties[i], this._encodings, this._options);
		else render(this._renderProperties, this._encodings, this._options);
		return this;
	};
	API.prototype._defaults = _defaults2.default;
	function render(renderProperties, encodings, options) {
		encodings = (0, _linearizeEncodings2.default)(encodings);
		for (var i = 0; i < encodings.length; i++) {
			encodings[i].options = (0, _merge2.default)(options, encodings[i].options);
			(0, _fixOptions2.default)(encodings[i].options);
		}
		(0, _fixOptions2.default)(options);
		var Renderer = renderProperties.renderer;
		new Renderer(renderProperties.element, encodings, options).render();
		if (renderProperties.afterRender) renderProperties.afterRender();
	}
	if (typeof window !== "undefined") window.JsBarcode = JsBarcode;
	if (typeof jQuery !== "undefined") jQuery.fn.JsBarcode = function(content, options) {
		var elementArray = [];
		jQuery(this).each(function() {
			elementArray.push(this);
		});
		return JsBarcode(elementArray, content, options);
	};
	module.exports = JsBarcode;
})))(), 1);
async function printShippingLabels(orderIds, forceSize, options) {
	const hideCustomer = options?.hideCustomer === true;
	const maskPhone = options?.maskPhone === true;
	if (!orderIds.length) return;
	const [settings, { data: orders }, { data: items }, { data: shipments }] = await Promise.all([
		getGlobalSettings(),
		supabase.from("orders").select("id,order_number,customer_name,customer_phone,address_line,area,total,reseller_id").in("id", orderIds),
		supabase.from("order_items").select("order_id,product_name,quantity").in("order_id", orderIds),
		supabase.from("shipments").select("order_id,provider,tracking_id,consignment_id").in("order_id", orderIds)
	]);
	if (!orders || orders.length === 0) return;
	const size = forceSize || settings?.label_size || "3x4";
	const siteName = settings?.site_name || "ResellHub";
	const itemsByOrder = /* @__PURE__ */ new Map();
	items?.forEach((it) => {
		const arr = itemsByOrder.get(it.order_id) || [];
		arr.push(it);
		itemsByOrder.set(it.order_id, arr);
	});
	const shipmentsByOrder = /* @__PURE__ */ new Map();
	shipments?.forEach((s) => shipmentsByOrder.set(s.order_id, s));
	printLabelDocs(orders.map((o) => {
		const s = shipmentsByOrder.get(o.id);
		const rawPhone = o.customer_phone || "";
		const maskedPhone = maskPhone && rawPhone ? rawPhone.length <= 4 ? "****" : rawPhone.slice(0, 3) + "*".repeat(Math.max(rawPhone.length - 6, 4)) + rawPhone.slice(-2) : rawPhone;
		return {
			orderNumber: o.order_number,
			storeName: siteName,
			storeLogo: settings?.logo_url ?? null,
			area: o.area,
			customer: hideCustomer ? null : {
				name: o.customer_name,
				phone: maskedPhone,
				address: o.address_line
			},
			items: (itemsByOrder.get(o.id) || []).map((it) => ({
				name: it.product_name,
				qty: it.quantity
			})),
			courier: {
				provider: s?.provider ?? null,
				tracking: s?.tracking_id || s?.consignment_id || null
			},
			cod: hideCustomer ? null : Number(o.total)
		};
	}), size);
}
/** Render a CODE128 barcode as inline SVG markup (serialized from a detached node). */
function barcodeSvg(value, height = 34, fontSize = 11) {
	if (!value) return "";
	try {
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		(0, import_JsBarcode.default)(svg, String(value), {
			format: "CODE128",
			displayValue: true,
			height,
			margin: 0,
			fontSize,
			fontOptions: "bold",
			textMargin: 2,
			lineColor: "#000",
			background: "transparent"
		});
		svg.setAttribute("style", "width:100%;height:auto;display:block;");
		svg.removeAttribute("width");
		return svg.outerHTML;
	} catch {
		return "";
	}
}
function printLabelDocs(docs, size = "3x4") {
	if (!docs.length) return;
	const width = size === "3x3" ? "3in" : "3in";
	const height = size === "3x3" ? "3in" : "4in";
	const orderBarcodeHeight = size === "3x3" ? 30 : 38;
	const trackingBarcodeHeight = size === "3x3" ? 48 : 60;
	const trackingFontSize = size === "3x3" ? 18 : 22;
	const win = window.open("", "_blank");
	if (!win) return;
	win.document.write(`
    <html>
      <head>
        <title>Shipping Labels - ${size}</title>
        <style>
          @page { size: ${width} ${height}; margin: 0.04in; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #fff; }
          .label {
            width: calc(${width} - 0.08in);
            height: calc(${height} - 0.08in);
            padding: 0.09in;
            box-sizing: border-box;
            border: 2px solid #000;
            page-break-after: always;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            position: relative;
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 4px;
            min-width: 0;
            margin-bottom: 1px;
            border-bottom: 2px solid #000;
            padding-bottom: 1px;
          }
          .brand-box { display: flex; align-items: center; flex-shrink: 0; max-width: 40%; }
          .brand-logo { max-height: 24px; max-width: 100%; object-fit: contain; }
          .site-name { font-size: 8.5pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .order-barcode { flex: 0 0 auto; min-width: 0; max-width: 58%; text-align: right; }
          .order-barcode svg { width: 100%; height: auto; display: block; max-height: ${orderBarcodeHeight}px; }

          .courier-section {
            border: 1.5px solid #000;
            border-radius: 4px;
            padding: 4px 5px;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .courier-info { display: flex; flex-direction: column; align-items: center; gap: 2px; flex-shrink: 0; width: 0.62in; }
          .courier-logo { max-height: 16px; max-width: 100%; object-fit: contain; }
          .courier-name { font-size: 6.5pt; font-weight: 900; text-transform: uppercase; color: #000; text-align: center; line-height: 1.1; }
          .courier-barcode { flex: 1; min-width: 0; text-align: center; border-left: 1px dashed #999; padding-left: 5px; }
          .courier-barcode svg { width: 100%; height: auto; display: block; max-height: ${trackingBarcodeHeight + 12}px; }
          .tracking-pending { font-size: 8pt; font-family: monospace; font-weight: bold; border: 1px dashed #000; padding: 3px 8px; border-radius: 3px; }

          .section-title { font-size: 6.5pt; text-transform: uppercase; color: #666; font-weight: bold; margin-bottom: 2px; letter-spacing: 0.4px; }

          .customer {
            border: 1.5px solid #000;
            padding: 5px;
            margin-bottom: 4px;
            border-radius: 4px;
          }
          .name { font-size: 11.5pt; font-weight: 800; margin-bottom: 2px; color: #000; }
          .phone { font-size: 10pt; font-weight: bold; margin-bottom: 3px; display: block; border-bottom: 1px dashed #000; width: fit-content; }
          .address { font-size: 8pt; line-height: 1.25; font-weight: 500; }

          .items-box {
            border: 1px solid #000;
            padding: 4px;
            flex-grow: 1;
            margin-bottom: 4px;
            border-radius: 4px;
            background: #f9f9f9;
            font-size: 7.5pt;
            overflow: hidden;
          }
          .item-row {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            gap: 6px;
            margin-bottom: 2px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 2px;
          }
          .item-row:last-child { border-bottom: none; }
          .item-name { flex: 1; min-width: 0; line-height: 1.2; font-size: 7.5pt; }
          .item-qty { font-weight: 900; color: #000; white-space: nowrap; font-size: 8.5pt; }

          .footer {
            margin-top: auto;
            border-top: 2px solid #000;
            padding-top: 3px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 6px;
          }
          .thanks { font-size: 6pt; font-weight: 700; text-transform: uppercase; color: #444; letter-spacing: 0.4px; line-height: 1.2; }
          .cod-badge { background: #000; color: #fff; padding: 3px 8px; border-radius: 4px; text-align: right; }
          .cod-label { font-size: 6pt; text-transform: uppercase; display: block; line-height: 1; }
          .cod-value { font-size: 11pt; font-weight: 900; }
        </style>
      </head>
      <body>
        ${docs.map((d) => {
		const orderBarcode = barcodeSvg(d.orderNumber, orderBarcodeHeight, 14);
		const trackingBarcode = d.courier?.tracking ? barcodeSvg(d.courier.tracking, trackingBarcodeHeight, trackingFontSize) : "";
		const brand = courierBrand(d.courier?.provider);
		const brandLogo = brand?.wordmark ?? null;
		return `
            <div class="label">
              <div class="header">
                <div class="brand-box">
                  ${d.storeLogo ? `<img src="${d.storeLogo}" class="brand-logo" />` : `<div class="site-name">${d.storeName}</div>`}
                </div>
                <div class="order-barcode">${orderBarcode || `<strong style="font-size:13pt">#${d.orderNumber}</strong>`}</div>
              </div>
              <div class="courier-section">
                <div class="courier-info">
                  ${brandLogo ? `<img src="${brandLogo}" class="courier-logo" />` : ""}
                  <div class="courier-name">${brand?.label ?? (d.courier?.provider ? String(d.courier.provider) : "MANUAL")}</div>
                </div>
                ${trackingBarcode ? `<div class="courier-barcode">${trackingBarcode}</div>` : `<div class="courier-barcode"><span class="tracking-pending">${d.courier?.tracking || "PENDING"}</span></div>`}
              </div>
              <div class="customer">
                ${d.customer ? `<div class="section-title">Recipient</div>
                     <div class="name">${d.customer.name}</div>
                     <div class="phone">${d.customer.phone}</div>
                     <div class="address">${d.customer.address}</div>` : `<div class="section-title">Parcel</div>
                     <div class="name">#${d.orderNumber}</div>`}
              </div>
              <div class="items-box">
                <div class="section-title">Order Items</div>
                ${d.items.map((it) => `<div class="item-row"><span class="item-name">${it.name}</span><span class="item-qty">x ${it.qty}</span></div>`).join("")}
              </div>
              <div class="footer">
                <div class="thanks">Thank you for<br>shopping with us</div>
                ${d.cod == null ? "" : `<div class="cod-badge">
                       <span class="cod-label">Cash to Collect</span>
                       <span class="cod-value">৳${Number(d.cod).toFixed(0)}</span>
                     </div>`}
              </div>
            </div>
          `;
	}).join("")}
        <script>window.onload = () => { window.print(); setTimeout(() => window.close(), 500); }<\/script>
      </body>
    </html>
  `);
	win.document.close();
}
//#endregion
export { getActiveCouriers as a, orderSupplierTint as i, printShippingLabels as n, ShipmentBookingModal as r, printLabelDocs as t };
