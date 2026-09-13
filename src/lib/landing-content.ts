import { APP_ICON_NAMES } from "@/lib/icons";

export type Feature = { icon: string; title: string; desc: string };
export type Step = { title: string; desc: string };
export type FlowStep = { icon: string; title: string; desc: string };
export type FaqItem = { q: string; a: string };
export type StatItem = { value: string; label: string };
export type HeroImage = { path?: string; url: string; bytes?: number } | null;

export type LandingContent = {
  nav: {
    features: string;
    how: string;
    categories?: string;
    signIn: string;
    cta: string;
    faq?: string;
  };
  hero: {
    badge: string;
    titleStart: string;
    titleHighlight: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    badges: string[];
    bannerImage?: HeroImage;
  };
  stats?: { title?: string; items: StatItem[] };
  about?: { badge: string; title: string; body: string; points: string[]; flow?: FlowStep[] };
  features: { title: string; subtitle: string; items: Feature[] };
  how: { title: string; subtitle: string; steps: Step[] };
  faq?: { title: string; subtitle: string; items: FaqItem[] };
  cta: { badge: string; title: string; subtitle: string; button: string };
  footer: { tagline: string };
};

export const DEFAULT_LANDING_CONTENT: LandingContent = {
  nav: {
    features: "Features",
    how: "How it works",
    categories: "Categories",
    faq: "FAQ",
    signIn: "লগইন",
    cta: "Get started",
  },
  hero: {
    badge: "Bangladesh's reseller platform",
    titleStart: "Launch your own online store",
    titleHighlight: "with zero investment",
    subtitle: "Pick products from the master catalog and list them with your own profit margin. We handle warehousing, courier packing, delivery and payment collection.",
    ctaPrimary: "Sign up as Reseller",
    ctaSecondary: "Sign in",
    badges: ["No setup fee", "Verified Suppliers", "Automated Courier Tracking", "Weekly Payouts"],
    bannerImage: {
      url: "/uploads/branding/1746e3c9-7c6f-49cb-95a3-a18724e47970.webp",
      path: "uploads/branding/1746e3c9-7c6f-49cb-95a3-a18724e47970.webp",
    },
  },
  stats: {
    title: "Platform at a glance",
    items: [
      { value: "10,000+", label: "Verified Products" },
      { value: "500+", label: "Active Suppliers" },
      { value: "50,000+", label: "Delivered Orders" },
      { value: "24/7", label: "Dedicated Support" },
    ],
  },
  about: {
    badge: "How ResellSeba Works",
    title: "Simple 5-step process from listing to payout",
    body: "You just sell, we handle the rest. Every step, from generating orders to withdrawing profit, is clear and trackable.",
    points: [
      "Zero product stock risk",
      "Automated courier dispatch & real-time tracking",
      "Instant profit credit on successful delivery",
      "Direct withdrawal to bKash, Nagad or Bank",
    ],
    flow: [
      {
        icon: "ClipboardList",
        title: "1. Generate order",
        desc: "Customer places order on your store or you submit customer order in your reseller panel.",
      },
      {
        icon: "Send",
        title: "2. Forward to supplier/admin",
        desc: "Confirmed orders are automatically routed for fulfillment and quality inspection.",
      },
      {
        icon: "PackageCheck",
        title: "3. Packaging & Courier",
        desc: "Product is packed with care and handed over to Steadfast, Pathao or CarryBee.",
      },
      {
        icon: "Coins",
        title: "4. Profit Credited",
        desc: "Once delivered, your profit margin is immediately credited to your withdrawable wallet.",
      },
      {
        icon: "BanknoteArrowDown",
        title: "5. Withdraw earnings",
        desc: "Submit withdrawal requests anytime to bKash, Nagad or Bank account.",
      },
    ],
  },
  features: {
    title: "Everything you need to scale",
    subtitle: "From products to payments — everything in one powerful panel",
    items: [
      {
        icon: "Boxes",
        title: "Thousands of products, listed in one click",
        desc: "Verified catalog, HD images, SEO content — no need to buy advance stock.",
      },
      {
        icon: "Wallet",
        title: "Set your own profit margin",
        desc: "See wholesale cost, set your desired customer price — the full profit difference is yours.",
      },
      {
        icon: "Truck",
        title: "Automated courier booking",
        desc: "Steadfast, Pathao, CarryBee integrations — from consignment creation to live tracking.",
      },
      {
        icon: "Globe",
        title: "Your own branded online store",
        desc: "Custom domain, logo, brand colors, themes — customers only see your store brand.",
      },
      {
        icon: "Wallet",
        title: "Seamless customer payments",
        desc: "bKash, Nagad, Rocket, SSLCommerz, EPS, and Cash on Delivery (COD).",
      },
      {
        icon: "Megaphone",
        title: "Conversion API & Ads Tracking",
        desc: "Facebook Pixel/CAPI + TikTok Events API — accurately track ROAS and ad sales.",
      },
      {
        icon: "BarChart3",
        title: "Real-time analytics & reports",
        desc: "Track sales, delivered revenue, return rates, and upcoming profit in real time.",
      },
      {
        icon: "ShieldCheck",
        title: "100% Data Privacy & Security",
        desc: "Your customer list, order history, and profit data are strictly private and isolated.",
      },
      {
        icon: "Sparkles",
        title: "Team & Agent Commission",
        desc: "Manage staff permissions, sales agents, and multi-tier commission structures easily.",
      },
    ],
  },
  how: {
    title: "How to get started",
    subtitle: "Start your ecommerce business today in 3 easy steps",
    steps: [
      {
        title: "1. Create your reseller account",
        desc: "Sign up with your mobile number, verify OTP, and access the seller dashboard.",
      },
      {
        title: "2. Choose products & set prices",
        desc: "Browse high-demand products, add them to your store, and set your profit margins.",
      },
      {
        title: "3. Share & start earning",
        desc: "Promote products on Facebook, TikTok, or your website and start receiving payouts.",
      },
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Got questions? We've got answers.",
    items: [
      {
        q: "How can I become a reseller on ResellSeba?",
        a: "Sign up, verify your mobile number, set up your store profile, and start listing products from our catalog immediately.",
      },
      {
        q: "Do I need any initial investment or stock?",
        a: "No investment is needed. You don't buy or store stock. When your customer places an order, the admin and supplier pack and deliver it directly.",
      },
      {
        q: "Who determines the selling price and profit?",
        a: "You do! We provide the base wholesale cost and delivery fee. You set whatever selling price you want, and keep 100% of the profit margin.",
      },
      {
        q: "Which courier services are supported?",
        a: "We support Steadfast, Pathao, CarryBee, and Paperfly with automated consignment booking and real-time status tracking.",
      },
      {
        q: "How and when do I receive my profit payouts?",
        a: "As soon as an order is marked 'Delivered' by the courier, your profit is added to your available balance. You can withdraw to bKash, Nagad, or Bank anytime.",
      },
      {
        q: "Can I connect my own custom domain?",
        a: "Yes! You can connect your custom domain (e.g., yourbrand.com) with free automated SSL certificates and Cloudflare integration.",
      },
      {
        q: "How are customer returns handled?",
        a: "If a parcel is returned or rejected, the return tracking is updated automatically in your panel with courier return reasons.",
      },
    ],
  },
  cta: {
    badge: "Join thousands of successful sellers",
    title: "Start your online business journey today",
    subtitle: "Zero stock risk, verified suppliers, high profit margins, and same-day courier dispatch.",
    button: "Create Free Reseller Account",
  },
  footer: {
    tagline: "Empowering next-generation online entrepreneurs across Bangladesh.",
  },
};

/** Deeply merges raw/saved landing content with complete fallbacks to prevent undefined access crashes. */
export function mergeLandingContent(raw: unknown): LandingContent {
  let saved: any = raw;
  if (typeof saved === "string") {
    try {
      saved = JSON.parse(saved);
    } catch {
      saved = null;
    }
  }

  if (!saved || typeof saved !== "object") {
    return JSON.parse(JSON.stringify(DEFAULT_LANDING_CONTENT));
  }

  const def = DEFAULT_LANDING_CONTENT;

  return {
    nav: {
      features: saved.nav?.features || def.nav.features,
      how: saved.nav?.how || def.nav.how,
      categories: saved.nav?.categories || def.nav.categories,
      faq: saved.nav?.faq || def.nav.faq,
      signIn: saved.nav?.signIn || def.nav.signIn,
      cta: saved.nav?.cta || def.nav.cta,
    },
    hero: {
      badge: saved.hero?.badge ?? def.hero.badge,
      titleStart: saved.hero?.titleStart ?? def.hero.titleStart,
      titleHighlight: saved.hero?.titleHighlight ?? def.hero.titleHighlight,
      subtitle: saved.hero?.subtitle ?? def.hero.subtitle,
      ctaPrimary: saved.hero?.ctaPrimary ?? def.hero.ctaPrimary,
      ctaSecondary: saved.hero?.ctaSecondary ?? def.hero.ctaSecondary,
      badges: Array.isArray(saved.hero?.badges) && saved.hero.badges.length > 0
        ? saved.hero.badges
        : def.hero.badges,
      bannerImage: saved.hero?.bannerImage ?? def.hero.bannerImage,
    },
    stats: {
      title: saved.stats?.title ?? def.stats?.title,
      items: Array.isArray(saved.stats?.items) && saved.stats.items.length > 0
        ? saved.stats.items
        : (def.stats?.items ?? []),
    },
    about: {
      badge: saved.about?.badge ?? def.about?.badge ?? "",
      title: saved.about?.title ?? def.about?.title ?? "",
      body: saved.about?.body ?? def.about?.body ?? "",
      points: Array.isArray(saved.about?.points) && saved.about.points.length > 0
        ? saved.about.points
        : (def.about?.points ?? []),
      flow: Array.isArray(saved.about?.flow) && saved.about.flow.length > 0
        ? saved.about.flow
        : (def.about?.flow ?? []),
    },
    features: {
      title: saved.features?.title ?? def.features.title,
      subtitle: saved.features?.subtitle ?? def.features.subtitle,
      items: Array.isArray(saved.features?.items) && saved.features.items.length > 0
        ? saved.features.items
        : def.features.items,
    },
    how: {
      title: saved.how?.title ?? def.how.title,
      subtitle: saved.how?.subtitle ?? def.how.subtitle,
      steps: Array.isArray(saved.how?.steps) && saved.how.steps.length > 0
        ? saved.how.steps
        : def.how.steps,
    },
    faq: {
      title: saved.faq?.title ?? def.faq?.title ?? "",
      subtitle: saved.faq?.subtitle ?? def.faq?.subtitle ?? "",
      items: Array.isArray(saved.faq?.items) && saved.faq.items.length > 0
        ? saved.faq.items
        : (def.faq?.items ?? []),
    },
    cta: {
      badge: saved.cta?.badge ?? def.cta.badge,
      title: saved.cta?.title ?? def.cta.title,
      subtitle: saved.cta?.subtitle ?? def.cta.subtitle,
      button: saved.cta?.button ?? def.cta.button,
    },
    footer: {
      tagline: saved.footer?.tagline ?? def.footer.tagline,
    },
  };
}

