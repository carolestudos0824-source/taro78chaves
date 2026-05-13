import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Lock, Check, ChevronRight, BookOpen, Hash, Crown, Sparkles } from "lucide-react";
import {
  type Naipe,
  NAIPES,
  getCardsByNaipe,
  hasContent,
} from "@/registry/naipes";
import { useProgress } from "@/hooks/use-progress";
import { useAccess } from "@/hooks/use-access";
import { XPBar } from "@/components/XPBar";
import { StreakCounter } from "@/components/StreakCounter";
import { useResolvedArcanoMenorPilot } from "@/hooks/use-resolved-arcanos-menores-pilot";

/**
 * Telemetria invisível da Fase 3 — dispara o hook do adaptador para validar
 * que o piloto (Ás de Copas, Cinco de Paus, Seis de Espadas, Dez de Ouros)
 * resolve via DB. Não altera UI nem comportamento.
 */
const PilotMenorProbe = ({
  naipe,
  posicao,
}: {
  naipe: Naipe;
  posicao: number | string;
}) => {
  useResolvedArcanoMenorPilot(naipe, posicao);
  return null;
};

const NAIPE_ROUTE_MAP: Record<string, Naipe> = {
  copas: "copas",
  paus: "paus",
  espadas: "espadas",
  ouros: "ouros",
};

const NAIPE_PHRASES: Record<Naipe, string> = {
  copas: "O naipe dos afetos, da sensibilidade, dos vínculos e da experiência emocional.",
  paus: "O naipe da ação, da criatividade, da paixão e da energia vital.",
  espadas: "O naipe da mente, do conflito, da verdade e da clareza intelectual.",
  ouros: "O naipe do corpo, da matéria, do trabalho e da manifestação.",
};

const NaipePage = () => {
  const { naipe: naipeParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { progress } = useProgress();
  const { bypassLocks } = useAccess();

  // Support both /module/:naipe route and /module/copas style routes
  const pathNaipe = location.pathname.split("/").pop() || "";
  const naipe = NAIPE_ROUTE_MAP[naipeParam || pathNaipe] || NAIPE_ROUTE_MAP[pathNaipe];
  if (!naipe) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(36 33% 97%)" }}>
        <div className="text-center space-y-4">
          <p className="font-heading text-lg" style={{ color: "hsl(230 25% 15%)" }}>Naipe não encontrado</p>
          <button onClick={() => navigate("/app")} className="text-sm font-heading tracking-wider" style={{ color: "hsl(36 45% 58%)" }}>
            Voltar aos módulos
          </button>
        </div>
      </div>
    );
  }

  const naipeInfo = NAIPES[naipe];
  const cards = getCardsByNaipe(naipe);
  const numbered = cards.filter((c) => typeof c.posicao === "number");
  const court = cards.filter((c) => typeof c.posicao === "string");

  const isCardCompleted = (cardId: string) => progress.completedLessons.includes(cardId);
  const isCardUnlocked = (idx: number) => {
    if (bypassLocks) return true;
    if (idx === 0) return true;
    const prevCard = cards[idx - 1];
    return prevCard ? isCardCompleted(prevCard.id) : false;
  };

  const completedCount = cards.filter((c) => isCardCompleted(c.id)).length;
  const progressPct = Math.round((completedCount / 14) * 100);

  const courtIcon = (pos: string) =>
    pos === "pajem" ? "♟" : pos === "cavaleiro" ? "♞" : pos === "rainha" ? "♛" : "♚";

  const renderCardRow = (card: typeof cards[0], globalIdx: number, delay: number) => {
    const completed = isCardCompleted(card.id);
    const unlocked = isCardUnlocked(globalIdx);
    const isCurrent = unlocked && !completed;
    const filled = hasContent(card);
    const isNum = typeof card.posicao === "number";

    return (
      <button
        key={card.id}
        onClick={() => filled && unlocked && navigate(`/arcano-menor/${card.id}`)}
        disabled={!unlocked || !filled}
        className="w-full text-left group transition-all duration-500"
        style={{ animation: `fade-up 0.4s ease-out both`, animationDelay: `${delay}ms` }}
      >
        <div 
          className="relative overflow-hidden rounded-2xl transition-all duration-500" 
          style={isCurrent && filled ? {
            background: "white",
            border: `2px solid #C8A66A`,
            boxShadow: `0 20px 40px -12px rgba(91, 31, 61, 0.18)`,
            transform: "translateY(-2px)"
          } : completed ? {
            background: "rgba(255, 255, 255, 0.85)",
            border: "1px solid rgba(200, 166, 106, 0.3)",
            boxShadow: "0 4px 15px rgba(91, 31, 61, 0.03)"
          } : {
            background: "rgba(220, 207, 194, 0.1)",
            border: "1px solid rgba(220, 207, 194, 0.2)",
          }}
        >
          {/* Hover effect overlay */}
          <div className="absolute inset-0 bg-[#C8A66A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="p-5 flex items-center gap-5 relative z-10">
            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:shadow-md" style={completed ? {
              border: "2.5px solid #5B1F3D",
              background: "#FAF5EF",
              boxShadow: "inset 0 2px 4px rgba(91, 31, 61, 0.05)"
            } : unlocked ? {
              border: `2.5px solid #5B1F3D`,
              background: "#FAF5EF",
              boxShadow: "inset 0 2px 4px rgba(91, 31, 61, 0.05)"
            } : {
              border: "1.5px solid rgba(91, 31, 61, 0.15)",
              background: "rgba(220, 207, 194, 0.1)",
            }}>
              {completed ? (
                <Check className="w-6 h-6" style={{ color: "#5B1F3D" }} strokeWidth={3.5} />
              ) : unlocked ? (
                <span className="text-sm font-heading font-black" style={{ color: "#5B1F3D" }}>
                  {isNum ? card.posicao : courtIcon(card.posicao as string)}
                </span>
              ) : (
                <Lock className="w-4 h-4" style={{ color: "#5B1F3D30" }} />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-heading text-lg tracking-tight truncate font-black leading-tight" style={{
                color: unlocked ? "#5B1F3D" : "#5B1F3D60",
              }}>
                {card.nome}
              </h3>
              {card.subtitulo && (
                <p className="font-accent text-sm italic truncate font-bold mt-0.5" style={{ color: unlocked ? "#8B6A30" : "#5B1F3D30" }}>
                  {card.subtitulo}
                </p>
              )}
            </div>
            
            {unlocked && filled && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FAF5EF] border border-[#C8A66A]/20 transition-all duration-300 group-hover:bg-[#C8A66A]/10 group-hover:border-[#C8A66A]/40 group-hover:translate-x-1">
                <ChevronRight className="w-5 h-5 shrink-0" style={{ color: "#C8A66A" }} />
              </div>
            )}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden pb-bottom-nav">
      <div className="fixed inset-0 z-0 mystic-bg-procedural">
        <div className="absolute inset-0" style={{
          background: "linear-gradient(135deg, #FAF5EF 0%, #F5E6D3 50%, #DCCFC2 100%)",
          opacity: 0.95,
        }} />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      </div>

      {/* Header */}
      <header className="relative z-10" style={{
        borderBottom: `2.5px solid #C8A66A40`,
        background: "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 10px 40px rgba(91, 31, 61, 0.06)",
      }}>
        <div className="container max-w-3xl py-8 px-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-5">
              <button 
                onClick={() => navigate("/app")} 
                className="transition-all hover:scale-110 duration-200 w-11 h-11 rounded-full flex items-center justify-center bg-[#FAF5EF] border-2 border-[#C8A66A40] shadow-sm" 
                style={{ color: "#5B1F3D" }}
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <span className="text-[11px] tracking-[0.45em] uppercase font-heading mb-1.5 flex items-center gap-2 font-black" style={{ color: "#8B6A30" }}>
                  <Sparkles className="w-3.5 h-3.5" /> Arcanos Menores
                </span>
                <h1 className="font-heading text-3xl md:text-4xl tracking-tight font-black" style={{ color: "#5B1F3D" }}>
                  {naipeInfo.name}
                </h1>
              </div>
            </div>
            <StreakCounter streak={progress.streak} />
          </div>

          <p className="font-accent text-[17px] italic leading-relaxed mb-8 font-bold border-l-4 border-[#C8A66A40] pl-5 py-1" style={{ color: "#5B1F3D" }}>
            "{NAIPE_PHRASES[naipe]}"
          </p>

          {/* Progress */}
          <div className="space-y-4 bg-[#FAF5EF] p-6 rounded-2xl border-2 border-[#C8A66A]/30 shadow-[inset_0_2px_10px_rgba(91,31,61,0.05)]">
            <div className="flex items-center justify-between px-1">
              <span className="text-[12px] font-heading tracking-[0.3em] uppercase font-black" style={{ color: "#5B1F3D" }}>
                {completedCount}/14 cartas concluídas
              </span>
              <span className="text-[14px] font-heading font-black px-2 py-0.5 rounded-full bg-[#C8A66A]/10" style={{ color: "#8B6A30" }}>
                {progressPct}%
              </span>
            </div>
            <div className="h-4 rounded-full overflow-hidden p-[2px]" style={{ background: "#DCCFC250", border: "1px solid #DCCFC260" }}>
              <div className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden" style={{ 
                width: `${Math.max(progressPct, 4)}%`, 
                background: `linear-gradient(90deg, #5B1F3D, #8B6A30, #C8A66A)` 
              }}>
                 <div className="absolute inset-0 w-1/2 h-full bg-white/30 skew-x-[-25deg] animate-pulse" style={{ left: '10%' }} />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <XPBar xp={progress.xp} level={progress.level} />
          </div>
        </div>
      </header>

      <main className="relative z-10 container max-w-3xl py-8 px-6">
        {/* Fase 3B — telemetria invisível para todas as 14 cartas deste naipe */}
        {cards.map((c) => (
          <PilotMenorProbe key={`probe-${c.id}`} naipe={naipe} posicao={c.posicao} />
        ))}

        {/* Study tools */}
        <div className="grid grid-cols-3 gap-4 mb-12" style={{ animation: "fade-up 0.4s ease-out" }}>
          {[
            { icon: <BookOpen className="w-5 h-5" />, label: "Introdução", desc: "Simbologia", onClick: () => navigate(`/naipe/${naipe}/intro`) },
            { icon: <Hash className="w-5 h-5" />, label: "Números", desc: "Ás ao Dez", onClick: () => navigate("/numerologia") },
            { icon: <Crown className="w-5 h-5" />, label: "Corte", desc: "Pajem ao Rei", onClick: () => navigate("/module/cartas-corte") },
          ].map((tool) => (
            <button
              key={tool.label}
              onClick={tool.onClick}
              className="rounded-2xl p-5 text-center transition-all duration-300 hover:scale-[1.05] group bg-white border-2 border-[#C8A66A]/30 backdrop-blur-sm shadow-lg hover:border-[#C8A66A]/60"
            >
              <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 transition-colors group-hover:bg-[#C8A66A]/10 bg-[#FAF5EF] border border-[#C8A66A]/20 shadow-inner">
                <div style={{ color: "#5B1F3D" }}>{tool.icon}</div>
              </div>
              <p className="font-heading text-[12px] tracking-[0.2em] uppercase mb-1 font-black" style={{ color: "#5B1F3D" }}>
                {tool.label}
              </p>
              <p className="text-[10px] font-accent italic font-bold" style={{ color: "hsl(36 42% 35%)" }}>
                {tool.desc}
              </p>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-6 mb-12" style={{ animation: "fade-up 0.4s ease-out 0.05s both" }}>
          <div className="flex-1 h-[1.5px] bg-gradient-to-r from-transparent via-[#C8A66A]/40 to-transparent" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-[12px] font-heading tracking-[0.5em] uppercase text-[#5B1F3D] font-black">
              Trilha de Estudo
            </span>
            <div className="w-8 h-[2px] bg-[#C8A66A]" />
          </div>
          <div className="flex-1 h-[1.5px] bg-gradient-to-r from-transparent via-[#C8A66A]/40 to-transparent" />
        </div>

        {/* Numbered cards */}
        <div className="flex items-center gap-4 mb-8" style={{ animation: "fade-up 0.4s ease-out 0.1s both" }}>
           <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#5B1F3D] shadow-lg border border-[#C8A66A]/30">
             <span className="text-[#FAF5EF] text-lg font-heading font-black">◈</span>
           </div>
           <div className="flex flex-col">
             <h3 className="font-heading text-sm tracking-[0.3em] uppercase font-black text-[#5B1F3D] leading-none">
               Ás ao Dez
             </h3>
             <div className="h-0.5 w-12 bg-[#C8A66A]/30 mt-1.5" />
           </div>
        </div>
        <div className="space-y-4 mb-14">
          {numbered.map((card, i) => renderCardRow(card, i, 120 + i * 40))}
        </div>

        {/* Court cards */}
        <div className="flex items-center gap-4 mb-8" style={{ animation: "fade-up 0.4s ease-out 0.5s both" }}>
           <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#8B6A30] shadow-lg border border-[#C8A66A]/30">
             <span className="text-[#FAF5EF] text-lg font-heading font-black">♛</span>
           </div>
           <div className="flex flex-col">
             <h3 className="font-heading text-sm tracking-[0.3em] uppercase font-black text-[#5B1F3D] leading-none">
               Cartas da Corte
             </h3>
             <div className="h-0.5 w-12 bg-[#C8A66A]/30 mt-1.5" />
           </div>
        </div>
        <div className="space-y-4 mb-16">
          {court.map((card, i) => renderCardRow(card, 10 + i, 520 + i * 40))}
        </div>

        {/* Footer */}
        <div className="text-center pt-4 mb-10" style={{ animation: "fade-up 0.4s ease-out 0.7s both" }}>
          <button onClick={() => navigate("/app")} className="text-[10px] font-heading tracking-[0.2em] uppercase transition-all hover:text-[#5B1F3D] hover:scale-105" style={{ color: "#5B1F3D" }}>
            ← Voltar aos módulos
          </button>
        </div>
      </main>
    </div>
  );
};

export default NaipePage;
