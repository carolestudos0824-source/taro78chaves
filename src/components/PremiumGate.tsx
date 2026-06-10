import { useNavigate } from "react-router-dom";
import { Crown, Sparkles, LockKeyhole, ArrowRight, KeyRound, SquareStack, Compass, WandSparkles, CircleCheck, Eye, Stars } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePremium } from "@/hooks/use-premium";
import { useRole } from "@/hooks/use-role";
import { isWebCheckoutAllowed, STRIPE_BLOCKED_ANDROID_MSG } from "@/lib/platform";

interface PremiumGateProps {
  featureName?: string;
  message?: string;
  variant?: "inline" | "block" | "banner";
  className?: string;
  children?: React.ReactNode;
}

const VALUE_HOOKS = [
  { icon: SquareStack, label: "78 arcanos guiados" },
  { icon: Compass, label: "Jornada progressiva" },
  { icon: Sparkles, label: "Quizzes e Chaves" },
  { icon: WandSparkles, label: "Práticas guiadas" },
  { icon: CircleCheck, label: "Progresso salvo" },
  { icon: Stars, label: "Arcanos Vivos" },
];

const PremiumGate = ({
  featureName,
  message,
  variant = "block",
  className = "",
  children,
}: PremiumGateProps) => {
  const navigate = useNavigate();
  const { isPremium, loading } = usePremium();
  const { isStaff } = useRole();
  const webCheckoutAllowed = isWebCheckoutAllowed();

  if (loading) return null;
  if ((isPremium || isStaff) && children) return <>{children}</>;
  if (isPremium || isStaff) return null;

  if (variant === "banner") {
    return (
      <button
        onClick={() => navigate("/premium")}
        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all active:scale-[0.98] bg-white border-2 border-[#C8A66A]/30 shadow-md group ${className}`}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[#5B1F3D] border border-[#C8A66A] shadow-sm">
          <KeyRound className="w-5 h-5 text-[#C8A66A]" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-[15px] font-body font-bold text-[#5B1F3D]">
            {webCheckoutAllowed ? "Jornada Completa" : "Conteúdo Restrito"}
          </p>
          <p className="text-[13px] font-body font-bold text-[#5B1F3D]/80">
            {webCheckoutAllowed ? "Acesse as 78 portas da sua travessia" : STRIPE_BLOCKED_ANDROID_MSG}
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-[#C8A66A] group-hover:translate-x-1 transition-transform" />
      </button>
    );
  }

  if (variant === "inline") {
    return (
      <div
        className={`flex items-center gap-4 px-5 py-4 rounded-2xl bg-[#F3E6E0] border-2 border-[#C8A66A]/30 shadow-sm ${className}`}
      >
        <LockKeyhole className="w-5 h-5 shrink-0 text-[#5B1F3D]" />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-body font-bold text-[#5B1F3D]">
            {featureName ? (
              <><span className="font-bold text-[#5B1F3D]">Portal: {featureName}</span></>
            ) : (
              webCheckoutAllowed ? "Acesso à Jornada Completa." : STRIPE_BLOCKED_ANDROID_MSG
            )}
          </p>
        </div>
        <button
          onClick={() => navigate("/premium")}
          className="text-[10px] font-heading tracking-[0.2em] uppercase shrink-0 px-4 py-2 rounded-xl bg-[#5B1F3D] text-white border border-[#C8A66A] font-black shadow-md transition-all active:scale-95"
        >
          {webCheckoutAllowed ? "Abrir" : "Detalhes"}
        </button>
      </div>
    );
  }

  return (
    <div
      className={`rounded-[2.5rem] p-8 text-center space-y-6 bg-white border-4 border-[#C8A66A]/30 shadow-2xl ring-8 ring-[#C8A66A]/5 ${className}`}
    >
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-2xl bg-[#5B1F3D] border-2 border-[#C8A66A] flex items-center justify-center shadow-xl rotate-3">
          <KeyRound className="w-8 h-8 text-[#C8A66A]" />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-heading text-2xl font-black text-[#5B1F3D] tracking-tight">
          {webCheckoutAllowed ? "Abra as 78 Portas do Tarô" : "Portal Restrito"}
        </h3>
        <p className="text-[14px] font-body text-[#5B1F3D]/80 font-bold italic leading-relaxed max-w-[320px] mx-auto">
          {message || (webCheckoutAllowed 
            ? "Você já começou pelo Louco. Agora receba todas as chaves e siga atravessando cada arcano com método, prática e ritual."
            : STRIPE_BLOCKED_ANDROID_MSG)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-left max-w-xs mx-auto py-2">
        {VALUE_HOOKS.map((hook, i) => (
          <div key={i} className="flex items-center gap-2">
            <hook.icon className="w-3.5 h-3.5 shrink-0 text-[#C8A66A]" />
            <span className="text-[11px] font-heading font-black text-[#5B1F3D] uppercase tracking-tight leading-none">
              {hook.label}
            </span>
          </div>
        ))}
      </div>

      <div className="pt-2 flex flex-col items-center w-full">
        <Button
          onClick={() => navigate("/premium")}
          className="w-full h-auto py-5 px-4 bg-[#5B1F3D] hover:bg-[#5B1F3D]/90 text-white rounded-2xl font-heading font-black tracking-[0.1em] shadow-xl border-2 border-[#C8A66A] leading-tight text-center whitespace-normal break-words"
        >
          {webCheckoutAllowed ? "CONTINUAR JORNADA" : "VER PORTAL"}
        </Button>
        <p className="text-[13px] font-body text-[#5B1F3D]/80 mt-5 font-bold text-center w-full">
          {webCheckoutAllowed ? "Receba todas as chaves da sua travessia" : "Conteúdo exclusivo para alunas com acesso ativo"}
        </p>
      </div>
    </div>
  );
};

export default PremiumGate;