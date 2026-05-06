import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, X } from "lucide-react";

const DISMISSED_KEY = "beta-welcome-dismissed";

const BetaWelcomeBanner = () => {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISSED_KEY) === "1");

  if (dismissed) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "1");
    setDismissed(true);
  };

  return (
    <div
      className="relative rounded-2xl p-5 mb-6 overflow-hidden"
      style={{
        background: "linear-gradient(145deg, hsl(var(--brand-plum) / 0.04), hsl(var(--brand-gold) / 0.06), hsl(var(--brand-ivory)))",
        border: "1.5px solid hsl(var(--brand-gold) / 0.25)",
        boxShadow: "0 8px 32px hsl(var(--brand-plum) / 0.04), 0 0 60px hsl(var(--brand-gold) / 0.04)",
        animation: "fade-in 0.6s ease-out",
      }}
    >
      {/* Close */}
      <button
        onClick={dismiss}
        className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-colors hover:bg-black/5"
        style={{ color: "hsl(230 15% 40% / 0.30)" }}
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Decorative */}
      <div className="absolute top-2 left-4 text-sm" style={{ color: "hsl(36 45% 58% / 0.15)" }}>✦</div>
      <div className="absolute bottom-2 right-10 text-xs" style={{ color: "hsl(36 45% 58% / 0.10)" }}>✧</div>

      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{
          background: "linear-gradient(135deg, hsl(var(--brand-plum) / 0.08), hsl(var(--brand-gold) / 0.12))",
          border: "1px solid hsl(var(--brand-gold) / 0.22)",
        }}>
          <Sparkles className="w-5 h-5" style={{ color: "hsl(var(--brand-gold))" }} />
        </div>
 
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-heading tracking-[0.3em] uppercase mb-1 font-bold" style={{ color: "hsl(var(--brand-plum) / 0.5)" }}>
            ✦ Boas-vindas à Beta
          </p>
          <h3 className="font-heading text-base font-bold tracking-wide mb-1.5" style={{
            color: "hsl(var(--brand-plum))",
          }}>
            Você é uma das primeiras.
          </h3>
          <p className="font-body text-[12px] leading-relaxed mb-3" style={{ color: "hsl(var(--brand-plum) / 0.7)" }}>
            Sua jornada começa pelos <strong style={{ color: "hsl(var(--brand-plum))" }}>Fundamentos do Tarô</strong> — é a porta de entrada para tudo o que vem depois. De lá, os arcanos se revelam um a um.
          </p>

          <button
            onClick={() => { dismiss(); navigate("/module/fundamentos"); }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-heading text-[10px] tracking-[0.15em] uppercase transition-all hover:scale-105"
            style={{
              background: "hsl(var(--brand-plum))",
              color: "hsl(var(--brand-ivory))",
              boxShadow: "0 4px 16px hsl(var(--brand-plum) / 0.2)",
            }}
          >
            Começar pelos Fundamentos
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BetaWelcomeBanner;
