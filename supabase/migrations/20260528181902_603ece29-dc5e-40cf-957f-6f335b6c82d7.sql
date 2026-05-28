CREATE OR REPLACE FUNCTION public.link_hotmart_entitlement_on_signup()
RETURNS TRIGGER AS $$
DECLARE
    user_email TEXT;
BEGIN
    -- Busca o email na tabela auth.users usando o user_id do perfil
    SELECT lower(email) INTO user_email FROM auth.users WHERE id = NEW.user_id;
    
    IF user_email IS NOT NULL THEN
        -- Procura entitlements pendentes para este e-mail e vincula
        UPDATE public.hotmart_entitlements
        SET user_id = NEW.user_id,
            access_status = 'active'
        WHERE buyer_email_normalized = user_email
        AND access_status = 'pending_user';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
