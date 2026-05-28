/**
 * Lógica técnica de emissão de certificados.
 *
 * O conteúdo editorial vem do adaptador (`useCertificatesContent`).
 * Aqui mora apenas a regra de avaliação: dado um critério opaco
 * (`completionCheck`) e a lista de módulos concluídos, decidir se o
 * certificado foi conquistado.
 *
 * Mantido local porque:
 *   - depende do shape interno de `user_progress.completed_modules`
 *   - precisa expandir critérios compostos (ex.: "curso-completo")
 *   - não faz sentido como dado em CMS
 */

import type { CertificateContent } from "@/lib/content/certificates-types";

const COMPOSITE_REQUIREMENTS: Record<string, string[]> = {
  "curso-completo": [
    "fundamentos",
    "leitura-simbolica",
    "arcanos-maiores",
    "arquitetura-menores",
    "copas",
    "paus",
    "espadas",
    "ouros",
    "cartas-corte",
    "combinacoes",
    "tiragens",
    "espiritualidade",
    "mesa-taro",
    "leitura-aplicada",
    "pratica",
    "trabalhar-taro"
  ],
};

export function isCertificateEarned(
  cert: Pick<CertificateContent, "completionCheck">,
  completedModules: string[],
): boolean {
  const composite = COMPOSITE_REQUIREMENTS[cert.completionCheck];
  if (composite) {
    return composite.every((r) => completedModules.includes(r));
  }
  return completedModules.includes(cert.completionCheck);
}

export interface EarnedCertificateView {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  accentColor: string;
  earnedAt: string;
  studentName: string;
  validationCode?: string;
  workloadHours?: number;
}

const DEFAULT_ACCENT = "hsl(36 45% 58%)";

export function buildEarnedCertificate(
  cert: CertificateContent,
  earnedAt: string,
  studentName: string,
): EarnedCertificateView {
  return {
    id: cert.id,
    slug: cert.slug,
    title: cert.title,
    subtitle: cert.subtitle ?? "",
    description: cert.description ?? "",
    icon: cert.icon ?? "✦",
    accentColor: cert.accentColor ?? DEFAULT_ACCENT,
    earnedAt,
    studentName,
  };
}
