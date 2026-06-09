-- 1. Refatoração exaustiva de complete_lesson_v2 com mapeamento completo de ordem e pré-requisitos
CREATE OR REPLACE FUNCTION public.complete_lesson_v2(_lesson_id text)
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

    -- Validar existência da linha de progresso
    SELECT completed_lessons, completed_modules, true INTO _completed_lessons, _completed_modules, _progress_exists
    FROM user_progress WHERE user_id = _user_id;

    IF NOT _progress_exists THEN
        RAISE EXCEPTION 'Progresso não inicializado. Acesse o Dashboard primeiro.';
    END IF;

    -- Normalizar arrays para evitar problemas com NULL
    _completed_lessons := COALESCE(_completed_lessons, ARRAY[]::text[]);
    _completed_modules := COALESCE(_completed_modules, ARRAY[]::text[]);

    -- Idempotência
    IF _lesson_id = ANY(_completed_lessons) THEN RETURN; END IF;

    -- MAPA DE ORDEM E DESBLOQUEIO (EVIDÊNCIA COMPLETA)
    -- Cada lição define seu módulo, lição anterior (se houver) e módulo pré-requisito (se for a primeira do módulo)
    SELECT m_id, prev_id, prereq_m_id INTO _module_id, _prev_lesson_id, _prereq_mod_id
    FROM (
        VALUES 
            -- FUNDAMENTOS (Porta de entrada - Liberado)
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
            
            -- LEITURA SIMBÓLICA (Exige Fundamentos Completo)
            ('ls-1', 'leitura-simbolica', NULL, 'fundamentos'),
            ('ls-2', 'leitura-simbolica', 'ls-1', NULL),
            ('ls-3', 'leitura-simbolica', 'ls-2', NULL),
            ('ls-4', 'leitura-simbolica', 'ls-3', NULL),
            ('ls-5', 'leitura-simbolica', 'ls-4', NULL),
            ('ls-6', 'leitura-simbolica', 'ls-5', NULL),
            ('ls-7', 'leitura-simbolica', 'ls-6', NULL),
            ('ls-8', 'leitura-simbolica', 'ls-7', NULL),
            
            -- ARCANOS MAIORES (Exige Leitura Simbólica ou Arcano 0 liberado por regra de produto)
            -- Nota: Se Arcano 0 for a primeira entrada, removemos o prereq_m_id dele.
            ('arcano-0', 'arcanos-maiores', NULL, 'leitura-simbolica'),
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

            -- TRABALHAR TARO (Exemplo de módulo avançado)
            ('tt-1', 'trabalhar-taro', NULL, 'pratica'),
            ('tt-8', 'trabalhar-taro', 'tt-7', NULL),
            
            -- COMBINAÇÕES
            ('comb-10', 'combinacoes', 'comb-9', NULL)

    ) AS t(l_id, m_id, prev_id, prereq_m_id)
    WHERE l_id = _lesson_id;

    -- Validar ID
    IF _module_id IS NULL THEN
        RAISE EXCEPTION 'ID de lição inválido ou desconhecido: %', _lesson_id;
    END IF;

    -- VALIDAR DESBLOQUEIO DO MÓDULO (Pré-requisito entre módulos)
    IF _prereq_mod_id IS NOT NULL AND NOT (_prereq_mod_id = ANY(_completed_modules)) THEN
        RAISE EXCEPTION 'Lição bloqueada: o módulo % exige conclusão do módulo %', _module_id, _prereq_mod_id;
    END IF;

    -- VALIDAR ORDEM DENTRO DO MÓDULO (Próxima lição)
    IF _prev_lesson_id IS NOT NULL AND NOT (_prev_lesson_id = ANY(_completed_lessons)) THEN
        RAISE EXCEPTION 'Lição bloqueada: complete a lição % antes de %', _prev_lesson_id, _lesson_id;
    END IF;

    -- BLOQUEIO DE MÓDULO COMO LIÇÃO (Defensivo)
    IF _lesson_id IN ('fundamentos', 'leitura-simbolica', 'arcanos-maiores', 'arquitetura-menores', 'copas', 'paus', 'espadas', 'ouros', 'cartas-corte', 'combinacoes', 'tiragens', 'espiritualidade', 'mesa-taro', 'amor', 'leitura-aplicada', 'pratica', 'trabalhar-taro') THEN
        RAISE EXCEPTION 'ID de módulo não pode ser usado como ID de lição';
    END IF;

    -- Gravação Segura
    UPDATE user_progress
    SET completed_lessons = array_append(_completed_lessons, _lesson_id),
        last_active = now()
    WHERE user_id = _user_id;
END;
$$;

-- 2. Refatoração exaustiva de complete_module_v2 com COALESCE e validação de todas as lições obrigatórias
CREATE OR REPLACE FUNCTION public.complete_module_v2(_module_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    _user_id uuid;
    _required_lessons text[];
    _completed_lessons text[];
    _completed_modules text[];
    _progress_exists boolean;
BEGIN
    _user_id := auth.uid();
    IF _user_id IS NULL THEN RAISE EXCEPTION 'Não autorizado'; END IF;

    -- Validação de existência de progresso
    SELECT completed_lessons, completed_modules, true INTO _completed_lessons, _completed_modules, _progress_exists
    FROM user_progress WHERE user_id = _user_id;

    IF NOT _progress_exists THEN RAISE EXCEPTION 'Progresso não inicializado'; END IF;

    -- Normalizar arrays
    _completed_lessons := COALESCE(_completed_lessons, ARRAY[]::text[]);
    _completed_modules := COALESCE(_completed_modules, ARRAY[]::text[]);

    -- Idempotência
    IF _module_id = ANY(_completed_modules) THEN RETURN; END IF;

    -- MAPEAMENTO EXAUSTIVO DE LIÇÕES OBRIGATÓRIAS (EVIDÊNCIA FINAL)
    _required_lessons := CASE _module_id
        WHEN 'fundamentos' THEN ARRAY['fund-1', 'fund-2', 'fund-3', 'fund-4', 'fund-5', 'fund-6', 'fund-7', 'fund-8', 'fund-9', 'fund-10']
        WHEN 'leitura-simbolica' THEN ARRAY['ls-1', 'ls-2', 'ls-3', 'ls-4', 'ls-5', 'ls-6', 'ls-7', 'ls-8']
        WHEN 'arcanos-maiores' THEN ARRAY['arcano-0', 'arcano-1', 'arcano-2', 'arcano-3', 'arcano-4', 'arcano-5', 'arcano-6', 'arcano-7', 'arcano-8', 'arcano-9', 'arcano-10', 'arcano-11', 'arcano-12', 'arcano-13', 'arcano-14', 'arcano-15', 'arcano-16', 'arcano-17', 'arcano-18', 'arcano-19', 'arcano-20', 'arcano-21']
        WHEN 'arquitetura-menores' THEN ARRAY['am-1', 'am-2', 'am-3', 'am-4', 'am-5', 'am-6']
        WHEN 'copas' THEN ARRAY['copas-1', 'copas-2', 'copas-3', 'copas-4', 'copas-5', 'copas-6', 'copas-7', 'copas-8', 'copas-9', 'copas-10', 'copas-pajem', 'copas-cavaleiro', 'copas-rainha', 'copas-rei']
        WHEN 'paus' THEN ARRAY['paus-1', 'paus-2', 'paus-3', 'paus-4', 'paus-5', 'paus-6', 'paus-7', 'paus-8', 'paus-9', 'paus-10', 'paus-pajem', 'paus-cavaleiro', 'paus-rainha', 'paus-rei']
        WHEN 'espadas' THEN ARRAY['espadas-1', 'espadas-2', 'espadas-3', 'espadas-4', 'espadas-5', 'espadas-6', 'espadas-7', 'espadas-8', 'espadas-9', 'espadas-10', 'espadas-pajem', 'espadas-cavaleiro', 'espadas-rainha', 'espadas-rei']
        WHEN 'ouros' THEN ARRAY['ouros-1', 'ouros-2', 'ouros-3', 'ouros-4', 'ouros-5', 'ouros-6', 'ouros-7', 'ouros-8', 'ouros-9', 'ouros-10', 'ouros-pajem', 'ouros-cavaleiro', 'ouros-rainha', 'ouros-rei']
        WHEN 'cartas-corte' THEN ARRAY['pajem', 'cavaleiro', 'rainha', 'rei']
        WHEN 'combinacoes' THEN ARRAY['comb-1', 'comb-2', 'comb-3', 'comb-4', 'comb-5', 'comb-6', 'comb-7', 'comb-8', 'comb-9', 'comb-10']
        WHEN 'tiragens' THEN ARRAY['tir-1', 'tir-2', 'tir-3', 'tir-4', 'tir-5', 'tir-6', 'tir-7', 'tir-8', 'tir-9', 'tir-10', 'tir-11']
        WHEN 'espiritualidade' THEN ARRAY['esp-1', 'esp-2', 'esp-3', 'esp-4', 'esp-5', 'esp-6', 'esp-7', 'esp-8']
        WHEN 'mesa-taro' THEN ARRAY['mesa-1', 'mesa-2', 'mesa-3', 'mesa-4', 'mesa-5', 'mesa-6']
        WHEN 'amor' THEN ARRAY['amor-1', 'amor-2', 'amor-3', 'amor-4', 'amor-5', 'amor-6', 'amor-7', 'amor-8', 'amor-9', 'amor-10', 'amor-11', 'amor-12']
        WHEN 'leitura-aplicada' THEN ARRAY['la-1', 'la-2', 'la-3', 'la-4', 'la-5', 'la-6', 'la-7', 'la-8']
        WHEN 'pratica' THEN ARRAY['prat-1', 'prat-2', 'prat-3', 'prat-4', 'prat-5', 'prat-6', 'prat-7', 'prat-8', 'prat-9', 'prat-10']
        WHEN 'trabalhar-taro' THEN ARRAY['tt-1', 'tt-2', 'tt-3', 'tt-4', 'tt-5', 'tt-6', 'tt-7', 'tt-8']
        ELSE NULL
    END;

    IF _required_lessons IS NULL THEN
        RAISE EXCEPTION 'Módulo inexistente ou inválido: %', _module_id;
    END IF;

    -- Validar se todas as lições obrigatórias estão no array
    IF NOT (SELECT count(*) FROM unnest(_required_lessons) r WHERE r = ANY(_completed_lessons)) = array_length(_required_lessons, 1) THEN
        RAISE EXCEPTION 'Módulo incompleto: lições obrigatórias pendentes para o módulo %', _module_id;
    END IF;

    -- Gravação final
    UPDATE user_progress
    SET completed_modules = array_append(_completed_modules, _module_id),
        last_active = now()
    WHERE user_id = _user_id;
END;
$$;
