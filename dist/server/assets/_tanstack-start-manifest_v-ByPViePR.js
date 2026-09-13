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
			"/assets/index-DqOmALA-.js",
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
			src: "/assets/index-DqOmALA-.js"
		} }]
	},
	"/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/index.tsx",
		children: void 0,
		preloads: [
			"/assets/routes-CSfpYSm2.js",
			"/assets/finance-report-DNiK6b7U.js",
			"/assets/bootstrap-DkaVfObn.js",
			"/assets/landing-content-Bp4x7_FG.js",
			"/assets/pwa-install-B_rRm3TN.js",
			"/assets/public-header-9Vf49xfT.js"
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
		preloads: ["/assets/route-BLnaxUh0.js"]
	},
	"/catalog": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/catalog.tsx",
		children: ["/catalog/$slug", "/catalog/"],
		preloads: [
			"/assets/catalog-D4NIi65N.js",
			"/assets/shell-BX7regzo.js",
			"/assets/public-header-9Vf49xfT.js"
		]
	},
	"/login": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/login.tsx",
		children: void 0,
		preloads: [
			"/assets/login-BTGoDuTx.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/advanced-settings-DQG6Q4OO.js",
			"/assets/verification.functions-BCVmta5N.js",
			"/assets/public-header-9Vf49xfT.js"
		]
	},
	"/privacy": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/privacy.tsx",
		children: void 0,
		preloads: ["/assets/privacy-BYjXE87E.js", "/assets/public-header-9Vf49xfT.js"]
	},
	"/tutorials": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/tutorials.tsx",
		children: void 0,
		preloads: [
			"/assets/tutorials-CW5d8HyL.js",
			"/assets/tutorial-library-BZUyG3rs.js",
			"/assets/public-header-9Vf49xfT.js"
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
			"/assets/route-DQrgAlOl.js",
			"/assets/useLocation-CiLQ_fxz.js",
			"/assets/app-data-CKEXdl5W.js",
			"/assets/use-auth-D1Ekf4rd.js",
			"/assets/BulkScanModal-CEZrGXt0.js",
			"/assets/use-order-nav-count-DwYvJKmZ.js",
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
			"/assets/route-CZ95cRrI.js",
			"/assets/useLocation-CiLQ_fxz.js",
			"/assets/app-data-CKEXdl5W.js",
			"/assets/panel-bootstrap-DI0v36QO.js",
			"/assets/use-auth-D1Ekf4rd.js",
			"/assets/impersonation-Do63NAGO.js",
			"/assets/reseller-status-BRiEAbFB.js",
			"/assets/use-order-nav-count-DwYvJKmZ.js",
			"/assets/subscription-DmM2XGhn.js",
			"/assets/use-verification-DWq_ZHnE.js",
			"/assets/impersonation-banner-CcSOh2U8.js"
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
			"/assets/route-C-BLLc8q.js",
			"/assets/app-data-CKEXdl5W.js",
			"/assets/use-auth-D1Ekf4rd.js",
			"/assets/supplier-BK6TQ-hn.js",
			"/assets/use-order-nav-count-DwYvJKmZ.js",
			"/assets/use-verification-DWq_ZHnE.js",
			"/assets/impersonation-banner-CcSOh2U8.js",
			"/assets/supplier-context-BU7JZggX.js"
		]
	},
	"/_authenticated/dashboard": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/dashboard.tsx",
		children: void 0,
		preloads: [
			"/assets/dashboard-69Wm5JS5.js",
			"/assets/use-auth-D1Ekf4rd.js",
			"/assets/use-verification-DWq_ZHnE.js"
		]
	},
	"/_authenticated/onboarding": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/onboarding.tsx",
		children: void 0,
		preloads: [
			"/assets/onboarding-dxANOKlZ.js",
			"/assets/app-data-CKEXdl5W.js",
			"/assets/use-auth-D1Ekf4rd.js",
			"/assets/impersonation-Do63NAGO.js",
			"/assets/reseller-status-BRiEAbFB.js",
			"/assets/use-verification-DWq_ZHnE.js"
		]
	},
	"/_authenticated/verify": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/verify.tsx",
		children: void 0,
		preloads: [
			"/assets/verify-BVf6mNM5.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/use-verification-DWq_ZHnE.js",
			"/assets/verification.functions-BCVmta5N.js"
		]
	},
	"/catalog/$slug": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/catalog.$slug.tsx",
		children: void 0,
		preloads: [
			"/assets/catalog._slug-DsiG7slK.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/app-data-CKEXdl5W.js",
			"/assets/finance-report-DNiK6b7U.js",
			"/assets/image-picker-Bt_76cPP.js",
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
			"/assets/s._code-D7-BFA4e.js",
			"/assets/useRouterState-Cpj1aYtQ.js",
			"/assets/ui-CzwOQ8ou.js",
			"/assets/store-content-DroOL-aq.js",
			"/assets/store-menu-ynQV_Bx8.js",
			"/assets/pwa-install-B_rRm3TN.js",
			"/assets/store-visits-C0y8tXZ5.js"
		]
	},
	"/catalog/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/catalog.index.tsx",
		children: void 0,
		preloads: [
			"/assets/catalog.index-Bz1iLi8t.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/finance-report-DNiK6b7U.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/product-code-Dw6bVcdd.js",
			"/assets/image-picker-Bt_76cPP.js",
			"/assets/catalog.functions-BP0xbV47.js"
		]
	},
	"/_authenticated/admin/advanced": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/advanced.tsx",
		children: void 0,
		preloads: [
			"/assets/advanced-Bgw_7RLh.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/advanced-settings-DQG6Q4OO.js",
			"/assets/deposit-settings-BIDsh63K.js"
		]
	},
	"/_authenticated/admin/agent-payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/agent-payouts.tsx",
		children: void 0,
		preloads: [
			"/assets/agent-payouts-BtnsubTi.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/date-LErKaP8X.js",
			"/assets/ledger-timeline-DWBSmVwP.js",
			"/assets/agents-BXgifwyT.js"
		]
	},
	"/_authenticated/admin/agent-report": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/agent-report.tsx",
		children: void 0,
		preloads: [
			"/assets/agent-report-BGgVKYeH.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/date-LErKaP8X.js",
			"/assets/agents-BXgifwyT.js",
			"/assets/date-range-filter-C-BzTyoO.js"
		]
	},
	"/_authenticated/admin/agents": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/agents.tsx",
		children: void 0,
		preloads: [
			"/assets/agents-Czt7T4AU.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/agents-BXgifwyT.js",
			"/assets/auth-middleware-i-C9TUDd.js"
		]
	},
	"/_authenticated/admin/backup": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/backup.tsx",
		children: void 0,
		preloads: ["/assets/backup-3ZgD6k0k.js", "/assets/ui-kit-CpmBMi4p.js"]
	},
	"/_authenticated/admin/brands": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/brands.tsx",
		children: void 0,
		preloads: [
			"/assets/brands-D8aoBFVf.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/ImageUploader-BoYluyDC.js"
		]
	},
	"/_authenticated/admin/business-report": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/business-report.tsx",
		children: void 0,
		preloads: [
			"/assets/business-report-DQwKNQTV.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/finance-report-DNiK6b7U.js",
			"/assets/agents-BXgifwyT.js",
			"/assets/order-filters-CJ9pQZ8D.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/report-blocks-BJlRoHMU.js",
			"/assets/reseller-avatar-CbTfdTEo.js",
			"/assets/business-report-4eGiAU-N.js"
		]
	},
	"/_authenticated/admin/categories": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/categories.tsx",
		children: void 0,
		preloads: [
			"/assets/categories-Br0tRFG4.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/ImageUploader-BoYluyDC.js"
		]
	},
	"/_authenticated/admin/commissions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/commissions.tsx",
		children: void 0,
		preloads: ["/assets/commissions-DxirUD0w.js", "/assets/ui-kit-CpmBMi4p.js"]
	},
	"/_authenticated/admin/couriers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/couriers.tsx",
		children: void 0,
		preloads: [
			"/assets/couriers-B7UacoZb.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/courier-brand-CGZokMK1.js"
		]
	},
	"/_authenticated/admin/customers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/customers.tsx",
		children: void 0,
		preloads: [
			"/assets/customers-HXKMQ5HT.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/customers-report-D6cxpB9l.js"
		]
	},
	"/_authenticated/admin/deposit-transactions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/deposit-transactions.tsx",
		children: void 0,
		preloads: [
			"/assets/deposit-transactions-DL1P58ds.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/date-LErKaP8X.js",
			"/assets/deposit-ledger-CoMzQCpL.js",
			"/assets/payment-methods-Dsxh6KPk.js",
			"/assets/deposit-pay-panel-Dzg9kn87.js"
		]
	},
	"/_authenticated/admin/domains": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/domains.tsx",
		children: void 0,
		preloads: [
			"/assets/domains-CCLOIuZb.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/cloudflare.functions-_z4-A4o6.js"
		]
	},
	"/_authenticated/admin/expenses": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/expenses.tsx",
		children: void 0,
		preloads: [
			"/assets/expenses-BFM1fDhS.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/finance-report-DNiK6b7U.js",
			"/assets/order-filters-CJ9pQZ8D.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/report-blocks-BJlRoHMU.js",
			"/assets/business-report-4eGiAU-N.js"
		]
	},
	"/_authenticated/admin/landing": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/landing.tsx",
		children: void 0,
		preloads: [
			"/assets/landing-DdWGIXmz.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/ImageUploader-BoYluyDC.js",
			"/assets/landing-content-Bp4x7_FG.js",
			"/assets/tabs-4Ugcp-Dh.js"
		]
	},
	"/_authenticated/admin/maintenance": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/maintenance.tsx",
		children: void 0,
		preloads: [
			"/assets/maintenance-BVtkKHTw.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/auth-middleware-i-C9TUDd.js"
		]
	},
	"/_authenticated/admin/marketing": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/marketing.tsx",
		children: void 0,
		preloads: ["/assets/marketing-BeHQ8-L8.js", "/assets/ui-kit-CpmBMi4p.js"]
	},
	"/_authenticated/admin/media": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/media.tsx",
		children: void 0,
		preloads: [
			"/assets/media-DTj0N40p.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/button-kNZ4kbD4.js",
			"/assets/data-list-CDjbwaL-.js"
		]
	},
	"/_authenticated/admin/notices": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/notices.tsx",
		children: void 0,
		preloads: [
			"/assets/notices-BMxnGs1v.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/admin-notices-Besy0WXb.js"
		]
	},
	"/_authenticated/admin/notifications": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/notifications.tsx",
		children: void 0,
		preloads: [
			"/assets/notifications-Bs1S41HK.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/auth-middleware-i-C9TUDd.js"
		]
	},
	"/_authenticated/admin/orders": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/orders.tsx",
		children: void 0,
		preloads: [
			"/assets/orders-B_7CqKBk.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/order-search-DmIu1baf.js",
			"/assets/CourierTimeline-BS6NYxO-.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/finance-report-DNiK6b7U.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/order-filters-CJ9pQZ8D.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/business-report-4eGiAU-N.js",
			"/assets/courier-brand-CGZokMK1.js",
			"/assets/bootstrap-DkaVfObn.js",
			"/assets/NewOrderModal-jGRBZPqp.js",
			"/assets/CopyOrderNumber-D3Uc5BcL.js",
			"/assets/labels-B_x8LENZ.js",
			"/assets/price-breakdown-B8lz3iaP.js"
		]
	},
	"/_authenticated/admin/payments": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/payments.tsx",
		children: void 0,
		preloads: [
			"/assets/payments-CJs5Jb-P.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/payment-methods-Dsxh6KPk.js",
			"/assets/payment-brand-DxxvN5fA.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/gateway-grid-SvOB07pM.js"
		]
	},
	"/_authenticated/admin/payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/payouts.tsx",
		children: void 0,
		preloads: [
			"/assets/payouts-HfcnHnX2.js",
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
			"/assets/policies-CAOUg233.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/policies-BUyZ-6m3.js"
		]
	},
	"/_authenticated/admin/privacy": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/privacy.tsx",
		children: void 0,
		preloads: [
			"/assets/privacy-BzuVuAz7.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/RichTextEditor-BlEmcFo0.js"
		]
	},
	"/_authenticated/admin/resellers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/resellers.tsx",
		children: void 0,
		preloads: [
			"/assets/resellers-R1HLFJaq.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/advanced-settings-DQG6Q4OO.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/date-LErKaP8X.js",
			"/assets/auth-middleware-i-C9TUDd.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/reseller-avatar-CbTfdTEo.js",
			"/assets/deposit-ledger-CoMzQCpL.js",
			"/assets/admin-users.functions-BOeaFFWr.js",
			"/assets/impersonation-Do63NAGO.js",
			"/assets/reseller-status-BRiEAbFB.js",
			"/assets/ResellerProfile-bFgLkgam.js",
			"/assets/password-reset-modal-BOEX5rtu.js"
		]
	},
	"/_authenticated/admin/settings": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/settings.tsx",
		children: void 0,
		preloads: [
			"/assets/settings-OJA1AQ6n.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/ImageUploader-BoYluyDC.js"
		]
	},
	"/_authenticated/admin/staff": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/staff.tsx",
		children: void 0,
		preloads: [
			"/assets/staff-DF6Uoegm.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/auth-middleware-i-C9TUDd.js",
			"/assets/dist-Bm7eTr0L.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/tabs-4Ugcp-Dh.js",
			"/assets/admin-users.functions-BOeaFFWr.js"
		]
	},
	"/_authenticated/admin/subscriptions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/subscriptions.tsx",
		children: void 0,
		preloads: [
			"/assets/subscriptions-DcUnrnp1.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/finance-report-DNiK6b7U.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/subscription-DmM2XGhn.js"
		]
	},
	"/_authenticated/admin/supplier-payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/supplier-payouts.tsx",
		children: void 0,
		preloads: [
			"/assets/supplier-payouts-BVKua9n5.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/supplier-BK6TQ-hn.js",
			"/assets/status-tabs-CjrpntaN.js"
		]
	},
	"/_authenticated/admin/supplier-report": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/supplier-report.tsx",
		children: void 0,
		preloads: [
			"/assets/supplier-report-BsikySEs.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/CopyOrderNumber-D3Uc5BcL.js",
			"/assets/supplier-BK6TQ-hn.js",
			"/assets/supplier-report-summary-CaQPUBK4.js"
		]
	},
	"/_authenticated/admin/supplier-returns": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/supplier-returns.tsx",
		children: void 0,
		preloads: [
			"/assets/supplier-returns-Dbq215Ha.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/button-kNZ4kbD4.js",
			"/assets/CopyOrderNumber-D3Uc5BcL.js",
			"/assets/supplier-BK6TQ-hn.js",
			"/assets/impersonation-Do63NAGO.js",
			"/assets/supplier-access.functions-DU1Dwf4j.js"
		]
	},
	"/_authenticated/admin/suppliers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/suppliers.tsx",
		children: void 0,
		preloads: [
			"/assets/suppliers-CmtOeU1j.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/reseller-avatar-CbTfdTEo.js",
			"/assets/supplier-BK6TQ-hn.js",
			"/assets/impersonation-Do63NAGO.js",
			"/assets/password-reset-modal-BOEX5rtu.js",
			"/assets/supplier-access.functions-DU1Dwf4j.js"
		]
	},
	"/_authenticated/admin/transactions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/transactions.tsx",
		children: void 0,
		preloads: ["/assets/transactions-DJhtkR0G.js", "/assets/transaction-report-CRj5QzOi.js"]
	},
	"/_authenticated/admin/tutorials": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/tutorials.tsx",
		children: void 0,
		preloads: [
			"/assets/tutorials-u6JJC2s7.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/tutorials-DzxLdK5g.js"
		]
	},
	"/_authenticated/admin/visitors": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/visitors.tsx",
		children: void 0,
		preloads: [
			"/assets/visitors-_YpXXeKx.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/date-LErKaP8X.js",
			"/assets/store-visits-report-CVgR2SzO.js"
		]
	},
	"/_authenticated/reseller/catalog": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/catalog.tsx",
		children: void 0,
		preloads: [
			"/assets/catalog-BFlO0wby.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/advanced-settings-DQG6Q4OO.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/product-code-Dw6bVcdd.js",
			"/assets/price-breakdown-B8lz3iaP.js",
			"/assets/Hint-Lvce_jzt.js",
			"/assets/reseller-tools-eORm9cZO.js",
			"/assets/image-picker-Bt_76cPP.js"
		]
	},
	"/_authenticated/reseller/commissions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/commissions.tsx",
		children: void 0,
		preloads: ["/assets/commissions-BKED_LaH.js", "/assets/ui-kit-CpmBMi4p.js"]
	},
	"/_authenticated/reseller/customers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/customers.tsx",
		children: void 0,
		preloads: [
			"/assets/customers-cLg1n5_D.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/customers-report-D6cxpB9l.js"
		]
	},
	"/_authenticated/reseller/domain": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/domain.tsx",
		children: void 0,
		preloads: [
			"/assets/domain-CWzqcGB1.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/cloudflare.functions-_z4-A4o6.js"
		]
	},
	"/_authenticated/reseller/listings": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/listings.tsx",
		children: void 0,
		preloads: [
			"/assets/listings-DRt-xEFk.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/product-code-Dw6bVcdd.js",
			"/assets/reseller-tools-eORm9cZO.js"
		]
	},
	"/_authenticated/reseller/marketing": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/marketing.tsx",
		children: void 0,
		preloads: ["/assets/marketing-B-2IHgm-.js", "/assets/ui-kit-CpmBMi4p.js"]
	},
	"/_authenticated/reseller/menus": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/menus.tsx",
		children: void 0,
		preloads: [
			"/assets/menus-CYw-soXa.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/ImageUploader-BoYluyDC.js",
			"/assets/bootstrap-DkaVfObn.js",
			"/assets/store-menu-ynQV_Bx8.js"
		]
	},
	"/_authenticated/reseller/orders": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/orders.tsx",
		children: ["/_authenticated/reseller/orders/$id/invoice"],
		preloads: [
			"/assets/orders-QYmxo3tR.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/order-search-DmIu1baf.js",
			"/assets/CourierTimeline-BS6NYxO-.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/finance-report-DNiK6b7U.js",
			"/assets/deposit-settings-BIDsh63K.js",
			"/assets/order-filters-CJ9pQZ8D.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/business-report-4eGiAU-N.js",
			"/assets/courier-brand-CGZokMK1.js",
			"/assets/NewOrderModal-jGRBZPqp.js",
			"/assets/CopyOrderNumber-D3Uc5BcL.js",
			"/assets/deposit-BWqyszg4.js"
		]
	},
	"/_authenticated/reseller/payments": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/payments.tsx",
		children: void 0,
		preloads: [
			"/assets/payments-C0dRhz2p.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/bootstrap-DkaVfObn.js",
			"/assets/payment-methods-Dsxh6KPk.js",
			"/assets/gateways.functions-Bo5xUPsI.js",
			"/assets/payment-brand-DxxvN5fA.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/gateway-grid-SvOB07pM.js"
		]
	},
	"/_authenticated/reseller/payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/payouts.tsx",
		children: void 0,
		preloads: [
			"/assets/payouts-DwoOyyE2.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/deposit-settings-BIDsh63K.js",
			"/assets/date-LErKaP8X.js",
			"/assets/ledger-timeline-DWBSmVwP.js",
			"/assets/report-blocks-BJlRoHMU.js",
			"/assets/deposit-pay-panel-Dzg9kn87.js",
			"/assets/deposit-BWqyszg4.js",
			"/assets/deposit-notice-Ce7Nbjtu.js"
		]
	},
	"/_authenticated/reseller/policies": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/policies.tsx",
		children: void 0,
		preloads: [
			"/assets/policies-cnrZvcOR.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/policies-BUyZ-6m3.js"
		]
	},
	"/_authenticated/reseller/profile": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/profile.tsx",
		children: void 0,
		preloads: [
			"/assets/profile-Cya42P53.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/ImageUploader-BoYluyDC.js",
			"/assets/reseller-avatar-CbTfdTEo.js",
			"/assets/ResellerProfile-bFgLkgam.js"
		]
	},
	"/_authenticated/reseller/settings": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/settings.tsx",
		children: void 0,
		preloads: [
			"/assets/settings-CdkkHNR7.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/ImageUploader-BoYluyDC.js",
			"/assets/bootstrap-DkaVfObn.js"
		]
	},
	"/_authenticated/reseller/subscription": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/subscription.tsx",
		children: void 0,
		preloads: [
			"/assets/subscription-DploL-zI.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/finance-report-DNiK6b7U.js",
			"/assets/payment-methods-Dsxh6KPk.js",
			"/assets/AppModal-Dly020dH.js"
		]
	},
	"/_authenticated/reseller/support": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/support.tsx",
		children: void 0,
		preloads: ["/assets/support-Bx7uqx4E.js", "/assets/ui-kit-CpmBMi4p.js"]
	},
	"/_authenticated/reseller/theme": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/theme.tsx",
		children: void 0,
		preloads: [
			"/assets/theme-CiDQ7Pub.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/ImageUploader-BoYluyDC.js",
			"/assets/bootstrap-DkaVfObn.js",
			"/assets/store-content-DroOL-aq.js"
		]
	},
	"/_authenticated/reseller/transactions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/transactions.tsx",
		children: void 0,
		preloads: ["/assets/transactions-Dot58RO1.js", "/assets/transaction-report-CRj5QzOi.js"]
	},
	"/_authenticated/reseller/tutorials": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/tutorials.tsx",
		children: void 0,
		preloads: [
			"/assets/tutorials-CvAGa6Bx.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/tutorial-library-BZUyG3rs.js"
		]
	},
	"/_authenticated/reseller/visitors": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/visitors.tsx",
		children: void 0,
		preloads: [
			"/assets/visitors-Bin4w5Hf.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/store-visits-report-CVgR2SzO.js"
		]
	},
	"/_authenticated/supplier/media": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/media.tsx",
		children: void 0,
		preloads: [
			"/assets/media-BHCW8bVz.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/button-kNZ4kbD4.js",
			"/assets/data-list-CDjbwaL-.js"
		]
	},
	"/_authenticated/supplier/orders": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/orders.tsx",
		children: void 0,
		preloads: [
			"/assets/orders-BVJmvH-V.js",
			"/assets/order-search-DmIu1baf.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/order-filters-CJ9pQZ8D.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/courier-brand-CGZokMK1.js",
			"/assets/BulkScanModal-CEZrGXt0.js",
			"/assets/CopyOrderNumber-D3Uc5BcL.js",
			"/assets/labels-B_x8LENZ.js"
		]
	},
	"/_authenticated/supplier/payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/payouts.tsx",
		children: void 0,
		preloads: ["/assets/payouts-DI6mXIWW.js", "/assets/ui-kit-CpmBMi4p.js"]
	},
	"/_authenticated/supplier/products": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/products.tsx",
		children: void 0,
		preloads: [
			"/assets/products-NtYH8EeZ.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/ImageUploader-BoYluyDC.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/RichTextEditor-BlEmcFo0.js",
			"/assets/Hint-Lvce_jzt.js",
			"/assets/product-import-CVBgvb0s.js"
		]
	},
	"/_authenticated/supplier/profile": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/profile.tsx",
		children: void 0,
		preloads: ["/assets/profile-BRoXMgm2.js", "/assets/ui-kit-CpmBMi4p.js"]
	},
	"/_authenticated/supplier/report": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/report.tsx",
		children: void 0,
		preloads: [
			"/assets/report-D_w4KpSU.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/CopyOrderNumber-D3Uc5BcL.js",
			"/assets/status-tabs-CjrpntaN.js",
			"/assets/supplier-report-summary-CaQPUBK4.js"
		]
	},
	"/_authenticated/supplier/returns": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/returns.tsx",
		children: void 0,
		preloads: [
			"/assets/returns-XYsCe6aV.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/CopyOrderNumber-D3Uc5BcL.js",
			"/assets/status-tabs-CjrpntaN.js"
		]
	},
	"/s/$code/checkout": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.checkout.tsx",
		children: void 0,
		preloads: [
			"/assets/s._code.checkout-DjDquCfp.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/app-data-CKEXdl5W.js",
			"/assets/advanced-settings-DQG6Q4OO.js",
			"/assets/gateways.functions-Bo5xUPsI.js",
			"/assets/payment-brand-DxxvN5fA.js",
			"/assets/checkout-validate-Bep8wCSp.js"
		]
	},
	"/s/$code/thanks": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.thanks.tsx",
		children: void 0,
		preloads: [
			"/assets/s._code.thanks-CJoE7UZf.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/gateways.functions-Bo5xUPsI.js"
		]
	},
	"/_authenticated/admin/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/index.tsx",
		children: void 0,
		preloads: [
			"/assets/admin-FrfX4xfj.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/finance-report-DNiK6b7U.js",
			"/assets/date-range-filter-C-BzTyoO.js",
			"/assets/bootstrap-DkaVfObn.js",
			"/assets/NewOrderModal-jGRBZPqp.js"
		]
	},
	"/_authenticated/reseller/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/index.tsx",
		children: void 0,
		preloads: [
			"/assets/reseller-Dtt1qEmF.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/finance-report-DNiK6b7U.js",
			"/assets/date-range-filter-C-BzTyoO.js",
			"/assets/report-blocks-BJlRoHMU.js",
			"/assets/bootstrap-DkaVfObn.js",
			"/assets/payment-methods-Dsxh6KPk.js",
			"/assets/payment-brand-DxxvN5fA.js",
			"/assets/NewOrderModal-jGRBZPqp.js",
			"/assets/admin-notices-Besy0WXb.js",
			"/assets/deposit-BWqyszg4.js",
			"/assets/deposit-notice-Ce7Nbjtu.js"
		]
	},
	"/_authenticated/supplier/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/index.tsx",
		children: void 0,
		preloads: [
			"/assets/supplier-DqroFoe7.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/report-blocks-BJlRoHMU.js",
			"/assets/CopyOrderNumber-D3Uc5BcL.js"
		]
	},
	"/s/$code/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.index.tsx",
		children: void 0,
		preloads: ["/assets/s._code.index-B9TxxsFk.js"]
	},
	"/_authenticated/admin/products/new": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/products.new.tsx",
		children: void 0,
		preloads: [
			"/assets/products.new-BTs-u0A4.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/advanced-settings-DQG6Q4OO.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/ImageUploader-BoYluyDC.js",
			"/assets/price-breakdown-B8lz3iaP.js",
			"/assets/RichTextEditor-BlEmcFo0.js",
			"/assets/slug-BCYTblfU.js",
			"/assets/Hint-Lvce_jzt.js",
			"/assets/product-import-CVBgvb0s.js",
			"/assets/ProductImportModal-Dhnx_Asi.js"
		]
	},
	"/s/$code/c/$slug": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.c.$slug.tsx",
		children: void 0,
		preloads: ["/assets/s._code.c._slug-CvOgtenk.js"]
	},
	"/s/$code/p/$slug": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.p.$slug.tsx",
		children: void 0,
		preloads: [
			"/assets/s._code.p._slug-COtx6Sfl.js",
			"/assets/app-data-CKEXdl5W.js",
			"/assets/product-code-Dw6bVcdd.js",
			"/assets/reseller-tools-eORm9cZO.js"
		]
	},
	"/_authenticated/admin/products/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/products.index.tsx",
		children: void 0,
		preloads: [
			"/assets/products.index-N59U_1Jx.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/advanced-settings-DQG6Q4OO.js",
			"/assets/button-kNZ4kbD4.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/reseller-tools-eORm9cZO.js",
			"/assets/ProductImportModal-Dhnx_Asi.js",
			"/assets/supplier-BK6TQ-hn.js"
		]
	},
	"/_authenticated/admin/products/$id/edit": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/products.$id.edit.tsx",
		children: void 0,
		preloads: [
			"/assets/products._id.edit-CE2WiJJh.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/ImageUploader-BoYluyDC.js",
			"/assets/price-breakdown-B8lz3iaP.js",
			"/assets/RichTextEditor-BlEmcFo0.js",
			"/assets/slug-BCYTblfU.js",
			"/assets/Hint-Lvce_jzt.js"
		]
	},
	"/_authenticated/reseller/orders/$id/invoice": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/orders.$id.invoice.tsx",
		children: void 0,
		preloads: ["/assets/orders._id.invoice-B3tnrrUz.js"]
	}
} });
//#endregion
export { tsrStartManifest };
