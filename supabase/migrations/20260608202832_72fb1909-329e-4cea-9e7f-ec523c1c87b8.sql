-- 1. Remove client-side INSERT permission as triggers handle this
REVOKE INSERT ON public.profiles FROM authenticated;
REVOKE INSERT ON public.profiles FROM anon;
REVOKE INSERT ON public.user_progress FROM authenticated;
REVOKE INSERT ON public.user_progress FROM anon;

-- 2. Drop the redundant INSERT policies
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;

-- 3. Ensure SELECT and UPDATE (safe) remain available for the owner
-- (Policies already exist but let's be sure they are there and clear)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
