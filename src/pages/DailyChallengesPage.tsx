import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ChevronRight, Gift, X, Scroll, Bell, Flame, CheckCircle2, Clock, Trophy, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useRitual } from "@/hooks/use-ritual";
import { useHeader } from "@/contexts/header-context";
import { TarotIcon } from "@/components/TarotIcon";
import { getDailyArcanaSet } from "@/lib/content/arcana-utils";
import { resolveMaiorVisual } from "@/lib/content/visual-registry";
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
import { PageBackControls } from "@/components/PageBackControls";


const todayStr = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const DailyChallengesPage = () => {
  const { setHeader, resetHeader } = useHeader();
  const location = useLocation();

  useEffect(() => {
    setHeader({
      title: "Ritual Sagrado",
      subtitle: "Sua Conexão Diária",
      backRoute: "/app"
    });
    return () => resetHeader();
  }, [setHeader, resetHeader]);

  const navigate = useNavigate();
  const { user } = useAuth();
  const { progress, updateStreak: updateOldStreak } = useProgress();
  const { streak: ritualStreak, todayProgress: ritualProgress, completeRitualItem, loading: ritualLoading, merits } = useRitual();
  const { data: arcanos, isLoading: arcanosLoading } = useArcanosList({ tipo: "maior" });
  const { data: symbols, isLoading: symbolsLoading } = useSymbolsContent();

  const arcanosList = arcanos ?? [];
  const cartaDoDia = useMemo(() => buildCartaDoDia(arcanosList), [arcanosList]);
  const perguntasDoDia = useMemo(() => buildPerguntasDoDia(arcanosList), [arcanosList]);
  const simboloDoDia = useMemo(() => buildSimboloDoDia(symbols), [symbols]);
  const combinacaoDoDia = useMemo(() => buildCombinacaoDoDia(arcanosList), [arcanosList]);
  const miniInterpretacao = useMemo(() => buildMiniInterpretacao(arcanosList), [arcanosList]);

  const ritualTriad = useMemo(() => {
    if (!user) return [];
    return getDailyArcanaSet(todayStr(), user.id, 3);
  }, [user]);

  const [challenges, setChallenges] = useState<DailyChallengeItem[]>(() => {
    const saved = localStorage.getItem("daily-challenges");
    const freshChallenges = buildDailyChallenges();
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.date === todayStr()) {
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

      if (!error && data) {
        const completedIds = data.map(c => c.challenge_id);
        setChallenges(prev => prev.map(ch => 
          completedIds.includes(ch.id) ? { ...ch, completed: true } : ch
        ));
      }
    };
    fetchCompletions();
  }, [user]);

  const completeChallenge = useCallback(async (id: string) => {
    const challenge = challenges.find(c => c.id === id);
    if (!challenge || challenge.completed) return;
    
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, completed: true } : c));
    setActiveChallenge(null);

    await completeRitualItem(id);

    if (user) {
      await supabase
        .from("daily_challenge_completions")
        .insert({
          user_id: user.id,
          challenge_id: id,
          challenge_date: todayStr(),
          xp_earned: 0
        });
    }
  }, [challenges, user, completeRitualItem]);

  const [showSummary, setShowSummary] = useState(false);
  const ritualJustFinished = useMemo(() => ritualProgress.completed && !showSummary, [ritualProgress.completed]);

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[#FAF5EF]">
      {ritualProgress.completed && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-plum/90 backdrop-blur-xl animate-in fade-in duration-500">
           <div className="bg-white w-full max-w-lg rounded-[3rem] border-4 border-gold shadow-2xl p-10 text-center space-y-8 animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-gold/20 rounded-full flex items-center justify-center mx-auto">
                 <Flame className="w-12 h-12 text-plum fill-plum" />
              </div>
              <div className="space-y-2">
                <h2 className="text-4xl font-heading font-black text-plum">Ritual Concluído</h2>
                <p className="font-body text-plum/60 italic">Sua chama foi mantida hoje.</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                 <div className="p-6 rounded-3xl bg-gold/5 border border-gold/20">
                    <div className="text-[12px] font-heading font-black text-gold uppercase tracking-widest mb-1">Sequência</div>
                    <div className="text-3xl font-heading font-black text-plum">{ritualStreak.current_streak} dias</div>
                 </div>
                 <div className="p-6 rounded-3xl bg-gold/5 border border-gold/20">
                    <div className="text-[12px] font-heading font-black text-gold uppercase tracking-widest mb-1">Status</div>
                    <div className="text-xl font-heading font-black text-plum">Mantida</div>
                 </div>
              </div>

              <div className="flex flex-col gap-3">
                 <button onClick={() => navigate("/app")} className="w-full py-5 bg-plum text-white rounded-2xl font-heading text-[11px] font-black tracking-[0.3em] uppercase shadow-xl hover:bg-plum/90 transition-all">
                    Continuar estudando
                 </button>
                 <button onClick={() => navigate("/app")} className="w-full py-3 text-plum/40 font-heading text-[10px] font-black uppercase tracking-widest hover:text-plum transition-colors">
                    Voltar amanhã
                 </button>
              </div>
           </div>
        </div>
      )}

      <div className="fixed inset-0 z-0 mystic-bg-procedural">
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #FAF5EF 0%, #FDF8F3 45%, #F2E7D9 100%)" }} />
      </div>

      {activeChallenge && (
        <ChallengeModal
          challenge={activeChallenge}
          isLoading={arcanosLoading || symbolsLoading}
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

      <header className="relative z-20" style={{
        borderBottom: "2.5px solid #C8A66A40",
        background: "linear-gradient(to bottom, rgba(250, 245, 239, 0.98), rgba(253, 248, 243, 0.96))",
        backdropFilter: "blur(24px)",
        boxShadow: "0 15px 50px rgba(91, 31, 61, 0.08)"
      }}>
        <div className="max-w-lg mx-auto pt-8 pb-10 px-6 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="font-heading text-4xl md:text-6xl font-black tracking-tighter text-plum">
              Leitura Diária
            </h1>
            <p className="font-body text-[14px] font-black uppercase tracking-[0.3em] text-gold">
              Faça sua prática de hoje.
            </p>
          </div>

          {/* Tríade do Ritual de Hoje */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-gold/30" />
              <span className="text-[12px] font-heading font-black tracking-[0.3em] text-gold uppercase">Tríade do Ritual de Hoje</span>
              <div className="h-px w-8 bg-gold/30" />
            </div>
            
            <div className="flex justify-center -space-x-4">
              {ritualTriad.map((card, idx) => (
                <div 
                  key={card.id} 
                  className={`w-14 md:w-16 aspect-[2/3.5] rounded-lg overflow-hidden border-2 border-gold/40 shadow-xl bg-ivory transition-transform hover:scale-110 hover:z-30 origin-bottom ${
                    idx === 0 ? '-rotate-6' : idx === 2 ? 'rotate-6' : 'z-20 scale-110'
                  }`}
                >
                  <img src={card.image} alt={card.name} className="w-full h-full object-cover" title={card.name} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-[calc(140px+env(safe-area-inset-bottom))] space-y-10 mt-12">
        <PageBackControls variant="top" showLabel={true} className="h-auto p-0 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-10">
            <div className="relative rounded-[3rem] overflow-hidden p-8 md:p-10 transition-all duration-500 bg-white border-2 border-gold shadow-2xl">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-6">
                <div className="flex items-center gap-5">
                  <div className={`w-16 h-16 rounded-[1.6rem] flex items-center justify-center border-2 shadow-xl transform ${ritualProgress.completed ? 'bg-plum text-gold' : 'bg-gold/10 border-gold/20 text-plum'}`}>
                    {ritualProgress.completed ? <CheckCircle2 className="w-8 h-8" /> : <Flame className="w-8 h-8" />}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[13px] font-heading font-black tracking-[0.35em] text-gold uppercase mb-1">
                      Missão do Dia
                    </span>
                    <span className="text-2xl font-heading font-black text-plum">
                      {ritualProgress.completed ? "Ritual Cumprido" : "Sequência Ritual"}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-gold/5 border border-gold/20">
                  <Flame className={`w-5 h-5 ${ritualStreak.current_streak > 0 ? 'text-plum fill-plum' : 'text-plum/20'}`} />
                  <span className="text-lg font-heading font-black text-plum">
                    {ritualStreak.current_streak > 0 ? `${ritualStreak.current_streak} dias` : "Comece hoje"}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[12px] font-heading font-black text-plum/40 uppercase tracking-widest leading-tight">
                    Chama Ritualística
                  </span>
                  <span className="text-[12px] font-heading font-black text-gold uppercase tracking-widest leading-tight">
                    {ritualProgress.items.length} de 3 Portais
                  </span>
                </div>
                <div className="h-4 rounded-full bg-gold/10 p-1 border border-gold/20">
                  <div 
                    className="h-full rounded-full bg-plum transition-all duration-1000 ease-out relative"
                    style={{ width: `${Math.min((ritualProgress.items.length / 3) * 100, 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                  </div>
                </div>
              </div>
              
              <p className="mt-8 text-[15px] md:text-[16px] font-body font-black text-plum/60 italic text-center leading-relaxed max-w-[320px] mx-auto uppercase tracking-normal">
                {ritualProgress.completed 
                  ? "Sua chama foi mantida hoje. Volte amanhã." 
                  : "Sua prática de hoje mantém sua chama viva."}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="h-px flex-1 bg-gold/20" />
                <h2 className="font-heading text-[13px] tracking-[0.4em] uppercase font-black text-gold">Portais de Sabedoria</h2>
                <span className="h-px flex-1 bg-gold/20" />
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
                      onClick={() => (isAvailable || isCompleted) && setActiveChallenge(ch)}
                      disabled={isBlocked}
                      className={`w-full text-left group transition-all duration-500 ${isBlocked ? "cursor-not-allowed" : ""}`}
                    >
                      <div className={`rounded-[2.5rem] p-6 md:p-9 flex flex-col sm:flex-row items-center gap-5 md:gap-6 transition-all duration-500 border-2 shadow-xl mx-auto w-full relative overflow-hidden ${
                          isCompleted ? "bg-[#FDF8F3] border-gold/40 opacity-90" : 
                          isAvailable ? "bg-white border-gold hover:shadow-2xl hover:-translate-y-2" : 
                          "bg-[#F5F5F5]/60 border-gray-200"
                        }`}>
                        <div className="flex items-center gap-4 md:gap-6 w-full sm:w-auto">
                          <div className={`w-18 h-18 md:w-24 md:h-24 rounded-[2rem] flex items-center justify-center shrink-0 border-2 transition-all duration-700 shadow-lg relative overflow-hidden ${
                            isCompleted ? "bg-ivory border-gold/40 text-gold" : 
                            isAvailable ? "bg-ivory border-gold text-plum group-hover:bg-plum group-hover:border-plum group-hover:text-gold" : 
                            "bg-gray-200 border-gray-300 text-gray-400"
                          }`}>
                            {ch.type === "carta-do-dia" && cartaDoDia && !isBlocked ? (
                              <div className="absolute inset-0">
                                <img 
                                  src={resolveMaiorVisual(cartaDoDia.arcanoId).resolvedAssetUrl || ""} 
                                  alt={cartaDoDia.name} 
                                  className="w-full h-full object-cover opacity-90 transition-opacity"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                                <div className="absolute top-1 left-0 right-0 text-center">
                                  <span className="text-[10px] font-heading font-black text-gold bg-plum/60 px-1.5 py-0.5 rounded-sm">{cartaDoDia.numeral}</span>
                                </div>
                                <div className="absolute bottom-1 inset-x-0 text-center px-1">
                                  <span className="text-[11px] font-heading font-black text-white uppercase tracking-normal leading-tight break-words">{cartaDoDia.name}</span>
                                </div>
                                {isCompleted && (
                                  <div className="absolute inset-0 bg-plum/40 flex items-center justify-center">
                                    <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-gold" />
                                  </div>
                                )}
                              </div>
                            ) : (
                              <>
                                {isCompleted ? (
                                  <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-gold" />
                                ) : (
                                  <>
                                    {isBlocked ? (
                                      <div className="relative w-full h-full flex items-center justify-center bg-gray-200">
                                        <div className="absolute inset-0 opacity-10">
                                          <img src={resolveMaiorVisual(0).resolvedAssetUrl || ""} className="w-full h-full object-cover grayscale" alt="Blocked" />
                                        </div>
                                        <div className="absolute inset-2 border border-dashed border-gray-400 rounded-xl opacity-30 z-10" />
                                        <TarotIcon name="bloqueado" className="w-8 h-8 md:w-10 md:h-10 opacity-40 z-10" />
                                      </div>
                                    ) : (
                                      <TarotIcon name={iconName} className="w-8 h-8 md:w-10 md:h-10 transition-transform duration-500 group-hover:scale-110" />
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className={`font-heading text-lg md:text-2xl font-black tracking-tight mb-2 ${isCompleted ? "text-plum/60" : isBlocked ? "text-plum/40" : "text-plum"}`}>
                              {ch.title}
                            </h3>
                            <p className={`font-body text-[14px] md:text-[16px] font-black leading-snug ${isCompleted ? "text-plum/40 italic" : isBlocked ? "text-plum/30" : "text-plum/80"}`}>
                              {isBlocked ? "Libera após o portal anterior." : isCompleted ? "Portal concluído. Toque para rever." : ch.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-gold/20">
                          <div className={`px-5 py-2.5 rounded-full text-[11px] md:text-[12px] font-heading font-black tracking-widest border-2 shadow-sm ${
                            isCompleted ? "bg-emerald-50 border-emerald-200 text-emerald-600" : 
                            isAvailable ? "bg-gold border-gold text-plum animate-pulse" : "bg-gray-100 border-gray-200 text-gray-400"
                          }`}>
                            {isCompleted ? "Concluído" : isAvailable ? "PRATICAR" : "Bloqueado"}
                          </div>
                          {(isAvailable || isCompleted) && (
                            <div className="w-10 h-10 rounded-full border-2 border-gold/20 flex items-center justify-center group-hover:bg-gold/10 group-hover:border-gold transition-all">
                              <ChevronRight className="w-7 h-7 text-gold group-hover:translate-x-1.5 transition-transform" />
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <PageBackControls variant="bottom" className="mt-8" />
            </div>
          </div>
          <aside className="space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 border-2 border-gold shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-6 h-6 text-gold" />
                <h3 className="font-heading text-lg font-black text-plum">Seus Méritos</h3>
              </div>
              <div className="space-y-4">
                {["chama_acesa", "ritmo_iniciado", "portal_constante", "habito_firmado", "guardia_rotina"].map(mKey => {
                  const isUnlocked = merits.includes(mKey);
                  return (
                    <div key={mKey} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${isUnlocked ? 'bg-gold/5 border-gold text-plum' : 'bg-gray-50 border-gray-100 text-gray-300 grayscale'}`}>
                      <div className="w-10 h-10 rounded-xl bg-white border border-current flex items-center justify-center">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-heading font-black uppercase tracking-widest leading-tight">
                        {mKey.replace("_", " ")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-plum rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
               <div className="relative z-10 space-y-4">
                 <h3 className="text-xl font-heading font-black text-gold">Chamado Diário</h3>
                 <p className="text-[13px] font-body font-bold italic opacity-80">Receba um lembrete para seu Ritual todos os dias.</p>
                 <button onClick={() => navigate("/rotina")} className="w-full py-4 bg-gold text-plum rounded-2xl font-heading text-[10px] font-black tracking-widest uppercase shadow-lg hover:scale-105 transition-all">
                   Ativar lembrete
                 </button>
               </div>
               <Bell className="absolute top-0 right-0 w-24 h-24 text-white opacity-5 -mr-8 -mt-8" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};



interface ChallengeModalProps {
  challenge: DailyChallengeItem;
  isLoading?: boolean;
  data: {
    carta: CartaDoDia | null;
    perguntas: PerguntasDoDia;
    simbolo: SimboloDoDia | null;
    combinacao: CombinacaoDoDia | null;
    interpretacao: MiniInterpretacao | null;
  };
  onComplete: () => void;
  onClose: () => void;
}

const ChallengeModal = ({ challenge, isLoading, data, onComplete, onClose }: ChallengeModalProps) => {
  const [step, setStep] = useState<"initial" | "active" | "completed">("initial");
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-plum/90 backdrop-blur-xl">
        <div className="bg-white w-full max-w-lg rounded-[3rem] border-4 border-gold shadow-2xl p-10 text-center space-y-4">
          <Loader2 className="w-12 h-12 text-gold animate-spin mx-auto" />
          <p className="font-heading text-plum font-black uppercase tracking-widest text-[10px]">Preparando Portal...</p>
        </div>
      </div>
    );
  }

  // ─── CARTA DO DIA ───
  if (challenge.type === "carta-do-dia") {
    const carta = data.carta;
    const visual = resolveMaiorVisual(carta?.arcanoId ?? 0);
    const imageUrl = visual.resolvedAssetUrl;

    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-plum/90 backdrop-blur-xl animate-in fade-in duration-300">
        <div className="bg-white w-full max-w-lg rounded-[3rem] border-4 border-gold shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
          <div className="p-8 md:p-10 text-center space-y-8">
            <div className="space-y-2">
              <h2 className="text-[10px] font-heading font-black text-gold uppercase tracking-[0.4em]">Carta do Dia</h2>
              <h3 className="text-3xl font-heading font-black text-plum">{carta?.name || "O Louco"}</h3>
            </div>

            <div className="relative group flex justify-center">
              <div className="w-48 md:w-56 aspect-[2/3.5] rounded-2xl overflow-hidden border-4 border-gold shadow-2xl bg-ivory transform transition-transform duration-700 group-hover:scale-105 relative">
                <img 
                  src={imageUrl || ""} 
                  alt={carta?.name || "O Louco"} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-3 left-0 right-0 text-center pointer-events-none">
                  <span className="inline-block px-3 py-1 font-heading text-[12px] tracking-[0.4em] rounded-sm text-gold bg-plum/60 border border-gold/30">
                    {carta?.numeral}
                  </span>
                </div>
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <h4 className="font-heading text-xl font-bold text-white tracking-tight drop-shadow-lg">{carta?.name}</h4>
                </div>
              </div>
            </div>

            <div className="min-h-[80px] flex items-center justify-center px-6">
              {step === "initial" ? (
                <p className="font-body text-[15px] font-black text-plum/80 uppercase tracking-tighter leading-relaxed">
                  Observe o símbolo central deste arcano antes de seguir.
                </p>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
                  <p className="font-body text-[14px] font-black text-plum italic uppercase tracking-tighter leading-relaxed">
                    "{carta?.essence || "Um novo começo se apresenta."}"
                  </p>
                  <p className="font-body text-[13px] font-black text-plum/60 uppercase tracking-widest">
                    O portal está pronto para ser selado.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-4">
              {step === "initial" ? (
                <button 
                  onClick={() => setStep("completed")}
                  className="w-full py-5 bg-plum text-white rounded-2xl font-heading text-[11px] font-black tracking-[0.3em] uppercase shadow-xl hover:bg-plum/90 transition-all active:scale-95"
                >
                  Contemplar
                </button>
              ) : (
                <button 
                  onClick={onComplete}
                  className="w-full py-5 bg-gold text-plum rounded-2xl font-heading text-[11px] font-black tracking-[0.3em] uppercase shadow-xl hover:scale-105 transition-all active:scale-95"
                >
                  Selar Portal
                </button>
              )}
              <button onClick={onClose} className="w-full py-3 text-plum/40 font-heading text-[10px] font-black uppercase tracking-widest hover:text-plum transition-colors">
                Agora não
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── REVISÃO RÁPIDA / PERGUNTAS DO DIA ───
  if (challenge.type === "revisao-rapida" || challenge.type === "perguntas-do-dia") {
    const questions = data.perguntas.questions;
    
    if (!questions || questions.length === 0) {
      return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-plum/90 backdrop-blur-xl">
          <div className="bg-white w-full max-w-lg rounded-[3rem] border-4 border-gold shadow-2xl p-10 text-center space-y-6">
            <AlertCircle className="w-12 h-12 text-gold mx-auto" />
            <p className="font-heading text-plum font-black uppercase tracking-widest text-[10px]">Nenhuma pergunta disponível para hoje.</p>
            <button onClick={onClose} className="w-full py-5 bg-plum text-white rounded-2xl font-heading text-[11px] font-black uppercase tracking-widest">Fechar</button>
          </div>
        </div>
      );
    }

    const currentQ = questions[currentQuizIndex];
    const isLast = currentQuizIndex === (challenge.type === "revisao-rapida" ? 0 : questions.length - 1);

    const handleAnswer = (idx: number) => {
      if (selectedOption !== null) return;
      setSelectedOption(idx);
      const correct = idx === currentQ.correctIndex;
      setIsCorrect(correct);
      
      if (correct) {
        toast.success("Correto!");
      } else {
        toast.error("Quase lá! Tente refletir sobre a explicação.");
      }
    };

    const nextStep = () => {
      if (isLast) {
        setStep("completed");
      } else {
        setCurrentQuizIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      }
    };

    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-plum/90 backdrop-blur-xl animate-in fade-in duration-300">
        <div className="bg-white w-full max-w-lg rounded-[3rem] border-4 border-gold shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
          <div className="p-8 md:p-10 text-center space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-8 bg-gold/30" />
                <h2 className="text-[10px] font-heading font-black text-gold uppercase tracking-[0.4em]">{challenge.title}</h2>
                <div className="h-px w-8 bg-gold/30" />
              </div>
              <p className="text-plum/60 font-body italic text-sm">{challenge.subtitle}</p>
            </div>

            {step !== "completed" ? (
              <div className="space-y-6 text-left animate-in fade-in duration-500">
                <div className="p-6 bg-gold/5 rounded-2xl border border-gold/20">
                  <p className="font-heading text-lg font-black text-plum leading-tight">
                    {currentQ?.question}
                  </p>
                </div>

                <div className="grid gap-3">
                  {currentQ?.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={selectedOption !== null}
                      className={`w-full p-4 rounded-xl border-2 text-left font-body font-bold transition-all ${
                        selectedOption === idx
                          ? isCorrect ? "bg-green-50 border-green-500 text-green-700" : "bg-red-50 border-red-500 text-red-700"
                          : selectedOption !== null && idx === currentQ.correctIndex
                            ? "bg-green-50 border-green-500 text-green-700"
                            : "bg-white border-gold/20 hover:border-gold text-plum"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {selectedOption !== null && (
                  <div className="p-4 bg-ivory rounded-xl border border-gold/20 animate-in slide-in-from-top-2 duration-500">
                    <p className="text-[12px] font-body text-plum/70 leading-relaxed">
                      <span className="font-black text-plum uppercase tracking-widest block mb-1 text-[10px]">Explicação:</span>
                      {currentQ?.explanation}
                    </p>
                    <button 
                      onClick={nextStep}
                      className="mt-4 w-full py-3 bg-plum text-white rounded-xl font-heading text-[10px] font-black uppercase tracking-widest"
                    >
                      {isLast ? "Concluir Revisão" : "Próxima Pergunta"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6 animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto border-2 border-gold">
                  <CheckCircle2 className="w-10 h-10 text-plum" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-heading font-black text-plum">Revisão Concluída</h3>
                  <p className="font-body text-plum/60 italic">Você fortaleceu seu conhecimento hoje.</p>
                </div>
                <button 
                  onClick={onComplete}
                  className="w-full py-5 bg-gold text-plum rounded-2xl font-heading text-[11px] font-black tracking-[0.3em] uppercase shadow-xl hover:scale-105 transition-all"
                >
                  Selar Portal
                </button>
              </div>
            )}

            {step !== "completed" && (
              <button onClick={onClose} className="w-full py-3 text-plum/40 font-heading text-[10px] font-black uppercase tracking-widest hover:text-plum transition-colors">
                Agora não
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── OUTROS PORTAIS (SIMBOLO, COMBINACAO, MINI) ───
  let portalContent = null;
  if (challenge.type === "simbolo-do-dia" && data.simbolo) {
    portalContent = (
      <div className="space-y-6 text-left">
        <div className="p-6 bg-gold/5 rounded-2xl border border-gold/20 space-y-4">
          <h4 className="font-heading text-xl font-black text-plum">{data.simbolo.name}</h4>
          <p className="font-body text-sm text-plum/80 leading-relaxed italic">{data.simbolo.explanation}</p>
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-heading font-black text-gold uppercase tracking-widest">Aparece em:</p>
          <p className="font-body text-sm text-plum/60 font-black uppercase">{data.simbolo.cards.join(", ")}</p>
        </div>
      </div>
    );
  } else if (challenge.type === "combinacao-do-dia" && data.combinacao) {
    portalContent = (
      <div className="space-y-6 text-left">
        <div className="flex justify-center gap-4 mb-4">
           {data.combinacao.card1 && (
             <div className="w-24 md:w-28 aspect-[2/3.5] bg-ivory border-2 border-gold rounded-xl overflow-hidden shadow-xl relative group">
               <img 
                 src={resolveMaiorVisual(data.combinacao.card1.name === "O Louco" ? 0 : 1).resolvedAssetUrl} 
                 className="w-full h-full object-cover opacity-90"
                 alt={data.combinacao.card1.name} 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
               <span className="absolute bottom-2 inset-x-0 text-center text-[8px] font-heading font-black text-white uppercase tracking-widest">{data.combinacao.card1.name}</span>
             </div>
           )}
           {data.combinacao.card2 && (
             <div className="w-24 md:w-28 aspect-[2/3.5] bg-ivory border-2 border-gold rounded-xl overflow-hidden shadow-xl relative group">
               <img 
                 src={resolveMaiorVisual(data.combinacao.card2.name === "O Louco" ? 0 : 2).resolvedAssetUrl} 
                 className="w-full h-full object-cover opacity-90"
                 alt={data.combinacao.card2.name} 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
               <span className="absolute bottom-2 inset-x-0 text-center text-[8px] font-heading font-black text-white uppercase tracking-widest">{data.combinacao.card2.name}</span>
             </div>
           )}
        </div>
        <div className="p-6 bg-gold/5 rounded-2xl border border-gold/20 space-y-4">
          <p className="font-body text-sm text-plum/80 leading-relaxed italic">"{data.combinacao.insight}"</p>
        </div>
      </div>
    );
  } else if (challenge.type === "mini-interpretacao" && data.interpretacao) {
    portalContent = (
      <div className="space-y-6 text-left">
        <div className="p-6 bg-gold/5 rounded-2xl border border-gold/20 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gold" />
            <p className="text-[10px] font-heading font-black text-gold uppercase tracking-widest">Contexto:</p>
          </div>
          <p className="font-body text-sm text-plum font-black leading-snug p-4 bg-white/50 rounded-xl border border-gold/10 mb-6">{data.interpretacao.context}</p>
          
          <div className="flex justify-center mb-6">
            <div className="w-28 aspect-[2/3.5] bg-ivory border-2 border-gold rounded-xl overflow-hidden shadow-xl relative">
               <img 
                 src={resolveMaiorVisual(data.interpretacao.card.name === "O Louco" ? 0 : 3).resolvedAssetUrl} 
                 className="w-full h-full object-cover"
                 alt={data.interpretacao.card.name} 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
               <div className="absolute top-2 left-0 right-0 text-center">
                 <span className="inline-block px-2 py-0.5 text-[8px] font-heading font-black text-gold bg-plum/40 rounded-sm">{data.interpretacao.card.numeral}</span>
               </div>
               <span className="absolute bottom-2 inset-x-0 text-center text-[8px] font-heading font-black text-white uppercase tracking-widest">{data.interpretacao.card.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gold" />
            <p className="text-[10px] font-heading font-black text-gold uppercase tracking-widest">Leitura Sugerida:</p>
          </div>
          <p className="font-body text-sm text-plum/80 leading-relaxed italic p-4 bg-ivory/50 rounded-xl border border-gold/10">"{data.interpretacao.sampleReading}"</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-plum/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[3rem] border-4 border-gold shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="p-8 md:p-10 text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-[10px] font-heading font-black text-gold uppercase tracking-[0.4em]">{challenge.title}</h2>
            <p className="text-plum/60 font-body italic text-sm">{challenge.subtitle}</p>
          </div>

          <div className="w-20 h-20 bg-gold/10 rounded-3xl flex items-center justify-center mx-auto text-plum border-2 border-gold shadow-xl">
             <TarotIcon name={challenge.icon} className="w-12 h-12" />
          </div>

          {portalContent ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
               {portalContent}
               <div className="flex flex-col gap-3 pt-6">
                 <button 
                   onClick={onComplete}
                   className="w-full py-5 bg-gold text-plum rounded-2xl font-heading text-[11px] font-black tracking-[0.3em] uppercase shadow-xl hover:scale-105 transition-all"
                 >
                   Selar Portal
                 </button>
                 <button onClick={onClose} className="w-full py-3 text-plum/40 font-heading text-[10px] font-black uppercase tracking-widest hover:text-plum transition-colors">
                   Agora não
                 </button>
               </div>
            </div>
          ) : (
            <div className="space-y-6">
               <p className="font-body text-plum/40 italic uppercase tracking-widest text-[12px]">Portal em preparação...</p>
               <button onClick={onClose} className="w-full py-5 bg-plum/10 text-plum rounded-2xl font-heading text-[11px] font-black tracking-[0.3em] uppercase">
                 Voltar
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyChallengesPage;
