-- 1. Secure and Unified has_role function
-- We won't drop it because of dependencies, just replace the body to be safer
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$function$;

-- 2. Profiles Table Hardening
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
TO public
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
TO authenticated
WITH CHECK (
  (auth.uid() = user_id) AND
  (is_premium IS FALSE OR is_premium IS NULL) AND
  (premium_until IS NULL) AND
  (premium_source IS NULL) AND
  (stripe_customer_id IS NULL)
);

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

DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile" 
ON public.profiles FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 3. User Progress Hardening
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
CREATE POLICY "Users can view own progress" 
ON public.user_progress FOR SELECT 
TO public
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
CREATE POLICY "Users can insert own progress" 
ON public.user_progress FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;
CREATE POLICY "Users can update own progress" 
ON public.user_progress FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. Daily Challenge Completions Hardening
ALTER TABLE public.daily_challenge_completions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own challenge completions" ON public.daily_challenge_completions;
CREATE POLICY "Users can view own challenge completions" 
ON public.daily_challenge_completions FOR SELECT 
TO public
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own challenge completions" ON public.daily_challenge_completions;
CREATE POLICY "Users can insert own challenge completions" 
ON public.daily_challenge_completions FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 5. User Roles Hardening
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles" 
ON public.user_roles FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles" 
ON public.user_roles FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 6. Google Play Subscriptions Hardening (Read-only for users)
ALTER TABLE public.google_play_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own google play subscriptions" ON public.google_play_subscriptions;
CREATE POLICY "Users can view their own google play subscriptions" 
ON public.google_play_subscriptions FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own google play subscriptions" ON public.google_play_subscriptions;
DROP POLICY IF EXISTS "Users can update their own google play subscriptions" ON public.google_play_subscriptions;

-- Ensure service_role can manage all
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
