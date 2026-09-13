//#region src/lib/date.ts
/**
* Safe date parsing and formatting utilities to prevent "Invalid Date" errors
* across the application.
*/
function safeDate(val) {
	if (val === null || val === void 0 || val === "") return null;
	if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
	if (typeof val === "string" || typeof val === "number") {
		if (typeof val === "string" && /^\d{4}-\d{2}$/.test(val)) {
			const d = /* @__PURE__ */ new Date(`${val}-01T00:00:00`);
			return isNaN(d.getTime()) ? null : d;
		}
		const d = new Date(val);
		return isNaN(d.getTime()) ? null : d;
	}
	return null;
}
function formatDate(val, fallback = "—", options, locale) {
	const d = safeDate(val);
	if (!d) return fallback;
	try {
		return d.toLocaleDateString(locale, options);
	} catch {
		return fallback;
	}
}
function formatTime(val, fallback = "—", options = {
	hour: "2-digit",
	minute: "2-digit"
}, locale) {
	const d = safeDate(val);
	if (!d) return fallback;
	try {
		return d.toLocaleTimeString(locale, options);
	} catch {
		return fallback;
	}
}
function formatDateTime(val, fallback = "—", options, locale) {
	const d = safeDate(val);
	if (!d) return fallback;
	try {
		return d.toLocaleString(locale, options);
	} catch {
		return fallback;
	}
}
function formatMonthYear(val, fallback = "—") {
	const d = safeDate(val);
	if (!d) return fallback;
	try {
		return d.toLocaleDateString(void 0, {
			month: "short",
			year: "numeric"
		});
	} catch {
		return fallback;
	}
}
function safeIsoString(val, fallbackIso = (/* @__PURE__ */ new Date()).toISOString()) {
	const d = safeDate(val);
	return d ? d.toISOString() : fallbackIso;
}
//#endregion
export { safeIsoString as a, formatTime as i, formatDateTime as n, formatMonthYear as r, formatDate as t };
