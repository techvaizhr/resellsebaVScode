import { useEffect, useState } from "react";
import { Download, CheckCircle2, Smartphone, Monitor, Share2, PlusSquare, MoreVertical, X } from "lucide-react";
import { cn } from "@/lib/utils";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<(canInstall: boolean) => void>();

// Register global window listeners once
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    listeners.forEach((cb) => cb(true));
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    listeners.forEach((cb) => cb(false));
  });
}

/**
 * Hook to track PWA install state and trigger 1-click install.
 */
export function usePwaInstall() {
  const [canInstall, setCanInstall] = useState(!!deferredPrompt);
  const [installed, setInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Check if running as standalone PWA
    const isStandalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setInstalled(true);
    }

    // Check iOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIos(isIosDevice);

    if (deferredPrompt) {
      setCanInstall(true);
    }

    const listener = (state: boolean) => {
      setCanInstall(state);
      if (!state && isStandalone) {
        setInstalled(true);
      }
    };

    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const triggerInstall = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
          deferredPrompt = null;
          setCanInstall(false);
          setInstalled(true);
          return true;
        }
      } catch (err) {
        console.warn("PWA prompt error:", err);
      }
    }
    // If native prompt is not available or was dismissed/iOS, open visual instructions modal
    setShowInstructions(true);
    return false;
  };

  return {
    canInstall,
    installed,
    isIos,
    triggerInstall,
    showInstructions,
    setShowInstructions,
  };
}

/**
 * PWA Install Instructions Modal for iOS and browsers where native prompt isn't directly triggered.
 */
export function PwaInstructionModal({
  isOpen,
  onClose,
  isIos,
  onPromptInstall,
  canInstall,
}: {
  isOpen: boolean;
  onClose: () => void;
  isIos: boolean;
  onPromptInstall: () => void;
  canInstall: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3.5">
          <img
            src="/favicon.ico"
            alt="ResellSeba Icon"
            className="h-12 w-12 rounded-xl border border-border bg-background p-1 shadow-sm"
          />
          <div>
            <h3 className="text-base font-bold text-foreground">ResellSeba App</h3>
            <p className="text-xs text-muted-foreground">সরাসরি আপনার মোবাইল বা কম্পিউটারে ইন্সটল করুন</p>
          </div>
        </div>

        <div className="mt-5 space-y-4 text-sm text-foreground">
          {canInstall ? (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
              <p className="text-xs text-muted-foreground mb-3">
                নিচের বাটনে ক্লিক করে এক ক্লিকে সরাসরি অ্যাপটি ইন্সটল করুন:
              </p>
              <button
                type="button"
                onClick={() => {
                  onPromptInstall();
                  onClose();
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90"
              >
                <Download className="h-4 w-4" /> ১-ক্লিকে অ্যাপ ইন্সটল করুন
              </button>
            </div>
          ) : isIos ? (
            <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2.5">
              <div className="flex items-center gap-2 font-semibold text-xs text-primary">
                <Share2 className="h-4 w-4" /> iPhone বা iPad-এ ইন্সটল করার নিয়ম:
              </div>
              <ol className="list-decimal pl-5 space-y-1.5 text-xs text-muted-foreground">
                <li>
                  Safari ব্রাউজারের নিচে থাকা <span className="font-semibold text-foreground">Share (শেয়ার)</span>{" "}
                  আইকনে চাপ দিন।
                </li>
                <li>
                  মেনু স্ক্রল করে <span className="font-semibold text-foreground">"Add to Home Screen" (+)</span> অপশনটিতে
                  চাপ দিন।
                </li>
                <li>
                  উপরে ডানপাশে <span className="font-semibold text-foreground">"Add"</span> বাটনে ট্যাপ করলেই অ্যাপটি হোম
                  স্ক্রিনে সেভ হয়ে যাবে।
                </li>
              </ol>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2.5">
              <div className="flex items-center gap-2 font-semibold text-xs text-primary">
                <MoreVertical className="h-4 w-4" /> Android ও Chrome-এ ইন্সটল করার নিয়ম:
              </div>
              <ol className="list-decimal pl-5 space-y-1.5 text-xs text-muted-foreground">
                <li>
                  ব্রাউজারের উপরে ডানদিকের ৩-ডট মেনু <span className="font-semibold text-foreground">(⋮)</span> চাপুন।
                </li>
                <li>
                  <span className="font-semibold text-foreground">"Install app"</span> বা{" "}
                  <span className="font-semibold text-foreground">"Add to Home screen"</span> অপশনে ক্লিক করুন।
                </li>
                <li>
                  কনফার্ম করার জন্য <span className="font-semibold text-foreground">"Install"</span> চাপুন।
                </li>
              </ol>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>০ মেগাবাইট স্টোরেজ খরচ</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>সরাসরি ফুল স্ক্রিন মোড</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border bg-card px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Standard PWA Install Button (renders inline, icon, or footer block).
 */
export function PwaInstallButton({
  className,
  variant = "inline",
  label = "অ্যাপ ইন্সটল করুন",
}: {
  className?: string;
  variant?: "icon" | "inline" | "footer" | "banner";
  label?: string;
}) {
  const { canInstall, installed, isIos, triggerInstall, showInstructions, setShowInstructions } = usePwaInstall();

  if (installed) {
    if (variant === "footer" || variant === "inline") {
      return (
        <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400", className)}>
          <CheckCircle2 className="h-3.5 w-3.5" /> অ্যাপ ইন্সটল করা আছে
        </span>
      );
    }
    return null;
  }

  // Footer Box Variant
  if (variant === "footer") {
    return (
      <>
        <div
          onClick={triggerInstall}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") triggerInstall();
          }}
          className={cn(
            "group relative flex items-center justify-between gap-4 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent p-3.5 text-left transition-all hover:border-primary/40 hover:bg-primary/10 cursor-pointer",
            className
          )}
        >
          <div className="flex items-center gap-3">
            <img
              src="/favicon.ico"
              alt="App Favicon"
              className="h-9 w-9 rounded-lg border border-border bg-background p-1 shadow-xs transition-transform group-hover:scale-105"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-foreground">{label}</span>
                <span className="rounded bg-primary/15 px-1.5 py-0.2 text-[10px] font-semibold text-primary">
                  1-Click
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">Android, iOS ও PC তে সহজে ব্যবহার করুন</p>
            </div>
          </div>
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-xs transition-transform group-hover:scale-110">
            <Download className="h-4 w-4" />
          </div>
        </div>

        <PwaInstructionModal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
          isIos={isIos}
          onPromptInstall={triggerInstall}
          canInstall={canInstall}
        />
      </>
    );
  }

  // Inline Button Variant
  if (variant === "inline") {
    return (
      <>
        <button
          type="button"
          onClick={triggerInstall}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary shadow-2xs",
            className
          )}
        >
          <img src="/favicon.ico" alt="Icon" className="h-4 w-4 rounded-sm" />
          <Download className="h-3.5 w-3.5 text-primary" />
          <span>{label}</span>
        </button>

        <PwaInstructionModal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
          isIos={isIos}
          onPromptInstall={triggerInstall}
          canInstall={canInstall}
        />
      </>
    );
  }

  // Icon Button Variant
  return (
    <>
      <button
        type="button"
        onClick={triggerInstall}
        title={label}
        aria-label={label}
        className={cn(
          "relative grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-primary",
          className
        )}
      >
        <Download className="h-4 w-4" />
      </button>

      <PwaInstructionModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        isIos={isIos}
        onPromptInstall={triggerInstall}
        canInstall={canInstall}
      />
    </>
  );
}

/**
 * High-Converting PWA Footer Box for use in platform or storefront footers.
 */
export function PwaFooterOption({
  className,
  title = "ResellSeba মোবাইল অ্যাপ",
  subtitle = "দ্রুত ও সহজে অর্ডার এবং ব্যবসা পরিচালনার জন্য অ্যাপ ইন্সটল করুন",
}: {
  className?: string;
  title?: string;
  subtitle?: string;
}) {
  const { canInstall, installed, isIos, triggerInstall, showInstructions, setShowInstructions } = usePwaInstall();

  if (installed) {
    return (
      <div className={cn("flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400", className)}>
        <CheckCircle2 className="h-4 w-4" />
        <span>অ্যাপ আপনার ডিভাইসে সক্রিয় রয়েছে</span>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 rounded-xl border border-border bg-card/60 p-4 transition-all hover:border-primary/40 hover:bg-card shadow-xs",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20">
            <img src="/favicon.ico" alt="Favicon App Icon" className="h-6 w-6 rounded" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              {title}
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                PWA Fast
              </span>
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={triggerInstall}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 active:scale-95 shrink-0"
        >
          <Download className="h-3.5 w-3.5" />
          <span>অ্যাপ ইন্সটল করুন (1-Click)</span>
        </button>
      </div>

      <PwaInstructionModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        isIos={isIos}
        onPromptInstall={triggerInstall}
        canInstall={canInstall}
      />
    </>
  );
}
