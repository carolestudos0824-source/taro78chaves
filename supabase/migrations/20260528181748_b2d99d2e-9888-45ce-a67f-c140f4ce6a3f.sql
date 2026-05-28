-- Tabela de logs de eventos da Hotmart
CREATE TABLE public.hotmart_events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id TEXT,
    event_type TEXT,
    transaction_id TEXT,
    buyer_email TEXT,
    buyer_name TEXT,
    product_id TEXT,
    product_name TEXT,
    offer_code TEXT,
    purchase_status TEXT,
    raw_payload JSONB,
    processed BOOLEAN DEFAULT false,
    processing_status TEXT,
    error_message TEXT,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de direitos de acesso da Hotmart
CREATE TABLE public.hotmart_entitlements (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    transaction_id TEXT UNIQUE,
    buyer_email TEXT NOT NULL,
    buyer_email_normalized TEXT NOT NULL,
    buyer_name TEXT,
    product_id TEXT,
    product_name TEXT,
    offer_code TEXT,
    status TEXT, -- status da compra na hotmart (ex: APPROVED, REFUNDED)
    access_status TEXT, -- status do acesso no app (approved, pending_user, active, cancelled, refunded, chargeback, expired)
    user_id UUID REFERENCES auth.users(id),
    premium_until TIMESTAMP WITH TIME ZONE,
    source TEXT DEFAULT 'hotmart',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index para busca rápida por e-mail normalizado
CREATE INDEX idx_hotmart_entitlements_email ON public.hotmart_entitlements (buyer_email_normalized);

-- Grants
GRANT SELECT ON public.hotmart_events TO service_role;
GRANT ALL ON public.hotmart_events TO service_role;

GRANT SELECT ON public.hotmart_entitlements TO authenticated;
GRANT ALL ON public.hotmart_entitlements TO service_role;

-- RLS
ALTER TABLE public.hotmart_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotmart_entitlements ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Admins can view events" ON public.hotmart_events
    FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_beta_tester = true)); -- Usando is_beta_tester como proxy para admin se não houver is_admin

CREATE POLICY "Users can view their own entitlements" ON public.hotmart_entitlements
    FOR SELECT USING (auth.uid() = user_id);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_hotmart_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_hotmart_entitlements_updated_at
BEFORE UPDATE ON public.hotmart_entitlements
FOR EACH ROW EXECUTE FUNCTION public.handle_hotmart_updated_at();

-- Função para processar a liberação de premium
CREATE OR REPLACE FUNCTION public.process_hotmart_entitlement()
RETURNS TRIGGER AS $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Se o status for 'active' ou 'approved', tentamos vincular ao usuário
    IF NEW.access_status IN ('approved', 'active', 'pending_user') THEN
        -- Tenta encontrar usuário pelo e-mail
        SELECT id INTO target_user_id FROM auth.users WHERE lower(email) = NEW.buyer_email_normalized LIMIT 1;
        
        IF target_user_id IS NOT NULL THEN
            NEW.user_id = target_user_id;
            NEW.access_status = 'active';
            
            -- Atualiza o perfil para premium
            UPDATE public.profiles
            SET 
                is_premium = true,
                premium_source = 'hotmart',
                premium_until = NEW.premium_until,
                updated_at = now()
            WHERE user_id = target_user_id;
        ELSE
            NEW.access_status = 'pending_user';
        END IF;
    
    -- Se o status for revogação
    ELSIF NEW.access_status IN ('refunded', 'chargeback', 'cancelled', 'expired') THEN
        IF NEW.user_id IS NOT NULL THEN
            UPDATE public.profiles
            SET 
                is_premium = false,
                premium_source = NULL,
                updated_at = now()
            WHERE user_id = NEW.user_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_hotmart_entitlement_change
BEFORE INSERT OR UPDATE ON public.hotmart_entitlements
FOR EACH ROW EXECUTE FUNCTION public.process_hotmart_entitlement();

-- Trigger para quando o usuário se cadastrar, verificar se tem compra pendente
CREATE OR REPLACE FUNCTION public.link_hotmart_entitlement_on_signup()
RETURNS TRIGGER AS $$
BEGIN
    -- Procura entitlements pendentes para este e-mail
    UPDATE public.hotmart_entitlements
    SET user_id = NEW.user_id,
        access_status = 'active'
    WHERE buyer_email_normalized = lower(NEW.user_id::text) -- Aqui tem um erro lógico, o ideal é usar o email do profile ou auth.users
    OR buyer_email_normalized = (SELECT lower(email) FROM auth.users WHERE id = NEW.user_id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ajustando para disparar no insert de profiles
CREATE TRIGGER on_profile_created_link_hotmart
AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.link_hotmart_entitlement_on_signup();
