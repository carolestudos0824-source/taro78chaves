import { usePremium } from "@/hooks/use-premium";
import { useRole } from "@/hooks/use-role";

/**
 * Hook unificado de acesso pedagógico ao conteúdo.
 *
 * - `hasFullAccess`: true se o usuário deve ver todo o conteúdo sem cadeados
 *   (admin OU premium ativo). Admin nunca é tratado como pagante Stripe.
 * - `bypassLocks`: alias semântico para `hasFullAccess` em telas que precisam
 *   pular regras de progresso/desbloqueio (admin pode auditar tudo).
 * - `isAdmin`: flag pura de papel administrativo.
 * - `isPremium`: flag pura de assinatura ativa.
 */
export function useAccess() {
  const { isPremium, subscriptionStatus, loading: premiumLoading } = usePremium();
  const { isAdmin, isModerator, loading: roleLoading } = useRole();

  const hasFullAccess = isAdmin || isModerator || isPremium;

  return {
    isAdmin,
    isPremium,
    subscriptionStatus,
    hasFullAccess,
    bypassLocks: hasFullAccess,
    loading: premiumLoading || roleLoading,
  };
}
