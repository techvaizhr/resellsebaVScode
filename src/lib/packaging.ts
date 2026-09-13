/**
 * Packaging cost of an order.
 *
 * Two modes, controlled from Admin → System → Advanced settings:
 *  · sum  (default) — every product's packaging cost × quantity is added up.
 *  · max            — only the highest single packaging cost is charged, no
 *                     matter how many products are in the parcel.
 */
export type PackagingLine = { packaging: number; qty: number };

export function packagingTotal(lines: PackagingLine[], sumMode: boolean): number {
  if (sumMode) {
    return lines.reduce((s, l) => s + Math.max(Number(l.packaging) || 0, 0) * Math.max(l.qty, 0), 0);
  }
  return lines.reduce((m, l) => Math.max(m, Math.max(Number(l.packaging) || 0, 0)), 0);
}

export function packagingModeHint(sumMode: boolean): string {
  return sumMode
    ? "Sum mode: each product's packaging charge × quantity is added together."
    : "Highest mode: when there are multiple products, only the highest packaging charge among them is applied once.";
}
