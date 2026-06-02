import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"
import { createLocalJWKSet, jwtVerify, SignJWT, importPKCS8 } from "https://deno.land/x/jose@v4.14.4/index.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Package Name
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
  if (data.error) throw new Error(`OAuth error: ${data.error_description || data.error}`);
  return data.access_token;
}

async function validateSubscription(accessToken: string, purchaseToken: string, productId: string) {
  // Use V2 API for subscriptions as it's the current standard
  // GET https://androidpublisher.googleapis.com/androidpublisher/v3/applications/{packageName}/purchases/subscriptionsv2/tokens/{token}
  const url = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${PACKAGE_NAME}/purchases/subscriptionsv2/tokens/${purchaseToken}`;
  
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Google Play API error: ${err.error?.message || response.statusText}`);
  }

  return await response.json();
}

async function acknowledgeSubscription(accessToken: string, purchaseToken: string, productId: string) {
  // POST https://androidpublisher.googleapis.com/androidpublisher/v3/applications/{packageName}/purchases/subscriptions/{subscriptionId}/tokens/{token}:acknowledge
  const url = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${PACKAGE_NAME}/purchases/subscriptions/${productId}/tokens/${purchaseToken}:acknowledge`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: { 
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({}),
  });

  if (!response.ok && response.status !== 204) {
    const err = await response.json();
    console.error(`Error acknowledging subscription: ${err.error?.message || response.statusText}`);
  }
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

    if (!purchaseToken || !productId) {
      throw new Error('Missing purchaseToken or productId')
    }

    // Get the user from the authorization header
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)

    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // 1. Check if token already exists to prevent reuse
    const { data: existingSub } = await supabaseClient
      .from('google_play_subscriptions')
      .select('user_id')
      .eq('purchase_token', purchaseToken)
      .maybeSingle();

    if (existingSub && existingSub.user_id !== user.id) {
      throw new Error('This purchase token is already associated with another account.')
    }

    // 2. Validate with Google Play
    const serviceAccountJson = Deno.env.get('GOOGLE_PLAY_SERVICE_ACCOUNT')
    if (!serviceAccountJson) {
      throw new Error('GOOGLE_PLAY_SERVICE_ACCOUNT secret is not configured.')
    }
    const serviceAccount = JSON.parse(serviceAccountJson)
    
    const accessToken = await getAccessToken(serviceAccount)
    const playData = await validateSubscription(accessToken, purchaseToken, productId)

    console.log(`Validated purchase for user ${user.id}:`, JSON.stringify(playData))

    // Subscription State: 1 = ACTIVE, 2 = EXPIRED, 3 = CANCELED, etc.
    // In V2, it's a bit different: state is in sub.subscriptionState
    // ACTIVE = "SUBSCRIPTION_STATE_ACTIVE"
    const isActive = playData.subscriptionState === "SUBSCRIPTION_STATE_ACTIVE" || playData.subscriptionState === "SUBSCRIPTION_STATE_IN_GRACE_PERIOD";
    
    if (!isActive) {
      throw new Error(`Subscription is not active (State: ${playData.subscriptionState})`)
    }

    // Find the latest line item/expiry
    // The structure for V2 is an array of lineItems
    const lineItem = playData.lineItems?.[0];
    const expiresAt = lineItem?.expiryTime;
    const orderId = playData.latestOrderId;

    if (!expiresAt) {
      throw new Error('Could not determine expiration time from Google Play response.')
    }

    // 3. Acknowledge if not already acknowledged
    if (playData.acknowledgementState === "ACKNOWLEDGEMENT_STATE_PENDING") {
      await acknowledgeSubscription(accessToken, purchaseToken, productId);
    }

    // 4. Record the subscription
    const { error: subError } = await supabaseClient
      .from('google_play_subscriptions')
      .upsert({
        user_id: user.id,
        product_id: productId,
        base_plan_id: basePlanId || 'unknown',
        purchase_token: purchaseToken,
        subscription_status: 'active',
        expires_at: expiresAt,
        order_id: orderId,
        acknowledged_at: new Date().toISOString(),
        raw_payload: playData,
        updated_at: new Date().toISOString()
      }, { onConflict: 'purchase_token' })

    if (subError) throw subError

    // 5. Update user profile
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .update({
        is_premium: true,
        premium_until: expiresAt,
        premium_source: 'google_play'
      })
      .eq('user_id', user.id)

    if (profileError) throw profileError

    return new Response(
      JSON.stringify({ success: true, expiresAt }),
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
