//#region src/lib/permissions.ts
var PERMISSION_GROUPS = [
	{
		key: "dashboard",
		label: "Dashboard",
		permissions: [{
			key: "dashboard.view",
			label: "View dashboard",
			description: "Open the admin dashboard and its summary cards",
			view: true
		}]
	},
	{
		key: "catalog",
		label: "Catalog",
		permissions: [
			{
				key: "products.view",
				label: "View products",
				description: "Open the product list and product details",
				view: true
			},
			{
				key: "products.manage",
				label: "Add / edit products",
				description: "Create products, edit them and use inline editing"
			},
			{
				key: "products.delete",
				label: "Delete products",
				description: "Delete products (single and bulk)"
			},
			{
				key: "brands.manage",
				label: "Manage brands",
				description: "Create, edit and delete brands"
			},
			{
				key: "categories.manage",
				label: "Manage categories",
				description: "Create, edit and delete categories"
			}
		]
	},
	{
		key: "orders",
		label: "Orders",
		permissions: [
			{
				key: "orders.view",
				label: "View orders",
				description: "Open the order list, order details and invoices",
				view: true
			},
			{
				key: "orders.create",
				label: "Create orders",
				description: "Add new orders from the admin panel"
			},
			{
				key: "orders.edit",
				label: "Edit orders",
				description: "Edit order items, customer info and notes"
			},
			{
				key: "orders.status",
				label: "Change order status",
				description: "Single and bulk status changes, including bulk scan"
			},
			{
				key: "orders.ship",
				label: "Courier booking",
				description: "Book couriers, print labels and manage shipments"
			},
			{
				key: "orders.settle",
				label: "Settle orders",
				description: "Settle delivered / partial / returned orders"
			},
			{
				key: "orders.delete",
				label: "Delete orders",
				description: "Delete orders (single and bulk)"
			}
		]
	},
	{
		key: "customers",
		label: "Customers",
		permissions: [{
			key: "customers.view",
			label: "View customers",
			description: "Open the customers report",
			view: true
		}]
	},
	{
		key: "finance",
		label: "Finance",
		permissions: [
			{
				key: "finance.view",
				label: "View finance",
				description: "Transaction report and deposit transactions",
				view: true
			},
			{
				key: "reports.view",
				label: "View business reports",
				description: "Business report and advanced sales reports",
				view: true
			},
			{
				key: "expenses.manage",
				label: "Manage expenses",
				description: "Add, edit and delete business expenses"
			},
			{
				key: "payouts.manage",
				label: "Manage payouts",
				description: "Approve, reject and pay reseller payouts"
			},
			{
				key: "commissions.manage",
				label: "Manage commissions",
				description: "Manage leader commissions and payments"
			},
			{
				key: "deposits.manage",
				label: "Manage deposits",
				description: "Reseller security deposits and deposit requests"
			}
		]
	},
	{
		key: "subscriptions",
		label: "Subscriptions",
		permissions: [{
			key: "subscriptions.view",
			label: "View subscriptions",
			description: "Plans, subscribers and subscription revenue",
			view: true
		}, {
			key: "subscriptions.manage",
			label: "Manage subscriptions",
			description: "Edit plans, change a reseller's plan and approve subscription payments"
		}]
	},
	{
		key: "resellers",
		label: "Resellers",
		permissions: [{
			key: "resellers.manage",
			label: "Manage resellers",
			description: "Approve, edit, suspend and delete reseller accounts"
		}, {
			key: "resellers.impersonate",
			label: "Login as reseller",
			description: "Open a reseller panel as that reseller"
		}]
	},
	{
		key: "suppliers",
		label: "Suppliers",
		permissions: [{
			key: "suppliers.view",
			label: "View suppliers",
			description: "Supplier accounts, supplier report and returns",
			view: true
		}, {
			key: "suppliers.manage",
			label: "Manage suppliers",
			description: "Approve suppliers, hand over returns and pay supplier payouts"
		}]
	},
	{
		key: "agents",
		label: "Agents",
		permissions: [{
			key: "agents.view",
			label: "View agent report",
			description: "Open the commission agent report",
			view: true
		}, {
			key: "agents.manage",
			label: "Manage agents",
			description: "Create agents, assign resellers and pay commissions"
		}]
	},
	{
		key: "visitors",
		label: "Store visitors",
		permissions: [{
			key: "visitors.view",
			label: "View store visitors",
			description: "Open the store visitor report",
			view: true
		}]
	},
	{
		key: "growth",
		label: "Growth",
		permissions: [
			{
				key: "marketing.manage",
				label: "Manage marketing",
				description: "Pixels, ads and conversion API settings"
			},
			{
				key: "notifications.manage",
				label: "Manage notifications",
				description: "Email / SMS notification providers and templates"
			},
			{
				key: "notices.manage",
				label: "Manage reseller notices",
				description: "Create and publish notices shown to resellers"
			},
			{
				key: "tutorials.manage",
				label: "Manage tutorials",
				description: "Manage tutorial topics and videos"
			},
			{
				key: "policies.manage",
				label: "Manage reseller policies",
				description: "Write the policy points shown in the reseller panel"
			}
		]
	},
	{
		key: "system",
		label: "System",
		permissions: [
			{
				key: "landing.manage",
				label: "Manage landing page",
				description: "Edit landing page content and sections"
			},
			{
				key: "couriers.manage",
				label: "Manage couriers",
				description: "Courier credentials, stores and settings"
			},
			{
				key: "payments.manage",
				label: "Manage payment methods",
				description: "Manual methods and automatic payment gateways"
			},
			{
				key: "staff.manage",
				label: "Manage staff & roles",
				description: "Create staff accounts, roles and permissions"
			},
			{
				key: "domains.manage",
				label: "Manage custom domains",
				description: "Custom domain and DNS configuration"
			},
			{
				key: "maintenance.manage",
				label: "Cache & cleanup",
				description: "Run cleanup and maintenance tools"
			},
			{
				key: "settings.advanced",
				label: "Advanced settings",
				description: "Change advanced system behaviour"
			},
			{
				key: "settings.manage",
				label: "Global settings",
				description: "Site branding, privacy policy and global settings"
			}
		]
	}
];
var ALL_PERMISSIONS = PERMISSION_GROUPS.flatMap((g) => g.permissions);
Object.fromEntries(ALL_PERMISSIONS.map((p, i) => [p.key, i]));
Object.fromEntries(PERMISSION_GROUPS.flatMap((g) => g.permissions.map((p) => [p.key, {
	key: g.key,
	label: g.label
}])));
/** Any one of the listed permissions opens the route. */
var ROUTE_PERMISSIONS = {
	"/admin": ["dashboard.view"],
	"/admin/products": ["products.view", "products.manage"],
	"/admin/brands": ["brands.manage"],
	"/admin/categories": ["categories.manage"],
	"/admin/orders": [
		"orders.view",
		"orders.edit",
		"orders.create",
		"orders.delete",
		"orders.status",
		"orders.ship",
		"orders.settle"
	],
	"/admin/customers": [
		"customers.view",
		"orders.view",
		"reports.view"
	],
	"/admin/transactions": ["finance.view"],
	"/admin/business-report": ["reports.view"],
	"/admin/expenses": [
		"expenses.manage",
		"finance.view",
		"reports.view"
	],
	"/admin/payouts": ["payouts.manage"],
	"/admin/commissions": ["commissions.manage"],
	"/admin/subscriptions": ["subscriptions.view", "subscriptions.manage"],
	"/admin/resellers": ["resellers.manage"],
	"/admin/suppliers": ["suppliers.view", "suppliers.manage"],
	"/admin/supplier-report": [
		"suppliers.view",
		"suppliers.manage",
		"reports.view"
	],
	"/admin/supplier-returns": ["suppliers.view", "suppliers.manage"],
	"/admin/supplier-payouts": ["suppliers.manage", "payouts.manage"],
	"/admin/agents": ["agents.manage"],
	"/admin/agent-report": ["agents.view", "agents.manage"],
	"/admin/agent-payouts": ["agents.manage", "payouts.manage"],
	"/admin/visitors": ["visitors.view", "reports.view"],
	"/admin/marketing": ["marketing.manage"],
	"/admin/notifications": ["notifications.manage"],
	"/admin/notices": ["notices.manage"],
	"/admin/tutorials": ["tutorials.manage"],
	"/admin/landing": ["landing.manage"],
	"/admin/couriers": ["couriers.manage"],
	"/admin/payments": ["payments.manage"],
	"/admin/staff": ["staff.manage"],
	"/admin/maintenance": ["maintenance.manage"],
	"/admin/backup": ["maintenance.manage", "settings.manage"],
	"/admin/advanced": ["settings.advanced", "settings.manage"],
	"/admin/domains": ["domains.manage"],
	"/admin/deposits": ["deposits.manage"],
	"/admin/deposit-transactions": ["deposits.manage", "finance.view"],
	"/admin/settings": ["settings.manage"],
	"/admin/privacy": ["settings.manage"],
	"/admin/policies": ["policies.manage", "settings.manage"]
};
//#endregion
export { ROUTE_PERMISSIONS as n, PERMISSION_GROUPS as t };
