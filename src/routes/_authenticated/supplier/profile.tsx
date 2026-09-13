import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Save, KeyRound, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui-kit";
import { supabase } from "@/integrations/laravel/client";
import { useSupplier } from "@/components/supplier-context";

export const Route = createFileRoute("/_authenticated/supplier/profile")({
  component: SupplierProfilePage,
});

const inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

function SupplierProfilePage() {
  const { data, reload } = useSupplier();
  const s = data.supplier!;
  const [form, setForm] = useState({
    display_name: s.display_name ?? "",
    contact_phone: s.contact_phone ?? "",
    whatsapp: s.whatsapp ?? "",
    address: s.address ?? "",
    payout_method: s.payout_method ?? "bkash",
    payout_account_name: s.payout_account_name ?? "",
    payout_account_number: s.payout_account_number ?? "",
    payout_bank_name: s.payout_bank_name ?? "",
    payout_branch: s.payout_branch ?? "",
    payout_notes: s.payout_notes ?? "",
  });
  const [busy, setBusy] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const isBank = form.payout_method === "bank";

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    setSavingPass(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPass(false);
    if (error) return toast.error(error.message);
    setNewPassword("");
    setConfirmPassword("");
    toast.success("Password updated successfully");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.display_name.trim()) return toast.error("Please enter a name");
    setBusy(true);
    const { error } = await supabase
      .from("suppliers")
      .update({
        display_name: form.display_name,
        contact_phone: form.contact_phone || null,
        whatsapp: form.whatsapp || null,
        address: form.address || null,
        payout_method: form.payout_method,
        payout_account_name: form.payout_account_name || null,
        payout_account_number: form.payout_account_number || null,
        payout_bank_name: isBank ? form.payout_bank_name || null : null,
        payout_branch: isBank ? form.payout_branch || null : null,
        payout_notes: form.payout_notes || null,
      })
      .eq("id", s.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
    await reload();
  }

  return (
    <div>
      <PageHeader title="My profile" description="Your contact and payout information." />

      <form onSubmit={save} className="space-y-4">
        <div className="surface-card p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">Basic info</h3>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium">Code: {s.code}</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Supplier / business name">
              <input value={form.display_name} onChange={(e) => set("display_name", e.target.value)} className={inp} />
            </Field>
            <Field label="Email">
              <input value={s.email ?? ""} disabled className={inp + " opacity-60"} />
            </Field>
            <Field label="Phone">
              <input value={form.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} className={inp} />
            </Field>
            <Field label="WhatsApp">
              <input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className={inp} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Address">
                <textarea rows={2} value={form.address} onChange={(e) => set("address", e.target.value)} className={inp} />
              </Field>
            </div>
          </div>
        </div>

        <div className="surface-card p-5">
          <h3 className="mb-3 text-sm font-semibold">Payout information</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Method">
              <select value={form.payout_method} onChange={(e) => set("payout_method", e.target.value)} className={inp}>
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
                <option value="rocket">Rocket</option>
                <option value="bank">Bank</option>
              </select>
            </Field>
            <Field label="Account holder name">
              <input value={form.payout_account_name} onChange={(e) => set("payout_account_name", e.target.value)} className={inp} />
            </Field>
            <Field label={isBank ? "Account number" : "Mobile number"}>
              <input value={form.payout_account_number} onChange={(e) => set("payout_account_number", e.target.value)} className={inp} />
            </Field>
            {isBank && (
              <>
                <Field label="Bank name">
                  <input value={form.payout_bank_name} onChange={(e) => set("payout_bank_name", e.target.value)} className={inp} />
                </Field>
                <Field label="Branch">
                  <input value={form.payout_branch} onChange={(e) => set("payout_branch", e.target.value)} className={inp} />
                </Field>
              </>
            )}
            <div className="sm:col-span-2">
              <Field label="Note (optional)">
                <input value={form.payout_notes} onChange={(e) => set("payout_notes", e.target.value)} className={inp} />
              </Field>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            disabled={busy}
            className="btn-brand inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save profile
          </button>
        </div>
      </form>

      {/* Password reset section */}
      <form onSubmit={savePassword} className="surface-card mt-6 space-y-3 p-5">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <KeyRound className="h-4 w-4 text-amber-500" /> Change password
        </h3>
        <p className="text-xs text-muted-foreground">
          Choose a strong password with at least 6 characters.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="New password">
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                className={`${inp} pr-10`}
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                aria-label={showPass ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>

          <Field label="Confirm new password">
            <input
              type={showPass ? "text" : "password"}
              className={inp}
              placeholder="Repeat new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
              required
            />
          </Field>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={savingPass || !newPassword}
            className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
          >
            {savingPass ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <KeyRound className="h-3.5 w-3.5" />}
            Update password
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium">{label}</label>
      {children}
    </div>
  );
}
