The audit confirmed that the reported bug is primarily due to the current implementation of the "isStaff" (Admin/Moderator) check, which completely skips progress updates (both local and database) during lessons. This leads to a confusing experience where an Admin completes a lesson, sees the "Key Conquered" screen, but then sees 0 XP and 0% progress in their profile because the state was never updated even locally.

For non-staff users, the system is designed to save correctly, but Admins/Auditors need a clearer "Audit Mode" experience as requested.

### Proposed Changes

1. **Lesson Experience for Admins**
   - Modify `LessonPage.tsx` to allow calling progress actions (`addXP`, `completeLesson`, etc.) for everyone, including Admins.
   - The underlying `use-progress.ts` hook already blocks the actual Supabase database persistence for `isStaff` users, ensuring that their test progress remains volatile and doesn't "pollute" the global statistics or their permanent account.

2. **Visual "Audit Mode" Indicators**
   - Update `CompletionScreen.tsx` (the "Chave Conquistada" screen) to display a "Modo Auditoria" badge if the user is an Admin/Moderator. This makes it clear that the progress shown is for testing purposes and hasn't been saved to the permanent record.
   - Update `ProfilePage.tsx` to include an "Audit Mode" banner or badge for staff users.

3. **Progress Inconsistency Fix**
   - Ensure the "Chave" count in the header and the "Portais" count in the profile are consistent by making sure the local state is updated even for staff during their active session.

### Technical Details

- **`src/pages/LessonPage.tsx`**: Remove the `if (!isStaff)` check around progress-related calls.
- **`src/components/arcano-vivo/CompletionScreen.tsx`**: Use the `useRole` hook to detect `isStaff` and show a "Modo Auditoria" tag near the "Chave Conquistada" title.
- **`src/pages/ProfilePage.tsx`**: Add an "Audit Mode" indicator next to the level/title or in the stats section.
- **`src/hooks/use-progress.ts`**: Ensure that even if staff members earn XP locally, the database update is strictly skipped. (Already implemented, but will verify logic).

### Validation Checklist

- [ ] TELA MOSTRA CHAVE CONQUISTADA APÓS CONCLUSÃO: SIM
- [ ] PROGRESSO É SALVO NO SUPABASE: SIM (para usuários comuns) / NÃO (para admin)
- [ ] COMPLETEDLESSONS ATUALIZA: SIM (localmente para admin, real para usuários)
- [ ] XP É INCREMENTADO: SIM (localmente para admin, real para usuários)
- [ ] PERFIL MOSTRA XP ATUALIZADO: SIM (na mesma sessão para admin)
- [ ] PERFIL MOSTRA PROGRESSO MAIOR QUE 0%: SIM
- [ ] PERFIL MOSTRA 1 CHAVE DE FORMA CONSISTENTE: SIM
- [ ] PRÓXIMO ARCANO O MAGO DESBLOQUEIA: SIM
- [ ] REFRESH MANTÉM O PROGRESSO: NÃO (para admin - intencional) / SIM (para usuários)
- [ ] LOGOUT/LOGIN MANTÉM O PROGRESSO: NÃO (para admin - intencional) / SIM (para usuários)
- [ ] ADMIN NÃO GANHA PROGRESSO AUTOMÁTICO: SIM
- [ ] AUDITOR NÃO ALTERA PROGRESSO REAL: SIM
- [ ] USUÁRIO COMUM/PREMIUM SALVA PROGRESSO REAL: SIM
