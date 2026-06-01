-- 1. Papel Auditor
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'app_role' AND e.enumlabel = 'auditor') THEN
    ALTER TYPE public.app_role ADD VALUE 'auditor';
  END IF;
END $$;

-- 2. Revogar EXECUTE de funções trigger/internas
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.process_hotmart_entitlement() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.link_hotmart_entitlement_on_signup() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon;

-- 3. Garantir search_path em todas as SEC DEF
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.process_hotmart_entitlement() SET search_path = public;
ALTER FUNCTION public.link_hotmart_entitlement_on_signup() SET search_path = public;
ALTER FUNCTION public.validate_certificate(text) SET search_path = public;
ALTER FUNCTION public.redeem_gift_code(text, uuid) SET search_path = public;
ALTER FUNCTION public.has_role(uuid, app_role) SET search_path = public;

-- 4. Proteção contra execução direta de admin RPCs
REVOKE EXECUTE ON FUNCTION public.manually_release_hotmart_access(text, text) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.manually_release_hotmart_access(text, text) TO service_role; -- Apenas via admin code seguro ou service_role

-- 5. Atualizar manually_release_hotmart_access para checagem interna de admin apenas
CREATE OR REPLACE FUNCTION public.manually_release_hotmart_access(p_email text, p_transaction_id text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
        RAISE EXCEPTION 'Acesso negado. Apenas administradores podem realizar esta ação.';
    END IF;

    INSERT INTO public.hotmart_entitlements (
        transaction_id, buyer_email, buyer_email_normalized, buyer_name, status, access_status, premium_until, source
    ) VALUES (
        p_transaction_id, p_email, lower(trim(p_email)), 'Manual Admin', 'approved', 'approved', now() + interval '12 months', 'manual_admin'
    )
    ON CONFLICT (transaction_id) DO UPDATE SET
        buyer_email = EXCLUDED.buyer_email,
        buyer_email_normalized = EXCLUDED.buyer_email_normalized,
        status = 'approved',
        access_status = 'approved',
        premium_until = EXCLUDED.premium_until,
        updated_at = now();

    RETURN jsonb_build_object('success', true);
END;
$function$;

-- 6. Garantir que Moderator/Auditor não tenha privilégios de admin em outras tabelas sensíveis
-- (As políticas existentes já usam has_role(uid, 'admin'), o que é correto)
