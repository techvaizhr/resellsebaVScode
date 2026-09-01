import { Copy } from "lucide-react";
import { toast } from "sonner";

interface CopyOrderNumberProps {
  orderNumber: string;
  prefix?: boolean;
  className?: string;
  iconClassName?: string;
}

export function CopyOrderNumber({
  orderNumber,
  prefix = true,
  className = "",
  iconClassName = "h-3 w-3",
}: CopyOrderNumberProps) {
  const label = `${prefix ? "#" : ""}${orderNumber}`;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(orderNumber);
      toast.success("Order number copied");
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span className="truncate">{label}</span>
      <button
        type="button"
        onClick={handleCopy}
        title="Copy order number"
        className="shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <Copy className={iconClassName} />
      </button>
    </span>
  );
}
