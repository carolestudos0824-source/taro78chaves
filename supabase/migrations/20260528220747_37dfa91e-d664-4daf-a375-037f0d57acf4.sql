-- Garantir que admins possam ver os eventos e direitos da Hotmart
GRANT SELECT ON public.hotmart_events TO authenticated;
GRANT SELECT ON public.hotmart_entitlements TO authenticated;

-- Atualizar política de hotmart_events para usar user_roles
DROP POLICY IF EXISTS "Admins can view events" ON public.hotmart_events;
CREATE POLICY "Admins can view events" ON public.hotmart_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role = 'admin'
        )
    );

-- Adicionar política de admin para hotmart_entitlements
CREATE POLICY "Admins can view all entitlements" ON public.hotmart_entitlements
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role = 'admin'
        )
    );

-- Corrigir a função de vínculo automático no cadastro
CREATE OR REPLACE FUNCTION public.link_hotmart_entitlement_on_signup()
RETURNS TRIGGER AS $$
DECLARE
    user_email TEXT;
BEGIN
    -- Obter o e-mail do usuário recém-criado
    SELECT email INTO user_email FROM auth.users WHERE id = NEW.user_id;
    
    IF user_email IS NOT NULL THEN
        -- Procura entitlements pendentes para este e-mail
        UPDATE public.hotmart_entitlements
        SET user_id = NEW.user_id,
            access_status = 'active',
            updated_at = now()
        WHERE buyer_email_normalized = lower(user_email)
        AND user_id IS NULL;
        
        -- Se atualizou algo, o trigger process_hotmart_entitlement cuidará de atualizar o perfil
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
