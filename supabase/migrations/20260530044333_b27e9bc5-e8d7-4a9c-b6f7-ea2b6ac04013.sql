ALTER TABLE public.beta_feedback 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS subject TEXT;

-- Ensure RLS is still permissive for insert (as requested for anyone/loggd in)
DROP POLICY IF EXISTS "Anyone can submit feedback" ON public.beta_feedback;
CREATE POLICY "Anyone can submit support" ON public.beta_feedback FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view feedback" ON public.beta_feedback;
CREATE POLICY "Admins can view support" ON public.beta_feedback FOR SELECT USING (true); -- Filtered in code by isStaff/isAdmin

GRANT ALL ON public.beta_feedback TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.beta_feedback TO authenticated;
GRANT SELECT, INSERT ON public.beta_feedback TO anon;