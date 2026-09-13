//#region \0tanstack-start-manifest:v
var tsrStartManifest = () => ({ routes: {
	__root__: {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/__root.tsx",
		children: [
			"/",
			"/_authenticated",
			"/catalog",
			"/login",
			"/privacy",
			"/register",
			"/tutorials",
			"/s/$code",
			"/api/public/manifest",
			"/api/public/product",
			"/api/public/robots",
			"/api/public/courier/actions",
			"/api/public/courier/carrybee",
			"/api/public/courier/pathao",
			"/api/public/courier/steadfast",
			"/api/public/courier/sync",
			"/api/public/payment/bridge",
			"/api/public/payment/epayseba-webhook",
			"/api/public/payment/sslcommerz-ipn",
			"/api/public/sitemap/$code",
			"/api/public/payment/$provider/return"
		],
		preloads: [
			"/assets/index-BU7mpLj_.js",
			"/assets/rolldown-runtime-QTnfLwEv.js",
			"/assets/vendor-charts-CkRyfaGy.js",
			"/assets/vendor-editor-_X2_vRjM.js",
			"/assets/createServerFn-D3Ix5k0M.js",
			"/assets/useStore-DZT5wF6z.js",
			"/assets/useRouter-ulk0ZvG7.js",
			"/assets/root-DLTE-HSj.js",
			"/assets/link-lrqq8FrD.js",
			"/assets/matchContext-6qI6VZAE.js",
			"/assets/vendor-icons-ClLzBSp0.js",
			"/assets/vendor-ui-DcTM-RRF.js",
			"/assets/utils-Cuz72dHL.js"
		],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-BU7mpLj_.js"
		} }]
	},
	"/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/index.tsx",
		children: void 0,
		preloads: [
			"/assets/routes-KQOFsNr3.js",
			"/assets/finance-report-C23ythgs.js",
			"/assets/bootstrap-Dd7OZFsQ.js",
			"/assets/icons-B9NCpq0e.js",
			"/assets/pwa-install-B_rRm3TN.js",
			"/assets/public-header-BX6d2QII.js"
		]
	},
	"/_authenticated": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/route.tsx",
		children: [
			"/_authenticated/admin",
			"/_authenticated/reseller",
			"/_authenticated/supplier",
			"/_authenticated/dashboard",
			"/_authenticated/onboarding",
			"/_authenticated/verify"
		],
		preloads: ["/assets/route-fQsOM0tM.js"]
	},
	"/catalog": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/catalog.tsx",
		children: ["/catalog/$slug", "/catalog/"],
		preloads: [
			"/assets/catalog-D9NykGCr.js",
			"/assets/shell-C4P3WTo6.js",
			"/assets/public-header-BX6d2QII.js"
		]
	},
	"/login": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/login.tsx",
		children: void 0,
		preloads: [
			"/assets/login-D65Wd8TR.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/advanced-settings-C9ATc_w4.js",
			"/assets/verification.functions-t8Klrq9Q.js",
			"/assets/public-header-BX6d2QII.js"
		]
	},
	"/privacy": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/privacy.tsx",
		children: void 0,
		preloads: ["/assets/privacy-vaKAnH_S.js", "/assets/public-header-BX6d2QII.js"]
	},
	"/tutorials": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/tutorials.tsx",
		children: void 0,
		preloads: [
			"/assets/tutorials-CwRzRlCD.js",
			"/assets/tutorial-library-CjjDP_ou.js",
			"/assets/public-header-BX6d2QII.js"
		]
	},
	"/_authenticated/admin": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/route.tsx",
		children: [
			"/_authenticated/admin/advanced",
			"/_authenticated/admin/agent-payouts",
			"/_authenticated/admin/agent-report",
			"/_authenticated/admin/agents",
			"/_authenticated/admin/backup",
			"/_authenticated/admin/brands",
			"/_authenticated/admin/business-report",
			"/_authenticated/admin/categories",
			"/_authenticated/admin/commissions",
			"/_authenticated/admin/couriers",
			"/_authenticated/admin/customers",
			"/_authenticated/admin/deposit-transactions",
			"/_authenticated/admin/deposits",
			"/_authenticated/admin/domains",
			"/_authenticated/admin/expenses",
			"/_authenticated/admin/landing",
			"/_authenticated/admin/maintenance",
			"/_authenticated/admin/marketing",
			"/_authenticated/admin/media",
			"/_authenticated/admin/notices",
			"/_authenticated/admin/notifications",
			"/_authenticated/admin/orders",
			"/_authenticated/admin/payments",
			"/_authenticated/admin/payouts",
			"/_authenticated/admin/policies",
			"/_authenticated/admin/privacy",
			"/_authenticated/admin/resellers",
			"/_authenticated/admin/settings",
			"/_authenticated/admin/staff",
			"/_authenticated/admin/subscriptions",
			"/_authenticated/admin/supplier-payouts",
			"/_authenticated/admin/supplier-report",
			"/_authenticated/admin/supplier-returns",
			"/_authenticated/admin/suppliers",
			"/_authenticated/admin/transactions",
			"/_authenticated/admin/tutorials",
			"/_authenticated/admin/visitors",
			"/_authenticated/admin/",
			"/_authenticated/admin/products/new",
			"/_authenticated/admin/products/",
			"/_authenticated/admin/products/$id/edit"
		],
		preloads: [
			"/assets/route-Da6HsOoH.js",
			"/assets/useLocation-BrrN-pmA.js",
			"/assets/app-data-D0HI0Au5.js",
			"/assets/use-auth-BfThPh2B.js",
			"/assets/BulkScanModal-8C0vHkTT.js",
			"/assets/use-order-nav-count-BUiYyQe_.js"
		]
	},
	"/_authenticated/reseller": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/route.tsx",
		children: [
			"/_authenticated/reseller/catalog",
			"/_authenticated/reseller/commissions",
			"/_authenticated/reseller/customers",
			"/_authenticated/reseller/domain",
			"/_authenticated/reseller/listings",
			"/_authenticated/reseller/marketing",
			"/_authenticated/reseller/menus",
			"/_authenticated/reseller/orders",
			"/_authenticated/reseller/payments",
			"/_authenticated/reseller/payouts",
			"/_authenticated/reseller/policies",
			"/_authenticated/reseller/profile",
			"/_authenticated/reseller/settings",
			"/_authenticated/reseller/subscription",
			"/_authenticated/reseller/support",
			"/_authenticated/reseller/theme",
			"/_authenticated/reseller/transactions",
			"/_authenticated/reseller/tutorials",
			"/_authenticated/reseller/visitors",
			"/_authenticated/reseller/"
		],
		preloads: [
			"/assets/route-DPBUHzqj.js",
			"/assets/useLocation-BrrN-pmA.js",
			"/assets/app-data-D0HI0Au5.js",
			"/assets/panel-bootstrap-2XoLoAKp.js",
			"/assets/use-auth-BfThPh2B.js",
			"/assets/impersonation-BWAi8-6P.js",
			"/assets/reseller-status-BRiEAbFB.js",
			"/assets/use-order-nav-count-BUiYyQe_.js",
			"/assets/use-verification-C8nqvh2q.js",
			"/assets/impersonation-banner-BhSfhBex.js"
		]
	},
	"/_authenticated/supplier": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/route.tsx",
		children: [
			"/_authenticated/supplier/media",
			"/_authenticated/supplier/orders",
			"/_authenticated/supplier/payouts",
			"/_authenticated/supplier/products",
			"/_authenticated/supplier/profile",
			"/_authenticated/supplier/report",
			"/_authenticated/supplier/returns",
			"/_authenticated/supplier/"
		],
		preloads: [
			"/assets/route-NJo57efg.js",
			"/assets/app-data-D0HI0Au5.js",
			"/assets/use-auth-BfThPh2B.js",
			"/assets/supplier-CpEgbBT8.js",
			"/assets/use-order-nav-count-BUiYyQe_.js",
			"/assets/use-verification-C8nqvh2q.js",
			"/assets/impersonation-banner-BhSfhBex.js",
			"/assets/supplier-context-BU7JZggX.js"
		]
	},
	"/_authenticated/dashboard": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/dashboard.tsx",
		children: void 0,
		preloads: [
			"/assets/dashboard-l6stOvFV.js",
			"/assets/use-auth-BfThPh2B.js",
			"/assets/use-verification-C8nqvh2q.js"
		]
	},
	"/_authenticated/onboarding": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/onboarding.tsx",
		children: void 0,
		preloads: [
			"/assets/onboarding-BG-Oq4-k.js",
			"/assets/app-data-D0HI0Au5.js",
			"/assets/use-auth-BfThPh2B.js",
			"/assets/impersonation-BWAi8-6P.js",
			"/assets/reseller-status-BRiEAbFB.js",
			"/assets/use-verification-C8nqvh2q.js"
		]
	},
	"/_authenticated/verify": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/verify.tsx",
		children: void 0,
		preloads: [
			"/assets/verify-gziU-6TV.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/use-verification-C8nqvh2q.js",
			"/assets/verification.functions-t8Klrq9Q.js"
		]
	},
	"/catalog/$slug": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/catalog.$slug.tsx",
		children: void 0,
		preloads: [
			"/assets/catalog._slug-CxQwMAfr.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/app-data-D0HI0Au5.js",
			"/assets/finance-report-C23ythgs.js",
			"/assets/image-picker-B8C4BtZr.js",
			"/assets/catalog.functions-pYBF3FyA.js"
		]
	},
	"/s/$code": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.tsx",
		children: [
			"/s/$code/checkout",
			"/s/$code/thanks",
			"/s/$code/",
			"/s/$code/c/$slug",
			"/s/$code/p/$slug"
		],
		preloads: [
			"/assets/s._code-CbDPXB5E.js",
			"/assets/useRouterState-Dgjavcnh.js",
			"/assets/ui-BH6jmwkV.js",
			"/assets/store-content-DroOL-aq.js",
			"/assets/store-menu-CjLh8vlG.js",
			"/assets/pwa-install-B_rRm3TN.js",
			"/assets/store-visits-BGl_fRSA.js"
		]
	},
	"/catalog/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/catalog.index.tsx",
		children: void 0,
		preloads: [
			"/assets/catalog.index-CgSYqpHb.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/finance-report-C23ythgs.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/product-code-BpVH7jKF.js",
			"/assets/image-picker-B8C4BtZr.js",
			"/assets/catalog.functions-pYBF3FyA.js"
		]
	},
	"/_authenticated/admin/advanced": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/advanced.tsx",
		children: void 0,
		preloads: [
			"/assets/advanced-CdcbvgQ-.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/advanced-settings-C9ATc_w4.js",
			"/assets/deposit-settings-ChzwWTEb.js"
		]
	},
	"/_authenticated/admin/agent-payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/agent-payouts.tsx",
		children: void 0,
		preloads: [
			"/assets/agent-payouts-XiN-DJZL.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/ledger-timeline-B_875TG0.js",
			"/assets/agents-BhLq-8rr.js"
		]
	},
	"/_authenticated/admin/agent-report": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/agent-report.tsx",
		children: void 0,
		preloads: [
			"/assets/agent-report-BVTpA_1S.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/agents-BhLq-8rr.js",
			"/assets/date-range-filter-C-BzTyoO.js"
		]
	},
	"/_authenticated/admin/agents": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/agents.tsx",
		children: void 0,
		preloads: [
			"/assets/agents-DPGuHkrP.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/agents-BhLq-8rr.js",
			"/assets/auth-middleware-COaA7HL9.js"
		]
	},
	"/_authenticated/admin/backup": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/backup.tsx",
		children: void 0,
		preloads: ["/assets/backup-CIrM1Tcw.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/admin/brands": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/brands.tsx",
		children: void 0,
		preloads: [
			"/assets/brands-BSYQ4WEK.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/ImageUploader-DxLope9d.js"
		]
	},
	"/_authenticated/admin/business-report": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/business-report.tsx",
		children: void 0,
		preloads: [
			"/assets/business-report-BVAZTzjH.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/finance-report-C23ythgs.js",
			"/assets/agents-BhLq-8rr.js",
			"/assets/order-filters-CJ9pQZ8D.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/report-blocks-D-g5Yr64.js",
			"/assets/reseller-avatar-CbTfdTEo.js",
			"/assets/business-report-CFPRzxra.js"
		]
	},
	"/_authenticated/admin/categories": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/categories.tsx",
		children: void 0,
		preloads: [
			"/assets/categories-DOmVvjpd.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/ImageUploader-DxLope9d.js"
		]
	},
	"/_authenticated/admin/commissions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/commissions.tsx",
		children: void 0,
		preloads: ["/assets/commissions-Bm4HRou3.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/admin/couriers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/couriers.tsx",
		children: void 0,
		preloads: [
			"/assets/couriers-BVtYM7Do.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/courier-brand-BhbmLtH9.js"
		]
	},
	"/_authenticated/admin/customers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/customers.tsx",
		children: void 0,
		preloads: [
			"/assets/customers-C6rb-2EX.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/customers-report-CXlxOMwh.js"
		]
	},
	"/_authenticated/admin/deposit-transactions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/deposit-transactions.tsx",
		children: void 0,
		preloads: [
			"/assets/deposit-transactions-CScnZse-.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/deposit-ledger-Bh1lrnv7.js",
			"/assets/payment-methods-BDEHGAYs.js",
			"/assets/deposit-pay-panel-DlWm0fy4.js"
		]
	},
	"/_authenticated/admin/domains": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/domains.tsx",
		children: void 0,
		preloads: [
			"/assets/domains-CYuwqVFq.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/cloudflare.functions-CxUvZ1na.js"
		]
	},
	"/_authenticated/admin/expenses": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/expenses.tsx",
		children: void 0,
		preloads: [
			"/assets/expenses-CzqVYzY0.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/finance-report-C23ythgs.js",
			"/assets/order-filters-CJ9pQZ8D.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/report-blocks-D-g5Yr64.js",
			"/assets/business-report-CFPRzxra.js"
		]
	},
	"/_authenticated/admin/landing": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/landing.tsx",
		children: void 0,
		preloads: [
			"/assets/landing-DmcZ8y-Y.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/ImageUploader-DxLope9d.js",
			"/assets/icons-B9NCpq0e.js",
			"/assets/tabs-4Ugcp-Dh.js"
		]
	},
	"/_authenticated/admin/maintenance": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/maintenance.tsx",
		children: void 0,
		preloads: [
			"/assets/maintenance-BP1kAjoj.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/auth-middleware-COaA7HL9.js"
		]
	},
	"/_authenticated/admin/marketing": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/marketing.tsx",
		children: void 0,
		preloads: ["/assets/marketing-DLVgdKXg.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/admin/media": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/media.tsx",
		children: void 0,
		preloads: [
			"/assets/media-DbQ25knP.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/button-kNZ4kbD4.js",
			"/assets/data-list-CDjbwaL-.js"
		]
	},
	"/_authenticated/admin/notices": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/notices.tsx",
		children: void 0,
		preloads: [
			"/assets/notices-Mm7AQYsd.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/admin-notices-DxbMi3hv.js"
		]
	},
	"/_authenticated/admin/notifications": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/notifications.tsx",
		children: void 0,
		preloads: [
			"/assets/notifications-DVO01Id2.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/auth-middleware-COaA7HL9.js"
		]
	},
	"/_authenticated/admin/orders": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/orders.tsx",
		children: void 0,
		preloads: [
			"/assets/orders-BreHTOfR.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/order-search-RgwL8Qea.js",
			"/assets/CourierTimeline-7MIbZn17.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/finance-report-C23ythgs.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/order-filters-CJ9pQZ8D.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/business-report-CFPRzxra.js",
			"/assets/courier-brand-BhbmLtH9.js",
			"/assets/bootstrap-Dd7OZFsQ.js",
			"/assets/NewOrderModal-B0M9sAS3.js",
			"/assets/CopyOrderNumber-C3Bgkhn_.js",
			"/assets/labels-C-emLAOX.js",
			"/assets/price-breakdown-Re8-gkw_.js"
		]
	},
	"/_authenticated/admin/payments": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/payments.tsx",
		children: void 0,
		preloads: [
			"/assets/payments-SDDb1Oxw.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/payment-methods-BDEHGAYs.js",
			"/assets/payment-brand-DxxvN5fA.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/gateway-grid-DTvAU1Nu.js"
		]
	},
	"/_authenticated/admin/payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/payouts.tsx",
		children: void 0,
		preloads: [
			"/assets/payouts-C-7NR3Vm.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/data-list-CDjbwaL-.js"
		]
	},
	"/_authenticated/admin/policies": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/policies.tsx",
		children: void 0,
		preloads: [
			"/assets/policies-BLVFMDMF.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/AppModal-Dly020dH.js"
		]
	},
	"/_authenticated/admin/privacy": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/privacy.tsx",
		children: void 0,
		preloads: [
			"/assets/privacy-fPS53fZ-.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/RichTextEditor-Diojyor1.js"
		]
	},
	"/_authenticated/admin/resellers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/resellers.tsx",
		children: void 0,
		preloads: [
			"/assets/resellers-CVIcLsC_.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/advanced-settings-C9ATc_w4.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/auth-middleware-COaA7HL9.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/reseller-avatar-CbTfdTEo.js",
			"/assets/deposit-ledger-Bh1lrnv7.js",
			"/assets/admin-users.functions-BY8PRqde.js",
			"/assets/impersonation-BWAi8-6P.js",
			"/assets/reseller-status-BRiEAbFB.js",
			"/assets/ResellerProfile-Bak0szzV.js",
			"/assets/password-reset-modal-C0h099KZ.js"
		]
	},
	"/_authenticated/admin/settings": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/settings.tsx",
		children: void 0,
		preloads: [
			"/assets/settings-D9MFlqce.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/ImageUploader-DxLope9d.js"
		]
	},
	"/_authenticated/admin/staff": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/staff.tsx",
		children: void 0,
		preloads: [
			"/assets/staff-CCP9ILa-.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/auth-middleware-COaA7HL9.js",
			"/assets/dist-Bm7eTr0L.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/tabs-4Ugcp-Dh.js",
			"/assets/admin-users.functions-BY8PRqde.js"
		]
	},
	"/_authenticated/admin/subscriptions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/subscriptions.tsx",
		children: void 0,
		preloads: [
			"/assets/subscriptions-efJKyHFi.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/finance-report-C23ythgs.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/AppModal-Dly020dH.js"
		]
	},
	"/_authenticated/admin/supplier-payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/supplier-payouts.tsx",
		children: void 0,
		preloads: [
			"/assets/supplier-payouts-CN-sbzE1.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/supplier-CpEgbBT8.js",
			"/assets/status-tabs-CjrpntaN.js"
		]
	},
	"/_authenticated/admin/supplier-report": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/supplier-report.tsx",
		children: void 0,
		preloads: [
			"/assets/supplier-report-Blkm2Z1O.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/CopyOrderNumber-C3Bgkhn_.js",
			"/assets/supplier-CpEgbBT8.js",
			"/assets/supplier-report-summary-CSU4biJa.js"
		]
	},
	"/_authenticated/admin/supplier-returns": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/supplier-returns.tsx",
		children: void 0,
		preloads: [
			"/assets/supplier-returns-COfq8TmK.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/button-kNZ4kbD4.js",
			"/assets/CopyOrderNumber-C3Bgkhn_.js",
			"/assets/supplier-CpEgbBT8.js",
			"/assets/impersonation-BWAi8-6P.js",
			"/assets/supplier-access.functions-Cd1pE3HA.js"
		]
	},
	"/_authenticated/admin/suppliers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/suppliers.tsx",
		children: void 0,
		preloads: [
			"/assets/suppliers-DS0qgIHK.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/reseller-avatar-CbTfdTEo.js",
			"/assets/supplier-CpEgbBT8.js",
			"/assets/impersonation-BWAi8-6P.js",
			"/assets/password-reset-modal-C0h099KZ.js",
			"/assets/supplier-access.functions-Cd1pE3HA.js"
		]
	},
	"/_authenticated/admin/transactions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/transactions.tsx",
		children: void 0,
		preloads: ["/assets/transactions-ID5nhNBa.js", "/assets/transaction-report-mTZiwed0.js"]
	},
	"/_authenticated/admin/tutorials": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/tutorials.tsx",
		children: void 0,
		preloads: [
			"/assets/tutorials-PKHkT1L1.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/tutorials-Ha9VWWMk.js"
		]
	},
	"/_authenticated/admin/visitors": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/visitors.tsx",
		children: void 0,
		preloads: [
			"/assets/visitors-DWTQtl6q.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/store-visits-report-D6TKB9TJ.js"
		]
	},
	"/_authenticated/reseller/catalog": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/catalog.tsx",
		children: void 0,
		preloads: [
			"/assets/catalog-CXpbj-Ph.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/advanced-settings-C9ATc_w4.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/product-code-BpVH7jKF.js",
			"/assets/price-breakdown-Re8-gkw_.js",
			"/assets/Hint-Lvce_jzt.js",
			"/assets/reseller-tools-Brb-UuR-.js",
			"/assets/image-picker-B8C4BtZr.js"
		]
	},
	"/_authenticated/reseller/commissions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/commissions.tsx",
		children: void 0,
		preloads: ["/assets/commissions-BwE1vy9C.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/reseller/customers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/customers.tsx",
		children: void 0,
		preloads: [
			"/assets/customers-D_ffS53p.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/customers-report-CXlxOMwh.js"
		]
	},
	"/_authenticated/reseller/domain": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/domain.tsx",
		children: void 0,
		preloads: [
			"/assets/domain-njAMhdEc.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/cloudflare.functions-CxUvZ1na.js"
		]
	},
	"/_authenticated/reseller/listings": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/listings.tsx",
		children: void 0,
		preloads: [
			"/assets/listings-CsmP_uNz.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/product-code-BpVH7jKF.js",
			"/assets/reseller-tools-Brb-UuR-.js"
		]
	},
	"/_authenticated/reseller/marketing": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/marketing.tsx",
		children: void 0,
		preloads: ["/assets/marketing-BId0PLDT.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/reseller/menus": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/menus.tsx",
		children: void 0,
		preloads: [
			"/assets/menus-EjR6OgVL.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/ImageUploader-DxLope9d.js",
			"/assets/bootstrap-Dd7OZFsQ.js",
			"/assets/store-menu-CjLh8vlG.js"
		]
	},
	"/_authenticated/reseller/orders": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/orders.tsx",
		children: ["/_authenticated/reseller/orders/$id/invoice"],
		preloads: [
			"/assets/orders-a9y9S_eT.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/order-search-RgwL8Qea.js",
			"/assets/CourierTimeline-7MIbZn17.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/finance-report-C23ythgs.js",
			"/assets/deposit-settings-ChzwWTEb.js",
			"/assets/order-filters-CJ9pQZ8D.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/business-report-CFPRzxra.js",
			"/assets/courier-brand-BhbmLtH9.js",
			"/assets/NewOrderModal-B0M9sAS3.js",
			"/assets/CopyOrderNumber-C3Bgkhn_.js",
			"/assets/deposit-DMm2K54j.js"
		]
	},
	"/_authenticated/reseller/payments": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/payments.tsx",
		children: void 0,
		preloads: [
			"/assets/payments-COBJNrRI.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/bootstrap-Dd7OZFsQ.js",
			"/assets/payment-methods-BDEHGAYs.js",
			"/assets/gateways.functions-DL7oLKKI.js",
			"/assets/payment-brand-DxxvN5fA.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/gateway-grid-DTvAU1Nu.js"
		]
	},
	"/_authenticated/reseller/payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/payouts.tsx",
		children: void 0,
		preloads: [
			"/assets/payouts-nzBNEjEP.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/deposit-settings-ChzwWTEb.js",
			"/assets/ledger-timeline-B_875TG0.js",
			"/assets/report-blocks-D-g5Yr64.js",
			"/assets/deposit-pay-panel-DlWm0fy4.js",
			"/assets/deposit-DMm2K54j.js",
			"/assets/deposit-notice-CK3M5qaD.js"
		]
	},
	"/_authenticated/reseller/policies": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/policies.tsx",
		children: void 0,
		preloads: ["/assets/policies-CX5UAjnQ.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/reseller/profile": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/profile.tsx",
		children: void 0,
		preloads: [
			"/assets/profile-C2u_f4kd.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/ImageUploader-DxLope9d.js",
			"/assets/reseller-avatar-CbTfdTEo.js",
			"/assets/ResellerProfile-Bak0szzV.js"
		]
	},
	"/_authenticated/reseller/settings": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/settings.tsx",
		children: void 0,
		preloads: [
			"/assets/settings-DyHdiTAu.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/ImageUploader-DxLope9d.js",
			"/assets/bootstrap-Dd7OZFsQ.js"
		]
	},
	"/_authenticated/reseller/subscription": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/subscription.tsx",
		children: void 0,
		preloads: [
			"/assets/subscription-BRyzAkUd.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/finance-report-C23ythgs.js",
			"/assets/payment-methods-BDEHGAYs.js",
			"/assets/AppModal-Dly020dH.js"
		]
	},
	"/_authenticated/reseller/support": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/support.tsx",
		children: void 0,
		preloads: ["/assets/support-Ci3POTRK.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/reseller/theme": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/theme.tsx",
		children: void 0,
		preloads: [
			"/assets/theme-DZ2u0vVh.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/ImageUploader-DxLope9d.js",
			"/assets/bootstrap-Dd7OZFsQ.js",
			"/assets/store-content-DroOL-aq.js"
		]
	},
	"/_authenticated/reseller/transactions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/transactions.tsx",
		children: void 0,
		preloads: ["/assets/transactions-C88F7gbR.js", "/assets/transaction-report-mTZiwed0.js"]
	},
	"/_authenticated/reseller/tutorials": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/tutorials.tsx",
		children: void 0,
		preloads: [
			"/assets/tutorials-lvb9OJwc.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/tutorial-library-CjjDP_ou.js"
		]
	},
	"/_authenticated/reseller/visitors": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/visitors.tsx",
		children: void 0,
		preloads: [
			"/assets/visitors-Dt84dnSq.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/store-visits-report-D6TKB9TJ.js"
		]
	},
	"/_authenticated/supplier/media": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/media.tsx",
		children: void 0,
		preloads: [
			"/assets/media-DRsa-LHf.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/button-kNZ4kbD4.js",
			"/assets/data-list-CDjbwaL-.js"
		]
	},
	"/_authenticated/supplier/orders": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/orders.tsx",
		children: void 0,
		preloads: [
			"/assets/orders-CLg2ATzX.js",
			"/assets/order-search-RgwL8Qea.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/order-filters-CJ9pQZ8D.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/courier-brand-BhbmLtH9.js",
			"/assets/BulkScanModal-8C0vHkTT.js",
			"/assets/CopyOrderNumber-C3Bgkhn_.js",
			"/assets/labels-C-emLAOX.js"
		]
	},
	"/_authenticated/supplier/payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/payouts.tsx",
		children: void 0,
		preloads: ["/assets/payouts-BaAVsbkn.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/supplier/products": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/products.tsx",
		children: void 0,
		preloads: [
			"/assets/products-CrF5BChm.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/ImageUploader-DxLope9d.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/RichTextEditor-Diojyor1.js",
			"/assets/Hint-Lvce_jzt.js",
			"/assets/product-import-6EQ5C0Lk.js"
		]
	},
	"/_authenticated/supplier/profile": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/profile.tsx",
		children: void 0,
		preloads: ["/assets/profile-CJPUps5i.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/supplier/report": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/report.tsx",
		children: void 0,
		preloads: [
			"/assets/report-DHzs9NOz.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/CopyOrderNumber-C3Bgkhn_.js",
			"/assets/status-tabs-CjrpntaN.js",
			"/assets/supplier-report-summary-CSU4biJa.js"
		]
	},
	"/_authenticated/supplier/returns": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/returns.tsx",
		children: void 0,
		preloads: [
			"/assets/returns-AoLvvUMr.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/CopyOrderNumber-C3Bgkhn_.js",
			"/assets/status-tabs-CjrpntaN.js"
		]
	},
	"/s/$code/checkout": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.checkout.tsx",
		children: void 0,
		preloads: [
			"/assets/s._code.checkout-RK8YwsjN.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/app-data-D0HI0Au5.js",
			"/assets/advanced-settings-C9ATc_w4.js",
			"/assets/gateways.functions-DL7oLKKI.js",
			"/assets/payment-brand-DxxvN5fA.js",
			"/assets/checkout-validate-Bep8wCSp.js"
		]
	},
	"/s/$code/thanks": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.thanks.tsx",
		children: void 0,
		preloads: [
			"/assets/s._code.thanks-B2iY0U8v.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/gateways.functions-DL7oLKKI.js"
		]
	},
	"/_authenticated/admin/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/index.tsx",
		children: void 0,
		preloads: [
			"/assets/admin-BJ3H95zK.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/finance-report-C23ythgs.js",
			"/assets/date-range-filter-C-BzTyoO.js",
			"/assets/bootstrap-Dd7OZFsQ.js",
			"/assets/NewOrderModal-B0M9sAS3.js"
		]
	},
	"/_authenticated/reseller/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/index.tsx",
		children: void 0,
		preloads: [
			"/assets/reseller-DbKrMGfI.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/finance-report-C23ythgs.js",
			"/assets/date-range-filter-C-BzTyoO.js",
			"/assets/report-blocks-D-g5Yr64.js",
			"/assets/bootstrap-Dd7OZFsQ.js",
			"/assets/payment-methods-BDEHGAYs.js",
			"/assets/payment-brand-DxxvN5fA.js",
			"/assets/NewOrderModal-B0M9sAS3.js",
			"/assets/admin-notices-DxbMi3hv.js",
			"/assets/deposit-DMm2K54j.js",
			"/assets/deposit-notice-CK3M5qaD.js"
		]
	},
	"/_authenticated/supplier/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/index.tsx",
		children: void 0,
		preloads: [
			"/assets/supplier-CAjHDtvc.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/report-blocks-D-g5Yr64.js",
			"/assets/CopyOrderNumber-C3Bgkhn_.js"
		]
	},
	"/s/$code/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.index.tsx",
		children: void 0,
		preloads: ["/assets/s._code.index-BGqfhg1v.js"]
	},
	"/_authenticated/admin/products/new": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/products.new.tsx",
		children: void 0,
		preloads: [
			"/assets/products.new-BzbtrhrP.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/advanced-settings-C9ATc_w4.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/ImageUploader-DxLope9d.js",
			"/assets/price-breakdown-Re8-gkw_.js",
			"/assets/RichTextEditor-Diojyor1.js",
			"/assets/slug-kCKurXxk.js",
			"/assets/Hint-Lvce_jzt.js",
			"/assets/product-import-6EQ5C0Lk.js",
			"/assets/ProductImportModal-5ysg796E.js"
		]
	},
	"/s/$code/c/$slug": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.c.$slug.tsx",
		children: void 0,
		preloads: ["/assets/s._code.c._slug-DiUXfyen.js"]
	},
	"/s/$code/p/$slug": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.p.$slug.tsx",
		children: void 0,
		preloads: [
			"/assets/s._code.p._slug-C2x7LYqR.js",
			"/assets/app-data-D0HI0Au5.js",
			"/assets/product-code-BpVH7jKF.js",
			"/assets/reseller-tools-Brb-UuR-.js"
		]
	},
	"/_authenticated/admin/products/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/products.index.tsx",
		children: void 0,
		preloads: [
			"/assets/products.index-CaqfVh09.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/advanced-settings-C9ATc_w4.js",
			"/assets/button-kNZ4kbD4.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/reseller-tools-Brb-UuR-.js",
			"/assets/ProductImportModal-5ysg796E.js",
			"/assets/supplier-CpEgbBT8.js"
		]
	},
	"/_authenticated/admin/products/$id/edit": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/products.$id.edit.tsx",
		children: void 0,
		preloads: [
			"/assets/products._id.edit-D9Z1NaQB.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/ImageUploader-DxLope9d.js",
			"/assets/price-breakdown-Re8-gkw_.js",
			"/assets/RichTextEditor-Diojyor1.js",
			"/assets/slug-kCKurXxk.js",
			"/assets/Hint-Lvce_jzt.js"
		]
	},
	"/_authenticated/reseller/orders/$id/invoice": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/orders.$id.invoice.tsx",
		children: void 0,
		preloads: ["/assets/orders._id.invoice-2PEOSFwy.js"]
	}
} });
//#endregion
export { tsrStartManifest };
