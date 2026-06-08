-- Ensure we are working on public schema
SET search_path TO public;

-- Standardize roles in policies
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles" 
ON public.profiles 
FOR ALL 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Secure column privileges - This must be done carefully
-- Explicitly revoke from everyone first
REVOKE ALL ON public.profiles FROM authenticated;
REVOKE ALL ON public.profiles FROM anon;

-- Grant standard table access (SELECT)
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- Grant UPDATE ONLY on specific safe columns for authenticated
GRANT UPDATE (student_name, avatar_url, display_name) ON public.profiles TO authenticated;

-- Ensure service_role has full control for backend tasks
GRANT ALL ON public.profiles TO service_role;

-- Final check on has_role to ensure it's robust
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

CREATE OR REPLACE FUNCTION public.has_role(user_id uuid, role_name text)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = $1 AND user_roles.role::text = $2
  );
END;
$function$;
