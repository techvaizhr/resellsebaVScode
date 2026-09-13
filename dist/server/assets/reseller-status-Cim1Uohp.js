//#region src/lib/reseller-status.ts
var RESELLER_STATUS_LABEL = {
	pending: "Pending approval",
	active: "Active",
	suspended: "Inactive",
	rejected: "Rejected"
};
var RESELLER_STATUS_CLASS = {
	active: "bg-success/15 text-success",
	pending: "bg-warning/20 text-warning-foreground",
	suspended: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
	rejected: "bg-destructive/15 text-destructive"
};
function resellerStatusLabel(status) {
	return RESELLER_STATUS_LABEL[status ?? ""] ?? "Unknown";
}
function resellerStatusClass(status) {
	return RESELLER_STATUS_CLASS[status ?? ""] ?? "bg-muted text-muted-foreground";
}
/** Panel access is granted only while the account is active. */
function canAccessResellerPanel(status) {
	return status === "active";
}
/**
* Status transitions offered in the 3-dot menu. `autoApprove` only changes the
* wording of the approve action — an admin can always deactivate or reject.
*/
function resellerStatusActions(current, autoApprove) {
	switch (current) {
		case "pending": return [{
			status: "active",
			label: autoApprove ? "Activate now" : "Approve access"
		}, {
			status: "rejected",
			label: "Reject application",
			tone: "danger"
		}];
		case "active": return [{
			status: "suspended",
			label: "Deactivate access",
			tone: "danger"
		}, {
			status: "rejected",
			label: "Reject application",
			tone: "danger"
		}];
		case "suspended": return [{
			status: "active",
			label: "Reactivate access"
		}, {
			status: "rejected",
			label: "Reject application",
			tone: "danger"
		}];
		case "rejected": return [{
			status: "active",
			label: "Activate access"
		}, {
			status: "pending",
			label: "Move back to pending"
		}];
		default: return [];
	}
}
//#endregion
export { resellerStatusLabel as i, resellerStatusActions as n, resellerStatusClass as r, canAccessResellerPanel as t };
