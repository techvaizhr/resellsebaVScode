import { BanknoteArrowDown, BarChart3, Boxes, ClipboardList, Coins, Globe, Layers, Megaphone, PackageCheck, Send, ShieldCheck, ShoppingBag, Sparkles, Truck, Users, Wallet } from "lucide-react";
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
	BarChart3,
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
