import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export type StatusTab = { key: string; label: string };

/**
 * Global status-tab strip used across admin / reseller / supplier list pages.
 * - Mobile: a compact dropdown that fits inside the filter grid.
 * - Desktop: wrapping pills, never a horizontal scroller.
 */
export function StatusTabs({
  tabs,
  tab,
  onChange,
  count,
  className = "mb-4 w-full min-w-0",
}: {
  tabs: StatusTab[];
  tab: string;
  onChange: (key: string) => void;
  count: (key: string) => number;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = tabs.find((t) => t.key === tab);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current?.contains(e.target as Node)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className={className}>
      <div ref={ref} className="relative sm:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex h-10 w-full items-center justify-between gap-2 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <span className="min-w-0 truncate font-medium">
            {active?.label ?? "All"}
            <span className="ml-1.5 text-xs opacity-70">{count(tab)}</span>
          </span>
          <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div className="absolute left-0 right-0 z-50 mt-1.5 max-h-72 overflow-y-auto rounded-md border bg-popover p-2 shadow-lg modal-scroll">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => {
                  onChange(t.key);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded px-2.5 py-2 text-sm ${
                  t.key === tab ? "bg-primary/10 font-semibold text-primary" : "hover:bg-accent"
                }`}
              >
                <span className="truncate">{t.label}</span>
                <span className="ml-2 text-xs opacity-70">{count(t.key)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="hidden flex-wrap gap-2 sm:flex">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            className={
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors " +
              (t.key === tab ? "border-transparent bg-primary text-primary-foreground" : "hover:bg-muted")
            }
          >
            {t.label} <span className="opacity-70">({count(t.key)})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
