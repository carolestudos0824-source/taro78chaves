// stripe-create-checkout — creates a Stripe Checkout Session for monthly/yearly plans.
// Body: { "plan": "monthly" | "yearly" }  (legacy "annual" still accepted as alias).
//
// Auth: requires logged-in user (validates JWT in code, verify_jwt=false in config).
// Returns: { url } — frontend redirects window.location.href to it.
//
// Required env:
// - STRIPE_SECRET_KEY
// - STRIPE_PRICE_MONTHLY (Stripe Price ID for the monthly plan)
// - STRIPE_PRICE_YEARLY  (Stripe Price ID for the yearly/annual plan)

import Stripe from "https://esm.sh/stripe@17.5.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const STRIPE_SECRET = Deno.env.get("STRIPE_SECRET_KEY");
    const PRICE_MONTHLY = Deno.env.get("STRIPE_PRICE_MONTHLY");
    const PRICE_YEARLY = Deno.env.get("STRIPE_PRICE_YEARLY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;

    if (!STRIPE_SECRET) {
      console.error("Missing STRIPE_SECRET_KEY");
      return json({ error: "Stripe pendente: STRIPE_SECRET_KEY não configurado." }, 503);
    }

    // Auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, 401);
    }
    const supabase = createClient(SUPABASE_URL, ANON, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData?.user) {
      console.error("User auth error:", userErr);
      return json({ error: "Unauthorized" }, 401);
    }

    const userId = userData.user.id;
    const userEmail = userData.user.email ?? undefined;

    // Body
    let plan: "monthly" | "yearly";
    try {
      const body = await req.json();
      const raw = String(body.plan ?? "").toLowerCase();
      plan = raw === "yearly" || raw === "annual" ? "yearly" : "monthly";
    } catch {
      return json({ error: "Invalid JSON body" }, 400);
    }

    const priceId = plan === "yearly" ? PRICE_YEARLY : PRICE_MONTHLY;
    if (!priceId) {
      console.error(`Missing price ID for ${plan}`);
      const envName = plan === "yearly" ? "STRIPE_PRICE_YEARLY" : "STRIPE_PRICE_MONTHLY";
      return json({ error: `Stripe pendente: ${envName} não configurado.` }, 503);
    }

    const stripe = new Stripe(STRIPE_SECRET, { apiVersion: "2024-12-18.acacia" });
    
    // Fetch price to determine mode
    console.log(`Fetching price ${priceId}...`);
    let price;
    try {
      price = await stripe.prices.retrieve(priceId);
    } catch (e) {
      console.error(`Error retrieving price ${priceId}:`, e);
      return json({ error: `Preço inválido ou não encontrado no Stripe: ${priceId}` }, 400);
    }

    const isRecurring = price.type === "recurring";
    const mode = isRecurring ? "subscription" : "payment";
    console.log(`Plan: ${plan}, Mode: ${mode}, Price: ${priceId}`);

    // Reuse existing customer
    let customerId: string | undefined;
    if (userEmail) {
      const existing = await stripe.customers.list({ email: userEmail, limit: 1 });
      if (existing.data.length > 0) customerId = existing.data[0].id;
    }

    const origin = req.headers.get("origin") ?? req.headers.get("referer") ?? "";
    const successUrl = `${origin}/perfil?checkout=success`;
    const cancelUrl = `${origin}/premium?checkout=cancelled`;

    console.log("Creating checkout session...");
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode,
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { user_id: userId, plan_code: plan, origin: "lovable_web" },
    };

    if (isRecurring) {
      sessionParams.subscription_data = {
        metadata: { user_id: userId, plan_code: plan, origin: "lovable_web" },
      };
    } else {
      sessionParams.payment_intent_data = {
        metadata: { user_id: userId, plan_code: plan, origin: "lovable_web" },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    console.log(`Session created: ${session.id}`);

    return json({ url: session.url, id: session.id });
  } catch (e) {
    console.error("Unexpected error in stripe-create-checkout:", e);
    return json({ error: e.message }, 500);
  }
});
