-- Fix validation function (remove non-existent keys column)
CREATE OR REPLACE FUNCTION public.validate_user_progress_update()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Allow service role or internal system operations (like signup trigger)
  IF public.is_privileged_caller() THEN 
    RETURN NEW; 
  END IF;

  -- Allow the initial INSERT during signup if auth.uid() is null (internal trigger context)
  -- or if it matches the current user
  IF TG_OP = 'INSERT' THEN
    -- If called from client-side, auth.uid() must match NEW.user_id
    -- If called from handle_new_user() trigger, auth.uid() might be null
    IF auth.uid() IS NOT NULL AND NEW.user_id IS DISTINCT FROM auth.uid() THEN
      RAISE EXCEPTION 'Not allowed: user_id mismatch';
    END IF;

    -- Ensure starting stats are correct for new users
    NEW.xp := 0;
    NEW.level := 1;
    NEW.streak := 0;
    -- Note: keys are in public.keys table, not here
    RETURN NEW;
  END IF;

  -- Protect UPDATEs: users can only update their own progress
  IF NEW.user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Not allowed: user_id mismatch';
  END IF;

  -- Progression anti-cheat logic for UPDATEs
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
$function$;

-- Update handle_new_user to use correct columns
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    initial_display_name TEXT;
BEGIN
  initial_display_name := COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1));

  INSERT INTO public.profiles (user_id, display_name, student_name)
  VALUES (NEW.id, initial_display_name, initial_display_name);

  INSERT INTO public.user_progress (
    user_id, 
    current_module, 
    completed_lessons, 
    completed_quizzes, 
    completed_exercises, 
    completed_modules, 
    badges,
    xp,
    level
  )
  VALUES (
    NEW.id, 
    'fundamentos', 
    '{}', 
    '{}', 
    '{}', 
    '{}', 
    '[
      {"id": "first-step", "name": "Primeiro Passo", "description": "Começou a Jornada do Louco", "icon": "✦", "earned": false},
      {"id": "fool-complete", "name": "O Louco Revelado", "description": "Completou a lição do Louco", "icon": "🃏", "earned": false},
      {"id": "quiz-master", "name": "Mestre do Quiz", "description": "Acertou 100% em um quiz", "icon": "⭐", "earned": false},
      {"id": "deep-diver", "name": "Mergulho Profundo", "description": "Explorou todo o aprofundamento", "icon": "🔮", "earned": false},
      {"id": "streak-3", "name": "Chama Constante", "description": "3 dias consecutivos de estudo", "icon": "🔥", "earned": false},
      {"id": "streak-7", "name": "Devoto do Tarô", "description": "7 dias consecutivos de estudo", "icon": "💫", "earned": false},
      {"id": "library-explorer", "name": "Exploradora", "description": "Acessou 3 materiais extras", "icon": "📚", "earned": false}
    ]'::jsonb,
    0,
    1
  );

  RETURN NEW;
END;
$function$;