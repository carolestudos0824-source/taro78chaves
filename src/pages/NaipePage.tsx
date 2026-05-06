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
import mysticBg from "@/assets/mystic-bg.jpg";

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
              {!filled && unlocked && (
                <p className="text-[10px] font-body tracking-wider" style={{ color: "hsl(36 40% 50% / 0.60)" }}>
                  Conteúdo em breve
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
      <div className="fixed inset-0 z-0">
        <img src={mysticBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, hsl(36 33% 97% / 0.10) 0%, hsl(36 33% 97% / 0.05) 30%, hsl(36 33% 97% / 0.08) 70%, hsl(36 33% 97% / 0.22) 100%)",
        }} />
      </div>

      {/* Header */}
      <header className="relative z-10" style={{
        borderBottom: `1px solid ${naipeInfo.color.border}`,
        background: "linear-gradient(180deg, hsl(36 33% 96% / 0.94) 0%, hsl(38 28% 93% / 0.92) 100%)",
        backdropFilter: "blur(28px)",
        boxShadow: "0 6px 36px hsl(36 45% 50% / 0.08)",
      }}>
        <div className="container max-w-3xl py-5 px-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/app")} className="transition-colors hover:scale-105 duration-200" style={{ color: "hsl(230 10% 40%)" }}>
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <span className="text-[10px] tracking-[0.35em] uppercase font-body mb-0.5 flex items-center gap-1.5" style={{ color: naipeInfo.color.primary }}>
                  {naipeInfo.icon} Arcanos Menores
                </span>
                <h1 className="font-heading text-xl md:text-2xl tracking-wide" style={{
                  background: `linear-gradient(135deg, hsl(340 42% 22%), ${naipeInfo.color.primary})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  {naipeInfo.name}
                </h1>
              </div>
            </div>
            <StreakCounter streak={progress.streak} />
          </div>

          <p className="font-accent text-xs italic leading-relaxed mb-4" style={{ color: "hsl(230 20% 25% / 0.55)" }}>
            {NAIPE_PHRASES[naipe]}
          </p>

          {/* Progress */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-heading tracking-wider" style={{ color: "hsl(230 10% 45%)" }}>
                {completedCount}/14 cartas estudadas
              </span>
              <span className="text-[10px] font-heading tracking-wider" style={{ color: naipeInfo.color.primary }}>
                {progressPct}%
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "hsl(36 18% 84%)", border: "1px solid hsl(36 22% 75% / 0.50)" }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progressPct}%`, background: `linear-gradient(90deg, ${naipeInfo.color.primary}, hsl(36 45% 55%))` }} />
            </div>
          </div>
          <div className="mt-3">
            <XPBar xp={progress.xp} level={progress.level} />
          </div>
        </div>
      </header>

      <main className="relative z-10 container max-w-3xl py-6 px-6">
        {/* Fase 3B — telemetria invisível para todas as 14 cartas deste naipe */}
        {cards.map((c) => (
          <PilotMenorProbe key={`probe-${c.id}`} naipe={naipe} posicao={c.posicao} />
        ))}

        {/* Study tools */}
        <div className="grid grid-cols-3 gap-2.5 mb-6" style={{ animation: "fade-up 0.4s ease-out" }}>
          {[
            { icon: <BookOpen className="w-4 h-4" />, label: "Introdução", desc: "Elemento e simbologia", onClick: () => navigate(`/naipe/${naipe}/intro`) },
            { icon: <Hash className="w-4 h-4" />, label: "Números", desc: "Ás ao Dez", onClick: () => navigate("/numerologia") },
            { icon: <Crown className="w-4 h-4" />, label: "Corte", desc: "Pajem ao Rei", onClick: () => navigate("/module/cartas-corte") },
          ].map((tool) => (
            <button
              key={tool.label}
              onClick={tool.onClick}
              className="rounded-xl p-3 text-center transition-all duration-300 hover:scale-[1.02] group"
              style={{
                background: naipeInfo.color.surface,
                border: `1px solid ${naipeInfo.color.border}`,
              }}
            >
              <div className="w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1.5" style={{
                background: `${naipeInfo.color.primary}10`,
                border: `1px solid ${naipeInfo.color.border}`,
                color: naipeInfo.color.primary,
              }}>
                {tool.icon}
              </div>
              <p className="font-heading text-[11px] tracking-wide" style={{ color: "hsl(230 25% 15%)" }}>
                {tool.label}
              </p>
              <p className="text-[9px] font-accent italic" style={{ color: "hsl(230 20% 25% / 0.40)" }}>
                {tool.desc}
              </p>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5" style={{ animation: "fade-up 0.4s ease-out 0.05s both" }}>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${naipeInfo.color.border})` }} />
          <span className="text-[10px] font-heading tracking-[0.25em] uppercase" style={{ color: "hsl(230 10% 50%)" }}>
            Trilha de Estudo
          </span>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${naipeInfo.color.border}, transparent)` }} />
        </div>

        {/* Numbered cards */}
        <h3 className="font-heading text-xs tracking-[0.2em] uppercase mb-3 flex items-center gap-2" style={{ color: naipeInfo.color.primary, animation: "fade-up 0.4s ease-out 0.1s both" }}>
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px]" style={{
            background: naipeInfo.color.surface,
            border: `1px solid ${naipeInfo.color.border}`,
          }}>1</span>
          Ás ao Dez
        </h3>
        <div className="space-y-2.5 mb-8">
          {numbered.map((card, i) => renderCardRow(card, i, 120 + i * 40))}
        </div>

        {/* Court cards */}
        <h3 className="font-heading text-xs tracking-[0.2em] uppercase mb-3 flex items-center gap-2" style={{ color: naipeInfo.color.primary, animation: "fade-up 0.4s ease-out 0.5s both" }}>
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px]" style={{
            background: naipeInfo.color.surface,
            border: `1px solid ${naipeInfo.color.border}`,
          }}>♛</span>
          Cartas da Corte
        </h3>
        <div className="space-y-2.5 mb-8">
          {court.map((card, i) => renderCardRow(card, 10 + i, 520 + i * 40))}
        </div>

        {/* Footer */}
        <div className="text-center pt-4" style={{ animation: "fade-up 0.4s ease-out 0.7s both" }}>
          <button onClick={() => navigate("/app")} className="text-xs font-heading tracking-wider transition-colors" style={{ color: "hsl(230 10% 45%)" }}>
            ← Voltar aos módulos
          </button>
        </div>
      </main>
    </div>
  );
};

export default NaipePage;
