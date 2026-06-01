# Histórico de Fechamento de Blocos - Tarô 78 Chaves

## 🛡️ 1. Segurança Supabase/RLS (FECHADO: 01/06/2026)
- **Papéis (app_role)**: Separação clara entre `admin`, `auditor`, `moderator` e `user`.
- **Auditor**: Papel dedicado para teste de conteúdo premium sem Stripe. Acesso bloqueado a `/admin`, dados de terceiros e receita. Escrita em XP/progresso desativada para este papel.
- **Admin**: Acesso total via `has_role(auth.uid(), 'admin')`. Nunca é tratado como pagante Stripe real (acesso via papel).
- **Usuário Comum**: RLS estrito `auth.uid() = user_id`. Respeita todos os gates pedagógicos e comerciais.
- **Acesso Público**: Políticas *Insert-Only* para suporte/feedback. Validação de certificados protegida por RPC `validate_certificate` (Security Definer).

## ⚡ 2. Navegação Zero Flicker (FECHADO: 01/06/2026)
- **Eager Loading**: Rotas críticas (`/app`, `/trilhas`, `/lesson/:id`, `/perfil`) importadas síncronamente no `App.tsx`.
- **Estabilidade do Shell**: `Header` e `BottomNav` montados permanentemente fora do ciclo de `Suspense` das rotas.
- **Eliminação de Flash**: `ShellFallback` neutralizado e `Suspense` interno removido da área visível principal.
- **JourneyMap**: Removido `framer-motion` e delays escalonados que causavam saltos visuais em navegação de retorno.

## 🎓 3. Painel da Jornada da Aluna (FECHADO: 01/06/2026)
- **Interface `/app`**: Hub pedagógico completo com Arcano atual, Módulo atual e progresso real das 78 chaves.
- **Orientação**: CTA inteligente "Continuar de onde parei" e card "Próximo Passo" (identificação automática da lição pendente).
- **Métricas**: Cards de XP, Nível, Quizzes e Conquistas (insígnias).
- **UX Mobile**: Layout 390px validado com hierarquia clara e elementos essenciais acima da dobra.

---
**Próximo Bloco**: Finalização das Cartas de Corte (Paus, Ouros, Espadas) com fidelidade RWS.
**Restrições**: Não alterar as implementações acima sem evidência de bug real.
