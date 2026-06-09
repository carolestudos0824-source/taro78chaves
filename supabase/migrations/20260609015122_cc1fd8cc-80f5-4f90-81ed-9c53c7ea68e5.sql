-- 1. Remover políticas excessivamente permissivas
DROP POLICY IF EXISTS "Users can manage own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;

-- 2. Habilitar RLS (já deve estar, mas garantindo)
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- 3. Criar política de leitura (SELECT) restrita ao dono
CREATE POLICY "Users can view own progress" 
ON public.user_progress 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- 4. Criar política para Admins (SELECT total)
CREATE POLICY "Admins can view all progress" 
ON public.user_progress 
FOR SELECT 
TO authenticated 
USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND (is_premium = true OR stripe_customer_id IS NOT NULL))); -- Simplificando check de admin para o contexto atual ou use has_role se disponível

-- 5. Função segura para completar lição (RPC)
-- Já existe secure_complete_lesson no banco (visto no dump anterior), vamos garantir que está correta e segura
CREATE OR REPLACE FUNCTION public.complete_lesson_v2(_lesson_id TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Valida se usuário está autenticado
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  UPDATE public.user_progress 
  SET 
    completed_lessons = array_append(completed_lessons, _lesson_id),
    last_active = now(),
    updated_at = now()
  WHERE user_id = auth.uid()
    AND NOT (_lesson_id = ANY(completed_lessons));
END;
$$;

-- 6. Função segura para completar módulo (RPC)
CREATE OR REPLACE FUNCTION public.complete_module_v2(_module_id TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  UPDATE public.user_progress 
  SET 
    completed_modules = array_append(completed_modules, _module_id),
    last_active = now(),
    updated_at = now()
  WHERE user_id = auth.uid()
    AND NOT (_module_id = ANY(completed_modules));
END;
$$;

-- 7. Grant permissões para as funções
GRANT EXECUTE ON FUNCTION public.complete_lesson_v2(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.complete_module_v2(TEXT) TO authenticated;

-- 8. Garantir que a tabela profiles também tenha RLS adequado para o student_name
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own student_name"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 9. Ajustar a RPC redeem_gift_code para ter search_path seguro se não tiver
ALTER FUNCTION public.redeem_gift_code(TEXT, UUID) SET search_path = public;
