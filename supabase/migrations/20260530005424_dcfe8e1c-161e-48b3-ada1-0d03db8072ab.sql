CREATE OR REPLACE FUNCTION public.manually_release_hotmart_access(p_email TEXT, p_transaction_id TEXT)
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    -- Verifica se quem está chamando é admin
    IF NOT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_roles.user_id = auth.uid() 
        AND user_roles.role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Acesso negado. Apenas administradores podem realizar esta ação.';
    END IF;

    -- Upsert no entitlement
    INSERT INTO public.hotmart_entitlements (
        transaction_id,
        buyer_email,
        buyer_email_normalized,
        buyer_name,
        status,
        access_status,
        premium_until,
        source
    ) VALUES (
        p_transaction_id,
        p_email,
        lower(trim(p_email)),
        'Manual Admin',
        'approved',
        'approved',
        now() + interval '12 months',
        'manual_admin'
    )
    ON CONFLICT (transaction_id) DO UPDATE SET
        buyer_email = EXCLUDED.buyer_email,
        buyer_email_normalized = EXCLUDED.buyer_email_normalized,
        status = 'approved',
        access_status = 'approved',
        premium_until = EXCLUDED.premium_until,
        updated_at = now();

    v_result = jsonb_build_object(
        'success', true,
        'message', 'Acesso liberado com sucesso para ' || p_email
    );

    RETURN v_result;
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', false,
        'message', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Grant execution to authenticated users (the check inside handle admins)
GRANT EXECUTE ON FUNCTION public.manually_release_hotmart_access(TEXT, TEXT) TO authenticated;