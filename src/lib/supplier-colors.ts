import type { CSSProperties } from "react";
/**
 * Dynamic, unlimited per-supplier row tinting.
 *
 * Each supplier id is hashed into a stable hue, so every supplier gets its own
 * soft pastel row colour without any hardcoded palette. Orders that contain
 * products from more than one supplier get a gradient of those hues.
 * Admin-only orders (no supplier) stay neutral.
 */

function hashHue(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  // Golden-angle spread keeps neighbouring hashes visually distinct.
  return Math.round((h % 360) * 0.618033988749895 * 360) % 360;
}

/** Soft background colour for a single supplier. */
export function supplierTintColor(id: string, alpha = 0.14): string {
  return `hsl(${hashHue(id)} 85% 60% / ${alpha})`;
}

/** Stronger accent (border / dot) for a single supplier. */
export function supplierAccentColor(id: string): string {
  return `hsl(${hashHue(id)} 70% 50% / 0.55)`;
}

export type SupplierTint = {
  /** Inline style to spread on the row container. */
  style: CSSProperties;
  /** True when more than one supplier contributed to the order. */
  mixed: boolean;
};

/**
 * Build the row tint for an order from the supplier ids of its items.
 * `null`/undefined ids (admin's own products) are ignored.
 */
export function orderSupplierTint(ids: (string | null | undefined)[]): SupplierTint | null {
  const unique = Array.from(new Set(ids.filter((x): x is string => !!x)));
  if (unique.length === 0) return null;

  if (unique.length === 1) {
    const id = unique[0]!;
    return {
      mixed: false,
      style: {
        backgroundColor: supplierTintColor(id),
        borderLeft: `3px solid ${supplierAccentColor(id)}`,
      },
    };
  }

  const stops = unique
    .slice(0, 4)
    .map((id, i, arr) => `${supplierTintColor(id, 0.18)} ${Math.round((i / Math.max(arr.length - 1, 1)) * 100)}%`)
    .join(", ");

  return {
    mixed: true,
    style: {
      backgroundImage: `linear-gradient(100deg, ${stops})`,
      borderLeft: `3px solid ${supplierAccentColor(unique[0]!)}`,
    },
  };
}
