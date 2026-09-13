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
			"/assets/index-BjSdP-Tc.js",
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
			src: "/assets/index-BjSdP-Tc.js"
		} }]
	},
	"/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/index.tsx",
		children: void 0,
		preloads: [
			"/assets/routes-BOEmPwNh.js",
			"/assets/finance-report-K2SyaS2k.js",
			"/assets/bootstrap-DWAxyI5v.js",
			"/assets/landing-content-Bp4x7_FG.js",
			"/assets/pwa-install-B_rRm3TN.js",
			"/assets/public-header-DV3z2A51.js"
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
		preloads: ["/assets/route-C1M_pR3d.js"]
	},
	"/catalog": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/catalog.tsx",
		children: ["/catalog/$slug", "/catalog/"],
		preloads: [
			"/assets/catalog-e_H88HH4.js",
			"/assets/shell-r-OQDyP3.js",
			"/assets/public-header-DV3z2A51.js"
		]
	},
	"/login": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/login.tsx",
		children: void 0,
		preloads: [
			"/assets/login-OnlSDi8D.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/advanced-settings-DBk57kJ3.js",
			"/assets/verification.functions-CVjKsQwW.js",
			"/assets/public-header-DV3z2A51.js"
		]
	},
	"/privacy": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/privacy.tsx",
		children: void 0,
		preloads: ["/assets/privacy-gM9c7b-Z.js", "/assets/public-header-DV3z2A51.js"]
	},
	"/tutorials": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/tutorials.tsx",
		children: void 0,
		preloads: [
			"/assets/tutorials-DhBdqU6o.js",
			"/assets/tutorial-library-BpsP4jxA.js",
			"/assets/public-header-DV3z2A51.js"
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
			"/assets/route-4iWkeCUn.js",
			"/assets/useLocation-DEtZsv70.js",
			"/assets/app-data-iZnisk5r.js",
			"/assets/use-auth-BHamz5dc.js",
			"/assets/BulkScanModal-eo6EKzeW.js",
			"/assets/use-order-nav-count-BUEU4ixB.js",
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
			"/assets/route-DLT_T21f.js",
			"/assets/useLocation-DEtZsv70.js",
			"/assets/app-data-iZnisk5r.js",
			"/assets/panel-bootstrap-2XoLoAKp.js",
			"/assets/use-auth-BHamz5dc.js",
			"/assets/impersonation-DjuKbOuc.js",
			"/assets/reseller-status-BRiEAbFB.js",
			"/assets/use-order-nav-count-BUEU4ixB.js",
			"/assets/subscription-DSyN4JQ-.js",
			"/assets/use-verification-CQgmgs9N.js",
			"/assets/impersonation-banner-DePeCWgi.js"
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
			"/assets/route-CVH2GsJz.js",
			"/assets/app-data-iZnisk5r.js",
			"/assets/use-auth-BHamz5dc.js",
			"/assets/supplier-DaAjk4-B.js",
			"/assets/use-order-nav-count-BUEU4ixB.js",
			"/assets/use-verification-CQgmgs9N.js",
			"/assets/impersonation-banner-DePeCWgi.js",
			"/assets/supplier-context-BU7JZggX.js"
		]
	},
	"/_authenticated/dashboard": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/dashboard.tsx",
		children: void 0,
		preloads: [
			"/assets/dashboard-D-mkj6OX.js",
			"/assets/use-auth-BHamz5dc.js",
			"/assets/use-verification-CQgmgs9N.js"
		]
	},
	"/_authenticated/onboarding": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/onboarding.tsx",
		children: void 0,
		preloads: [
			"/assets/onboarding-9SSQWeTI.js",
			"/assets/app-data-iZnisk5r.js",
			"/assets/use-auth-BHamz5dc.js",
			"/assets/impersonation-DjuKbOuc.js",
			"/assets/reseller-status-BRiEAbFB.js",
			"/assets/use-verification-CQgmgs9N.js"
		]
	},
	"/_authenticated/verify": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/verify.tsx",
		children: void 0,
		preloads: [
			"/assets/verify-CKIj0C_S.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/use-verification-CQgmgs9N.js",
			"/assets/verification.functions-CVjKsQwW.js"
		]
	},
	"/catalog/$slug": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/catalog.$slug.tsx",
		children: void 0,
		preloads: [
			"/assets/catalog._slug-BLuOm_Yr.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/app-data-iZnisk5r.js",
			"/assets/finance-report-K2SyaS2k.js",
			"/assets/image-picker-CIBHWXVc.js",
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
			"/assets/s._code-CaPbHPvG.js",
			"/assets/useRouterState-CSoyKBSC.js",
			"/assets/ui-zY80e-Nt.js",
			"/assets/store-content-DroOL-aq.js",
			"/assets/store-menu-x15wI3st.js",
			"/assets/pwa-install-B_rRm3TN.js",
			"/assets/store-visits-1Hge0-I8.js"
		]
	},
	"/catalog/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/catalog.index.tsx",
		children: void 0,
		preloads: [
			"/assets/catalog.index-DN-zmm3C.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/finance-report-K2SyaS2k.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/product-code-DSJt8_3l.js",
			"/assets/image-picker-CIBHWXVc.js",
			"/assets/catalog.functions-BP0xbV47.js"
		]
	},
	"/_authenticated/admin/advanced": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/advanced.tsx",
		children: void 0,
		preloads: [
			"/assets/advanced-DHKXuxH-.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/advanced-settings-DBk57kJ3.js",
			"/assets/deposit-settings-BMm336A0.js"
		]
	},
	"/_authenticated/admin/agent-payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/agent-payouts.tsx",
		children: void 0,
		preloads: [
			"/assets/agent-payouts-BQa12pyp.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/date-LErKaP8X.js",
			"/assets/ledger-timeline-DWBSmVwP.js",
			"/assets/agents-BeJTAdKg.js"
		]
	},
	"/_authenticated/admin/agent-report": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/agent-report.tsx",
		children: void 0,
		preloads: [
			"/assets/agent-report-Dn5S2MbU.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/date-LErKaP8X.js",
			"/assets/agents-BeJTAdKg.js",
			"/assets/date-range-filter-C-BzTyoO.js"
		]
	},
	"/_authenticated/admin/agents": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/agents.tsx",
		children: void 0,
		preloads: [
			"/assets/agents-cjCp1elW.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/agents-BeJTAdKg.js",
			"/assets/auth-middleware-Cii12F0n.js"
		]
	},
	"/_authenticated/admin/backup": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/backup.tsx",
		children: void 0,
		preloads: ["/assets/backup-ros44Amc.js", "/assets/ui-kit-CpmBMi4p.js"]
	},
	"/_authenticated/admin/brands": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/brands.tsx",
		children: void 0,
		preloads: [
			"/assets/brands-QJu6gSqL.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/ImageUploader-CrA3LDO0.js"
		]
	},
	"/_authenticated/admin/business-report": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/business-report.tsx",
		children: void 0,
		preloads: [
			"/assets/business-report-BrQ41F7t.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/finance-report-K2SyaS2k.js",
			"/assets/agents-BeJTAdKg.js",
			"/assets/order-filters-CJ9pQZ8D.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/report-blocks-DS1crTnb.js",
			"/assets/reseller-avatar-CbTfdTEo.js",
			"/assets/business-report-DHORMmoB.js"
		]
	},
	"/_authenticated/admin/categories": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/categories.tsx",
		children: void 0,
		preloads: [
			"/assets/categories-CiyKFmEh.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/ImageUploader-CrA3LDO0.js"
		]
	},
	"/_authenticated/admin/commissions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/commissions.tsx",
		children: void 0,
		preloads: ["/assets/commissions-CRefBtYo.js", "/assets/ui-kit-CpmBMi4p.js"]
	},
	"/_authenticated/admin/couriers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/couriers.tsx",
		children: void 0,
		preloads: [
			"/assets/couriers-BuFC2yYV.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/courier-brand-lEby_ait.js"
		]
	},
	"/_authenticated/admin/customers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/customers.tsx",
		children: void 0,
		preloads: [
			"/assets/customers-CtFzQTEf.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/customers-report-C7TAz6et.js"
		]
	},
	"/_authenticated/admin/deposit-transactions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/deposit-transactions.tsx",
		children: void 0,
		preloads: [
			"/assets/deposit-transactions-CeF1B9va.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/date-LErKaP8X.js",
			"/assets/deposit-ledger-Depab66t.js",
			"/assets/payment-methods-DfDTSkyH.js",
			"/assets/deposit-pay-panel-CwVPnWkg.js"
		]
	},
	"/_authenticated/admin/domains": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/domains.tsx",
		children: void 0,
		preloads: [
			"/assets/domains-DDb8Lpk0.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/cloudflare.functions-goyJ2EYX.js"
		]
	},
	"/_authenticated/admin/expenses": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/expenses.tsx",
		children: void 0,
		preloads: [
			"/assets/expenses-DtA_dKsb.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/finance-report-K2SyaS2k.js",
			"/assets/order-filters-CJ9pQZ8D.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/report-blocks-DS1crTnb.js",
			"/assets/business-report-DHORMmoB.js"
		]
	},
	"/_authenticated/admin/landing": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/landing.tsx",
		children: void 0,
		preloads: [
			"/assets/landing-Dg0c1-sR.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/ImageUploader-CrA3LDO0.js",
			"/assets/landing-content-Bp4x7_FG.js",
			"/assets/tabs-4Ugcp-Dh.js"
		]
	},
	"/_authenticated/admin/maintenance": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/maintenance.tsx",
		children: void 0,
		preloads: [
			"/assets/maintenance-CoeOaUw_.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/auth-middleware-Cii12F0n.js"
		]
	},
	"/_authenticated/admin/marketing": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/marketing.tsx",
		children: void 0,
		preloads: ["/assets/marketing-H400rOoV.js", "/assets/ui-kit-CpmBMi4p.js"]
	},
	"/_authenticated/admin/media": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/media.tsx",
		children: void 0,
		preloads: [
			"/assets/media-om1lXqo3.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/button-kNZ4kbD4.js",
			"/assets/data-list-CDjbwaL-.js"
		]
	},
	"/_authenticated/admin/notices": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/notices.tsx",
		children: void 0,
		preloads: [
			"/assets/notices-BwG0aztK.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/admin-notices-D3aOO1Xo.js"
		]
	},
	"/_authenticated/admin/notifications": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/notifications.tsx",
		children: void 0,
		preloads: [
			"/assets/notifications-DdJWA5aR.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/auth-middleware-Cii12F0n.js"
		]
	},
	"/_authenticated/admin/orders": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/orders.tsx",
		children: void 0,
		preloads: [
			"/assets/orders-CcCVj5NK.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/order-search-qKEWeTpL.js",
			"/assets/CourierTimeline-DHofubHP.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/finance-report-K2SyaS2k.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/order-filters-CJ9pQZ8D.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/business-report-DHORMmoB.js",
			"/assets/courier-brand-lEby_ait.js",
			"/assets/bootstrap-DWAxyI5v.js",
			"/assets/NewOrderModal-FdlT0aRM.js",
			"/assets/CopyOrderNumber-DDrI4V7q.js",
			"/assets/labels-Z2S3a9KR.js",
			"/assets/price-breakdown-ChBz0f11.js"
		]
	},
	"/_authenticated/admin/payments": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/payments.tsx",
		children: void 0,
		preloads: [
			"/assets/payments-Ce7qZJ8n.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/payment-methods-DfDTSkyH.js",
			"/assets/payment-brand-DxxvN5fA.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/gateway-grid-Bi-4nkhk.js"
		]
	},
	"/_authenticated/admin/payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/payouts.tsx",
		children: void 0,
		preloads: [
			"/assets/payouts-DiVzVpJL.js",
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
			"/assets/policies-zPKWbrjq.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/policies-D4s-HOsP.js"
		]
	},
	"/_authenticated/admin/privacy": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/privacy.tsx",
		children: void 0,
		preloads: [
			"/assets/privacy-BkL1ED2K.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/RichTextEditor-BxCdC7bf.js"
		]
	},
	"/_authenticated/admin/resellers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/resellers.tsx",
		children: void 0,
		preloads: [
			"/assets/resellers-CEYT5WW5.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/advanced-settings-DBk57kJ3.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/date-LErKaP8X.js",
			"/assets/auth-middleware-Cii12F0n.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/reseller-avatar-CbTfdTEo.js",
			"/assets/deposit-ledger-Depab66t.js",
			"/assets/admin-users.functions-sCWhcsqK.js",
			"/assets/impersonation-DjuKbOuc.js",
			"/assets/reseller-status-BRiEAbFB.js",
			"/assets/ResellerProfile-nR7BBGMj.js",
			"/assets/password-reset-modal-DHdTWeFf.js"
		]
	},
	"/_authenticated/admin/settings": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/settings.tsx",
		children: void 0,
		preloads: [
			"/assets/settings-BHFDzf4m.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/ImageUploader-CrA3LDO0.js"
		]
	},
	"/_authenticated/admin/staff": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/staff.tsx",
		children: void 0,
		preloads: [
			"/assets/staff-Dps6CZjP.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/auth-middleware-Cii12F0n.js",
			"/assets/dist-Bm7eTr0L.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/tabs-4Ugcp-Dh.js",
			"/assets/admin-users.functions-sCWhcsqK.js"
		]
	},
	"/_authenticated/admin/subscriptions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/subscriptions.tsx",
		children: void 0,
		preloads: [
			"/assets/subscriptions-mB4deXnc.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/finance-report-K2SyaS2k.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/subscription-DSyN4JQ-.js"
		]
	},
	"/_authenticated/admin/supplier-payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/supplier-payouts.tsx",
		children: void 0,
		preloads: [
			"/assets/supplier-payouts-Drq98EvC.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/supplier-DaAjk4-B.js",
			"/assets/status-tabs-CjrpntaN.js"
		]
	},
	"/_authenticated/admin/supplier-report": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/supplier-report.tsx",
		children: void 0,
		preloads: [
			"/assets/supplier-report-Bg954UdP.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/CopyOrderNumber-DDrI4V7q.js",
			"/assets/supplier-DaAjk4-B.js",
			"/assets/supplier-report-summary-yuGNY4Iu.js"
		]
	},
	"/_authenticated/admin/supplier-returns": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/supplier-returns.tsx",
		children: void 0,
		preloads: [
			"/assets/supplier-returns-BZoiEEVT.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/button-kNZ4kbD4.js",
			"/assets/CopyOrderNumber-DDrI4V7q.js",
			"/assets/supplier-DaAjk4-B.js",
			"/assets/impersonation-DjuKbOuc.js",
			"/assets/supplier-access.functions-R0Z6A8yU.js"
		]
	},
	"/_authenticated/admin/suppliers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/suppliers.tsx",
		children: void 0,
		preloads: [
			"/assets/suppliers-CQ3pjKLE.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/reseller-avatar-CbTfdTEo.js",
			"/assets/supplier-DaAjk4-B.js",
			"/assets/impersonation-DjuKbOuc.js",
			"/assets/password-reset-modal-DHdTWeFf.js",
			"/assets/supplier-access.functions-R0Z6A8yU.js"
		]
	},
	"/_authenticated/admin/transactions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/transactions.tsx",
		children: void 0,
		preloads: ["/assets/transactions-DkSqyES_.js", "/assets/transaction-report-aiA4DbvU.js"]
	},
	"/_authenticated/admin/tutorials": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/tutorials.tsx",
		children: void 0,
		preloads: [
			"/assets/tutorials-AaJY_3tx.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/tutorials-B1nn85L5.js"
		]
	},
	"/_authenticated/admin/visitors": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/visitors.tsx",
		children: void 0,
		preloads: [
			"/assets/visitors-CJBETWPG.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/date-LErKaP8X.js",
			"/assets/store-visits-report-BcDIXymA.js"
		]
	},
	"/_authenticated/reseller/catalog": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/catalog.tsx",
		children: void 0,
		preloads: [
			"/assets/catalog-DpjgHpUl.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/advanced-settings-DBk57kJ3.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/product-code-DSJt8_3l.js",
			"/assets/price-breakdown-ChBz0f11.js",
			"/assets/Hint-Lvce_jzt.js",
			"/assets/reseller-tools-Cok524wa.js",
			"/assets/image-picker-CIBHWXVc.js"
		]
	},
	"/_authenticated/reseller/commissions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/commissions.tsx",
		children: void 0,
		preloads: ["/assets/commissions-COjGGxuZ.js", "/assets/ui-kit-CpmBMi4p.js"]
	},
	"/_authenticated/reseller/customers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/customers.tsx",
		children: void 0,
		preloads: [
			"/assets/customers-CBGSgJsi.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/customers-report-C7TAz6et.js"
		]
	},
	"/_authenticated/reseller/domain": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/domain.tsx",
		children: void 0,
		preloads: [
			"/assets/domain-DqOlA-vQ.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/cloudflare.functions-goyJ2EYX.js"
		]
	},
	"/_authenticated/reseller/listings": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/listings.tsx",
		children: void 0,
		preloads: [
			"/assets/listings-DvjxRqGF.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/product-code-DSJt8_3l.js",
			"/assets/reseller-tools-Cok524wa.js"
		]
	},
	"/_authenticated/reseller/marketing": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/marketing.tsx",
		children: void 0,
		preloads: ["/assets/marketing-CoCcVEIU.js", "/assets/ui-kit-CpmBMi4p.js"]
	},
	"/_authenticated/reseller/menus": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/menus.tsx",
		children: void 0,
		preloads: [
			"/assets/menus-CHRW7b8R.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/ImageUploader-CrA3LDO0.js",
			"/assets/bootstrap-DWAxyI5v.js",
			"/assets/store-menu-x15wI3st.js"
		]
	},
	"/_authenticated/reseller/orders": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/orders.tsx",
		children: ["/_authenticated/reseller/orders/$id/invoice"],
		preloads: [
			"/assets/orders-DgloRfvy.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/order-search-qKEWeTpL.js",
			"/assets/CourierTimeline-DHofubHP.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/finance-report-K2SyaS2k.js",
			"/assets/deposit-settings-BMm336A0.js",
			"/assets/order-filters-CJ9pQZ8D.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/business-report-DHORMmoB.js",
			"/assets/courier-brand-lEby_ait.js",
			"/assets/NewOrderModal-FdlT0aRM.js",
			"/assets/CopyOrderNumber-DDrI4V7q.js",
			"/assets/deposit-Bi8vXQs0.js"
		]
	},
	"/_authenticated/reseller/payments": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/payments.tsx",
		children: void 0,
		preloads: [
			"/assets/payments-CUObOiUz.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/bootstrap-DWAxyI5v.js",
			"/assets/payment-methods-DfDTSkyH.js",
			"/assets/gateways.functions-I_6bCFgd.js",
			"/assets/payment-brand-DxxvN5fA.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/gateway-grid-Bi-4nkhk.js"
		]
	},
	"/_authenticated/reseller/payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/payouts.tsx",
		children: void 0,
		preloads: [
			"/assets/payouts-gL1ILJ_r.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/deposit-settings-BMm336A0.js",
			"/assets/date-LErKaP8X.js",
			"/assets/ledger-timeline-DWBSmVwP.js",
			"/assets/report-blocks-DS1crTnb.js",
			"/assets/deposit-pay-panel-CwVPnWkg.js",
			"/assets/deposit-Bi8vXQs0.js",
			"/assets/deposit-notice-dQAkPT5z.js"
		]
	},
	"/_authenticated/reseller/policies": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/policies.tsx",
		children: void 0,
		preloads: [
			"/assets/policies-BLulFakc.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/policies-D4s-HOsP.js"
		]
	},
	"/_authenticated/reseller/profile": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/profile.tsx",
		children: void 0,
		preloads: [
			"/assets/profile-DDIyDX2W.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/ImageUploader-CrA3LDO0.js",
			"/assets/reseller-avatar-CbTfdTEo.js",
			"/assets/ResellerProfile-nR7BBGMj.js"
		]
	},
	"/_authenticated/reseller/settings": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/settings.tsx",
		children: void 0,
		preloads: [
			"/assets/settings-C_wPwK-s.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/ImageUploader-CrA3LDO0.js",
			"/assets/bootstrap-DWAxyI5v.js"
		]
	},
	"/_authenticated/reseller/subscription": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/subscription.tsx",
		children: void 0,
		preloads: [
			"/assets/subscription-vAdMV0hW.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/finance-report-K2SyaS2k.js",
			"/assets/payment-methods-DfDTSkyH.js",
			"/assets/AppModal-Dly020dH.js"
		]
	},
	"/_authenticated/reseller/support": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/support.tsx",
		children: void 0,
		preloads: ["/assets/support-Ba_mvT0Z.js", "/assets/ui-kit-CpmBMi4p.js"]
	},
	"/_authenticated/reseller/theme": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/theme.tsx",
		children: void 0,
		preloads: [
			"/assets/theme-BSRaygoC.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/ImageUploader-CrA3LDO0.js",
			"/assets/bootstrap-DWAxyI5v.js",
			"/assets/store-content-DroOL-aq.js"
		]
	},
	"/_authenticated/reseller/transactions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/transactions.tsx",
		children: void 0,
		preloads: ["/assets/transactions-BPzpk3-D.js", "/assets/transaction-report-aiA4DbvU.js"]
	},
	"/_authenticated/reseller/tutorials": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/tutorials.tsx",
		children: void 0,
		preloads: [
			"/assets/tutorials-BGk07PUC.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/tutorial-library-BpsP4jxA.js"
		]
	},
	"/_authenticated/reseller/visitors": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/visitors.tsx",
		children: void 0,
		preloads: [
			"/assets/visitors-Cq-k9Qis.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/store-visits-report-BcDIXymA.js"
		]
	},
	"/_authenticated/supplier/media": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/media.tsx",
		children: void 0,
		preloads: [
			"/assets/media-BEReymXc.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/button-kNZ4kbD4.js",
			"/assets/data-list-CDjbwaL-.js"
		]
	},
	"/_authenticated/supplier/orders": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/orders.tsx",
		children: void 0,
		preloads: [
			"/assets/orders-aetgvGGD.js",
			"/assets/order-search-qKEWeTpL.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/order-filters-CJ9pQZ8D.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/courier-brand-lEby_ait.js",
			"/assets/BulkScanModal-eo6EKzeW.js",
			"/assets/CopyOrderNumber-DDrI4V7q.js",
			"/assets/labels-Z2S3a9KR.js"
		]
	},
	"/_authenticated/supplier/payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/payouts.tsx",
		children: void 0,
		preloads: ["/assets/payouts-BKwNwW6Q.js", "/assets/ui-kit-CpmBMi4p.js"]
	},
	"/_authenticated/supplier/products": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/products.tsx",
		children: void 0,
		preloads: [
			"/assets/products-G0FtlitH.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/ImageUploader-CrA3LDO0.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/RichTextEditor-BxCdC7bf.js",
			"/assets/Hint-Lvce_jzt.js",
			"/assets/product-import-y7t1GQ0e.js"
		]
	},
	"/_authenticated/supplier/profile": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/profile.tsx",
		children: void 0,
		preloads: ["/assets/profile-CM3pACQF.js", "/assets/ui-kit-CpmBMi4p.js"]
	},
	"/_authenticated/supplier/report": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/report.tsx",
		children: void 0,
		preloads: [
			"/assets/report-RvnuZlGT.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/CopyOrderNumber-DDrI4V7q.js",
			"/assets/status-tabs-CjrpntaN.js",
			"/assets/supplier-report-summary-yuGNY4Iu.js"
		]
	},
	"/_authenticated/supplier/returns": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/returns.tsx",
		children: void 0,
		preloads: [
			"/assets/returns-CqiKTg5a.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/CopyOrderNumber-DDrI4V7q.js",
			"/assets/status-tabs-CjrpntaN.js"
		]
	},
	"/s/$code/checkout": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.checkout.tsx",
		children: void 0,
		preloads: [
			"/assets/s._code.checkout-D2uKXBab.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/app-data-iZnisk5r.js",
			"/assets/advanced-settings-DBk57kJ3.js",
			"/assets/gateways.functions-I_6bCFgd.js",
			"/assets/payment-brand-DxxvN5fA.js",
			"/assets/checkout-validate-Bep8wCSp.js"
		]
	},
	"/s/$code/thanks": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.thanks.tsx",
		children: void 0,
		preloads: [
			"/assets/s._code.thanks-DjbYCH9Z.js",
			"/assets/useServerFn-DYJ7tC_o.js",
			"/assets/gateways.functions-I_6bCFgd.js"
		]
	},
	"/_authenticated/admin/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/index.tsx",
		children: void 0,
		preloads: [
			"/assets/admin-DWUMHTFy.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/finance-report-K2SyaS2k.js",
			"/assets/date-range-filter-C-BzTyoO.js",
			"/assets/bootstrap-DWAxyI5v.js",
			"/assets/NewOrderModal-FdlT0aRM.js"
		]
	},
	"/_authenticated/reseller/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/index.tsx",
		children: void 0,
		preloads: [
			"/assets/reseller-DOargIAS.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/finance-report-K2SyaS2k.js",
			"/assets/date-range-filter-C-BzTyoO.js",
			"/assets/report-blocks-DS1crTnb.js",
			"/assets/bootstrap-DWAxyI5v.js",
			"/assets/payment-methods-DfDTSkyH.js",
			"/assets/payment-brand-DxxvN5fA.js",
			"/assets/NewOrderModal-FdlT0aRM.js",
			"/assets/admin-notices-D3aOO1Xo.js",
			"/assets/deposit-Bi8vXQs0.js",
			"/assets/deposit-notice-dQAkPT5z.js"
		]
	},
	"/_authenticated/supplier/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/index.tsx",
		children: void 0,
		preloads: [
			"/assets/supplier-CgqffofV.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/report-blocks-DS1crTnb.js",
			"/assets/CopyOrderNumber-DDrI4V7q.js"
		]
	},
	"/s/$code/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.index.tsx",
		children: void 0,
		preloads: ["/assets/s._code.index-Csc-aDeW.js"]
	},
	"/_authenticated/admin/products/new": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/products.new.tsx",
		children: void 0,
		preloads: [
			"/assets/products.new-Cusol8Nu.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/advanced-settings-DBk57kJ3.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/ImageUploader-CrA3LDO0.js",
			"/assets/price-breakdown-ChBz0f11.js",
			"/assets/RichTextEditor-BxCdC7bf.js",
			"/assets/slug-BmVJ6NFZ.js",
			"/assets/Hint-Lvce_jzt.js",
			"/assets/product-import-y7t1GQ0e.js",
			"/assets/ProductImportModal-C1sLhYdy.js"
		]
	},
	"/s/$code/c/$slug": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.c.$slug.tsx",
		children: void 0,
		preloads: ["/assets/s._code.c._slug-BRFaGuPB.js"]
	},
	"/s/$code/p/$slug": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.p.$slug.tsx",
		children: void 0,
		preloads: [
			"/assets/s._code.p._slug-CMb634_5.js",
			"/assets/app-data-iZnisk5r.js",
			"/assets/product-code-DSJt8_3l.js",
			"/assets/reseller-tools-Cok524wa.js"
		]
	},
	"/_authenticated/admin/products/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/products.index.tsx",
		children: void 0,
		preloads: [
			"/assets/products.index-BVJPuCmn.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/advanced-settings-DBk57kJ3.js",
			"/assets/button-kNZ4kbD4.js",
			"/assets/dropdown-menu-CWW84bxd.js",
			"/assets/data-list-CDjbwaL-.js",
			"/assets/AppModal-Dly020dH.js",
			"/assets/reseller-tools-Cok524wa.js",
			"/assets/ProductImportModal-C1sLhYdy.js",
			"/assets/supplier-DaAjk4-B.js"
		]
	},
	"/_authenticated/admin/products/$id/edit": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/products.$id.edit.tsx",
		children: void 0,
		preloads: [
			"/assets/products._id.edit-B669vDuX.js",
			"/assets/ui-kit-CpmBMi4p.js",
			"/assets/searchable-select-9e-4cd4q.js",
			"/assets/ImageUploader-CrA3LDO0.js",
			"/assets/price-breakdown-ChBz0f11.js",
			"/assets/RichTextEditor-BxCdC7bf.js",
			"/assets/slug-BmVJ6NFZ.js",
			"/assets/Hint-Lvce_jzt.js"
		]
	},
	"/_authenticated/reseller/orders/$id/invoice": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/orders.$id.invoice.tsx",
		children: void 0,
		preloads: ["/assets/orders._id.invoice-SgE_nKjw.js"]
	}
} });
//#endregion
export { tsrStartManifest };
