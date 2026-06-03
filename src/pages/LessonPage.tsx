import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getArcanoFull as getArcanoById, ARCANOS_MAIORES_CATALOG as ARCANOS_MAIORES } from "@/lib/content";
import { useProgress } from "@/hooks/use-progress";
import { usePremium } from "@/hooks/use-premium";
import { useRole } from "@/hooks/use-role";
import { useAccess } from "@/hooks/use-access";
import { ArcanoVivoStage } from "@/components/tarot-motion/ArcanoVivoStage";
import { ArcanoUnlockMoment } from "@/components/tarot-motion/ArcanoUnlockMoment";
import { LessonContent } from "@/components/arcano-vivo/LessonContent";
import { SymbolMap } from "@/components/arcano-vivo/SymbolMap";
import { CompletionScreen } from "@/components/arcano-vivo/CompletionScreen";
import { DeepDiveSection } from "@/components/DeepDiveSection";
import { ExerciseSection } from "@/components/ExerciseSection";
import { QuizSection } from "@/components/QuizSection";
import PremiumGate from "@/components/PremiumGate";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHeader } from "@/contexts/header-context";
import { PhaseIndicator } from "@/components/arcano-vivo/PhaseIndicator";
import { LessonPhaseHeader } from "@/components/arcano-vivo/LessonPhaseHeader";


/** 
 * REGRA PEDAGÓGICA OFICIAL — 9 FASES (Fase 6.6 — Alinhamento total)
 * 
 * Estrutura unificada para todos os 78 arcanos:
 * 1. intro (Apresentação)
 * 2. simbolos (Símbolos)
 * 3. luz-sombra (Luz & Sombra)
 * 4. voz (Voz da Carta)
 * 5. aprofundamento (Aprofundamento)
 * 6. aplicacoes (Aplicações)
 * 7. reflexao (Reflexão)
 * 8. quiz (Quiz)
 * 9. complete (Conclusão / Revisão)
 */
type LessonPhase = 
  | "intro" 
  | "simbolos" 
  | "luz-sombra" 
  | "voz" 
  | "aprofundamento" 
  | "aplicacoes" 
  | "reflexao" 
  | "quiz" 
  | "complete";

const PHASE_ORDER: LessonPhase[] = [
  "intro",
  "simbolos",
  "luz-sombra",
  "voz",
  "aprofundamento",
  "aplicacoes",
  "reflexao",
  "quiz",
  "complete"
];

const PHASE_LABEL: Record<LessonPhase, string> = {
  intro: "Apresentação",
  simbolos: "Símbolos",
  "luz-sombra": "Luz & Sombra",
  voz: "Voz da Carta",
  aprofundamento: "Aprofundamento",
  aplicacoes: "Aplicações",
  reflexao: "Reflexão",
  quiz: "Quiz",
  complete: "Conclusão",
};

const LessonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const arcanoId = parseInt(id || "0", 10);
  const isValidId = !isNaN(arcanoId) && arcanoId >= 0 && arcanoId <= 21;
  const isLiteralRoute = id === ":id";

  const { addXP, completeLesson, completeQuiz, earnBadge } = useProgress();
  const { loading: premiumLoading } = usePremium();
  const { isStaff, loading: roleLoading } = useRole();
  const { canAccessArcano, hasFullAccess, loading: accessLoading } = useAccess();
  const isAuditMode = new URLSearchParams(window.location.search).get('audit') === 'true';

  const { setHeader, resetHeader } = useHeader();
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phase = PHASE_ORDER[phaseIdx];
  
  const arcano = getArcanoById(isValidId ? arcanoId : 0);
  const hasAccess = isAuditMode || (isValidId ? canAccessArcano(arcanoId) : false);


  const [pontosEarned, setPontosEarned] = useState(0);
  const [lastQuizScore, setLastQuizScore] = useState(0);
  const [lastQuizTotal, setLastQuizTotal] = useState(0);
  const [showUnlockMoment, setShowUnlockMoment] = useState(false);

  useEffect(() => {
    if (isLiteralRoute) {
      navigate("/module/arcanos-maiores", { replace: true });
    }
  }, [isLiteralRoute, navigate]);

  const nextArcano = isValidId && arcanoId < 21 ? ARCANOS_MAIORES[arcanoId + 1] : null;

  useEffect(() => {
    if (arcano) {
      setHeader({
        title: arcano.name,
        subtitle: `Arcano ${arcano.numeral} • Lição ${arcanoId + 1}`,
        backRoute: "/module/arcanos-maiores",
        rightElement: <PhaseIndicator phases={PHASE_ORDER} currentIndex={phaseIdx} />,
        hidePontos: true,
        hideStreak: true
      });



    }
    return () => resetHeader();
  }, [arcano, phaseIdx, arcanoId, setHeader, resetHeader]);

  if (isLiteralRoute || !arcano || !isValidId) {
    if (!arcano || !isValidId) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF5EF]">
          <div className="text-center space-y-8 max-w-xs px-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-2 border-4 border-[#C8A66A] shadow-xl ring-8 ring-[#C8A66A]/10">
              <span className="text-3xl">🃏</span>
            </div>
            <div className="space-y-3">
              <h2 className="font-heading text-2xl text-[#5B1F3D] font-black tracking-tight">Arcano não encontrado</h2>
              <p className="font-accent text-sm text-[#5B1F3D]/70 italic leading-relaxed font-bold">
                "Nem toda porta deve ser aberta antes do tempo."
              </p>
            </div>
            <button 
              onClick={() => navigate("/module/arcanos-maiores")} 
              className="w-full h-auto py-5 px-4 rounded-2xl font-heading text-[11px] tracking-[0.1em] uppercase transition-all shadow-xl hover:scale-105 active:scale-95 bg-[#5B1F3D] text-white border-2 border-[#C8A66A] font-black leading-tight text-center"
            >
              Voltar à Jornada
            </button>
          </div>
        </div>
      );
    }
    return null;
  }

  if (!hasAccess && !accessLoading) {
    const isPerformanceLocked = arcanoId === 1 && !hasFullAccess;
    return (
      <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6">
        <div className="fixed inset-0 z-0">
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, #FAF5EF 0%, #F5EBDE 45%, #EFE2D2 100%)",
              opacity: 0.98,
            }}
          />
        </div>

        <div className="relative z-10 max-w-sm w-full text-center space-y-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-white border-2 border-[#C8A66A] flex items-center justify-center font-heading text-3xl text-[#5B1F3D] font-black shadow-xl ring-8 ring-[#C8A66A]/10">
            {arcano.numeral}
          </div>
          <div className="space-y-3">
            <h1 className="font-heading text-4xl text-[#5B1F3D] font-black tracking-tight">{arcano.name}</h1>
            <p className="font-accent italic text-[#5B1F3DCC] font-bold text-lg leading-relaxed">{arcano.subtitle}</p>
          </div>
          <div className="bg-white/60 backdrop-blur-xl border-2 border-[#C8A66A]/30 p-8 rounded-[2rem] shadow-xl">
            <PremiumGate 
              featureName={arcano.name}
              message={isPerformanceLocked 
                ? "Para desbloquear O Mago, você precisa de uma nota mínima de 80% no Quiz do Louco. O Tarô é método e fundamento."
                : "Conteúdo exclusivo para assinantes da Jornada Completa."
              }
            />
          </div>
          {isPerformanceLocked && (
            <button 
              onClick={() => navigate("/lesson/0")} 
              className="w-full h-auto bg-[#5B1F3D] text-white py-5 px-4 rounded-2xl font-heading font-black text-xs tracking-[0.1em] uppercase border-2 border-[#C8A66A] shadow-xl transition-all hover:scale-105 active:scale-95 leading-tight text-center"
            >
              Refazer Quiz do Louco
            </button>
          )}
        </div>
      </div>
    );
  }

  const goNext = () => {
    if (phaseIdx < PHASE_ORDER.length - 1) {
      setPhaseIdx(phaseIdx + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleQuizComplete = (score: number, total: number) => {
    const quizPontos = score * 10;
    addXP(quizPontos);
    setPontosEarned(e => e + quizPontos);
    completeQuiz(`quiz-arcano-${arcano.id}`, score, total);
    completeLesson(`arcano-${arcano.id}`);
    if (arcano.id === 0) {
      earnBadge("fool-complete");
      setShowUnlockMoment(true);
    }
    setLastQuizScore(score);
    setLastQuizTotal(total);
    setPhaseIdx(PHASE_ORDER.indexOf("complete"));
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen relative bg-[#FAF5EF]">
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #FAF5EF 0%, #F5EBDE 45%, #EFE2D2 100%)",
            opacity: 0.98,
          }}
        />
      </div>

      <main className="relative z-10 container max-w-lg mx-auto px-4 py-8 pb-32">
        <section className="space-y-8 animate-fade-in">
          {phase === "intro" && (
            <div className="space-y-8">
              <ArcanoVivoStage
                arcanoId={arcanoId}
                cardName={arcano.name}
                cardImage={arcano.cardImage}
                arcanoSlug={arcano.id === 0 ? "o-louco" : arcano.id === 1 ? "o-mago" : arcano.id === 15 ? "o-diabo" : "generic"}
                onContinue={goNext}
              />
              <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 border-2 border-[#C8A66A]/20 shadow-xl space-y-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-[#C8A66A]" />
                  <h2 className="font-heading text-xs tracking-[0.3em] uppercase font-black text-[#5B1F3D]">Essência</h2>
                </div>
                <p className="font-body text-[18px] leading-[1.8] text-[#3D1429] font-black">{arcano.layers.main.essence}</p>
                
                {arcano.archetype && (
                  <>
                    <div className="flex items-center gap-3 pt-4">
                      <Sparkles className="w-5 h-5 text-[#C8A66A]" />
                      <h2 className="font-heading text-xs tracking-[0.3em] uppercase font-black text-[#5B1F3D]">Arquétipo</h2>
                    </div>
                    <p className="font-body text-[18px] leading-[1.8] text-[#3D1429] font-black">{arcano.archetype}</p>
                  </>
                )}

                {arcano.initiationLesson && (
                  <>
                    <div className="flex items-center gap-3 pt-4">
                      <Sparkles className="w-5 h-5 text-[#C8A66A]" />
                      <h2 className="font-heading text-xs tracking-[0.3em] uppercase font-black text-[#5B1F3D]">Lição Iniciática</h2>
                    </div>
                    <p className="font-body text-[18px] leading-[1.8] text-[#3D1429] font-black">{arcano.initiationLesson}</p>
                  </>
                )}
              </div>


            </div>
          )}

          {phase === "simbolos" && (
            <SymbolMap
              cardImage={arcano.cardImage}
              cardName={arcano.name}
              symbols={arcano.symbolsMap || []}
              onComplete={goNext}
            />
          )}

          {phase === "luz-sombra" && (
            <div className="space-y-6">
              <LessonPhaseHeader 
                cardImage={arcano.cardImage} 
                cardName={arcano.name} 
                numeral={arcano.numeral}
                subtitle="Dualidade e Equilíbrio"
              />
              <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 border-2 border-[#C8A66A]/20 shadow-xl space-y-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">☀</span>
                    <h2 className="font-heading text-xs tracking-[0.3em] uppercase font-black text-[#8B6A30]">Luz</h2>
                  </div>
                  <p className="font-body text-[18px] leading-[1.8] text-[#3D1429] font-black">{arcano.layers.main.light}</p>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">☾</span>
                    <h2 className="font-heading text-xs tracking-[0.3em] uppercase font-black text-[#5B1F3D]/60">Sombra</h2>
                  </div>
                  <p className="font-body text-[18px] leading-[1.8] text-[#3D1429] font-black">{arcano.layers.main.shadow}</p>
                </div>
                <Button onClick={goNext} className="w-full h-auto py-5 bg-[#5B1F3D] text-white rounded-2xl border-2 border-[#C8A66A] font-black uppercase text-xs tracking-widest shadow-xl hover:scale-[1.02] transition-transform">
                  Continuar para Voz da Carta
                </Button>
              </div>
            </div>
          )}


          {phase === "voz" && (
            <div className="space-y-6">
              <LessonPhaseHeader 
                cardImage={arcano.cardImage} 
                cardName={arcano.name} 
                numeral={arcano.numeral}
                variant="aura"
              />
              <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 border-2 border-[#C8A66A]/20 shadow-xl space-y-8 relative overflow-hidden">
                <div className="flex items-center gap-3 relative z-10">
                  <Sparkles className="w-5 h-5 text-[#C8A66A]" />
                  <h2 className="font-heading text-xs tracking-[0.3em] uppercase font-black text-[#5B1F3D]">Voz da Carta</h2>
                </div>
                <blockquote className="font-accent italic text-2xl leading-[1.7] pl-6 border-l-4 border-[#C8A66A] text-[#5B1F3D] font-bold relative z-10">
                  {arcano.voiceText || arcano.layers.main.essence}
                </blockquote>
                <Button onClick={goNext} className="w-full h-auto py-5 bg-[#5B1F3D] text-white rounded-2xl border-2 border-[#C8A66A] font-black uppercase text-xs tracking-widest shadow-xl hover:scale-[1.02] transition-transform relative z-10">
                  Continuar para Aprofundamento
                </Button>
              </div>
            </div>
          )}


          {phase === "aprofundamento" && (
            <div className="space-y-6">
              <LessonPhaseHeader 
                cardImage={arcano.cardImage} 
                cardName={arcano.name} 
                numeral={arcano.numeral}
                subtitle="Sabedoria Oculta"
              />
              <div className="space-y-8">
                <DeepDiveSection {...arcano.layers.deepDive} />
                <Button onClick={goNext} className="w-full h-auto py-5 bg-[#5B1F3D] text-white rounded-2xl border-2 border-[#C8A66A] font-black uppercase text-xs tracking-widest shadow-xl hover:scale-[1.02] transition-transform">
                  Continuar para Aplicações
                </Button>
              </div>
            </div>
          )}


          {phase === "aplicacoes" && (
            <div className="space-y-6">
              <LessonPhaseHeader 
                cardImage={arcano.cardImage} 
                cardName={arcano.name} 
                numeral={arcano.numeral}
                subtitle="O Arcano no Dia a Dia"
              />
              <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 border-2 border-[#C8A66A]/20 shadow-xl space-y-8">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-[#C8A66A]" />
                  <h2 className="font-heading text-xs tracking-[0.3em] uppercase font-black text-[#5B1F3D]">Aplicações</h2>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm uppercase font-black text-[#8B6A30]">Amor:</span>
                  </div>
                  <p className="font-body text-[17px] leading-relaxed text-[#3D1429] font-black">
                    {arcano.lessonSections.find(s => s.id === "amor")?.content}
                  </p>
                  
                  <div className="flex items-center gap-2 pt-4">
                    <span className="text-sm uppercase font-black text-[#8B6A30]">Trabalho:</span>
                  </div>
                  <p className="font-body text-[17px] leading-relaxed text-[#3D1429] font-black">
                    {arcano.lessonSections.find(s => s.id === "trabalho")?.content}
                  </p>

                  <div className="flex items-center gap-2 pt-4">
                    <span className="text-sm uppercase font-black text-[#8B6A30]">Espiritualidade:</span>
                  </div>
                  <p className="font-body text-[17px] leading-relaxed text-[#3D1429] font-black">
                    {arcano.lessonSections.find(s => s.id === "espiritualidade")?.content}
                  </p>

                </div>


                <Button onClick={goNext} className="w-full h-auto py-5 bg-[#5B1F3D] text-white rounded-2xl border-2 border-[#C8A66A] font-black uppercase text-xs tracking-widest shadow-xl hover:scale-[1.02] transition-transform">
                  Continuar para Reflexão
                </Button>
              </div>
            </div>
          )}


          {phase === "reflexao" && (
            <div className="space-y-6">
              <LessonPhaseHeader 
                cardImage={arcano.cardImage} 
                cardName={arcano.name} 
                numeral={arcano.numeral}
                subtitle="Exercício de Conexão"
              />
              <div className="space-y-8">
                <ExerciseSection
                  {...arcano.layers.exercise}
                  onComplete={() => {}}
                  completed={true}
                />
                <Button onClick={goNext} className="w-full h-auto py-5 bg-[#5B1F3D] text-white rounded-2xl border-2 border-[#C8A66A] font-black uppercase text-xs tracking-widest shadow-xl hover:scale-[1.02] transition-transform">
                  Iniciar Quiz Final
                </Button>
              </div>
            </div>
          )}


          {phase === "quiz" && (
            <div className="space-y-6">
              <LessonPhaseHeader 
                cardImage={arcano.cardImage} 
                cardName={arcano.name} 
                numeral={arcano.numeral}
                subtitle="Integração de Saberes"
              />
              <QuizSection
                questions={arcano.quiz}
                onComplete={handleQuizComplete}
              />
            </div>
          )}


          {phase === "complete" && (
            <CompletionScreen
              arcanoName={arcano.name}
              cardImage={arcano.cardImage}
              arcanoId={arcanoId}

              pontosEarned={pontosEarned}
              quizScore={lastQuizScore}
              quizTotal={lastQuizTotal}
              nextArcano={nextArcano ? { id: nextArcano.id, name: nextArcano.name, numeral: nextArcano.numeral, subtitle: nextArcano.subtitle } : undefined}
              isLastArcano={arcanoId === 21}
              onNextArcano={() => {
                if (nextArcano) {
                  navigate(`/lesson/${arcanoId + 1}`);
                  window.scrollTo(0, 0);
                  setPhaseIdx(0);
                }
              }}
              onBackToMap={() => navigate("/module/arcanos-maiores")}
              onPrevArcano={() => {}}
            />
          )}
        </section>
      </main>

      {showUnlockMoment && nextArcano && (
        <ArcanoUnlockMoment
          arcanoId={nextArcano.id}
          cardName={nextArcano.name}
          cardImage={getArcanoById(nextArcano.id)?.cardImage || ""}
          arcanoSlug={nextArcano.id === 1 ? "o-mago" : "generic"}
          onContinue={() => {
            setShowUnlockMoment(false);
          }}
        />
      )}
    </div>
  );
};

export default LessonPage;