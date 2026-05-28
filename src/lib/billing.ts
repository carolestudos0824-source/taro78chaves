/**
 * Single source of truth for plan pricing.
 *
 * IMPORTANT: These values are used ONLY for internal UI estimates
 * (MRR/ARR projections, conversion math). Real charged amounts must come
 * from Stripe transactions once the integration is live.
 *
 * When Stripe is enabled, server-side checkout MUST recalculate
 * `unit_amount` from the Stripe Price ID — never trust client-supplied prices.
 */

import { supabase } from "@/integrations/supabase/client";

export type PlanCode = "monthly" | "annual";

export interface PlanDefinition {
  code: PlanCode;
  label: string;
  /** Price in BRL (display currency). */
  priceBRL: number;
  /** Billing interval in months — used to normalize MRR. */
  intervalMonths: 1 | 12;
  /** Stripe Price ID — set as edge function env, not exposed here. */
  stripePriceId: string | null;
}

export const PLAN_PRICES: Record<PlanCode, PlanDefinition> = {
  monthly: {
    code: "monthly",
    label: "Mensal",
    priceBRL: 29.9,
    intervalMonths: 1,
    stripePriceId: null,
  },
  annual: {
    code: "annual",
    label: "Anual",
    priceBRL: 297, // Updated to R$297
    intervalMonths: 12,
    stripePriceId: null,
  },
};

/** Normalized monthly value for a plan (used for MRR estimates). */
export const monthlyValue = (code: PlanCode): number => {
  const p = PLAN_PRICES[code];
  return p.priceBRL / p.intervalMonths;
};

/**
 * Whether real revenue tracking is wired up (Stripe connected AND validated).
 *
 * Honest definition: returns true ONLY when at least one real Stripe event
 * has been persisted in subscription_events. This means the full pipeline
 * (checkout → webhook → DB persistence) has been validated end-to-end.
 *
 * No env flag, no manual toggle — the data itself is the source of truth.
 */
export const isRealRevenueEnabled = async (): Promise<boolean> => {
  const { count, error } = await supabase
    .from("subscription_events")
    .select("id", { count: "exact", head: true })
    .eq("provider", "stripe");
  if (error) return false;
  return (count ?? 0) > 0;
};

/**
 * @deprecated Use `isRealRevenueEnabled()` (async) instead.
 * Kept as `false` constant for components that haven't migrated yet.
 */
export const REAL_REVENUE_ENABLED = false;
