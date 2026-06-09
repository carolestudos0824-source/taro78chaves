CREATE OR REPLACE FUNCTION public.complete_lesson_v2(_lesson_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    _user_id uuid;
    _allowed_lessons text[];
    _is_completed boolean;
BEGIN
    _user_id := auth.uid();
    IF _user_id IS NULL THEN
        RAISE EXCEPTION 'Não autorizado';
    END IF;

    -- 1. Lista exaustiva de lições permitidas (IDs reais do catálogo)
    _allowed_lessons := ARRAY[
        -- Fundamentos
        'fund-1', 'fund-2', 'fund-3', 'fund-4', 'fund-5', 'fund-6', 'fund-7', 'fund-8', 'fund-9', 'fund-10',
        -- Leitura Simbólica
        'ls-1', 'ls-2', 'ls-3', 'ls-4', 'ls-5', 'ls-6', 'ls-7', 'ls-8',
        -- Arcanos Maiores
        'arcano-0', 'arcano-1', 'arcano-2', 'arcano-3', 'arcano-4', 'arcano-5', 'arcano-6', 'arcano-7', 'arcano-8', 'arcano-9', 'arcano-10',
        'arcano-11', 'arcano-12', 'arcano-13', 'arcano-14', 'arcano-15', 'arcano-16', 'arcano-17', 'arcano-18', 'arcano-19', 'arcano-20', 'arcano-21',
        -- Arquitetura Menores
        'am-1', 'am-2', 'am-3', 'am-4', 'am-5', 'am-6',
        -- Copas
        'copas-1', 'copas-2', 'copas-3', 'copas-4', 'copas-5', 'copas-6', 'copas-7', 'copas-8', 'copas-9', 'copas-10', 'copas-pajem', 'copas-cavaleiro', 'copas-rainha', 'copas-rei',
        -- Paus
        'paus-1', 'paus-2', 'paus-3', 'paus-4', 'paus-5', 'paus-6', 'paus-7', 'paus-8', 'paus-9', 'paus-10', 'paus-pajem', 'paus-cavaleiro', 'paus-rainha', 'paus-rei',
        -- Espadas
        'espadas-1', 'espadas-2', 'espadas-3', 'espadas-4', 'espadas-5', 'espadas-6', 'espadas-7', 'espadas-8', 'espadas-9', 'espadas-10', 'espadas-pajem', 'espadas-cavaleiro', 'espadas-rainha', 'espadas-rei',
        -- Ouros
        'ouros-1', 'ouros-2', 'ouros-3', 'ouros-4', 'ouros-5', 'ouros-6', 'ouros-7', 'ouros-8', 'ouros-9', 'ouros-10', 'ouros-pajem', 'ouros-cavaleiro', 'ouros-rainha', 'ouros-rei',
        -- Cartas da Corte (pedagógicas + variações)
        'pajem', 'cavaleiro', 'rainha', 'rei', 'corte-1', 'corte-2', 'corte-3', 'corte-4', 'corte-5', 'corte-6', 'corte-7', 'corte-8',
        -- Amor
        'amor-1', 'amor-2', 'amor-3', 'amor-4', 'amor-5', 'amor-6', 'amor-7', 'amor-8', 'amor-9', 'amor-10', 'amor-11', 'amor-12',
        -- Espiritualidade
        'esp-1', 'esp-2', 'esp-3', 'esp-4', 'esp-5', 'esp-6', 'esp-7', 'esp-8',
        -- Tiragens
        'tir-1', 'tir-2', 'tir-3', 'tir-4', 'tir-5', 'tir-6', 'tir-7', 'tir-8', 'tir-9', 'tir-10', 'tir-11',
        -- Mesa Tarot
        'mesa-1', 'mesa-2', 'mesa-3', 'mesa-4', 'mesa-5', 'mesa-6',
        -- Leitura Aplicada
        'la-1', 'la-2', 'la-3', 'la-4', 'la-5', 'la-6', 'la-7', 'la-8',
        -- Prática
        'prat-1', 'prat-2', 'prat-3', 'prat-4', 'prat-5', 'prat-6', 'prat-7', 'prat-8', 'prat-9', 'prat-10',
        -- Trabalhar Taro
        'tt-1', 'tt-2', 'tt-3', 'tt-4', 'tt-5', 'tt-6', 'tt-7', 'tt-8',
        -- Combinações
        'comb-1', 'comb-2', 'comb-3', 'comb-4', 'comb-5', 'comb-6', 'comb-7', 'comb-8', 'comb-9', 'comb-10'
    ];

    IF NOT (_lesson_id = ANY(_allowed_lessons)) THEN
        RAISE EXCEPTION 'ID de lição inválido ou desconhecido: %', _lesson_id;
    END IF;

    -- 2. Verificar se já concluiu (Idempotência)
    SELECT _lesson_id = ANY(completed_lessons) INTO _is_completed
    FROM user_progress WHERE user_id = _user_id;

    IF _is_completed THEN
        RETURN;
    END IF;

    -- 3. Atualizar progresso
    UPDATE user_progress
    SET completed_lessons = array_append(completed_lessons, _lesson_id),
        last_active = now()
    WHERE user_id = _user_id;
END;
$$;
