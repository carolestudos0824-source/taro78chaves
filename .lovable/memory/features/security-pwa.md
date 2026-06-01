# Segurança Supabase/RLS (PWA) - Bloco Fechado

## Acesso e Papéis (app_role)

- **Admin (`admin`)**:
    - Acesso total ao painel administrativo (`/admin`).
    - Visualiza todos os usuários, progresso e dados financeiros.
    - Ignora gates de pagamento (não precisa de Stripe).
    - **Proteção de Dados**: Não é tratado como pagante e não grava progresso/XP automático para evitar poluição de dados reais.
    - **RLS**: Protegido via `has_role(auth.uid(), 'admin')`.

- **Auditor (`auditor`)**:
    - Papel dedicado e separado de `moderator`.
    - **Função**: Testar conteúdo premium em "Modo Auditoria".
    - **Restrições**:
        - Não acessa o painel administrativo.
        - Não visualiza dados de outros usuários ou receita.
        - Não altera o sistema.
        - **Proteção de Dados**: Não grava XP, progresso ou lições completadas no banco de dados.
    - **Acesso Premium**: Liberado via papel para visualização de conteúdo, mas sem marcar como assinatura Stripe/Hotmart.

- **Moderador (`moderator`)**:
    - Permanece no enum apenas para compatibilidade futura.
    - Atualmente não possui seções administrativas ou permissões especiais de escrita/leitura além do usuário comum em dados de terceiros.

- **Usuário Comum (`user`)**:
    - Respeita bloqueios de progresso e gates de premium.
    - Acesso estritamente isolado: vê apenas seus próprios dados (RLS `auth.uid() = user_id`).

## Proteções Técnicas (RLS/RPC)

- **RPC Administrativas**: Exigem `has_role(auth.uid(), 'admin')` dentro da função (SECURITY DEFINER).
- **Dados Sensíveis**: SELECT em tabelas como `profiles`, `user_progress`, `hotmart_events`, `gift_codes` exige papel `admin`.
- **Acesso Público (Anon)**:
    - **Insert-Only**: `beta_feedback`, `support_tickets`, `waitlist`. Visitantes anônimos podem enviar dados mas não podem listar ou ler nada (SELECT negado).
    - **Certificados**: Validação via RPC `validate_certificate` que retorna apenas colunas seguras se o código for válido e estiver `issued`. SELECT direto na tabela `certificates` é bloqueado para público.

---
Data de Fechamento: 01/06/2026
Status: APROVADO PARA PWA
