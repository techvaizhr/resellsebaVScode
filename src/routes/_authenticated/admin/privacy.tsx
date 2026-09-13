import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/laravel/client";
import { clearAppDataCache } from "@/lib/app-data";
import { PageHeader } from "@/components/ui-kit";
import {
  Loader2,
  Save,
  Eye,
  Edit3,
  Code2,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle2,
  RefreshCw,
  FileText,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { RichTextEditor } from "@/components/RichTextEditor";

export const Route = createFileRoute("/_authenticated/admin/privacy")({
  component: PrivacyEditor,
});

const DEFAULT_STARTER = `<h2>1. Introduction & Overview</h2>
<p>Welcome to our platform. We value your privacy and are committed to protecting your personal information. This Privacy Policy explains what data we collect, why we collect it, how it is secured, and your rights as a reseller or customer.</p>

<h2>2. Information We Collect</h2>
<ul>
  <li><strong>Account Information:</strong> Name, phone number, email address, store name, and login credentials.</li>
  <li><strong>Order & Delivery Data:</strong> Customer full name, delivery address, phone number, and ordered products.</li>
  <li><strong>Financial & Payment Details:</strong> Payout accounts (bKash, Nagad, Bank details) and transaction histories for commission settlements.</li>
  <li><strong>Device & Usage Data:</strong> IP address, device type, browser information, and activity logs to prevent fraud.</li>
</ul>

<h2>3. How We Use Your Information</h2>
<ul>
  <li>To provide, operate, and maintain reseller accounts and storefronts.</li>
  <li>To process and deliver customer orders smoothly through integrated courier services (Steadfast, Pathao, RedX).</li>
  <li>To calculate accurate profit margins, commissions, bonuses, and process payout requests.</li>
  <li>To provide customer support and broadcast platform announcements.</li>
  <li>To monitor security, detect fraud, and protect user accounts.</li>
</ul>

<h2>4. Third-Party Sharing & Couriers</h2>
<p>We do not sell, rent, or trade personal data to third parties for marketing. We only share necessary delivery information (name, address, phone number) with verified courier and logistics partners strictly for parcel delivery.</p>

<h2>5. Data Security & Storage</h2>
<ul>
  <li>All data transmissions are encrypted using standard SSL/TLS protocols.</li>
  <li>Sensitive financial and credential data are securely stored with restricted role-based access control.</li>
  <li>Regular system updates and automated backups ensure high availability and data integrity.</li>
</ul>

<h2>6. Reseller Responsibilities</h2>
<ul>
  <li>Resellers must handle end-customer information with strict confidentiality.</li>
  <li>Resellers agree not to disclose customer phone numbers or addresses to unauthorized parties.</li>
  <li>Keep your login credentials secure and enable two-factor authentication if available.</li>
</ul>

<h2>7. Policy Updates & Contact</h2>
<p>We may update this Privacy Policy periodically. Continued use of our platform constitutes agreement to the updated terms. If you have any questions or feedback, please reach out to our platform support team.</p>

<p><em>Last updated: March 2026</em></p>`;

const TEMPLATES = [
  {
    name: "Standard Reseller & E-commerce Policy",
    content: DEFAULT_STARTER,
  },
  {
    name: "Short & Minimal Privacy Policy",
    content: `<h2>1. Data Collection</h2>
<p>We collect essential information such as name, phone number, address, and transaction records to process orders, facilitate courier deliveries, and settle reseller commissions.</p>

<h2>2. Data Usage & Security</h2>
<p>Your data is encrypted and stored safely. We never sell your personal information. Logistics partners receive only delivery details necessary to deliver packages.</p>

<h2>3. Contact Support</h2>
<p>If you have any questions regarding your data privacy, please contact our support team via dashboard help desk.</p>`,
  },
];

function PrivacyEditor() {
  const [content, setContent] = useState(DEFAULT_STARTER);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"visual" | "code" | "preview">("visual");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("global_settings")
        .select("privacy_policy")
        .eq("id", 1)
        .maybeSingle();
      if ((data as any)?.privacy_policy) {
        setContent((data as any).privacy_policy);
      }
      setLoading(false);
    })();
  }, []);

  async function save() {
    setBusy(true);
    try {
      const { error } = await supabase
        .from("global_settings")
        .update({ privacy_policy: content })
        .eq("id", 1);
      clearAppDataCache("settings");
      if (error) throw error;
      toast.success("Privacy Policy saved successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save privacy policy");
    } finally {
      setBusy(false);
    }
  }

  const applyTemplate = (templateContent: string) => {
    if (confirm("Replace current editor content with this starter template?")) {
      setContent(templateContent);
      toast.success("Template loaded into editor!");
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-[400px] place-items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PageHeader
          title="Privacy Policy Editor"
          description="Create and customize the public privacy policy for your platform. Content updates reflect live instantly on /privacy."
        />
        <div className="flex items-center gap-2">
          <Link
            to="/privacy"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-all shadow-xs"
          >
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            <span>View Public Page</span>
          </Link>
          <button
            type="button"
            onClick={save}
            disabled={busy}
            className="btn-brand inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Editor & Toolbar Container */}
      <div className="surface-card overflow-hidden border border-border/80 shadow-md rounded-2xl">
        {/* Navigation & Mode Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/20 px-4 sm:px-6 py-3">
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/40">
            <button
              type="button"
              onClick={() => setMode("visual")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                mode === "visual"
                  ? "bg-background text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Visual Editor</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("code")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                mode === "code"
                  ? "bg-background text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>HTML Source</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("preview")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                mode === "preview"
                  ? "bg-background text-primary shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Live Preview</span>
            </button>
          </div>

          {/* Templates Dropdown / Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Starters:</span>
            {TEMPLATES.map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyTemplate(tmpl.content)}
                className="inline-flex items-center gap-1 rounded-lg border border-border/70 bg-background px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:border-primary/50 hover:text-primary transition-all"
              >
                <Sparkles className="h-3 w-3 text-amber-500" />
                <span>{idx === 0 ? "Standard" : "Minimal"}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 bg-card min-h-[420px]">
          {mode === "visual" && (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Easy Visual Mode — type directly, create bullet points, headings, and bold text without touching HTML.</span>
              </div>
              <div className="rounded-xl border border-border/80 bg-background overflow-hidden shadow-2xs">
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Write your privacy policy content here..."
                />
              </div>
            </div>
          )}

          {mode === "code" && (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                <Code2 className="h-3.5 w-3.5 text-primary" />
                <span>Raw HTML Code Mode — direct source code editing for advanced styling.</span>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={20}
                className="w-full rounded-xl border border-border/80 bg-muted/10 p-4 font-mono text-xs leading-relaxed text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Write or paste HTML..."
              />
            </div>
          )}

          {mode === "preview" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Public Live Appearance Preview</span>
                </div>
                <span className="text-[11px] text-muted-foreground">Matches /privacy layout</span>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-10 shadow-sm max-w-4xl mx-auto">
                <div className="mb-6 border-b border-border/60 pb-5">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-[11px] font-bold text-primary">
                    <ShieldCheck className="h-3 w-3" />
                    Legal & Privacy
                  </span>
                  <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-foreground">
                    Privacy Policy
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                    How data is collected, handled, and protected on this platform.
                  </p>
                </div>

                <div
                  className="prose prose-sm max-w-none text-foreground/90 
                    [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:border-b [&_h2]:border-border/40 [&_h2]:pb-1.5
                    [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground
                    [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5
                    [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5
                    [&_li]:text-xs sm:[&_li]:text-sm [&_li]:text-muted-foreground [&_li_strong]:text-foreground
                    [&_p]:my-3 [&_p]:text-xs sm:[&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_p_strong]:text-foreground
                    [&_a]:text-primary [&_a]:underline hover:[&_a]:text-primary/80"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-border/60 bg-muted/10 px-4 sm:px-6 py-3 text-xs text-muted-foreground">
          <span>Public URL: <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground">/privacy</code></span>
          <span>Tip: Switch to Visual Editor for fast writing without coding.</span>
        </div>
      </div>
    </div>
  );
}
