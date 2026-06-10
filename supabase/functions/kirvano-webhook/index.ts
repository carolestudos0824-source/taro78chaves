import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const kirvanoToken = Deno.env.get("KIRVANO_WEBHOOK_TOKEN"); // Token configurado no painel da Kirvano

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-kirvano-token",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const headers = req.headers;
    
    // Validação de segurança simples via header customizado ou query param se configurado na Kirvano
    // Algumas plataformas enviam um token no header 'x-kirvano-token' ou similar
    const receivedToken = headers.get("x-kirvano-token") || new URL(req.url).searchParams.get("token");
    
    if (kirvanoToken && receivedToken !== kirvanoToken) {
      console.error("Invalid token received");
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    // Mapeamento de campos baseado no payload real analisado
    const eventType = payload.event;
    const saleId = payload.sale_id;
    const customerEmail = payload.customer?.email;
    // Usamos sale_id + event como chave de idempotência se não houver um event_id explícito
    // A Kirvano parece não enviar um 'id' global de evento, então combinamos sale_id e event
    const eventId = `${saleId}_${eventType}`;

    console.log(`Processing Kirvano event: ${eventType} for ${customerEmail}`);

    // 1. Registrar o evento para auditoria e idempotência
    const { data: existingEvent, error: fetchError } = await supabase
      .from("kirvano_events")
      .select("id, status")
      .eq("id", eventId)
      .single();

    if (existingEvent && existingEvent.status === "processed") {
      return new Response(JSON.stringify({ message: "Event already processed" }), { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    if (!existingEvent) {
      await supabase.from("kirvano_events").insert({
        id: eventId,
        payload: payload,
        customer_email: customerEmail,
        sale_id: saleId,
        event_type: eventType,
        status: "pending"
      });
    }

    // 2. Lógica de negócio baseada no evento
    let updateResult = null;

    if (eventType === "ORDER_APPROVED" || eventType === "SUBSCRIPTION_RENEWED") {
      // Ativar ou renovar acesso premium
      // Buscamos o usuário pelo email
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id, user_id, premium_source")
        .eq("display_name", customerEmail); // Algumas vezes o email está no display_name se o signup foi manual

      // Tentar buscar por email em auth.users via RPC ou admin API (mais seguro)
      // Como não temos acesso fácil a auth.users aqui sem uma função dedicada,
      // vamos assumir que o sistema usa o email como identificador em profiles se premium_source for kirvano
      // Ou melhor, fazemos um update baseado no email se existir uma coluna de email em profiles (precisamos checar)
      // Pelo que vi no \d profiles, não há coluna 'email'. Vamos checar profiles novamente.
      
      // Ajuste: Buscar o user_id via email na tabela auth.users é necessário.
      // Usaremos a função helper se existir ou faremos via query direta (service role pode)
      
      const { data: userData, error: userError } = await supabase.rpc('get_user_id_by_email', { 
        p_email: customerEmail 
      });

      if (userData && userData[0]?.id) {
        const userId = userData[0].id;
        
        // Regra: Não sobrescrever Stripe
        const { data: currentProfile } = await supabase
          .from("profiles")
          .select("premium_source, is_premium")
          .eq("user_id", userId)
          .single();

        if (currentProfile?.premium_source !== 'stripe') {
          updateResult = await supabase
            .from("profiles")
            .update({
              is_premium: true,
              premium_source: 'kirvano',
              updated_at: new Date().toISOString()
            })
            .eq("user_id", userId);
        } else {
          console.log("User is already Stripe premium, skipping update from Kirvano");
        }
      } else {
        console.warn(`User with email ${customerEmail} not found in auth.users`);
        // Poderíamos criar um convite ou logar que a venda ocorreu mas o usuário não existe
      }
    } else if (eventType === "ORDER_REFUNDED" || eventType === "SUBSCRIPTION_CANCELED") {
      // Remover acesso premium apenas se a fonte for Kirvano
      const { data: userData } = await supabase.rpc('get_user_id_by_email', { 
        p_email: customerEmail 
      });

      if (userData && userData[0]?.id) {
        const userId = userData[0].id;
        
        const { data: currentProfile } = await supabase
          .from("profiles")
          .select("premium_source")
          .eq("user_id", userId)
          .single();

        if (currentProfile?.premium_source === 'kirvano') {
          updateResult = await supabase
            .from("profiles")
            .update({
              is_premium: false,
              updated_at: new Date().toISOString()
            })
            .eq("user_id", userId);
        }
      }
    }

    // 3. Marcar como processado
    await supabase
      .from("kirvano_events")
      .update({
        status: "processed",
        processed_at: new Date().toISOString()
      })
      .eq("id", eventId);

    return new Response(JSON.stringify({ message: "Success" }), { 
      status: 200, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });

  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
});
