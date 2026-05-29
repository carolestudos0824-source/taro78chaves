/**
 * CertificateCard — Elegant mystic certificate display.
 * Visual-only; used both inline and in a full-view modal.
 */
import { useRef } from "react";
import type { EarnedCertificateView } from "@/lib/certificates/emission";
import PremiumCertificate from "./PremiumCertificate";

export type EarnedCertificate = EarnedCertificateView;

interface Props {
  certificate: EarnedCertificateView;
  compact?: boolean;
  onView?: () => void;
}

const CertificateCard = ({ certificate, compact = false, onView }: Props) => {
  if (compact) {
    return (
      <button
        onClick={onView}
        className="w-full text-left rounded-xl p-5 transition-all duration-300 hover:shadow-lg group"
        style={{
          background: "linear-gradient(135deg, hsl(38 28% 93% / 0.90), hsl(36 33% 95% / 0.85))",
          border: `1.5px solid ${certificate.accentColor}33`,
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 text-2xl"
            style={{
              background: `${certificate.accentColor}15`,
              border: `1.5px solid ${certificate.accentColor}30`,
            }}
          >
            {certificate.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-heading text-sm tracking-wide" style={{ color: "hsl(340 42% 22%)" }}>
              {certificate.title}
            </div>
            <div className="font-accent text-xs italic" style={{ color: "hsl(230 20% 15% / 0.50)" }}>
              {certificate.subtitle}
            </div>
            <div className="text-[10px] font-body mt-1" style={{ color: "hsl(230 15% 30% / 0.40)" }}>
              {new Date(certificate.earnedAt).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
          <div className="text-xs font-body shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: certificate.accentColor }}>
            Ver →
          </div>
        </div>
      </button>
    );
  }

  return <FullCertificate certificate={certificate} />;
};

/** Full-size certificate for viewing / downloading */
export const FullCertificate = ({ certificate }: { certificate: EarnedCertificateView }) => {
  const formattedDate = new Date(certificate.earnedAt).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="w-full max-w-2xl mx-auto shadow-2xl rounded-2xl overflow-hidden">
      <PremiumCertificate 
        studentName={certificate.studentName || "Estudante"}
        issueDate={formattedDate}
        validationCode={certificate.validationCode}
        className="border-none p-8 sm:p-12"
      />
    </div>
  );
};

export default CertificateCard;
