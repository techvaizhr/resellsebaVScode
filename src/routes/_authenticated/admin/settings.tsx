import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/laravel/client";
import { clearAppDataCache } from "@/lib/app-data";
import { PageHeader } from "@/components/ui-kit";
import { Loader2, Palette, Sparkles, Check, Globe, Shield, Store, Layers, FileText, KeyRound, User } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { updateSuperAdminCredentials } from "@/lib/user-management.functions";
import { ImageUploader, type UploadedImage } from "@/components/ImageUploader";
import { cn } from "@/lib/utils";
import { useBrandingTheme, applyBrandingThemeDirectly } from "@/lib/branding";
import { applyPlatformBranding } from "@/lib/platform-branding";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  ssr: false,
  component: SettingsPage,
});

const PALETTES = [
  { name: "Royal Indigo & Amber", primary: "#4f46e5", accent: "#f59e0b" },
  { name: "Emerald & Teal", primary: "#059669", accent: "#0d9488" },
  { name: "Crimson & Rose", primary: "#e11d48", accent: "#fb7185" },
  { name: "Midnight Violet & Cyan", primary: "#7c3aed", accent: "#06b6d4" },
  { name: "Sunset Orange & Indigo", primary: "#ea580c", accent: "#4f46e5" },
  { name: "Modern Dark Slate", primary: "#334155", accent: "#6366f1" },
];

const RADII = [
  { label: "Compact (8px)", value: "0.5rem" },
  { label: "Modern (14px)", value: "0.875rem" },
  { label: "Pill/Soft (20px)", value: "1.25rem" },
];

function SettingsPage() {
  const [siteName, setSiteName] = useState("");
  const [flagshipCode, setFlagshipCode] = useState("");
  const [resellers, setResellers] = useState<{ code: string; business_name: string }[]>([]);
  const [tagline, setTagline] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [primary, setPrimary] = useState("#4f46e5");
  const [accent, setAccent] = useState("#f59e0b");
  const [radius, setRadius] = useState("0.875rem");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [logo, setLogo] = useState<UploadedImage[]>([]);
  const [favicon, setFavicon] = useState<UploadedImage[]>([]);
  const [og, setOg] = useState<UploadedImage[]>([]);
  const [labelSize, setLabelSize] = useState("3x4");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  // Super Admin Credentials state
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminPasswordConfirm, setAdminPasswordConfirm] = useState("");
  const [updatingAdmin, setUpdatingAdmin] = useState(false);
  const saveSuperAdminMutation = useServerFn(updateSuperAdminCredentials);

  // Live real-time preview of branding colors and radius
  useBrandingTheme(primary, accent, { radius });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("global_settings").select("*").eq("id", 1).maybeSingle();
      if (data) {
        setSiteName(data.site_name ?? "");
        setTagline(data.tagline ?? "");
        setMetaTitle(data.meta_title_template ?? "");
        setMetaDesc(data.meta_description ?? "");
        setPrimary(data.primary_color ?? "#4f46e5");
        setAccent(data.accent_color ?? "#f59e0b");
        setRadius((data as any).border_radius ?? "0.875rem");
        setPhone(data.contact_phone ?? "");
        setEmail(data.contact_email ?? "");
        setFlagshipCode((data as any).flagship_reseller_code ?? "");
        setLabelSize((data as any).label_size || "3x4");
        if (data.logo_url) setLogo([{ path: "", url: data.logo_url, bytes: 0 }]);
        if ((data as any).favicon_url) setFavicon([{ path: "", url: (data as any).favicon_url, bytes: 0 }]);
        if (data.og_image_url) setOg([{ path: "", url: data.og_image_url, bytes: 0 }]);
      }
      const { data: rs } = await supabase.from("resellers").select("code,business_name").eq("status", "active").order("business_name");
      setResellers(rs ?? []);

      // Load Super Admin info
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        setAdminEmail(userData.user.email ?? "");
        setAdminName(userData.user.user_metadata?.full_name ?? userData.user.user_metadata?.name ?? "Super Admin");
      }

      setLoading(false);
    })();
  }, []);

  async function handleSaveAdminCredentials(e: React.FormEvent) {
    e.preventDefault();
    if (!adminEmail.trim()) {
      toast.error("ইমেইল দিন");
      return;
    }
    if (adminPassword) {
      if (adminPassword.length < 6) {
        toast.error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
        return;
      }
      if (adminPassword !== adminPasswordConfirm) {
        toast.error("পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মেলেনি");
        return;
      }
    }
    setUpdatingAdmin(true);
    try {
      await saveSuperAdminMutation({
        data: {
          email: adminEmail.trim(),
          fullName: adminName.trim() || "Super Admin",
          password: adminPassword ? adminPassword : undefined,
        },
      });
      toast.success("সুপার অ্যাডমিন লগইন ইমেইল ও পাসওয়ার্ড সফলভাবে আপডেট হয়েছে!");
      setAdminPassword("");
      setAdminPasswordConfirm("");
    } catch (err: any) {
      toast.error(err?.message || "আপডেট ব্যর্থ হয়েছে");
    } finally {
      setUpdatingAdmin(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("global_settings").upsert({
      id: 1,
      site_name: siteName,
      tagline: tagline || null,
      meta_title_template: metaTitle || null,
      meta_description: metaDesc || null,
      primary_color: primary,
      accent_color: accent,
      border_radius: radius,
      contact_phone: phone || null,
      contact_email: email || null,
      logo_url: logo[0]?.url ?? null,
      favicon_url: favicon[0]?.url ?? null,
      og_image_url: og[0]?.url ?? null,
      flagship_reseller_code: flagshipCode || null,
      label_size: labelSize,
    } as any);
    clearAppDataCache("settings");
    applyPlatformBranding({
      primary_color: primary,
      accent_color: accent,
      favicon_url: favicon[0]?.url ?? null,
    });
    applyBrandingThemeDirectly(primary, accent, { radius });

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("brand_settings_updated", {
          detail: {
            site_name: siteName,
            logo_url: logo[0]?.url ?? null,
            primary_color: primary,
            accent_color: accent,
            border_radius: radius,
          },
        })
      );
      if (favicon[0]?.url) {
        document.querySelectorAll("link[rel~='icon']").forEach((el) => el.remove());
        const link = document.createElement("link");
        link.rel = "icon";
        link.href = favicon[0].url;
        document.head.appendChild(link);
      }
    }

    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Settings saved — Theme & assets updated successfully!");
  }

  if (loading)
    return (
      <div className="grid place-items-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader
        title="Global Branding & Settings"
        description="Customize global brand identity, live themes, SEO, and storefront defaults."
        actions={
          <Link
            to="/admin/landing"
            className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition-all active:scale-95"
          >
            <FileText className="h-4 w-4" /> Landing Page Content
          </Link>
        }
      />

      {/* Live Visual Preview Card */}
      <div className="surface-card p-5 border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-xl grid place-items-center text-white font-bold shadow-md"
              style={{ background: `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)` }}
            >
              {siteName ? siteName.charAt(0) : "R"}
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">{siteName || "ResellSeba"}</div>
              <div className="text-xs text-muted-foreground">{tagline || "Your Reseller Platform"}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm transition-all"
              style={{ backgroundColor: primary, borderRadius: radius }}
            >
              Primary Action
            </button>
            <button
              type="button"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm transition-all"
              style={{ backgroundColor: accent, borderRadius: radius }}
            >
              Accent Badge
            </button>
          </div>
        </div>
      </div>

      {/* Super Admin Security & Credentials */}
      <div className="surface-card space-y-4 p-6 border border-primary/30 shadow-sm bg-card">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <KeyRound className="h-4 w-4 text-primary" /> Super Admin Credentials (লগইন ইমেইল ও পাসওয়ার্ড পরিবর্তন)
          </div>
          <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            Super Admin Security
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          সাইট সেটআপ করার পর এখান থেকে সুপার অ্যাডমিনের ডিফল্ট ইমেইল (<code className="text-primary font-mono font-semibold">admin@resellseba.com</code>) এবং পাসওয়ার্ড পরিবর্তন করে আপনার নিজস্ব ব্যক্তিগত ইমেইল ও পাসওয়ার্ড সেট করে নিন।
        </p>

        <form onSubmit={handleSaveAdminCredentials} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Super Admin Name">
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className={inp}
                placeholder="Super Admin"
                required
              />
            </Field>
            <Field label="Super Admin Login Email">
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className={inp}
                placeholder="admin@yourdomain.com"
                required
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="New Password (নতুন পাসওয়ার্ড না বদলালে খালি রাখুন)">
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className={inp}
                placeholder="কমপক্ষে ৬ ডিজিটের নতুন পাসওয়ার্ড"
              />
            </Field>
            <Field label="Confirm New Password">
              <input
                type="password"
                value={adminPasswordConfirm}
                onChange={(e) => setAdminPasswordConfirm(e.target.value)}
                className={inp}
                placeholder="পুনরায় নতুন পাসওয়ার্ড লিখুন"
              />
            </Field>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={updatingAdmin}
              className="btn-brand inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-sm hover:shadow active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              {updatingAdmin ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Shield className="h-3.5 w-3.5" />}
              <span>সুপার অ্যাডমিন তথ্য আপডেট করুন</span>
            </button>
          </div>
        </form>
      </div>

      <form onSubmit={save} className="grid gap-6 lg:grid-cols-2">
        {/* Brand Theme & Colors */}
        <div className="surface-card space-y-4 p-6">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Palette className="h-4 w-4 text-primary" /> Theme & Palette Customizer
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-muted-foreground">Quick Palette Presets</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {PALETTES.map((p) => {
                const isSelected = primary === p.primary && accent === p.accent;
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      setPrimary(p.primary);
                      setAccent(p.accent);
                    }}
                    className={cn(
                      "flex items-center gap-2 rounded-xl p-2 border text-left text-xs transition-all",
                      isSelected ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary" : "border-border/60 hover:bg-muted/60"
                    )}
                  >
                    <div className="flex -space-x-1 shrink-0">
                      <span className="h-4 w-4 rounded-full border border-background shadow-xs" style={{ backgroundColor: p.primary }} />
                      <span className="h-4 w-4 rounded-full border border-background shadow-xs" style={{ backgroundColor: p.accent }} />
                    </div>
                    <span className="truncate text-[11px] font-medium">{p.name.split("&")[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Custom Primary Color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primary}
                  onChange={(e) => setPrimary(e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded-lg border border-border p-0.5"
                />
                <input
                  type="text"
                  value={primary}
                  onChange={(e) => setPrimary(e.target.value)}
                  className={inp}
                />
              </div>
            </Field>
            <Field label="Custom Accent Color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded-lg border border-border p-0.5"
                />
                <input
                  type="text"
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                  className={inp}
                />
              </div>
            </Field>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-muted-foreground">Card & Button Corner Style</label>
            <div className="grid grid-cols-3 gap-2">
              {RADII.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRadius(r.value)}
                  className={cn(
                    "rounded-xl py-2 px-3 border text-xs font-medium text-center transition-all",
                    radius === r.value ? "border-primary bg-primary/10 text-primary font-bold ring-1 ring-primary" : "border-border/60 hover:bg-muted"
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Identity & Logos */}
        <div className="surface-card space-y-4 p-6">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Store className="h-4 w-4 text-primary" /> Identity & Assets
          </div>
          <Field label="Platform Name">
            <input value={siteName} onChange={(e) => setSiteName(e.target.value)} className={inp} placeholder="ResellSeba" required />
          </Field>
          <Field label="Tagline">
            <input value={tagline} onChange={(e) => setTagline(e.target.value)} className={inp} placeholder="Launch your own online store with zero investment" />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Platform Logo (Header & Sidebar)">
              <ImageUploader bucket="branding" folder="branding" value={logo} onChange={setLogo} />
            </Field>
            <Field label="Favicon (Square 1:1)">
              <ImageUploader bucket="branding" folder="branding" value={favicon} onChange={setFavicon} square />
            </Field>
          </div>
        </div>

        {/* SEO & Meta Defaults */}
        <div className="surface-card space-y-4 p-6">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Globe className="h-4 w-4 text-primary" /> SEO & Social Share (OG)
          </div>
          <Field label="Meta Title Template">
            <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className={inp} placeholder="%s — ResellSeba Platform" />
          </Field>
          <Field label="Meta Description">
            <textarea rows={3} value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} className={inp} placeholder="Complete e-commerce reseller platform in Bangladesh." />
          </Field>
          <Field label="OG Social Share Image">
            <ImageUploader bucket="branding" folder="branding" value={og} onChange={setOg} />
          </Field>
        </div>

        {/* Storefront Defaults & Contact */}
        <div className="surface-card space-y-4 p-6">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Layers className="h-4 w-4 text-primary" /> Store Defaults & Contact
          </div>
          <Field label="Flagship Reseller Store">
            <select value={flagshipCode} onChange={(e) => setFlagshipCode(e.target.value)} className={inp}>
              <option value="">— None (show platform landing page) —</option>
              {resellers.map((r) => (
                <option key={r.code} value={r.code}>{r.business_name} ({r.code})</option>
              ))}
            </select>
          </Field>
          <Field label="Shipping Label Default Size">
            <select value={labelSize} onChange={(e) => setLabelSize(e.target.value)} className={inp}>
              <option value="3x3">3x3 inch (Thermal)</option>
              <option value="3x4">3x4 inch (Standard Courier)</option>
            </select>
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Official Phone"><input value={phone} onChange={(e) => setPhone(e.target.value)} className={inp} placeholder="+8801700000000" /></Field>
            <Field label="Support Email"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inp} placeholder="support@resellseba.com" /></Field>
          </div>
        </div>

        <div className="lg:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={busy}
            className="btn-brand inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Save Global Changes
          </button>
        </div>
      </form>
    </div>
  );
}

const inp = "w-full rounded-xl border border-border/70 bg-background/90 px-3.5 py-2 text-xs font-medium text-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-foreground/80">{label}</label>
      {children}
    </div>
  );
}
