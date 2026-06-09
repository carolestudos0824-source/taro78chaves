-- Ajustar política de Admin na user_progress para ser mais precisa
DROP POLICY IF EXISTS "Admins can view all progress" ON public.user_progress;

CREATE POLICY "Admins can view all progress" 
ON public.user_progress 
FOR SELECT 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));
