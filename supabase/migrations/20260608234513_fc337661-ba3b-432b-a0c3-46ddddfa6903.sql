CREATE TABLE public.ritual_streaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_completed_date DATE,
  streak_protection_available BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE public.daily_ritual_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ritual_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  items_json JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, ritual_date)
);

CREATE TABLE public.ritual_merits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  merit_key TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, merit_key)
);

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ritual_streaks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_ritual_progress TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ritual_merits TO authenticated;

GRANT ALL ON public.ritual_streaks TO service_role;
GRANT ALL ON public.daily_ritual_progress TO service_role;
GRANT ALL ON public.ritual_merits TO service_role;

-- RLS
ALTER TABLE public.ritual_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_ritual_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ritual_merits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own ritual streaks" 
  ON public.ritual_streaks FOR ALL 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own ritual progress" 
  ON public.daily_ritual_progress FOR ALL 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own ritual merits" 
  ON public.ritual_merits FOR ALL 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_ritual_streaks_updated_at
BEFORE UPDATE ON public.ritual_streaks
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_daily_ritual_progress_updated_at
BEFORE UPDATE ON public.daily_ritual_progress
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();