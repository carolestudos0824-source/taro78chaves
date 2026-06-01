import React, { useEffect, useState, createContext, useContext, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export type SubscriptionStatus =
  | "no_active_access"
  | "monthly_active"
  | "annual_active"
  | "gift_active"
  | "expired"
  | "cancelled_with_access"
  | "cancelled_expired";

interface PremiumState {
  isPremium: boolean;
  premiumUntil: string | null;
  premiumSource: string | null;
  stripeCustomerId: string | null;
  subscriptionStatus: SubscriptionStatus;
  loading: boolean;
}

function resolveStatus(
  isPremiumFlag: boolean,
  until: Date | null,
  source: string | null,
  now: Date
): { isActive: boolean; status: SubscriptionStatus } {
  // Not premium, no date → no_active_access
  if (!isPremiumFlag && !until) return { isActive: false, status: "no_active_access" };

  // Not premium but has future date → cancelled with remaining access
  if (!isPremiumFlag && until && until > now)
    return { isActive: true, status: "cancelled_with_access" };

  // Not premium, date in past → cancelled and expired
  if (!isPremiumFlag && until && until <= now)
    return { isActive: false, status: "cancelled_expired" };

  // Premium flag but expired
  if (isPremiumFlag && until && until <= now)
    return { isActive: false, status: "expired" };

  // Active premium — determine source
  if (isPremiumFlag) {
    if (source === "gift" || source === "admin")
      return { isActive: true, status: "gift_active" };
    if (source === "store_annual" || source === "store_annual_one_time" || source === "hotmart")
      return { isActive: true, status: "annual_active" };
    // default to monthly for store_monthly or unknown
    return { isActive: true, status: "monthly_active" };
  }

  return { isActive: false, status: "no_active_access" };
}

const PremiumContext = createContext<PremiumState | undefined>(undefined);

export const PremiumProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [state, setState] = useState<PremiumState>({
    isPremium: false,
    premiumUntil: null,
    premiumSource: null,
    stripeCustomerId: null,
    subscriptionStatus: "no_active_access",
    loading: true,
  });

  useEffect(() => {
    if (!user) {
      setState({ isPremium: false, premiumUntil: null, premiumSource: null, stripeCustomerId: null, subscriptionStatus: "no_active_access", loading: false });
      return;
    }

    // Ensure we show loading when user changes
    setState(prev => ({ ...prev, loading: true }));

    const fetchPremium = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("is_premium, premium_until, premium_source, stripe_customer_id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          const now = new Date();
          const until = data.premium_until ? data.premium_until : null;
          const { isActive, status } = resolveStatus(data.is_premium, until ? new Date(until) : null, data.premium_source, now);

          setState({
            isPremium: isActive,
            premiumUntil: data.premium_until,
            premiumSource: data.premium_source,
            stripeCustomerId: data.stripe_customer_id,
            subscriptionStatus: status,
            loading: false,
          });
        } else {
          setState({ isPremium: false, premiumUntil: null, premiumSource: null, stripeCustomerId: null, subscriptionStatus: "no_active_access", loading: false });
        }
      } catch (err) {
        console.error("Error fetching premium status:", err);
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    fetchPremium();
  }, [user]);

  const value = useMemo(() => state, [state]);
  return React.createElement(PremiumContext.Provider, { value }, children);
};

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error("usePremium must be used within a PremiumProvider");
  }
  return context;
};
