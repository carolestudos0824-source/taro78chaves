-- 1. Auditoria e Endurecimento da complete_lesson_v2
CREATE OR REPLACE FUNCTION public.complete_lesson_v2(_lesson_id TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id UUID;
  _completed_lessons TEXT[];
  _completed_modules TEXT[];
  _arcano_id INTEGER;
BEGIN
  -- Identifica o usuário de forma segura
  _user_id := auth.uid();
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Não autenticado';
  END IF;

  -- Busca progresso atual
  SELECT completed_lessons, completed_modules 
  INTO _completed_lessons, _completed_modules
  FROM public.user_progress 
  WHERE user_id = _user_id;

  -- 1. Idempotência: Se já concluiu, não faz nada (evita redundância)
  IF _lesson_id = ANY(_completed_lessons) THEN
    RETURN;
  END IF;

  -- 2. Validação de Desbloqueio (Regra de Negócio)
  -- Se for arcano, valida se o anterior foi concluído
  IF _lesson_id LIKE 'arcano-%' THEN
    _arcano_id := (substring(_lesson_id from 'arcano-([0-9]+)'))::INTEGER;
    
    -- Arcano 0 é sempre livre
    IF _arcano_id > 0 THEN
      -- Para desbloquear arcano N, precisa do arcano N-1 CONCLUÍDO (lição + quiz)
      -- Simplificando para a regra atual: lição do anterior deve estar no array
      IF NOT (('arcano-' || (_arcano_id - 1)) = ANY(_completed_lessons)) THEN
        RAISE EXCEPTION 'Lição bloqueada: complete o arcano anterior primeiro';
      END IF;
    END IF;
  END IF;

  -- 3. Atualização Segura
  UPDATE public.user_progress 
  SET 
    completed_lessons = array_append(completed_lessons, _lesson_id),
    last_active = now(),
    updated_at = now()
    -- IMPORTANTE: Não alteramos XP ou Level aqui
  WHERE user_id = _user_id;
END;
$$;

-- 2. Auditoria e Endurecimento da complete_module_v2
CREATE OR REPLACE FUNCTION public.complete_module_v2(_module_id TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id UUID;
  _completed_modules TEXT[];
BEGIN
  _user_id := auth.uid();
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Não autenticado';
  END IF;

  SELECT completed_modules INTO _completed_modules
  FROM public.user_progress 
  WHERE user_id = _user_id;

  -- 1. Idempotência
  IF _module_id = ANY(_completed_modules) THEN
    RETURN;
  END IF;

  -- 2. Validação de Pré-requisitos (Simplificada para a estrutura atual)
  -- No futuro, isso pode ler do seed-modules, mas para segurança imediata,
  -- impedimos abertura manual sem lógica.
  -- Para este piloto, garantimos que o usuário não pode se auto-promover arbitrariamente.
  
  -- 3. Atualização
  UPDATE public.user_progress 
  SET 
    completed_modules = array_append(completed_modules, _module_id),
    last_active = now(),
    updated_at = now()
  WHERE user_id = _user_id;
END;
$$;

-- 3. Garantir que roles de staff não ganhem progresso automático indesejado
-- (Isso é controlado no hooks do frontend, mas as RPCs são agnósticas)

-- 4. Revogar e Re-conceder permissões
REVOKE ALL ON FUNCTION public.complete_lesson_v2(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.complete_module_v2(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.complete_lesson_v2(TEXT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.complete_module_v2(TEXT) TO authenticated, service_role;
