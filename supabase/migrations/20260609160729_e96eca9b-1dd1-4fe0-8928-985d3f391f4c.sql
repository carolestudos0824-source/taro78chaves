-- 1. Criar Catálogo de Módulos
CREATE TABLE IF NOT EXISTS public.module_catalog (
    id TEXT PRIMARY KEY,
    prerequisite_module_id TEXT,
    required_lesson_ids TEXT[] NOT NULL
);

-- 2. Criar Catálogo de Lições
CREATE TABLE IF NOT EXISTS public.lesson_catalog (
    id TEXT PRIMARY KEY,
    module_id TEXT NOT NULL REFERENCES public.module_catalog(id),
    previous_lesson_id TEXT,
    prerequisite_module_id TEXT REFERENCES public.module_catalog(id),
    is_active BOOLEAN DEFAULT true
);

-- 3. Inserir Dados Reais (Module Catalog)
INSERT INTO public.module_catalog (id, prerequisite_module_id, required_lesson_ids) VALUES
('fundamentos', NULL, ARRAY['fund-1', 'fund-2', 'fund-3', 'fund-4', 'fund-5', 'fund-6', 'fund-7', 'fund-8', 'fund-9', 'fund-10']),
('leitura-simbolica', 'fundamentos', ARRAY['ls-1', 'ls-2', 'ls-3', 'ls-4', 'ls-5', 'ls-6', 'ls-7', 'ls-8']),
('arcanos-maiores', 'leitura-simbolica', ARRAY['arcano-0', 'arcano-1', 'arcano-2', 'arcano-3', 'arcano-4', 'arcano-5', 'arcano-6', 'arcano-7', 'arcano-8', 'arcano-9', 'arcano-10', 'arcano-11', 'arcano-12', 'arcano-13', 'arcano-14', 'arcano-15', 'arcano-16', 'arcano-17', 'arcano-18', 'arcano-19', 'arcano-20', 'arcano-21']),
('arquitetura-menores', 'arcanos-maiores', ARRAY['am-1', 'am-2', 'am-3', 'am-4', 'am-5', 'am-6']),
('copas', 'arquitetura-menores', ARRAY['c-1', 'c-2', 'c-3', 'c-4', 'c-5', 'c-6', 'c-7', 'c-8', 'c-9', 'c-10', 'c-p', 'c-c', 'c-rainha', 'c-rei']),
('paus', 'arquitetura-menores', ARRAY['p-1', 'p-2', 'p-3', 'p-4', 'p-5', 'p-6', 'p-7', 'p-8', 'p-9', 'p-10', 'p-p', 'p-c', 'p-rainha', 'p-rei']),
('espadas', 'arquitetura-menores', ARRAY['e-1', 'e-2', 'e-3', 'e-4', 'e-5', 'e-6', 'e-7', 'e-8', 'e-9', 'e-10', 'e-p', 'e-c', 'e-rainha', 'e-rei']),
('ouros', 'arquitetura-menores', ARRAY['o-1', 'o-2', 'o-3', 'o-4', 'o-5', 'o-6', 'o-7', 'o-8', 'o-9', 'o-10', 'o-p', 'o-c', 'o-rainha', 'o-rei']),
('cartas-corte', 'copas', ARRAY['cc-1', 'cc-2', 'cc-3', 'cc-4', 'cc-5', 'cc-6', 'cc-7', 'cc-8']),
('combinacoes', 'cartas-corte', ARRAY['comb-1', 'comb-2', 'comb-3', 'comb-4', 'comb-5', 'comb-6', 'comb-7', 'comb-8', 'comb-9', 'comb-10']),
('tiragens', 'combinacoes', ARRAY['t-1', 't-2', 't-3', 't-4', 't-5', 't-6', 't-7', 't-8', 't-9', 't-10', 't-11']),
('espiritualidade', 'tiragens', ARRAY['esp-1', 'esp-2', 'esp-3', 'esp-4', 'esp-5', 'esp-6', 'esp-7', 'esp-8']),
('mesa-taro', 'espiritualidade', ARRAY['mt-1', 'mt-2', 'mt-3', 'mt-4', 'mt-5', 'mt-6']),
('amor', 'tiragens', ARRAY['a-1', 'a-2', 'a-3', 'a-4', 'a-5', 'a-6', 'a-7', 'a-8', 'a-9', 'a-10', 'a-11', 'a-12']),
('leitura-aplicada', 'tiragens', ARRAY['la-1', 'la-2', 'la-3', 'la-4', 'la-5', 'la-6', 'la-7', 'la-8']),
('pratica', 'leitura-aplicada', ARRAY['pra-1', 'pra-2', 'pra-3', 'pra-4', 'pra-5', 'pra-6', 'pra-7', 'pra-8', 'pra-9', 'pra-10']),
('trabalhar-taro', 'pratica', ARRAY['tt-1', 'tt-2', 'tt-3', 'tt-4', 'tt-5', 'tt-6', 'tt-7', 'tt-8'])
ON CONFLICT (id) DO UPDATE SET prerequisite_module_id = EXCLUDED.prerequisite_module_id, required_lesson_ids = EXCLUDED.required_lesson_ids;

-- 4. Inserir Dados Reais (Lesson Catalog)
INSERT INTO public.lesson_catalog (id, module_id, previous_lesson_id, prerequisite_module_id) VALUES
-- Fundamentos
('fund-1', 'fundamentos', NULL, NULL),
('fund-2', 'fundamentos', 'fund-1', NULL),
('fund-3', 'fundamentos', 'fund-2', NULL),
('fund-4', 'fundamentos', 'fund-3', NULL),
('fund-5', 'fundamentos', 'fund-4', NULL),
('fund-6', 'fundamentos', 'fund-5', NULL),
('fund-7', 'fundamentos', 'fund-6', NULL),
('fund-8', 'fundamentos', 'fund-7', NULL),
('fund-9', 'fundamentos', 'fund-8', NULL),
('fund-10', 'fundamentos', 'fund-9', NULL),
-- Leitura Simbólica
('ls-1', 'leitura-simbolica', NULL, 'fundamentos'),
('ls-2', 'leitura-simbolica', 'ls-1', NULL),
('ls-3', 'leitura-simbolica', 'ls-2', NULL),
('ls-4', 'leitura-simbolica', 'ls-3', NULL),
('ls-5', 'leitura-simbolica', 'ls-4', NULL),
('ls-6', 'leitura-simbolica', 'ls-5', NULL),
('ls-7', 'leitura-simbolica', 'ls-6', NULL),
('ls-8', 'leitura-simbolica', 'ls-7', NULL),
-- Arcanos Maiores (Arcano 0 SEM prereq_m_id por regra de produto)
('arcano-0', 'arcanos-maiores', NULL, NULL),
('arcano-1', 'arcanos-maiores', 'arcano-0', NULL),
('arcano-2', 'arcanos-maiores', 'arcano-1', NULL),
('arcano-3', 'arcanos-maiores', 'arcano-2', NULL),
('arcano-4', 'arcanos-maiores', 'arcano-3', NULL),
('arcano-5', 'arcanos-maiores', 'arcano-4', NULL),
('arcano-6', 'arcanos-maiores', 'arcano-5', NULL),
('arcano-7', 'arcanos-maiores', 'arcano-6', NULL),
('arcano-8', 'arcanos-maiores', 'arcano-7', NULL),
('arcano-9', 'arcanos-maiores', 'arcano-8', NULL),
('arcano-10', 'arcanos-maiores', 'arcano-9', NULL),
('arcano-11', 'arcanos-maiores', 'arcano-10', NULL),
('arcano-12', 'arcanos-maiores', 'arcano-11', NULL),
('arcano-13', 'arcanos-maiores', 'arcano-12', NULL),
('arcano-14', 'arcanos-maiores', 'arcano-13', NULL),
('arcano-15', 'arcanos-maiores', 'arcano-14', NULL),
('arcano-16', 'arcanos-maiores', 'arcano-15', NULL),
('arcano-17', 'arcanos-maiores', 'arcano-16', NULL),
('arcano-18', 'arcanos-maiores', 'arcano-17', NULL),
('arcano-19', 'arcanos-maiores', 'arcano-18', NULL),
('arcano-20', 'arcanos-maiores', 'arcano-19', NULL),
('arcano-21', 'arcanos-maiores', 'arcano-20', NULL),
-- Profissional
('tt-1', 'trabalhar-taro', NULL, 'pratica'),
('tt-2', 'trabalhar-taro', 'tt-1', NULL),
('tt-3', 'trabalhar-taro', 'tt-2', NULL),
('tt-4', 'trabalhar-taro', 'tt-3', NULL),
('tt-5', 'trabalhar-taro', 'tt-4', NULL),
('tt-6', 'trabalhar-taro', 'tt-5', NULL),
('tt-7', 'trabalhar-taro', 'tt-6', NULL),
('tt-8', 'trabalhar-taro', 'tt-7', NULL)
ON CONFLICT (id) DO UPDATE SET module_id = EXCLUDED.module_id, previous_lesson_id = EXCLUDED.previous_lesson_id, prerequisite_module_id = EXCLUDED.prerequisite_module_id;

-- 5. Recriar RPC complete_lesson_v2
DROP FUNCTION IF EXISTS public.complete_lesson_v2(text);
CREATE OR REPLACE FUNCTION public.complete_lesson_v2(lesson_id_param text)
RETURNS void AS $$
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

    -- Obter progresso
    SELECT completed_lessons, completed_modules, true 
    INTO _completed_lessons, _completed_modules, _progress_exists
    FROM public.user_progress WHERE user_id = _user_id;

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
    FROM public.lesson_catalog
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
    UPDATE public.user_progress
    SET completed_lessons = array_append(_completed_lessons, lesson_id_param),
        updated_at = now()
    WHERE user_id = _user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 6. Recriar RPC complete_module_v2
DROP FUNCTION IF EXISTS public.complete_module_v2(text);
CREATE OR REPLACE FUNCTION public.complete_module_v2(module_id_param text)
RETURNS void AS $$
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
    FROM public.user_progress WHERE user_id = _user_id;

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
    FROM public.module_catalog
    WHERE id = module_id_param;

    IF _required_lessons IS NULL THEN
        RAISE EXCEPTION 'Módulo inválido: %', module_id_param;
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
    UPDATE public.user_progress
    SET completed_modules = array_append(_completed_modules, module_id_param),
        updated_at = now()
    WHERE user_id = _user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 7. Grant Permissions
GRANT ALL ON public.module_catalog TO service_role;
GRANT ALL ON public.lesson_catalog TO service_role;
GRANT SELECT ON public.module_catalog TO authenticated;
GRANT SELECT ON public.lesson_catalog TO authenticated;
GRANT EXECUTE ON FUNCTION public.complete_lesson_v2(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.complete_module_v2(text) TO authenticated;
