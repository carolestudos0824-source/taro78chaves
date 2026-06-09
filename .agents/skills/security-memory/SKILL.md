# Security Memory - App Tarô 78 Chaves

## Status de Segurança
- **Última Verificação**: 09/06/2026
- **Status Geral**: APROVADO / FECHADO
- **Varredura Wiz/Aikido**: 0 findings
- **Varredura Supabase Nativo**: 0 findings
- **Varredura supabase_lov**: 8 findings corrigidos (Remaining: 0 issues)

## Modelo de Acesso e Papéis
- Papéis gerenciados em `public.user_roles` usando o tipo `app_role`.
- **Privileged Roles**: `admin`, `service_role`.
- **Auditor**: Possui acesso de leitura, mas não possui permissões de escrita/admin.
- **Função de Validação**: `public.is_privileged_caller()` centraliza a verificação de privilégios.

## Proteções Implementadas

### 1. Perfis e Dados Sensíveis (`profiles`)
- **Proteção de Colunas**: Bloqueio de alteração em `is_premium`, `premium_until` e `premium_source` para usuários comuns.
- **Trigger**: `prevent_profile_privileged_updates`.
- **Admin/Service Role**: Mantêm permissão para ajustes legítimos.

### 2. Integridade de Dados e Anti-Abuso (Triggers)
- **`daily_challenge_completions`**: Trigger `validate_daily_challenge_completion` garante `user_id = auth.uid()` e limita ganhos técnicos (XP).
- **`quiz_responses`**: Trigger `validate_quiz_response` garante posse do registro e limita ganhos técnicos.
- **`ritual_merits`**: Trigger `validate_ritual_merit` garante posse e sanitiza `merit_key` (whitelist de caracteres).
- **`ritual_streaks`**: Trigger `validate_ritual_streak` impede saltos abusivos (máx +1 por vez) e impõe teto de 3650 dias.
- **`user_progress`**: Trigger `validate_user_progress_update` impede regressão e manipulação abusiva de campos legados (XP, Level, Streak).

### 3. Políticas RLS Adicionais
- **`google_play_subscriptions`**: Adicionada política `SELECT` para o papel `admin`.
- **`notification_logs`**: Adicionada política `SELECT` para o papel `admin`.

## Diretrizes de Produto e Legado
- **XP (Experiência)**: O produto **NÃO UTILIZA XP**. Campos como `xp`, `xp_earned` ou similares são **legado técnico** para compatibilidade ou segurança interna. 
- **Regra de Ouro**: NÃO criar, exibir ou usar XP em nenhuma interface ou fluxo de produto (onboarding, quiz, recompensas, etc.).
- **Não Regressão**: Preservar sempre o conteúdo existente (lições, arcanos, etc.).

## Observações de Segurança
- Estas validações cobrem os findings dos scanners automáticos. 
- Não substitui a necessidade de pentests avançados periódicos.
- Padrões `SECURITY DEFINER` seguem as melhores práticas (explicit `search_path`).
