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
			"/assets/index-DrkgMsUk.js",
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
			src: "/assets/index-DrkgMsUk.js"
		} }]
	},
	"/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/index.tsx",
		children: void 0,
		preloads: [
			"/assets/routes-BkJmJxVq.js",
			"/assets/finance-report-C3NQM_q2.js",
			"/assets/bootstrap--zSGt1KR.js",
			"/assets/icons-CzsQNHhg.js",
			"/assets/pwa-install-CbewidiK.js",
			"/assets/public-header-7k_Jvm2B.js"
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
		preloads: ["/assets/route-DKajkIQp.js"]
	},
	"/catalog": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/catalog.tsx",
		children: ["/catalog/$slug", "/catalog/"],
		preloads: [
			"/assets/catalog-C1odgdEv.js",
			"/assets/shell-BRyStA9n.js",
			"/assets/public-header-7k_Jvm2B.js"
		]
	},
	"/login": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/login.tsx",
		children: void 0,
		preloads: [
			"/assets/login-BtJEzlj0.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/advanced-settings-DbfqsihU.js",
			"/assets/verification.functions-8ehVFcZU.js",
			"/assets/public-header-7k_Jvm2B.js"
		]
	},
	"/privacy": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/privacy.tsx",
		children: void 0,
		preloads: ["/assets/privacy-7UqDNELJ.js", "/assets/public-header-7k_Jvm2B.js"]
	},
	"/tutorials": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/tutorials.tsx",
		children: void 0,
		preloads: [
			"/assets/tutorials-GYsLUptO.js",
			"/assets/tutorial-library-auZJB2s1.js",
			"/assets/public-header-7k_Jvm2B.js"
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
			"/assets/route-CQIYdXES.js",
			"/assets/useLocation-DLpQ9P29.js",
			"/assets/app-data-DOijodpw.js",
			"/assets/use-auth-DwOjFaFO.js",
			"/assets/BulkScanModal-yvxHbV1h.js",
			"/assets/use-order-nav-count-CS70EogT.js"
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
			"/assets/route-DxMvq7yb.js",
			"/assets/useLocation-DLpQ9P29.js",
			"/assets/app-data-DOijodpw.js",
			"/assets/panel-bootstrap-2XoLoAKp.js",
			"/assets/use-auth-DwOjFaFO.js",
			"/assets/impersonation-Bm_g692_.js",
			"/assets/reseller-status-BRiEAbFB.js",
			"/assets/use-order-nav-count-CS70EogT.js",
			"/assets/use-verification-D3m3AYVb.js",
			"/assets/impersonation-banner-BpKtsZSB.js"
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
			"/assets/route-BfETX1SN.js",
			"/assets/app-data-DOijodpw.js",
			"/assets/use-auth-DwOjFaFO.js",
			"/assets/supplier-DPA33R0X.js",
			"/assets/use-order-nav-count-CS70EogT.js",
			"/assets/use-verification-D3m3AYVb.js",
			"/assets/impersonation-banner-BpKtsZSB.js",
			"/assets/supplier-context-BU7JZggX.js"
		]
	},
	"/_authenticated/dashboard": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/dashboard.tsx",
		children: void 0,
		preloads: [
			"/assets/dashboard-DFYo6i-f.js",
			"/assets/use-auth-DwOjFaFO.js",
			"/assets/use-verification-D3m3AYVb.js"
		]
	},
	"/_authenticated/onboarding": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/onboarding.tsx",
		children: void 0,
		preloads: [
			"/assets/onboarding-DM2X-qoD.js",
			"/assets/app-data-DOijodpw.js",
			"/assets/use-auth-DwOjFaFO.js",
			"/assets/impersonation-Bm_g692_.js",
			"/assets/reseller-status-BRiEAbFB.js",
			"/assets/use-verification-D3m3AYVb.js"
		]
	},
	"/_authenticated/verify": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/verify.tsx",
		children: void 0,
		preloads: [
			"/assets/verify-BzVGoXZ7.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/use-verification-D3m3AYVb.js",
			"/assets/verification.functions-8ehVFcZU.js"
		]
	},
	"/catalog/$slug": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/catalog.$slug.tsx",
		children: void 0,
		preloads: [
			"/assets/catalog._slug-yhEcsTY5.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/app-data-DOijodpw.js",
			"/assets/finance-report-C3NQM_q2.js",
			"/assets/image-picker-CZ4ollTL.js",
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
			"/assets/s._code-CXKnF92q.js",
			"/assets/useRouterState-zApVOjXW.js",
			"/assets/ui-wwx03EdX.js",
			"/assets/store-content-DR8qgnfq.js",
			"/assets/store-menu-CMHz2JHL.js",
			"/assets/store-visits-YwN-1rei.js"
		]
	},
	"/catalog/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/catalog.index.tsx",
		children: void 0,
		preloads: [
			"/assets/catalog.index-D92JZAql.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/finance-report-C3NQM_q2.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/product-code-Bo9XLG_j.js",
			"/assets/image-picker-CZ4ollTL.js",
			"/assets/catalog.functions-pYBF3FyA.js"
		]
	},
	"/_authenticated/admin/advanced": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/advanced.tsx",
		children: void 0,
		preloads: [
			"/assets/advanced-CUsFk2wU.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/advanced-settings-DbfqsihU.js",
			"/assets/deposit-settings-ljbFILYb.js"
		]
	},
	"/_authenticated/admin/agent-payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/agent-payouts.tsx",
		children: void 0,
		preloads: [
			"/assets/agent-payouts-DBYZYqKW.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/searchable-select-BSxHsJv_.js",
			"/assets/ledger-timeline-UZRQsS3U.js",
			"/assets/agents-Dh-w-Jzh.js"
		]
	},
	"/_authenticated/admin/agent-report": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/agent-report.tsx",
		children: void 0,
		preloads: [
			"/assets/agent-report-xAKTS8yu.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/searchable-select-BSxHsJv_.js",
			"/assets/agents-Dh-w-Jzh.js",
			"/assets/date-range-filter-ChzayhKq.js"
		]
	},
	"/_authenticated/admin/agents": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/agents.tsx",
		children: void 0,
		preloads: [
			"/assets/agents-BGTlIDR7.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/agents-Dh-w-Jzh.js",
			"/assets/auth-middleware-DJaGgVzV.js"
		]
	},
	"/_authenticated/admin/brands": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/brands.tsx",
		children: void 0,
		preloads: [
			"/assets/brands-r5j8vvJF.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/ImageUploader-DxK0nWY6.js"
		]
	},
	"/_authenticated/admin/business-report": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/business-report.tsx",
		children: void 0,
		preloads: [
			"/assets/business-report-D-Y1_dBh.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/finance-report-C3NQM_q2.js",
			"/assets/agents-Dh-w-Jzh.js",
			"/assets/order-filters-_H2RpFyN.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/report-blocks-D80sal6P.js",
			"/assets/reseller-avatar-CbTfdTEo.js",
			"/assets/business-report-BdZWgv5L.js"
		]
	},
	"/_authenticated/admin/categories": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/categories.tsx",
		children: void 0,
		preloads: [
			"/assets/categories-BJkM2skW.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/ImageUploader-DxK0nWY6.js"
		]
	},
	"/_authenticated/admin/commissions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/commissions.tsx",
		children: void 0,
		preloads: ["/assets/commissions-DbA5-942.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/admin/couriers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/couriers.tsx",
		children: void 0,
		preloads: [
			"/assets/couriers-D3_1qi3k.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/courier-brand-Bc0f9Aah.js"
		]
	},
	"/_authenticated/admin/customers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/customers.tsx",
		children: void 0,
		preloads: [
			"/assets/customers-Dk_h3ZJj.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/customers-report-Rtiwh9fR.js"
		]
	},
	"/_authenticated/admin/deposit-transactions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/deposit-transactions.tsx",
		children: void 0,
		preloads: [
			"/assets/deposit-transactions-Dknp8opg.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/deposit-ledger-BabMIVVp.js",
			"/assets/payment-methods-BplKnWgZ.js",
			"/assets/deposit-pay-panel-nGq7J6SU.js"
		]
	},
	"/_authenticated/admin/domains": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/domains.tsx",
		children: void 0,
		preloads: [
			"/assets/domains-DYq7BA1z.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/cloudflare.functions-DzIH9ISc.js"
		]
	},
	"/_authenticated/admin/expenses": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/expenses.tsx",
		children: void 0,
		preloads: [
			"/assets/expenses-Bqfqk6OE.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/finance-report-C3NQM_q2.js",
			"/assets/order-filters-_H2RpFyN.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/report-blocks-D80sal6P.js",
			"/assets/business-report-BdZWgv5L.js"
		]
	},
	"/_authenticated/admin/landing": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/landing.tsx",
		children: void 0,
		preloads: [
			"/assets/landing-DRZuIal3.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/ImageUploader-DxK0nWY6.js",
			"/assets/icons-CzsQNHhg.js",
			"/assets/tabs-4Ugcp-Dh.js"
		]
	},
	"/_authenticated/admin/maintenance": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/maintenance.tsx",
		children: void 0,
		preloads: [
			"/assets/maintenance-DXe4X-mY.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/auth-middleware-DJaGgVzV.js"
		]
	},
	"/_authenticated/admin/marketing": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/marketing.tsx",
		children: void 0,
		preloads: ["/assets/marketing-CA8SlcEp.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/admin/media": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/media.tsx",
		children: void 0,
		preloads: [
			"/assets/media-B8TtDu_q.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/button-kNZ4kbD4.js",
			"/assets/data-list-C50cjcnV.js"
		]
	},
	"/_authenticated/admin/notices": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/notices.tsx",
		children: void 0,
		preloads: [
			"/assets/notices-BTOhZH2k.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/admin-notices-udxzJ3bC.js"
		]
	},
	"/_authenticated/admin/notifications": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/notifications.tsx",
		children: void 0,
		preloads: [
			"/assets/notifications-DypRRNc4.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/auth-middleware-DJaGgVzV.js"
		]
	},
	"/_authenticated/admin/orders": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/orders.tsx",
		children: void 0,
		preloads: [
			"/assets/orders-vkI-2ssz.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/order-search-CQmFUNEL.js",
			"/assets/CourierTimeline-BdmjgM5g.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/finance-report-C3NQM_q2.js",
			"/assets/searchable-select-BSxHsJv_.js",
			"/assets/order-filters-_H2RpFyN.js",
			"/assets/dropdown-menu-DSacuumd.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/business-report-BdZWgv5L.js",
			"/assets/courier-brand-Bc0f9Aah.js",
			"/assets/bootstrap--zSGt1KR.js",
			"/assets/NewOrderModal-BP2tRlx4.js",
			"/assets/CopyOrderNumber-E0ww297s.js",
			"/assets/labels-B13TLAds.js",
			"/assets/price-breakdown-DwRDbZin.js"
		]
	},
	"/_authenticated/admin/payments": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/payments.tsx",
		children: void 0,
		preloads: [
			"/assets/payments-RXypXOYR.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/payment-methods-BplKnWgZ.js",
			"/assets/payment-brand-DxxvN5fA.js",
			"/assets/AppModal-CkrLeEe4.js",
			"/assets/gateway-grid-DH8rfDPF.js"
		]
	},
	"/_authenticated/admin/payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/payouts.tsx",
		children: void 0,
		preloads: [
			"/assets/payouts-oepH3Blz.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/searchable-select-BSxHsJv_.js",
			"/assets/data-list-C50cjcnV.js"
		]
	},
	"/_authenticated/admin/policies": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/policies.tsx",
		children: void 0,
		preloads: [
			"/assets/policies-j7V2xIfg.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/AppModal-CkrLeEe4.js"
		]
	},
	"/_authenticated/admin/privacy": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/privacy.tsx",
		children: void 0,
		preloads: [
			"/assets/privacy-jsVY_cmQ.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/RichTextEditor-BGzTtPqT.js"
		]
	},
	"/_authenticated/admin/resellers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/resellers.tsx",
		children: void 0,
		preloads: [
			"/assets/resellers-BHJ9yWDR.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/advanced-settings-DbfqsihU.js",
			"/assets/searchable-select-BSxHsJv_.js",
			"/assets/auth-middleware-DJaGgVzV.js",
			"/assets/dropdown-menu-DSacuumd.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/reseller-avatar-CbTfdTEo.js",
			"/assets/deposit-ledger-BabMIVVp.js",
			"/assets/admin-users.functions-DWRVH5J1.js",
			"/assets/impersonation-Bm_g692_.js",
			"/assets/reseller-status-BRiEAbFB.js",
			"/assets/ResellerProfile-CW9S1c0M.js",
			"/assets/password-reset-modal-r4HlJdZw.js"
		]
	},
	"/_authenticated/admin/settings": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/settings.tsx",
		children: void 0,
		preloads: [
			"/assets/settings-9hcEOxUR.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/ImageUploader-DxK0nWY6.js"
		]
	},
	"/_authenticated/admin/staff": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/staff.tsx",
		children: void 0,
		preloads: [
			"/assets/staff-Bgf7yv49.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/auth-middleware-DJaGgVzV.js",
			"/assets/dist-Bm7eTr0L.js",
			"/assets/dropdown-menu-DSacuumd.js",
			"/assets/tabs-4Ugcp-Dh.js",
			"/assets/admin-users.functions-DWRVH5J1.js"
		]
	},
	"/_authenticated/admin/subscriptions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/subscriptions.tsx",
		children: void 0,
		preloads: [
			"/assets/subscriptions-iKogRnWG.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/finance-report-C3NQM_q2.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/AppModal-CkrLeEe4.js"
		]
	},
	"/_authenticated/admin/supplier-payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/supplier-payouts.tsx",
		children: void 0,
		preloads: [
			"/assets/supplier-payouts-wlb-Y5lX.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/supplier-DPA33R0X.js",
			"/assets/status-tabs-DOHqUL2P.js"
		]
	},
	"/_authenticated/admin/supplier-report": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/supplier-report.tsx",
		children: void 0,
		preloads: [
			"/assets/supplier-report-CjXYLR0d.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/CopyOrderNumber-E0ww297s.js",
			"/assets/supplier-DPA33R0X.js",
			"/assets/supplier-report-summary-D2Nt1oSI.js"
		]
	},
	"/_authenticated/admin/supplier-returns": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/supplier-returns.tsx",
		children: void 0,
		preloads: [
			"/assets/supplier-returns-C8GSnLwU.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/searchable-select-BSxHsJv_.js",
			"/assets/button-kNZ4kbD4.js",
			"/assets/CopyOrderNumber-E0ww297s.js",
			"/assets/supplier-DPA33R0X.js",
			"/assets/impersonation-Bm_g692_.js",
			"/assets/supplier-access.functions-C-NDsTgz.js"
		]
	},
	"/_authenticated/admin/suppliers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/suppliers.tsx",
		children: void 0,
		preloads: [
			"/assets/suppliers-CibioBZu.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/dropdown-menu-DSacuumd.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/reseller-avatar-CbTfdTEo.js",
			"/assets/supplier-DPA33R0X.js",
			"/assets/impersonation-Bm_g692_.js",
			"/assets/password-reset-modal-r4HlJdZw.js",
			"/assets/supplier-access.functions-C-NDsTgz.js"
		]
	},
	"/_authenticated/admin/transactions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/transactions.tsx",
		children: void 0,
		preloads: ["/assets/transactions-zDWg99yV.js", "/assets/transaction-report-CWcWBqAx.js"]
	},
	"/_authenticated/admin/tutorials": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/tutorials.tsx",
		children: void 0,
		preloads: [
			"/assets/tutorials-B8_3eGCx.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/AppModal-CkrLeEe4.js",
			"/assets/tutorials-Bc3E96cB.js"
		]
	},
	"/_authenticated/admin/visitors": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/visitors.tsx",
		children: void 0,
		preloads: [
			"/assets/visitors-DnlgiESr.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/searchable-select-BSxHsJv_.js",
			"/assets/store-visits-report-C1i6rfnT.js"
		]
	},
	"/_authenticated/reseller/catalog": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/catalog.tsx",
		children: void 0,
		preloads: [
			"/assets/catalog-BpoDE1Xs.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/advanced-settings-DbfqsihU.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/product-code-Bo9XLG_j.js",
			"/assets/price-breakdown-DwRDbZin.js",
			"/assets/Hint-BDdaji1G.js",
			"/assets/reseller-tools-DRcmAfxo.js",
			"/assets/image-picker-CZ4ollTL.js"
		]
	},
	"/_authenticated/reseller/commissions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/commissions.tsx",
		children: void 0,
		preloads: ["/assets/commissions-CVQc2c6T.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/reseller/customers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/customers.tsx",
		children: void 0,
		preloads: [
			"/assets/customers-8rIokw87.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/customers-report-Rtiwh9fR.js"
		]
	},
	"/_authenticated/reseller/domain": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/domain.tsx",
		children: void 0,
		preloads: [
			"/assets/domain-BFTq6zSA.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/cloudflare.functions-DzIH9ISc.js"
		]
	},
	"/_authenticated/reseller/listings": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/listings.tsx",
		children: void 0,
		preloads: [
			"/assets/listings-BovTuaa9.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/dropdown-menu-DSacuumd.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/product-code-Bo9XLG_j.js",
			"/assets/reseller-tools-DRcmAfxo.js"
		]
	},
	"/_authenticated/reseller/marketing": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/marketing.tsx",
		children: void 0,
		preloads: ["/assets/marketing-FobWhKc3.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/reseller/menus": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/menus.tsx",
		children: void 0,
		preloads: [
			"/assets/menus-DUbB0p8O.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/ImageUploader-DxK0nWY6.js",
			"/assets/bootstrap--zSGt1KR.js",
			"/assets/store-menu-CMHz2JHL.js"
		]
	},
	"/_authenticated/reseller/orders": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/orders.tsx",
		children: ["/_authenticated/reseller/orders/$id/invoice"],
		preloads: [
			"/assets/orders-DgNXRmlA.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/order-search-CQmFUNEL.js",
			"/assets/CourierTimeline-BdmjgM5g.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/finance-report-C3NQM_q2.js",
			"/assets/deposit-settings-ljbFILYb.js",
			"/assets/order-filters-_H2RpFyN.js",
			"/assets/dropdown-menu-DSacuumd.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/business-report-BdZWgv5L.js",
			"/assets/courier-brand-Bc0f9Aah.js",
			"/assets/NewOrderModal-BP2tRlx4.js",
			"/assets/CopyOrderNumber-E0ww297s.js",
			"/assets/deposit-HOhW1A4O.js"
		]
	},
	"/_authenticated/reseller/payments": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/payments.tsx",
		children: void 0,
		preloads: [
			"/assets/payments-uzYFSTuA.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/bootstrap--zSGt1KR.js",
			"/assets/payment-methods-BplKnWgZ.js",
			"/assets/gateways.functions-B3c8AXj_.js",
			"/assets/payment-brand-DxxvN5fA.js",
			"/assets/AppModal-CkrLeEe4.js",
			"/assets/gateway-grid-DH8rfDPF.js"
		]
	},
	"/_authenticated/reseller/payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/payouts.tsx",
		children: void 0,
		preloads: [
			"/assets/payouts-D0EEtozq.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/deposit-settings-ljbFILYb.js",
			"/assets/ledger-timeline-UZRQsS3U.js",
			"/assets/report-blocks-D80sal6P.js",
			"/assets/deposit-pay-panel-nGq7J6SU.js",
			"/assets/deposit-HOhW1A4O.js",
			"/assets/deposit-notice-BGv35JYF.js"
		]
	},
	"/_authenticated/reseller/policies": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/policies.tsx",
		children: void 0,
		preloads: ["/assets/policies-d4rVBfxe.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/reseller/profile": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/profile.tsx",
		children: void 0,
		preloads: [
			"/assets/profile-DEugIgo5.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/ImageUploader-DxK0nWY6.js",
			"/assets/reseller-avatar-CbTfdTEo.js",
			"/assets/ResellerProfile-CW9S1c0M.js"
		]
	},
	"/_authenticated/reseller/settings": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/settings.tsx",
		children: void 0,
		preloads: [
			"/assets/settings-DWpA4i-J.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/ImageUploader-DxK0nWY6.js",
			"/assets/bootstrap--zSGt1KR.js"
		]
	},
	"/_authenticated/reseller/subscription": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/subscription.tsx",
		children: void 0,
		preloads: [
			"/assets/subscription-hehHnlhb.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/finance-report-C3NQM_q2.js",
			"/assets/payment-methods-BplKnWgZ.js",
			"/assets/AppModal-CkrLeEe4.js"
		]
	},
	"/_authenticated/reseller/support": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/support.tsx",
		children: void 0,
		preloads: ["/assets/support-CJ8YUTm6.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/reseller/theme": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/theme.tsx",
		children: void 0,
		preloads: [
			"/assets/theme-BQt4ZwYZ.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/ImageUploader-DxK0nWY6.js",
			"/assets/bootstrap--zSGt1KR.js",
			"/assets/store-content-DR8qgnfq.js"
		]
	},
	"/_authenticated/reseller/transactions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/transactions.tsx",
		children: void 0,
		preloads: ["/assets/transactions-C6p7UM0s.js", "/assets/transaction-report-CWcWBqAx.js"]
	},
	"/_authenticated/reseller/tutorials": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/tutorials.tsx",
		children: void 0,
		preloads: [
			"/assets/tutorials-JXp98E6h.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/tutorial-library-auZJB2s1.js"
		]
	},
	"/_authenticated/reseller/visitors": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/visitors.tsx",
		children: void 0,
		preloads: [
			"/assets/visitors-DhFQ-WKg.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/store-visits-report-C1i6rfnT.js"
		]
	},
	"/_authenticated/supplier/media": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/media.tsx",
		children: void 0,
		preloads: [
			"/assets/media-5NQaR3Z-.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/button-kNZ4kbD4.js",
			"/assets/data-list-C50cjcnV.js"
		]
	},
	"/_authenticated/supplier/orders": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/orders.tsx",
		children: void 0,
		preloads: [
			"/assets/orders-B4chrtHC.js",
			"/assets/order-search-CQmFUNEL.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/order-filters-_H2RpFyN.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/courier-brand-Bc0f9Aah.js",
			"/assets/BulkScanModal-yvxHbV1h.js",
			"/assets/CopyOrderNumber-E0ww297s.js",
			"/assets/labels-B13TLAds.js"
		]
	},
	"/_authenticated/supplier/payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/payouts.tsx",
		children: void 0,
		preloads: ["/assets/payouts-cbO-qbyG.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/supplier/products": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/products.tsx",
		children: void 0,
		preloads: [
			"/assets/products-BCyY_uU6.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/searchable-select-BSxHsJv_.js",
			"/assets/dropdown-menu-DSacuumd.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/ImageUploader-DxK0nWY6.js",
			"/assets/AppModal-CkrLeEe4.js",
			"/assets/RichTextEditor-BGzTtPqT.js",
			"/assets/Hint-BDdaji1G.js",
			"/assets/product-import-Csn-8W_a.js"
		]
	},
	"/_authenticated/supplier/profile": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/profile.tsx",
		children: void 0,
		preloads: ["/assets/profile-BbPxx7JE.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/supplier/report": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/report.tsx",
		children: void 0,
		preloads: [
			"/assets/report-CUc_7CJ_.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/CopyOrderNumber-E0ww297s.js",
			"/assets/status-tabs-DOHqUL2P.js",
			"/assets/supplier-report-summary-D2Nt1oSI.js"
		]
	},
	"/_authenticated/supplier/returns": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/returns.tsx",
		children: void 0,
		preloads: [
			"/assets/returns-BHmhauEZ.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/CopyOrderNumber-E0ww297s.js",
			"/assets/status-tabs-DOHqUL2P.js"
		]
	},
	"/s/$code/checkout": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.checkout.tsx",
		children: void 0,
		preloads: [
			"/assets/s._code.checkout-CUiyN4VS.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/app-data-DOijodpw.js",
			"/assets/advanced-settings-DbfqsihU.js",
			"/assets/gateways.functions-B3c8AXj_.js",
			"/assets/payment-brand-DxxvN5fA.js",
			"/assets/checkout-validate-Bep8wCSp.js"
		]
	},
	"/s/$code/thanks": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.thanks.tsx",
		children: void 0,
		preloads: [
			"/assets/s._code.thanks-DXlEKWAQ.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/gateways.functions-B3c8AXj_.js"
		]
	},
	"/_authenticated/admin/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/index.tsx",
		children: void 0,
		preloads: [
			"/assets/admin-DXJvGkew.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/finance-report-C3NQM_q2.js",
			"/assets/date-range-filter-ChzayhKq.js",
			"/assets/bootstrap--zSGt1KR.js",
			"/assets/NewOrderModal-BP2tRlx4.js"
		]
	},
	"/_authenticated/reseller/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/index.tsx",
		children: void 0,
		preloads: [
			"/assets/reseller-Ckq8xL-M.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/finance-report-C3NQM_q2.js",
			"/assets/date-range-filter-ChzayhKq.js",
			"/assets/report-blocks-D80sal6P.js",
			"/assets/bootstrap--zSGt1KR.js",
			"/assets/payment-methods-BplKnWgZ.js",
			"/assets/payment-brand-DxxvN5fA.js",
			"/assets/NewOrderModal-BP2tRlx4.js",
			"/assets/admin-notices-udxzJ3bC.js",
			"/assets/deposit-HOhW1A4O.js",
			"/assets/deposit-notice-BGv35JYF.js"
		]
	},
	"/_authenticated/supplier/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/index.tsx",
		children: void 0,
		preloads: [
			"/assets/supplier-CZRZnvdQ.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/report-blocks-D80sal6P.js",
			"/assets/CopyOrderNumber-E0ww297s.js"
		]
	},
	"/s/$code/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.index.tsx",
		children: void 0,
		preloads: ["/assets/s._code.index-Dki-Sedz.js"]
	},
	"/_authenticated/admin/products/new": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/products.new.tsx",
		children: void 0,
		preloads: [
			"/assets/products.new-dvtM1jRq.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/advanced-settings-DbfqsihU.js",
			"/assets/searchable-select-BSxHsJv_.js",
			"/assets/ImageUploader-DxK0nWY6.js",
			"/assets/price-breakdown-DwRDbZin.js",
			"/assets/RichTextEditor-BGzTtPqT.js",
			"/assets/slug-BO1-6_ZP.js",
			"/assets/Hint-BDdaji1G.js",
			"/assets/product-import-Csn-8W_a.js",
			"/assets/ProductImportModal-lXz16XQu.js"
		]
	},
	"/s/$code/c/$slug": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.c.$slug.tsx",
		children: void 0,
		preloads: ["/assets/s._code.c._slug-Bnx0Vd7X.js"]
	},
	"/s/$code/p/$slug": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.p.$slug.tsx",
		children: void 0,
		preloads: [
			"/assets/s._code.p._slug-CZRcw_zn.js",
			"/assets/app-data-DOijodpw.js",
			"/assets/product-code-Bo9XLG_j.js",
			"/assets/reseller-tools-DRcmAfxo.js"
		]
	},
	"/_authenticated/admin/products/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/products.index.tsx",
		children: void 0,
		preloads: [
			"/assets/products.index-ELLwJxr_.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/advanced-settings-DbfqsihU.js",
			"/assets/button-kNZ4kbD4.js",
			"/assets/dropdown-menu-DSacuumd.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/AppModal-CkrLeEe4.js",
			"/assets/reseller-tools-DRcmAfxo.js",
			"/assets/ProductImportModal-lXz16XQu.js",
			"/assets/supplier-DPA33R0X.js"
		]
	},
	"/_authenticated/admin/products/$id/edit": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/products.$id.edit.tsx",
		children: void 0,
		preloads: [
			"/assets/products._id.edit-BYWwwQYK.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/searchable-select-BSxHsJv_.js",
			"/assets/ImageUploader-DxK0nWY6.js",
			"/assets/price-breakdown-DwRDbZin.js",
			"/assets/RichTextEditor-BGzTtPqT.js",
			"/assets/slug-BO1-6_ZP.js",
			"/assets/Hint-BDdaji1G.js"
		]
	},
	"/_authenticated/reseller/orders/$id/invoice": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/orders.$id.invoice.tsx",
		children: void 0,
		preloads: ["/assets/orders._id.invoice-D8FwGkQD.js"]
	}
} });
//#endregion
export { tsrStartManifest };
