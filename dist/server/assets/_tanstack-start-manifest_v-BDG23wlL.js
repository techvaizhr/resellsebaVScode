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
			"/assets/index-BHv4Sglc.js",
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
			src: "/assets/index-BHv4Sglc.js"
		} }]
	},
	"/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/index.tsx",
		children: void 0,
		preloads: [
			"/assets/routes-zCXsTW_8.js",
			"/assets/finance-report-vhTR_ZJj.js",
			"/assets/bootstrap-DgXqwaKq.js",
			"/assets/landing-content-Bp4x7_FG.js",
			"/assets/pwa-install-B_rRm3TN.js",
			"/assets/public-header-BHy36lw7.js"
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
		preloads: ["/assets/route-oOsaW6OK.js"]
	},
	"/catalog": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/catalog.tsx",
		children: ["/catalog/$slug", "/catalog/"],
		preloads: [
			"/assets/catalog-oZvxIute.js",
			"/assets/shell-B2ELhu4q.js",
			"/assets/public-header-BHy36lw7.js"
		]
	},
	"/login": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/login.tsx",
		children: void 0,
		preloads: [
			"/assets/login-C7wy2LbH.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/advanced-settings-CDtNjOdM.js",
			"/assets/verification.functions-x5gX7fWi.js",
			"/assets/public-header-BHy36lw7.js"
		]
	},
	"/privacy": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/privacy.tsx",
		children: void 0,
		preloads: ["/assets/privacy-BzTWoET0.js", "/assets/public-header-BHy36lw7.js"]
	},
	"/tutorials": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/tutorials.tsx",
		children: void 0,
		preloads: [
			"/assets/tutorials-dns7VbKy.js",
			"/assets/tutorial-library-BDetmzQH.js",
			"/assets/public-header-BHy36lw7.js"
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
			"/assets/route-DFk6EUro.js",
			"/assets/useLocation-kDAP82zy.js",
			"/assets/app-data-CuoVX8aE.js",
			"/assets/use-auth-CvkoBHTF.js",
			"/assets/BulkScanModal-RIuk4tSs.js",
			"/assets/use-order-nav-count-B9z8kUIv.js",
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
			"/assets/route-qTXOYzsO.js",
			"/assets/useLocation-kDAP82zy.js",
			"/assets/app-data-CuoVX8aE.js",
			"/assets/panel-bootstrap-DI0v36QO.js",
			"/assets/use-auth-CvkoBHTF.js",
			"/assets/impersonation-BzTUoeKI.js",
			"/assets/reseller-status-BRiEAbFB.js",
			"/assets/use-order-nav-count-B9z8kUIv.js",
			"/assets/subscription-yTTo4FrZ.js",
			"/assets/use-verification-CIq0a_2c.js",
			"/assets/impersonation-banner-BO8pOioA.js"
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
			"/assets/route-CNQbkyue.js",
			"/assets/app-data-CuoVX8aE.js",
			"/assets/use-auth-CvkoBHTF.js",
			"/assets/supplier-Bjy9tt0b.js",
			"/assets/use-order-nav-count-B9z8kUIv.js",
			"/assets/use-verification-CIq0a_2c.js",
			"/assets/impersonation-banner-BO8pOioA.js",
			"/assets/supplier-context-BU7JZggX.js"
		]
	},
	"/_authenticated/dashboard": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/dashboard.tsx",
		children: void 0,
		preloads: [
			"/assets/dashboard-BC57CmD1.js",
			"/assets/use-auth-CvkoBHTF.js",
			"/assets/use-verification-CIq0a_2c.js"
		]
	},
	"/_authenticated/onboarding": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/onboarding.tsx",
		children: void 0,
		preloads: [
			"/assets/onboarding-8M6HMKfc.js",
			"/assets/app-data-CuoVX8aE.js",
			"/assets/use-auth-CvkoBHTF.js",
			"/assets/impersonation-BzTUoeKI.js",
			"/assets/reseller-status-BRiEAbFB.js",
			"/assets/use-verification-CIq0a_2c.js"
		]
	},
	"/_authenticated/verify": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/verify.tsx",
		children: void 0,
		preloads: [
			"/assets/verify-DGmELdL3.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/use-verification-CIq0a_2c.js",
			"/assets/verification.functions-x5gX7fWi.js"
		]
	},
	"/catalog/$slug": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/catalog.$slug.tsx",
		children: void 0,
		preloads: [
			"/assets/catalog._slug-jKkN4fFQ.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/app-data-CuoVX8aE.js",
			"/assets/finance-report-vhTR_ZJj.js",
			"/assets/image-picker-D5GVumnr.js",
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
			"/assets/s._code-CdRY-Ln2.js",
			"/assets/useRouterState-DcPhrJNj.js",
			"/assets/ui-DJTQ_KDE.js",
			"/assets/store-content-DroOL-aq.js",
			"/assets/store-menu-B7Ej-YA7.js",
			"/assets/pwa-install-B_rRm3TN.js",
			"/assets/store-visits-DTgyS-lj.js"
		]
	},
	"/catalog/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/catalog.index.tsx",
		children: void 0,
		preloads: [
			"/assets/catalog.index-Jwi40j5W.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/finance-report-vhTR_ZJj.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/product-code-eO6lb1N0.js",
			"/assets/image-picker-D5GVumnr.js",
			"/assets/catalog.functions-BP0xbV47.js"
		]
	},
	"/_authenticated/admin/advanced": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/advanced.tsx",
		children: void 0,
		preloads: [
			"/assets/advanced-B1fecKet.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/advanced-settings-CDtNjOdM.js",
			"/assets/deposit-settings-D7A-FwJS.js"
		]
	},
	"/_authenticated/admin/agent-payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/agent-payouts.tsx",
		children: void 0,
		preloads: [
			"/assets/agent-payouts-B_C0SWD6.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/date-LErKaP8X.js",
			"/assets/ledger-timeline-DWBSmVwP.js",
			"/assets/agents-BMXKMPfU.js"
		]
	},
	"/_authenticated/admin/agent-report": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/agent-report.tsx",
		children: void 0,
		preloads: [
			"/assets/agent-report-BiWCMiop.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/date-LErKaP8X.js",
			"/assets/agents-BMXKMPfU.js",
			"/assets/date-range-filter-C-BzTyoO.js"
		]
	},
	"/_authenticated/admin/agents": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/agents.tsx",
		children: void 0,
		preloads: [
			"/assets/agents-BaPNJUR1.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/agents-BMXKMPfU.js",
			"/assets/auth-middleware-CbbK9sLn.js"
		]
	},
	"/_authenticated/admin/backup": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/backup.tsx",
		children: void 0,
		preloads: ["/assets/backup-BpLDxwo7.js", "/assets/ui-kit-CpmBMi4p.js"]
	},
	"/_authenticated/admin/brands": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/brands.tsx",
		children: void 0,
		preloads: [
			"/assets/brands-BK4v5BHf.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/ImageUploader-Btrd18Qv.js"
		]
	},
	"/_authenticated/admin/business-report": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/business-report.tsx",
		children: void 0,
		preloads: [
			"/assets/business-report-C9mY_VAi.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/finance-report-vhTR_ZJj.js",
			"/assets/agents-BMXKMPfU.js",
			"/assets/order-filters-CJ9pQZ8D.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/report-blocks-BvLfqJhr.js",
			"/assets/reseller-avatar-CbTfdTEo.js",
			"/assets/business-report-DmxAnxJ3.js"
		]
	},
	"/_authenticated/admin/categories": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/categories.tsx",
		children: void 0,
		preloads: [
			"/assets/categories-CuBNar1I.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/ImageUploader-Btrd18Qv.js"
		]
	},
	"/_authenticated/admin/commissions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/commissions.tsx",
		children: void 0,
		preloads: ["/assets/commissions-BwB0umj9.js", "/assets/ui-kit-CpmBMi4p.js"]
	},
	"/_authenticated/admin/couriers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/couriers.tsx",
		children: void 0,
		preloads: [
			"/assets/couriers-KlpRHGDv.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/courier-brand-BIJ3Xe1Z.js"
		]
	},
	"/_authenticated/admin/customers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/customers.tsx",
		children: void 0,
		preloads: [
			"/assets/customers-Ck_th38x.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/customers-report-BdnpUZWs.js"
		]
	},
	"/_authenticated/admin/deposit-transactions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/deposit-transactions.tsx",
		children: void 0,
		preloads: [
			"/assets/deposit-transactions-CWRW1oaG.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/date-LErKaP8X.js",
			"/assets/deposit-ledger-CJZq9WXE.js",
			"/assets/payment-methods-x6ZUvPuM.js",
			"/assets/deposit-pay-panel-CiC4GxL3.js"
		]
	},
	"/_authenticated/admin/domains": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/domains.tsx",
		children: void 0,
		preloads: [
			"/assets/domains-yJLO8dlX.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/cloudflare.functions-rX6jvbGF.js"
		]
	},
	"/_authenticated/admin/expenses": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/expenses.tsx",
		children: void 0,
		preloads: [
			"/assets/expenses-DwyXS9iF.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/finance-report-vhTR_ZJj.js",
			"/assets/order-filters-CJ9pQZ8D.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/report-blocks-BvLfqJhr.js",
			"/assets/business-report-DmxAnxJ3.js"
		]
	},
	"/_authenticated/admin/landing": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/landing.tsx",
		children: void 0,
		preloads: [
			"/assets/landing-4t8WozH9.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/ImageUploader-Btrd18Qv.js",
			"/assets/landing-content-Bp4x7_FG.js",
			"/assets/tabs-4Ugcp-Dh.js"
		]
	},
	"/_authenticated/admin/maintenance": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/maintenance.tsx",
		children: void 0,
		preloads: [
			"/assets/maintenance-DDMTwtuv.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/auth-middleware-CbbK9sLn.js"
		]
	},
	"/_authenticated/admin/marketing": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/marketing.tsx",
		children: void 0,
		preloads: ["/assets/marketing-DGRYbGWF.js", "/assets/ui-kit-CpmBMi4p.js"]
	},
	"/_authenticated/admin/media": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/media.tsx",
		children: void 0,
		preloads: [
			"/assets/media-Bj7vzA2q.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/button-kNZ4kbD4.js",
			"/assets/data-list-CDjbwaL-.js"
		]
	},
	"/_authenticated/admin/notices": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/notices.tsx",
		children: void 0,
		preloads: [
			"/assets/notices-kljWMyym.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/admin-notices-DT_g3QE8.js"
		]
	},
	"/_authenticated/admin/notifications": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/notifications.tsx",
		children: void 0,
		preloads: [
			"/assets/notifications-DdBwcaS4.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/auth-middleware-CbbK9sLn.js"
		]
	},
	"/_authenticated/admin/orders": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/orders.tsx",
		children: void 0,
		preloads: [
			"/assets/orders-CU6eKLPf.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/order-search-BnI4z6AU.js",
			"/assets/CourierTimeline-k9Cp5OwX.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/finance-report-vhTR_ZJj.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/order-filters-CJ9pQZ8D.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/business-report-DmxAnxJ3.js",
			"/assets/courier-brand-BIJ3Xe1Z.js",
			"/assets/bootstrap-DgXqwaKq.js",
			"/assets/NewOrderModal-CO4mxq_z.js",
			"/assets/CopyOrderNumber-C4Dv9x3e.js",
			"/assets/labels-DqnEgztt.js",
			"/assets/price-breakdown-CGLBSWPS.js"
		]
	},
	"/_authenticated/admin/payments": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/payments.tsx",
		children: void 0,
		preloads: [
			"/assets/payments-B5q6xvIF.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/payment-methods-x6ZUvPuM.js",
			"/assets/payment-brand-DxxvN5fA.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/gateway-grid-gCt67NJy.js"
		]
	},
	"/_authenticated/admin/payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/payouts.tsx",
		children: void 0,
		preloads: [
			"/assets/payouts-CresT6QQ.js",
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
			"/assets/policies-D4IB2xyo.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/policies-DnNFBSNJ.js"
		]
	},
	"/_authenticated/admin/privacy": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/privacy.tsx",
		children: void 0,
		preloads: [
			"/assets/privacy-D_d64Any.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/RichTextEditor-DDeBCrce.js"
		]
	},
	"/_authenticated/admin/resellers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/resellers.tsx",
		children: void 0,
		preloads: [
			"/assets/resellers-DVOSsg6-.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/advanced-settings-CDtNjOdM.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/date-LErKaP8X.js",
			"/assets/auth-middleware-CbbK9sLn.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/reseller-avatar-CbTfdTEo.js",
			"/assets/deposit-ledger-CJZq9WXE.js",
			"/assets/admin-users.functions-DFagQTez.js",
			"/assets/impersonation-BzTUoeKI.js",
			"/assets/reseller-status-BRiEAbFB.js",
			"/assets/ResellerProfile-DJqIbti3.js",
			"/assets/password-reset-modal-DR3NFFyF.js"
		]
	},
	"/_authenticated/admin/settings": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/settings.tsx",
		children: void 0,
		preloads: [
			"/assets/settings-DGx8lm_O.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/ImageUploader-Btrd18Qv.js"
		]
	},
	"/_authenticated/admin/staff": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/staff.tsx",
		children: void 0,
		preloads: [
			"/assets/staff-DRNUDNmq.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/auth-middleware-CbbK9sLn.js",
			"/assets/dist-Bm7eTr0L.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/tabs-4Ugcp-Dh.js",
			"/assets/admin-users.functions-DFagQTez.js"
		]
	},
	"/_authenticated/admin/subscriptions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/subscriptions.tsx",
		children: void 0,
		preloads: [
			"/assets/subscriptions-1n0FOhkN.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/finance-report-vhTR_ZJj.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/subscription-yTTo4FrZ.js"
		]
	},
	"/_authenticated/admin/supplier-payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/supplier-payouts.tsx",
		children: void 0,
		preloads: [
			"/assets/supplier-payouts-CU5IVtDv.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/supplier-Bjy9tt0b.js",
			"/assets/status-tabs-CjrpntaN.js"
		]
	},
	"/_authenticated/admin/supplier-report": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/supplier-report.tsx",
		children: void 0,
		preloads: [
			"/assets/supplier-report-D0vsWGEM.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/CopyOrderNumber-C4Dv9x3e.js",
			"/assets/supplier-Bjy9tt0b.js",
			"/assets/supplier-report-summary-DyHfAO6n.js"
		]
	},
	"/_authenticated/admin/supplier-returns": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/supplier-returns.tsx",
		children: void 0,
		preloads: [
			"/assets/supplier-returns-Cn2Dg0la.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/button-kNZ4kbD4.js",
			"/assets/CopyOrderNumber-C4Dv9x3e.js",
			"/assets/supplier-Bjy9tt0b.js",
			"/assets/impersonation-BzTUoeKI.js",
			"/assets/supplier-access.functions-DV9HePVQ.js"
		]
	},
	"/_authenticated/admin/suppliers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/suppliers.tsx",
		children: void 0,
		preloads: [
			"/assets/suppliers-ZDfOx0Qz.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/reseller-avatar-CbTfdTEo.js",
			"/assets/supplier-Bjy9tt0b.js",
			"/assets/impersonation-BzTUoeKI.js",
			"/assets/password-reset-modal-DR3NFFyF.js",
			"/assets/supplier-access.functions-DV9HePVQ.js"
		]
	},
	"/_authenticated/admin/transactions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/transactions.tsx",
		children: void 0,
		preloads: ["/assets/transactions-CwD0JiDz.js", "/assets/transaction-report-B7E9zUT0.js"]
	},
	"/_authenticated/admin/tutorials": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/tutorials.tsx",
		children: void 0,
		preloads: [
			"/assets/tutorials-gfqa0ob-.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/tutorials-_h570XmH.js"
		]
	},
	"/_authenticated/admin/visitors": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/visitors.tsx",
		children: void 0,
		preloads: [
			"/assets/visitors-Bl2wqNKn.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/date-LErKaP8X.js",
			"/assets/store-visits-report-B1paZ-St.js"
		]
	},
	"/_authenticated/reseller/catalog": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/catalog.tsx",
		children: void 0,
		preloads: [
			"/assets/catalog-7aqLoscQ.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/advanced-settings-CDtNjOdM.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/product-code-eO6lb1N0.js",
			"/assets/price-breakdown-CGLBSWPS.js",
			"/assets/Hint-Lvce_jzt.js",
			"/assets/reseller-tools-D76I1nQp.js",
			"/assets/image-picker-D5GVumnr.js"
		]
	},
	"/_authenticated/reseller/commissions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/commissions.tsx",
		children: void 0,
		preloads: ["/assets/commissions-DmlQna3l.js", "/assets/ui-kit-CpmBMi4p.js"]
	},
	"/_authenticated/reseller/customers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/customers.tsx",
		children: void 0,
		preloads: [
			"/assets/customers-CBZrsh_6.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/customers-report-BdnpUZWs.js"
		]
	},
	"/_authenticated/reseller/domain": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/domain.tsx",
		children: void 0,
		preloads: [
			"/assets/domain-D4HHyOFH.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/cloudflare.functions-rX6jvbGF.js"
		]
	},
	"/_authenticated/reseller/listings": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/listings.tsx",
		children: void 0,
		preloads: [
			"/assets/listings-pTi3xb-3.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/product-code-eO6lb1N0.js",
			"/assets/reseller-tools-D76I1nQp.js"
		]
	},
	"/_authenticated/reseller/marketing": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/marketing.tsx",
		children: void 0,
		preloads: ["/assets/marketing-DFNJjYDC.js", "/assets/ui-kit-CpmBMi4p.js"]
	},
	"/_authenticated/reseller/menus": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/menus.tsx",
		children: void 0,
		preloads: [
			"/assets/menus-By3axs-1.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/ImageUploader-Btrd18Qv.js",
			"/assets/bootstrap-DgXqwaKq.js",
			"/assets/store-menu-B7Ej-YA7.js"
		]
	},
	"/_authenticated/reseller/orders": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/orders.tsx",
		children: ["/_authenticated/reseller/orders/$id/invoice"],
		preloads: [
			"/assets/orders-CEvQmS3H.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/order-search-BnI4z6AU.js",
			"/assets/CourierTimeline-k9Cp5OwX.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/finance-report-vhTR_ZJj.js",
			"/assets/deposit-settings-D7A-FwJS.js",
			"/assets/order-filters-CJ9pQZ8D.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/business-report-DmxAnxJ3.js",
			"/assets/courier-brand-BIJ3Xe1Z.js",
			"/assets/NewOrderModal-CO4mxq_z.js",
			"/assets/CopyOrderNumber-C4Dv9x3e.js",
			"/assets/deposit-BT6ZBOu9.js"
		]
	},
	"/_authenticated/reseller/payments": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/payments.tsx",
		children: void 0,
		preloads: [
			"/assets/payments-BOXWRWSN.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/bootstrap-DgXqwaKq.js",
			"/assets/payment-methods-x6ZUvPuM.js",
			"/assets/gateways.functions-j-xl1Hna.js",
			"/assets/payment-brand-DxxvN5fA.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/gateway-grid-gCt67NJy.js"
		]
	},
	"/_authenticated/reseller/payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/payouts.tsx",
		children: void 0,
		preloads: [
			"/assets/payouts-CEn9lY7i.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/deposit-settings-D7A-FwJS.js",
			"/assets/date-LErKaP8X.js",
			"/assets/ledger-timeline-DWBSmVwP.js",
			"/assets/report-blocks-BvLfqJhr.js",
			"/assets/deposit-pay-panel-CiC4GxL3.js",
			"/assets/deposit-BT6ZBOu9.js",
			"/assets/deposit-notice-CNQo4tAr.js"
		]
	},
	"/_authenticated/reseller/policies": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/policies.tsx",
		children: void 0,
		preloads: [
			"/assets/policies-B_jLig5-.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/policies-DnNFBSNJ.js"
		]
	},
	"/_authenticated/reseller/profile": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/profile.tsx",
		children: void 0,
		preloads: [
			"/assets/profile-C1SXcSB8.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/ImageUploader-Btrd18Qv.js",
			"/assets/reseller-avatar-CbTfdTEo.js",
			"/assets/ResellerProfile-DJqIbti3.js"
		]
	},
	"/_authenticated/reseller/settings": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/settings.tsx",
		children: void 0,
		preloads: [
			"/assets/settings-BuAL2weA.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/ImageUploader-Btrd18Qv.js",
			"/assets/bootstrap-DgXqwaKq.js"
		]
	},
	"/_authenticated/reseller/subscription": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/subscription.tsx",
		children: void 0,
		preloads: [
			"/assets/subscription-C-MVwqAk.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/finance-report-vhTR_ZJj.js",
			"/assets/payment-methods-x6ZUvPuM.js",
			"/assets/AppModal-Dly020dH.js"
		]
	},
	"/_authenticated/reseller/support": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/support.tsx",
		children: void 0,
		preloads: ["/assets/support-BDUMEEMF.js", "/assets/ui-kit-CpmBMi4p.js"]
	},
	"/_authenticated/reseller/theme": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/theme.tsx",
		children: void 0,
		preloads: [
			"/assets/theme-BLdnA1xz.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/ImageUploader-Btrd18Qv.js",
			"/assets/bootstrap-DgXqwaKq.js",
			"/assets/store-content-DroOL-aq.js"
		]
	},
	"/_authenticated/reseller/transactions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/transactions.tsx",
		children: void 0,
		preloads: ["/assets/transactions-DMmNWcO2.js", "/assets/transaction-report-B7E9zUT0.js"]
	},
	"/_authenticated/reseller/tutorials": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/tutorials.tsx",
		children: void 0,
		preloads: [
			"/assets/tutorials-BYzYtjaZ.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/tutorial-library-BDetmzQH.js"
		]
	},
	"/_authenticated/reseller/visitors": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/visitors.tsx",
		children: void 0,
		preloads: [
			"/assets/visitors-tJex5wHL.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/store-visits-report-B1paZ-St.js"
		]
	},
	"/_authenticated/supplier/media": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/media.tsx",
		children: void 0,
		preloads: [
			"/assets/media-BBqs5wDP.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/button-kNZ4kbD4.js",
			"/assets/data-list-CDjbwaL-.js"
		]
	},
	"/_authenticated/supplier/orders": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/orders.tsx",
		children: void 0,
		preloads: [
			"/assets/orders-BTzqrNEC.js",
			"/assets/order-search-BnI4z6AU.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/order-filters-CJ9pQZ8D.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/courier-brand-BIJ3Xe1Z.js",
			"/assets/BulkScanModal-RIuk4tSs.js",
			"/assets/CopyOrderNumber-C4Dv9x3e.js",
			"/assets/labels-DqnEgztt.js"
		]
	},
	"/_authenticated/supplier/payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/payouts.tsx",
		children: void 0,
		preloads: ["/assets/payouts-BgbZ8Icg.js", "/assets/ui-kit-CpmBMi4p.js"]
	},
	"/_authenticated/supplier/products": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/products.tsx",
		children: void 0,
		preloads: [
			"/assets/products-DWr-riKN.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/ImageUploader-Btrd18Qv.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/RichTextEditor-DDeBCrce.js",
			"/assets/Hint-Lvce_jzt.js",
			"/assets/product-import-ZpU9lgxA.js"
		]
	},
	"/_authenticated/supplier/profile": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/profile.tsx",
		children: void 0,
		preloads: ["/assets/profile-CI7H0Dx6.js", "/assets/ui-kit-CpmBMi4p.js"]
	},
	"/_authenticated/supplier/report": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/report.tsx",
		children: void 0,
		preloads: [
			"/assets/report-UVSnTtHy.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/CopyOrderNumber-C4Dv9x3e.js",
			"/assets/status-tabs-CjrpntaN.js",
			"/assets/supplier-report-summary-DyHfAO6n.js"
		]
	},
	"/_authenticated/supplier/returns": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/returns.tsx",
		children: void 0,
		preloads: [
			"/assets/returns-DhWyfEhK.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/CopyOrderNumber-C4Dv9x3e.js",
			"/assets/status-tabs-CjrpntaN.js"
		]
	},
	"/s/$code/checkout": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.checkout.tsx",
		children: void 0,
		preloads: [
			"/assets/s._code.checkout-Bs1moLQD.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/app-data-CuoVX8aE.js",
			"/assets/advanced-settings-CDtNjOdM.js",
			"/assets/gateways.functions-j-xl1Hna.js",
			"/assets/payment-brand-DxxvN5fA.js",
			"/assets/checkout-validate-Bep8wCSp.js"
		]
	},
	"/s/$code/thanks": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.thanks.tsx",
		children: void 0,
		preloads: [
			"/assets/s._code.thanks-CDPUkecM.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/gateways.functions-j-xl1Hna.js"
		]
	},
	"/_authenticated/admin/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/index.tsx",
		children: void 0,
		preloads: [
			"/assets/admin-DJBcoyu4.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/finance-report-vhTR_ZJj.js",
			"/assets/date-range-filter-C-BzTyoO.js",
			"/assets/bootstrap-DgXqwaKq.js",
			"/assets/NewOrderModal-CO4mxq_z.js"
		]
	},
	"/_authenticated/reseller/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/index.tsx",
		children: void 0,
		preloads: [
			"/assets/reseller-DqIQnQ3e.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/finance-report-vhTR_ZJj.js",
			"/assets/date-range-filter-C-BzTyoO.js",
			"/assets/report-blocks-BvLfqJhr.js",
			"/assets/bootstrap-DgXqwaKq.js",
			"/assets/payment-methods-x6ZUvPuM.js",
			"/assets/payment-brand-DxxvN5fA.js",
			"/assets/NewOrderModal-CO4mxq_z.js",
			"/assets/admin-notices-DT_g3QE8.js",
			"/assets/deposit-BT6ZBOu9.js",
			"/assets/deposit-notice-CNQo4tAr.js"
		]
	},
	"/_authenticated/supplier/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/index.tsx",
		children: void 0,
		preloads: [
			"/assets/supplier-CgWMWxJk.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/report-blocks-BvLfqJhr.js",
			"/assets/CopyOrderNumber-C4Dv9x3e.js"
		]
	},
	"/s/$code/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.index.tsx",
		children: void 0,
		preloads: ["/assets/s._code.index-YZ4UBp5d.js"]
	},
	"/_authenticated/admin/products/new": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/products.new.tsx",
		children: void 0,
		preloads: [
			"/assets/products.new-CxROtEO8.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/advanced-settings-CDtNjOdM.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/ImageUploader-Btrd18Qv.js",
			"/assets/price-breakdown-CGLBSWPS.js",
			"/assets/RichTextEditor-DDeBCrce.js",
			"/assets/slug-CxVpbEZu.js",
			"/assets/Hint-Lvce_jzt.js",
			"/assets/product-import-ZpU9lgxA.js",
			"/assets/ProductImportModal-CapIRonR.js"
		]
	},
	"/s/$code/c/$slug": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.c.$slug.tsx",
		children: void 0,
		preloads: ["/assets/s._code.c._slug-jw37777n.js"]
	},
	"/s/$code/p/$slug": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.p.$slug.tsx",
		children: void 0,
		preloads: [
			"/assets/s._code.p._slug-D5PwYi3B.js",
			"/assets/app-data-CuoVX8aE.js",
			"/assets/product-code-eO6lb1N0.js",
			"/assets/reseller-tools-D76I1nQp.js"
		]
	},
	"/_authenticated/admin/products/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/products.index.tsx",
		children: void 0,
		preloads: [
			"/assets/products.index-Dfv53o86.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/advanced-settings-CDtNjOdM.js",
			"/assets/button-kNZ4kbD4.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/reseller-tools-D76I1nQp.js",
			"/assets/ProductImportModal-CapIRonR.js",
			"/assets/supplier-Bjy9tt0b.js"
		]
	},
	"/_authenticated/admin/products/$id/edit": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/products.$id.edit.tsx",
		children: void 0,
		preloads: [
			"/assets/products._id.edit-C2kvUVQT.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/ImageUploader-Btrd18Qv.js",
			"/assets/price-breakdown-CGLBSWPS.js",
			"/assets/RichTextEditor-DDeBCrce.js",
			"/assets/slug-CxVpbEZu.js",
			"/assets/Hint-Lvce_jzt.js"
		]
	},
	"/_authenticated/reseller/orders/$id/invoice": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/orders.$id.invoice.tsx",
		children: void 0,
		preloads: ["/assets/orders._id.invoice-BrFNsi2V.js"]
	}
} });
//#endregion
export { tsrStartManifest };
