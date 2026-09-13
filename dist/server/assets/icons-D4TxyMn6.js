import { Ct as Megaphone, D as Sparkles, Dn as Coins, I as ShieldCheck, Mn as ClipboardList, N as ShoppingBag, Qn as ChartColumn, V as Send, Vt as Layers, a as Wallet, c as Users, ht as PackageCheck, ir as Boxes, lr as BanknoteArrowDown, m as Truck, sn as Globe } from "./vendor-icons-BWIzFOtW.js";
//#region src/lib/icons.ts
/**
* Central icon registry — everything ships inside the app bundle.
* No CDN, no icon font, no third-party icon server.
*
* - Vector UI icons: `lucide-react` (bundled npm package, tree-shaken into our JS).
* - Brand logos (couriers): local PNG files in `src/assets/`.
*
* Add every new dynamic/name-based icon here so there is a single source of truth.
*/
/** Name → component map used for content-driven icons (landing page editor etc.). */
var APP_ICONS = {
	Boxes,
	Truck,
	Wallet,
	Megaphone,
	Globe,
	BarChart3: ChartColumn,
	ShieldCheck,
	Sparkles,
	ClipboardList,
	Send,
	PackageCheck,
	Coins,
	BanknoteArrowDown,
	ShoppingBag,
	Users,
	Layers
};
/** Selectable icon names (admin dropdowns). */
var APP_ICON_NAMES = Object.keys(APP_ICONS);
//#endregion
export { APP_ICON_NAMES as n, APP_ICONS as t };
