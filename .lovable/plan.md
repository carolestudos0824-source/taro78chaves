# Plano de Implementação: Revisão Inteligente (v1)

O objetivo é criar uma seção de "Revisão Inteligente" que utilize os dados de erros cometidos nos quizzes para sugerir cartas/conceitos que o usuário deve reforçar.

## Auditoria de Dados
- Os erros e acertos já são persistidos na tabela `quiz_responses` via `src/lib/quiz-persistence.ts`.
- O hook `useReview` (Local Storage) também rastreia `wrongAnswers` localmente quando o usuário erra em tempo real, permitindo uma revisão imediata mesmo sem persistência total do histórico de todos os usuários.
- **Veredito:** Os dados existem. A melhor abordagem para v1 é usar os dados do `useReview` (que já gerencia `wrongAnswers` no Local Storage) para garantir reatividade imediata, enquanto a persistência no Supabase serve como backup/telemetria.

## Ações

### 1. Novo Componente: `src/components/SmartReviewCard.tsx`
- Criar um card para a página inicial (`ModulesPage`) que aparece apenas se houver erros para revisar.
- Mostrar até 3 cartas com mais erros.
- Permitir navegação direta para a seção de revisão daquela carta.

### 2. Atualizar `src/pages/ModulesPage.tsx`
- Importar e exibir o `SmartReviewCard` acima da lista de módulos ou na seção de ferramentas.
- Integrar com o hook `useReview` para obter as `wrongAnswers`.

### 3. Melhorar `src/pages/ReviewPage.tsx`
- Garantir que a lógica de "Perguntas Errradas" (`wrong-answers`) seja clara e acessível.
- Adicionar uma seção de "Sugestões de Estudo" baseada nos IDs dos arcanos que tiveram mais erros.

### 4. Ajustes no fluxo de Quiz (`src/components/QuizSection.tsx`)
- Garantir que o `onAnswer` passe o `arcanoId` (se disponível) para que o `LessonPage` chame `addWrongAnswer` do hook `useReview`.

## Detalhes Técnicos
- **Lógica de Ranking:** Simples contagem de erros por `arcanoId`.
- **UI/UX:** Design consistente com o tema "Aquarela Mística" (RWS Rider-Waite).
- **Responsividade:** Mobile-first (390px).

## Validação Prévia
- Os dados são persistidos? SIM (`quiz_responses` e `tarot-review-data` no localStorage).
- Altera quizzes existentes? NÃO.
- Altera XP? NÃO.
- Build compila? A verificar após implementação.
