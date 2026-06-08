-- 1. Redefine INSERT policy for profiles
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

-- Note: is_premium usually defaults to false, but we're being explicit.
