-- Ensure grants for authenticated users
GRANT ALL ON public.user_progress TO authenticated;
GRANT ALL ON public.user_progress TO service_role;
GRANT ALL ON public.daily_challenge_completions TO authenticated;
GRANT ALL ON public.daily_challenge_completions TO service_role;
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- Re-verify RLS is enabled
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenge_completions ENABLE ROW LEVEL SECURITY;

-- Ensure clean policies for user_progress
DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Admins can view all progress" ON public.user_progress;

CREATE POLICY "Users can view own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Ensure clean policies for daily_challenge_completions
DROP POLICY IF EXISTS "Users can view own challenge completions" ON public.daily_challenge_completions;
DROP POLICY IF EXISTS "Users can insert own challenge completions" ON public.daily_challenge_completions;

CREATE POLICY "Users can view own challenge completions" ON public.daily_challenge_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own challenge completions" ON public.daily_challenge_completions FOR INSERT WITH CHECK (auth.uid() = user_id);
