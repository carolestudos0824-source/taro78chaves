import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, ChevronRight, Flame, Gift, Star, X, Scroll, Sparkles, HelpCircle, Eye, Layers, BookOpen as BookOpenIcon, Key } from "lucide-react";
import { useProgress } from "@/hooks/use-progress";
import { useArcanosList, useSymbolsContent } from "@/hooks/use-content";
import {
  buildDailyChallenges,
  buildCartaDoDia,
  buildPerguntasDoDia,
  buildSimboloDoDia,
  buildCombinacaoDoDia,
  buildMiniInterpretacao,
  DAILY_TOTAL_XP,
  type DailyChallengeItem,
  type CartaDoDia,
  type PerguntasDoDia,
  type SimboloDoDia,
  type CombinacaoDoDia,
  type MiniInterpretacao,
} from "@/lib/daily/builders";

const today = () => new Date().toISOString().slice(0, 10);

const DailyChallengesPage = () => {
  const navigate = useNavigate();
  const { progress, addXP, updateStreak } = useProgress();
  const { data: arcanos } = useArcanosList({ tipo: "maior" });
  const { data: symbols } = useSymbolsContent();

  const arcanosList = arcanos ?? [];
  const cartaDoDia = useMemo(() => buildCartaDoDia(arcanosList), [arcanosList]);
  const perguntasDoDia = useMemo(() => buildPerguntasDoDia(arcanosList), [arcanosList]);
  const simboloDoDia = useMemo(() => buildSimboloDoDia(symbols), [symbols]);
  const combinacaoDoDia = useMemo(() => buildCombinacaoDoDia(arcanosList), [arcanosList]);
  const miniInterpretacao = useMemo(() => buildMiniInterpretacao(arcanosList), [arcanosList]);

  const [challenges, setChallenges] = useState<DailyChallengeItem[]>(() => {
    const saved = localStorage.getItem("daily-challenges");
    const freshChallenges = buildDailyChallenges();
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.date === today()) {
          // Sync icons from buildDailyChallenges in case they changed
          return parsed.items.map((item: any) => {
            const fresh = freshChallenges.find(f => f.type === item.type);
            return fresh ? { ...item, icon: fresh.icon } : item;
          });
        }
      } catch {}
    }
    return freshChallenges;
  });

  const [activeChallenge, setActiveChallenge] = useState<DailyChallengeItem | null>(null);

  useEffect(() => {
    localStorage.setItem("daily-challenges", JSON.stringify({ date: today(), items: challenges }));
  }, [challenges]);

  const completedCount = challenges.filter(c => c.completed).length;
  const totalXPEarned = challenges.filter(c => c.completed).reduce((sum, c) => sum + c.xp, 0);
  const allDone = completedCount === challenges.length;

  const completeChallenge = useCallback((id: string) => {
    setChallenges(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, completed: true } : c);
      const challenge = prev.find(c => c.id === id);
      if (challenge && !challenge.completed) {
        addXP(challenge.xp);
        updateStreak();
      }
      return updated;
    });
    setActiveChallenge(null);
  }, [addXP, updateStreak]);

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-foreground pb-bottom-nav">
      {/* Active challenge modal */}
      {activeChallenge && (
        <ChallengeModal
          challenge={activeChallenge}
          data={{
            carta: cartaDoDia,
            perguntas: perguntasDoDia,
            simbolo: simboloDoDia,
            combinacao: combinacaoDoDia,
            interpretacao: miniInterpretacao,
          }}
          onComplete={() => completeChallenge(activeChallenge.id)}
          onClose={() => setActiveChallenge(null)}
        />
      )}

      {/* Header */}
      <div className="relative overflow-hidden bg-[#FAF5EF] border-b border-[#C8A66A]/10">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 0%, #C8A66A1A 0%, transparent 70%)",
        }} />
        <div className="relative max-w-lg mx-auto px-6 pt-10 pb-8">
          <button
            onClick={() => navigate("/app")}
            className="flex items-center gap-2 hover:opacity-70 transition-all mb-8 group"
            style={{ color: "#5B1F3D" }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-heading font-black tracking-[0.2em] uppercase">Voltar</span>
          </button>

          <div className="text-center">
            <div className="flex flex-col items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#5B1F3D] flex items-center justify-center border border-[#C8A66A]/30 shadow-lg group-hover:scale-110 transition-transform">
                <Key className="w-6 h-6 text-[#C8A66A]" />
              </div>
              <div className="text-[10px] tracking-[0.4em] uppercase font-heading font-black" style={{ color: "#5B1F3D" }}>
                Tarô 78 Chaves
              </div>
            </div>
            
            <h1 className="font-heading text-4xl font-black tracking-tight mb-3" style={{ color: "#5B1F3D" }}>
              Ritual Diário
            </h1>
            
            <div className="flex flex-col gap-1 items-center">
              <p className="font-body text-[13px] font-bold uppercase tracking-widest opacity-60" style={{ color: "#5B1F3D" }}>
                Sua travessia de hoje
              </p>
              <div className="h-0.5 w-12 bg-[#C8A66A]/30 my-2 rounded-full" />
              <p className="font-body text-[12px] font-bold italic" style={{ color: "#C8A66A" }}>
                Complete seu ritual e mantenha as chaves vivas.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 pb-32 space-y-8 mt-10">

        {/* Progress summary — Matching Matrices Visual /app */}
        <div className="bg-white border-2 border-[#C8A66A]/20 rounded-3xl p-6 shadow-md animate-fade-in">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#5B1F3D] flex items-center justify-center border border-[#C8A66A]/30">
                <Flame className={`w-5 h-5 text-[#C8A66A] ${allDone ? "animate-pulse" : ""}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-heading font-black tracking-[0.2em] text-[#5B1F3D] uppercase">
                  {allDone ? "Ritual Cumprido" : "Seu Progresso"}
                </span>
                <span className="text-sm font-heading font-black text-[#5B1F3D]">
                  {allDone ? "Portal de Hoje Aberto!" : `${completedCount} de ${challenges.length} Desafios`}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EF] border border-[#C8A66A]/20">
                <Star className="w-3.5 h-3.5 text-[#C8A66A]" />
                <span className="text-[11px] font-heading font-black text-[#5B1F3D]">
                  {totalXPEarned} XP
                </span>
              </div>
            </div>
          </div>
          
          <div className="h-3 rounded-full bg-[#E8DED3] overflow-hidden p-[1.5px] border border-[#D1C4B5]/30">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#5B1F3D] to-[#C8A66A] transition-all duration-1000 ease-out relative overflow-hidden"
              style={{ width: `${Math.max((completedCount / challenges.length) * 100, 2)}%` }}
            >
              <div className="absolute inset-0 w-1/3 h-full bg-white/20 skew-x-[-20deg] animate-pulse" style={{ left: '10%' }} />
            </div>
          </div>
          
          <p className="mt-4 text-[11px] font-body font-bold text-[#5B1F3D]/60 italic text-center">
            {allDone 
              ? "Você concluiu todos os portais do dia. Sua jornada está fortalecida." 
              : "Cada desafio concluído revela uma nova camada de sabedoria."}
          </p>
        </div>

        {/* Challenge list */}
        <div>
          <div className="flex items-center gap-4 mb-6">
            <span className="h-px flex-1 bg-[#C8A66A]/20" />
            <h2 className="font-heading text-[11px] tracking-[0.3em] uppercase font-black text-[#5B1F3D]">
              Desafios Ativos
            </h2>
            <span className="h-px flex-1 bg-[#C8A66A]/20" />
          </div>

          <div className="space-y-4">
            {challenges.map((ch) => {
              const IconComponent = (() => {
                switch (ch.icon) {
                  case "scroll": return Scroll;
                  case "sparkles": return Sparkles;
                  case "help-circle": return HelpCircle;
                  case "eye": return Eye;
                  case "layers": return Layers;
                  case "book-open": return BookOpenIcon;
                  default: return Star;
                }
              })();

              return (
                <button
                  key={ch.id}
                  onClick={() => !ch.completed && setActiveChallenge(ch)}
                  disabled={ch.completed}
                  className="w-full text-left group transition-all duration-300"
                >
                  <div 
                    className={`rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 border-2 ${
                      ch.completed 
                        ? "bg-white/40 border-[#DCCFC2] opacity-60" 
                        : "bg-white border-[#C8A66A]/20 hover:border-[#C8A66A]/40 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    }`}
                  >
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                      ch.completed 
                        ? "bg-[#DCCFC233] border-[#DCCFC2]" 
                        : "bg-[#FAF5EF] border-[#C8A66A]/20 group-hover:bg-[#5B1F3D] group-hover:border-[#5B1F3D]"
                    }`}>
                      {ch.completed ? (
                        <Check className="w-5 h-5 text-[#C8A66A]" />
                      ) : (
                        <IconComponent className="w-6 h-6 text-[#5B1F3D] group-hover:text-white transition-colors" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className={`font-heading text-[15px] font-black tracking-tight ${
                        ch.completed ? "text-[#5B1F3D]/40 line-through" : "text-[#5B1F3D]"
                      }`}>
                        {ch.title}
                      </h3>
                      <p className={`font-body text-[12px] font-bold mt-0.5 leading-snug ${
                        ch.completed ? "text-[#5B1F3D]/30" : "text-[#5B1F3D]/70"
                      }`}>
                        {ch.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className={`px-2.5 py-1 rounded-full text-[10px] font-heading font-black tracking-tighter border ${
                        ch.completed 
                          ? "bg-[#DCCFC2]/20 border-[#DCCFC2] text-[#C8A66A]/50" 
                          : "bg-[#C8A66A]/10 border-[#C8A66A]/20 text-[#C8A66A]"
                      }`}>
                        +{ch.xp} XP
                      </div>
                      {!ch.completed && (
                        <ChevronRight className="w-4 h-4 text-[#C8A66A] group-hover:translate-x-1 transition-transform" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Streak encouragement */}
        {allDone && (
          <div className="text-center py-6">
            <div className="text-3xl mb-3">✦</div>
            <h3 className="font-heading text-base tracking-wide mb-1" style={{ color: "hsl(340 42% 22%)" }}>
              Ritual do dia completo
            </h3>
            <p className="font-body text-sm" style={{ color: "hsl(230 15% 30% / 0.50)" }}>
              Volte amanhã para um novo conjunto de desafios.
            </p>
            <p className="font-accent text-xs italic mt-2" style={{ color: "hsl(36 45% 58% / 0.60)" }}>
              Sequência: {progress.streak} {progress.streak === 1 ? "dia" : "dias"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Challenge Modal ───

interface DailyData {
  carta: CartaDoDia | null;
  perguntas: PerguntasDoDia;
  simbolo: SimboloDoDia | null;
  combinacao: CombinacaoDoDia | null;
  interpretacao: MiniInterpretacao | null;
}

interface ModalProps {
  challenge: DailyChallengeItem;
  data: DailyData;
  onComplete: () => void;
  onClose: () => void;
}

const ChallengeModal = ({ challenge, data, onComplete, onClose }: ModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{
      background: "hsl(230 25% 10% / 0.50)",
      backdropFilter: "blur(8px)",
    }}>
      <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl" style={{
        background: "hsl(36 33% 97%)",
        boxShadow: "0 -8px 40px hsl(230 25% 10% / 0.15)",
      }}>
        {/* Modal header */}
        <div className="sticky top-0 flex items-center justify-between p-4 border-b" style={{
          borderColor: "hsl(36 25% 82% / 0.50)",
          background: "hsl(36 33% 97%)",
        }}>
          <div className="flex items-center gap-2">
            <span className="text-lg">{challenge.icon}</span>
            <h2 className="font-heading text-base tracking-wide" style={{ color: "hsl(340 42% 22%)" }}>
              {challenge.title}
            </h2>
          </div>
          <button onClick={onClose} className="p-1">
            <X className="w-5 h-5" style={{ color: "hsl(230 15% 30% / 0.40)" }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {challenge.type === "carta-do-dia" && <CartaDoDiaContent data={data.carta} onComplete={onComplete} />}
          {challenge.type === "revisao-rapida" && <RevisaoRapidaContent data={data.carta} onComplete={onComplete} />}
          {challenge.type === "perguntas-do-dia" && <PerguntasContent data={data.perguntas} onComplete={onComplete} />}
          {challenge.type === "simbolo-do-dia" && <SimboloContent data={data.simbolo} onComplete={onComplete} />}
          {challenge.type === "combinacao-do-dia" && <CombinacaoContent data={data.combinacao} onComplete={onComplete} />}
          {challenge.type === "mini-interpretacao" && <InterpretacaoContent data={data.interpretacao} onComplete={onComplete} />}
        </div>
      </div>
    </div>
  );
};

// ─── Individual challenge contents ───

const CompleteButton = ({ onComplete, label = "Concluir" }: { onComplete: () => void; label?: string }) => (
  <button
    onClick={onComplete}
    className="w-full mt-6 py-3 rounded-lg font-heading text-sm tracking-wide transition-all duration-300 hover:shadow-md"
    style={{
      background: "linear-gradient(135deg, hsl(340 42% 26%), hsl(36 42% 44%))",
      color: "hsl(36 33% 97%)",
    }}
  >
    {label}
  </button>
);

const CartaDoDiaContent = ({ data, onComplete }: { data: CartaDoDia | null; onComplete: () => void }) => {
  if (!data) return <div className="text-center py-8"><p className="font-body text-sm" style={{ color: "hsl(230 15% 30% / 0.50)" }}>Conteúdo carregando...</p><CompleteButton onComplete={onComplete} /></div>;
  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="font-heading text-3xl tracking-wider mb-1" style={{ color: "hsl(340 42% 22%)" }}>
          {data.numeral}
        </div>
        <h3 className="font-heading text-lg tracking-wide" style={{ color: "hsl(340 42% 22%)" }}>
          {data.name}
        </h3>
        <p className="font-accent text-sm italic" style={{ color: "hsl(230 20% 15% / 0.50)" }}>
          {data.subtitle}
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {data.keywords.map(k => (
          <span key={k} className="text-[10px] tracking-[0.2em] uppercase font-body px-2.5 py-1 rounded-full" style={{
            background: "hsl(36 45% 58% / 0.10)",
            color: "hsl(36 42% 38%)",
            border: "1px solid hsl(36 45% 58% / 0.20)",
          }}>
            {k}
          </span>
        ))}
      </div>
      <p className="font-body text-sm leading-relaxed" style={{ color: "hsl(230 15% 20% / 0.70)" }}>
        {data.essence}
      </p>
      <div className="rounded-lg p-4" style={{
        background: "hsl(340 42% 30% / 0.05)",
        border: "1px solid hsl(340 42% 30% / 0.12)",
      }}>
        <p className="font-accent text-sm italic" style={{ color: "hsl(340 42% 28%)" }}>
          ✦ {data.reflection}
        </p>
      </div>
      <CompleteButton onComplete={onComplete} label="Contemplei ✦" />
    </div>
  );
};

const RevisaoRapidaContent = ({ data, onComplete }: { data: CartaDoDia | null; onComplete: () => void }) => {
  const [revealed, setRevealed] = useState(false);
  if (!data) return <div className="text-center py-8"><p className="font-body text-sm" style={{ color: "hsl(230 15% 30% / 0.50)" }}>Conteúdo carregando...</p><CompleteButton onComplete={onComplete} /></div>;
  return (
    <div className="space-y-4 text-center">
      <p className="font-body text-sm" style={{ color: "hsl(230 15% 30% / 0.50)" }}>
        O que você lembra sobre...
      </p>
      <h3 className="font-heading text-xl tracking-wide" style={{ color: "hsl(340 42% 22%)" }}>
        {data.name}
      </h3>
      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="px-6 py-2.5 rounded-lg font-body text-sm transition-all"
          style={{
            background: "hsl(36 45% 58% / 0.10)",
            border: "1px solid hsl(36 45% 58% / 0.25)",
            color: "hsl(36 42% 38%)",
          }}
        >
          Revelar essência
        </button>
      ) : (
        <div className="text-left space-y-3">
          <p className="font-body text-sm leading-relaxed" style={{ color: "hsl(230 15% 20% / 0.70)" }}>
            {data.essence}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.keywords.map(k => (
              <span key={k} className="text-[10px] font-body px-2 py-0.5 rounded-full" style={{
                background: "hsl(36 45% 58% / 0.10)",
                color: "hsl(36 42% 38%)",
              }}>
                {k}
              </span>
            ))}
          </div>
          <CompleteButton onComplete={onComplete} label="Revisei ⚡" />
        </div>
      )}
    </div>
  );
};

const PerguntasContent = ({ data, onComplete }: { data: PerguntasDoDia; onComplete: () => void }) => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (data.questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="font-body text-sm" style={{ color: "hsl(230 15% 30% / 0.50)" }}>Nenhuma pergunta disponível hoje.</p>
        <CompleteButton onComplete={onComplete} />
      </div>
    );
  }

  if (finished) {
    return (
      <div className="text-center space-y-3">
        <div className="text-3xl">✦</div>
        <h3 className="font-heading text-lg" style={{ color: "hsl(340 42% 22%)" }}>
          {score}/{data.questions.length} acertos
        </h3>
        <p className="font-accent text-sm italic" style={{ color: "hsl(230 20% 15% / 0.50)" }}>
          {score === data.questions.length ? "Perfeito!" : "Continue praticando!"}
        </p>
        <CompleteButton onComplete={onComplete} label="Concluir ✦" />
      </div>
    );
  }

  const q = data.questions[current];

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-[10px] font-body" style={{ color: "hsl(230 15% 30% / 0.40)" }}>
        <span>Pergunta {current + 1} de {data.questions.length}</span>
        <span>{score} acerto{score !== 1 ? "s" : ""}</span>
      </div>
      <h3 className="font-heading text-sm tracking-wide" style={{ color: "hsl(340 42% 22%)" }}>
        {q.question}
      </h3>
      <div className="space-y-2">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => {
              if (selected !== null) return;
              setSelected(i);
              if (i === q.correctIndex) setScore(s => s + 1);
              setTimeout(() => {
                if (current < data.questions.length - 1) {
                  setCurrent(c => c + 1);
                  setSelected(null);
                } else {
                  setFinished(true);
                }
              }, 1500);
            }}
            className="w-full text-left rounded-lg p-3 font-body text-sm transition-all"
            style={selected === null ? {
              background: "hsl(38 28% 93% / 0.80)",
              border: "1px solid hsl(36 25% 82% / 0.50)",
              color: "hsl(230 15% 20%)",
            } : i === q.correctIndex ? {
              background: "hsl(120 35% 45% / 0.10)",
              border: "1.5px solid hsl(120 35% 45% / 0.40)",
              color: "hsl(120 35% 30%)",
            } : i === selected ? {
              background: "hsl(0 50% 50% / 0.08)",
              border: "1.5px solid hsl(0 50% 50% / 0.30)",
              color: "hsl(0 50% 35%)",
            } : {
              background: "hsl(38 28% 93% / 0.50)",
              border: "1px solid hsl(36 25% 82% / 0.30)",
              color: "hsl(230 15% 20% / 0.40)",
            }}
          >
            {opt}
          </button>
        ))}
      </div>
      {selected !== null && (
        <p className="font-accent text-xs italic" style={{ color: "hsl(230 20% 15% / 0.50)" }}>
          {q.explanation}
        </p>
      )}
    </div>
  );
};

const SimboloContent = ({ data, onComplete }: { data: SimboloDoDia | null; onComplete: () => void }) => {
  if (!data) return <div className="text-center py-8"><p className="font-body text-sm" style={{ color: "hsl(230 15% 30% / 0.50)" }}>Símbolos carregando...</p><CompleteButton onComplete={onComplete} /></div>;
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-heading text-lg tracking-wide" style={{ color: "hsl(340 42% 22%)" }}>
          {data.name}
        </h3>
      </div>
      <p className="font-body text-sm leading-relaxed" style={{ color: "hsl(230 15% 20% / 0.70)" }}>
        {data.explanation}
      </p>
      <div>
        <h4 className="text-[10px] tracking-[0.2em] uppercase font-body mb-2" style={{ color: "hsl(36 42% 40%)" }}>
          Leituras possíveis
        </h4>
        <ul className="space-y-1.5">
          {data.readings.map((r, i) => (
            <li key={i} className="font-body text-sm flex items-start gap-2" style={{ color: "hsl(230 15% 20% / 0.65)" }}>
              <span style={{ color: "hsl(36 45% 58% / 0.50)" }}>·</span> {r}
            </li>
          ))}
        </ul>
      </div>
      <div className="text-[10px] font-body" style={{ color: "hsl(230 15% 30% / 0.40)" }}>
        Aparece em: {data.cards.join(", ")}
      </div>
      <CompleteButton onComplete={onComplete} label="Aprendi ◎" />
    </div>
  );
};

const CombinacaoContent = ({ data, onComplete }: { data: CombinacaoDoDia | null; onComplete: () => void }) => {
  const [showInsight, setShowInsight] = useState(false);
  if (!data) return <div className="text-center py-8"><p className="font-body text-sm" style={{ color: "hsl(230 15% 30% / 0.50)" }}>Conteúdo carregando...</p><CompleteButton onComplete={onComplete} /></div>;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-4">
        <div className="rounded-xl p-4 text-center" style={{
          background: "hsl(36 45% 58% / 0.08)",
          border: "1px solid hsl(36 45% 58% / 0.20)",
        }}>
          <div className="font-heading text-lg" style={{ color: "hsl(340 42% 22%)" }}>{data.card1.numeral}</div>
          <div className="font-body text-xs mt-1" style={{ color: "hsl(230 15% 20% / 0.60)" }}>{data.card1.name}</div>
        </div>
        <span className="font-heading text-lg" style={{ color: "hsl(36 45% 58% / 0.40)" }}>+</span>
        <div className="rounded-xl p-4 text-center" style={{
          background: "hsl(340 42% 30% / 0.06)",
          border: "1px solid hsl(340 42% 30% / 0.15)",
        }}>
          <div className="font-heading text-lg" style={{ color: "hsl(340 42% 22%)" }}>{data.card2.numeral}</div>
          <div className="font-body text-xs mt-1" style={{ color: "hsl(230 15% 20% / 0.60)" }}>{data.card2.name}</div>
        </div>
      </div>
      <p className="font-accent text-sm italic text-center" style={{ color: "hsl(340 42% 28%)" }}>
        {data.prompt}
      </p>
      {!showInsight ? (
        <button
          onClick={() => setShowInsight(true)}
          className="w-full py-2.5 rounded-lg font-body text-sm"
          style={{ background: "hsl(36 45% 58% / 0.10)", border: "1px solid hsl(36 45% 58% / 0.25)", color: "hsl(36 42% 38%)" }}
        >
          Ver interpretação
        </button>
      ) : (
        <div className="rounded-lg p-4" style={{ background: "hsl(36 33% 95%)", border: "1px solid hsl(36 25% 82% / 0.40)" }}>
          <p className="font-body text-sm leading-relaxed" style={{ color: "hsl(230 15% 20% / 0.65)" }}>
            {data.insight}
          </p>
        </div>
      )}
      <CompleteButton onComplete={onComplete} label="Combinei 🔗" />
    </div>
  );
};

const InterpretacaoContent = ({ data, onComplete }: { data: MiniInterpretacao | null; onComplete: () => void }) => {
  const [showSample, setShowSample] = useState(false);
  if (!data) return <div className="text-center py-8"><p className="font-body text-sm" style={{ color: "hsl(230 15% 30% / 0.50)" }}>Conteúdo carregando...</p><CompleteButton onComplete={onComplete} /></div>;
  return (
    <div className="space-y-4">
      <div className="rounded-lg p-4" style={{ background: "hsl(340 42% 30% / 0.05)", border: "1px solid hsl(340 42% 30% / 0.12)" }}>
        <p className="font-accent text-sm italic" style={{ color: "hsl(340 42% 28%)" }}>
          {data.context}
        </p>
      </div>
      <div className="text-center">
        <div className="text-[9px] tracking-[0.3em] uppercase font-body mb-1" style={{ color: "hsl(36 42% 40%)" }}>
          Posição: {data.position}
        </div>
        <div className="font-heading text-lg tracking-wide" style={{ color: "hsl(340 42% 22%)" }}>
          {data.card.numeral} · {data.card.name}
        </div>
        <div className="flex flex-wrap justify-center gap-1.5 mt-2">
          {data.card.keywords.slice(0, 4).map(k => (
            <span key={k} className="text-[10px] font-body px-2 py-0.5 rounded-full" style={{
              background: "hsl(36 45% 58% / 0.10)", color: "hsl(36 42% 38%)",
            }}>
              {k}
            </span>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-[10px] tracking-[0.2em] uppercase font-body mb-2" style={{ color: "hsl(340 42% 28% / 0.60)" }}>
          Perguntas guia
        </h4>
        <ul className="space-y-2">
          {data.guidedQuestions.map((q, i) => (
            <li key={i} className="font-body text-sm" style={{ color: "hsl(230 15% 20% / 0.65)" }}>
              {i + 1}. {q}
            </li>
          ))}
        </ul>
      </div>
      {!showSample ? (
        <button
          onClick={() => setShowSample(true)}
          className="w-full py-2.5 rounded-lg font-body text-sm"
          style={{ background: "hsl(340 42% 30% / 0.08)", border: "1px solid hsl(340 42% 30% / 0.18)", color: "hsl(340 42% 28%)" }}
        >
          Ver leitura modelo
        </button>
      ) : (
        <div className="rounded-lg p-4" style={{ background: "hsl(36 33% 95%)", border: "1px solid hsl(36 25% 82% / 0.40)" }}>
          <p className="font-body text-sm leading-relaxed" style={{ color: "hsl(230 15% 20% / 0.65)" }}>
            {data.sampleReading}
          </p>
        </div>
      )}
      <CompleteButton onComplete={onComplete} label="Interpretei 📖" />
    </div>
  );
};

export default DailyChallengesPage;
