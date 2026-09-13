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
			"/assets/index-DYOZJlP_.js",
			"/assets/rolldown-runtime-QTnfLwEv.js",
			"/assets/vendor-charts-CkRyfaGy.js",
			"/assets/vendor-editor-_X2_vRjM.js",
			"/assets/createServerFn-Bi_fWk9I.js",
			"/assets/useStore-CS1maFo5.js",
			"/assets/useRouter-CqUDDOHC.js",
			"/assets/redirect-CaDPrkdo.js",
			"/assets/root-DLTE-HSj.js",
			"/assets/link-fFwI_FiX.js",
			"/assets/matchContext-6qI6VZAE.js",
			"/assets/vendor-icons-ClLzBSp0.js",
			"/assets/vendor-ui-DcTM-RRF.js",
			"/assets/utils-Cuz72dHL.js"
		],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-DYOZJlP_.js"
		} }]
	},
	"/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/index.tsx",
		children: void 0,
		preloads: [
			"/assets/routes-DK60SK_W.js",
			"/assets/finance-report-S4kGQjcI.js",
			"/assets/bootstrap-D25cULfE.js",
			"/assets/landing-content-Bp4x7_FG.js",
			"/assets/pwa-install-B_rRm3TN.js",
			"/assets/public-header-MkgWbvQM.js"
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
		preloads: ["/assets/route-CSftFb6S.js"]
	},
	"/catalog": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/catalog.tsx",
		children: ["/catalog/$slug", "/catalog/"],
		preloads: [
			"/assets/catalog-X7MK1gUf.js",
			"/assets/shell-Bq2e52eo.js",
			"/assets/public-header-MkgWbvQM.js"
		]
	},
	"/login": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/login.tsx",
		children: void 0,
		preloads: [
			"/assets/login-CDxWh17T.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/advanced-settings-B7KCl45A.js",
			"/assets/verification.functions--fab7Vpr.js",
			"/assets/public-header-MkgWbvQM.js"
		]
	},
	"/privacy": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/privacy.tsx",
		children: void 0,
		preloads: ["/assets/privacy-_XhNXA2i.js", "/assets/public-header-MkgWbvQM.js"]
	},
	"/tutorials": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/tutorials.tsx",
		children: void 0,
		preloads: [
			"/assets/tutorials-B6jqJKRW.js",
			"/assets/tutorial-library-DobFfjc4.js",
			"/assets/public-header-MkgWbvQM.js"
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
			"/assets/route-BzR3lYKV.js",
			"/assets/useLocation-CpGuGefX.js",
			"/assets/app-data-Dl1wTy1x.js",
			"/assets/use-auth-Dyryf1CU.js",
			"/assets/BulkScanModal-D4DUjvH2.js",
			"/assets/use-order-nav-count-DApqMVGL.js",
			"/assets/permissions-DF8vQ_EF.js"
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
			"/assets/route-TGrKS3KP.js",
			"/assets/useLocation-CpGuGefX.js",
			"/assets/app-data-Dl1wTy1x.js",
			"/assets/panel-bootstrap-2XoLoAKp.js",
			"/assets/use-auth-Dyryf1CU.js",
			"/assets/impersonation-Chy1Yp_1.js",
			"/assets/reseller-status-BRiEAbFB.js",
			"/assets/use-order-nav-count-DApqMVGL.js",
			"/assets/subscription-DNzx02g8.js",
			"/assets/use-verification--yoRs0hO.js",
			"/assets/impersonation-banner-Dxx5IykL.js"
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
			"/assets/route-DpNApK8L.js",
			"/assets/app-data-Dl1wTy1x.js",
			"/assets/use-auth-Dyryf1CU.js",
			"/assets/supplier-DzKBUp_E.js",
			"/assets/use-order-nav-count-DApqMVGL.js",
			"/assets/use-verification--yoRs0hO.js",
			"/assets/impersonation-banner-Dxx5IykL.js",
			"/assets/supplier-context-BU7JZggX.js"
		]
	},
	"/_authenticated/dashboard": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/dashboard.tsx",
		children: void 0,
		preloads: [
			"/assets/dashboard-CMagh8Sz.js",
			"/assets/use-auth-Dyryf1CU.js",
			"/assets/use-verification--yoRs0hO.js"
		]
	},
	"/_authenticated/onboarding": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/onboarding.tsx",
		children: void 0,
		preloads: [
			"/assets/onboarding-DQaincKT.js",
			"/assets/app-data-Dl1wTy1x.js",
			"/assets/use-auth-Dyryf1CU.js",
			"/assets/impersonation-Chy1Yp_1.js",
			"/assets/reseller-status-BRiEAbFB.js",
			"/assets/use-verification--yoRs0hO.js"
		]
	},
	"/_authenticated/verify": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/verify.tsx",
		children: void 0,
		preloads: [
			"/assets/verify-BxE08AAR.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/use-verification--yoRs0hO.js",
			"/assets/verification.functions--fab7Vpr.js"
		]
	},
	"/catalog/$slug": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/catalog.$slug.tsx",
		children: void 0,
		preloads: [
			"/assets/catalog._slug-QCJQGLaM.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/app-data-Dl1wTy1x.js",
			"/assets/finance-report-S4kGQjcI.js",
			"/assets/image-picker--DHMQHDh.js",
			"/assets/catalog.functions-BP0xbV47.js"
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
			"/assets/s._code-BMlY5s-v.js",
			"/assets/useRouterState-DdxcXHTw.js",
			"/assets/ui-COojiGiI.js",
			"/assets/store-content-DroOL-aq.js",
			"/assets/store-menu-CmPwIVyl.js",
			"/assets/pwa-install-B_rRm3TN.js",
			"/assets/store-visits-DKsws2nL.js"
		]
	},
	"/catalog/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/catalog.index.tsx",
		children: void 0,
		preloads: [
			"/assets/catalog.index-DySnYioA.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/finance-report-S4kGQjcI.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/product-code-C0VIB5J9.js",
			"/assets/image-picker--DHMQHDh.js",
			"/assets/catalog.functions-BP0xbV47.js"
		]
	},
	"/_authenticated/admin/advanced": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/advanced.tsx",
		children: void 0,
		preloads: [
			"/assets/advanced-BFS5JjmP.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/advanced-settings-B7KCl45A.js",
			"/assets/deposit-settings-BumFht3a.js"
		]
	},
	"/_authenticated/admin/agent-payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/agent-payouts.tsx",
		children: void 0,
		preloads: [
			"/assets/agent-payouts-t33Z8zPe.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/date-LErKaP8X.js",
			"/assets/ledger-timeline-DWBSmVwP.js",
			"/assets/agents-q0_UQ_QF.js"
		]
	},
	"/_authenticated/admin/agent-report": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/agent-report.tsx",
		children: void 0,
		preloads: [
			"/assets/agent-report-DvMd7HzR.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/date-LErKaP8X.js",
			"/assets/agents-q0_UQ_QF.js",
			"/assets/date-range-filter-C-BzTyoO.js"
		]
	},
	"/_authenticated/admin/agents": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/agents.tsx",
		children: void 0,
		preloads: [
			"/assets/agents-C3ePWd-F.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/agents-q0_UQ_QF.js",
			"/assets/auth-middleware-Duju6X9B.js"
		]
	},
	"/_authenticated/admin/backup": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/backup.tsx",
		children: void 0,
		preloads: ["/assets/backup-D976UzIm.js", "/assets/ui-kit-CpmBMi4p.js"]
	},
	"/_authenticated/admin/brands": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/brands.tsx",
		children: void 0,
		preloads: [
			"/assets/brands-Rtb6UKTi.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/ImageUploader-DQAxWSIu.js"
		]
	},
	"/_authenticated/admin/business-report": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/business-report.tsx",
		children: void 0,
		preloads: [
			"/assets/business-report-IALM9SBc.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/finance-report-S4kGQjcI.js",
			"/assets/agents-q0_UQ_QF.js",
			"/assets/order-filters-CJ9pQZ8D.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/report-blocks-xdnsCFlH.js",
			"/assets/reseller-avatar-CbTfdTEo.js",
			"/assets/business-report-0eeXaYFg.js"
		]
	},
	"/_authenticated/admin/categories": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/categories.tsx",
		children: void 0,
		preloads: [
			"/assets/categories-BTB-Xqw5.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/ImageUploader-DQAxWSIu.js"
		]
	},
	"/_authenticated/admin/commissions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/commissions.tsx",
		children: void 0,
		preloads: ["/assets/commissions-DV3Ib_02.js", "/assets/ui-kit-CpmBMi4p.js"]
	},
	"/_authenticated/admin/couriers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/couriers.tsx",
		children: void 0,
		preloads: [
			"/assets/couriers-sQVCH4w8.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/courier-brand--uFFV3NC.js"
		]
	},
	"/_authenticated/admin/customers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/customers.tsx",
		children: void 0,
		preloads: [
			"/assets/customers-CVOOoDaw.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/customers-report-DY_pI28R.js"
		]
	},
	"/_authenticated/admin/deposit-transactions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/deposit-transactions.tsx",
		children: void 0,
		preloads: [
			"/assets/deposit-transactions-B7gTYViu.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/date-LErKaP8X.js",
			"/assets/deposit-ledger-9Fb1NdUQ.js",
			"/assets/payment-methods-BL3pwUlJ.js",
			"/assets/deposit-pay-panel-lAKwNyRY.js"
		]
	},
	"/_authenticated/admin/domains": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/domains.tsx",
		children: void 0,
		preloads: [
			"/assets/domains-CbgZtRYx.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/cloudflare.functions-BngxIdrI.js"
		]
	},
	"/_authenticated/admin/expenses": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/expenses.tsx",
		children: void 0,
		preloads: [
			"/assets/expenses-BvdPktLd.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/finance-report-S4kGQjcI.js",
			"/assets/order-filters-CJ9pQZ8D.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/report-blocks-xdnsCFlH.js",
			"/assets/business-report-0eeXaYFg.js"
		]
	},
	"/_authenticated/admin/landing": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/landing.tsx",
		children: void 0,
		preloads: [
			"/assets/landing-DFemFXns.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/ImageUploader-DQAxWSIu.js",
			"/assets/landing-content-Bp4x7_FG.js",
			"/assets/tabs-4Ugcp-Dh.js"
		]
	},
	"/_authenticated/admin/maintenance": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/maintenance.tsx",
		children: void 0,
		preloads: [
			"/assets/maintenance-DjVjcyal.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/auth-middleware-Duju6X9B.js"
		]
	},
	"/_authenticated/admin/marketing": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/marketing.tsx",
		children: void 0,
		preloads: ["/assets/marketing-B9QE9mTM.js", "/assets/ui-kit-CpmBMi4p.js"]
	},
	"/_authenticated/admin/media": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/media.tsx",
		children: void 0,
		preloads: [
			"/assets/media-gFwky6KM.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/button-kNZ4kbD4.js",
			"/assets/data-list-CDjbwaL-.js"
		]
	},
	"/_authenticated/admin/notices": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/notices.tsx",
		children: void 0,
		preloads: [
			"/assets/notices-XogY_qIJ.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/admin-notices-B3-UvvYy.js"
		]
	},
	"/_authenticated/admin/notifications": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/notifications.tsx",
		children: void 0,
		preloads: [
			"/assets/notifications-Cj48x3iE.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/auth-middleware-Duju6X9B.js"
		]
	},
	"/_authenticated/admin/orders": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/orders.tsx",
		children: void 0,
		preloads: [
			"/assets/orders-D84RKGd7.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/order-search-CVSUyiHN.js",
			"/assets/CourierTimeline-Csbi3yxm.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/finance-report-S4kGQjcI.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/order-filters-CJ9pQZ8D.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/business-report-0eeXaYFg.js",
			"/assets/courier-brand--uFFV3NC.js",
			"/assets/bootstrap-D25cULfE.js",
			"/assets/NewOrderModal-goDkyKGV.js",
			"/assets/CopyOrderNumber-txArLqNR.js",
			"/assets/labels-B6e7-mlf.js",
			"/assets/price-breakdown-91S2vPea.js"
		]
	},
	"/_authenticated/admin/payments": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/payments.tsx",
		children: void 0,
		preloads: [
			"/assets/payments-IzHdDC4L.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/payment-methods-BL3pwUlJ.js",
			"/assets/payment-brand-DxxvN5fA.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/gateway-grid-crL8_S0P.js"
		]
	},
	"/_authenticated/admin/payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/payouts.tsx",
		children: void 0,
		preloads: [
			"/assets/payouts-C_Ik0A2k.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/date-LErKaP8X.js",
			"/assets/data-list-CDjbwaL-.js"
		]
	},
	"/_authenticated/admin/policies": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/policies.tsx",
		children: void 0,
		preloads: [
			"/assets/policies-BTd6KvSX.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/policies-LTYNA1eA.js"
		]
	},
	"/_authenticated/admin/privacy": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/privacy.tsx",
		children: void 0,
		preloads: [
			"/assets/privacy-s4pXYjf0.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/RichTextEditor-jHkcO2in.js"
		]
	},
	"/_authenticated/admin/resellers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/resellers.tsx",
		children: void 0,
		preloads: [
			"/assets/resellers-CWrkTKuv.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/advanced-settings-B7KCl45A.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/date-LErKaP8X.js",
			"/assets/auth-middleware-Duju6X9B.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/reseller-avatar-CbTfdTEo.js",
			"/assets/deposit-ledger-9Fb1NdUQ.js",
			"/assets/admin-users.functions-Bg-02CLV.js",
			"/assets/impersonation-Chy1Yp_1.js",
			"/assets/reseller-status-BRiEAbFB.js",
			"/assets/ResellerProfile-CoSCfaw7.js",
			"/assets/password-reset-modal-Cjgywck6.js"
		]
	},
	"/_authenticated/admin/settings": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/settings.tsx",
		children: void 0,
		preloads: [
			"/assets/settings-Sc25WI56.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/ImageUploader-DQAxWSIu.js"
		]
	},
	"/_authenticated/admin/staff": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/staff.tsx",
		children: void 0,
		preloads: [
			"/assets/staff-BgqrcHCp.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/auth-middleware-Duju6X9B.js",
			"/assets/dist-Bm7eTr0L.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/tabs-4Ugcp-Dh.js",
			"/assets/admin-users.functions-Bg-02CLV.js"
		]
	},
	"/_authenticated/admin/subscriptions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/subscriptions.tsx",
		children: void 0,
		preloads: [
			"/assets/subscriptions-BRU0thL_.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/finance-report-S4kGQjcI.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/subscription-DNzx02g8.js"
		]
	},
	"/_authenticated/admin/supplier-payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/supplier-payouts.tsx",
		children: void 0,
		preloads: [
			"/assets/supplier-payouts-DAbPN_OG.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/supplier-DzKBUp_E.js",
			"/assets/status-tabs-CjrpntaN.js"
		]
	},
	"/_authenticated/admin/supplier-report": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/supplier-report.tsx",
		children: void 0,
		preloads: [
			"/assets/supplier-report-EzQ5gAor.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/CopyOrderNumber-txArLqNR.js",
			"/assets/supplier-DzKBUp_E.js",
			"/assets/supplier-report-summary-DOmpRMlP.js"
		]
	},
	"/_authenticated/admin/supplier-returns": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/supplier-returns.tsx",
		children: void 0,
		preloads: [
			"/assets/supplier-returns-IQ1fZE1Z.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/button-kNZ4kbD4.js",
			"/assets/CopyOrderNumber-txArLqNR.js",
			"/assets/supplier-DzKBUp_E.js",
			"/assets/impersonation-Chy1Yp_1.js",
			"/assets/supplier-access.functions-LK1WqJzq.js"
		]
	},
	"/_authenticated/admin/suppliers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/suppliers.tsx",
		children: void 0,
		preloads: [
			"/assets/suppliers-DNd6jvOi.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/reseller-avatar-CbTfdTEo.js",
			"/assets/supplier-DzKBUp_E.js",
			"/assets/impersonation-Chy1Yp_1.js",
			"/assets/password-reset-modal-Cjgywck6.js",
			"/assets/supplier-access.functions-LK1WqJzq.js"
		]
	},
	"/_authenticated/admin/transactions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/transactions.tsx",
		children: void 0,
		preloads: ["/assets/transactions-X_JRY153.js", "/assets/transaction-report-BwtK4Cb2.js"]
	},
	"/_authenticated/admin/tutorials": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/tutorials.tsx",
		children: void 0,
		preloads: [
			"/assets/tutorials-qF1nhY-R.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/tutorials-CQlDLems.js"
		]
	},
	"/_authenticated/admin/visitors": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/visitors.tsx",
		children: void 0,
		preloads: [
			"/assets/visitors-0waSUN7J.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/date-LErKaP8X.js",
			"/assets/store-visits-report-BDFiP28J.js"
		]
	},
	"/_authenticated/reseller/catalog": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/catalog.tsx",
		children: void 0,
		preloads: [
			"/assets/catalog-zjrE_bhc.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/advanced-settings-B7KCl45A.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/product-code-C0VIB5J9.js",
			"/assets/price-breakdown-91S2vPea.js",
			"/assets/Hint-Lvce_jzt.js",
			"/assets/reseller-tools-Cq5xZHqb.js",
			"/assets/image-picker--DHMQHDh.js"
		]
	},
	"/_authenticated/reseller/commissions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/commissions.tsx",
		children: void 0,
		preloads: ["/assets/commissions-CtWdbJeS.js", "/assets/ui-kit-CpmBMi4p.js"]
	},
	"/_authenticated/reseller/customers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/customers.tsx",
		children: void 0,
		preloads: [
			"/assets/customers-C5ICN58H.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/customers-report-DY_pI28R.js"
		]
	},
	"/_authenticated/reseller/domain": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/domain.tsx",
		children: void 0,
		preloads: [
			"/assets/domain-CeXTSYwh.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/cloudflare.functions-BngxIdrI.js"
		]
	},
	"/_authenticated/reseller/listings": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/listings.tsx",
		children: void 0,
		preloads: [
			"/assets/listings-DFypVcCR.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/product-code-C0VIB5J9.js",
			"/assets/reseller-tools-Cq5xZHqb.js"
		]
	},
	"/_authenticated/reseller/marketing": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/marketing.tsx",
		children: void 0,
		preloads: ["/assets/marketing-BBCnZetS.js", "/assets/ui-kit-CpmBMi4p.js"]
	},
	"/_authenticated/reseller/menus": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/menus.tsx",
		children: void 0,
		preloads: [
			"/assets/menus-Cu2C5eXZ.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/ImageUploader-DQAxWSIu.js",
			"/assets/bootstrap-D25cULfE.js",
			"/assets/store-menu-CmPwIVyl.js"
		]
	},
	"/_authenticated/reseller/orders": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/orders.tsx",
		children: ["/_authenticated/reseller/orders/$id/invoice"],
		preloads: [
			"/assets/orders-DJF5T1zT.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/order-search-CVSUyiHN.js",
			"/assets/CourierTimeline-Csbi3yxm.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/finance-report-S4kGQjcI.js",
			"/assets/deposit-settings-BumFht3a.js",
			"/assets/order-filters-CJ9pQZ8D.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/business-report-0eeXaYFg.js",
			"/assets/courier-brand--uFFV3NC.js",
			"/assets/NewOrderModal-goDkyKGV.js",
			"/assets/CopyOrderNumber-txArLqNR.js",
			"/assets/deposit-De8O4ByN.js"
		]
	},
	"/_authenticated/reseller/payments": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/payments.tsx",
		children: void 0,
		preloads: [
			"/assets/payments-BLI0pox3.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/bootstrap-D25cULfE.js",
			"/assets/payment-methods-BL3pwUlJ.js",
			"/assets/gateways.functions-D-I9qGr6.js",
			"/assets/payment-brand-DxxvN5fA.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/gateway-grid-crL8_S0P.js"
		]
	},
	"/_authenticated/reseller/payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/payouts.tsx",
		children: void 0,
		preloads: [
			"/assets/payouts-DrdIVVTF.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/deposit-settings-BumFht3a.js",
			"/assets/date-LErKaP8X.js",
			"/assets/ledger-timeline-DWBSmVwP.js",
			"/assets/report-blocks-xdnsCFlH.js",
			"/assets/deposit-pay-panel-lAKwNyRY.js",
			"/assets/deposit-De8O4ByN.js",
			"/assets/deposit-notice-CBCfqrq6.js"
		]
	},
	"/_authenticated/reseller/policies": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/policies.tsx",
		children: void 0,
		preloads: [
			"/assets/policies-CQDWZlMJ.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/policies-LTYNA1eA.js"
		]
	},
	"/_authenticated/reseller/profile": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/profile.tsx",
		children: void 0,
		preloads: [
			"/assets/profile-BEU8zfl6.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/ImageUploader-DQAxWSIu.js",
			"/assets/reseller-avatar-CbTfdTEo.js",
			"/assets/ResellerProfile-CoSCfaw7.js"
		]
	},
	"/_authenticated/reseller/settings": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/settings.tsx",
		children: void 0,
		preloads: [
			"/assets/settings-CDgcn1Ky.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/ImageUploader-DQAxWSIu.js",
			"/assets/bootstrap-D25cULfE.js"
		]
	},
	"/_authenticated/reseller/subscription": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/subscription.tsx",
		children: void 0,
		preloads: [
			"/assets/subscription-0MNTNkPV.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/finance-report-S4kGQjcI.js",
			"/assets/payment-methods-BL3pwUlJ.js",
			"/assets/AppModal-Dly020dH.js"
		]
	},
	"/_authenticated/reseller/support": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/support.tsx",
		children: void 0,
		preloads: ["/assets/support-E13KXPcN.js", "/assets/ui-kit-CpmBMi4p.js"]
	},
	"/_authenticated/reseller/theme": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/theme.tsx",
		children: void 0,
		preloads: [
			"/assets/theme-BmMUnc8w.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/ImageUploader-DQAxWSIu.js",
			"/assets/bootstrap-D25cULfE.js",
			"/assets/store-content-DroOL-aq.js"
		]
	},
	"/_authenticated/reseller/transactions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/transactions.tsx",
		children: void 0,
		preloads: ["/assets/transactions-DIhIEUWW.js", "/assets/transaction-report-BwtK4Cb2.js"]
	},
	"/_authenticated/reseller/tutorials": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/tutorials.tsx",
		children: void 0,
		preloads: [
			"/assets/tutorials-DM5DIqlo.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/tutorial-library-DobFfjc4.js"
		]
	},
	"/_authenticated/reseller/visitors": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/visitors.tsx",
		children: void 0,
		preloads: [
			"/assets/visitors-Cym0QnIv.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/store-visits-report-BDFiP28J.js"
		]
	},
	"/_authenticated/supplier/media": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/media.tsx",
		children: void 0,
		preloads: [
			"/assets/media-DNQwq7Tw.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/button-kNZ4kbD4.js",
			"/assets/data-list-CDjbwaL-.js"
		]
	},
	"/_authenticated/supplier/orders": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/orders.tsx",
		children: void 0,
		preloads: [
			"/assets/orders-Dz4g9nSf.js",
			"/assets/order-search-CVSUyiHN.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/order-filters-CJ9pQZ8D.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/courier-brand--uFFV3NC.js",
			"/assets/BulkScanModal-D4DUjvH2.js",
			"/assets/CopyOrderNumber-txArLqNR.js",
			"/assets/labels-B6e7-mlf.js"
		]
	},
	"/_authenticated/supplier/payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/payouts.tsx",
		children: void 0,
		preloads: ["/assets/payouts-yJTZxFex.js", "/assets/ui-kit-CpmBMi4p.js"]
	},
	"/_authenticated/supplier/products": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/products.tsx",
		children: void 0,
		preloads: [
			"/assets/products-8gjkHTpT.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/ImageUploader-DQAxWSIu.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/RichTextEditor-jHkcO2in.js",
			"/assets/Hint-Lvce_jzt.js",
			"/assets/product-import-DNxWBs4P.js"
		]
	},
	"/_authenticated/supplier/profile": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/profile.tsx",
		children: void 0,
		preloads: ["/assets/profile-CGguBO1R.js", "/assets/ui-kit-CpmBMi4p.js"]
	},
	"/_authenticated/supplier/report": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/report.tsx",
		children: void 0,
		preloads: [
			"/assets/report-Dj6HDrE_.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/CopyOrderNumber-txArLqNR.js",
			"/assets/status-tabs-CjrpntaN.js",
			"/assets/supplier-report-summary-DOmpRMlP.js"
		]
	},
	"/_authenticated/supplier/returns": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/returns.tsx",
		children: void 0,
		preloads: [
			"/assets/returns-_j6Rt7zx.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/CopyOrderNumber-txArLqNR.js",
			"/assets/status-tabs-CjrpntaN.js"
		]
	},
	"/s/$code/checkout": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.checkout.tsx",
		children: void 0,
		preloads: [
			"/assets/s._code.checkout-B_majLb5.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/app-data-Dl1wTy1x.js",
			"/assets/advanced-settings-B7KCl45A.js",
			"/assets/gateways.functions-D-I9qGr6.js",
			"/assets/payment-brand-DxxvN5fA.js",
			"/assets/checkout-validate-Bep8wCSp.js"
		]
	},
	"/s/$code/thanks": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.thanks.tsx",
		children: void 0,
		preloads: [
			"/assets/s._code.thanks-DOOmJSv6.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/gateways.functions-D-I9qGr6.js"
		]
	},
	"/_authenticated/admin/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/index.tsx",
		children: void 0,
		preloads: [
			"/assets/admin-BacEgDbQ.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/finance-report-S4kGQjcI.js",
			"/assets/date-range-filter-C-BzTyoO.js",
			"/assets/bootstrap-D25cULfE.js",
			"/assets/NewOrderModal-goDkyKGV.js"
		]
	},
	"/_authenticated/reseller/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/index.tsx",
		children: void 0,
		preloads: [
			"/assets/reseller-Drkc0FQy.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/finance-report-S4kGQjcI.js",
			"/assets/date-range-filter-C-BzTyoO.js",
			"/assets/report-blocks-xdnsCFlH.js",
			"/assets/bootstrap-D25cULfE.js",
			"/assets/payment-methods-BL3pwUlJ.js",
			"/assets/payment-brand-DxxvN5fA.js",
			"/assets/NewOrderModal-goDkyKGV.js",
			"/assets/admin-notices-B3-UvvYy.js",
			"/assets/deposit-De8O4ByN.js",
			"/assets/deposit-notice-CBCfqrq6.js"
		]
	},
	"/_authenticated/supplier/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/index.tsx",
		children: void 0,
		preloads: [
			"/assets/supplier-CiZJnp6N.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/report-blocks-xdnsCFlH.js",
			"/assets/CopyOrderNumber-txArLqNR.js"
		]
	},
	"/s/$code/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.index.tsx",
		children: void 0,
		preloads: ["/assets/s._code.index-BwB8ZKSk.js"]
	},
	"/_authenticated/admin/products/new": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/products.new.tsx",
		children: void 0,
		preloads: [
			"/assets/products.new-BHudxsWC.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/advanced-settings-B7KCl45A.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/ImageUploader-DQAxWSIu.js",
			"/assets/price-breakdown-91S2vPea.js",
			"/assets/RichTextEditor-jHkcO2in.js",
			"/assets/slug-CobW-OQs.js",
			"/assets/Hint-Lvce_jzt.js",
			"/assets/product-import-DNxWBs4P.js",
			"/assets/ProductImportModal-BZNF00NK.js"
		]
	},
	"/s/$code/c/$slug": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.c.$slug.tsx",
		children: void 0,
		preloads: ["/assets/s._code.c._slug-B2buhQmk.js"]
	},
	"/s/$code/p/$slug": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.p.$slug.tsx",
		children: void 0,
		preloads: [
			"/assets/s._code.p._slug-Vpx0VUPw.js",
			"/assets/app-data-Dl1wTy1x.js",
			"/assets/product-code-C0VIB5J9.js",
			"/assets/reseller-tools-Cq5xZHqb.js"
		]
	},
	"/_authenticated/admin/products/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/products.index.tsx",
		children: void 0,
		preloads: [
			"/assets/products.index-Bz-ehv9s.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/advanced-settings-B7KCl45A.js",
			"/assets/button-kNZ4kbD4.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/reseller-tools-Cq5xZHqb.js",
			"/assets/ProductImportModal-BZNF00NK.js",
			"/assets/supplier-DzKBUp_E.js"
		]
	},
	"/_authenticated/admin/products/$id/edit": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/products.$id.edit.tsx",
		children: void 0,
		preloads: [
			"/assets/products._id.edit-BzHWdXqT.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/ImageUploader-DQAxWSIu.js",
			"/assets/price-breakdown-91S2vPea.js",
			"/assets/RichTextEditor-jHkcO2in.js",
			"/assets/slug-CobW-OQs.js",
			"/assets/Hint-Lvce_jzt.js"
		]
	},
	"/_authenticated/reseller/orders/$id/invoice": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/orders.$id.invoice.tsx",
		children: void 0,
		preloads: ["/assets/orders._id.invoice-iZeWrKg1.js"]
	}
} });
//#endregion
export { tsrStartManifest };
