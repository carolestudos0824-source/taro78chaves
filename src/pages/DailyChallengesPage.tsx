import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, Gift, X, Scroll } from "lucide-react";
import { TarotIcon } from "@/components/TarotIcon";
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
    <div className="min-h-screen relative overflow-hidden pb-bottom-nav bg-[#FAF5EF]">
      {/* Background — Reforçado para evitar aspecto lavado e garantir profundidade */}
      <div className="fixed inset-0 z-0 mystic-bg-procedural">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #FAF5EF 0%, #FDF8F3 45%, #F2E7D9 100%)",
          }}
        />
        {/* Camadas de atmosfera ritualística reforçadas */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 50% -10%, rgba(91, 31, 61, 0.12) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(200, 166, 106, 0.08) 0%, transparent 50%, rgba(91, 31, 61, 0.05) 100%)",
          }}
        />
        {/* Adição de uma textura sutil de "grão" ou atmosfera que o /app costuma ter */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
      </div>

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

      {/* Header — Estilo Premium e Ritualístico reforçado (Sincronizado com /app) */}
      <header className="relative z-20" style={{
        borderBottom: "2.5px solid #C8A66A40",
        background: "linear-gradient(to bottom, rgba(250, 245, 239, 0.98), rgba(253, 248, 243, 0.96))",
        backdropFilter: "blur(24px)",
        boxShadow: "0 15px 50px rgba(91, 31, 61, 0.08)"
      }}>
        <div className="max-w-lg mx-auto pt-8 pb-10 px-6">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate("/app")}
              className="transition-all hover:scale-110 active:scale-95 duration-200 w-11 h-11 rounded-2xl flex items-center justify-center bg-white border-2 border-[#C8A66A30] shadow-sm hover:border-[#C8A66A]"
              style={{ color: "#5B1F3D" }}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex flex-col items-center">
              <span className="text-[9px] md:text-[10px] tracking-[0.6em] uppercase font-heading font-black" style={{ color: "#C8A66A" }}>
                ✦ Portal Sagrado ✦
              </span>
            </div>
            <div className="w-11" /> {/* Spacer para manter o alinhamento */}
          </div>

          <div className="text-center">
            <div className="text-[10px] md:text-[11px] tracking-[0.4em] uppercase font-heading font-black mb-3 opacity-70" style={{ color: "#5B1F3D" }}>
              {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-black tracking-tighter mb-4 drop-shadow-sm leading-tight" style={{ color: "#5B1F3D" }}>
              Ritual Diário
            </h1>
            <div className="flex flex-col gap-1 items-center">
              <p className="font-body text-[13px] md:text-[14px] font-black uppercase tracking-[0.3em]" style={{ color: "#C8A66A" }}>
                Sua travessia de hoje
              </p>
              <div className="h-[2px] w-20 md:w-24 bg-gradient-to-r from-transparent via-[#C8A66A] to-transparent my-6" />
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-lg mx-auto px-6 pb-32 space-y-10 mt-12">
        {/* Progress summary — Reforçado para ser Premium (Estilo /app) */}
        <div className="relative rounded-[3rem] overflow-hidden p-8 md:p-10 transition-all duration-500" style={{
          background: "linear-gradient(135deg, #FFFFFF 0%, #FDFBF7 100%)",
          backdropFilter: "blur(24px)",
          border: "2.5px solid #C8A66A",
          boxShadow: "0 35px 80px rgba(91, 31, 61, 0.1), 0 0 35px rgba(200, 166, 106, 0.12)"
        }}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-[1.6rem] flex items-center justify-center border-2 border-[#C8A66A40] shadow-xl transform -rotate-3" style={{
                background: "linear-gradient(135deg, #5B1F3D, #3D1429)",
              }}>
                <TarotIcon name="ritual" className={`w-8 h-8 text-[#C8A66A] ${allDone ? "animate-pulse" : ""}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] md:text-[11px] font-heading font-black tracking-[0.35em] text-[#C8A66A] uppercase mb-1">
                  {allDone ? "Ritual Cumprido" : "Seu Progresso"}
                </span>
                <span className="text-xl md:text-2xl font-heading font-black text-[#5B1F3D]">
                  {allDone ? "Portal Aberto!" : `${completedCount} de ${challenges.length} Portais`}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border-2 border-[#C8A66A20] shadow-sm" style={{
              background: "linear-gradient(135deg, #FAF5EF, #FFFFFF)",
            }}>
              <TarotIcon name="estrela" className="w-5 h-5" color="#C8A66A" />
              <span className="text-[14px] md:text-[16px] font-heading font-black text-[#5B1F3D]">
                {totalXPEarned} XP
              </span>
            </div>
          </div>
          
          <div className="h-5 rounded-full bg-[#E8DED3] overflow-hidden p-[3px] border-2 border-[#D1C4B5]/40 shadow-inner">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#5B1F3D] to-[#C8A66A] transition-all duration-1000 ease-out relative overflow-hidden shadow-lg"
              style={{ width: `${Math.max((completedCount / challenges.length) * 100, 3)}%` }}
            >
              <div className="absolute inset-0 w-1/3 h-full bg-white/40 skew-x-[-25deg] animate-pulse" style={{ left: '15%' }} />
            </div>
          </div>
          
          <p className="mt-8 text-[13px] md:text-[14px] font-body font-black text-[#5B1F3D]/80 italic text-center leading-relaxed max-w-[300px] mx-auto">
            {allDone 
              ? "Você concluiu todos os portais do dia. Sua jornada está fortalecida." 
              : "Cada desafio concluído revela uma nova camada de sabedoria."}
          </p>
        </div>

        {/* Challenge list */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-[#C8A66A]/20" />
            <h2 className="font-heading text-[11px] tracking-[0.4em] uppercase font-black text-[#C8A66A]">
              Desafios Sagrados
            </h2>
            <span className="h-px flex-1 bg-[#C8A66A]/20" />
          </div>

          <div className="grid gap-6">
            {challenges.map((ch) => {
              const iconName = ch.icon;

              return (
                <button
                  key={ch.id}
                  onClick={() => !ch.completed && setActiveChallenge(ch)}
                  disabled={ch.completed}
                  className="w-full text-left group transition-all duration-500"
                >
                  <div 
                    className={`rounded-[3rem] p-7 md:p-9 flex items-center gap-6 transition-all duration-500 border-2 shadow-xl ${
                      ch.completed 
                        ? "bg-[#F3E6E0]/40 border-[#DCCFC2] opacity-60" 
                        : "bg-white border-[#C8A66A]/20 hover:border-[#C8A66A]/60 hover:shadow-2xl hover:-translate-y-2 ring-1 ring-[#C8A66A]/5"
                    }`}
                  >
                    {/* Icon Container — Premium Circle (Estilo /app) */}
                    <div className={`w-18 h-18 md:w-24 md:h-24 rounded-[2rem] flex items-center justify-center shrink-0 border-2 transition-all duration-700 shadow-lg ${
                      ch.completed 
                        ? "bg-[#DCCFC233] border-[#DCCFC2] text-[#C8A66A]/50" 
                        : "bg-[#FAF5EF] border-[#C8A66A20] text-[#5B1F3D] group-hover:bg-[#5B1F3D] group-hover:border-[#5B1F3D] group-hover:text-[#FAF5EF] group-hover:shadow-[0_15px_40px_rgba(91,31,61,0.3)] group-hover:-rotate-3"
                    }`}>
                      {ch.completed ? (
                        <TarotIcon name="concluido" className="w-9 h-9 md:w-11 md:h-11" strokeWidth={4} />
                      ) : (
                        <TarotIcon name={iconName} className="w-8 h-8 md:w-10 md:h-10 transition-transform duration-500 group-hover:scale-110" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className={`font-heading text-lg md:text-2xl font-black tracking-tight mb-2 transition-colors ${
                        ch.completed ? "text-[#5B1F3D]/40 line-through" : "text-[#5B1F3D]"
                      }`}>
                        {ch.title}
                      </h3>
                      <p className={`font-body text-[14px] md:text-[16px] font-black leading-snug transition-colors ${
                        ch.completed ? "text-[#5B1F3D]/30" : "text-[#5B1F3D]/80 group-hover:text-[#5B1F3D]/90"
                      }`}>
                        {ch.subtitle}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-4 shrink-0">
                      <div className={`px-5 py-2 rounded-full text-[11px] md:text-[12px] font-heading font-black tracking-tighter border-2 shadow-sm ${
                        ch.completed 
                          ? "bg-[#DCCFC2]/20 border-[#DCCFC2] text-[#C8A66A]/50" 
                          : "bg-[#C8A66A]/10 border-[#C8A66A]/30 text-[#C8A66A] group-hover:bg-[#C8A66A] group-hover:text-white transition-all shadow-md"
                      }`}>
                        +{ch.xp} XP
                      </div>
                      {!ch.completed && (
                        <div className="w-11 h-11 rounded-full border-2 border-[#C8A66A20] flex items-center justify-center group-hover:bg-[#C8A66A10] group-hover:border-[#C8A66A] transition-all shadow-sm">
                          <ChevronRight className="w-7 h-7 text-[#C8A66A] group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
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
          <div className="text-center py-10 animate-fade-in">
            <div className="w-16 h-16 rounded-3xl flex items-center justify-center border-2 border-[#C8A66A] shadow-xl mx-auto mb-6 transform rotate-3" style={{
              background: "linear-gradient(135deg, #5B1F3D, #3D1429)",
            }}>
              <TarotIcon name="Sparkles" className="w-8 h-8 text-[#C8A66A] animate-pulse" />
            </div>
            <h3 className="font-heading text-2xl font-black tracking-tight mb-2" style={{ color: "#5B1F3D" }}>
              Ritual concluído!
            </h3>
            <p className="font-body text-[14px] font-bold text-[#5B1F3D]/60 max-w-[280px] mx-auto leading-relaxed">
              Sua conexão com o Tarô 78 Chaves está mais profunda hoje. Volte amanhã.
            </p>
            <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#C8A66A20]" style={{
              background: "rgba(250, 245, 239, 0.8)",
            }}>
              <Flame className="w-5 h-5 text-[#5B1F3D]" />
              <p className="font-heading text-[11px] font-black uppercase tracking-[0.2em] text-[#5B1F3D]">
                Sequência: {progress.streak} {progress.streak === 1 ? "dia" : "dias"}
              </p>
            </div>
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{
      background: "rgba(91, 31, 61, 0.75)",
      backdropFilter: "blur(20px)",
    }}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-[3.5rem] sm:rounded-[3.5rem] border-t-4 sm:border-4 border-[#C8A66A] shadow-[0_0_100px_rgba(91,31,61,0.5)] animate-in fade-in slide-in-from-bottom-12 duration-700" style={{
        background: "linear-gradient(180deg, #FAF5EF 0%, #F5EBDE 100%)",
      }}>
        {/* Modal header — Estilo Premium Ritualístico */}
        <div className="sticky top-0 flex items-center justify-between px-10 py-10 border-b-2 border-[#C8A66A20] z-20" style={{
          background: "rgba(250, 245, 239, 0.98)",
          backdropFilter: "blur(24px)",
        }}>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center border-2 border-[#C8A66A40] shadow-2xl rotate-3" style={{
              background: "linear-gradient(135deg, #5B1F3D, #3D1429)",
            }}>
               <Sparkles className="w-8 h-8 text-[#C8A66A] animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-heading font-black tracking-[0.35em] text-[#C8A66A] uppercase mb-1">Desafio Sagrado</span>
              <h2 className="font-heading text-2xl font-black text-[#5B1F3D] leading-tight tracking-tight">
                {challenge.title}
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-12 h-12 rounded-full bg-white border-2 border-[#C8A66A30] flex items-center justify-center hover:bg-[#FAF5EF] hover:border-[#C8A66A] transition-all shadow-md active:scale-90"
          >
            <X className="w-6 h-6 text-[#5B1F3D]" />
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
    className="w-full mt-10 py-5 rounded-[2rem] font-heading text-[12px] font-black tracking-[0.3em] uppercase shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-95 border-2 border-[#C8A66A40]"
    style={{
      background: "linear-gradient(135deg, #5B1F3D, #3D1429)",
      color: "#C8A66A",
      boxShadow: "0 15px 35px rgba(91, 31, 61, 0.3)"
    }}
  >
    {label}
  </button>
);

const CartaDoDiaContent = ({ data, onComplete }: { data: CartaDoDia | null; onComplete: () => void }) => {
  if (!data) return <div className="text-center py-8"><p className="font-body text-[13px] font-bold text-[#5B1F3D]/50">Conteúdo carregando...</p><CompleteButton onComplete={onComplete} /></div>;
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="font-heading text-4xl font-black text-[#C8A66A] tracking-widest opacity-40">
          {data.numeral}
        </div>
        <h3 className="font-heading text-2xl font-black text-[#5B1F3D]">
          {data.name}
        </h3>
        <p className="font-body text-[12px] font-bold italic text-[#C8A66A] uppercase tracking-widest">
          {data.subtitle}
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 py-2">
        {data.keywords.map(k => (
          <span key={k} className="text-[10px] tracking-[0.2em] uppercase font-body font-black px-3 py-1.5 rounded-full bg-[#C8A66A]/10 text-[#C8A66A] border border-[#C8A66A]/20">
            {k}
          </span>
        ))}
      </div>
      <p className="font-body text-[14px] leading-relaxed font-bold text-[#5B1F3D]/80 text-center px-4">
        {data.essence}
      </p>
      <div className="rounded-[2rem] p-6 bg-white border-2 border-[#C8A66A]/10 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Sparkles className="w-8 h-8 text-[#5B1F3D]" />
        </div>
        <p className="font-body text-[13px] font-bold italic text-[#5B1F3D] leading-relaxed relative z-10">
          ✦ {data.reflection}
        </p>
      </div>
      <CompleteButton onComplete={onComplete} label="Contemplei ✦" />
    </div>
  );
};

const RevisaoRapidaContent = ({ data, onComplete }: { data: CartaDoDia | null; onComplete: () => void }) => {
  const [revealed, setRevealed] = useState(false);
  if (!data) return <div className="text-center py-8"><p className="font-body text-[13px] font-bold text-[#5B1F3D]/50">Conteúdo carregando...</p><CompleteButton onComplete={onComplete} /></div>;
  return (
    <div className="space-y-6 text-center py-4">
      <p className="font-body text-[12px] font-bold uppercase tracking-widest text-[#5B1F3D]/40">
        O que você lembra sobre...
      </p>
      <h3 className="font-heading text-3xl font-black text-[#5B1F3D]">
        {data.name}
      </h3>
      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="px-10 py-4 rounded-2xl font-heading text-[12px] font-black tracking-[0.2em] uppercase transition-all bg-[#5B1F3D]/5 border-2 border-[#5B1F3D]/10 text-[#5B1F3D] hover:bg-[#5B1F3D] hover:text-white"
        >
          Revelar essência
        </button>
      ) : (
        <div className="text-left space-y-6 animate-fade-in">
          <p className="font-body text-[14px] leading-relaxed font-bold text-[#5B1F3D]/80">
            {data.essence}
          </p>
          <div className="flex flex-wrap gap-2">
            {data.keywords.map(k => (
              <span key={k} className="text-[10px] font-body font-black tracking-widest uppercase px-3 py-1.5 rounded-full bg-[#C8A66A]/10 text-[#C8A66A] border border-[#C8A66A]/10">
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
        <p className="font-body text-[13px] font-bold text-[#5B1F3D]/50">Nenhuma pergunta disponível hoje.</p>
        <CompleteButton onComplete={onComplete} />
      </div>
    );
  }

  if (finished) {
    return (
      <div className="text-center space-y-6 animate-fade-in py-6">
        <div className="w-16 h-16 rounded-2xl bg-[#5B1F3D]/5 flex items-center justify-center mx-auto border-2 border-[#C8A66A]/20">
          <Sparkles className="w-8 h-8 text-[#C8A66A]" />
        </div>
        <div className="space-y-1">
          <h3 className="font-heading text-2xl font-black text-[#5B1F3D]">
            {score}/{data.questions.length} acertos
          </h3>
          <p className="font-body text-[12px] font-bold italic text-[#C8A66A] uppercase tracking-widest">
            {score === data.questions.length ? "Sabedoria Plena!" : "A prática leva à maestria."}
          </p>
        </div>
        <CompleteButton onComplete={onComplete} label="Concluir ✦" />
      </div>
    );
  }

  const q = data.questions[current];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-heading font-black tracking-widest uppercase text-[#5B1F3D]/40">Pergunta {current + 1} de {data.questions.length}</span>
        <div className="px-3 py-1 rounded-full bg-[#5B1F3D]/5 border border-[#5B1F3D]/10">
          <span className="text-[10px] font-heading font-black tracking-widest uppercase text-[#5B1F3D]">{score} acerto{score !== 1 ? "s" : ""}</span>
        </div>
      </div>
      <h3 className="font-heading text-lg font-black text-[#5B1F3D] leading-tight">
        {q.question}
      </h3>
      <div className="space-y-3">
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
            className="w-full text-left rounded-2xl p-4 font-body text-[14px] font-bold transition-all duration-300 border-2"
            style={selected === null ? {
              background: "white",
              borderColor: "rgba(200, 166, 106, 0.1)",
              color: "#5B1F3D",
            } : i === q.correctIndex ? {
              background: "rgba(34, 197, 94, 0.1)",
              borderColor: "rgba(34, 197, 94, 0.4)",
              color: "#166534",
            } : i === selected ? {
              background: "rgba(239, 68, 68, 0.1)",
              borderColor: "rgba(239, 68, 68, 0.4)",
              color: "#991b1b",
            } : {
              background: "rgba(91, 31, 61, 0.02)",
              borderColor: "rgba(91, 31, 61, 0.05)",
              color: "rgba(91, 31, 61, 0.4)",
            }}
          >
            {opt}
          </button>
        ))}
      </div>
      {selected !== null && (
        <div className="p-4 rounded-xl bg-[#5B1F3D]/5 border border-[#5B1F3D]/10 animate-fade-in">
          <p className="font-body text-[12px] font-bold italic text-[#5B1F3D]/70 leading-relaxed">
            {q.explanation}
          </p>
        </div>
      )}
    </div>
  );
};

const SimboloContent = ({ data, onComplete }: { data: SimboloDoDia | null; onComplete: () => void }) => {
  if (!data) return <div className="text-center py-8"><p className="font-body text-[13px] font-bold text-[#5B1F3D]/50">Símbolos carregando...</p><CompleteButton onComplete={onComplete} /></div>;
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="font-heading text-2xl font-black text-[#5B1F3D]">
          {data.name}
        </h3>
      </div>
      <p className="font-body text-[14px] leading-relaxed font-bold text-[#5B1F3D]/80">
        {data.explanation}
      </p>
      <div className="space-y-4">
        <h4 className="text-[10px] tracking-[0.3em] uppercase font-heading font-black text-[#C8A66A]">
          Leituras possíveis
        </h4>
        <ul className="space-y-3">
          {data.readings.map((r, i) => (
            <li key={i} className="font-body text-[13px] font-bold flex items-start gap-3 p-3 rounded-xl bg-white border border-[#C8A66A]/10" style={{ color: "#5B1F3D" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8A66A] mt-1.5 shrink-0" /> {r}
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 rounded-xl bg-[#5B1F3D]/5 border border-[#5B1F3D]/10">
        <p className="text-[10px] font-heading font-black tracking-widest uppercase text-[#5B1F3D]/40">
           Aparece em: <span className="text-[#5B1F3D]/60">{data.cards.join(", ")}</span>
        </p>
      </div>
      <CompleteButton onComplete={onComplete} label="Aprendi ◎" />
    </div>
  );
};

const CombinacaoContent = ({ data, onComplete }: { data: CombinacaoDoDia | null; onComplete: () => void }) => {
  const [showInsight, setShowInsight] = useState(false);
  if (!data) return <div className="text-center py-8"><p className="font-body text-[13px] font-bold text-[#5B1F3D]/50">Conteúdo carregando...</p><CompleteButton onComplete={onComplete} /></div>;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-4">
        <div className="rounded-[2rem] p-6 text-center w-full bg-white border-2 border-[#C8A66A]/20 shadow-sm">
          <div className="font-heading text-2xl font-black text-[#C8A66A]">{data.card1.numeral}</div>
          <div className="font-body text-[10px] font-black uppercase tracking-widest mt-2 text-[#5B1F3D]/60">{data.card1.name}</div>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#FAF5EF] border border-[#C8A66A]/30 flex items-center justify-center shrink-0">
          <span className="font-heading text-lg font-black text-[#C8A66A]">✦</span>
        </div>
        <div className="rounded-[2rem] p-6 text-center w-full bg-[#5B1F3D] border-2 border-[#C8A66A]/30 shadow-sm">
          <div className="font-heading text-2xl font-black text-[#C8A66A]">{data.card2.numeral}</div>
          <div className="font-body text-[10px] font-black uppercase tracking-widest mt-2 text-white/60">{data.card2.name}</div>
        </div>
      </div>
      <div className="text-center space-y-2">
         <p className="font-body text-[14px] font-bold italic text-[#5B1F3D] leading-relaxed">
          "{data.prompt}"
        </p>
      </div>
      {!showInsight ? (
        <button
          onClick={() => setShowInsight(true)}
          className="w-full py-4 rounded-2xl font-heading text-[12px] font-black tracking-[0.2em] uppercase transition-all bg-[#5B1F3D]/5 border-2 border-[#5B1F3D]/10 text-[#5B1F3D] hover:bg-[#5B1F3D] hover:text-white"
        >
          Revelar Alquimia
        </button>
      ) : (
        <div className="rounded-[2rem] p-6 bg-white border-2 border-[#C8A66A]/10 shadow-sm animate-fade-in">
          <p className="font-body text-[14px] leading-relaxed font-bold text-[#5B1F3D]/80">
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
  if (!data) return <div className="text-center py-8"><p className="font-body text-[13px] font-bold text-[#5B1F3D]/50">Conteúdo carregando...</p><CompleteButton onComplete={onComplete} /></div>;
  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-5 bg-[#5B1F3D]/5 border-2 border-[#5B1F3D]/10">
        <p className="font-body text-[13px] font-bold italic text-[#5B1F3D] leading-relaxed">
          ✦ {data.context}
        </p>
      </div>
      <div className="text-center space-y-3">
        <div className="text-[10px] tracking-[0.3em] uppercase font-heading font-black text-[#C8A66A]">
          Posição: {data.position}
        </div>
        <div className="font-heading text-2xl font-black text-[#5B1F3D]">
          {data.card.numeral} · {data.card.name}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {data.card.keywords.slice(0, 4).map(k => (
            <span key={k} className="text-[10px] font-body font-black tracking-widest uppercase px-2.5 py-1.5 rounded-full bg-[#C8A66A]/10 text-[#C8A66A]">
              {k}
            </span>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <h4 className="text-[10px] tracking-[0.3em] uppercase font-heading font-black text-[#C8A66A]">
          Perguntas Guia
        </h4>
        <ul className="space-y-3">
          {data.guidedQuestions.map((q, i) => (
            <li key={i} className="font-body text-[13px] font-bold flex items-start gap-3 p-3 rounded-xl bg-white border border-[#C8A66A]/10 text-[#5B1F3D]">
              <span className="w-5 h-5 rounded-full bg-[#5B1F3D]/5 flex items-center justify-center text-[10px] shrink-0 border border-[#5B1F3D]/10">{i + 1}</span> {q}
            </li>
          ))}
        </ul>
      </div>
      {!showSample ? (
        <button
          onClick={() => setShowSample(true)}
          className="w-full py-4 rounded-2xl font-heading text-[12px] font-black tracking-[0.2em] uppercase transition-all bg-[#5B1F3D]/5 border-2 border-[#5B1F3D]/10 text-[#5B1F3D] hover:bg-[#5B1F3D] hover:text-white"
        >
          Ver leitura modelo
        </button>
      ) : (
        <div className="rounded-[2rem] p-6 bg-white border-2 border-[#C8A66A]/10 shadow-sm animate-fade-in">
          <p className="font-body text-[14px] leading-relaxed font-bold text-[#5B1F3D]/80">
            {data.sampleReading}
          </p>
        </div>
      )}
      <CompleteButton onComplete={onComplete} label="Interpretei 📖" />
    </div>
  );
};

export default DailyChallengesPage;
