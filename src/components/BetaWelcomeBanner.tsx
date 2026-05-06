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
      className="relative rounded-[2rem] p-7 md:p-9 mb-10 overflow-hidden"
      style={{
        background: "linear-gradient(145deg, hsl(var(--brand-plum) / 0.05), hsl(var(--brand-gold) / 0.08), #FFF)",
        border: "2px solid hsl(var(--brand-gold) / 0.3)",
        boxShadow: "0 12px 40px hsl(var(--brand-plum) / 0.06), 0 0 80px hsl(var(--brand-gold) / 0.05)",
        animation: "fade-in 0.8s ease-out",
      }}
    >
      {/* Close */}
      <button
        onClick={dismiss}
        className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-black/5 active:scale-90"
        style={{ color: "hsl(230 15% 40% / 0.40)" }}
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg" style={{
          background: "linear-gradient(135deg, hsl(var(--brand-plum) / 0.1), hsl(var(--brand-gold) / 0.15))",
          border: "2px solid hsl(var(--brand-gold) / 0.25)",
        }}>
          <Sparkles className="w-7 h-7" style={{ color: "hsl(var(--brand-gold))" }} />
        </div>
 
        <div className="flex-1 min-w-0">
          <p className="text-[11px] md:text-[13px] font-heading tracking-[0.4em] uppercase mb-2 font-black" style={{ color: "hsl(var(--brand-gold))" }}>
            ✦ Boas-vindas à Beta ✦
          </p>
          <h3 className="font-heading text-xl md:text-2xl font-black tracking-tight mb-3" style={{
            color: "hsl(var(--brand-plum))",
          }}>
            O Louco abre a primeira porta.
          </h3>
          <p className="font-body text-[15px] md:text-[17px] font-bold leading-relaxed mb-6 italic" style={{ color: "hsl(var(--brand-plum) / 0.8)" }}>
            Sua jornada começa pelos <strong className="font-black" style={{ color: "hsl(var(--brand-plum))" }}>Fundamentos do Tarô</strong> — é a porta de entrada para tudo o que vem depois. De lá, os arcanos se revelam um a um.
          </p>

          <button
            onClick={() => { dismiss(); navigate("/module/fundamentos"); }}
            className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-heading text-[11px] tracking-[0.25em] uppercase transition-all hover:scale-105 active:scale-95 font-black border-2 border-[#C8A66A]/30"
            style={{
              background: "hsl(var(--brand-plum))",
              color: "#FFF",
              boxShadow: "0 8px 24px hsl(var(--brand-plum) / 0.25)",
            }}
          >
            Começar pelos Fundamentos
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BetaWelcomeBanner;
