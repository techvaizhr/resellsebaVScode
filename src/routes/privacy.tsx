import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/laravel/client";
import { PublicHeader, Brand } from "@/components/public-header";
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  Calendar,
  CheckCircle2,
  Mail,
  Phone,
  Search,
  Printer,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — ResellSeba Platform" },
      {
        name: "description",
        content: "Learn how we collect, use, and protect reseller and customer data on our platform.",
      },
      { property: "og:title", content: "Privacy Policy — ResellSeba Platform" },
      {
        property: "og:description",
        content: "Learn how we collect, use, and protect reseller and customer data on our platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacyPage,
});

const DEFAULT_POLICY = `<h2>1. Introduction & Overview</h2>
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
<p>We may update this Privacy Policy periodically. Continued use of our platform constitutes agreement to the updated terms. If you have any questions or feedback, please reach out to our platform support team.</p>`;

function PrivacyPage() {
  const [policy, setPolicy] = useState<string>(DEFAULT_POLICY);
  const [siteName, setSiteName] = useState("ResellSeba");
  const [tagline, setTagline] = useState("Modern Reseller Platform");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [contactEmail, setContactEmail] = useState<string | null>("support@resellseba.com");
  const [contactPhone, setContactPhone] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("global_settings")
        .select("site_name, tagline, logo_url, privacy_policy, contact_email, contact_phone")
        .eq("id", 1)
        .maybeSingle();
      if (data) {
        if (data.site_name) setSiteName(data.site_name);
        if (data.tagline) setTagline(data.tagline);
        if ((data as any).logo_url) setLogoUrl((data as any).logo_url);
        if ((data as any).privacy_policy) setPolicy((data as any).privacy_policy);
        if (data.contact_email) setContactEmail(data.contact_email);
        if (data.contact_phone) setContactPhone(data.contact_phone);
      }
    })();
  }, []);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      {/* Navigation Header */}
      <PublicHeader siteName={siteName} logoUrl={logoUrl} />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-primary/5 via-background to-background py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted shadow-2xs transition-all"
              >
                <Printer className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Print Document</span>
              </button>
            </div>
          </div>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-3">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Trust & Security</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Privacy Policy
            </h1>
            <p className="mt-2.5 text-sm sm:text-base text-muted-foreground leading-relaxed">
              We are dedicated to safeguarding your personal and business data. This document describes how {siteName} collects, uses, and protects your information.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                <span>Last Updated: March 2026</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-emerald-500" />
                <span>SSL Encrypted & Safe</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Policy Body */}
          <div className="lg:col-span-8">
            <div className="surface-card rounded-2xl border border-border/80 bg-card p-6 sm:p-10 shadow-sm">
              <article
                className="prose prose-sm max-w-none text-foreground/90
                  [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:border-b [&_h2]:border-border/50 [&_h2]:pb-2
                  [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground
                  [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2
                  [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2
                  [&_li]:text-xs sm:[&_li]:text-sm [&_li]:text-muted-foreground [&_li_strong]:text-foreground [&_li_strong]:font-semibold
                  [&_p]:my-3.5 [&_p]:text-xs sm:[&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_p_strong]:text-foreground
                  [&_a]:text-primary [&_a]:underline hover:[&_a]:text-primary/80"
                dangerouslySetInnerHTML={{ __html: policy || DEFAULT_POLICY }}
              />
            </div>
          </div>

          {/* Sticky Sidebar Highlights & Contact */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Guarantees Card */}
            <div className="surface-card rounded-2xl border border-border/80 bg-card p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Our Privacy Commitments</span>
              </div>
              <ul className="space-y-3 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Zero Data Selling:</strong> We never sell your personal data to marketing brokers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Encrypted Transactions:</strong> Financial and payout credentials are cryptographically protected.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Verified Logistics:</strong> Delivery addresses are shared solely for courier dispatch.</span>
                </li>
              </ul>
            </div>

            {/* Need Help / Contact Card */}
            <div className="surface-card rounded-2xl border border-border/80 bg-gradient-to-br from-card to-muted/20 p-5 shadow-2xs space-y-3">
              <h3 className="font-bold text-sm text-foreground">Have Questions?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                If you need clarification about your data rights or store policies, our support desk is ready to help.
              </p>
              <div className="pt-2 space-y-2 text-xs">
                {contactEmail && (
                  <a
                    href={`mailto:${contactEmail}`}
                    className="flex items-center gap-2 rounded-xl border border-border/60 bg-background px-3 py-2 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors font-medium"
                  >
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    <span className="truncate">{contactEmail}</span>
                  </a>
                )}
                {contactPhone && (
                  <a
                    href={`tel:${contactPhone}`}
                    className="flex items-center gap-2 rounded-xl border border-border/60 bg-background px-3 py-2 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors font-medium"
                  >
                    <Phone className="h-3.5 w-3.5 text-emerald-500" />
                    <span>{contactPhone}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Platform Information */}
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 text-[11px] text-muted-foreground space-y-1.5">
              <div className="font-bold text-foreground">{siteName}</div>
              <div>{tagline}</div>
              <div>Operated under official platform governance standards.</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-card mt-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <div className="flex items-center gap-2.5">
            <Brand siteName={siteName} logoUrl={logoUrl} size="sm" />
            <span>© {new Date().getFullYear()} {siteName}. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-5 font-medium">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/catalog" search={{}} className="hover:text-primary transition-colors">Catalog</Link>
            <Link to="/privacy" className="font-bold text-primary">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
