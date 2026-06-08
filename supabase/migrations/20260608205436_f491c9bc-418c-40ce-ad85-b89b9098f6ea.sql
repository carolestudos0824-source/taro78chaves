-- Ensure we are working on public schema
SET search_path TO public;

-- 1. Base table grants for Data API
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;

-- 2. Column-level security (re-apply)
-- Revoke update on sensitive columns for authenticated
REVOKE UPDATE (is_premium, premium_until, premium_source, stripe_customer_id, created_at, updated_at) ON public.profiles FROM authenticated;

-- Ensure safe columns ARE updatable
GRANT UPDATE (student_name, avatar_url, display_name) ON public.profiles TO authenticated;

-- 3. Final Policy standardizing has_role
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles" 
ON public.profiles 
FOR ALL 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 4. User progress safety
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_progress TO authenticated;
GRANT ALL ON public.user_progress TO service_role;

DROP POLICY IF EXISTS "Users can manage own progress" ON public.user_progress;
CREATE POLICY "Users can manage own progress" 
ON public.user_progress 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
