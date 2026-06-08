import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, Gift, X, Scroll } from "lucide-react";


import { TarotIcon } from "@/components/TarotIcon";
import { useProgress } from "@/hooks/use-progress";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useArcanosList, useSymbolsContent } from "@/hooks/use-content";
import {
  buildDailyChallenges,
  buildCartaDoDia,
  buildPerguntasDoDia,
  buildSimboloDoDia,
  buildCombinacaoDoDia,
  buildMiniInterpretacao,
  type DailyChallengeItem,
  type CartaDoDia,
  type PerguntasDoDia,
  type SimboloDoDia,
  type CombinacaoDoDia,
  type MiniInterpretacao,
} from "@/lib/daily/builders";

const todayStr = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const DailyChallengesPage = () => {



  const navigate = useNavigate();
  const { user } = useAuth();
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
        if (parsed.date === todayStr()) {
          console.log("[Ritual] Loading saved challenges from localStorage:", parsed.items.filter((i: any) => i.completed).length, "completed");
          return parsed.items.map((item: any) => {
            const fresh = freshChallenges.find(f => f.type === item.type);
            return fresh ? { ...item, icon: fresh.icon } : item;
          });
        }
      } catch {}
    }
    console.log("[Ritual] No valid saved state, using fresh challenges");
    return freshChallenges;
  });

  const [activeChallenge, setActiveChallenge] = useState<DailyChallengeItem | null>(null);

  useEffect(() => {
    localStorage.setItem("daily-challenges", JSON.stringify({ date: todayStr(), items: challenges }));
  }, [challenges]);

  useEffect(() => {
    if (!user) return;

    const fetchCompletions = async () => {
      const { data, error } = await supabase
        .from("daily_challenge_completions")
        .select("challenge_id")
        .eq("user_id", user.id)
        .eq("challenge_date", todayStr());

      if (error) {
        console.error("[Ritual] Error fetching completions:", error);
        return;
      }

      if (data && data.length > 0) {
        const completedIds = data.map(c => c.challenge_id);
        console.log("[Ritual] Found completions in Supabase:", completedIds);
        setChallenges(prev => prev.map(ch => 
          completedIds.includes(ch.id) ? { ...ch, completed: true } : ch
        ));
      } else {
        console.log("[Ritual] No completions found in Supabase for today");
      }
    };

    fetchCompletions();
  }, [user]);

  const completedCount = challenges.filter(c => c.completed).length;
  const allDone = completedCount === challenges.length;

  const completeChallenge = useCallback(async (id: string) => {
    console.log("[Ritual] completeChallenge called with ID:", id);
    const challenge = challenges.find(c => c.id === id);
    if (!challenge || challenge.completed) {
      console.log("[Ritual] Challenge already completed or not found:", id);
      return;
    }
    
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, completed: true } : c));
    setActiveChallenge(null);

    addXP(challenge.xp);
    updateStreak();

    if (user) {
      const payload = {
        user_id: user.id,
        challenge_id: id,
        challenge_date: todayStr(),
        xp_earned: challenge.xp
      };
      
      console.log("[Ritual] Saving to Supabase:", payload);
      
      const { error } = await supabase
        .from("daily_challenge_completions")
        .insert(payload);

      if (error) {
        console.error("[Ritual] Supabase INSERT error:", error);
        toast.error("Erro ao salvar progresso. Verifique sua conexão.");
      } else {
        console.log("[Ritual] Supabase INSERT success");
        toast.success("Portal selado com sucesso!");
      }
    }
  }, [challenges, user, addXP, updateStreak]);

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[#FAF5EF]">
      <div className="fixed inset-0 z-0 mystic-bg-procedural">

        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #FAF5EF 0%, #FDF8F3 45%, #F2E7D9 100%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% -10%, rgba(91, 31, 61, 0.12) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
      </div>

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
          onComplete={() => {
            console.log("[Ritual] Modal onComplete triggered for:", activeChallenge.id);
            completeChallenge(activeChallenge.id);
          }}
          onClose={() => {
            console.log("[Ritual] Modal onClose triggered");
            setActiveChallenge(null);
          }}
        />
      )}

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
              <span className="text-[9px] md:text-[10px] tracking-[0.6em] uppercase font-heading font-black" style={{ color: "#C8A66A" }}>✦ Portal Sagrado ✦</span>
            </div>
            <div className="w-11" />
          </div>

          <div className="text-center">
            <div className="text-[10px] md:text-[11px] tracking-[0.4em] uppercase font-heading font-black mb-3 opacity-70" style={{ color: "#5B1F3D" }}>
              {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-black tracking-tighter mb-4 drop-shadow-sm leading-tight" style={{ color: "#5B1F3D" }}>
              Leitura de Conexão Diária
            </h1>
            <div className="flex flex-col gap-1 items-center">
              <p className="font-body text-[13px] md:text-[14px] font-black uppercase tracking-[0.3em] text-[#C8A66A]">
                Um encontro breve com o Tarô para orientar sua jornada
              </p>
              <div className="h-[2px] w-20 md:w-24 bg-gradient-to-r from-transparent via-[#C8A66A] to-transparent my-6" />
              <p className="font-body text-[14px] font-medium text-[#5B1F3D]/70 italic max-w-sm mx-auto">
                "O Tarô não entrega respostas prontas. Ele revela caminhos para a sua consciência."
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-lg mx-auto px-6 pb-[calc(140px+env(safe-area-inset-bottom))] space-y-10 mt-12 overflow-x-hidden">



        <div className="relative rounded-[3rem] overflow-hidden p-8 md:p-10 transition-all duration-500" style={{
          background: "linear-gradient(135deg, #FFFFFF 0%, #FAF5EF 100%)",
          backdropFilter: "blur(24px)",
          border: "2.5px solid #C8A66A",
          boxShadow: "0 35px 80px rgba(91, 31, 61, 0.1), 0 0 35px rgba(200, 166, 106, 0.12)"
        }}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-[1.6rem] flex items-center justify-center border-2 border-[#C8A66A40] shadow-xl transform -rotate-3" style={{ background: "linear-gradient(135deg, #5B1F3D, #3D1429)" }}>
                <TarotIcon name="ritual" className={`w-8 h-8 text-[#C8A66A] ${allDone ? "animate-pulse" : ""}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] md:text-[11px] font-heading font-black tracking-[0.35em] text-[#C8A66A] uppercase mb-1">
                  {allDone ? "Ritual Cumprido" : "Seu Ritual"}
                </span>
                <span className="text-xl md:text-2xl font-heading font-black text-[#5B1F3D]">
                  {completedCount} de {challenges.length} Portais
                </span>
              </div>
            </div>
          </div>
          
          <div className="h-5 rounded-full bg-[#E8DED3] overflow-hidden p-[3px] border-2 border-[#D1C4B5]/40 shadow-inner">
            <div className="h-full rounded-full bg-gradient-to-r from-[#5B1F3D] to-[#C8A66A] transition-all duration-1000 ease-out relative overflow-hidden shadow-lg"
              style={{ width: `${Math.max((completedCount / challenges.length) * 100, 3)}%` }} />
          </div>
          
          <p className="mt-8 text-[13px] md:text-[14px] font-body font-black text-[#5B1F3D]/80 italic text-center leading-relaxed max-w-[300px] mx-auto">
            {allDone 
              ? "Ritual de hoje completo. Volte amanhã para uma nova conexão." 
              : "Complete os 6 portais para selar sua prática de hoje."}
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4 mb-4">
            <div className="flex items-center gap-4 w-full">
              <span className="h-px flex-1 bg-[#C8A66A]/20" />
              <h2 className="font-heading text-[11px] tracking-[0.4em] uppercase font-black text-[#C8A66A]">Portais de Sabedoria</h2>
              <span className="h-px flex-1 bg-[#C8A66A]/20" />
            </div>
            <p className="font-body text-[13px] md:text-[14px] font-black text-[#5B1F3D]/60 text-center uppercase tracking-[0.1em] px-4">
               Comece pela Carta do Dia. Ao concluir cada portal, o próximo se abre.
            </p>
          </div>

          <div className="grid gap-6">
            {challenges.map((ch, index) => {
              const iconName = ch.icon;
              const isCompleted = ch.completed;
              const isPreviousCompleted = index === 0 || challenges[index - 1].completed;
              const isAvailable = !isCompleted && isPreviousCompleted;
              const isBlocked = !isCompleted && !isPreviousCompleted;

              return (
                <button
                  key={ch.id}
                  onClick={() => {
                    console.log("[Ritual] Portal clicked:", ch.id, { isAvailable, isCompleted });
                    if (isAvailable || isCompleted) setActiveChallenge(ch);
                  }}
                  disabled={isBlocked}
                  className={`w-full text-left group transition-all duration-500 ${isBlocked ? "cursor-not-allowed" : ""}`}
                >
                  <div className={`rounded-[3rem] p-7 md:p-9 flex items-center gap-6 transition-all duration-500 border-2 shadow-xl ${
                      isCompleted ? "bg-[#FDF8F3] border-[#C8A66A40] opacity-90" : 
                      isAvailable ? "bg-white border-[#C8A66A] hover:shadow-2xl hover:-translate-y-2 ring-4 ring-[#C8A66A20]" : 
                      "bg-[#F5F5F5]/60 border-[#E5E5E5] opacity-50 grayscale"
                    }`}>


                    <div className={`w-18 h-18 md:w-24 md:h-24 rounded-[2rem] flex items-center justify-center shrink-0 border-2 transition-all duration-700 shadow-lg ${
                      isCompleted ? "bg-[#FAF5EF] border-[#C8A66A40] text-[#C8A66A]" : 
                      isAvailable ? "bg-[#FAF5EF] border-[#C8A66A] text-[#5B1F3D] group-hover:bg-[#5B1F3D] group-hover:border-[#5B1F3D] group-hover:text-[#FAF5EF] group-hover:shadow-[0_15px_40px_rgba(91,31,61,0.3)] group-hover:-rotate-3" : 
                      "bg-[#E5E5E5] border-[#D5D5D5] text-[#A5A5A5]"
                    }`}>


                      {isCompleted ? (
                        <div className="relative">
                          <TarotIcon name={iconName} className="w-8 h-8 md:w-10 md:h-10 opacity-40" />
                          <div className="absolute inset-0 flex items-center justify-center">
                             <TarotIcon name="concluido" className="w-10 h-10 md:w-12 md:h-12 text-[#C8A66A]" strokeWidth={4} />
                          </div>
                        </div>
                      ) : isBlocked ? (
                        <TarotIcon name="bloqueado" className="w-8 h-8 md:w-10 md:h-10" />
                      ) : (
                        <TarotIcon name={iconName} className="w-8 h-8 md:w-10 md:h-10 transition-transform duration-500 group-hover:scale-110" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className={`font-heading text-lg md:text-2xl font-black tracking-tight mb-2 transition-colors ${isCompleted ? "text-[#5B1F3D]/60" : isBlocked ? "text-[#5B1F3D]/40" : "text-[#5B1F3D]"}`}>
                        {ch.title}
                      </h3>
                      <p className={`font-body text-[14px] md:text-[16px] font-black leading-snug transition-colors ${isCompleted ? "text-[#5B1F3D]/40 italic" : isBlocked ? "text-[#5B1F3D]/30" : "text-[#5B1F3D]/80 group-hover:text-[#5B1F3D]/90"}`}>
                        {isBlocked ? "Libera após o portal anterior." : isCompleted ? "Portal concluído. Toque para rever." : ch.subtitle}
                      </p>

                    </div>


                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-[#C8A66A20]">
                      <div className={`px-5 py-2.5 rounded-full text-[11px] md:text-[12px] font-heading font-black tracking-widest border-2 shadow-sm ${
                        isCompleted ? "bg-emerald-50 border-emerald-200 text-emerald-600" : 
                        isAvailable ? "bg-[#C8A66A] border-[#C8A66A] text-white animate-pulse" : "bg-gray-100 border-gray-200 text-gray-400"
                      }`}>
                        {isCompleted ? "Concluído" : isAvailable ? "PRATICAR" : "Bloqueado"}
                      </div>
                      {(isAvailable || isCompleted) && (
                        <div className="w-10 h-10 rounded-full border-2 border-[#C8A66A20] flex items-center justify-center group-hover:bg-[#C8A66A10] group-hover:border-[#C8A66A] transition-all shadow-sm">
                          <ChevronRight className="w-7 h-7 text-[#C8A66A] group-hover:translate-x-1.5 transition-transform duration-300" />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <FooterInfo />
        </div>
      </div>
    </div>

  );
};

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
    <div 
      className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4 pb-bottom-nav sm:pb-4" 
      style={{ background: "rgba(91, 31, 61, 0.75)", backdropFilter: "blur(20px)" }}
    >
      <div 
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-[3.5rem] sm:rounded-[3.5rem] border-t-4 sm:border-4 border-[#C8A66A] shadow-[0_0_100px_rgba(91, 31, 61, 0.5)] animate-in fade-in slide-in-from-bottom-12 duration-700 scrollbar-hide relative z-[1001]" 
        style={{ background: "linear-gradient(180deg, #FAF5EF 0%, #F5EBDE 100%)" }}
      >
        <div className="sticky top-0 flex items-center justify-between px-10 py-10 border-b-2 border-[#C8A66A20] z-[1002]" style={{ background: "rgba(250, 245, 239, 0.98)", backdropFilter: "blur(24px)" }}>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center border-2 border-[#C8A66A40] shadow-2xl rotate-3" style={{ background: "linear-gradient(135deg, #5B1F3D, #3D1429)" }}>
               <TarotIcon name="Sparkles" className="w-8 h-8 text-[#C8A66A] animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-heading font-black tracking-[0.35em] text-[#C8A66A] uppercase mb-1">Desafio Sagrado</span>
              <h2 className="font-heading text-2xl font-black text-[#5B1F3D] leading-tight tracking-tight">{challenge.title}</h2>
            </div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }} 
            className="w-12 h-12 rounded-full bg-white border-2 border-[#C8A66A30] flex items-center justify-center hover:bg-[#FAF5EF] hover:border-[#C8A66A] transition-all shadow-md active:scale-90"
          >
            <X className="w-6 h-6 text-[#5B1F3D]" />
          </button>
        </div>
        <div className="p-6 relative z-10">
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

const CompleteButton = ({ onComplete, label = "Integrar Sabedoria" }: { onComplete: () => void; label?: string }) => {
  return (
    <button 
      onClick={(e) => {
        console.log(`[Ritual] CompleteButton clicked: ${label}`);
        onComplete();
      }} 
      className="w-full mt-10 py-5 rounded-[2rem] font-heading text-[12px] font-black tracking-[0.3em] uppercase shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-95 border-2 border-[#C8A66A40] relative z-50 pointer-events-auto" 
      style={{ background: "linear-gradient(135deg, #5B1F3D, #3D1429)", color: "#C8A66A", boxShadow: "0 15px 35px rgba(91, 31, 61, 0.3)" }}
    >
      {label}
    </button>
  );
};

const CartaDoDiaContent = ({ data, onComplete }: { data: CartaDoDia | null; onComplete: () => void }) => {
  if (!data) return <div className="text-center py-8"><p className="font-body text-[13px] font-bold text-[#5B1F3D]/50">Conteúdo carregando...</p><CompleteButton onComplete={onComplete} /></div>;
  return (
    <div className="space-y-6 relative">
      <div className="text-center space-y-2">
        <div className="font-heading text-4xl font-black text-[#C8A66A] tracking-widest opacity-40">{data.numeral}</div>
        <h3 className="font-heading text-2xl font-black text-[#5B1F3D]">{data.name}</h3>
        <p className="font-body text-[12px] font-bold italic text-[#C8A66A] uppercase tracking-widest">{data.subtitle}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 py-2">
        {data.keywords.map(k => (
          <span key={k} className="text-[10px] tracking-[0.2em] uppercase font-body font-black px-3 py-1.5 rounded-full bg-[#C8A66A]/10 text-[#C8A66A] border border-[#C8A66A]/20">{k}</span>
        ))}
      </div>
      <p className="font-body text-[14px] leading-relaxed font-bold text-[#5B1F3D]/80 text-center px-4">{data.essence}</p>
      <div className="rounded-[2rem] p-6 bg-white border-2 border-[#C8A66A]/10 shadow-sm relative overflow-hidden group">
        <p className="font-body text-[13px] font-bold italic text-[#5B1F3D] leading-relaxed relative z-10">✦ {data.reflection}</p>
      </div>
      <CompleteButton 
        onComplete={() => {
          console.log("[Ritual] CartaDoDiaContent onComplete called");
          onComplete();
        }} 
        label="Contemplei ✦" 
      />
    </div>
  );
};

const RevisaoRapidaContent = ({ data, onComplete }: { data: CartaDoDia | null; onComplete: () => void }) => {
  const [revealed, setRevealed] = useState(false);
  if (!data) return <div className="text-center py-8"><p className="font-body text-[13px] font-bold text-[#5B1F3D]/50">Conteúdo carregando...</p><CompleteButton onComplete={onComplete} /></div>;
  return (
    <div className="space-y-6 text-center py-4">
      <p className="font-body text-[12px] font-bold uppercase tracking-widest text-[#5B1F3D]/40">O que você lembra sobre...</p>
      <h3 className="font-heading text-3xl font-black text-[#5B1F3D]">{data.name}</h3>
      {!revealed ? (
        <button onClick={() => setRevealed(true)} className="px-10 py-4 rounded-2xl font-heading text-[12px] font-black tracking-[0.2em] uppercase transition-all bg-[#5B1F3D]/5 border-2 border-[#5B1F3D]/10 text-[#5B1F3D] hover:bg-[#5B1F3D] hover:text-white">Revelar essência</button>
      ) : (
        <div className="text-left space-y-6">
          <p className="font-body text-[14px] leading-relaxed font-bold text-[#5B1F3D]/80">{data.essence}</p>
          <div className="flex flex-wrap gap-2">
            {data.keywords.map(k => (
              <span key={k} className="text-[10px] font-body font-black tracking-widest uppercase px-3 py-1.5 rounded-full bg-[#C8A66A]/10 text-[#C8A66A] border border-[#C8A66A]/10">{k}</span>
            ))}
          </div>
          <CompleteButton 
            onComplete={() => {
              console.log("[Ritual] RevisaoRapidaContent onComplete called");
              onComplete();
            }} 
            label="Revisei ⚡" 
          />
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
  if (data.questions.length === 0) return <div className="text-center py-8"><CompleteButton onComplete={onComplete} /></div>;
  if (finished) return (
    <div className="text-center space-y-6 py-6">
      <h3 className="font-heading text-2xl font-black text-[#5B1F3D]">{score}/{data.questions.length} acertos</h3>
      <CompleteButton onComplete={onComplete} label="Integrar Sabedoria ✦" />
    </div>
  );
  const q = data.questions[current];
  return (
    <div className="space-y-6">
      <h3 className="font-heading text-lg font-black text-[#5B1F3D] leading-tight">{q.question}</h3>
      <div className="space-y-3">
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => {
            if (selected !== null) return;
            setSelected(i);
            if (i === q.correctIndex) setScore(s => s + 1);
            setTimeout(() => {
              if (current < data.questions.length - 1) { setCurrent(c => c + 1); setSelected(null); }
              else setFinished(true);
            }, 1500);
          }} className="w-full text-left rounded-2xl p-4 font-body text-[14px] font-bold border-2" style={{ background: selected === null ? "white" : i === q.correctIndex ? "rgba(34, 197, 94, 0.1)" : i === selected ? "rgba(239, 68, 68, 0.1)" : "white" }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

const SimboloContent = ({ data, onComplete }: { data: SimboloDoDia | null; onComplete: () => void }) => {
  if (!data) return <div className="text-center py-8"><CompleteButton onComplete={onComplete} /></div>;
  return (
    <div className="space-y-6">
      <h3 className="font-heading text-2xl font-black text-[#5B1F3D] text-center">{data.name}</h3>
      <p className="font-body text-[14px] leading-relaxed font-bold text-[#5B1F3D]/80">{data.explanation}</p>
      <div className="space-y-4">
        {data.readings.map((r, i) => (
          <li key={i} className="font-body text-[13px] font-bold flex items-start gap-3 p-3 rounded-xl bg-white border border-[#C8A66A]/10">{r}</li>
        ))}
      </div>
      <CompleteButton onComplete={onComplete} label="Aprendi ◎" />
    </div>
  );
};

const CombinacaoContent = ({ data, onComplete }: { data: CombinacaoDoDia | null; onComplete: () => void }) => {
  const [showInsight, setShowInsight] = useState(false);
  if (!data) return <div className="text-center py-8"><CompleteButton onComplete={onComplete} /></div>;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-4">
        <div className="rounded-[2rem] p-6 text-center w-full bg-white border-2 border-[#C8A66A]/20 shadow-sm">{data.card1.name}</div>
        <div className="rounded-[2rem] p-6 text-center w-full bg-[#5B1F3D] border-2 border-[#C8A66A]/30 shadow-sm text-white">{data.card2.name}</div>
      </div>
      <p className="font-body text-[14px] font-bold italic text-[#5B1F3D] text-center leading-relaxed">"{data.prompt}"</p>
      {!showInsight ? (
        <button onClick={() => setShowInsight(true)} className="w-full py-4 rounded-2xl font-heading text-[12px] font-black tracking-[0.2em] uppercase bg-[#5B1F3D]/5 border-2 border-[#5B1F3D]/10 text-[#5B1F3D]">Revelar Alquimia</button>
      ) : (
        <p className="font-body text-[14px] leading-relaxed font-bold text-[#5B1F3D]/80">{data.insight}</p>
      )}
      <CompleteButton onComplete={onComplete} label="Combinei 🔗" />
    </div>
  );
};

const InterpretacaoContent = ({ data, onComplete }: { data: MiniInterpretacao | null; onComplete: () => void }) => {
  const [showSample, setShowSample] = useState(false);
  if (!data) return <div className="text-center py-8"><CompleteButton onComplete={onComplete} /></div>;
  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-5 bg-[#5B1F3D]/5 border-2 border-[#5B1F3D]/10">
        <p className="font-body text-[13px] font-bold italic text-[#5B1F3D] leading-relaxed">✦ {data.context}</p>
      </div>
      <div className="text-center space-y-3">
        <div className="font-heading text-2xl font-black text-[#5B1F3D]">{data.card.name}</div>
      </div>
      <p className="font-body text-[14px] leading-relaxed font-bold text-[#5B1F3D]/80">Para este contexto na posição de {data.position}, reflita sobre as seguintes questões:</p>
      <ul className="space-y-2">
        {data.guidedQuestions.map((q, i) => (
          <li key={i} className="text-[13px] font-bold text-[#5B1F3D]/70 bg-white p-3 rounded-xl border border-[#C8A66A10]">✦ {q}</li>
        ))}
      </ul>
      {!showSample ? (
        <button onClick={() => setShowSample(true)} className="w-full py-4 rounded-2xl font-heading text-[12px] font-black tracking-[0.2em] uppercase bg-[#5B1F3D]/5 border-2 border-[#5B1F3D]/10 text-[#5B1F3D]">Ver Exemplo de Leitura</button>
      ) : (
        <p className="font-body text-[14px] leading-relaxed font-bold text-[#5B1F3D]/80 italic bg-white p-4 rounded-xl">{data.sampleReading}</p>
      )}
      <CompleteButton onComplete={onComplete} label="Interpretei 🃏" />
    </div>
  );
};

const FooterInfo = () => (
  <div className="pt-8 border-t border-[#C8A66A20] text-center space-y-4">
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#C8A66A30] shadow-sm">
      <span className="text-[#C8A66A]">✦</span>
      <span className="text-[10px] font-heading font-black tracking-widest text-[#5B1F3D]/60 uppercase">Fim da Trilha de Hoje</span>
      <span className="text-[#C8A66A]">✦</span>
    </div>
    <p className="text-[12px] font-body font-bold italic text-[#5B1F3D]/40 max-w-[240px] mx-auto leading-relaxed">
      "Cada portal atravessado é um passo a mais na sua maestria."
    </p>
  </div>
);

export default DailyChallengesPage;
