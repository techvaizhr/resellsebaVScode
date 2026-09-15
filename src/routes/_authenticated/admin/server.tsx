import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { PageHeader } from "@/components/ui-kit";
import {
  Server,
  RefreshCw,
  ExternalLink,
  Zap,
  ShieldCheck,
  GitPullRequest,
  CheckCircle2,
  Terminal,
  Activity,
  Layers,
  AlertTriangle,
  X,
  Trash2,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/server")({
  component: ServerDeploymentPage,
  head: () => ({
    meta: [
      { title: "Server & Deployment · Admin" },
      {
        name: "description",
        content: "Live server deployment, automated git updates, database migration, and system health control panel.",
      },
    ],
  }),
});

const SETUP_KEY = "resellseba_setup_sec_2026";
const attachKey = (url: string) => {
  if (url.includes("key=")) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}key=${SETUP_KEY}`;
};

function ServerDeploymentPage() {
  const [currentUrl, setCurrentUrl] = useState(() => attachKey("/api/setup_vendor.php"));
  const [iframeKey, setIframeKey] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dynamicOrigin, setDynamicOrigin] = useState("");
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetInput, setResetInput] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDynamicOrigin(window.location.origin);
    }
  }, []);

  const handleAction = (actionUrl: string) => {
    setCurrentUrl(attachKey(actionUrl));
    setIframeKey((prev) => prev + 1);
    setLoading(true);
  };

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
    setLoading(true);
  };

  const handleHardReset = () => {
    if (resetInput.trim() !== "RESET") return;
    setResetModalOpen(false);
    setResetInput("");
    handleAction("/api/setup_vendor.php?action=fresh_db&confirm_wipe=RESET_CONFIRMED");
  };

  const openNewTab = (path: string = "/api/setup_vendor.php") => {
    const withKey = attachKey(path);
    const fullUrl = dynamicOrigin ? `${dynamicOrigin}${withKey}` : withKey;
    window.open(fullUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Server & Deployment"
        description="লাইভ সার্ভার আপডেট, গিট পুল, ডাটাবেজ মাইগ্রেশন এবং সিস্টেম কন্ট্রোল প্যানেল"
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground shadow-xs transition-colors hover:bg-muted"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-primary" : ""}`} />
              <span>রিফ্রেশ ফ্রেম</span>
            </button>
            <button
              type="button"
              onClick={() => openNewTab(currentUrl)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 active:scale-95"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>নতুন ট্যাবে ওপেন করুন</span>
            </button>
          </div>
        }
      />

      {/* Dynamic Environment & Quick Action Badges */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-3.5 shadow-xs">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-muted-foreground">কানেক্টেড হোস্ট (Dynamic Host)</p>
            <p className="text-xs font-bold text-foreground truncate max-w-[180px]">
              {dynamicOrigin ? dynamicOrigin.replace(/^https?:\/\//, "") : "Auto Detected"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-3.5 shadow-xs">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-muted-foreground">কন্ট্রোল প্যানেল এন্ডপয়েন্ট</p>
            <p className="text-xs font-bold text-foreground">/api/setup_vendor.php</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-3.5 shadow-xs">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <GitPullRequest className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-muted-foreground">গিটহাব ব্রাঞ্চ (GitHub Branch)</p>
            <p className="text-xs font-bold text-foreground">origin / main</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-3.5 shadow-xs">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-muted-foreground">আর্কিটেকচার মোড</p>
            <p className="text-xs font-bold text-foreground">Apache SPA + PHP API</p>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            ⚡ কুইক অ্যাকশন শর্টকাট (Quick Actions)
          </h3>
          <span className="text-[11px] text-muted-foreground">
            নিচের যেকোনো বাটনে চাপলে সরাসরি সার্ভারে রান হবে
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleAction("/api/setup_vendor.php?action=fix_all")}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-95"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>⚡ 1-Click Pull & Update</span>
          </button>

          <button
            type="button"
            onClick={() => handleAction("/api/setup_vendor.php?action=migrate")}
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 transition-colors hover:bg-emerald-500/20"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>🛡️ Safe DB Migrate (Zero Data Loss)</span>
          </button>

          <button
            type="button"
            onClick={() => handleAction("/api/setup_vendor.php?action=git_pull")}
            className="inline-flex items-center gap-2 rounded-lg border border-sky-500/30 bg-sky-500/10 px-3.5 py-2 text-xs font-semibold text-sky-700 dark:text-sky-300 transition-colors hover:bg-sky-500/20"
          >
            <GitPullRequest className="h-3.5 w-3.5" />
            <span>📥 Git Pull Code</span>
          </button>

          <button
            type="button"
            onClick={() => handleAction("/api/test")}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Activity className="h-3.5 w-3.5 text-primary" />
            <span>🧪 Test API & DB Status</span>
          </button>

          <button
            type="button"
            onClick={() => handleAction("/api/setup_vendor.php?action=composer")}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Server className="h-3.5 w-3.5 text-amber-500" />
            <span>📦 Composer Install</span>
          </button>

          <button
            type="button"
            onClick={() => setResetModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3.5 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-500/20 active:scale-95 transition-all"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>⚠️ Fresh DB Reset (Migrations + Seed)</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Hard Reset */}
      {resetModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setResetModalOpen(false);
          }}
        >
          <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="text-base font-bold">মারাত্মক সতর্কতা (Danger Zone)</h3>
              </div>
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              এই অ্যাকশনটি চালালে ডাটাবেজের সমস্ত টেবিল ড্রপ (Delete) হয়ে যাবে এবং{" "}
              <strong className="text-foreground">backend/database/migrations</strong> ফোল্ডারের ফাইলগুলো থেকে একদম ফ্রেশ ১০০% ক্লিন ডাটাবেজ তৈরি হবে ও ডিফল্ট অ্যাডমিন সিড হবে।
              সমস্ত টেস্ট প্রোডাক্ট, অর্ডার এবং ডাটা সম্পূর্ণরূপে মুছে ফ্রেশ সিস্টেমে ফিরে যাবে।
            </p>

            <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive font-medium">
              নিশ্চিত করতে নিচের বক্সে হুবহু টাইপ করুন: <span className="font-mono font-bold select-all">RESET</span>
            </div>

            <input
              type="text"
              value={resetInput}
              onChange={(e) => setResetInput(e.target.value)}
              placeholder="RESET"
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm font-mono uppercase outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              autoFocus
            />

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setResetModalOpen(false);
                  setResetInput("");
                }}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                disabled={resetInput.trim() !== "RESET"}
                onClick={handleHardReset}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-red-700 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>মুছে ফ্রেশ সেটআপ করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Live Server Control Panel */}
      <div className="overflow-hidden rounded-2xl border border-border bg-[#090d16] shadow-xl">
        <div className="flex items-center justify-between border-b border-border/40 bg-[#0d1527] px-4 py-2.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] text-emerald-400">LIVE SERVER TERMINAL</span>
            <span className="text-border">|</span>
            <span className="font-mono text-[11px] text-muted-foreground truncate max-w-[320px]">
              {currentUrl}
            </span>
          </div>
          <button
            type="button"
            onClick={() => openNewTab(currentUrl)}
            className="inline-flex items-center gap-1.5 text-[11px] text-primary hover:underline"
          >
            <span>নতুন ট্যাবে খুলুন</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>

        <iframe
          ref={iframeRef}
          key={iframeKey}
          src={currentUrl}
          title="Server Deployment Panel"
          onLoad={() => setLoading(false)}
          className="w-full h-[700px] border-0 bg-[#090d16]"
        />
      </div>
    </div>
  );
}
