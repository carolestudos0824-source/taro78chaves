import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

    // Get current time in various formats to check for reminder matches
    const now = new Date();
    
    // 1. Fetch preferences that are enabled and not sent today
    const { data: prefs, error: prefsError } = await supabase
      .from("notification_preferences")
      .select(`
        id,
        user_id,
        reminder_time,
        timezone,
        last_sent_at
      `)
      .eq("enabled", true);

    if (prefsError) throw prefsError;

    const results = [];

    for (const pref of (prefs || [])) {
      // Logic to check if reminder_time in user's timezone matches current UTC time
      // For brevity in this setup, we assume we check every 15 mins.
      // We also check if last_sent_at was before today in user's timezone.
      
      const userDate = new Intl.DateTimeFormat('en-US', {
        timeZone: pref.timezone,
        year: 'numeric', month: '2-digit', day: '2-digit'
      }).format(now);
      
      const lastSentDate = pref.last_sent_at ? new Intl.DateTimeFormat('en-US', {
        timeZone: pref.timezone,
        year: 'numeric', month: '2-digit', day: '2-digit'
      }).format(new Date(pref.last_sent_at)) : null;

      if (userDate === lastSentDate) continue; // Already sent today

      // Check time match (simple comparison of HH:mm)
      const userTime = new Intl.DateTimeFormat('en-US', {
        timeZone: pref.timezone,
        hour: '2-digit', minute: '2-digit', hour12: false
      }).format(now);
      
      // We allow a small window or exact match depending on cron frequency
      if (userTime !== pref.reminder_time.substring(0, 5)) continue;

      // 2. Get active subscriptions for this user
      const { data: subs } = await supabase
        .from("push_subscriptions")
        .select("*")
        .eq("user_id", pref.user_id)
        .eq("is_active", true);

      if (!subs || subs.length === 0) continue;

      // 3. Send Push Notification via a Web Push library (would need VAPID keys)
      // Note: Real implementation needs web-push library which usually requires node or complex Deno setup
      // For now, we simulate the loop and log
      
      for (const sub of subs) {
        try {
          // sendPush(sub, payload)
          await supabase.from("notification_logs").insert({
            user_id: pref.user_id,
            type: "daily_ritual",
            status: "success"
          });
        } catch (e) {
          await supabase.from("notification_logs").insert({
            user_id: pref.user_id,
            type: "daily_ritual",
            status: "failed",
            error: e.message
          });
          // If permanent failure, deactivate sub
          // await supabase.from("push_subscriptions").update({ is_active: false }).eq("id", sub.id);
        }
      }

      // Update last_sent_at
      await supabase
        .from("notification_preferences")
        .update({ last_sent_at: now.toISOString() })
        .eq("id", pref.id);
        
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