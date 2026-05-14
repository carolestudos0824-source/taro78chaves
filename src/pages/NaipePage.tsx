import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Lock, Check, ChevronRight, BookOpen, Hash, Crown, Sparkles } from "lucide-react";
import { TarotIcon } from "@/components/TarotIcon";
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
        style={{ animation: `fade-up 0.5s ease-out both`, animationDelay: `${delay}ms` }}
      >
        <div 
          className="relative overflow-hidden rounded-[2rem] transition-all duration-500" 
          style={isCurrent && filled ? {
            background: "white",
            border: `2.5px solid #C8A66A`,
            boxShadow: `0 30px 60px -12px rgba(91, 31, 61, 0.22)`,
            transform: "translateY(-4px)"
          } : completed ? {
            background: "rgba(255, 255, 255, 0.9)",
            border: "2px solid rgba(200, 166, 106, 0.35)",
            boxShadow: "0 8px 25px rgba(91, 31, 61, 0.04)"
          } : {
            background: "rgba(220, 207, 194, 0.15)",
            border: "2px solid rgba(220, 207, 194, 0.25)",
          }}
        >
          {/* Hover effect overlay */}
          <div className="absolute inset-0 bg-[#C8A66A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="p-6 flex items-center gap-6 relative z-10">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl ${
              isCurrent && filled ? "scale-110" : ""
            }`} style={completed ? {
              border: "3px solid #5B1F3D",
              background: "#FAF5EF",
              boxShadow: "inset 0 3px 6px rgba(91, 31, 61, 0.08)"
            } : unlocked ? {
              border: `3px solid #5B1F3D`,
              background: "#FAF5EF",
              boxShadow: "inset 0 3px 6px rgba(91, 31, 61, 0.08)",
              borderColor: isCurrent ? "#5B1F3D" : "#5B1F3D80"
            } : {
              border: "2px solid rgba(91, 31, 61, 0.2)",
              background: "rgba(220, 207, 194, 0.2)",
            }}>
              {completed ? (
                <Check className="w-7 h-7" style={{ color: "#5B1F3D" }} strokeWidth={4} />
              ) : unlocked ? (
                <span className="text-lg font-heading font-black" style={{ color: "#5B1F3D" }}>
                  {isNum ? card.posicao : courtIcon(card.posicao as string)}
                </span>
              ) : (
                <Lock className="w-5 h-5" style={{ color: "#5B1F3D40" }} />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-heading text-xl tracking-tight truncate font-black leading-tight" style={{
                color: unlocked ? "#5B1F3D" : "#5B1F3D60",
              }}>
                {card.nome}
              </h3>
              {card.subtitulo && (
                <p className="font-accent text-[15px] italic truncate font-black mt-1" style={{ color: unlocked ? "#8B6A30" : "#5B1F3D40" }}>
                  {card.subtitulo}
                </p>
              )}
            </div>
            
            {unlocked && filled && (
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#FAF5EF] border-2 border-[#C8A66A]/30 transition-all duration-500 group-hover:bg-[#C8A66A]/20 group-hover:border-[#C8A66A] group-hover:translate-x-2 shadow-sm">
                <ChevronRight className="w-6 h-6 shrink-0" style={{ color: "#C8A66A" }} />
              </div>
            )}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden pb-bottom-nav">
      {/* Background — Refined Marfim from /app */}
      <div className="fixed inset-0 z-0 mystic-bg-procedural">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #FAF5EF 0%, #F5EBDE 45%, #EFE2D2 100%)",
            opacity: 0.98,
          }}
        />
        {/* Subtle atmosphere layers */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 50% 20%, rgba(243, 230, 224, 0.45) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(250, 245, 239, 0.8) 0%, transparent 30%, transparent 70%, rgba(239, 226, 210, 0.5) 100%)",
          }}
        />
      </div>

      {/* Header — Premium Style from /app */}
      <header className="relative z-10" style={{
        borderBottom: "1.5px solid #C8A66A40",
        background: "rgba(250, 245, 239, 0.95)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 4px 20px rgba(91, 31, 61, 0.05)"
      }}>
        <div className="container max-w-3xl py-8 px-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => navigate("/app")} 
                className="transition-all hover:scale-110 duration-200 w-12 h-12 rounded-full flex items-center justify-center bg-[#FAF5EF] border border-[#C8A66A30] shadow-sm" 
                style={{ color: "#5B1F3D" }}
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <span className="text-[11px] tracking-[0.45em] uppercase font-heading mb-2 flex items-center gap-2 font-black" style={{ color: "#C8A66A" }}>
                  <Sparkles className="w-3.5 h-3.5" /> Arcanos Menores
                </span>
                <h1 className="font-heading text-4xl md:text-5xl tracking-tight font-black" style={{ color: "#5B1F3D" }}>
                  {naipeInfo.name}
                </h1>
              </div>
            </div>
            <StreakCounter streak={progress.streak} />
          </div>

          <div className="relative mb-12">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#C8A66A] to-transparent rounded-full" />
            <p className="font-accent text-[20px] md:text-[22px] italic leading-relaxed font-black pl-8 py-3" style={{ color: "#5B1F3D" }}>
              "{NAIPE_PHRASES[naipe]}"
            </p>
          </div>

          {/* Progress — Unified with /app dashboard style */}
          <div className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] border-2 border-[#C8A66A]/30 shadow-xl">
            <div className="flex items-center justify-between mb-5 px-1">
              <span className="text-[13px] font-heading tracking-[0.35em] uppercase font-black" style={{ color: "#5B1F3D" }}>
                {completedCount}/14 lições concluídas
              </span>
              <span className="text-[15px] font-heading font-black px-3 py-1 rounded-full bg-[#C8A66A]/10 border border-[#C8A66A]/20" style={{ color: "#8B6A30" }}>
                {progressPct}%
              </span>
            </div>
            <div className="h-4 rounded-full overflow-hidden p-[2.5px]" style={{ background: "#E8DED3", border: "1.5px solid rgba(209, 196, 181, 0.6)" }}>
              <div className="h-full rounded-full transition-all duration-1000 ease-out relative" style={{ 
                width: `${Math.max(progressPct, 4)}%`, 
                background: `linear-gradient(90deg, #5B1F3D, #C8A66A)` 
              }}>
                 <div className="absolute inset-0 w-1/2 h-full bg-white/30 skew-x-[-25deg] animate-pulse" style={{ left: '10%' }} />
              </div>
            </div>
          </div>
          <div className="mt-8">
            <XPBar xp={progress.xp} level={progress.level} />
          </div>
        </div>
      </header>

      <main className="relative z-10 container max-w-3xl py-12 px-6">
        {/* Fase 3B — telemetria invisível para todas as 14 cartas deste naipe */}
        {cards.map((c) => (
          <PilotMenorProbe key={`probe-${c.id}`} naipe={naipe} posicao={c.posicao} />
        ))}

        {/* Study tools — Card style from /app */}
        <div className="grid grid-cols-3 gap-5 mb-16" style={{ animation: "fade-up 0.5s ease-out" }}>
          {[
            { icon: <BookOpen className="w-6 h-6" />, label: "Introdução", desc: "Simbologia", onClick: () => navigate(`/naipe/${naipe}/intro`) },
            { icon: <Hash className="w-6 h-6" />, label: "Números", desc: "Ás ao Dez", onClick: () => navigate("/numerologia") },
            { icon: <Crown className="w-6 h-6" />, label: "Corte", desc: "Pajem ao Rei", onClick: () => navigate("/module/cartas-corte") },
          ].map((tool) => (
            <button
              key={tool.label}
              onClick={tool.onClick}
              className="rounded-[2rem] p-6 text-center transition-all duration-500 hover:scale-[1.05] group bg-white border-2 border-[#C8A66A]/30 backdrop-blur-md shadow-lg hover:shadow-2xl hover:border-[#C8A66A]"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:bg-[#5B1F3D] group-hover:shadow-[0_10px_25px_rgba(91,31,61,0.3)] bg-[#FAF5EF] border-2 border-[#C8A66A]/20 shadow-inner">
                <div className="group-hover:text-white transition-colors duration-500" style={{ color: "#5B1F3D" }}>{tool.icon}</div>
              </div>
              <p className="font-heading text-[13px] tracking-[0.25em] uppercase mb-1 font-black" style={{ color: "#5B1F3D" }}>
                {tool.label}
              </p>
              <p className="text-[11px] font-accent italic font-black" style={{ color: "#8B6A30" }}>
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
