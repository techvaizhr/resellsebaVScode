import { Ct as Megaphone, D as Sparkles, Ht as Layers, I as ShieldCheck, Ln as ClipboardList, Mn as Coins, N as ShoppingBag, V as Send, a as Wallet, c as Users, cn as Globe, ht as PackageCheck, lr as Boxes, m as Truck, mr as BanknoteArrowDown, rr as ChartColumn } from "./vendor-icons-BEaCFqaT.js";
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
