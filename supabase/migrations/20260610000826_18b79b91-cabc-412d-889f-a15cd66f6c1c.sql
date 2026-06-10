
-- 1. Admin-only SELECT policy on gift_codes
CREATE POLICY "Admins can view gift codes"
ON public.gift_codes
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2. Drop the unsafe text overload of has_role
DROP FUNCTION IF EXISTS public.has_role(uuid, text);
