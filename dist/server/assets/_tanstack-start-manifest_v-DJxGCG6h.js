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
			"/assets/index-h7SlP0rc.js",
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
			src: "/assets/index-h7SlP0rc.js"
		} }]
	},
	"/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/index.tsx",
		children: void 0,
		preloads: [
			"/assets/routes-39xZYJrs.js",
			"/assets/finance-report-qe_22IXp.js",
			"/assets/bootstrap-BC6OB9xr.js",
			"/assets/icons-CzsQNHhg.js",
			"/assets/pwa-install-CbewidiK.js",
			"/assets/public-header-B52R2-Jh.js"
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
		preloads: ["/assets/route-BmS-sZkH.js"]
	},
	"/catalog": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/catalog.tsx",
		children: ["/catalog/$slug", "/catalog/"],
		preloads: [
			"/assets/catalog-CpmxM9Qu.js",
			"/assets/shell-wlZzZpYU.js",
			"/assets/public-header-B52R2-Jh.js"
		]
	},
	"/login": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/login.tsx",
		children: void 0,
		preloads: [
			"/assets/login-B2vgq2W9.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/advanced-settings-CD-_SUu1.js",
			"/assets/verification.functions-C3G5n4Nd.js",
			"/assets/public-header-B52R2-Jh.js"
		]
	},
	"/privacy": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/privacy.tsx",
		children: void 0,
		preloads: ["/assets/privacy-C-XpRmKD.js", "/assets/public-header-B52R2-Jh.js"]
	},
	"/tutorials": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/tutorials.tsx",
		children: void 0,
		preloads: [
			"/assets/tutorials-DD5KG4B-.js",
			"/assets/tutorial-library-eD7JZKU6.js",
			"/assets/public-header-B52R2-Jh.js"
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
			"/assets/route-Cz7Yn6Jb.js",
			"/assets/useLocation-CqfBJFTs.js",
			"/assets/app-data-Bd_LRbsZ.js",
			"/assets/use-auth-CxoT4_sS.js",
			"/assets/BulkScanModal-B46hLdEC.js",
			"/assets/use-order-nav-count-CspBz7yM.js"
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
			"/assets/route-D1U4BZ9u.js",
			"/assets/useLocation-CqfBJFTs.js",
			"/assets/app-data-Bd_LRbsZ.js",
			"/assets/panel-bootstrap-2XoLoAKp.js",
			"/assets/use-auth-CxoT4_sS.js",
			"/assets/impersonation-DqYT-Fbf.js",
			"/assets/reseller-status-BRiEAbFB.js",
			"/assets/use-order-nav-count-CspBz7yM.js",
			"/assets/use-verification-CT5zFIKL.js",
			"/assets/impersonation-banner-0beipG4X.js"
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
			"/assets/route-B8wREP4t.js",
			"/assets/app-data-Bd_LRbsZ.js",
			"/assets/use-auth-CxoT4_sS.js",
			"/assets/supplier-D_ScdKrD.js",
			"/assets/use-order-nav-count-CspBz7yM.js",
			"/assets/use-verification-CT5zFIKL.js",
			"/assets/impersonation-banner-0beipG4X.js",
			"/assets/supplier-context-BU7JZggX.js"
		]
	},
	"/_authenticated/dashboard": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/dashboard.tsx",
		children: void 0,
		preloads: [
			"/assets/dashboard-Dp8GoZdN.js",
			"/assets/use-auth-CxoT4_sS.js",
			"/assets/use-verification-CT5zFIKL.js"
		]
	},
	"/_authenticated/onboarding": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/onboarding.tsx",
		children: void 0,
		preloads: [
			"/assets/onboarding-CQM7Qg4L.js",
			"/assets/app-data-Bd_LRbsZ.js",
			"/assets/use-auth-CxoT4_sS.js",
			"/assets/impersonation-DqYT-Fbf.js",
			"/assets/reseller-status-BRiEAbFB.js",
			"/assets/use-verification-CT5zFIKL.js"
		]
	},
	"/_authenticated/verify": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/verify.tsx",
		children: void 0,
		preloads: [
			"/assets/verify--_jFkk5f.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/use-verification-CT5zFIKL.js",
			"/assets/verification.functions-C3G5n4Nd.js"
		]
	},
	"/catalog/$slug": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/catalog.$slug.tsx",
		children: void 0,
		preloads: [
			"/assets/catalog._slug-C_6X6UmE.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/app-data-Bd_LRbsZ.js",
			"/assets/finance-report-qe_22IXp.js",
			"/assets/image-picker-Cv-Ugsrl.js",
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
			"/assets/s._code-C4SYPsWS.js",
			"/assets/useRouterState-BXSk1kiY.js",
			"/assets/ui-9QYF7RVO.js",
			"/assets/store-content-DR8qgnfq.js",
			"/assets/store-menu-BKBuCF61.js",
			"/assets/store-visits-DiJinEtp.js"
		]
	},
	"/catalog/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/catalog.index.tsx",
		children: void 0,
		preloads: [
			"/assets/catalog.index-1YcE7N6t.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/finance-report-qe_22IXp.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/product-code-TFzlCYgt.js",
			"/assets/image-picker-Cv-Ugsrl.js",
			"/assets/catalog.functions-pYBF3FyA.js"
		]
	},
	"/_authenticated/admin/advanced": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/advanced.tsx",
		children: void 0,
		preloads: [
			"/assets/advanced-LpphzVpH.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/advanced-settings-CD-_SUu1.js",
			"/assets/deposit-settings-Cl9AE9o2.js"
		]
	},
	"/_authenticated/admin/agent-payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/agent-payouts.tsx",
		children: void 0,
		preloads: [
			"/assets/agent-payouts-CW1jIMH1.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/searchable-select-BSxHsJv_.js",
			"/assets/ledger-timeline-BXHHTSOS.js",
			"/assets/agents-Doj_O739.js"
		]
	},
	"/_authenticated/admin/agent-report": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/agent-report.tsx",
		children: void 0,
		preloads: [
			"/assets/agent-report-Bta5QSBR.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/searchable-select-BSxHsJv_.js",
			"/assets/agents-Doj_O739.js",
			"/assets/date-range-filter-ChzayhKq.js"
		]
	},
	"/_authenticated/admin/agents": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/agents.tsx",
		children: void 0,
		preloads: [
			"/assets/agents-DBMg1Vmd.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/agents-Doj_O739.js",
			"/assets/auth-middleware-CGnA8W5w.js"
		]
	},
	"/_authenticated/admin/brands": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/brands.tsx",
		children: void 0,
		preloads: [
			"/assets/brands-BtUc49TQ.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/ImageUploader-BKwwzuRI.js"
		]
	},
	"/_authenticated/admin/business-report": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/business-report.tsx",
		children: void 0,
		preloads: [
			"/assets/business-report-C1E6u1yB.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/finance-report-qe_22IXp.js",
			"/assets/agents-Doj_O739.js",
			"/assets/order-filters-_H2RpFyN.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/report-blocks-DF9P0tCk.js",
			"/assets/reseller-avatar-CbTfdTEo.js",
			"/assets/business-report-dRRUAwfh.js"
		]
	},
	"/_authenticated/admin/categories": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/categories.tsx",
		children: void 0,
		preloads: [
			"/assets/categories-D2LKYEgz.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/ImageUploader-BKwwzuRI.js"
		]
	},
	"/_authenticated/admin/commissions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/commissions.tsx",
		children: void 0,
		preloads: ["/assets/commissions-BJTCTQ4Y.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/admin/couriers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/couriers.tsx",
		children: void 0,
		preloads: [
			"/assets/couriers-CAuG3Qea.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/courier-brand-BcHzAJqY.js"
		]
	},
	"/_authenticated/admin/customers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/customers.tsx",
		children: void 0,
		preloads: [
			"/assets/customers-DWEtpMgn.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/customers-report-QAymMz7I.js"
		]
	},
	"/_authenticated/admin/deposit-transactions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/deposit-transactions.tsx",
		children: void 0,
		preloads: [
			"/assets/deposit-transactions-RWq0HRpz.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/deposit-ledger-C1YpYlH8.js",
			"/assets/payment-methods-t5YgZguV.js",
			"/assets/deposit-pay-panel-pP2j8fp3.js"
		]
	},
	"/_authenticated/admin/domains": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/domains.tsx",
		children: void 0,
		preloads: [
			"/assets/domains-CoWzJwyy.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/cloudflare.functions-CHxvdoUB.js"
		]
	},
	"/_authenticated/admin/expenses": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/expenses.tsx",
		children: void 0,
		preloads: [
			"/assets/expenses-C_GKtZB0.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/finance-report-qe_22IXp.js",
			"/assets/order-filters-_H2RpFyN.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/report-blocks-DF9P0tCk.js",
			"/assets/business-report-dRRUAwfh.js"
		]
	},
	"/_authenticated/admin/landing": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/landing.tsx",
		children: void 0,
		preloads: [
			"/assets/landing-CdMb1kJu.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/ImageUploader-BKwwzuRI.js",
			"/assets/icons-CzsQNHhg.js",
			"/assets/tabs-4Ugcp-Dh.js"
		]
	},
	"/_authenticated/admin/maintenance": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/maintenance.tsx",
		children: void 0,
		preloads: [
			"/assets/maintenance-BsfAe3YB.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/auth-middleware-CGnA8W5w.js"
		]
	},
	"/_authenticated/admin/marketing": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/marketing.tsx",
		children: void 0,
		preloads: ["/assets/marketing-CG26jRaf.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/admin/media": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/media.tsx",
		children: void 0,
		preloads: [
			"/assets/media-D_jnkqD7.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/button-kNZ4kbD4.js",
			"/assets/data-list-C50cjcnV.js"
		]
	},
	"/_authenticated/admin/notices": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/notices.tsx",
		children: void 0,
		preloads: [
			"/assets/notices-Bb__HDQY.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/admin-notices-1B0kQE9o.js"
		]
	},
	"/_authenticated/admin/notifications": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/notifications.tsx",
		children: void 0,
		preloads: [
			"/assets/notifications-BjhbhK_H.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/auth-middleware-CGnA8W5w.js"
		]
	},
	"/_authenticated/admin/orders": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/orders.tsx",
		children: void 0,
		preloads: [
			"/assets/orders-_w9DTC5O.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/order-search-DxmG0hib.js",
			"/assets/CourierTimeline-CtrAjlyP.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/finance-report-qe_22IXp.js",
			"/assets/searchable-select-BSxHsJv_.js",
			"/assets/order-filters-_H2RpFyN.js",
			"/assets/dropdown-menu-DSacuumd.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/business-report-dRRUAwfh.js",
			"/assets/courier-brand-BcHzAJqY.js",
			"/assets/bootstrap-BC6OB9xr.js",
			"/assets/NewOrderModal-DJGtsIV5.js",
			"/assets/CopyOrderNumber-DogaLF_B.js",
			"/assets/labels-yV5XJMQa.js",
			"/assets/price-breakdown-YlzoVXZB.js"
		]
	},
	"/_authenticated/admin/payments": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/payments.tsx",
		children: void 0,
		preloads: [
			"/assets/payments-_bCFSoRj.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/payment-methods-t5YgZguV.js",
			"/assets/payment-brand-DxxvN5fA.js",
			"/assets/AppModal-CkrLeEe4.js",
			"/assets/gateway-grid-D9Jj7yd3.js"
		]
	},
	"/_authenticated/admin/payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/payouts.tsx",
		children: void 0,
		preloads: [
			"/assets/payouts-DfDbaB0b.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/searchable-select-BSxHsJv_.js",
			"/assets/data-list-C50cjcnV.js"
		]
	},
	"/_authenticated/admin/policies": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/policies.tsx",
		children: void 0,
		preloads: [
			"/assets/policies-DsQBnkw3.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/AppModal-CkrLeEe4.js"
		]
	},
	"/_authenticated/admin/privacy": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/privacy.tsx",
		children: void 0,
		preloads: [
			"/assets/privacy-MgZv6n-c.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/RichTextEditor-CVTdC9ZH.js"
		]
	},
	"/_authenticated/admin/resellers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/resellers.tsx",
		children: void 0,
		preloads: [
			"/assets/resellers-CCCpWZwW.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/advanced-settings-CD-_SUu1.js",
			"/assets/searchable-select-BSxHsJv_.js",
			"/assets/auth-middleware-CGnA8W5w.js",
			"/assets/dropdown-menu-DSacuumd.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/reseller-avatar-CbTfdTEo.js",
			"/assets/deposit-ledger-C1YpYlH8.js",
			"/assets/admin-users.functions-Csoom9cK.js",
			"/assets/impersonation-DqYT-Fbf.js",
			"/assets/reseller-status-BRiEAbFB.js",
			"/assets/ResellerProfile-C49de4xQ.js",
			"/assets/password-reset-modal-CwO3e-5a.js"
		]
	},
	"/_authenticated/admin/settings": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/settings.tsx",
		children: void 0,
		preloads: [
			"/assets/settings-BK97XAbO.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/ImageUploader-BKwwzuRI.js"
		]
	},
	"/_authenticated/admin/staff": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/staff.tsx",
		children: void 0,
		preloads: [
			"/assets/staff-Dq6tiDp7.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/auth-middleware-CGnA8W5w.js",
			"/assets/dist-Bm7eTr0L.js",
			"/assets/dropdown-menu-DSacuumd.js",
			"/assets/tabs-4Ugcp-Dh.js",
			"/assets/admin-users.functions-Csoom9cK.js"
		]
	},
	"/_authenticated/admin/subscriptions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/subscriptions.tsx",
		children: void 0,
		preloads: [
			"/assets/subscriptions-BZ-yVLNV.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/finance-report-qe_22IXp.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/AppModal-CkrLeEe4.js"
		]
	},
	"/_authenticated/admin/supplier-payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/supplier-payouts.tsx",
		children: void 0,
		preloads: [
			"/assets/supplier-payouts-jundg9Ss.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/supplier-D_ScdKrD.js",
			"/assets/status-tabs-DOHqUL2P.js"
		]
	},
	"/_authenticated/admin/supplier-report": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/supplier-report.tsx",
		children: void 0,
		preloads: [
			"/assets/supplier-report-fxIQS926.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/CopyOrderNumber-DogaLF_B.js",
			"/assets/supplier-D_ScdKrD.js",
			"/assets/supplier-report-summary-SVuz9oud.js"
		]
	},
	"/_authenticated/admin/supplier-returns": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/supplier-returns.tsx",
		children: void 0,
		preloads: [
			"/assets/supplier-returns-DRwkd8xH.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/searchable-select-BSxHsJv_.js",
			"/assets/button-kNZ4kbD4.js",
			"/assets/CopyOrderNumber-DogaLF_B.js",
			"/assets/supplier-D_ScdKrD.js",
			"/assets/impersonation-DqYT-Fbf.js",
			"/assets/supplier-access.functions-C-8X52kK.js"
		]
	},
	"/_authenticated/admin/suppliers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/suppliers.tsx",
		children: void 0,
		preloads: [
			"/assets/suppliers-DiDvCtkr.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/dropdown-menu-DSacuumd.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/reseller-avatar-CbTfdTEo.js",
			"/assets/supplier-D_ScdKrD.js",
			"/assets/impersonation-DqYT-Fbf.js",
			"/assets/password-reset-modal-CwO3e-5a.js",
			"/assets/supplier-access.functions-C-8X52kK.js"
		]
	},
	"/_authenticated/admin/transactions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/transactions.tsx",
		children: void 0,
		preloads: ["/assets/transactions-CeaB2EpY.js", "/assets/transaction-report-B9H4h2Ev.js"]
	},
	"/_authenticated/admin/tutorials": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/tutorials.tsx",
		children: void 0,
		preloads: [
			"/assets/tutorials-BGENHArJ.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/AppModal-CkrLeEe4.js",
			"/assets/tutorials-RoCwbAHW.js"
		]
	},
	"/_authenticated/admin/visitors": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/visitors.tsx",
		children: void 0,
		preloads: [
			"/assets/visitors-DN9W6ZYW.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/searchable-select-BSxHsJv_.js",
			"/assets/store-visits-report-DZkI8XvE.js"
		]
	},
	"/_authenticated/reseller/catalog": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/catalog.tsx",
		children: void 0,
		preloads: [
			"/assets/catalog-DFA6eVc4.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/advanced-settings-CD-_SUu1.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/product-code-TFzlCYgt.js",
			"/assets/price-breakdown-YlzoVXZB.js",
			"/assets/Hint-BDdaji1G.js",
			"/assets/reseller-tools-CC-ImpRO.js",
			"/assets/image-picker-Cv-Ugsrl.js"
		]
	},
	"/_authenticated/reseller/commissions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/commissions.tsx",
		children: void 0,
		preloads: ["/assets/commissions-qL7tHOf_.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/reseller/customers": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/customers.tsx",
		children: void 0,
		preloads: [
			"/assets/customers-Ca-TWHxy.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/customers-report-QAymMz7I.js"
		]
	},
	"/_authenticated/reseller/domain": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/domain.tsx",
		children: void 0,
		preloads: [
			"/assets/domain-D8TWLTk0.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/cloudflare.functions-CHxvdoUB.js"
		]
	},
	"/_authenticated/reseller/listings": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/listings.tsx",
		children: void 0,
		preloads: [
			"/assets/listings-CkUJE42J.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/dropdown-menu-DSacuumd.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/product-code-TFzlCYgt.js",
			"/assets/reseller-tools-CC-ImpRO.js"
		]
	},
	"/_authenticated/reseller/marketing": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/marketing.tsx",
		children: void 0,
		preloads: ["/assets/marketing-DRNsonsi.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/reseller/menus": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/menus.tsx",
		children: void 0,
		preloads: [
			"/assets/menus-BVgOaE-R.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/ImageUploader-BKwwzuRI.js",
			"/assets/bootstrap-BC6OB9xr.js",
			"/assets/store-menu-BKBuCF61.js"
		]
	},
	"/_authenticated/reseller/orders": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/orders.tsx",
		children: ["/_authenticated/reseller/orders/$id/invoice"],
		preloads: [
			"/assets/orders-DkThHhYt.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/order-search-DxmG0hib.js",
			"/assets/CourierTimeline-CtrAjlyP.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/finance-report-qe_22IXp.js",
			"/assets/deposit-settings-Cl9AE9o2.js",
			"/assets/order-filters-_H2RpFyN.js",
			"/assets/dropdown-menu-DSacuumd.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/business-report-dRRUAwfh.js",
			"/assets/courier-brand-BcHzAJqY.js",
			"/assets/NewOrderModal-DJGtsIV5.js",
			"/assets/CopyOrderNumber-DogaLF_B.js",
			"/assets/deposit-D3Roet9c.js"
		]
	},
	"/_authenticated/reseller/payments": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/payments.tsx",
		children: void 0,
		preloads: [
			"/assets/payments-H9ttLpq_.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/bootstrap-BC6OB9xr.js",
			"/assets/payment-methods-t5YgZguV.js",
			"/assets/gateways.functions-BbLvNXIt.js",
			"/assets/payment-brand-DxxvN5fA.js",
			"/assets/AppModal-CkrLeEe4.js",
			"/assets/gateway-grid-D9Jj7yd3.js"
		]
	},
	"/_authenticated/reseller/payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/payouts.tsx",
		children: void 0,
		preloads: [
			"/assets/payouts-DtzZhCfb.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/deposit-settings-Cl9AE9o2.js",
			"/assets/ledger-timeline-BXHHTSOS.js",
			"/assets/report-blocks-DF9P0tCk.js",
			"/assets/deposit-pay-panel-pP2j8fp3.js",
			"/assets/deposit-D3Roet9c.js",
			"/assets/deposit-notice-_T8hXN-_.js"
		]
	},
	"/_authenticated/reseller/policies": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/policies.tsx",
		children: void 0,
		preloads: ["/assets/policies-CpSpLH0q.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/reseller/profile": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/profile.tsx",
		children: void 0,
		preloads: [
			"/assets/profile-Cc_OVZzE.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/ImageUploader-BKwwzuRI.js",
			"/assets/reseller-avatar-CbTfdTEo.js",
			"/assets/ResellerProfile-C49de4xQ.js"
		]
	},
	"/_authenticated/reseller/settings": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/settings.tsx",
		children: void 0,
		preloads: [
			"/assets/settings-BMxZgW18.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/ImageUploader-BKwwzuRI.js",
			"/assets/bootstrap-BC6OB9xr.js"
		]
	},
	"/_authenticated/reseller/subscription": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/subscription.tsx",
		children: void 0,
		preloads: [
			"/assets/subscription-Bnw6lBHv.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/finance-report-qe_22IXp.js",
			"/assets/payment-methods-t5YgZguV.js",
			"/assets/AppModal-CkrLeEe4.js"
		]
	},
	"/_authenticated/reseller/support": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/support.tsx",
		children: void 0,
		preloads: ["/assets/support-DA6cjBTR.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/reseller/theme": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/theme.tsx",
		children: void 0,
		preloads: [
			"/assets/theme-YjcsuJ3a.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/ImageUploader-BKwwzuRI.js",
			"/assets/bootstrap-BC6OB9xr.js",
			"/assets/store-content-DR8qgnfq.js"
		]
	},
	"/_authenticated/reseller/transactions": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/transactions.tsx",
		children: void 0,
		preloads: ["/assets/transactions-C6KTFUT9.js", "/assets/transaction-report-B9H4h2Ev.js"]
	},
	"/_authenticated/reseller/tutorials": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/tutorials.tsx",
		children: void 0,
		preloads: [
			"/assets/tutorials-L6C8LgJ2.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/tutorial-library-eD7JZKU6.js"
		]
	},
	"/_authenticated/reseller/visitors": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/visitors.tsx",
		children: void 0,
		preloads: [
			"/assets/visitors-D2X3ZyeS.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/store-visits-report-DZkI8XvE.js"
		]
	},
	"/_authenticated/supplier/media": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/media.tsx",
		children: void 0,
		preloads: [
			"/assets/media-C4-8eVgo.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/button-kNZ4kbD4.js",
			"/assets/data-list-C50cjcnV.js"
		]
	},
	"/_authenticated/supplier/orders": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/orders.tsx",
		children: void 0,
		preloads: [
			"/assets/orders-Cf6GURGb.js",
			"/assets/order-search-DxmG0hib.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/order-filters-_H2RpFyN.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/courier-brand-BcHzAJqY.js",
			"/assets/BulkScanModal-B46hLdEC.js",
			"/assets/CopyOrderNumber-DogaLF_B.js",
			"/assets/labels-yV5XJMQa.js"
		]
	},
	"/_authenticated/supplier/payouts": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/payouts.tsx",
		children: void 0,
		preloads: ["/assets/payouts-BCqx1Jnh.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/supplier/products": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/products.tsx",
		children: void 0,
		preloads: [
			"/assets/products-tgykdvVo.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/searchable-select-BSxHsJv_.js",
			"/assets/dropdown-menu-DSacuumd.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/ImageUploader-BKwwzuRI.js",
			"/assets/AppModal-CkrLeEe4.js",
			"/assets/RichTextEditor-CVTdC9ZH.js",
			"/assets/Hint-BDdaji1G.js",
			"/assets/product-import-DOX4eUTU.js"
		]
	},
	"/_authenticated/supplier/profile": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/profile.tsx",
		children: void 0,
		preloads: ["/assets/profile-BWOAYSpK.js", "/assets/ui-kit-BVs9kwTJ.js"]
	},
	"/_authenticated/supplier/report": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/report.tsx",
		children: void 0,
		preloads: [
			"/assets/report-BW_ed0Ro.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/CopyOrderNumber-DogaLF_B.js",
			"/assets/status-tabs-DOHqUL2P.js",
			"/assets/supplier-report-summary-SVuz9oud.js"
		]
	},
	"/_authenticated/supplier/returns": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/returns.tsx",
		children: void 0,
		preloads: [
			"/assets/returns-CeEf7ADV.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/CopyOrderNumber-DogaLF_B.js",
			"/assets/status-tabs-DOHqUL2P.js"
		]
	},
	"/s/$code/checkout": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.checkout.tsx",
		children: void 0,
		preloads: [
			"/assets/s._code.checkout-Dq2vJcEp.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/app-data-Bd_LRbsZ.js",
			"/assets/advanced-settings-CD-_SUu1.js",
			"/assets/gateways.functions-BbLvNXIt.js",
			"/assets/payment-brand-DxxvN5fA.js",
			"/assets/checkout-validate-Bep8wCSp.js"
		]
	},
	"/s/$code/thanks": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.thanks.tsx",
		children: void 0,
		preloads: [
			"/assets/s._code.thanks-DmH1MgkY.js",
			"/assets/useServerFn-drDRE-t8.js",
			"/assets/gateways.functions-BbLvNXIt.js"
		]
	},
	"/_authenticated/admin/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/index.tsx",
		children: void 0,
		preloads: [
			"/assets/admin-CiC9okaq.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/finance-report-qe_22IXp.js",
			"/assets/date-range-filter-ChzayhKq.js",
			"/assets/bootstrap-BC6OB9xr.js",
			"/assets/NewOrderModal-DJGtsIV5.js"
		]
	},
	"/_authenticated/reseller/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/index.tsx",
		children: void 0,
		preloads: [
			"/assets/reseller-CvrHqsac.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/finance-report-qe_22IXp.js",
			"/assets/date-range-filter-ChzayhKq.js",
			"/assets/report-blocks-DF9P0tCk.js",
			"/assets/bootstrap-BC6OB9xr.js",
			"/assets/payment-methods-t5YgZguV.js",
			"/assets/payment-brand-DxxvN5fA.js",
			"/assets/NewOrderModal-DJGtsIV5.js",
			"/assets/admin-notices-1B0kQE9o.js",
			"/assets/deposit-D3Roet9c.js",
			"/assets/deposit-notice-_T8hXN-_.js"
		]
	},
	"/_authenticated/supplier/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/supplier/index.tsx",
		children: void 0,
		preloads: [
			"/assets/supplier-7qQCIZ6Z.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/report-blocks-DF9P0tCk.js",
			"/assets/CopyOrderNumber-DogaLF_B.js"
		]
	},
	"/s/$code/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.index.tsx",
		children: void 0,
		preloads: ["/assets/s._code.index-BzN0XHrG.js"]
	},
	"/_authenticated/admin/products/new": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/products.new.tsx",
		children: void 0,
		preloads: [
			"/assets/products.new-NtAq2ySv.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/advanced-settings-CD-_SUu1.js",
			"/assets/searchable-select-BSxHsJv_.js",
			"/assets/ImageUploader-BKwwzuRI.js",
			"/assets/price-breakdown-YlzoVXZB.js",
			"/assets/RichTextEditor-CVTdC9ZH.js",
			"/assets/slug-D4-Re8S0.js",
			"/assets/Hint-BDdaji1G.js",
			"/assets/product-import-DOX4eUTU.js",
			"/assets/ProductImportModal-D-aJlpEc.js"
		]
	},
	"/s/$code/c/$slug": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.c.$slug.tsx",
		children: void 0,
		preloads: ["/assets/s._code.c._slug-ClL6HKAy.js"]
	},
	"/s/$code/p/$slug": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/s.$code.p.$slug.tsx",
		children: void 0,
		preloads: [
			"/assets/s._code.p._slug-Jm8wi04o.js",
			"/assets/app-data-Bd_LRbsZ.js",
			"/assets/product-code-TFzlCYgt.js",
			"/assets/reseller-tools-CC-ImpRO.js"
		]
	},
	"/_authenticated/admin/products/": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/products.index.tsx",
		children: void 0,
		preloads: [
			"/assets/products.index-MrWhg6Vg.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/advanced-settings-CD-_SUu1.js",
			"/assets/button-kNZ4kbD4.js",
			"/assets/dropdown-menu-DSacuumd.js",
			"/assets/data-list-C50cjcnV.js",
			"/assets/AppModal-CkrLeEe4.js",
			"/assets/reseller-tools-CC-ImpRO.js",
			"/assets/ProductImportModal-D-aJlpEc.js",
			"/assets/supplier-D_ScdKrD.js"
		]
	},
	"/_authenticated/admin/products/$id/edit": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/admin/products.$id.edit.tsx",
		children: void 0,
		preloads: [
			"/assets/products._id.edit-Bg5PZxuU.js",
			"/assets/ui-kit-BVs9kwTJ.js",
			"/assets/searchable-select-BSxHsJv_.js",
			"/assets/ImageUploader-BKwwzuRI.js",
			"/assets/price-breakdown-YlzoVXZB.js",
			"/assets/RichTextEditor-CVTdC9ZH.js",
			"/assets/slug-D4-Re8S0.js",
			"/assets/Hint-BDdaji1G.js"
		]
	},
	"/_authenticated/reseller/orders/$id/invoice": {
		filePath: "C:/Users/Jahid Hasan/Documents/VS CODE/resellseba-main/src/routes/_authenticated/reseller/orders.$id.invoice.tsx",
		children: void 0,
		preloads: ["/assets/orders._id.invoice-CKSdVNth.js"]
	}
} });
//#endregion
export { tsrStartManifest };
