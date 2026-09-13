import { t as createServerFn } from "./createServerFn-CIHAFgYl.js";
import { d as PERMISSION_GROUPS, s as createSsrRpc } from "./client-BpJCBCUq.js";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.js";
import { t as requireSupabaseAuth } from "./auth-middleware-D4xjf72S.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { a as DialogFooter, i as DialogDescription, n as Dialog, o as DialogHeader, r as DialogContent, s as DialogTitle, t as ConfirmModal } from "./ConfirmModal-CPm0pZdA.js";
import { n as useAuth } from "./use-auth-BPiZPMVq.js";
import { n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-BtjXROHi.js";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.js";
import { i as listStaffUsers, n as deleteAuthUser } from "./admin-users.functions-Dq_Ao7pg.js";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { z } from "zod";
import { toast } from "sonner";
import { Check, ChevronDown, ChevronUp, Eye, EyeOff, KeyRound, Loader2, Mail, MoreHorizontal, Pencil, Phone, Plus, Save, Shield, Trash2, UserPlus } from "lucide-react";
import { cva } from "class-variance-authority";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as SelectPrimitive from "@radix-ui/react-select";
//#region src/lib/user-management.functions.ts
var createUserInput = z.object({
	email: z.string().email(),
	password: z.string().min(6),
	fullName: z.string().min(2),
	phone: z.string().optional().nullable(),
	role: z.string()
});
var createAdminUser = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => createUserInput.parse(d)).handler(createSsrRpc("3a50e23ae2b20d88409e8a62e7626f41b7e47f3f6ee2a5a806856ef3b1c0b9f2"));
var updatePasswordInput = z.object({
	userId: z.string().min(1),
	password: z.string().min(6)
});
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => updatePasswordInput.parse(d)).handler(createSsrRpc("a5de8b020430b7345a07814f917cefc9f643090a71a3becd5e4f611c50f9d888"));
var updateRoleInput = z.object({
	userId: z.string().min(1),
	role: z.string()
});
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => updateRoleInput.parse(d)).handler(createSsrRpc("b1692f83eddd1d94d500e5008624c86decb80d533d3107b5819fdcc9069fcba5"));
var updateAccountInput = z.object({
	userId: z.string().min(1),
	email: z.string().email(),
	fullName: z.string().min(2),
	phone: z.string().optional().nullable(),
	role: z.string().optional(),
	password: z.string().min(6).max(72).optional()
});
/** One-shot staff account edit: name, email, phone, role and (optionally) a new password. */
var updateAdminUserAccount = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => updateAccountInput.parse(d)).handler(createSsrRpc("19348ddd96363e7d06426e105c0307ed9efe1817718075ff9b76d7d1c68d71cd"));
//#endregion
//#region src/lib/roles-permissions.functions.ts
var getRoles = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("a649084848d150e1b203a2c66abd3fbfae058d55017c2c8f8b69b4fcef3c0d14"));
var getPermissions = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("a7122c479165993c9847f8ed25ac7808c73036e56e6cc39481cd1e8428bb2ae9"));
var saveRoleInput = z.object({
	id: z.string().min(1).optional(),
	name: z.string().min(2),
	description: z.string().optional(),
	permissionIds: z.array(z.string().min(1))
});
var saveRole = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => saveRoleInput.parse(d)).handler(createSsrRpc("7b3562bbc912086c55329f1cccc8e0a1d2108aeaf4fa9fc6cfdb4859cb91413a"));
var deleteRole = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({ id: z.string().min(1) }).parse(d)).handler(createSsrRpc("8fe8ad3eb41b179115dbad77ceb6946368cd1edd70577f36cff92291c6657f25"));
//#endregion
//#region src/components/ui/input.tsx
var Input = React.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ jsx("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
//#endregion
//#region src/components/ui/label.tsx
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(LabelPrimitive.Root, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = LabelPrimitive.Root.displayName;
//#endregion
//#region src/components/ui/select.tsx
var Select = SelectPrimitive.Root;
var SelectValue = SelectPrimitive.Value;
var SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SelectPrimitive.Trigger, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ jsx(SelectPrimitive.Icon, {
		asChild: true,
		children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
var SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.ScrollUpButton, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
var SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.ScrollDownButton, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
var SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(SelectPrimitive.Content, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ jsx(SelectScrollUpButton, {}),
		/* @__PURE__ */ jsx(SelectPrimitive.Viewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ jsx(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
var SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Label, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
var SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SelectPrimitive.Item, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ jsx("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })]
}));
SelectItem.displayName = SelectPrimitive.Item.displayName;
var SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Separator, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
//#endregion
//#region src/routes/_authenticated/admin/staff.tsx?tsr-split=component
function StaffAndRolesPage() {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ jsx("h1", {
			className: "text-3xl font-black tracking-tight text-foreground",
			children: "Staff & Permissions"
		}), /* @__PURE__ */ jsxs(Tabs, {
			defaultValue: "staff",
			className: "w-full",
			children: [
				/* @__PURE__ */ jsxs(TabsList, { children: [/* @__PURE__ */ jsx(TabsTrigger, {
					value: "staff",
					children: "Staff Management"
				}), /* @__PURE__ */ jsx(TabsTrigger, {
					value: "roles",
					children: "Roles & Permissions"
				})] }),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "staff",
					className: "pt-4",
					children: /* @__PURE__ */ jsx(StaffPage, {})
				}),
				/* @__PURE__ */ jsx(TabsContent, {
					value: "roles",
					className: "pt-4",
					children: /* @__PURE__ */ jsx(RolesPage, {})
				})
			]
		})]
	});
}
function StaffPage() {
	const [users, setUsers] = useState([]);
	const [customRoles, setCustomRoles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const [editData, setEditData] = useState({
		fullName: "",
		email: "",
		phone: "",
		role: "",
		password: ""
	});
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		phone: "",
		fullName: "",
		role: ""
	});
	const [showAddPassword, setShowAddPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const createUserMutation = useServerFn(createAdminUser);
	const updateAccountMutation = useServerFn(updateAdminUserAccount);
	const deleteUserMutation = useServerFn(deleteAuthUser);
	const { user: currentUser, roles: currentRoles } = useAuth();
	const isSuperAdmin = currentRoles.includes("super_admin");
	const loadUsers = async () => {
		setLoading(true);
		try {
			const [staff, rolesData] = await Promise.all([listStaffUsers(), getRoles()]);
			setUsers(staff);
			setCustomRoles((rolesData ?? []).filter((r) => !r.is_system));
		} catch (e) {
			toast.error(e?.message || "Failed to load staff");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		loadUsers();
	}, []);
	const visibleUsers = users.filter((u) => isSuperAdmin || u.id === currentUser?.id);
	const handleAddUser = async (e) => {
		e.preventDefault();
		if (!formData.role) return toast.error("Please select a role");
		setIsSubmitting(true);
		try {
			await createUserMutation({ data: {
				...formData,
				phone: formData.phone?.trim() || void 0
			} });
			toast.success("User created successfully");
			setIsAddModalOpen(false);
			setFormData({
				email: "",
				password: "",
				phone: "",
				fullName: "",
				role: ""
			});
			loadUsers();
		} catch (error) {
			toast.error(error?.message || "Failed to create user");
		} finally {
			setIsSubmitting(false);
		}
	};
	const openEdit = (user) => {
		setSelectedUser(user);
		setEditData({
			fullName: user.full_name ?? "",
			email: user.email ?? "",
			phone: user.phone ?? "",
			role: user.custom_role_id ?? "",
			password: ""
		});
		setShowNewPassword(false);
		setIsEditModalOpen(true);
	};
	const handleEditUser = async (e) => {
		e.preventDefault();
		if (!selectedUser) return;
		setIsSubmitting(true);
		try {
			await updateAccountMutation({ data: {
				userId: selectedUser.id,
				email: editData.email.trim(),
				fullName: editData.fullName.trim(),
				phone: editData.phone?.trim() || null,
				role: selectedUser.role === "super_admin" || !editData.role ? void 0 : editData.role,
				password: editData.password ? editData.password : void 0
			} });
			toast.success("User updated successfully");
			setIsEditModalOpen(false);
			loadUsers();
		} catch (error) {
			toast.error(error?.message || "Failed to update user");
		} finally {
			setIsSubmitting(false);
		}
	};
	const handleDelete = async () => {
		if (!selectedUser) return;
		try {
			await deleteUserMutation({ data: { userId: selectedUser.id } });
			toast.success("User deleted");
			setIsDeleteModalOpen(false);
			loadUsers();
		} catch (error) {
			toast.error(error?.message || "Failed to delete user");
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			isSuperAdmin && /* @__PURE__ */ jsx("div", {
				className: "flex items-center justify-end gap-4 bg-card p-4 rounded-xl border shadow-sm",
				children: /* @__PURE__ */ jsxs("button", {
					onClick: () => setIsAddModalOpen(true),
					className: "btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium",
					children: [/* @__PURE__ */ jsx(UserPlus, { className: "h-4 w-4" }), " Add New User"]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
				children: [loading ? /* @__PURE__ */ jsx("div", {
					className: "col-span-full flex justify-center py-12",
					children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" })
				}) : visibleUsers.map((user) => /* @__PURE__ */ jsx("div", {
					className: "surface-card p-5 group relative overflow-hidden transition-all hover:shadow-md border rounded-xl",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-start gap-3 min-w-0",
							children: [/* @__PURE__ */ jsx("div", {
								className: "h-12 w-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg",
								children: user.full_name?.[0]?.toUpperCase() || "U"
							}), /* @__PURE__ */ jsxs("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ jsx("h3", {
										className: "font-bold text-foreground truncate",
										children: user.full_name || "Unnamed"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 truncate",
										children: [/* @__PURE__ */ jsx(Mail, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ jsx("span", {
											className: "truncate",
											children: user.email || "No email"
										})]
									}),
									user.phone && /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 truncate",
										children: [/* @__PURE__ */ jsx(Phone, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ jsx("span", {
											className: "truncate",
											children: user.phone
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mt-2 inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground",
										children: [/* @__PURE__ */ jsx(Shield, { className: "h-3 w-3 shrink-0" }), /* @__PURE__ */ jsx("span", {
											className: "truncate",
											children: user.role === "super_admin" ? "Super Admin" : user.custom_role_name || "Staff"
										})]
									})
								]
							})]
						}), isSuperAdmin && /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1 shrink-0",
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => openEdit(user),
								title: "Edit user & password",
								"aria-label": "Edit user & password",
								className: "rounded-md p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/20",
								children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" })
							}), /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
								className: "p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground",
								children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" })
							}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
								align: "end",
								children: [/* @__PURE__ */ jsxs(DropdownMenuItem, {
									onClick: () => openEdit(user),
									children: [/* @__PURE__ */ jsx(Pencil, { className: "mr-2 h-4 w-4" }), " Edit user & password"]
								}), user.id !== currentUser?.id && user.role !== "super_admin" && /* @__PURE__ */ jsxs(DropdownMenuItem, {
									className: "text-destructive focus:text-destructive",
									onClick: () => {
										setSelectedUser(user);
										setIsDeleteModalOpen(true);
									},
									children: [/* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }), " Delete User"]
								})]
							})] })]
						})]
					})
				}, user.id)), !loading && visibleUsers.length === 0 && /* @__PURE__ */ jsxs("div", {
					className: "col-span-full py-12 text-center surface-card border-dashed",
					children: [/* @__PURE__ */ jsx(UserPlus, { className: "h-12 w-12 text-muted-foreground/20 mx-auto mb-3" }), /* @__PURE__ */ jsx("p", {
						className: "text-muted-foreground",
						children: "No staff users yet."
					})]
				})]
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: isAddModalOpen,
				onOpenChange: setIsAddModalOpen,
				children: /* @__PURE__ */ jsx(DialogContent, {
					className: "w-[95vw] sm:max-w-[425px]",
					children: /* @__PURE__ */ jsxs("form", {
						onSubmit: handleAddUser,
						children: [
							/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: "Add New User" }), /* @__PURE__ */ jsx(DialogDescription, { children: "Create a staff member. They can log in with these credentials right away." })] }),
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-4 py-4",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "grid gap-2",
										children: [/* @__PURE__ */ jsx(Label, {
											htmlFor: "fullName",
											children: "Full Name"
										}), /* @__PURE__ */ jsx(Input, {
											id: "fullName",
											value: formData.fullName,
											onChange: (e) => setFormData({
												...formData,
												fullName: e.target.value
											}),
											placeholder: "John Doe",
											required: true
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid gap-2",
										children: [/* @__PURE__ */ jsx(Label, {
											htmlFor: "email",
											children: "Email"
										}), /* @__PURE__ */ jsx(Input, {
											id: "email",
											type: "email",
											value: formData.email,
											onChange: (e) => setFormData({
												...formData,
												email: e.target.value
											}),
											placeholder: "john@example.com",
											required: true
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid gap-2",
										children: [/* @__PURE__ */ jsx(Label, {
											htmlFor: "phone",
											children: "Phone Number (Optional)"
										}), /* @__PURE__ */ jsx(Input, {
											id: "phone",
											value: formData.phone,
											onChange: (e) => setFormData({
												...formData,
												phone: e.target.value
											}),
											placeholder: "01700000000"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid gap-2",
										children: [/* @__PURE__ */ jsx(Label, {
											htmlFor: "password",
											children: "Password"
										}), /* @__PURE__ */ jsxs("div", {
											className: "relative",
											children: [/* @__PURE__ */ jsx(Input, {
												id: "password",
												type: showAddPassword ? "text" : "password",
												value: formData.password,
												onChange: (e) => setFormData({
													...formData,
													password: e.target.value
												}),
												placeholder: "••••••••",
												className: "pr-10",
												required: true
											}), /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => setShowAddPassword((v) => !v),
												className: "absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
												"aria-label": showAddPassword ? "Hide password" : "Show password",
												tabIndex: -1,
												children: showAddPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
											})]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid gap-2",
										children: [/* @__PURE__ */ jsx(Label, {
											htmlFor: "role",
											children: "Role"
										}), /* @__PURE__ */ jsxs(Select, {
											value: formData.role,
											onValueChange: (v) => setFormData({
												...formData,
												role: v
											}),
											children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select a role" }) }), /* @__PURE__ */ jsx(SelectContent, { children: customRoles.length > 0 ? customRoles.map((role) => /* @__PURE__ */ jsx(SelectItem, {
												value: role.id,
												children: role.name
											}, role.id)) : /* @__PURE__ */ jsx("div", {
												className: "p-2 text-xs text-center text-muted-foreground",
												children: "No roles created yet. Create one in the Roles tab first."
											}) })]
										})]
									})
								]
							}),
							/* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsxs("button", {
								type: "submit",
								disabled: isSubmitting,
								className: "btn-brand w-full py-2.5 flex items-center justify-center gap-2",
								children: [isSubmitting ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(UserPlus, { className: "h-4 w-4" }), "Create User"]
							}) })
						]
					})
				})
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: isEditModalOpen,
				onOpenChange: setIsEditModalOpen,
				children: /* @__PURE__ */ jsx(DialogContent, {
					className: "w-[95vw] sm:max-w-[440px]",
					children: /* @__PURE__ */ jsxs("form", {
						onSubmit: handleEditUser,
						children: [
							/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: "Edit User" }), /* @__PURE__ */ jsx(DialogDescription, { children: "Update staff profile info, role, or reset password." })] }),
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-4 py-4",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "grid gap-2",
										children: [/* @__PURE__ */ jsx(Label, {
											htmlFor: "editName",
											children: "Full Name"
										}), /* @__PURE__ */ jsx(Input, {
											id: "editName",
											value: editData.fullName,
											onChange: (e) => setEditData({
												...editData,
												fullName: e.target.value
											}),
											placeholder: "Full Name",
											required: true
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid gap-2",
										children: [/* @__PURE__ */ jsx(Label, {
											htmlFor: "editEmail",
											children: "Email"
										}), /* @__PURE__ */ jsx(Input, {
											id: "editEmail",
											type: "email",
											value: editData.email,
											onChange: (e) => setEditData({
												...editData,
												email: e.target.value
											}),
											placeholder: "Email",
											required: true
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid gap-2",
										children: [/* @__PURE__ */ jsx(Label, {
											htmlFor: "editPhone",
											children: "Phone Number"
										}), /* @__PURE__ */ jsx(Input, {
											id: "editPhone",
											value: editData.phone,
											onChange: (e) => setEditData({
												...editData,
												phone: e.target.value
											}),
											placeholder: "Phone number"
										})]
									}),
									selectedUser?.role !== "super_admin" && /* @__PURE__ */ jsxs("div", {
										className: "grid gap-2",
										children: [/* @__PURE__ */ jsx(Label, { children: "Role" }), /* @__PURE__ */ jsxs(Select, {
											value: editData.role,
											onValueChange: (v) => setEditData({
												...editData,
												role: v
											}),
											children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select a role" }) }), /* @__PURE__ */ jsx(SelectContent, { children: customRoles.map((role) => /* @__PURE__ */ jsx(SelectItem, {
												value: role.id,
												children: role.name
											}, role.id)) })]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid gap-2 border-t pt-3",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ jsxs(Label, {
													htmlFor: "editPassword",
													className: "font-semibold flex items-center gap-1.5",
													children: [/* @__PURE__ */ jsx(KeyRound, { className: "h-3.5 w-3.5 text-primary" }), "Reset Password"]
												}), /* @__PURE__ */ jsx("span", {
													className: "text-[11px] text-muted-foreground",
													children: "Optional"
												})]
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-xs text-muted-foreground",
												children: "Leave empty to keep current password. Enter a new password to reset it if forgotten."
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "relative",
												children: [/* @__PURE__ */ jsx(Input, {
													id: "editPassword",
													type: showNewPassword ? "text" : "password",
													value: editData.password,
													onChange: (e) => setEditData({
														...editData,
														password: e.target.value
													}),
													placeholder: "Enter new password (min 6 characters)",
													className: "pr-10"
												}), /* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => setShowNewPassword((v) => !v),
													className: "absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
													"aria-label": showNewPassword ? "Hide password" : "Show password",
													tabIndex: -1,
													children: showNewPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
												})]
											}),
											editData.password.length > 0 && editData.password.length < 6 && /* @__PURE__ */ jsx("p", {
												className: "text-xs text-destructive",
												children: "Password must be at least 6 characters."
											})
										]
									})
								]
							}),
							/* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsxs("button", {
								type: "submit",
								disabled: isSubmitting || editData.password.length > 0 && editData.password.length < 6,
								className: "btn-brand w-full py-2.5 flex items-center justify-center gap-2 disabled:opacity-50",
								children: [isSubmitting ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }), "Save changes"]
							}) })
						]
					})
				})
			}),
			/* @__PURE__ */ jsx(ConfirmModal, {
				isOpen: isDeleteModalOpen,
				onClose: () => setIsDeleteModalOpen(false),
				title: "Delete this user?",
				description: `${selectedUser?.full_name || selectedUser?.email || "This user"} will lose access immediately. This cannot be undone.`,
				confirmText: "Delete user",
				variant: "danger",
				onConfirm: handleDelete
			})
		]
	});
}
function RolesPage() {
	const [roles, setRoles] = useState([]);
	const [permissions, setPermissions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		permissionIds: []
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const saveRoleMutation = useServerFn(saveRole);
	const deleteRoleMutation = useServerFn(deleteRole);
	const loadData = async () => {
		setLoading(true);
		try {
			const [rolesData, permsData] = await Promise.all([getRoles(), getPermissions()]);
			setRoles(rolesData ?? []);
			setPermissions(permsData ?? []);
		} catch (e) {
			toast.error(e?.message || "Failed to load roles");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		loadData();
	}, []);
	const openCreate = () => {
		setEditingId(null);
		setFormData({
			name: "",
			description: "",
			permissionIds: []
		});
		setIsModalOpen(true);
	};
	const openEdit = (role) => {
		setEditingId(role.id);
		setFormData({
			name: role.name ?? "",
			description: role.description ?? "",
			permissionIds: (role.role_permissions ?? []).map((rp) => rp.permission_id)
		});
		setIsModalOpen(true);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.name) return toast.error("Role name is required");
		setIsSubmitting(true);
		try {
			await saveRoleMutation({ data: editingId ? {
				...formData,
				id: editingId
			} : formData });
			toast.success("Role saved successfully");
			setIsModalOpen(false);
			setEditingId(null);
			setFormData({
				name: "",
				description: "",
				permissionIds: []
			});
			loadData();
		} catch (error) {
			toast.error(error?.message || "Failed to save role");
		} finally {
			setIsSubmitting(false);
		}
	};
	const togglePermission = (id) => {
		setFormData((prev) => ({
			...prev,
			permissionIds: prev.permissionIds.includes(id) ? prev.permissionIds.filter((pid) => pid !== id) : [...prev.permissionIds, id]
		}));
	};
	const toggleGroup = (ids, on) => {
		setFormData((prev) => ({
			...prev,
			permissionIds: on ? Array.from(/* @__PURE__ */ new Set([...prev.permissionIds, ...ids])) : prev.permissionIds.filter((id) => !ids.includes(id))
		}));
	};
	/** Permissions arranged exactly like the admin sidebar menu. */
	const groupedPermissions = useMemo(() => {
		const byName = new Map((permissions ?? []).map((p) => [p.name, p]));
		const used = /* @__PURE__ */ new Set();
		const groups = PERMISSION_GROUPS.map((group) => ({
			key: group.key,
			label: group.label,
			items: group.permissions.map((def) => {
				const row = byName.get(def.key);
				if (!row) return null;
				used.add(def.key);
				return {
					id: row.id,
					label: def.label,
					description: def.description
				};
			}).filter(Boolean)
		})).filter((g) => g.items.length > 0);
		const others = (permissions ?? []).filter((p) => !used.has(p.name)).map((p) => ({
			id: p.id,
			label: p.name,
			description: p.description ?? ""
		}));
		if (others.length > 0) groups.push({
			key: "other",
			label: "Other",
			items: others
		});
		return groups;
	}, [permissions]);
	const customRoles = roles.filter((role) => !role.is_system);
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ jsxs("button", {
					onClick: openCreate,
					className: "btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium",
					children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " Create Role"]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
				children: [loading ? /* @__PURE__ */ jsx("div", {
					className: "col-span-full flex justify-center py-12",
					children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" })
				}) : customRoles.map((role) => /* @__PURE__ */ jsxs("div", {
					className: "surface-card p-5 group relative border rounded-xl hover:shadow-md transition-all",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => openEdit(role),
								className: "flex items-center gap-2 text-left group-hover:text-primary transition-colors min-w-0",
								children: [/* @__PURE__ */ jsx(Shield, { className: "h-5 w-5 text-primary shrink-0" }), /* @__PURE__ */ jsx("h3", {
									className: "font-bold truncate",
									children: role.name
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-1 shrink-0",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => openEdit(role),
									title: "Edit role",
									"aria-label": "Edit role",
									className: "rounded-md p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/20",
									children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" })
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setDeleteTarget(role),
									title: "Delete role",
									"aria-label": "Delete role",
									className: "rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors",
									children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
								})]
							})]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground mt-2 line-clamp-2",
							children: role.description || "No description provided."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-4 flex items-center justify-between",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "text-[11px] bg-muted px-2 py-0.5 rounded font-medium text-muted-foreground",
								children: [(role.role_permissions ?? []).length, " Permissions"]
							}), /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => openEdit(role),
								className: "text-xs text-primary hover:underline font-medium inline-flex items-center gap-1",
								children: [/* @__PURE__ */ jsx(Pencil, { className: "h-3 w-3" }), " Edit"]
							})]
						})
					]
				}, role.id)), !loading && customRoles.length === 0 && /* @__PURE__ */ jsxs("div", {
					className: "col-span-full py-12 text-center surface-card border-dashed",
					children: [/* @__PURE__ */ jsx(Shield, { className: "h-12 w-12 text-muted-foreground/20 mx-auto mb-3" }), /* @__PURE__ */ jsx("p", {
						className: "text-muted-foreground",
						children: "No custom roles created yet."
					})]
				})]
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: isModalOpen,
				onOpenChange: setIsModalOpen,
				children: /* @__PURE__ */ jsx(DialogContent, {
					className: "w-[95vw] sm:max-w-[600px] max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-xl",
					children: /* @__PURE__ */ jsxs("form", {
						onSubmit: handleSubmit,
						className: "flex flex-col h-full overflow-hidden",
						children: [
							/* @__PURE__ */ jsxs(DialogHeader, {
								className: "p-6 pb-2",
								children: [/* @__PURE__ */ jsx(DialogTitle, {
									className: "text-xl font-bold",
									children: editingId ? "Edit Role" : "Create Custom Role"
								}), /* @__PURE__ */ jsx(DialogDescription, { children: "Define a role and its associated permissions." })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex-1 overflow-y-auto px-6 py-4 space-y-6 scrollbar-thin",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "grid gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "grid gap-2",
										children: [/* @__PURE__ */ jsx(Label, {
											htmlFor: "roleName",
											className: "font-semibold",
											children: "Role Name"
										}), /* @__PURE__ */ jsx(Input, {
											id: "roleName",
											value: formData.name,
											onChange: (e) => setFormData({
												...formData,
												name: e.target.value
											}),
											placeholder: "e.g. Content Manager",
											className: "bg-muted/50",
											required: true
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "grid gap-2",
										children: [/* @__PURE__ */ jsx(Label, {
											htmlFor: "description",
											className: "font-semibold",
											children: "Description"
										}), /* @__PURE__ */ jsx(Input, {
											id: "description",
											value: formData.description,
											onChange: (e) => setFormData({
												...formData,
												description: e.target.value
											}),
											placeholder: "What can this role do?",
											className: "bg-muted/50"
										})]
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "space-y-4",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between border-b pb-2",
										children: [/* @__PURE__ */ jsx(Label, {
											className: "text-base font-bold",
											children: "Permissions"
										}), /* @__PURE__ */ jsxs("span", {
											className: "text-xs text-muted-foreground",
											children: [formData.permissionIds.length, " selected"]
										})]
									}), groupedPermissions.map((group) => {
										const ids = group.items.map((i) => i.id);
										const selected = ids.filter((id) => formData.permissionIds.includes(id));
										const allOn = ids.length > 0 && selected.length === ids.length;
										return /* @__PURE__ */ jsxs("div", {
											className: "rounded-lg border",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-between gap-2 border-b bg-muted/40 px-3 py-2",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-sm font-bold",
													children: group.label
												}), /* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ jsxs("span", {
														className: "text-[11px] text-muted-foreground",
														children: [
															selected.length,
															"/",
															ids.length
														]
													}), /* @__PURE__ */ jsx("button", {
														type: "button",
														onClick: () => toggleGroup(ids, !allOn),
														className: "rounded-md border bg-background px-2 py-1 text-[11px] font-medium hover:bg-muted",
														children: allOn ? "Clear all" : "Select all"
													})]
												})]
											}), /* @__PURE__ */ jsx("div", {
												className: "grid gap-2 p-3 sm:grid-cols-2",
												children: group.items.map((perm) => {
													const active = formData.permissionIds.includes(perm.id);
													return /* @__PURE__ */ jsxs("button", {
														type: "button",
														"aria-pressed": active,
														onClick: () => togglePermission(perm.id),
														className: `flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-all hover:shadow-sm ${active ? "border-primary bg-primary/5 shadow-sm" : "hover:bg-muted/50"}`,
														children: [/* @__PURE__ */ jsx("span", {
															className: `mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border ${active ? "border-primary bg-primary text-primary-foreground" : "border-input"}`,
															children: active && /* @__PURE__ */ jsx(Check, { className: "h-3 w-3" })
														}), /* @__PURE__ */ jsxs("span", {
															className: "grid gap-1 leading-none",
															children: [/* @__PURE__ */ jsx("span", {
																className: "text-sm font-semibold leading-none",
																children: perm.label
															}), /* @__PURE__ */ jsx("span", {
																className: "block text-[11px] text-muted-foreground leading-tight mt-1",
																children: perm.description
															})]
														})]
													}, perm.id);
												})
											})]
										}, group.key);
									})]
								})]
							}),
							/* @__PURE__ */ jsx(DialogFooter, {
								className: "p-6 pt-2 border-t bg-muted/20",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex w-full gap-3",
									children: [/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setIsModalOpen(false),
										className: "flex-1 px-4 py-2.5 rounded-lg border font-medium hover:bg-muted transition-colors",
										children: "Cancel"
									}), /* @__PURE__ */ jsxs("button", {
										type: "submit",
										disabled: isSubmitting,
										className: "flex-[2] btn-brand py-2.5 flex items-center justify-center gap-2 rounded-lg shadow-sm",
										children: [isSubmitting ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Shield, { className: "h-4 w-4" }), "Save Role"]
									})]
								})
							})
						]
					})
				})
			}),
			/* @__PURE__ */ jsx(ConfirmModal, {
				isOpen: !!deleteTarget,
				onClose: () => setDeleteTarget(null),
				title: "Delete this role?",
				description: `Users assigned to "${deleteTarget?.name ?? ""}" will lose their permissions.`,
				confirmText: "Delete role",
				variant: "danger",
				onConfirm: async () => {
					try {
						await deleteRoleMutation({ data: { id: deleteTarget.id } });
						toast.success("Role deleted");
						setDeleteTarget(null);
						loadData();
					} catch (e) {
						toast.error(e?.message || "Failed to delete role");
					}
				}
			})
		]
	});
}
//#endregion
export { StaffAndRolesPage as component };
