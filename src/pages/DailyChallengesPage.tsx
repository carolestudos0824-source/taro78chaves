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

const today = () => {
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
        if (parsed.date === today()) return parsed.items;
      } catch {}
    }
    return freshChallenges;
  });

  const [activeChallenge, setActiveChallenge] = useState<DailyChallengeItem | null>(null);

  useEffect(() => {
    localStorage.setItem("daily-challenges", JSON.stringify({ date: today(), items: challenges }));
  }, [challenges]);

  useEffect(() => {
    if (!user) return;
    const fetchCompletions = async () => {
      const { data } = await supabase
        .from("daily_challenge_completions")
        .select("challenge_id")
        .eq("user_id", user.id)
        .eq("challenge_date", today());

      if (data && data.length > 0) {
        const completedIds = data.map(c => c.challenge_id);
        setChallenges(prev => prev.map(ch => completedIds.includes(ch.id) ? { ...ch, completed: true } : ch));
      }
    };
    fetchCompletions();
  }, [user]);

  const completedCount = challenges.filter(c => c.completed).length;
  const allDone = completedCount === challenges.length;

  const completeChallenge = useCallback(async (id: string) => {
    const challenge = challenges.find(c => c.id === id);
    if (!challenge || challenge.completed) return;
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, completed: true } : c));
    setActiveChallenge(null);
    addXP(challenge.xp);
    updateStreak();
    if (user) {
      await supabase.from("daily_challenge_completions").insert({
        user_id: user.id,
        challenge_id: id,
        challenge_date: today(),
        xp_earned: challenge.xp
      });
    }
  }, [challenges, user, addXP, updateStreak]);

  return (
    <div className="min-h-screen pb-bottom-nav bg-[#FAF5EF]">
      <header className="relative z-20 border-b border-[#C8A66A20] bg-white/80 backdrop-blur-md">
        <div className="max-w-lg mx-auto pt-8 pb-10 px-6 text-center">
          <button onClick={() => navigate("/app")} className="absolute left-6 top-8 p-3 rounded-2xl bg-white shadow-sm border border-[#C8A66A20]">
            <ArrowLeft className="w-5 h-5 text-[#5B1F3D]" />
          </button>
          <span className="text-[10px] tracking-[0.4em] uppercase font-heading font-black text-[#C8A66A]">Ritual de Conexão</span>
          <h1 className="font-heading text-4xl font-black mt-3 text-[#5B1F3D]">Leitura de Conexão</h1>
          <p className="font-body text-[13px] text-[#5B1F3D]/60 mt-4 italic">"O Tarô revela caminhos para a sua consciência."</p>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-6 py-10 space-y-8">
        <div className="rounded-[2rem] p-6 border-2 border-[#C8A66A] bg-white shadow-lg space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-heading font-black uppercase text-[#C8A66A] tracking-widest">{completedCount} de {challenges.length} portais</span>
            <span className="text-[10px] font-heading font-black uppercase text-[#C8A66A] tracking-widest">
              {allDone ? "Ritual concluído" : "Prática em curso"}
            </span>
          </div>
          <div className="h-3 rounded-full bg-[#E8DED3] overflow-hidden">
            <div className="h-full bg-[#C8A66A] transition-all duration-500" style={{ width: `${(completedCount / challenges.length) * 100}%` }} />
          </div>
          <p className="text-[12px] font-bold text-[#5B1F3D]/80 text-center">
            {allDone 
              ? "Ritual de hoje completo. Volte amanhã para uma nova conexão." 
              : "Complete os 6 portais para selar sua prática de hoje."}
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-[12px] text-center font-bold text-[#5B1F3D]/60 uppercase tracking-widest italic">
            Comece pela Carta do Dia. Ao concluir cada portal, o próximo se abre.
          </p>
          
          {challenges.map((ch, index) => {
            const isCompleted = ch.completed;
            const isPreviousCompleted = index === 0 || challenges[index - 1].completed;
            const isAvailable = !isCompleted && isPreviousCompleted;
            const isBlocked = !isCompleted && !isPreviousCompleted;

            return (
              <button
                key={ch.id}
                onClick={() => (isAvailable || isCompleted) && setActiveChallenge(ch)}
                disabled={isBlocked}
                className={`w-full p-6 rounded-[2rem] border-2 transition-all duration-300 flex items-center gap-4 ${
                  isCompleted ? "bg-[#FDF8F3] border-[#C8A66A40]" : 
                  isAvailable ? "bg-white border-[#C8A66A] ring-4 ring-[#C8A66A20]" : "bg-[#F5F5F5] border-[#E5E5E5] opacity-50 grayscale"
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isCompleted ? "bg-[#FAF5EF]" : "bg-[#FAF5EF]"}`}>
                  {isCompleted ? <TarotIcon name="concluido" className="w-8 h-8 text-[#C8A66A]" /> : 
                   isBlocked ? <TarotIcon name="bloqueado" className="w-8 h-8 text-gray-400" /> : 
                   <TarotIcon name={ch.icon} className="w-8 h-8 text-[#5B1F3D]" />}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-heading font-black text-[#5B1F3D] text-lg">{ch.title}</h3>
                  <p className="text-[12px] text-[#5B1F3D]/60 font-bold">{isBlocked ? "Libera após o portal anterior." : ch.subtitle}</p>
                </div>
                {isCompleted && <span className="text-[10px] font-heading font-bold uppercase text-emerald-600 px-3 py-1 bg-emerald-50 rounded-full">Concluído</span>}
                {isAvailable && <span className="text-[10px] font-heading font-bold uppercase text-[#C8A66A] animate-pulse">Praticar agora</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
