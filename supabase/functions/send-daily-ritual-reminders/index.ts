import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import webpush from "https://esm.sh/web-push@3.6.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const vapidPublicKey = Deno.env.get("VITE_VAPID_PUBLIC_KEY") || "BE_rHyGjRLwNmJuB1sRvIbMVjmqdSHdXBZB2HxGNuz10fCiDYT9dwjwp2l43k77xcucxnPTCmKQL8j05K_MeDuA";
    const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY") ?? "";
    const vapidSubject = "mailto:suporte@taro78chaves.com.br";

    if (!vapidPrivateKey) {
      throw new Error("VAPID_PRIVATE_KEY not configured");
    }

    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

    const { test_user_id } = await req.json().catch(() => ({}));
    const now = new Date();
    const results = [];

    // Base query for preferences
    let query = supabase
      .from("notification_preferences")
      .select("id, user_id, reminder_time, timezone, last_sent_at")
      .eq("enabled", true);

    if (test_user_id) {
      query = query.eq("user_id", test_user_id);
    }

    const { data: prefs, error: prefsError } = await query;
    if (prefsError) throw prefsError;

    for (const pref of (prefs || [])) {
      if (!test_user_id) {
        const userDate = new Intl.DateTimeFormat('en-US', {
          timeZone: pref.timezone,
          year: 'numeric', month: '2-digit', day: '2-digit'
        }).format(now);
        
        const lastSentDate = pref.last_sent_at ? new Intl.DateTimeFormat('en-US', {
          timeZone: pref.timezone,
          year: 'numeric', month: '2-digit', day: '2-digit'
        }).format(new Date(pref.last_sent_at)) : null;

        if (userDate === lastSentDate) continue;

        const userTime = new Intl.DateTimeFormat('en-US', {
          timeZone: pref.timezone,
          hour: '2-digit', minute: '2-digit', hour12: false
        }).format(now);
        
        if (userTime !== pref.reminder_time.substring(0, 5)) continue;
      }

      const { data: subs } = await supabase
        .from("push_subscriptions")
        .select("*")
        .eq("user_id", pref.user_id)
        .eq("is_active", true);

      if (!subs || subs.length === 0) continue;

      const payload = JSON.stringify({
        title: "Tarô 78 Chaves",
        body: "Sua leitura diária está aberta. Toque para iniciar seu Ritual.",
        url: "/desafios"
      });

      for (const sub of subs) {
        try {
          const pushSubscription = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth
            }
          };

          await webpush.sendNotification(pushSubscription, payload);

          await supabase.from("notification_logs").insert({
            user_id: pref.user_id,
            type: "daily_ritual",
            status: "success"
          });
        } catch (e) {
          console.error(`Push failed for user ${pref.user_id}:`, e);
          await supabase.from("notification_logs").insert({
            user_id: pref.user_id,
            type: "daily_ritual",
            status: "failed",
            error: e.message
          });

          if (e.statusCode === 410 || e.statusCode === 404) {
            await supabase.from("push_subscriptions").update({ is_active: false }).eq("id", sub.id);
          }
        }
      }

      if (!test_user_id) {
        await supabase
          .from("notification_preferences")
          .update({ last_sent_at: now.toISOString() })
          .eq("id", pref.id);
      }
        
      results.push({ user_id: pref.user_id, status: "processed" });
    }

    return new Response(JSON.stringify({ success: true, processed: results.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
