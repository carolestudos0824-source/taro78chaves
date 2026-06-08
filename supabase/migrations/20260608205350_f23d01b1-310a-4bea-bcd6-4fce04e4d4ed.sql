-- 1. CONSOLIDATE has_role
-- Instead of dropping (which breaks dependencies), we redefine the text-based one as a wrapper
CREATE OR REPLACE FUNCTION public.has_role(user_id uuid, role_name text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = $1 AND user_roles.role::text = $2
  );
END;
$function$;

-- Ensure the app_role version is also optimal
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
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

-- 2. ENDURECER PROFILES
-- Revoke update on sensitive columns for authenticated users
REVOKE UPDATE ON public.profiles FROM authenticated;
-- Grant update ONLY on safe columns
GRANT UPDATE (student_name, avatar_url, display_name) ON public.profiles TO authenticated;
-- Grant all to service_role and admin (if role exists)
GRANT ALL ON public.profiles TO service_role;

-- Update RLS policies to be more explicit
DROP POLICY IF EXISTS "Users can update own safe fields" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id AND 
  (
    -- Redundant safety check in RLS
    (is_premium IS NOT DISTINCT FROM (SELECT is_premium FROM public.profiles WHERE user_id = auth.uid())) AND
    (premium_until IS NOT DISTINCT FROM (SELECT premium_until FROM public.profiles WHERE user_id = auth.uid())) AND
    (premium_source IS NOT DISTINCT FROM (SELECT premium_source FROM public.profiles WHERE user_id = auth.uid())) AND
    (stripe_customer_id IS NOT DISTINCT FROM (SELECT stripe_customer_id FROM public.profiles WHERE user_id = auth.uid()))
  )
);

CREATE POLICY "Admins can manage all profiles" 
ON public.profiles 
FOR ALL 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. ENDURECER USER_PROGRESS
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can manage own progress" ON public.user_progress;

CREATE POLICY "Users can view own progress" 
ON public.user_progress 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own progress" 
ON public.user_progress 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
