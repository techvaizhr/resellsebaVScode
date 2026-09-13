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
			"/assets/index-9JHL-UOp.js",
			"/assets/rolldown-runtime-QTnfLwEv.js",
			"/assets/vendor-charts-CkRyfaGy.js",
			"/assets/vendor-editor-_X2_vRjM.js",
			"/assets/createServerFn-D3Ix5k0M.js",
			"/assets/useStore-DZT5wF6z.js",
			"/assets/useRouter-ulk0ZvG7.js",
			"/assets/root-DLTE-HSj.js",
			"/assets/link-lrqq8FrD.js",
			"/assets/matchContext-6qI6VZAE.js",
			"/assets/vendor-icons-CDd3jCaH.js",
			"/assets/vendor-ui-DcTM-RRF.js",
			"/assets/utils-Cuz72dHL.js"
		],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-9JHL-UOp.js"
		} }]
	},
	"/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/index.tsx",
		children: void 0,
		preloads: [
			"/assets/routes-CfTGelrk.js",
			"/assets/finance-report-DT9qsI8L.js",
			"/assets/bootstrap-BjkmE7Tv.js",
			"/assets/icons-CzsQNHhg.js",
			"/assets/pwa-install-CbewidiK.js",
			"/assets/public-header-DDbwmWFb.js"
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
		preloads: ["/assets/route-DnwvaodC.js"]
	},
	"/catalog": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/catalog.tsx",
		children: ["/catalog/$slug", "/catalog/"],
		preloads: [
			"/assets/catalog-DGoR6Rmm.js",
			"/assets/shell-nAkSVJ63.js",
			"/assets/public-header-DDbwmWFb.js"
		]
	},
	"/login": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/login.tsx",
		children: void 0,
		preloads: [
			"/assets/login-DaVIymlD.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/advanced-settings-DYzg-SXT.js",
			"/assets/verification.functions-GwzTJJsT.js",
			"/assets/public-header-DDbwmWFb.js"
		]
	},
	"/privacy": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/privacy.tsx",
		children: void 0,
		preloads: ["/assets/privacy-CdR0JpYc.js", "/assets/public-header-DDbwmWFb.js"]
	},
	"/tutorials": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/tutorials.tsx",
		children: void 0,
		preloads: [
			"/assets/tutorials-B1f08eyn.js",
			"/assets/tutorial-library-C5kp1_MG.js",
			"/assets/public-header-DDbwmWFb.js"
		]
	},
	"/_authenticated/admin": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/route.tsx",
		children: [
			"/_authenticated/admin/advanced",
			"/_authenticated/admin/agent-payouts",
			"/_authenticated/admin/agent-report",
			"/_authenticated/admin/agents",
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
			"/assets/route-DorZnmmf.js",
			"/assets/useLocation-B0TV3aJx.js",
			"/assets/app-data-CKUGqubj.js",
			"/assets/use-auth-lxKB8GAL.js",
			"/assets/BulkScanModal-D1wvUbyM.js",
			"/assets/use-order-nav-count-DBNOuaG4.js"
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
			"/assets/route-oh0XyxCf.js",
			"/assets/useLocation-B0TV3aJx.js",
			"/assets/app-data-CKUGqubj.js",
			"/assets/panel-bootstrap-2XoLoAKp.js",
			"/assets/use-auth-lxKB8GAL.js",
			"/assets/impersonation-BcuLNndh.js",
			"/assets/reseller-status-BRiEAbFB.js",
			"/assets/use-order-nav-count-DBNOuaG4.js",
			"/assets/use-verification-CEXWnEZM.js",
			"/assets/impersonation-banner-DnDUySGF.js"
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
			"/assets/route-CZErHlyK.js",
			"/assets/app-data-CKUGqubj.js",
			"/assets/use-auth-lxKB8GAL.js",
			"/assets/supplier-BF_eCv0q.js",
			"/assets/use-order-nav-count-DBNOuaG4.js",
			"/assets/use-verification-CEXWnEZM.js",
			"/assets/impersonation-banner-DnDUySGF.js",
			"/assets/supplier-context-BU7JZggX.js"
		]
	},
	"/_authenticated/dashboard": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/dashboard.tsx",
		children: void 0,
		preloads: [
			"/assets/dashboard-DVLvsEiT.js",
			"/assets/use-auth-lxKB8GAL.js",
			"/assets/use-verification-CEXWnEZM.js"
		]
	},
	"/_authenticated/onboarding": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/onboarding.tsx",
		children: void 0,
		preloads: [
			"/assets/onboarding-BCcjgB_8.js",
			"/assets/app-data-CKUGqubj.js",
			"/assets/use-auth-lxKB8GAL.js",
			"/assets/impersonation-BcuLNndh.js",
			"/assets/reseller-status-BRiEAbFB.js",
			"/assets/use-verification-CEXWnEZM.js"
		]
	},
	"/_authenticated/verify": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/verify.tsx",
		children: void 0,
		preloads: [
			"/assets/verify-CJPji1ST.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/use-verification-CEXWnEZM.js",
			"/assets/verification.functions-GwzTJJsT.js"
		]
	},
	"/catalog/$slug": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/catalog.$slug.tsx",
		children: void 0,
		preloads: [
			"/assets/catalog._slug-D6bR3YmQ.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/app-data-CKUGqubj.js",
			"/assets/finance-report-DT9qsI8L.js",
			"/assets/image-picker-CTxPOPBF.js",
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
			"/assets/s._code-DRf7ATI8.js",
			"/assets/useRouterState-CM9cG9zO.js",
			"/assets/ui-BD4vMqrH.js",
			"/assets/store-content-DR8qgnfq.js",
			"/assets/store-menu-BOEv4kkP.js",
			"/assets/store-visits-ByvUpMZG.js"
		]
	},
	"/catalog/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/catalog.index.tsx",
		children: void 0,
		preloads: [
			"/assets/catalog.index-Bo8blOda.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/finance-report-DT9qsI8L.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/product-code-omBOVYTR.js",
			"/assets/image-picker-CTxPOPBF.js",
			"/assets/catalog.functions-pYBF3FyA.js"
		]
	},
	"/_authenticated/admin/advanced": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/advanced.tsx",
		children: void 0,
		preloads: [
			"/assets/advanced-Bl9CfePU.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/advanced-settings-DYzg-SXT.js",
			"/assets/deposit-settings-Dclx2Y_D.js"
		]
	},
	"/_authenticated/admin/agent-payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/agent-payouts.tsx",
		children: void 0,
		preloads: [
			"/assets/agent-payouts-BKTt8-8U.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/searchable-select-BSxHsJv_.js",
			"/assets/ledger-timeline-DwkVYK8D.js",
			"/assets/agents-On4y7z_e.js"
		]
	},
	"/_authenticated/admin/agent-report": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/agent-report.tsx",
		children: void 0,
		preloads: [
			"/assets/agent-report-CZhih-h1.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/searchable-select-BSxHsJv_.js",
			"/assets/agents-On4y7z_e.js",
			"/assets/date-range-filter-ChzayhKq.js"
		]
	},
	"/_authenticated/admin/agents": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/agents.tsx",
		children: void 0,
		preloads: [
			"/assets/agents-B6gU_RF8.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/agents-On4y7z_e.js",
			"/assets/auth-middleware-B2YU6ySB.js"
		]
	},
	"/_authenticated/admin/brands": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/brands.tsx",
		children: void 0,
		preloads: [
			"/assets/brands-CuASMHW3.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/ImageUploader-De2kFgBG.js"
		]
	},
	"/_authenticated/admin/business-report": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/business-report.tsx",
		children: void 0,
		preloads: [
			"/assets/business-report-Bf29tPe8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/finance-report-DT9qsI8L.js",
			"/assets/agents-On4y7z_e.js",
			"/assets/order-filters-_H2RpFyN.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/report-blocks-B-DKaW_k.js",
			"/assets/reseller-avatar-CbTfdTEo.js",
			"/assets/business-report-eFNEnsAi.js"
		]
	},
	"/_authenticated/admin/categories": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/categories.tsx",
		children: void 0,
		preloads: [
			"/assets/categories-Cle2mD_b.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/ImageUploader-De2kFgBG.js"
		]
	},
	"/_authenticated/admin/commissions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/commissions.tsx",
		children: void 0,
		preloads: ["/assets/commissions-BUnl9hUD.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/admin/couriers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/couriers.tsx",
		children: void 0,
		preloads: [
			"/assets/couriers-Twzdjb3v.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/courier-brand-DGvjbiVd.js"
		]
	},
	"/_authenticated/admin/customers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/customers.tsx",
		children: void 0,
		preloads: [
			"/assets/customers-Djdz58Cu.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/customers-report-CVEFWkU9.js"
		]
	},
	"/_authenticated/admin/deposit-transactions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/deposit-transactions.tsx",
		children: void 0,
		preloads: [
			"/assets/deposit-transactions-Co5JEY8B.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/deposit-ledger-CnX928Ek.js",
			"/assets/payment-methods-CDewIUy_.js",
			"/assets/deposit-pay-panel-BfOvD_6K.js"
		]
	},
	"/_authenticated/admin/domains": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/domains.tsx",
		children: void 0,
		preloads: [
			"/assets/domains-BvsjzXBJ.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/cloudflare.functions-BYvX5WAB.js"
		]
	},
	"/_authenticated/admin/expenses": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/expenses.tsx",
		children: void 0,
		preloads: [
			"/assets/expenses-DR8ET028.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/finance-report-DT9qsI8L.js",
			"/assets/order-filters-_H2RpFyN.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/report-blocks-B-DKaW_k.js",
			"/assets/business-report-eFNEnsAi.js"
		]
	},
	"/_authenticated/admin/landing": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/landing.tsx",
		children: void 0,
		preloads: [
			"/assets/landing-DfW-Oqni.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/ImageUploader-De2kFgBG.js",
			"/assets/icons-CzsQNHhg.js",
			"/assets/tabs-4Ugcp-Dh.js"
		]
	},
	"/_authenticated/admin/maintenance": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/maintenance.tsx",
		children: void 0,
		preloads: [
			"/assets/maintenance-CXrjAGsR.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/auth-middleware-B2YU6ySB.js"
		]
	},
	"/_authenticated/admin/marketing": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/marketing.tsx",
		children: void 0,
		preloads: ["/assets/marketing-plNQuq97.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/admin/media": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/media.tsx",
		children: void 0,
		preloads: [
			"/assets/media-BU_f6hw-.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/button-kNZ4kbD4.js",
			"/assets/data-list-C50cjcnV.js"
		]
	},
	"/_authenticated/admin/notices": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/notices.tsx",
		children: void 0,
		preloads: [
			"/assets/notices-BRQd0G_p.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/admin-notices-DzCMdCXp.js"
		]
	},
	"/_authenticated/admin/notifications": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/notifications.tsx",
		children: void 0,
		preloads: [
			"/assets/notifications-1aCv9V2B.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/auth-middleware-B2YU6ySB.js"
		]
	},
	"/_authenticated/admin/orders": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/orders.tsx",
		children: void 0,
		preloads: [
			"/assets/orders-DiLy8ZOq.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/order-search-ugpg-N0c.js",
			"/assets/CourierTimeline-X3IWrWms.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/finance-report-DT9qsI8L.js",
			"/assets/searchable-select-BSxHsJv_.js",
			"/assets/order-filters-_H2RpFyN.js",
			"/assets/dropdown-menu-DSacuumd.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/business-report-eFNEnsAi.js",
			"/assets/courier-brand-DGvjbiVd.js",
			"/assets/bootstrap-BjkmE7Tv.js",
			"/assets/NewOrderModal-j3grdBfB.js",
			"/assets/CopyOrderNumber-DCrQ-jKH.js",
			"/assets/labels-ASq-3kqT.js",
			"/assets/price-breakdown-m6iczn-U.js"
		]
	},
	"/_authenticated/admin/payments": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/payments.tsx",
		children: void 0,
		preloads: [
			"/assets/payments-DKmaOFh-.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/payment-methods-CDewIUy_.js",
			"/assets/payment-brand-DxxvN5fA.js",
			"/assets/AppModal-CkrLeEe4.js",
			"/assets/gateway-grid-D-fA3uhZ.js"
		]
	},
	"/_authenticated/admin/payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/payouts.tsx",
		children: void 0,
		preloads: [
			"/assets/payouts-C_BmU4Xs.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/searchable-select-BSxHsJv_.js",
			"/assets/data-list-C50cjcnV.js"
		]
	},
	"/_authenticated/admin/policies": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/policies.tsx",
		children: void 0,
		preloads: [
			"/assets/policies-C4fFWo0F.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/AppModal-CkrLeEe4.js"
		]
	},
	"/_authenticated/admin/privacy": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/privacy.tsx",
		children: void 0,
		preloads: [
			"/assets/privacy-DzbaE7ew.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/RichTextEditor-BuH1MOma.js"
		]
	},
	"/_authenticated/admin/resellers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/resellers.tsx",
		children: void 0,
		preloads: [
			"/assets/resellers-DCclsoI8.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/advanced-settings-DYzg-SXT.js",
			"/assets/searchable-select-BSxHsJv_.js",
			"/assets/auth-middleware-B2YU6ySB.js",
			"/assets/dropdown-menu-DSacuumd.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/reseller-avatar-CbTfdTEo.js",
			"/assets/deposit-ledger-CnX928Ek.js",
			"/assets/admin-users.functions-D8CY_1eO.js",
			"/assets/impersonation-BcuLNndh.js",
			"/assets/reseller-status-BRiEAbFB.js",
			"/assets/ResellerProfile-LM7mSlZ1.js",
			"/assets/password-reset-modal-BbJluzdm.js"
		]
	},
	"/_authenticated/admin/settings": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/settings.tsx",
		children: void 0,
		preloads: [
			"/assets/settings-Bs7wFEeL.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/ImageUploader-De2kFgBG.js"
		]
	},
	"/_authenticated/admin/staff": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/staff.tsx",
		children: void 0,
		preloads: [
			"/assets/staff-CZPulbpH.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/auth-middleware-B2YU6ySB.js",
			"/assets/dist-Bm7eTr0L.js",
			"/assets/dropdown-menu-DSacuumd.js",
			"/assets/tabs-4Ugcp-Dh.js",
			"/assets/admin-users.functions-D8CY_1eO.js"
		]
	},
	"/_authenticated/admin/subscriptions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/subscriptions.tsx",
		children: void 0,
		preloads: [
			"/assets/subscriptions-NkGbnH3Y.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/finance-report-DT9qsI8L.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/AppModal-CkrLeEe4.js"
		]
	},
	"/_authenticated/admin/supplier-payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/supplier-payouts.tsx",
		children: void 0,
		preloads: [
			"/assets/supplier-payouts-4-KdDRcD.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/supplier-BF_eCv0q.js",
			"/assets/status-tabs-DOHqUL2P.js"
		]
	},
	"/_authenticated/admin/supplier-report": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/supplier-report.tsx",
		children: void 0,
		preloads: [
			"/assets/supplier-report-_AU60Ecc.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/CopyOrderNumber-DCrQ-jKH.js",
			"/assets/supplier-BF_eCv0q.js",
			"/assets/supplier-report-summary-B10Oxfgk.js"
		]
	},
	"/_authenticated/admin/supplier-returns": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/supplier-returns.tsx",
		children: void 0,
		preloads: [
			"/assets/supplier-returns-TVZPxtsp.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/searchable-select-BSxHsJv_.js",
			"/assets/button-kNZ4kbD4.js",
			"/assets/CopyOrderNumber-DCrQ-jKH.js",
			"/assets/supplier-BF_eCv0q.js",
			"/assets/impersonation-BcuLNndh.js",
			"/assets/supplier-access.functions-DHc02lc1.js"
		]
	},
	"/_authenticated/admin/suppliers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/suppliers.tsx",
		children: void 0,
		preloads: [
			"/assets/suppliers-BfctIrle.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/dropdown-menu-DSacuumd.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/reseller-avatar-CbTfdTEo.js",
			"/assets/supplier-BF_eCv0q.js",
			"/assets/impersonation-BcuLNndh.js",
			"/assets/password-reset-modal-BbJluzdm.js",
			"/assets/supplier-access.functions-DHc02lc1.js"
		]
	},
	"/_authenticated/admin/transactions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/transactions.tsx",
		children: void 0,
		preloads: ["/assets/transactions-I_iICO5g.js", "/assets/transaction-report-YVQkKM1z.js"]
	},
	"/_authenticated/admin/tutorials": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/tutorials.tsx",
		children: void 0,
		preloads: [
			"/assets/tutorials-BxZUclWZ.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/AppModal-CkrLeEe4.js",
			"/assets/tutorials-Br2-6Cka.js"
		]
	},
	"/_authenticated/admin/visitors": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/visitors.tsx",
		children: void 0,
		preloads: [
			"/assets/visitors-BIrsa-XK.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/searchable-select-BSxHsJv_.js",
			"/assets/store-visits-report-C3XbiUra.js"
		]
	},
	"/_authenticated/reseller/catalog": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/catalog.tsx",
		children: void 0,
		preloads: [
			"/assets/catalog-C4TmNyJh.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/advanced-settings-DYzg-SXT.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/product-code-omBOVYTR.js",
			"/assets/price-breakdown-m6iczn-U.js",
			"/assets/Hint-BDdaji1G.js",
			"/assets/reseller-tools-Bn1PiraE.js",
			"/assets/image-picker-CTxPOPBF.js"
		]
	},
	"/_authenticated/reseller/commissions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/commissions.tsx",
		children: void 0,
		preloads: ["/assets/commissions-CvalMFFP.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/reseller/customers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/customers.tsx",
		children: void 0,
		preloads: [
			"/assets/customers-BtfgdAK4.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/customers-report-CVEFWkU9.js"
		]
	},
	"/_authenticated/reseller/domain": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/domain.tsx",
		children: void 0,
		preloads: [
			"/assets/domain-B65GFjgo.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/cloudflare.functions-BYvX5WAB.js"
		]
	},
	"/_authenticated/reseller/listings": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/listings.tsx",
		children: void 0,
		preloads: [
			"/assets/listings-B-Mzjdw0.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/dropdown-menu-DSacuumd.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/product-code-omBOVYTR.js",
			"/assets/reseller-tools-Bn1PiraE.js"
		]
	},
	"/_authenticated/reseller/marketing": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/marketing.tsx",
		children: void 0,
		preloads: ["/assets/marketing-DkOinNad.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/reseller/menus": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/menus.tsx",
		children: void 0,
		preloads: [
			"/assets/menus-mcLjfwGW.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/ImageUploader-De2kFgBG.js",
			"/assets/bootstrap-BjkmE7Tv.js",
			"/assets/store-menu-BOEv4kkP.js"
		]
	},
	"/_authenticated/reseller/orders": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/orders.tsx",
		children: ["/_authenticated/reseller/orders/$id/invoice"],
		preloads: [
			"/assets/orders-D_rtSkc8.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/order-search-ugpg-N0c.js",
			"/assets/CourierTimeline-X3IWrWms.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/finance-report-DT9qsI8L.js",
			"/assets/deposit-settings-Dclx2Y_D.js",
			"/assets/order-filters-_H2RpFyN.js",
			"/assets/dropdown-menu-DSacuumd.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/business-report-eFNEnsAi.js",
			"/assets/courier-brand-DGvjbiVd.js",
			"/assets/NewOrderModal-j3grdBfB.js",
			"/assets/CopyOrderNumber-DCrQ-jKH.js",
			"/assets/deposit-DmZ0lvGR.js"
		]
	},
	"/_authenticated/reseller/payments": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/payments.tsx",
		children: void 0,
		preloads: [
			"/assets/payments-B9KKa3We.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/bootstrap-BjkmE7Tv.js",
			"/assets/payment-methods-CDewIUy_.js",
			"/assets/gateways.functions-BgNy2Fdk.js",
			"/assets/payment-brand-DxxvN5fA.js",
			"/assets/AppModal-CkrLeEe4.js",
			"/assets/gateway-grid-D-fA3uhZ.js"
		]
	},
	"/_authenticated/reseller/payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/payouts.tsx",
		children: void 0,
		preloads: [
			"/assets/payouts-O2aaDLob.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/deposit-settings-Dclx2Y_D.js",
			"/assets/ledger-timeline-DwkVYK8D.js",
			"/assets/report-blocks-B-DKaW_k.js",
			"/assets/deposit-pay-panel-BfOvD_6K.js",
			"/assets/deposit-DmZ0lvGR.js",
			"/assets/deposit-notice-BLBHT8-W.js"
		]
	},
	"/_authenticated/reseller/policies": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/policies.tsx",
		children: void 0,
		preloads: ["/assets/policies-Dt0EwjNq.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/reseller/profile": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/profile.tsx",
		children: void 0,
		preloads: [
			"/assets/profile-DdiZEuzS.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/ImageUploader-De2kFgBG.js",
			"/assets/reseller-avatar-CbTfdTEo.js",
			"/assets/ResellerProfile-LM7mSlZ1.js"
		]
	},
	"/_authenticated/reseller/settings": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/settings.tsx",
		children: void 0,
		preloads: [
			"/assets/settings-BtXuMKkv.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/ImageUploader-De2kFgBG.js",
			"/assets/bootstrap-BjkmE7Tv.js"
		]
	},
	"/_authenticated/reseller/subscription": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/subscription.tsx",
		children: void 0,
		preloads: [
			"/assets/subscription-BwjEERVj.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/finance-report-DT9qsI8L.js",
			"/assets/payment-methods-CDewIUy_.js",
			"/assets/AppModal-CkrLeEe4.js"
		]
	},
	"/_authenticated/reseller/support": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/support.tsx",
		children: void 0,
		preloads: ["/assets/support-C2XJtk59.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/reseller/theme": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/theme.tsx",
		children: void 0,
		preloads: [
			"/assets/theme-cCU7PCGu.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/ImageUploader-De2kFgBG.js",
			"/assets/bootstrap-BjkmE7Tv.js",
			"/assets/store-content-DR8qgnfq.js"
		]
	},
	"/_authenticated/reseller/transactions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/transactions.tsx",
		children: void 0,
		preloads: ["/assets/transactions-BpuQA8AX.js", "/assets/transaction-report-YVQkKM1z.js"]
	},
	"/_authenticated/reseller/tutorials": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/tutorials.tsx",
		children: void 0,
		preloads: [
			"/assets/tutorials-CuHFLAJL.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/tutorial-library-C5kp1_MG.js"
		]
	},
	"/_authenticated/reseller/visitors": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/visitors.tsx",
		children: void 0,
		preloads: [
			"/assets/visitors-BlaKJ7f-.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/store-visits-report-C3XbiUra.js"
		]
	},
	"/_authenticated/supplier/media": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/media.tsx",
		children: void 0,
		preloads: [
			"/assets/media-HKPvRtq3.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/button-kNZ4kbD4.js",
			"/assets/data-list-C50cjcnV.js"
		]
	},
	"/_authenticated/supplier/orders": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/orders.tsx",
		children: void 0,
		preloads: [
			"/assets/orders-DjarFENI.js",
			"/assets/order-search-ugpg-N0c.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/order-filters-_H2RpFyN.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/courier-brand-DGvjbiVd.js",
			"/assets/BulkScanModal-D1wvUbyM.js",
			"/assets/CopyOrderNumber-DCrQ-jKH.js",
			"/assets/labels-ASq-3kqT.js"
		]
	},
	"/_authenticated/supplier/payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/payouts.tsx",
		children: void 0,
		preloads: ["/assets/payouts-D6Ez_sbw.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/supplier/products": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/products.tsx",
		children: void 0,
		preloads: [
			"/assets/products-vBFyV1Nd.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/searchable-select-BSxHsJv_.js",
			"/assets/dropdown-menu-DSacuumd.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/ImageUploader-De2kFgBG.js",
			"/assets/AppModal-CkrLeEe4.js",
			"/assets/RichTextEditor-BuH1MOma.js",
			"/assets/Hint-BDdaji1G.js",
			"/assets/product-import-Dw0zVFuJ.js"
		]
	},
	"/_authenticated/supplier/profile": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/profile.tsx",
		children: void 0,
		preloads: ["/assets/profile-DSjbi0WO.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/supplier/report": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/report.tsx",
		children: void 0,
		preloads: [
			"/assets/report-BdTxJUQp.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/CopyOrderNumber-DCrQ-jKH.js",
			"/assets/status-tabs-DOHqUL2P.js",
			"/assets/supplier-report-summary-B10Oxfgk.js"
		]
	},
	"/_authenticated/supplier/returns": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/returns.tsx",
		children: void 0,
		preloads: [
			"/assets/returns-DuRayKYa.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/CopyOrderNumber-DCrQ-jKH.js",
			"/assets/status-tabs-DOHqUL2P.js"
		]
	},
	"/s/$code/checkout": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.checkout.tsx",
		children: void 0,
		preloads: [
			"/assets/s._code.checkout-BOtj4ShI.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/app-data-CKUGqubj.js",
			"/assets/advanced-settings-DYzg-SXT.js",
			"/assets/gateways.functions-BgNy2Fdk.js",
			"/assets/payment-brand-DxxvN5fA.js",
			"/assets/checkout-validate-Bep8wCSp.js"
		]
	},
	"/s/$code/thanks": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.thanks.tsx",
		children: void 0,
		preloads: [
			"/assets/s._code.thanks-BjRCqTaE.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/gateways.functions-BgNy2Fdk.js"
		]
	},
	"/_authenticated/admin/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/index.tsx",
		children: void 0,
		preloads: [
			"/assets/admin-CB2YNohk.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/finance-report-DT9qsI8L.js",
			"/assets/date-range-filter-ChzayhKq.js",
			"/assets/bootstrap-BjkmE7Tv.js",
			"/assets/NewOrderModal-j3grdBfB.js"
		]
	},
	"/_authenticated/reseller/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/index.tsx",
		children: void 0,
		preloads: [
			"/assets/reseller-CsKZSKq-.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/finance-report-DT9qsI8L.js",
			"/assets/date-range-filter-ChzayhKq.js",
			"/assets/report-blocks-B-DKaW_k.js",
			"/assets/bootstrap-BjkmE7Tv.js",
			"/assets/payment-methods-CDewIUy_.js",
			"/assets/payment-brand-DxxvN5fA.js",
			"/assets/NewOrderModal-j3grdBfB.js",
			"/assets/admin-notices-DzCMdCXp.js",
			"/assets/deposit-DmZ0lvGR.js",
			"/assets/deposit-notice-BLBHT8-W.js"
		]
	},
	"/_authenticated/supplier/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/index.tsx",
		children: void 0,
		preloads: [
			"/assets/supplier-bnvcHYto.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/report-blocks-B-DKaW_k.js",
			"/assets/CopyOrderNumber-DCrQ-jKH.js"
		]
	},
	"/s/$code/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.index.tsx",
		children: void 0,
		preloads: ["/assets/s._code.index-cBdBar1l.js"]
	},
	"/_authenticated/admin/products/new": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/products.new.tsx",
		children: void 0,
		preloads: [
			"/assets/products.new-CZj125OV.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/advanced-settings-DYzg-SXT.js",
			"/assets/searchable-select-BSxHsJv_.js",
			"/assets/ImageUploader-De2kFgBG.js",
			"/assets/price-breakdown-m6iczn-U.js",
			"/assets/RichTextEditor-BuH1MOma.js",
			"/assets/slug-DOsHC_HV.js",
			"/assets/Hint-BDdaji1G.js",
			"/assets/product-import-Dw0zVFuJ.js",
			"/assets/ProductImportModal-CzPMrE7c.js"
		]
	},
	"/s/$code/c/$slug": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.c.$slug.tsx",
		children: void 0,
		preloads: ["/assets/s._code.c._slug-BnulG1Q-.js"]
	},
	"/s/$code/p/$slug": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.p.$slug.tsx",
		children: void 0,
		preloads: [
			"/assets/s._code.p._slug-BA4q8HmK.js",
			"/assets/app-data-CKUGqubj.js",
			"/assets/product-code-omBOVYTR.js",
			"/assets/reseller-tools-Bn1PiraE.js"
		]
	},
	"/_authenticated/admin/products/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/products.index.tsx",
		children: void 0,
		preloads: [
			"/assets/products.index-Be7DPdqh.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/advanced-settings-DYzg-SXT.js",
			"/assets/button-kNZ4kbD4.js",
			"/assets/dropdown-menu-DSacuumd.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/AppModal-CkrLeEe4.js",
			"/assets/reseller-tools-Bn1PiraE.js",
			"/assets/ProductImportModal-CzPMrE7c.js",
			"/assets/supplier-BF_eCv0q.js"
		]
	},
	"/_authenticated/admin/products/$id/edit": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/products.$id.edit.tsx",
		children: void 0,
		preloads: [
			"/assets/products._id.edit-CPZEIXUb.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/searchable-select-BSxHsJv_.js",
			"/assets/ImageUploader-De2kFgBG.js",
			"/assets/price-breakdown-m6iczn-U.js",
			"/assets/RichTextEditor-BuH1MOma.js",
			"/assets/slug-DOsHC_HV.js",
			"/assets/Hint-BDdaji1G.js"
		]
	},
	"/_authenticated/reseller/orders/$id/invoice": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/orders.$id.invoice.tsx",
		children: void 0,
		preloads: ["/assets/orders._id.invoice-DjOgjTRu.js"]
	}
} });
//#endregion
export { tsrStartManifest };
