/**
 * Compact money summary shown inside the order list rows — same breakdown style
 * as the Transaction report so both sides stay readable.
 *
 * `ResellerTotalCell` = money received + reseller buy / delivery / packaging / profit.
 * `AdminTotalCell`    = admin revenue + admin buy / delivery / packaging / profit.
 *
 * Chips render in a fixed 2-column grid. The `adv` chip appears only on the side
 * that actually holds the customer's advance: reseller-held shows on the reseller
 * side (cost tone), admin-held on the admin side (profit tone). Money math is
 * unchanged — only the chip placement follows the holder.
 */
import {
  adminOrderRevenue,
  bdt,
  orderAdvance,
  orderDeliveryCost,
  orderKeptProductCost,
  orderPackaging,
  orderProfit,
  orderReceived,
  resellerHeldAdvance,
  type ProfitOrder,
} from "@/lib/finance-report";

type Tone = "delivery" | "profit" | "loss" | "cost" | "pack" | "advance";

function Chip({ label, value, tone }: { label: string; value: string; tone: Tone }) {
  const cls =
    tone === "delivery"
      ? "border-sky-500/30 bg-sky-500/10 text-sky-600"
      : tone === "profit"
        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
        : tone === "loss"
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : tone === "pack"
            ? "border-violet-500/30 bg-violet-500/10 text-violet-600"
            : tone === "advance"
              ? "border-slate-400/30 bg-slate-400/10 text-slate-500"
              : "border-amber-500/30 bg-amber-500/10 text-amber-600";
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-[1px] text-[9px] font-bold leading-tight tabular-nums ${cls}`}
    >
      <span className="opacity-70">{label}</span>
      {value}
    </span>
  );
}

function Summary({
  headLabel,
  headValue,
  headTone,
  buy,
  delivery,
  packaging,
  profit,
  advance,
  advanceTone,
}: {
  headLabel: string;
  headValue: number;
  headTone?: "primary" | "foreground";
  buy: number;
  delivery: number;
  packaging: number;
  profit: number;
  advance?: number;
  advanceTone?: Tone;
}) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-1">
      <span className="flex items-baseline gap-1">
        <span className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">{headLabel}</span>
        <span
          className={
            "text-sm font-black tabular-nums " + (headTone === "primary" ? "text-primary" : "text-foreground")
          }
        >
          {bdt(headValue)}
        </span>
      </span>
      <div className="grid grid-cols-2 gap-1">
        <Chip label="buy" value={bdt(buy)} tone="cost" />
        <Chip label="del" value={bdt(delivery)} tone="delivery" />
        <Chip label="pac" value={bdt(packaging)} tone="pack" />
        <Chip label={profit < 0 ? "loss" : "pft"} value={bdt(profit)} tone={profit < 0 ? "loss" : "profit"} />
        {advance != null && advance > 0 && (
          <Chip label="adv" value={bdt(advance)} tone={advanceTone ?? "advance"} />
        )}
      </div>
    </div>
  );
}

/** Reseller side: money received from the customer vs what the order cost them. */
export function ResellerTotalCell({ order }: { order: ProfitOrder; showProfit?: boolean }) {
  const advance = orderAdvance(order);
  // Show the advance chip only when the reseller held it (deducted from their profit).
  const resellerHeld = advance > 0 && resellerHeldAdvance(order) > 0;
  return (
    <Summary
      headLabel="sell"
      headValue={orderReceived(order)}
      buy={orderKeptProductCost(order)}
      delivery={orderDeliveryCost(order)}
      packaging={orderPackaging(order)}
      profit={orderProfit(order)}
      advance={resellerHeld ? advance : undefined}
      advanceTone={resellerHeld ? "loss" : undefined}
    />
  );
}

/** Admin side: revenue = money received − what the reseller finally earns. */
export function AdminTotalCell({ order, buyingCost }: { order: ProfitOrder; buyingCost: number }) {
  const advance = orderAdvance(order);
  // Advance is the customer's own money, never admin profit — revenue is always
  // received minus the reseller's earned profit, whoever is holding the advance.
  const revenue = adminOrderRevenue(order);
  const delivery = orderDeliveryCost(order);
  const packaging = orderPackaging(order);
  const profit = revenue - buyingCost - delivery - packaging;
  // Advance chip: admin-held = admin cash, reseller-held = cash admin won't receive.
  const adminHeld = advance > 0 && order.advance_by === "admin";
  return (
    <Summary
      headLabel="rev"
      headValue={revenue}
      headTone="primary"
      buy={buyingCost}
      delivery={delivery}
      packaging={packaging}
      profit={profit}
      advance={adminHeld ? advance : undefined}
      advanceTone="profit"
    />
  );
}
