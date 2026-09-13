import { Search, X, ChevronDown } from "lucide-react";

export type OrderSearchMode = "order" | "product";

/** Search box with dynamic button-styled mode selector (Order / Booking combined, and Product separate). */
export function OrderSearch({
  mode,
  onMode,
  value,
  onChange,
  className = "",
}: {
  mode: OrderSearchMode;
  onMode: (m: OrderSearchMode) => void;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  const placeholder =
    mode === "product"
      ? "Search by product name…"
      : "Order no, booking ID, phone, customer…";

  return (
    <div
      className={`flex h-10 min-w-0 w-full flex-1 items-center rounded-lg border bg-background shadow-xs transition-colors focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 ${className}`}
    >
      <div className="relative shrink-0 flex items-center h-full border-r border-primary/20 bg-primary/10 hover:bg-primary/15 dark:bg-primary/20 dark:hover:bg-primary/25 transition-colors rounded-l-lg">
        <select
          value={mode}
          onChange={(e) => onMode(e.target.value as OrderSearchMode)}
          className="h-full w-auto pl-2.5 sm:pl-3 pr-6 text-[11px] sm:text-xs font-semibold bg-transparent text-primary outline-none cursor-pointer appearance-none truncate"
          title="Search type"
        >
          <option value="order" className="bg-background text-foreground font-medium">Order</option>
          <option value="product" className="bg-background text-foreground font-medium">Product</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-primary" />
      </div>

      <Search className="ml-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-muted-foreground/70" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-full min-w-0 w-full bg-transparent px-2 text-xs sm:text-sm placeholder:text-muted-foreground/60 outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="mr-1.5 shrink-0 rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          title="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

