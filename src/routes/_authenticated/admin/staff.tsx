import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PERMISSION_GROUPS } from "@/lib/permissions";

import { ConfirmModal } from "@/components/ui-kit/ConfirmModal";
import { Shield, UserPlus, Trash2, MoreHorizontal, Loader2, Mail, Phone, KeyRound, Plus, Check, Eye, EyeOff, Pencil, Save } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/lib/use-auth";
import {
  createAdminUser,
  updateAdminUserAccount,
} from "@/lib/user-management.functions";
import { deleteAuthUser, listStaffUsers, type StaffUser } from "@/lib/admin-users.functions";
import { getRoles, getPermissions, saveRole, deleteRole } from "@/lib/roles-permissions.functions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/admin/staff")({
  component: StaffAndRolesPage,
});

function StaffAndRolesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black tracking-tight text-foreground">Staff &amp; Permissions</h1>
      <Tabs defaultValue="staff" className="w-full">
        <TabsList>
          <TabsTrigger value="staff">Staff Management</TabsTrigger>
          <TabsTrigger value="roles">Roles &amp; Permissions</TabsTrigger>
        </TabsList>
        <TabsContent value="staff" className="pt-4">
          <StaffPage />
        </TabsContent>
        <TabsContent value="roles" className="pt-4">
          <RolesPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// --- STAFF PAGE CONTENT ---
function StaffPage() {
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [customRoles, setCustomRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<StaffUser | null>(null);
  const [editData, setEditData] = useState({ fullName: "", email: "", phone: "", role: "", password: "" });
  const [formData, setFormData] = useState({ email: "", password: "", phone: "", fullName: "", role: "" });
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
      setCustomRoles((rolesData ?? []).filter((r: any) => !r.is_system));
    } catch (e: any) {
      toast.error(e?.message || "Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Super admin accounts are only ever visible to a super admin.
  const visibleUsers = users.filter((u) => isSuperAdmin || u.id === currentUser?.id);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.role) return toast.error("Please select a role");
    setIsSubmitting(true);
    try {
      await createUserMutation({
        data: {
          ...formData,
          phone: formData.phone?.trim() || undefined,
        },
      });
      toast.success("User created successfully");
      setIsAddModalOpen(false);
      setFormData({ email: "", password: "", phone: "", fullName: "", role: "" });
      loadUsers();
    } catch (error: any) {
      toast.error(error?.message || "Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEdit = (user: StaffUser) => {
    setSelectedUser(user);
    setEditData({
      fullName: user.full_name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      role: user.custom_role_id ?? "",
      password: "",
    });
    setShowNewPassword(false);
    setIsEditModalOpen(true);
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      await updateAccountMutation({
        data: {
          userId: selectedUser.id,
          email: editData.email.trim(),
          fullName: editData.fullName.trim(),
          phone: editData.phone?.trim() || null,
          // Super admin role is never reassigned from here.
          role: selectedUser.role === "super_admin" || !editData.role ? undefined : editData.role,
          password: editData.password ? editData.password : undefined,
        },
      });
      toast.success("User updated successfully");
      setIsEditModalOpen(false);
      loadUsers();
    } catch (error: any) {
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
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete user");
    }
  };

  return (
    <div className="space-y-6">
      {isSuperAdmin && (
        <div className="flex items-center justify-end gap-4 bg-card p-4 rounded-xl border shadow-sm">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium"
          >
            <UserPlus className="h-4 w-4" /> Add New User
          </button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          visibleUsers.map((user) => (
            <div key={user.id} className="surface-card p-5 group relative overflow-hidden transition-all hover:shadow-md border rounded-xl">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="h-12 w-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {user.full_name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-foreground truncate">{user.full_name || "Unnamed"}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 truncate">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{user.email || "No email"}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 truncate">
                        <Phone className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{user.phone}</span>
                      </div>
                    )}
                    <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                      <Shield className="h-3 w-3 shrink-0" />
                      <span className="truncate">{user.role === "super_admin" ? "Super Admin" : user.custom_role_name || "Staff"}</span>
                    </div>
                  </div>
                </div>
                {isSuperAdmin && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEdit(user)}
                      title="Edit user & password"
                      aria-label="Edit user & password"
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/20"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(user)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit user &amp; password
                        </DropdownMenuItem>
                        {user.id !== currentUser?.id && user.role !== "super_admin" && (
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete User
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {!loading && visibleUsers.length === 0 && (
          <div className="col-span-full py-12 text-center surface-card border-dashed">
            <UserPlus className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground">No staff users yet.</p>
          </div>
        )}
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[425px]">
          <form onSubmit={handleAddUser}>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a staff member. They can log in with these credentials right away.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="01700000000"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showAddPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowAddPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label={showAddPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showAddPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {customRoles.length > 0 ? (
                      customRoles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-xs text-center text-muted-foreground">
                        No roles created yet. Create one in the Roles tab first.
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <button type="submit" disabled={isSubmitting} className="btn-brand w-full py-2.5 flex items-center justify-center gap-2">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                Create User
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[440px]">
          <form onSubmit={handleEditUser}>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update staff profile info, role, or reset password.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="editName">Full Name</Label>
                <Input
                  id="editName"
                  value={editData.fullName}
                  onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                  placeholder="Full Name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editEmail">Email</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  placeholder="Email"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editPhone">Phone Number</Label>
                <Input
                  id="editPhone"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  placeholder="Phone number"
                />
              </div>
              {selectedUser?.role !== "super_admin" && (
                <div className="grid gap-2">
                  <Label>Role</Label>
                  <Select
                    value={editData.role}
                    onValueChange={(v) => setEditData({ ...editData, role: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {customRoles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid gap-2 border-t pt-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="editPassword" className="font-semibold flex items-center gap-1.5">
                    <KeyRound className="h-3.5 w-3.5 text-primary" />
                    Reset Password
                  </Label>
                  <span className="text-[11px] text-muted-foreground">Optional</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Leave empty to keep current password. Enter a new password to reset it if forgotten.
                </p>
                <div className="relative">
                  <Input
                    id="editPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={editData.password}
                    onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                    placeholder="Enter new password (min 6 characters)"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {editData.password.length > 0 && editData.password.length < 6 && (
                  <p className="text-xs text-destructive">Password must be at least 6 characters.</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <button
                type="submit"
                disabled={isSubmitting || (editData.password.length > 0 && editData.password.length < 6)}
                className="btn-brand w-full py-2.5 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save changes
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete this user?"
        description={`${selectedUser?.full_name || selectedUser?.email || "This user"} will lose access immediately. This cannot be undone.`}
        confirmText="Delete user"
        variant="danger"
        onConfirm={handleDelete}
      />
    </div>
  );
}

// --- ROLES PAGE CONTENT ---
function RolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", permissionIds: [] as string[] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const saveRoleMutation = useServerFn(saveRole);
  const deleteRoleMutation = useServerFn(deleteRole);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rolesData, permsData] = await Promise.all([getRoles(), getPermissions()]);
      setRoles(rolesData ?? []);
      setPermissions(permsData ?? []);
    } catch (e: any) {
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
    setFormData({ name: "", description: "", permissionIds: [] });
    setIsModalOpen(true);
  };

  const openEdit = (role: any) => {
    setEditingId(role.id);
    setFormData({
      name: role.name ?? "",
      description: role.description ?? "",
      permissionIds: (role.role_permissions ?? []).map((rp: any) => rp.permission_id),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return toast.error("Role name is required");

    setIsSubmitting(true);
    try {
      await saveRoleMutation({ data: editingId ? { ...formData, id: editingId } : formData });
      toast.success("Role saved successfully");
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ name: "", description: "", permissionIds: [] });
      loadData();
    } catch (error: any) {
      toast.error(error?.message || "Failed to save role");
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePermission = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(id)
        ? prev.permissionIds.filter((pid) => pid !== id)
        : [...prev.permissionIds, id],
    }));
  };

  const toggleGroup = (ids: string[], on: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissionIds: on
        ? Array.from(new Set([...prev.permissionIds, ...ids]))
        : prev.permissionIds.filter((id) => !ids.includes(id)),
    }));
  };

  /** Permissions arranged exactly like the admin sidebar menu. */
  const groupedPermissions = useMemo(() => {
    const byName = new Map<string, any>((permissions ?? []).map((p: any) => [p.name, p]));
    const used = new Set<string>();
    const groups = PERMISSION_GROUPS.map((group) => ({
      key: group.key,
      label: group.label,
      items: group.permissions
        .map((def) => {
          const row = byName.get(def.key);
          if (!row) return null;
          used.add(def.key);
          return { id: row.id as string, label: def.label, description: def.description };
        })
        .filter(Boolean) as { id: string; label: string; description: string }[],
    })).filter((g) => g.items.length > 0);

    const others = (permissions ?? [])
      .filter((p: any) => !used.has(p.name))
      .map((p: any) => ({ id: p.id as string, label: p.name as string, description: (p.description ?? "") as string }));
    if (others.length > 0) groups.push({ key: "other", label: "Other", items: others });
    return groups;
  }, [permissions]);

  const customRoles = roles.filter((role) => !role.is_system);


  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={openCreate} className="btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium">
          <Plus className="h-4 w-4" /> Create Role
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          customRoles.map((role) => (
            <div key={role.id} className="surface-card p-5 group relative border rounded-xl hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-2">
                <button type="button" onClick={() => openEdit(role)} className="flex items-center gap-2 text-left group-hover:text-primary transition-colors min-w-0">
                  <Shield className="h-5 w-5 text-primary shrink-0" />
                  <h3 className="font-bold truncate">{role.name}</h3>
                </button>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(role)}
                    title="Edit role"
                    aria-label="Edit role"
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/20"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(role)}
                    title="Delete role"
                    aria-label="Delete role"
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{role.description || "No description provided."}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[11px] bg-muted px-2 py-0.5 rounded font-medium text-muted-foreground">
                  {(role.role_permissions ?? []).length} Permissions
                </span>
                <button
                  type="button"
                  onClick={() => openEdit(role)}
                  className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1"
                >
                  <Pencil className="h-3 w-3" /> Edit
                </button>
              </div>
            </div>
          ))
        )}
        {!loading && customRoles.length === 0 && (
          <div className="col-span-full py-12 text-center surface-card border-dashed">
            <Shield className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground">No custom roles created yet.</p>
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[600px] max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-xl">
          <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle className="text-xl font-bold">{editingId ? "Edit Role" : "Create Custom Role"}</DialogTitle>
              <DialogDescription>Define a role and its associated permissions.</DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 scrollbar-thin">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="roleName" className="font-semibold">
                    Role Name
                  </Label>
                  <Input
                    id="roleName"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Content Manager"
                    className="bg-muted/50"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description" className="font-semibold">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What can this role do?"
                    className="bg-muted/50"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <Label className="text-base font-bold">Permissions</Label>
                  <span className="text-xs text-muted-foreground">{formData.permissionIds.length} selected</span>
                </div>
                {groupedPermissions.map((group) => {
                  const ids = group.items.map((i) => i.id);
                  const selected = ids.filter((id) => formData.permissionIds.includes(id));
                  const allOn = ids.length > 0 && selected.length === ids.length;
                  return (
                    <div key={group.key} className="rounded-lg border">
                      <div className="flex items-center justify-between gap-2 border-b bg-muted/40 px-3 py-2">
                        <span className="text-sm font-bold">{group.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-muted-foreground">
                            {selected.length}/{ids.length}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleGroup(ids, !allOn)}
                            className="rounded-md border bg-background px-2 py-1 text-[11px] font-medium hover:bg-muted"
                          >
                            {allOn ? "Clear all" : "Select all"}
                          </button>
                        </div>
                      </div>
                      <div className="grid gap-2 p-3 sm:grid-cols-2">
                        {group.items.map((perm) => {
                          const active = formData.permissionIds.includes(perm.id);
                          return (
                            <button
                              type="button"
                              key={perm.id}
                              aria-pressed={active}
                              onClick={() => togglePermission(perm.id)}
                              className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-all hover:shadow-sm ${
                                active ? "border-primary bg-primary/5 shadow-sm" : "hover:bg-muted/50"
                              }`}
                            >
                              <span
                                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border ${
                                  active ? "border-primary bg-primary text-primary-foreground" : "border-input"
                                }`}
                              >
                                {active && <Check className="h-3 w-3" />}
                              </span>
                              <span className="grid gap-1 leading-none">
                                <span className="text-sm font-semibold leading-none">{perm.label}</span>
                                <span className="block text-[11px] text-muted-foreground leading-tight mt-1">
                                  {perm.description}
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            <DialogFooter className="p-6 pt-2 border-t bg-muted/20">
              <div className="flex w-full gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-[2] btn-brand py-2.5 flex items-center justify-center gap-2 rounded-lg shadow-sm">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                  Save Role
                </button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete this role?"
        description={`Users assigned to "${deleteTarget?.name ?? ""}" will lose their permissions.`}
        confirmText="Delete role"
        variant="danger"
        onConfirm={async () => {
          try {
            await deleteRoleMutation({ data: { id: deleteTarget.id } });
            toast.success("Role deleted");
            setDeleteTarget(null);
            loadData();
          } catch (e: any) {
            toast.error(e?.message || "Failed to delete role");
          }
        }}
      />
    </div>
  );
}
