-- 1. Ativar RLS nos Catálogos
ALTER TABLE public.lesson_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_catalog ENABLE ROW LEVEL SECURITY;

-- 2. Políticas de Acesso para Catálogos
-- Usuários autenticados podem apenas ler para funcionamento da interface
DROP POLICY IF EXISTS "Permitir leitura para autenticados" ON public.lesson_catalog;
CREATE POLICY "Permitir leitura para autenticados" ON public.lesson_catalog
FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Permitir leitura para autenticados" ON public.module_catalog;
CREATE POLICY "Permitir leitura para autenticados" ON public.module_catalog
FOR SELECT TO authenticated USING (true);

-- Admin/Service Role tem acesso total (automático via bypass ou service_role grants)
-- Revogar permissões de escrita para usuários comuns (garantido pelo RLS sem políticas de INSERT/UPDATE)

-- 3. Recriar complete_lesson_v2 com SET search_path e SECURITY DEFINER
DROP FUNCTION IF EXISTS public.complete_lesson_v2(text);
CREATE OR REPLACE FUNCTION public.complete_lesson_v2(lesson_id_param text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    _user_id uuid;
    _module_id text;
    _prev_lesson_id text;
    _prereq_mod_id text;
    _completed_lessons text[];
    _completed_modules text[];
    _progress_exists boolean;
BEGIN
    _user_id := auth.uid();
    IF _user_id IS NULL THEN RAISE EXCEPTION 'Não autorizado'; END IF;

    -- Obter progresso atual
    SELECT completed_lessons, completed_modules, true 
    INTO _completed_lessons, _completed_modules, _progress_exists
    FROM user_progress WHERE user_id = _user_id;

    IF NOT _progress_exists THEN
        RAISE EXCEPTION 'Progresso não inicializado. Acesse o Dashboard primeiro.';
    END IF;

    _completed_lessons := COALESCE(_completed_lessons, ARRAY[]::text[]);
    _completed_modules := COALESCE(_completed_modules, ARRAY[]::text[]);

    -- Idempotência
    IF lesson_id_param = ANY(_completed_lessons) THEN RETURN; END IF;

    -- Validar contra o catálogo
    SELECT module_id, previous_lesson_id, prerequisite_module_id 
    INTO _module_id, _prev_lesson_id, _prereq_mod_id
    FROM lesson_catalog
    WHERE id = lesson_id_param AND is_active = true;

    IF _module_id IS NULL THEN
        RAISE EXCEPTION 'ID de lição inválido ou inativo: %', lesson_id_param;
    END IF;

    -- Validação de Pré-requisito de Lição
    IF _prev_lesson_id IS NOT NULL AND NOT (_prev_lesson_id = ANY(_completed_lessons)) THEN
        RAISE EXCEPTION 'Lição anterior pendente: %', _prev_lesson_id;
    END IF;

    -- Validação de Pré-requisito de Módulo
    IF _prereq_mod_id IS NOT NULL AND NOT (_prereq_mod_id = ANY(_completed_modules)) THEN
        RAISE EXCEPTION 'Módulo pré-requisito pendente: %', _prereq_mod_id;
    END IF;

    -- Atualizar progresso
    UPDATE user_progress
    SET completed_lessons = array_append(_completed_lessons, lesson_id_param),
        updated_at = now()
    WHERE user_id = _user_id;
END;
$$;

-- 4. Recriar complete_module_v2 com SET search_path e Validação de Array Vazio
DROP FUNCTION IF EXISTS public.complete_module_v2(text);
CREATE OR REPLACE FUNCTION public.complete_module_v2(module_id_param text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    _user_id uuid;
    _required_lessons text[];
    _prereq_mod_id text;
    _completed_lessons text[];
    _completed_modules text[];
    _progress_exists boolean;
BEGIN
    _user_id := auth.uid();
    IF _user_id IS NULL THEN RAISE EXCEPTION 'Não autorizado'; END IF;

    -- Obter progresso
    SELECT completed_lessons, completed_modules, true 
    INTO _completed_lessons, _completed_modules, _progress_exists
    FROM user_progress WHERE user_id = _user_id;

    IF NOT _progress_exists THEN
        RAISE EXCEPTION 'Progresso não inicializado.';
    END IF;

    _completed_lessons := COALESCE(_completed_lessons, ARRAY[]::text[]);
    _completed_modules := COALESCE(_completed_modules, ARRAY[]::text[]);

    -- Idempotência
    IF module_id_param = ANY(_completed_modules) THEN RETURN; END IF;

    -- Validar contra o catálogo
    SELECT required_lesson_ids, prerequisite_module_id 
    INTO _required_lessons, _prereq_mod_id
    FROM module_catalog
    WHERE id = module_id_param;

    -- Validação defensiva de módulo e lições obrigatórias
    IF _required_lessons IS NULL OR array_length(_required_lessons, 1) IS NULL THEN
        RAISE EXCEPTION 'Módulo sem lições obrigatórias configuradas ou inválido: %', module_id_param;
    END IF;

    -- Validar pré-requisito de módulo
    IF _prereq_mod_id IS NOT NULL AND NOT (_prereq_mod_id = ANY(_completed_modules)) THEN
        RAISE EXCEPTION 'Módulo pré-requisito pendente: %', _prereq_mod_id;
    END IF;

    -- Validar lições obrigatórias
    IF NOT (_completed_lessons @> _required_lessons) THEN
        RAISE EXCEPTION 'Lições obrigatórias do módulo pendentes.';
    END IF;

    -- Atualizar módulos
    UPDATE user_progress
    SET completed_modules = array_append(_completed_modules, module_id_param),
        updated_at = now()
    WHERE user_id = _user_id;
END;
$$;

-- 5. Garantir Permissões
GRANT EXECUTE ON FUNCTION public.complete_lesson_v2(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.complete_module_v2(text) TO authenticated;
GRANT SELECT ON public.lesson_catalog TO authenticated;
GRANT SELECT ON public.module_catalog TO authenticated;
GRANT ALL ON public.lesson_catalog TO service_role;
GRANT ALL ON public.module_catalog TO service_role;
