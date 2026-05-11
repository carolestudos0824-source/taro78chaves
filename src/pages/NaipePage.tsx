import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Lock, Check, ChevronRight, BookOpen, Hash, Crown } from "lucide-react";
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
        <div className="relative overflow-hidden rounded-xl transition-all duration-300" style={isCurrent && filled ? {
          background: "linear-gradient(145deg, hsl(38 28% 93% / 0.94), hsl(36 33% 95% / 0.90))",
          border: `1.5px solid ${naipeInfo.color.border}`,
          boxShadow: `0 4px 20px ${naipeInfo.color.border}`,
        } : completed ? {
          background: "hsl(38 28% 94% / 0.80)",
          border: "1px solid hsl(36 42% 52% / 0.30)",
        } : {
          background: "hsl(36 18% 90% / 0.45)",
          border: "1px solid hsl(36 22% 80% / 0.45)",
        }}>
          <div className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={completed ? {
              border: "2px solid hsl(36 42% 45% / 0.40)",
              background: "hsl(38 28% 94% / 0.90)",
            } : unlocked ? {
              border: `1.5px solid ${naipeInfo.color.border}`,
              background: naipeInfo.color.surface,
            } : {
              border: "1.5px solid hsl(36 22% 75% / 0.50)",
              background: "hsl(36 18% 90% / 0.55)",
            }}>
              {completed ? (
                <Check className="w-4 h-4" style={{ color: "hsl(36 42% 38%)" }} />
              ) : unlocked ? (
                <span className="text-xs font-heading" style={{ color: naipeInfo.color.primary }}>
                  {isNum ? card.posicao : courtIcon(card.posicao as string)}
                </span>
              ) : (
                <Lock className="w-3.5 h-3.5" style={{ color: "hsl(230 10% 45% / 0.30)" }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading text-sm tracking-wide truncate" style={{
                color: unlocked ? "hsl(230 20% 12% / 0.80)" : "hsl(230 10% 45% / 0.30)",
              }}>
                {card.nome}
              </h3>
              {card.subtitulo && (
                <p className="font-accent text-xs italic truncate" style={{ color: "hsl(230 20% 15% / 0.45)" }}>
                  {card.subtitulo}
                </p>
              )}
            </div>
            {unlocked && filled && (
              <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: naipeInfo.color.primary }} />
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
          background: "linear-gradient(to bottom, #FAF5EF 0%, #DCCFC2 100%)",
          opacity: 0.8,
        }} />
      </div>

      {/* Header */}
      <header className="relative z-10" style={{
        borderBottom: `1.5px solid ${naipeInfo.color.primary}40`,
        background: "rgba(250, 245, 239, 0.95)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 4px 20px rgba(91, 31, 61, 0.05)",
      }}>
        <div className="container max-w-3xl py-6 px-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate("/app")} 
                className="transition-all hover:scale-110 duration-200 w-10 h-10 rounded-full flex items-center justify-center bg-[#FAF5EF] border border-[#C8A66A30]" 
                style={{ color: "#5B1F3D" }}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <span className="text-[10px] tracking-[0.4em] uppercase font-heading mb-1 flex items-center gap-2" style={{ color: naipeInfo.color.primary }}>
                  {naipeInfo.icon} Arcanos Menores
                </span>
                <h1 className="font-heading text-2xl md:text-3xl tracking-wide" style={{ color: "#5B1F3D" }}>
                  {naipeInfo.name}
                </h1>
              </div>
            </div>
            <StreakCounter streak={progress.streak} />
          </div>

          <p className="font-accent text-[13px] italic leading-relaxed mb-6" style={{ color: "#5B1F3DBB" }}>
            "{NAIPE_PHRASES[naipe]}"
          </p>

          {/* Progress */}
          <div className="space-y-2 bg-white/40 p-3 rounded-xl border border-[#C8A66A20]">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-heading tracking-wider" style={{ color: "#5B1F3DAA" }}>
                {completedCount}/14 cartas estudadas
              </span>
              <span className="text-[11px] font-heading tracking-wider" style={{ color: naipeInfo.color.primary }}>
                {progressPct}%
              </span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "#E8DED3", border: "1px solid #D1C4B5" }}>
              <div className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden" style={{ 
                width: `${progressPct}%`, 
                background: `linear-gradient(90deg, ${naipeInfo.color.primary}, #C8A66A)` 
              }}>
                 <div className="absolute inset-0 w-1/3 h-full bg-white/20 skew-x-[-20deg] animate-pulse" style={{ left: '10%' }} />
              </div>
            </div>
          </div>
          <div className="mt-4">
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
        <div className="grid grid-cols-3 gap-3 mb-8" style={{ animation: "fade-up 0.4s ease-out" }}>
          {[
            { icon: <BookOpen className="w-4 h-4" />, label: "Introdução", desc: "Simbologia", onClick: () => navigate(`/naipe/${naipe}/intro`) },
            { icon: <Hash className="w-4 h-4" />, label: "Números", desc: "Ás ao Dez", onClick: () => navigate("/numerologia") },
            { icon: <Crown className="w-4 h-4" />, label: "Corte", desc: "Pajem ao Rei", onClick: () => navigate("/module/cartas-corte") },
          ].map((tool) => (
            <button
              key={tool.label}
              onClick={tool.onClick}
              className="rounded-2xl p-4 text-center transition-all duration-300 hover:scale-[1.05] group bg-white/60 border border-[#C8A66A30] backdrop-blur-sm shadow-sm"
            >
              <div className="w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 transition-colors group-hover:bg-[#C8A66A10]" style={{
                background: `${naipeInfo.color.primary}15`,
                border: `1px solid ${naipeInfo.color.primary}30`,
                color: naipeInfo.color.primary,
              }}>
                {tool.icon}
              </div>
              <p className="font-heading text-[11px] tracking-widest uppercase mb-1" style={{ color: "#5B1F3D" }}>
                {tool.label}
              </p>
              <p className="text-[9px] font-accent italic" style={{ color: "#5B1F3D60" }}>
                {tool.desc}
              </p>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8" style={{ animation: "fade-up 0.4s ease-out 0.05s both" }}>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#C8A66A40]" />
          <span className="text-[10px] font-heading tracking-[0.3em] uppercase text-[#5B1F3D]">
            Trilha de Estudo
          </span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#C8A66A40]" />
        </div>

        {/* Numbered cards */}
        <div className="flex items-center gap-3 mb-4 opacity-80" style={{ animation: "fade-up 0.4s ease-out 0.1s both" }}>
           <span className="text-xl" style={{ color: naipeInfo.color.primary }}>◈</span>
           <h3 className="font-heading text-xs tracking-[0.3em] uppercase" style={{ color: "#5B1F3D" }}>
            Ás ao Dez
          </h3>
        </div>
        <div className="space-y-3 mb-10">
          {numbered.map((card, i) => renderCardRow(card, i, 120 + i * 40))}
        </div>

        {/* Court cards */}
        <div className="flex items-center gap-3 mb-4 opacity-80" style={{ animation: "fade-up 0.4s ease-out 0.5s both" }}>
           <span className="text-xl" style={{ color: naipeInfo.color.primary }}>♛</span>
           <h3 className="font-heading text-xs tracking-[0.3em] uppercase" style={{ color: "#5B1F3D" }}>
            Cartas da Corte
          </h3>
        </div>
        <div className="space-y-3 mb-12">
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
