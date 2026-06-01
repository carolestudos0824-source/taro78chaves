O bloco de segurança Supabase/RLS foi validado e fechado. Agora focaremos na **Estabilidade Visual (Flicker Zero)** e na criação do **Painel da Jornada da Aluna**, garantindo uma experiência pedagógica fluida e orientada ao progresso.

### 1. Eliminação do Flicker (Pisca) na Navegação
O "pisca" ocorre pela interrupção do `Suspense` em rotas `lazy`.
- **Eager Loading**: Converter rotas críticas (`Dashboard`, `Trails`, `Lesson`, `Profile`, `Modules`) para importação síncrona no `App.tsx`.
- **Shell Stability**: O `ShellFallback` será neutralizado para evitar flashes de carregamento entre trocas de página, mantendo o `AppShell` (Header/Nav) estático.
- **JourneyMap**: Remoção do `framer-motion` e substituição por animações CSS (Tailwind) para evitar re-montagens pesadas que acentuam o flicker.

### 2. Painel da Jornada da Aluna (Dashboard)
Transformação da tela inicial autenticada (`/app`) em um hub pedagógico completo.
- **Novo Componente `DashboardPage`**:
    - **Bloco Principal "Minha Jornada"**: Status da aluna, Arcano/Módulo atual, Progresso % Geral e CTA "Continuar de onde parei".
    - **Card de Progresso**: Métricas reais de lições, quizzes e XP.
    - **Card de Próximo Passo**: Identificação inteligente da próxima lição com CTA direto.
    - **Card de Conquistas**: Exibição de insígnias e nível.
    - **Card de Plano**: Status da assinatura (Premium/Gratuito) com upgrade elegante para usuários Free.
- **Lógica de Dados**: Uso intensivo dos hooks `useProgress`, `useAccess` e `useRole` para garantir que:
    - Admin não gere progresso automático.
    - Auditor teste premium sem salvar dados.
    - Aluna veja apenas seu progresso real.

### Detalhes Técnicos (Arquivos Alterados)
- **`src/App.tsx`**: Reestruturação de imports e rotas.
- **`src/pages/DashboardPage.tsx`**: Criação da nova interface do painel (baseada na evolução da `ModulesPage`).
- **`src/components/JourneyMap.tsx`**: Refatoração para animações CSS puras.
- **`src/hooks/use-progress.ts`**: (Opcional) Pequeno ajuste para facilitar a identificação da "Última Lição".

### Veredito Final de Sucesso (Relatório)
- **PAINEL DA JORNADA EXISTE**: SIM
- **ALUNA ORIENTADA**: SIM
- **FLICKER REMOVIDO**: SIM
- **MOBILE 390PX OTIMIZADO**: SIM
- **SEGURANÇA PRESERVADA**: SIM

**Importante**: Não haverá alteração em Stripe, políticas de banco de dados ou conteúdo editorial. O foco é puramente UX e Funcionalidade Pedagógica.
