import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const payload = await req.json()
    console.log('Received Google Play Notification:', JSON.stringify(payload))

    // 1. Decode the notification (Base64 data in Pub/Sub message)
    if (!payload.message?.data) {
      throw new Error('Invalid Pub/Sub message')
    }

    const decodedData = JSON.parse(atob(payload.message.data))
    const { subscriptionNotification, developerNotification } = decodedData

    if (subscriptionNotification) {
      const { purchaseToken, notificationType } = subscriptionNotification
      
      // Map notificationType to status
      // 1: RECOVERED, 2: RENEWED, 3: CANCELED, 4: PURCHASED, 5: ON_HOLD, 6: IN_GRACE_PERIOD, 7: RESTARTED, 8: PRICE_CHANGE_CONFIRMED, 9: DEFERRED, 10: PAUSED, 12: EXPIRED
      
      console.log(`Processing subscription notification for token: ${purchaseToken}, type: ${notificationType}`)

      // Find the subscription in our DB
      const { data: sub, error: subError } = await supabaseClient
        .from('google_play_subscriptions')
        .select('user_id')
        .eq('purchase_token', purchaseToken)
        .maybeSingle()

      if (subError) throw subError
      if (!sub) {
        console.log('Subscription not found in our records. Ignoring.')
        return new Response('ok', { headers: corsHeaders })
      }

      let isPremium = true
      let status = 'active'
      
      if ([3, 10, 12, 13].includes(notificationType)) {
        // 3: Canceled, 10: Paused, 12: Expired, 13: Revoked
        isPremium = false
        status = notificationType === 3 ? 'cancelled' : (notificationType === 10 ? 'paused' : 'expired')
      }

      // Update the subscription record
      await supabaseClient
        .from('google_play_subscriptions')
        .update({ subscription_status: status })
        .eq('purchase_token', purchaseToken)

      // Update user profile if needed
      // Note: If they have another active subscription (e.g. Stripe), we might not want to turn off premium entirely
      // but usually users have only one. For simplicity, we update based on this event.
      await supabaseClient
        .from('profiles')
        .update({ is_premium: isPremium })
        .eq('user_id', sub.user_id)
        .eq('premium_source', 'google_play') // Only update if google_play was the source
    }

    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 })

  } catch (error) {
    console.error('Error processing notification:', error.message)
    return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }) // Return 200 to acknowledge Pub/Sub even if processing fails
  }
})
