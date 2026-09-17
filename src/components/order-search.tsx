import { Search, X } from "lucide-react";

export type OrderSearchMode = "order" | "product" | "consignment";

/** One merged search box: mode select sits inside the input shell. */
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
      ? "Product name…"
      : mode === "consignment"
        ? "Consignment ID / tracking ID / courier…"
        : "Order no / customer name / mobile…";

  return (
    <div
      className={`flex h-10 min-w-[260px] flex-1 items-center rounded-md border bg-background focus-within:ring-2 focus-within:ring-ring ${className}`}
    >
      <select
        value={mode}
        onChange={(e) => onMode(e.target.value as OrderSearchMode)}
        className="h-full w-auto max-w-[7.5rem] shrink-0 truncate rounded-l-md border-0 border-r bg-primary px-2 text-xs font-medium text-primary-foreground outline-none"
        title="Search type"
      >
        <option value="order">Order</option>
        <option value="product">Product</option>
        <option value="consignment">Consignment</option>
      </select>
      <Search className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-full w-full bg-transparent px-2 text-sm outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="mr-2 rounded p-0.5 text-muted-foreground hover:bg-accent"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
