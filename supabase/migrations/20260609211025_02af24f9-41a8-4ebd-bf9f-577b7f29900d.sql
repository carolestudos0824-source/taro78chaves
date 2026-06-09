
-- 1) Prevent users from modifying premium fields on their own profile
CREATE OR REPLACE FUNCTION public.prevent_profile_privileged_updates()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin boolean := false;
  is_service boolean := false;
BEGIN
  is_service := (current_setting('request.jwt.claims', true)::jsonb->>'role') = 'service_role';
  IF is_service THEN RETURN NEW; END IF;

  IF auth.uid() IS NOT NULL THEN
    is_admin := public.has_role(auth.uid(), 'admin'::app_role);
  END IF;
  IF is_admin THEN RETURN NEW; END IF;

  -- For regular users: forbid changes to privileged fields
  IF NEW.is_premium IS DISTINCT FROM OLD.is_premium
     OR NEW.premium_until IS DISTINCT FROM OLD.premium_until
     OR NEW.premium_source IS DISTINCT FROM OLD.premium_source THEN
    RAISE EXCEPTION 'Not allowed to modify premium fields';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_profile_privileged_updates ON public.profiles;
CREATE TRIGGER trg_prevent_profile_privileged_updates
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_privileged_updates();

-- 2) Standardize admin checks to app_role typed overload
DROP POLICY IF EXISTS "Admins can view all progress" ON public.user_progress;
CREATE POLICY "Admins can view all progress"
ON public.user_progress
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can view hotmart events" ON public.hotmart_events;
CREATE POLICY "Admins can view hotmart events"
ON public.hotmart_events
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 3) Remove duplicate SELECT policy on daily_challenge_completions
DROP POLICY IF EXISTS "Users can view own challenge completions" ON public.daily_challenge_completions;

-- 4) Add owner-scoped INSERT/UPDATE policies for daily_challenge_completions
CREATE POLICY "Users can insert own challenge completions"
ON public.daily_challenge_completions
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 5) Add owner-scoped INSERT policy for ritual_merits
CREATE POLICY "Users can insert own ritual merits"
ON public.ritual_merits
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 6) Add owner-scoped INSERT/UPDATE policies for user_progress
CREATE POLICY "Users can insert own progress"
ON public.user_progress
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
ON public.user_progress
FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
