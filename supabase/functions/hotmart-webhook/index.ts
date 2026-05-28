import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-hotmart-hottok",
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

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const HOTMART_HOTTOK = Deno.env.get("HOTMART_HOTTOK");
  const DEFAULT_ACCESS_DAYS = parseInt(Deno.env.get("HOTMART_DEFAULT_ACCESS_DAYS") || "365");

  // 1. Validar Token de Segurança
  const hottok = req.headers.get("x-hotmart-hottok");
  if (!HOTMART_HOTTOK || hottok !== HOTMART_HOTTOK) {
    console.error("[hotmart-webhook] token mismatch or missing", { header: hottok });
    return json({ error: "Unauthorized" }, 401);
  }

  const payload = await req.json();
  const eventType = payload.event;
  const data = payload.data || {};
  const purchase = data.purchase || {};
  const buyer = data.buyer || {};
  const product = data.product || {};

  console.log(`[hotmart-webhook] processing event: ${eventType}`, { transaction: purchase.transaction });

  const admin = createClient(SUPABASE_URL, SERVICE);

  // 2. Registrar evento bruto para auditoria
  const { error: eventErr } = await admin.from("hotmart_events").insert({
    event_id: payload.id,
    event_type: eventType,
    transaction_id: purchase.transaction,
    buyer_email: buyer.email,
    buyer_name: buyer.name,
    product_id: product.id,
    product_name: product.name,
    offer_code: purchase.offer_code,
    purchase_status: purchase.status,
    raw_payload: payload,
  });

  if (eventErr) {
    console.warn("[hotmart-webhook] failed to log event", eventErr);
  }

  // 3. Mapear status da Hotmart para nosso access_status
  let accessStatus: string | null = null;
  let premiumUntil: string | null = null;

  if (eventType === "PURCHASE_APPROVED") {
    accessStatus = "approved";
    const d = new Date();
    d.setDate(d.getDate() + DEFAULT_ACCESS_DAYS);
    premiumUntil = d.toISOString();
  } else if (["PURCHASE_REFUNDED", "PURCHASE_CHARGEBACK"].includes(eventType)) {
    accessStatus = eventType.replace("PURCHASE_", "").toLowerCase();
  } else if (eventType === "PURCHASE_CANCELED") {
    accessStatus = "cancelled";
  } else if (eventType === "PURCHASE_EXPIRED") {
    accessStatus = "expired";
  }

  // 4. Se for um evento relevante, atualizar entitlements
  if (accessStatus && purchase.transaction && buyer.email) {
    const buyerEmailNormalized = buyer.email.trim().toLowerCase();
    
    // UPSERT no entitlement
    const { error: entitlementErr } = await admin.from("hotmart_entitlements").upsert({
      transaction_id: purchase.transaction,
      buyer_email: buyer.email,
      buyer_email_normalized: buyerEmailNormalized,
      buyer_name: buyer.name,
      product_id: product.id,
      product_name: product.name,
      offer_code: purchase.offer_code,
      status: purchase.status,
      access_status: accessStatus,
      premium_until: premiumUntil,
      updated_at: new Date().toISOString(),
    }, { onConflict: "transaction_id" });

    if (entitlementErr) {
      console.error("[hotmart-webhook] failed to update entitlement", entitlementErr);
      return json({ error: "DB entitlement update failed" }, 500);
    }
  }

  return json({ received: true, event: eventType });
});
