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
    <div className="min-h-screen relative overflow-hidden pb-bottom-nav">
      {/* Background — Marfim Suave #FAF5EF base refined from /app */}
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

      {/* Header — Premium Style from /app */}
      <header className="relative z-10" style={{
        borderBottom: "1.5px solid #C8A66A40",
        background: "rgba(250, 245, 239, 0.95)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 4px 20px rgba(91, 31, 61, 0.05)"
      }}>
        <div className="max-w-lg mx-auto py-6 px-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate("/app")}
              className="transition-all hover:scale-110 duration-200 w-10 h-10 rounded-full flex items-center justify-center bg-[#FAF5EF] border border-[#C8A66A30]"
              style={{ color: "#5B1F3D" }}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-[11px] tracking-[0.45em] uppercase font-heading font-black" style={{ color: "#5B1F3D" }}>
              <span style={{ color: "#C8A66A" }}>✦</span> Ritual Sagrado <span style={{ color: "#C8A66A" }}>✦</span>
            </span>
          </div>

          <div className="text-center pt-2 pb-2">
            <div className="text-[11px] tracking-[0.4em] uppercase font-heading font-black mb-4" style={{ color: "#C8A66A" }}>
              {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
            </div>
            <h1 className="font-heading text-5xl font-black tracking-tight mb-4" style={{ color: "#5B1F3D" }}>
              Ritual Diário
            </h1>
            <div className="flex flex-col gap-1 items-center">
              <p className="font-body text-[14px] font-bold uppercase tracking-[0.2em]" style={{ color: "#5B1F3D99" }}>
                Sua travessia de hoje
              </p>
              <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-[#C8A66A] to-transparent my-4 opacity-40" />
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-lg mx-auto px-6 pb-32 space-y-10 mt-12">
        {/* Progress summary — Matching Matrices Visual /app */}
        <div className="relative rounded-[2.5rem] overflow-hidden p-8 transition-all duration-500" style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 245, 239, 0.92) 100%)",
          backdropFilter: "blur(24px)",
          border: "2.5px solid #C8A66A",
          boxShadow: "0 30px 70px rgba(91, 31, 61, 0.08), 0 0 40px rgba(200, 166, 106, 0.1)"
        }}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-[#C8A66A30]" style={{
                background: "linear-gradient(135deg, #5B1F3D, #3D1429)",
                boxShadow: "0 10px 20px rgba(91, 31, 61, 0.2)"
              }}>
                <Flame className={`w-6 h-6 text-[#C8A66A] ${allDone ? "animate-pulse" : ""}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-heading font-black tracking-[0.25em] text-[#C8A66A] uppercase">
                  {allDone ? "Ritual Cumprido" : "Seu Progresso"}
                </span>
                <span className="text-lg font-heading font-black text-[#5B1F3D]">
                  {allDone ? "Portal de Hoje Aberto!" : `${completedCount} de ${challenges.length} Desafios`}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#C8A66A20]" style={{
              background: "rgba(250, 245, 239, 0.8)",
            }}>
              <Star className="w-4 h-4 text-[#C8A66A]" />
              <span className="text-[12px] font-heading font-black text-[#5B1F3D]">
                {totalXPEarned} XP
              </span>
            </div>
          </div>
          
          <div className="h-3.5 rounded-full bg-[#E8DED3] overflow-hidden p-[1.5px] border border-[#D1C4B5]/30">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#5B1F3D] to-[#C8A66A] transition-all duration-1000 ease-out relative overflow-hidden"
              style={{ width: `${Math.max((completedCount / challenges.length) * 100, 2)}%` }}
            >
              <div className="absolute inset-0 w-1/3 h-full bg-white/20 skew-x-[-20deg] animate-pulse" style={{ left: '10%' }} />
            </div>
          </div>
          
          <p className="mt-6 text-[12px] font-body font-bold text-[#5B1F3D]/60 italic text-center leading-relaxed">
            {allDone 
              ? "Você concluiu todos os portais do dia. Sua jornada está fortalecida." 
              : "Cada desafio concluído revela uma nova camada de sabedoria."}
          </p>
        </div>

        {/* Challenge list */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
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
                  className="w-full text-left group transition-all duration-500"
                >
                  <div 
                    className={`rounded-[2rem] p-6 flex items-center gap-5 transition-all duration-500 border-2 ${
                      ch.completed 
                        ? "bg-white/40 border-[#DCCFC2] opacity-60" 
                        : "bg-white border-[#C8A66A]/30 hover:border-[#C8A66A] shadow-lg hover:shadow-2xl hover:-translate-y-1"
                    }`}
                  >
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-all duration-500 ${
                      ch.completed 
                        ? "bg-[#DCCFC233] border-[#DCCFC2]" 
                        : "bg-[#FAF5EF] border-[#C8A66A30] group-hover:bg-[#5B1F3D] group-hover:border-[#5B1F3D] group-hover:shadow-[0_8px_20px_rgba(91,31,61,0.3)]"
                    }`}>
                      {ch.completed ? (
                        <Check className="w-6 h-6 text-[#C8A66A]" />
                      ) : (
                        <IconComponent className="w-6 h-6 text-[#5B1F3D] group-hover:text-white transition-colors duration-500" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className={`font-heading text-[17px] font-black tracking-tight ${
                        ch.completed ? "text-[#5B1F3D]/40 line-through" : "text-[#5B1F3D]"
                      }`}>
                        {ch.title}
                      </h3>
                      <p className={`font-body text-[13px] font-black mt-1 leading-snug ${
                        ch.completed ? "text-[#5B1F3D]/30" : "text-[#5B1F3D]/70"
                      }`}>
                        {ch.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className={`px-3 py-1 rounded-full text-[10px] font-heading font-black tracking-tighter border-2 ${
                        ch.completed 
                          ? "bg-[#DCCFC2]/20 border-[#DCCFC2] text-[#C8A66A]/50" 
                          : "bg-[#C8A66A]/10 border-[#C8A66A]/20 text-[#C8A66A]"
                      }`}>
                        +{ch.xp} XP
                      </div>
                      {!ch.completed && (
                        <div className="w-8 h-8 rounded-full border border-[#C8A66A30] flex items-center justify-center group-hover:bg-[#C8A66A10] transition-colors">
                          <ChevronRight className="w-5 h-5 text-[#C8A66A] group-hover:translate-x-1 transition-transform duration-300" />
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5B1F3D] to-[#C8A66A] flex items-center justify-center border-2 border-white shadow-xl mx-auto mb-6 transform rotate-3">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h3 className="font-heading text-xl font-black tracking-tight mb-2" style={{ color: "#5B1F3D" }}>
              Ritual concluído!
            </h3>
            <p className="font-body text-[13px] font-bold text-[#5B1F3D]/60 max-w-[240px] mx-auto leading-relaxed">
              Sua conexão com o Tarô 78 Chaves está mais profunda hoje. Volte amanhã.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5B1F3D]/5 border border-[#5B1F3D]/10">
              <Flame className="w-4 h-4 text-[#5B1F3D]" />
              <p className="font-heading text-[10px] font-black uppercase tracking-widest text-[#5B1F3D]">
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
      background: "rgba(91, 31, 61, 0.6)",
      backdropFilter: "blur(16px)",
    }}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-[3rem] sm:rounded-[3rem] border-t-2 sm:border-2 border-[#C8A66A]/40 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500" style={{
        background: "linear-gradient(180deg, #FAF5EF 0%, #F5EBDE 100%)",
      }}>
        {/* Modal header */}
        <div className="sticky top-0 flex items-center justify-between px-8 py-8 border-b border-[#C8A66A]/20 z-10" style={{
          background: "rgba(250, 245, 239, 0.95)",
          backdropFilter: "blur(20px)",
        }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-[#C8A66A]/30" style={{
              background: "linear-gradient(135deg, #5B1F3D, #3D1429)",
              boxShadow: "0 10px 20px rgba(91, 31, 61, 0.2)"
            }}>
               <Sparkles className="w-6 h-6 text-[#C8A66A]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-heading font-black tracking-[0.2em] text-[#C8A66A] uppercase">Desafio</span>
              <h2 className="font-heading text-lg font-black text-[#5B1F3D] leading-tight">
                {challenge.title}
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-full bg-white border border-[#C8A66A]/20 flex items-center justify-center hover:bg-[#FAF5EF] transition-colors"
          >
            <X className="w-5 h-5 text-[#5B1F3D]" />
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
    className="w-full mt-10 py-4 rounded-2xl font-heading text-[12px] font-black tracking-[0.3em] uppercase shadow-lg shadow-[#5B1F3D]/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    style={{
      background: "linear-gradient(135deg, #5B1F3D, #C8A66A)",
      color: "#FAF5EF",
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
