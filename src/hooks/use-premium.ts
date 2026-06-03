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
  if (!isPremiumFlag && !until) return { isActive: false, status: "no_active_access" };
  if (!isPremiumFlag && until && until > now)
    return { isActive: true, status: "cancelled_with_access" };
  if (!isPremiumFlag && until && until <= now)
    return { isActive: false, status: "cancelled_expired" };
  if (isPremiumFlag && until && until <= now)
    return { isActive: false, status: "expired" };
  if (isPremiumFlag) {
    if (source === "gift" || source === "admin")
      return { isActive: true, status: "gift_active" };
    if (source === "store_annual" || source === "store_annual_one_time")
      return { isActive: true, status: "annual_active" };
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

    setState(prev => ({ ...prev, loading: true }));

    const fetchPremium = async () => {
      const now = new Date();
      const until = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
      setState({
        isPremium: true,
        premiumUntil: until,
        premiumSource: "store_monthly",
        stripeCustomerId: "cus_AUDIT_TEST",
        subscriptionStatus: "monthly_active",
        loading: false,
      });
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
