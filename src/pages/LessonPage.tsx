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
import { ArrowLeft, ArrowRight, Check, Sparkles, BookOpen, Heart, Briefcase, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHeader } from "@/contexts/header-context";
import { PhaseIndicator } from "@/components/arcano-vivo/PhaseIndicator";
import { LessonPhaseHeader } from "@/components/arcano-vivo/LessonPhaseHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageBackControls } from "@/components/PageBackControls";



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
  | "essence"
  | "light"
  | "shadow"
  | "simbolos" 
  | "voz" 
  | "dimensoes"
  | "aplicacoes" 
  | "quiz" 
  | "complete"
  | "legacy-content";

const PHASE_ORDER: LessonPhase[] = [
  "intro",
  "essence",
  "light",
  "shadow",
  "simbolos",
  "voz",
  "dimensoes",
  "aplicacoes",
  "quiz",
  "complete",
  "legacy-content"
];

const PHASE_LABEL: Record<LessonPhase, string> = {
  intro: "Abertura",
  essence: "Essência",
  light: "Luz",
  shadow: "Sombra",
  simbolos: "Símbolos",
  voz: "Voz da Carta",
  dimensoes: "Dimensões da Vida",
  aplicacoes: "Prática",
  quiz: "Quiz Final",
  complete: "Chave Conquistada",
  "legacy-content": "Aprofundamento Editorial",
};

const LessonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const arcanoId = parseInt(id || "0", 10);
  const isValidId = !isNaN(arcanoId) && arcanoId >= 0 && arcanoId <= 21;
  const isLiteralRoute = id === ":id";

  const { completeLesson, completeQuiz, earnBadge } = useProgress();
  const { loading: premiumLoading } = usePremium();
  const { isStaff, loading: roleLoading } = useRole();
  const { canAccessArcano, hasFullAccess, loading: accessLoading } = useAccess();
  const { setHeader, resetHeader } = useHeader();
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phase = PHASE_ORDER[phaseIdx];
  
  const arcano = getArcanoById(isValidId ? arcanoId : 0);
  const hasAccess = (isValidId ? canAccessArcano(arcanoId) : false) || isStaff;



  const [keyEarned, setKeyEarned] = useState(false);
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
        backRoute: phaseIdx > 0 ? undefined : "/module/arcanos-maiores",
        rightElement: <PhaseIndicator phases={PHASE_ORDER} currentIndex={phaseIdx} />,
        hidePontos: false,
        hideStreak: false
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
              className="w-full h-auto py-5 px-4 rounded-2xl font-heading text-[13px] tracking-[0.1em] uppercase transition-all shadow-xl hover:scale-105 active:scale-95 bg-[#5B1F3D] text-white border-2 border-[#C8A66A] font-black leading-tight text-center"
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
    const isMago = arcanoId === 1;
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
              message={isMago 
                ? "Você despertou a primeira chave: O Louco. Agora a jornada continua com O Mago, o arcano da vontade, da direção e do primeiro ato consciente."
                : "Conteúdo exclusivo para assinantes da Jornada Completa."
              }
              ctaText="Desbloquear minha jornada"
            />
          </div>
          {isMago && (
            <button 
              onClick={() => navigate("/lesson/0")} 
              className="w-full h-auto bg-white text-[#5B1F3D] py-4 px-4 rounded-2xl font-heading font-black text-xs tracking-[0.1em] uppercase border-2 border-[#C8A66A]/40 shadow-md transition-all hover:scale-105 active:scale-95 leading-tight text-center"
            >
              Revisar O Louco
            </button>
          )}
        </div>
      </div>
    );
  }

  const goNext = () => {
    if (phaseIdx < PHASE_ORDER.length - 1) {
      setPhaseIdx(phaseIdx + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goBack = () => {
    if (phaseIdx > 0) {
      setPhaseIdx(phaseIdx - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(-1);
    }
  };

  const handleQuizComplete = (score: number, total: number) => {
    // Duolingo Rule: Progress only saved after quiz
    completeQuiz(`quiz-arcano-${arcano.id}`, score, total);
    completeLesson(`arcano-${arcano.id}`);
    if (arcano.id === 0) {
      earnBadge("fool-complete");
      setShowUnlockMoment(true);
226:       setKeyEarned(true);
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
        {phase !== "complete" && (
          <PageBackControls 
            variant="top" 
            showLabel={true} 
            className="mb-6 h-auto p-0" 
            fallbackRoute={phaseIdx > 0 ? undefined : "/module/arcanos-maiores"}
          />
        )}


        <section className="space-y-8 animate-fade-in">
          {phase === "intro" && (
            <div className="space-y-8" data-lesson-wrapper={arcanoId}>
              <ArcanoVivoStage
                key={`arcano-stage-${arcanoId}`}
                arcanoId={arcanoId}
                cardName={arcano.name}
                cardImage={arcano.cardImage}
                arcanoSlug={arcano.name.toLowerCase().replace(/\s+/g, "-")}
                onContinue={goNext}
                introText={arcano.id === 3 ? "Eu sou a Imperatriz. Sou a terra que gera, o ventre que acolhe, a mão que nutre." : arcano.firstPersonIntro}
                presenceText={arcano.id === 3 ? "Em mim, a vida encontra forma, cor, textura e prazer. Eu não penso a criação — eu a sinto nascer." : arcano.voiceText}
              />
            </div>
          )}

          {phase === "essence" && (
            <div className="space-y-6">
              <LessonPhaseHeader 
                cardImage={arcano.cardImage} 
                cardName={arcano.name} 
                numeral={arcano.numeral}
                subtitle="A Essência"
                showBack={phaseIdx > 0}
                onBack={goBack}
              />
              <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 border-2 border-[#C8A66A]/20 shadow-xl space-y-8">
                <p className="font-body text-[20px] leading-[1.8] text-[#3D1429] font-black">
                  {arcano.layers.main.essence}
                </p>
                <div className="pt-4">
                  <Button onClick={goNext} className="w-full h-auto py-5 bg-[#5B1F3D] text-white rounded-2xl border-2 border-[#C8A66A] font-black uppercase text-[13px] tracking-widest shadow-xl hover:scale-[1.02] transition-transform leading-tight">
                    Continuar para Luz
                  </Button>
                </div>
              </div>
            </div>
          )}

          {phase === "light" && (
            <div className="space-y-6">
              <LessonPhaseHeader 
                cardImage={arcano.cardImage} 
                cardName={arcano.name} 
                numeral={arcano.numeral}
                subtitle="A Luz"
                showBack={true}
                onBack={goBack}
              />
              <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 border-2 border-[#C8A66A]/20 shadow-xl space-y-8">
                <p className="font-body text-[20px] leading-[1.8] text-[#3D1429] font-black">
                  {arcano.layers.main.light}
                </p>
                <div className="pt-4">
                  <Button onClick={goNext} className="w-full h-auto py-5 bg-[#5B1F3D] text-white rounded-2xl border-2 border-[#C8A66A] font-black uppercase text-[13px] tracking-widest shadow-xl hover:scale-[1.02] transition-transform leading-tight">
                    Continuar para Sombra
                  </Button>
                </div>
              </div>
            </div>
          )}

          {phase === "shadow" && (
            <div className="space-y-6">
              <LessonPhaseHeader 
                cardImage={arcano.cardImage} 
                cardName={arcano.name} 
                numeral={arcano.numeral}
                subtitle="A Sombra"
                showBack={true}
                onBack={goBack}
              />
              <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 border-2 border-[#C8A66A]/20 shadow-xl space-y-8">
                <p className="font-body text-[20px] leading-[1.8] text-[#3D1429] font-black">
                  {arcano.layers.main.shadow}
                </p>
                <div className="pt-4">
                  <Button onClick={goNext} className="w-full h-auto py-5 bg-[#5B1F3D] text-white rounded-2xl border-2 border-[#C8A66A] font-black uppercase text-[13px] tracking-widest shadow-xl hover:scale-[1.02] transition-transform leading-tight">
                    Continuar para Símbolos
                  </Button>
                </div>
              </div>
            </div>
          )}

          {phase === "simbolos" && (
            <div className="space-y-6">
              <LessonPhaseHeader 
                cardImage={arcano.cardImage} 
                cardName={arcano.name} 
                numeral={arcano.numeral}
                subtitle="Símbolos Sagrados"
                showBack={true}
                onBack={goBack}
              />
              <SymbolMap
                cardImage={arcano.cardImage}
                cardName={arcano.name}
                symbols={arcano.symbolsMap || []}
                onComplete={goNext}
              />
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#C8A66A]/20 shadow-lg">
                <Button onClick={goNext} className="w-full h-auto py-5 bg-[#5B1F3D] text-white rounded-2xl border-2 border-[#C8A66A] font-black uppercase text-[13px] tracking-widest shadow-xl hover:scale-[1.02] transition-transform leading-tight">
                  Continuar para Voz
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
              <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 border-2 border-[#C8A66A]/20 shadow-xl space-y-8">
                <blockquote className="font-accent italic text-2xl leading-[1.7] pl-6 border-l-4 border-[#C8A66A] text-[#5B1F3D] font-bold">
                  {arcano.voiceText}
                </blockquote>
                
                {arcano.id === 0 && (
                  <div className="pt-6 space-y-6">
                    <div className="h-px bg-[#C8A66A]/20" />
                    <Button onClick={goNext} className="w-full h-auto py-5 bg-[#5B1F3D] text-white rounded-2xl border-2 border-[#C8A66A] font-black uppercase text-[13px] tracking-widest shadow-xl hover:scale-[1.02] transition-transform leading-tight">
                      Continuar para Dimensões
                    </Button>
                  </div>
                )}

                {arcano.id !== 0 && (
                  <Button onClick={goNext} className="w-full h-auto py-5 bg-[#5B1F3D] text-white rounded-2xl border-2 border-[#C8A66A] font-black uppercase text-[13px] tracking-widest shadow-xl hover:scale-[1.02] transition-transform leading-tight">
                    Continuar para Aplicações
                  </Button>
                )}
              </div>
            </div>
          )}

          {phase === "dimensoes" && (
            <div className="space-y-6">
              <LessonPhaseHeader 
                cardImage={arcano.cardImage} 
                cardName={arcano.name} 
                numeral={arcano.numeral}
                subtitle="Dimensões da Vida"
                showBack={true}
                onBack={goBack}
              />
              
              <Tabs defaultValue="amor" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-white/50 border border-[#C8A66A]/20 h-auto p-1 rounded-2xl">
                  <TabsTrigger value="amor" className="py-3 rounded-xl data-[state=active]:bg-[#5B1F3D] data-[state=active]:text-white flex flex-col gap-1">
                    <Heart className="w-4 h-4" />
                    <span className="text-[9px] uppercase font-black tracking-widest">Amor</span>
                  </TabsTrigger>
                  <TabsTrigger value="trabalho" className="py-3 rounded-xl data-[state=active]:bg-[#5B1F3D] data-[state=active]:text-white flex flex-col gap-1">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-[9px] uppercase font-black tracking-widest">Trabalho</span>
                  </TabsTrigger>
                  <TabsTrigger value="espiritualidade" className="py-3 rounded-xl data-[state=active]:bg-[#5B1F3D] data-[state=active]:text-white flex flex-col gap-1">
                    <Moon className="w-4 h-4" />
                    <span className="text-[9px] uppercase font-black tracking-widest">Espírito</span>
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-[2rem] border-2 border-[#C8A66A]/20 shadow-xl overflow-hidden">
                  <TabsContent value="amor" className="p-8 m-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 border-b border-[#C8A66A]/10 pb-4">
                        <Heart className="w-5 h-5 text-[#5B1F3D]" />
                        <h3 className="font-heading text-xl text-[#5B1F3D] font-bold">{arcano.name} no Amor</h3>
                      </div>
                      <div className="space-y-8">
                        {Object.entries(arcano.love || {}).map(([key, value]) => (
                          <div key={key} className="space-y-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${key === 'light' ? 'bg-[#C8A66A]' : 'bg-[#5B1F3D]'}`} />
                              <span className="text-[11px] font-heading font-black tracking-[0.2em] uppercase text-[#C8A66A]">
                                {key === 'light' ? 'Luz / Potencial' : key === 'shadow' ? 'Sombra / Alerta' : key}
                              </span>
                            </div>
                            <p className="font-body text-[18px] leading-[1.7] text-[#3D1429] font-black pl-4 border-l-2 border-[#C8A66A]/10">
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="trabalho" className="p-8 m-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 border-b border-[#C8A66A]/10 pb-4">
                        <Briefcase className="w-5 h-5 text-[#5B1F3D]" />
                        <h3 className="font-heading text-xl text-[#5B1F3D] font-bold">{arcano.name} no Trabalho</h3>
                      </div>
                      <div className="space-y-8">
                        {Object.entries(arcano.work || {}).map(([key, value]) => (
                          <div key={key} className="space-y-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${key === 'light' ? 'bg-[#C8A66A]' : 'bg-[#5B1F3D]'}`} />
                              <span className="text-[11px] font-heading font-black tracking-[0.2em] uppercase text-[#C8A66A]">
                                {key === 'light' ? 'Luz / Potencial' : key === 'shadow' ? 'Sombra / Alerta' : key}
                              </span>
                            </div>
                            <p className="font-body text-[18px] leading-[1.7] text-[#3D1429] font-black pl-4 border-l-2 border-[#C8A66A]/10">
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="espiritualidade" className="p-8 m-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 border-b border-[#C8A66A]/10 pb-4">
                        <Moon className="w-5 h-5 text-[#5B1F3D]" />
                        <h3 className="font-heading text-xl text-[#5B1F3D] font-bold">{arcano.name} na Espiritualidade</h3>
                      </div>
                      <div className="space-y-8">
                        {Object.entries(arcano.spirituality || {}).map(([key, value]) => (
                          <div key={key} className="space-y-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${key === 'light' ? 'bg-[#C8A66A]' : 'bg-[#5B1F3D]'}`} />
                              <span className="text-[11px] font-heading font-black tracking-[0.2em] uppercase text-[#C8A66A]">
                                {key === 'light' ? 'Luz / Potencial' : key === 'shadow' ? 'Sombra / Alerta' : key}
                              </span>
                            </div>
                            <p className="font-body text-[18px] leading-[1.7] text-[#3D1429] font-black pl-4 border-l-2 border-[#C8A66A]/10">
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
              <PageBackControls variant="bottom" className="mt-8" />
            </div>
          )}


          {phase === "aplicacoes" && (
            <div className="space-y-6">
              <LessonPhaseHeader 
                cardImage={arcano.cardImage} 
                cardName={arcano.name} 
                numeral={arcano.numeral}
                subtitle="Prática"
                showBack={true}
                onBack={goBack}
              />
              <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 border-2 border-[#C8A66A]/20 shadow-xl space-y-8">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-[#C8A66A]" />
                  <h2 className="font-heading text-[13px] tracking-[0.3em] uppercase font-black text-[#5B1F3D]">Aplicação Real</h2>
                </div>
                <Button onClick={goNext} className="w-full h-auto py-5 bg-[#5B1F3D] text-white rounded-2xl border-2 border-[#C8A66A] font-black uppercase text-[13px] tracking-widest shadow-xl hover:scale-[1.02] transition-transform leading-tight">
                  Ir para o Quiz Final
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
                showBack={true}
                onBack={goBack}
              />
              <QuizSection
                questions={arcano.quiz}
                onComplete={handleQuizComplete}
              />
              
              <div className="mt-12 pt-8 border-t border-[#C8A66A]/20">
                <button 
                  onClick={() => {
                    setPhaseIdx(PHASE_ORDER.indexOf("legacy-content"));
                    window.scrollTo(0, 0);
                  }}
                  className="w-full py-4 rounded-xl border border-[#C8A66A]/30 font-heading text-[12px] font-black tracking-widest uppercase text-[#5B1F3D]/60 hover:text-[#5B1F3D] hover:bg-white transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Ver explicação completa do arcano
                </button>
              </div>
            </div>
          )}

          {phase === "legacy-content" && (
            <div className="space-y-6">
              <LessonPhaseHeader 
                cardImage={arcano.cardImage} 
                cardName={arcano.name} 
                numeral={arcano.numeral}
                subtitle="Aprofundamento Editorial"
                showBack={true}
                onBack={goBack}
              />
              <LessonContent 
                sections={arcano.lessonSections}
                essence={arcano.layers.main.essence}
                light={arcano.layers.main.light}
                shadow={arcano.layers.main.shadow}
                onComplete={() => setPhaseIdx(PHASE_ORDER.indexOf("quiz"))}
                onGoDeepDive={() => {}}
                onGoExercise={() => {}}
                onSkipToQuiz={() => setPhaseIdx(PHASE_ORDER.indexOf("quiz"))}
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
