
-- 1. Remove overly permissive beta_feedback SELECT policy
DROP POLICY IF EXISTS "Admins can view support" ON public.beta_feedback;

-- 2. Restrict certificates: drop anonymous broad SELECT, add SECURITY DEFINER lookup by code
DROP POLICY IF EXISTS "Public can view valid certificates by validation_code" ON public.certificates;

CREATE OR REPLACE FUNCTION public.validate_certificate(_code text)
RETURNS TABLE (
  student_name text,
  course_name text,
  workload_hours integer,
  issued_at timestamptz,
  status text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.student_name, c.course_name, c.workload_hours, c.issued_at, c.status
  FROM public.certificates c
  WHERE c.validation_code = upper(trim(_code))
    AND c.status = 'issued'
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.validate_certificate(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validate_certificate(text) TO anon, authenticated;

-- 3. Tighten support_tickets: only the authenticated owner can read their tickets
DROP POLICY IF EXISTS "Users can view their own tickets" ON public.support_tickets;
CREATE POLICY "Users can view own tickets"
ON public.support_tickets
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins/moderators can view all support tickets
CREATE POLICY "Staff can view all tickets"
ON public.support_tickets
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- 4. Fix mutable search_path on remaining functions
ALTER FUNCTION public.handle_hotmart_updated_at() SET search_path = public;
ALTER FUNCTION public.process_hotmart_entitlement() SET search_path = public;
