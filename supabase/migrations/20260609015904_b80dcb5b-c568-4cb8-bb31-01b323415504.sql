-- 1. Endurecimento da complete_lesson_v2 com catálogo interno e validação de sequência
CREATE OR REPLACE FUNCTION public.complete_lesson_v2(_lesson_id TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id UUID;
  _completed_lessons TEXT[];
  _arcano_id INTEGER;
  _allowed_lessons TEXT[] := ARRAY[
    'fundamentos', 'leitura-simbolica', 'arcanos-maiores', 
    'arquitetura-menores', 'copas', 'paus', 'espadas', 'ouros', 
    'cartas-corte', 'combinacoes', 'tiragens', 'espiritualidade', 
    'mesa-taro', 'amor', 'leitura-aplicada', 'pratica', 'trabalhar-taro'
  ];
BEGIN
  _user_id := auth.uid();
  IF _user_id IS NULL THEN RAISE EXCEPTION 'Não autenticado'; END IF;

  SELECT completed_lessons INTO _completed_lessons FROM public.user_progress WHERE user_id = _user_id;

  -- Idempotência
  IF _lesson_id = ANY(_completed_lessons) THEN RETURN; END IF;

  -- Validação de ID Existente/Permitido
  IF _lesson_id LIKE 'arcano-%' THEN
    _arcano_id := (substring(_lesson_id from 'arcano-([0-9]+)'))::INTEGER;
    IF _arcano_id < 0 OR _arcano_id > 21 THEN
      RAISE EXCEPTION 'ID de Arcano inválido';
    END IF;

    -- Validação de Sequência (Desbloqueio)
    IF _arcano_id > 0 AND NOT (('arcano-' || (_arcano_id - 1)) = ANY(_completed_lessons)) THEN
      RAISE EXCEPTION 'Arcano bloqueado: complete o anterior primeiro';
    END IF;
  ELSIF NOT (_lesson_id = ANY(_allowed_lessons)) THEN
    RAISE EXCEPTION 'ID de lição desconhecido ou não permitido via RPC: %', _lesson_id;
  END IF;

  -- Atualização Segura (Sem XP/Level)
  UPDATE public.user_progress 
  SET completed_lessons = array_append(completed_lessons, _lesson_id),
      last_active = now(),
      updated_at = now()
  WHERE user_id = _user_id;
END;
$$;

-- 2. Endurecimento da complete_module_v2 com validação de pré-requisitos reais
CREATE OR REPLACE FUNCTION public.complete_module_v2(_module_id TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id UUID;
  _completed_modules TEXT[];
  -- Catálogo de módulos e seus pré-requisitos (conforme seed-modules.ts)
  _prereq TEXT;
BEGIN
  _user_id := auth.uid();
  IF _user_id IS NULL THEN RAISE EXCEPTION 'Não autenticado'; END IF;

  SELECT completed_modules INTO _completed_modules FROM public.user_progress WHERE user_id = _user_id;

  -- Idempotência
  IF _module_id = ANY(_completed_modules) THEN RETURN; END IF;

  -- Mapeamento de Pré-requisitos (Lógica do Produto)
  _prereq := CASE _module_id
    WHEN 'fundamentos'         THEN NULL
    WHEN 'leitura-simbolica'   THEN 'fundamentos'
    WHEN 'arcanos-maiores'     THEN 'leitura-simbolica'
    WHEN 'arquitetura-menores' THEN 'arcanos-maiores'
    WHEN 'copas'               THEN 'arquitetura-menores'
    WHEN 'paus'                THEN 'arquitetura-menores'
    WHEN 'espadas'             THEN 'arquitetura-menores'
    WHEN 'ouros'               THEN 'arquitetura-menores'
    WHEN 'cartas-corte'        THEN 'copas'
    WHEN 'combinacoes'         THEN 'cartas-corte'
    WHEN 'tiragens'            THEN 'combinacoes'
    WHEN 'espiritualidade'     THEN 'tiragens'
    WHEN 'mesa-taro'           THEN 'espiritualidade'
    WHEN 'amor'                THEN 'tiragens'
    WHEN 'leitura-aplicada'    THEN 'tiragens'
    WHEN 'pratica'             THEN 'leitura-aplicada'
    WHEN 'trabalhar-taro'      THEN 'pratica'
    ELSE 'INVALID'
  END;

  IF _prereq = 'INVALID' THEN
    RAISE EXCEPTION 'ID de módulo inválido ou desconhecido: %', _module_id;
  END IF;

  IF _prereq IS NOT NULL AND NOT (_prereq = ANY(_completed_modules)) THEN
    RAISE EXCEPTION 'Módulo bloqueado: pré-requisito (%) não concluído', _prereq;
  END IF;

  -- Atualização Segura
  UPDATE public.user_progress 
  SET completed_modules = array_append(completed_modules, _module_id),
      last_active = now(),
      updated_at = now()
  WHERE user_id = _user_id;
END;
$$;
