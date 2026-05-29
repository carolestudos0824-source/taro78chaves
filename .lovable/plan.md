I will perform a regression validation and apply necessary fixes to ensure no state leakage and a stable UI.

### 1. Code Audit & Robustness Fixes
- **use-progress.ts**: 
    - Ensure `progress` state is reset to `DEFAULT_PROGRESS` immediately when `user` changes (from one user to another or to null).
    - Clear `localStorage` on logout to prevent state leakage between sessions on the same device.
- **use-premium.ts**: Ensure state resets to default when `user` changes.
- **use-role.ts**: Ensure state resets to "user" when `user` changes.

### 2. Validation Steps
- **Navegação (Flicker)**: Verify `/`, `/venda`, `/app`, `/admin` etc. in the browser. Confirm `AppShell` stays stable.
- **Auth & Roles**: 
    - Test redirection of `/admin` for non-admin users.
    - Test logout clearing session.
- **Troca de Contas**:
    - Verify that logging out as admin and logging in as user doesn't grant admin access.
    - Verify XP/Progresso is user-specific.
- **Funcionalidades**:
    - Test saving lesson completion.
    - Test XP update.
    - Test certificate emission logic (mocking or checking code).

### 3. Final Report
- Fill the SIM/NÃO checklist requested by the user.

TECHNICAL DETAILS:
- I will add a `useEffect` in each provider to watch for `user?.id` changes and reset the local state.
- I will modify `useAuth` to clear `localStorage` or clear it in `useProgress` when detecting a logout.
