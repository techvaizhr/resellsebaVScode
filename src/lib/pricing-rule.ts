/**
 * Global auto-pricing rule.
 *
 * One rule, set once in Advanced settings, that turns an admin cost (buying /
 * supplier price) into a reseller price, a suggested sell price and a default
 * packaging charge.
 *
 * - Admin product upload: the fields are pre-filled from this rule and stay
 *   editable.
 * - Supplier product upload: the same rule is applied silently in the database
 *   so the admin only has to verify the numbers at approval time.
 */
export type PricingMarkupMode = "pct" | "fixed";

export type PricingRule = {
  /** Master switch — off means nothing is auto-filled. */
  enabled: boolean;
  /** Reseller price = cost + % or + fixed amount. */
  resellerMode: PricingMarkupMode;
  resellerValue: number;
  /** Suggested sell price = reseller price + % or + fixed amount (+ packaging). */
  suggestedMode: PricingMarkupMode;
  suggestedValue: number;
  /** Default packaging charge applied to the product. */
  packaging: number;
  /** Round money to the nearest N taka (0 = no rounding). */
  roundTo: number;
};

export const DEFAULT_PRICING_RULE: PricingRule = {
  enabled: false,
  resellerMode: "pct",
  resellerValue: 20,
  suggestedMode: "pct",
  suggestedValue: 25,
  packaging: 0,
  roundTo: 5,
};

export function mergePricingRule(raw: unknown): PricingRule {
  const r = (raw ?? {}) as Record<string, unknown>;
  const num = (v: unknown, fb: number) => (Number.isFinite(Number(v)) ? Number(v) : fb);
  const mode = (v: unknown, fb: PricingMarkupMode): PricingMarkupMode =>
    v === "pct" || v === "fixed" ? v : fb;
  return {
    enabled: typeof r.enabled === "boolean" ? r.enabled : DEFAULT_PRICING_RULE.enabled,
    resellerMode: mode(r.resellerMode, DEFAULT_PRICING_RULE.resellerMode),
    resellerValue: num(r.resellerValue, DEFAULT_PRICING_RULE.resellerValue),
    suggestedMode: mode(r.suggestedMode, DEFAULT_PRICING_RULE.suggestedMode),
    suggestedValue: num(r.suggestedValue, DEFAULT_PRICING_RULE.suggestedValue),
    packaging: num(r.packaging, DEFAULT_PRICING_RULE.packaging),
    roundTo: num(r.roundTo, DEFAULT_PRICING_RULE.roundTo),
  };
}

export type PricingResult = {
  resellerPrice: number;
  suggestedPrice: number;
  packaging: number;
};

/** Same math as the database function `public.pricing_rule_apply`. */
export function applyPricingRule(cost: number, rule: PricingRule): PricingResult {
  const c = Number.isFinite(cost) ? Math.max(0, cost) : 0;
  const reseller =
    rule.resellerMode === "pct" ? c * (1 + rule.resellerValue / 100) : c + rule.resellerValue;
  const packaging = Math.max(0, rule.packaging);
  const suggestedBase =
    rule.suggestedMode === "pct"
      ? reseller * (1 + rule.suggestedValue / 100)
      : reseller + rule.suggestedValue;
  const round = (n: number) =>
    rule.roundTo > 0 ? Math.round(n / rule.roundTo) * rule.roundTo : Math.round(n * 100) / 100;
  return {
    resellerPrice: Math.max(0, round(reseller)),
    suggestedPrice: Math.max(0, round(suggestedBase + packaging)),
    packaging,
  };
}

export function pricingRuleSummary(rule: PricingRule): string {
  if (!rule.enabled) return "Auto pricing is off — every price is typed by hand.";
  const r =
    rule.resellerMode === "pct" ? `cost + ${rule.resellerValue}%` : `cost + ৳${rule.resellerValue}`;
  const s =
    rule.suggestedMode === "pct"
      ? `reseller price + ${rule.suggestedValue}%`
      : `reseller price + ৳${rule.suggestedValue}`;
  return `Reseller price = ${r} · Suggested price = ${s}${rule.packaging ? ` + ৳${rule.packaging} packaging` : ""}${
    rule.roundTo > 0 ? ` · rounded to ৳${rule.roundTo}` : ""
  }`;
}
