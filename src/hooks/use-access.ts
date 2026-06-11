import { usePremium } from "@/hooks/use-premium";
import { useRole } from "@/hooks/use-role";
import { useProgress } from "@/hooks/use-progress";
import { hasInitialAccess } from "@/lib/content/access";

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
  const { isAdmin, isAuditor, isModerator, loading: roleLoading } = useRole();
  const { progress, loading: progressLoading } = useProgress();

  const hasFullAccess = isAdmin || isAuditor || isModerator || isPremium;

  const canAccessArcano = (arcanoId: number) => {
    if (hasFullAccess) return true;
    return hasInitialAccess(arcanoId, progress.quizScores, progress.completedModules);
  };

  return {
    isAdmin,
    isPremium,
    subscriptionStatus,
    hasFullAccess,
    bypassLocks: hasFullAccess,
    canAccessArcano,
    loading: premiumLoading || roleLoading || progressLoading,
  };
}


