import { D as Sparkles, H as Send, I as ShieldCheck, N as ShoppingBag, Nn as Coins, Rn as ClipboardList, Ut as Layers, a as Wallet, c as Users, gt as PackageCheck, hr as BanknoteArrowDown, ir as ChartColumn, ln as Globe, m as Truck, ur as Boxes, wt as Megaphone } from "./vendor-icons-DF2A5Z8S.js";
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
