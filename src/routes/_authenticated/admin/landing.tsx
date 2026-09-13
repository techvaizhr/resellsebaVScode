import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/laravel/client";
import { clearAppDataCache } from "@/lib/app-data";
import { PageHeader } from "@/components/ui-kit";
import { ImageUploader, type UploadedImage } from "@/components/ImageUploader";
import { Loader2, Plus, Trash2, ExternalLink, RotateCcw, Save, Sparkles, HelpCircle, Layers, Menu, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { APP_ICON_NAMES } from "@/lib/icons";
import { DEFAULT_LANDING_CONTENT, mergeLandingContent, type LandingContent } from "@/lib/landing-content";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/admin/landing")({
  component: LandingEditor,
});

const ICONS = APP_ICON_NAMES;

function LandingEditor() {
  const [c, setC] = useState<LandingContent>(DEFAULT_LANDING_CONTENT);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from("global_settings")
          .select("landing_content")
          .eq("id", 1)
          .maybeSingle();

        const raw = (data as any)?.landing_content;
        setC(mergeLandingContent(raw));
      } catch (err) {
        console.error("Failed to load landing content:", err);
        setC(DEFAULT_LANDING_CONTENT);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function save() {
    if (!c) return;
    setBusy(true);
    try {
      const { error } = await supabase
        .from("global_settings")
        .upsert({
          id: 1,
          landing_content: c,
        } as any);

      clearAppDataCache("settings");
      if (error) {
        toast.error("Save failed: " + error.message);
      } else {
        toast.success("Landing page content saved successfully!");
      }
    } catch (err: any) {
      toast.error("Failed to save: " + (err?.message || "Unknown error"));
    } finally {
      setBusy(false);
    }
  }

  const resetToDefault = () => {
    if (window.confirm("Are you sure you want to reset all landing page content to default values?")) {
      setC(JSON.parse(JSON.stringify(DEFAULT_LANDING_CONTENT)));
      toast.info("Landing content reset to defaults (click Save to apply)");
    }
  };

  const update = (fn: (draft: LandingContent) => void) => {
    const next = JSON.parse(JSON.stringify(c)) as LandingContent;
    fn(next);
    setC(next);
  };

  if (loading) {
    return (
      <div className="grid place-items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-3 text-sm text-muted-foreground">Loading landing page editor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <PageHeader
        title="Landing Page Editor"
        description="Customize the homepage content, hero banner, features, FAQs, and workflow shown on your main domain."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold hover:bg-muted transition-all active:scale-95"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View Live Page
            </a>
            <button
              type="button"
              onClick={resetToDefault}
              className="inline-flex items-center gap-1.5 rounded-xl border border-destructive/30 px-3.5 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-all active:scale-95"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset Defaults
            </button>
            <button
              type="button"
              onClick={save}
              disabled={busy}
              className="btn-brand inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold shadow-md disabled:opacity-50 transition-all active:scale-95"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Landing Page
            </button>
          </div>
        }
      />

      {/* Tabbed Editor Container */}
      <Tabs defaultValue="hero" className="w-full space-y-6">
        <div className="overflow-x-auto pb-1">
          <TabsList className="h-auto p-1.5 bg-muted/60 border border-border/70 rounded-2xl flex flex-nowrap md:flex-wrap gap-1.5 w-max md:w-full">
            <TabsTrigger
              value="hero"
              className="flex items-center gap-2 rounded-xl py-2 px-3 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" /> Hero Banner
            </TabsTrigger>
            <TabsTrigger
              value="nav"
              className="flex items-center gap-2 rounded-xl py-2 px-3 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
            >
              <Menu className="h-3.5 w-3.5" /> Navigation &amp; Menu
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="flex items-center gap-2 rounded-xl py-2 px-3 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
            >
              <Layers className="h-3.5 w-3.5" /> Statistics
            </TabsTrigger>
            <TabsTrigger
              value="features"
              className="flex items-center gap-2 rounded-xl py-2 px-3 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" /> Features Grid
            </TabsTrigger>
            <TabsTrigger
              value="workflow"
              className="flex items-center gap-2 rounded-xl py-2 px-3 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
            >
              <Layers className="h-3.5 w-3.5" /> How It Works
            </TabsTrigger>
            <TabsTrigger
              value="faq"
              className="flex items-center gap-2 rounded-xl py-2 px-3 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
            >
              <HelpCircle className="h-3.5 w-3.5" /> FAQs
            </TabsTrigger>
            <TabsTrigger
              value="cta_footer"
              className="flex items-center gap-2 rounded-xl py-2 px-3 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
            >
              <ImageIcon className="h-3.5 w-3.5" /> CTA &amp; Footer
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Hero Section */}
        <TabsContent value="hero" className="space-y-4 focus-visible:outline-none">
          <Section
            title="Hero Section &amp; Banner"
            icon={<Sparkles className="h-4 w-4 text-primary" />}
            desc="Main visual banner and heading seen first by visitors on your home page"
          >
            <F label="Top Badge Label">
              <I value={c.hero?.badge ?? ""} onChange={(v) => update((d) => { d.hero.badge = v; })} />
            </F>
            <Grid>
              <F label="Main Headline (Start)">
                <I value={c.hero?.titleStart ?? ""} onChange={(v) => update((d) => { d.hero.titleStart = v; })} />
              </F>
              <F label="Highlighted Headline Part (Gradient)">
                <I value={c.hero?.titleHighlight ?? ""} onChange={(v) => update((d) => { d.hero.titleHighlight = v; })} />
              </F>
            </Grid>
            <F label="Subtitle / Description">
              <T value={c.hero?.subtitle ?? ""} onChange={(v) => update((d) => { d.hero.subtitle = v; })} />
            </F>
            <Grid>
              <F label="Primary CTA Button Text">
                <I value={c.hero?.ctaPrimary ?? ""} onChange={(v) => update((d) => { d.hero.ctaPrimary = v; })} />
              </F>
              <F label="Secondary CTA Button Text">
                <I value={c.hero?.ctaSecondary ?? ""} onChange={(v) => update((d) => { d.hero.ctaSecondary = v; })} />
              </F>
            </Grid>
            <F label="Trust Badges (comma separated)">
              <I
                value={(c.hero?.badges ?? []).join(", ")}
                onChange={(v) =>
                  update((d) => {
                    d.hero.badges = v.split(",").map((s) => s.trim()).filter(Boolean);
                  })
                }
              />
            </F>
            <F label="Hero Banner Image (WebP supported)">
              <ImageUploader
                bucket="branding"
                folder="branding"
                value={c.hero?.bannerImage?.url ? [{ path: c.hero.bannerImage.path || "", url: c.hero.bannerImage.url, bytes: c.hero.bannerImage.bytes || 0 }] : []}
                onChange={(v) =>
                  update((d) => {
                    d.hero.bannerImage = v[0] ? { url: v[0].url, path: v[0].path, bytes: v[0].bytes } : null;
                  })
                }
                label="Upload Hero Banner"
                variant="hero"
              />
            </F>
          </Section>
        </TabsContent>

        {/* Tab 2: Navigation Header Menu */}
        <TabsContent value="nav" className="space-y-4 focus-visible:outline-none">
          <Section
            title="Navigation &amp; Header Menu"
            icon={<Menu className="h-4 w-4 text-primary" />}
            desc="Text labels and buttons displayed in the top navigation bar"
          >
            <Grid>
              <F label="Features Link">
                <I value={c.nav?.features ?? ""} onChange={(v) => update((d) => { d.nav.features = v; })} />
              </F>
              <F label="How it works Link">
                <I value={c.nav?.how ?? ""} onChange={(v) => update((d) => { d.nav.how = v; })} />
              </F>
              <F label="Categories Link">
                <I value={c.nav?.categories ?? ""} onChange={(v) => update((d) => { d.nav.categories = v; })} />
              </F>
              <F label="FAQ Link">
                <I value={c.nav?.faq ?? ""} onChange={(v) => update((d) => { d.nav.faq = v; })} />
              </F>
              <F label="Sign In Button">
                <I value={c.nav?.signIn ?? ""} onChange={(v) => update((d) => { d.nav.signIn = v; })} />
              </F>
              <F label="Primary CTA Button">
                <I value={c.nav?.cta ?? ""} onChange={(v) => update((d) => { d.nav.cta = v; })} />
              </F>
            </Grid>
          </Section>
        </TabsContent>

        {/* Tab 3: Stats Band */}
        <TabsContent value="stats" className="space-y-4 focus-visible:outline-none">
          <Section
            title="Platform Statistics"
            icon={<Layers className="h-4 w-4 text-primary" />}
            desc="Highlight numbers, verified products, active suppliers, or custom counters"
          >
            <F label="Section Title">
              <I value={c.stats?.title ?? ""} onChange={(v) => update((d) => { d.stats = { ...(d.stats ?? { items: [] }), title: v }; })} />
            </F>
            <div className="space-y-3">
              {(c.stats?.items ?? []).map((s, i) => (
                <div key={i} className="rounded-xl border border-border/80 bg-muted/20 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">Stat Item #{i + 1}</span>
                    <button
                      type="button"
                      onClick={() => update((d) => { d.stats!.items.splice(i, 1); })}
                      className="p-1 text-destructive hover:bg-destructive/10 rounded-md transition-all"
                      title="Remove Stat"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <Grid>
                    <F label="Value (e.g. 10,000+)">
                      <I value={s.value} onChange={(v) => update((d) => { d.stats!.items[i].value = v; })} />
                    </F>
                    <F label="Label (e.g. Verified Products)">
                      <I value={s.label} onChange={(v) => update((d) => { d.stats!.items[i].label = v; })} />
                    </F>
                  </Grid>
                </div>
              ))}
              {(c.stats?.items?.length ?? 0) < 6 && (
                <button
                  type="button"
                  onClick={() =>
                    update((d) => {
                      d.stats = { items: [...(d.stats?.items ?? []), { value: "1,000+", label: "New Stat" }] };
                    })
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold hover:bg-muted transition-all"
                >
                  <Plus className="h-3.5 w-3.5 text-primary" /> Add Stat Item
                </button>
              )}
            </div>
          </Section>
        </TabsContent>

        {/* Tab 4: Features Section */}
        <TabsContent value="features" className="space-y-4 focus-visible:outline-none">
          <Section
            title="Features &amp; Benefits Grid"
            icon={<Sparkles className="h-4 w-4 text-primary" />}
            desc="Highlight core platform features that attract resellers and suppliers"
          >
            <Grid>
              <F label="Section Title">
                <I value={c.features?.title ?? ""} onChange={(v) => update((d) => { d.features.title = v; })} />
              </F>
              <F label="Section Subtitle">
                <I value={c.features?.subtitle ?? ""} onChange={(v) => update((d) => { d.features.subtitle = v; })} />
              </F>
            </Grid>
            <div className="space-y-3 mt-4">
              {(c.features?.items ?? []).map((f, i) => (
                <div key={i} className="rounded-xl border border-border/80 bg-muted/20 p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">Feature #{i + 1}</span>
                    <button
                      type="button"
                      onClick={() => update((d) => { d.features.items.splice(i, 1); })}
                      className="p-1 text-destructive hover:bg-destructive/10 rounded-md transition-all"
                      title="Remove Feature"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium">Icon</label>
                      <select
                        value={f.icon}
                        onChange={(e) => update((d) => { d.features.items[i].icon = e.target.value; })}
                        className={inp}
                      >
                        {ICONS.map((ic) => (
                          <option key={ic} value={ic}>{ic}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <F label="Title">
                        <I value={f.title} onChange={(v) => update((d) => { d.features.items[i].title = v; })} />
                      </F>
                    </div>
                  </div>
                  <F label="Description">
                    <T value={f.desc} onChange={(v) => update((d) => { d.features.items[i].desc = v; })} />
                  </F>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  update((d) => {
                    d.features.items.push({ icon: "Sparkles", title: "New Platform Feature", desc: "Detailed description of feature and advantage." });
                  })
                }
                className="inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold hover:bg-muted transition-all"
              >
                <Plus className="h-3.5 w-3.5 text-primary" /> Add Feature Card
              </button>
            </div>
          </Section>
        </TabsContent>

        {/* Tab 5: How it Works / Workflow Steps */}
        <TabsContent value="workflow" className="space-y-4 focus-visible:outline-none">
          <Section
            title="Reseller Workflow (How It Works)"
            icon={<Layers className="h-4 w-4 text-primary" />}
            desc="Visual step-by-step pipeline illustrating how an order flows from placement to payout"
          >
            <Grid>
              <F label="Badge Label">
                <I value={c.about?.badge ?? ""} onChange={(v) => update((d) => { d.about = { ...(d.about ?? { badge: "", title: "", body: "", points: [] }), badge: v }; })} />
              </F>
              <F label="Title">
                <I value={c.about?.title ?? ""} onChange={(v) => update((d) => { d.about = { ...(d.about ?? { badge: "", title: "", body: "", points: [] }), title: v }; })} />
              </F>
            </Grid>
            <F label="Intro Summary Text">
              <T value={c.about?.body ?? ""} onChange={(v) => update((d) => { d.about = { ...(d.about ?? { badge: "", title: "", body: "", points: [] }), body: v }; })} />
            </F>
            <div className="space-y-3">
              {(c.about?.flow ?? []).map((f, i) => (
                <div key={i} className="rounded-xl border border-border/80 bg-muted/20 p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">Workflow Step #{i + 1}</span>
                    <button
                      type="button"
                      onClick={() => update((d) => { d.about!.flow!.splice(i, 1); })}
                      className="p-1 text-destructive hover:bg-destructive/10 rounded-md transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium">Icon</label>
                      <select
                        value={f.icon}
                        onChange={(e) => update((d) => { d.about!.flow![i].icon = e.target.value; })}
                        className={inp}
                      >
                        {ICONS.map((ic) => (
                          <option key={ic} value={ic}>{ic}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <F label="Step Title">
                        <I value={f.title} onChange={(v) => update((d) => { d.about!.flow![i].title = v; })} />
                      </F>
                    </div>
                  </div>
                  <F label="Step Description">
                    <T value={f.desc} onChange={(v) => update((d) => { d.about!.flow![i].desc = v; })} />
                  </F>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  update((d) => {
                    d.about = {
                      ...(d.about ?? { badge: "", title: "", body: "", points: [] }),
                      flow: [...(d.about?.flow ?? []), { icon: "ClipboardList", title: "New Step", desc: "Step description" }],
                    };
                  })
                }
                className="inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold hover:bg-muted transition-all"
              >
                <Plus className="h-3.5 w-3.5 text-primary" /> Add Workflow Step
              </button>
            </div>
          </Section>
        </TabsContent>

        {/* Tab 6: FAQ Section */}
        <TabsContent value="faq" className="space-y-4 focus-visible:outline-none">
          <Section
            title="Frequently Asked Questions (FAQ)"
            icon={<HelpCircle className="h-4 w-4 text-primary" />}
            desc="Answer common questions regarding margins, courier delivery, payments and refunds"
          >
            <Grid>
              <F label="FAQ Section Title">
                <I value={c.faq?.title ?? ""} onChange={(v) => update((d) => { d.faq = { ...(d.faq ?? { title: "", subtitle: "", items: [] }), title: v }; })} />
              </F>
              <F label="FAQ Subtitle">
                <I value={c.faq?.subtitle ?? ""} onChange={(v) => update((d) => { d.faq = { ...(d.faq ?? { title: "", subtitle: "", items: [] }), subtitle: v }; })} />
              </F>
            </Grid>
            <div className="space-y-3 mt-3">
              {(c.faq?.items ?? []).map((item, i) => (
                <div key={i} className="rounded-xl border border-border/80 bg-muted/20 p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">FAQ #{i + 1}</span>
                    <button
                      type="button"
                      onClick={() => update((d) => { d.faq!.items.splice(i, 1); })}
                      className="p-1 text-destructive hover:bg-destructive/10 rounded-md transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <F label="Question">
                    <I value={item.q} onChange={(v) => update((d) => { d.faq!.items[i].q = v; })} />
                  </F>
                  <F label="Answer">
                    <T value={item.a} onChange={(v) => update((d) => { d.faq!.items[i].a = v; })} />
                  </F>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  update((d) => {
                    d.faq = {
                      ...(d.faq ?? { title: "", subtitle: "", items: [] }),
                      items: [...(d.faq?.items ?? []), { q: "New Question?", a: "Detailed answer." }],
                    };
                  })
                }
                className="inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold hover:bg-muted transition-all"
              >
                <Plus className="h-3.5 w-3.5 text-primary" /> Add FAQ Item
              </button>
            </div>
          </Section>
        </TabsContent>

        {/* Tab 7: Bottom CTA Banner & Footer Tagline */}
        <TabsContent value="cta_footer" className="space-y-6 focus-visible:outline-none">
          <Section
            title="Bottom Call-to-Action (CTA)"
            icon={<Sparkles className="h-4 w-4 text-primary" />}
            desc="Final conversion block at the bottom of the landing page"
          >
            <Grid>
              <F label="Badge Label">
                <I value={c.cta?.badge ?? ""} onChange={(v) => update((d) => { d.cta.badge = v; })} />
              </F>
              <F label="CTA Button Text">
                <I value={c.cta?.button ?? ""} onChange={(v) => update((d) => { d.cta.button = v; })} />
              </F>
            </Grid>
            <F label="Headline">
              <I value={c.cta?.title ?? ""} onChange={(v) => update((d) => { d.cta.title = v; })} />
            </F>
            <F label="Subtitle">
              <T value={c.cta?.subtitle ?? ""} onChange={(v) => update((d) => { d.cta.subtitle = v; })} />
            </F>
          </Section>

          <Section
            title="Footer Brand Tagline"
            icon={<Menu className="h-4 w-4 text-primary" />}
            desc="Closing statement displayed in the website footer"
          >
            <F label="Footer Tagline">
              <I value={c.footer?.tagline ?? ""} onChange={(v) => update((d) => { d.footer.tagline = v; })} />
            </F>
          </Section>
        </TabsContent>
      </Tabs>

      {/* Sticky Save Bar */}
      <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-2xl border border-border/80 bg-background/90 p-4 shadow-xl backdrop-blur-md">
        <div className="text-xs text-muted-foreground">
          Remember to save your changes to update the live homepage.
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetToDefault}
            className="inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted transition-all active:scale-95"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
          <button
            type="button"
            onClick={save}
            disabled={busy}
            className="btn-brand inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold shadow-md disabled:opacity-50 transition-all active:scale-95"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Landing Page
          </button>
        </div>
      </div>
    </div>
  );
}

const inp = "w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-xs font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";

function I({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} className={inp} />;
}

function T({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={inp} />;
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-foreground/80">{label}</label>
      {children}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

function Section({
  title,
  icon,
  desc,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="surface-card space-y-4 p-6 border border-border/70 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2.5">
        {icon}
        <div>
          <h3 className="text-sm font-bold text-foreground">{title}</h3>
          {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
        </div>
      </div>
      <div className="pt-2">{children}</div>
    </div>
  );
}
