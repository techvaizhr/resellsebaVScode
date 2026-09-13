import { useEffect, useState } from "react";
import { Download, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferredPrompt: BeforeInstallPromptEvent | null = null;

/** Tracks installability of the app (manifest-only PWA). */
export function usePwaInstall() {
  const [canInstall, setCanInstall] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // iOS Safari
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) setInstalled(true);
    if (deferredPrompt) setCanInstall(true);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      setCanInstall(true);
    };
    const onInstalled = () => {
      deferredPrompt = null;
      setCanInstall(false);
      setInstalled(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    const evt = deferredPrompt;
    await evt.prompt();
    const choice = await evt.userChoice;
    if (choice.outcome === "accepted") {
      deferredPrompt = null;
      setCanInstall(false);
      setInstalled(true);
    }
  };

  return { canInstall, installed, install };
}

/**
 * Install icon button. Hidden entirely when the app is already installed or
 * the browser has not offered installability.
 */
export function PwaInstallButton({
  className,
  variant = "icon",
  label = "Install App",
}: {
  className?: string;
  variant?: "icon" | "inline";
  label?: string;
}) {
  const { canInstall, installed, install } = usePwaInstall();

  if (installed) {
    if (variant === "inline") {
      return (
        <span className={cn("inline-flex items-center gap-1.5 text-sm text-muted-foreground", className)}>
          <CheckCircle2 className="h-4 w-4" /> Installed
        </span>
      );
    }
    return null;
  }
  if (!canInstall) return null;

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={install}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary",
          className,
        )}
      >
        <Download className="h-4 w-4" /> {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={install}
      title={label}
      aria-label={label}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-primary",
        className,
      )}
    >
      <Download className="h-5 w-5" />
    </button>
  );
}
