-- 1. Fix search_path for verified existing functions
ALTER FUNCTION public.handle_updated_at() SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.process_hotmart_entitlement() SET search_path = public;
ALTER FUNCTION public.link_hotmart_entitlement_on_signup() SET search_path = public;
ALTER FUNCTION public.handle_hotmart_updated_at() SET search_path = public;
ALTER FUNCTION public.enforce_quiz_publish_threshold() SET search_path = public;
ALTER FUNCTION public.enforce_arcano_publish_threshold() SET search_path = public;
ALTER FUNCTION public.enforce_arcano_editorial_status() SET search_path = public;

-- 2. Revoke public EXECUTE for verified SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.redeem_gift_code(TEXT, UUID) FROM public;
GRANT EXECUTE ON FUNCTION public.redeem_gift_code(TEXT, UUID) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.validate_certificate(TEXT) FROM public;
GRANT EXECUTE ON FUNCTION public.validate_certificate(TEXT) TO authenticated, anon;

-- 3. user_progress: Final RLS refinement for strict owner-only access
DROP POLICY IF EXISTS "Users can manage own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can only view their own progress" ON public.user_progress;
CREATE POLICY "Users can manage own progress" 
ON public.user_progress FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. Secure hotmart_events
DROP POLICY IF EXISTS "Admins can view hotmart events" ON public.hotmart_events;
CREATE POLICY "Admins can view hotmart events" 
ON public.hotmart_events FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

GRANT SELECT ON public.hotmart_events TO authenticated;
GRANT SELECT ON public.hotmart_events TO service_role;
