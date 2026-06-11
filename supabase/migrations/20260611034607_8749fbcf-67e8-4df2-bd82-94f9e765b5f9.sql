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

  INSERT INTO public.user_progress (user_id, current_module, completed_lessons, completed_quizzes, completed_exercises, completed_modules, badges)
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
    ]'::jsonb
  );

  RETURN NEW;
END;
$function$;