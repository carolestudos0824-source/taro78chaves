-- 1. Remove permissive policies for google_play_subscriptions
DROP POLICY IF EXISTS "Users can insert their own google play subscriptions" ON public.google_play_subscriptions;
DROP POLICY IF EXISTS "Users can update their own google play subscriptions" ON public.google_play_subscriptions;
DROP POLICY IF EXISTS "Users can view their own google play subscriptions" ON public.google_play_subscriptions;

-- 2. Create restricted policies for google_play_subscriptions
-- Users can only READ their own status
CREATE POLICY "Users can view their own google play subscriptions" 
ON public.google_play_subscriptions FOR SELECT 
USING (auth.uid() = user_id);

-- Service role and admins can manage
GRANT ALL ON public.google_play_subscriptions TO service_role;
GRANT ALL ON public.google_play_subscriptions TO postgres;

-- 3. Review and strengthen profiles RLS
DROP POLICY IF EXISTS "Users can update own safe fields" ON public.profiles;

CREATE POLICY "Users can update own safe fields" 
ON public.profiles FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  (auth.uid() = user_id) AND 
  (is_premium IS NOT DISTINCT FROM (SELECT is_premium FROM public.profiles WHERE user_id = auth.uid())) AND
  (premium_until IS NOT DISTINCT FROM (SELECT premium_until FROM public.profiles WHERE user_id = auth.uid())) AND
  (premium_source IS NOT DISTINCT FROM (SELECT premium_source FROM public.profiles WHERE user_id = auth.uid())) AND
  (stripe_customer_id IS NOT DISTINCT FROM (SELECT stripe_customer_id FROM public.profiles WHERE user_id = auth.uid()))
);

-- 4. Create an audit log table if it doesn't exist (already saw admin_audit_log, but let's check its schema)
-- Assuming admin_audit_log exists and has common columns.

-- 5. Add a function to check for admin role if not exists
CREATE OR REPLACE FUNCTION public.has_role(user_id uuid, role_name text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = $1 AND user_roles.role = $2
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
