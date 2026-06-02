import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"
import { importPKCS8, SignJWT } from "https://deno.land/x/jose@v4.14.4/index.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PACKAGE_NAME = "br.com.taro78chaves.app";

async function getAccessToken(serviceAccount: any) {
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/androidpublisher",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const key = await importPKCS8(serviceAccount.private_key, "RS256");
  const jwt = await new SignJWT(claim)
    .setProtectedHeader({ alg: "RS256" })
    .sign(key);

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const data = await response.json();
  return data.access_token;
}

async function fetchSubscriptionStatus(accessToken: string, purchaseToken: string) {
  const url = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${PACKAGE_NAME}/purchases/subscriptionsv2/tokens/${purchaseToken}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) return null;
  return await response.json();
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
    console.log('Received RTDN:', JSON.stringify(payload))

    if (!payload.message?.data) {
      return new Response('No data', { status: 200 }) // Return 200 to acknowledge
    }

    const decodedData = JSON.parse(atob(payload.message.data))
    const { subscriptionNotification } = decodedData

    if (subscriptionNotification) {
      const { purchaseToken } = subscriptionNotification
      
      const serviceAccountJson = Deno.env.get('GOOGLE_PLAY_SERVICE_ACCOUNT')
      if (!serviceAccountJson) throw new Error('Secret missing')
      const serviceAccount = JSON.parse(serviceAccountJson)
      
      const accessToken = await getAccessToken(serviceAccount)
      const playData = await fetchSubscriptionStatus(accessToken, purchaseToken)

      if (!playData) {
        console.error('Could not verify subscription with Google')
        return new Response('Not verified', { status: 200 })
      }

      // Find user
      const { data: sub } = await supabaseClient
        .from('google_play_subscriptions')
        .select('user_id')
        .eq('purchase_token', purchaseToken)
        .maybeSingle()

      if (!sub) {
        console.log('Subscription not found in DB')
        return new Response('Not found', { status: 200 })
      }

      const isActive = playData.subscriptionState === "SUBSCRIPTION_STATE_ACTIVE" || playData.subscriptionState === "SUBSCRIPTION_STATE_IN_GRACE_PERIOD";
      const expiresAt = playData.lineItems?.[0]?.expiryTime;
      
      // Update subscription record
      await supabaseClient
        .from('google_play_subscriptions')
        .update({ 
          subscription_status: isActive ? 'active' : 'expired',
          expires_at: expiresAt,
          raw_payload: playData,
          updated_at: new Date().toISOString()
        })
        .eq('purchase_token', purchaseToken)

      // Update profile
      await supabaseClient
        .from('profiles')
        .update({ 
          is_premium: isActive,
          premium_until: expiresAt,
          premium_source: 'google_play'
        })
        .eq('user_id', sub.user_id)
        .eq('premium_source', 'google_play')

      console.log(`Updated user ${sub.user_id} premium status to ${isActive}`)
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 })

  } catch (error) {
    console.error('Error:', error.message)
    return new Response('ok', { status: 200 })
  }
})
