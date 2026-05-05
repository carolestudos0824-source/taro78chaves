import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    // 1. Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error("Auth error:", authError);
      return json({ error: "Unauthorized" }, 401);
    }

    // 2. Check Admin role via Service Role client for security
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: roleRow, error: roleError } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError || !roleRow) {
      return json({ error: "Forbidden: admin only" }, 403);
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      return json({ error: "STRIPE_SECRET_KEY not configured" }, 500);
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2024-06-20",
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Active subscriptions (paginate up to a safe cap)
    let activeSubscriptions = 0;
    let mrrCents = 0;
    let starting_after: string | undefined = undefined;
    for (let i = 0; i < 10; i++) {
      const subs = await stripe.subscriptions.list({
        status: "active",
        limit: 100,
        starting_after,
      });
      for (const sub of subs.data) {
        activeSubscriptions++;
        for (const item of sub.items.data) {
          const price = item.price;
          const qty = item.quantity ?? 1;
          const amount = price.unit_amount ?? 0;
          const interval = price.recurring?.interval;
          const intervalCount = price.recurring?.interval_count ?? 1;
          let monthly = 0;
          if (interval === "month") monthly = amount / intervalCount;
          else if (interval === "year") monthly = amount / (12 * intervalCount);
          else if (interval === "week") {
            monthly = (amount * 4.345) / intervalCount;
          } else if (interval === "day") monthly = (amount * 30) / intervalCount;
          mrrCents += monthly * qty;
        }
      }
      if (!subs.has_more) break;
      starting_after = subs.data[subs.data.length - 1]?.id;
    }

    // Recent charges (last 100, succeeded only)
    const charges = await stripe.charges.list({ limit: 100 });
    let totalRevenueCents = 0;
    for (const ch of charges.data) {
      if (ch.status === "succeeded" && !ch.refunded) {
        totalRevenueCents += ch.amount - (ch.amount_refunded ?? 0);
      }
    }

    return json({
      activeSubscriptions,
      mrr: mrrCents / 100,
      totalRevenue: totalRevenueCents / 100,
      currency: charges.data[0]?.currency ?? "brl",
      sampledCharges: charges.data.length,
    }, 200);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("stripe-admin-metrics error:", msg);
    return json({ error: msg }, 500);
  }
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
