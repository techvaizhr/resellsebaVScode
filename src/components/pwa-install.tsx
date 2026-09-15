import { useEffect, useState } from "react";
import { Download, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { usePlatformBranding } from "@/lib/platform-branding";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<(canInstall: boolean) => void>();

// Register Service Worker and global PWA window listeners once
if (typeof window !== "undefined") {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.warn("PWA Service Worker registration:", err);
      });
    });
  }

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
 * Hook to track PWA install state and trigger 1-click direct install.
 */
export function usePwaInstall() {
  const [canInstall, setCanInstall] = useState(!!deferredPrompt);
  const [installed, setInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);

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
    if (installed) {
      toast.success("অ্যাপটি ইতিমধ্যে আপনার ডিভাইসে ইনস্টল করা আছে।");
      return true;
    }

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
          toast.success("অ্যাপ সফলভাবে ইনস্টল করা হয়েছে!");
          deferredPrompt = null;
          setCanInstall(false);
          setInstalled(true);
          return true;
        } else {
          toast.info("ইনস্টলেশন বাতিল করা হয়েছে।");
        }
      } catch (err) {
        console.warn("PWA prompt error:", err);
      }
      return false;
    }

    // Direct 1-click fallback notification without showing hints modal
    if (isIos) {
      toast.info("Safari ব্রাউজারের Share বোতাম থেকে 'Add to Home Screen' এ চাপুন।");
    } else {
      toast.info("ব্রাউজারের অ্যাড্রেস বার বা মেন্যু থেকে সরাসরি 'Install App' এ ক্লিক করুন।");
    }
    return false;
  };

  return {
    canInstall,
    installed,
    isIos,
    triggerInstall,
    showInstructions: false,
    setShowInstructions: () => {},
  };
}

/**
 * Backwards compatible stub (no hints/instruction popup modal is rendered)
 */
export function PwaInstructionModal(_props: any) {
  return null;
}

/**
 * Standard PWA 1-Click Install Button (renders inline, icon, or footer block).
 * Dynamically uses the Admin favicon as the app icon.
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
  const { installed, triggerInstall } = usePwaInstall();
  const branding = usePlatformBranding();
  const iconSrc = branding.favicon || "/favicon.ico";

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
      <div
        onClick={triggerInstall}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") triggerInstall();
        }}
        className={cn(
          "group relative flex items-center justify-between gap-4 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent p-3.5 text-left transition-all hover:border-primary/40 hover:bg-primary/10 cursor-pointer shadow-xs",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <img
            src={iconSrc}
            alt="App Icon"
            className="h-9 w-9 rounded-lg border border-border bg-background p-1 shadow-xs transition-transform group-hover:scale-105 object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/favicon.ico";
            }}
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-foreground">{label}</span>
              <span className="rounded bg-primary/15 px-1.5 py-0.2 text-[10px] font-semibold text-primary">
                1-Click
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">Android, iOS ও PC তে ১-ক্লিকে ইনস্টল করুন</p>
          </div>
        </div>
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-xs transition-transform group-hover:scale-110">
          <Download className="h-4 w-4" />
        </div>
      </div>
    );
  }

  // Inline Button Variant
  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={triggerInstall}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary shadow-2xs cursor-pointer",
          className
        )}
      >
        <img
          src={iconSrc}
          alt="App Icon"
          className="h-4 w-4 rounded-sm object-contain"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/favicon.ico";
          }}
        />
        <Download className="h-3.5 w-3.5 text-primary" />
        <span>{label}</span>
      </button>
    );
  }

  // Icon Button Variant
  return (
    <button
      type="button"
      onClick={triggerInstall}
      title={label}
      aria-label={label}
      className={cn(
        "relative grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-primary cursor-pointer",
        className
      )}
    >
      <Download className="h-4 w-4" />
    </button>
  );
}

/**
 * High-Converting PWA Footer Box with dynamic Admin favicon.
 * 1-Click install without any hints modal.
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
  const { installed, triggerInstall } = usePwaInstall();
  const branding = usePlatformBranding();
  const iconSrc = branding.favicon || "/favicon.ico";

  if (installed) {
    return (
      <div className={cn("flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400", className)}>
        <CheckCircle2 className="h-4 w-4" />
        <span>অ্যাপ আপনার ডিভাইসে সক্রিয় রয়েছে</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 rounded-xl border border-border bg-card/60 p-4 transition-all hover:border-primary/40 hover:bg-card shadow-xs",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20 p-1">
          <img
            src={iconSrc}
            alt="App Favicon"
            className="h-7 w-7 rounded object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/favicon.ico";
            }}
          />
        </div>
        <div>
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            {branding.siteName || title}
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
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 active:scale-95 shrink-0 cursor-pointer"
      >
        <Download className="h-3.5 w-3.5" />
        <span>অ্যাপ ইন্সটল করুন (1-Click)</span>
      </button>
    </div>
  );
}
