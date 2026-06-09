
DROP POLICY IF EXISTS "Admins can view all google play subscriptions" ON public.google_play_subscriptions;
CREATE POLICY "Admins can view all google play subscriptions"
ON public.google_play_subscriptions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can view all notification logs" ON public.notification_logs;
CREATE POLICY "Admins can view all notification logs"
ON public.notification_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.is_privileged_caller()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_service boolean := false;
BEGIN
  is_service := (current_setting('request.jwt.claims', true)::jsonb->>'role') = 'service_role';
  IF is_service THEN RETURN true; END IF;
  IF auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN true;
  END IF;
  RETURN false;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_daily_challenge_completion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.is_privileged_caller() THEN RETURN NEW; END IF;
  IF NEW.user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Not allowed: user_id mismatch';
  END IF;
  IF NEW.xp_earned IS NULL OR NEW.xp_earned < 0 THEN
    NEW.xp_earned := 0;
  ELSIF NEW.xp_earned > 50 THEN
    NEW.xp_earned := 50;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_daily_challenge_completion ON public.daily_challenge_completions;
CREATE TRIGGER trg_validate_daily_challenge_completion
BEFORE INSERT OR UPDATE ON public.daily_challenge_completions
FOR EACH ROW EXECUTE FUNCTION public.validate_daily_challenge_completion();

CREATE OR REPLACE FUNCTION public.validate_quiz_response()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.is_privileged_caller() THEN RETURN NEW; END IF;
  IF NEW.user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Not allowed: user_id mismatch';
  END IF;
  IF NEW.xp_earned IS NULL OR NEW.xp_earned < 0 THEN
    NEW.xp_earned := 0;
  ELSIF NEW.xp_earned > 100 THEN
    NEW.xp_earned := 100;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_quiz_response ON public.quiz_responses;
CREATE TRIGGER trg_validate_quiz_response
BEFORE INSERT OR UPDATE ON public.quiz_responses
FOR EACH ROW EXECUTE FUNCTION public.validate_quiz_response();

CREATE OR REPLACE FUNCTION public.validate_ritual_merit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.is_privileged_caller() THEN RETURN NEW; END IF;
  IF NEW.user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Not allowed: user_id mismatch';
  END IF;
  IF NEW.merit_key IS NULL OR length(NEW.merit_key) > 64
     OR NEW.merit_key !~ '^[a-z0-9_\-]+$' THEN
    RAISE EXCEPTION 'Invalid merit_key';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_ritual_merit ON public.ritual_merits;
CREATE TRIGGER trg_validate_ritual_merit
BEFORE INSERT OR UPDATE ON public.ritual_merits
FOR EACH ROW EXECUTE FUNCTION public.validate_ritual_merit();

CREATE OR REPLACE FUNCTION public.validate_ritual_streak()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.is_privileged_caller() THEN RETURN NEW; END IF;
  IF NEW.user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Not allowed: user_id mismatch';
  END IF;
  IF NEW.current_streak IS NULL OR NEW.current_streak < 0 THEN NEW.current_streak := 0; END IF;
  IF NEW.current_streak > 3650 THEN NEW.current_streak := 3650; END IF;
  IF NEW.longest_streak IS NULL OR NEW.longest_streak < 0 THEN NEW.longest_streak := 0; END IF;
  IF NEW.longest_streak > 3650 THEN NEW.longest_streak := 3650; END IF;
  IF TG_OP = 'UPDATE' AND OLD.current_streak IS NOT NULL THEN
    IF NEW.current_streak > OLD.current_streak + 1 THEN
      NEW.current_streak := OLD.current_streak + 1;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_ritual_streak ON public.ritual_streaks;
CREATE TRIGGER trg_validate_ritual_streak
BEFORE INSERT OR UPDATE ON public.ritual_streaks
FOR EACH ROW EXECUTE FUNCTION public.validate_ritual_streak();

CREATE OR REPLACE FUNCTION public.validate_user_progress_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.is_privileged_caller() THEN RETURN NEW; END IF;
  IF NEW.user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Not allowed: user_id mismatch';
  END IF;
  IF TG_OP = 'INSERT' THEN
    NEW.xp := 0;
    IF NEW.level IS NULL OR NEW.level <> 1 THEN NEW.level := 1; END IF;
    NEW.streak := COALESCE(NEW.streak, 0);
    RETURN NEW;
  END IF;
  IF NEW.xp IS DISTINCT FROM OLD.xp THEN
    IF NEW.xp < OLD.xp THEN NEW.xp := OLD.xp; END IF;
    IF NEW.xp > OLD.xp + 500 THEN NEW.xp := OLD.xp + 500; END IF;
  END IF;
  IF NEW.level IS DISTINCT FROM OLD.level THEN
    IF NEW.level < OLD.level THEN NEW.level := OLD.level; END IF;
    IF NEW.level > OLD.level + 2 THEN NEW.level := OLD.level + 2; END IF;
  END IF;
  IF NEW.streak IS DISTINCT FROM OLD.streak THEN
    IF NEW.streak > COALESCE(OLD.streak, 0) + 1 AND NEW.streak <> 0 THEN
      NEW.streak := COALESCE(OLD.streak, 0) + 1;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_user_progress_update ON public.user_progress;
CREATE TRIGGER trg_validate_user_progress_update
BEFORE INSERT OR UPDATE ON public.user_progress
FOR EACH ROW EXECUTE FUNCTION public.validate_user_progress_update();
