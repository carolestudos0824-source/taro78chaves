import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export type SubscriptionStatus =
  | "free"
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
  // Not premium, no date → free
  if (!isPremiumFlag && !until) return { isActive: false, status: "free" };

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
    if (source === "store_annual" || source === "store_annual_one_time")
      return { isActive: true, status: "annual_active" };
    // default to monthly for store_monthly or unknown
    return { isActive: true, status: "monthly_active" };
  }

  return { isActive: false, status: "free" };
}

export const usePremium = (): PremiumState => {
  const { user } = useAuth();
  const [state, setState] = useState<PremiumState>({
    isPremium: false,
    premiumUntil: null,
    premiumSource: null,
    stripeCustomerId: null,
    subscriptionStatus: "free",
    loading: true,
  });

  useEffect(() => {
    if (!user) {
      setState({ isPremium: false, premiumUntil: null, premiumSource: null, stripeCustomerId: null, subscriptionStatus: "free", loading: false });
      return;
    }

    const fetchPremium = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("is_premium, premium_until, premium_source, stripe_customer_id")
        .eq("user_id", user.id)
        .single();

      if (data) {
        const now = new Date();
        const until = data.premium_until ? new Date(data.premium_until) : null;
        const { isActive, status } = resolveStatus(data.is_premium, until, data.premium_source, now);

        setState({
          isPremium: isActive,
          premiumUntil: data.premium_until,
          premiumSource: data.premium_source,
          stripeCustomerId: data.stripe_customer_id,
          subscriptionStatus: status,
          loading: false,
        });
      } else {
        setState({ isPremium: false, premiumUntil: null, premiumSource: null, stripeCustomerId: null, subscriptionStatus: "free", loading: false });
      }
    };

    fetchPremium();
  }, [user]);

  return state;
};
