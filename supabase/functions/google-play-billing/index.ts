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

    const { purchaseToken, productId, basePlanId } = await req.json()

    // Get the user from the authorization header
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)

    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    console.log(`Validating Google Play purchase for user ${user.id}: ${productId} with token ${purchaseToken}`)

    // TODO: Actually validate with Google Play Developer API
    // Requires GOOGLE_PLAY_SERVICE_ACCOUNT credentials
    // For now, we assume it's valid if we received it from the TWA
    
    // Set expiration to 30 days from now (monthly subscription)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    // 1. Record the subscription
    const { error: subError } = await supabaseClient
      .from('google_play_subscriptions')
      .upsert({
        user_id: user.id,
        product_id: productId,
        base_plan_id: basePlanId,
        purchase_token: purchaseToken,
        subscription_status: 'active',
        expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'purchase_token' })

    if (subError) throw subError

    // 2. Update user profile
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .update({
        is_premium: true,
        premium_until: expiresAt.toISOString(),
        premium_source: 'google_play'
      })
      .eq('user_id', user.id)

    if (profileError) throw profileError

    return new Response(
      JSON.stringify({ success: true, expiresAt: expiresAt.toISOString() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Error processing Google Play billing:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
