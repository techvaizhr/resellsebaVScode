import { supabase } from "@/integrations/supabase/client";

/** A policy section shown to resellers — a title plus a few short bullet points. */
export type ResellerPolicy = {
  id: string;
  title: string;
  summary: string | null;
  points: string[];
  sort_order: number;
  is_active: boolean;
  updated_at: string;
};

function toPoints(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((p): p is string => typeof p === "string" && p.trim() !== "");
  return [];
}

function normalize(row: any): ResellerPolicy {
  return {
    id: row.id,
    title: row.title ?? "",
    summary: row.summary ?? null,
    points: toPoints(row.points),
    sort_order: row.sort_order ?? 0,
    is_active: row.is_active !== false,
    updated_at: row.updated_at ?? row.created_at ?? "",
  };
}

/** Active policies only — used by the reseller panel. */
export async function fetchActivePolicies(): Promise<ResellerPolicy[]> {
  const { data, error } = await supabase
    .from("reseller_policies")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(normalize);
}

/** Every policy, active or not — used by the admin editor. */
export async function fetchAllPolicies(): Promise<ResellerPolicy[]> {
  const { data, error } = await supabase
    .from("reseller_policies")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(normalize);
}

export function pointsFromText(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.replace(/^\s*[-•*\d.)\s]+/, "").trim())
    .filter(Boolean);
}

export function pointsToText(points: string[]): string {
  return points.join("\n");
}
