import React, { useEffect, useState } from "react";


import { 
  O_LOUCO, 
  editorialToLegacy 
} from "@/content/arcanos-maiores";

import { ArcanoVivoStage } from "@/components/tarot-motion/ArcanoVivoStage";
import { LessonPhaseHeader } from "@/components/arcano-vivo/LessonPhaseHeader";
import { DeepDiveSection } from "@/components/DeepDiveSection";
import { ExerciseSection } from "@/components/ExerciseSection";
import { QuizSection } from "@/components/QuizSection";
import { CompletionScreen } from "@/components/arcano-vivo/CompletionScreen";
import { Button } from "@/components/ui/button";
import { PhaseIndicator } from "@/components/arcano-vivo/PhaseIndicator";
import { Sparkles } from "lucide-react";

const PHASE_ORDER = [
  "intro", "simbolos", "luz-sombra", "voz", "aprofundamento", 
  "aplicacoes", "reflexao", "quiz", "complete"
];

const AuditVisualPage = () => {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const arcano = getArcanoById(0); // O Louco
  const phase = PHASE_ORDER[phaseIdx];

  const goNext = () => setPhaseIdx(prev => Math.min(prev + 1, PHASE_ORDER.length - 1));
  const goPrev = () => setPhaseIdx(prev => Math.max(prev - 1, 0));

  if (!arcano) return <div>Carregando...</div>;

  return (
    <div className="min-h-screen bg-[#FAF5EF] pb-32">
      <header className="sticky top-0 z-50 bg-[#FAF5EF] border-b-2 border-[#C8A66A]/20 p-4 flex flex-col items-center gap-2">
        <div className="flex justify-between w-full max-w-lg items-center">
           <button onClick={goPrev} className="text-[10px] font-black uppercase text-[#5B1F3D]">Anterior</button>
           <div className="text-center">
             <h1 className="font-heading text-[#5B1F3D] font-black text-sm uppercase">Audit Visual: {phase}</h1>
             <p className="text-[9px] text-[#C8A66A] font-black">Fase {phaseIdx + 1} de 9</p>
           </div>
           <button onClick={goNext} className="text-[10px] font-black uppercase text-[#5B1F3D]">Próxima</button>
        </div>
        <PhaseIndicator phases={PHASE_ORDER} currentIndex={phaseIdx} />
      </header>

      <main className="container max-w-lg mx-auto px-4 py-8">
        {phase === "intro" && (
           <div className="space-y-8">
             <img src={arcano.cardImage} alt={arcano.name} className="w-32 aspect-[2/3] mx-auto rounded-lg shadow-xl" />
             <div className="text-center">
               <h2 className="text-3xl font-heading font-black text-[#5B1F3D]">{arcano.name}</h2>
               <p className="text-sm italic text-[#C8A66A] font-black">"{arcano.layers.main.essence.substring(0, 50)}..."</p>
             </div>
           </div>
        )}


        {phase === "luz-sombra" && (
          <div className="space-y-6">
            <LessonPhaseHeader cardImage={arcano.cardImage} cardName={arcano.name} numeral={arcano.numeral} subtitle="Dualidade e Equilíbrio" />
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
              <Button onClick={goNext} className="w-full h-auto py-5 bg-[#5B1F3D] text-white rounded-2xl border-2 border-[#C8A66A] font-black uppercase text-xs tracking-widest shadow-xl">Continuar</Button>
            </div>
          </div>
        )}

        {phase === "voz" && (
          <div className="space-y-6">
            <LessonPhaseHeader cardImage={arcano.cardImage} cardName={arcano.name} numeral={arcano.numeral} variant="aura" />
            <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 border-2 border-[#C8A66A]/20 shadow-xl space-y-8 relative overflow-hidden">
              <div className="flex items-center gap-3 relative z-10">
                <Sparkles className="w-5 h-5 text-[#C8A66A]" />
                <h2 className="font-heading text-xs tracking-[0.3em] uppercase font-black text-[#5B1F3D]">Voz da Carta</h2>
              </div>
              <blockquote className="font-accent italic text-2xl leading-[1.7] pl-6 border-l-4 border-[#C8A66A] text-[#5B1F3D] font-bold relative z-10">
                {arcano.voiceText}
              </blockquote>

              <Button onClick={goNext} className="w-full h-auto py-5 bg-[#5B1F3D] text-white rounded-2xl border-2 border-[#C8A66A] font-black uppercase text-xs tracking-widest shadow-xl">Continuar</Button>
            </div>
          </div>
        )}

        {phase === "aprofundamento" && (
          <div className="space-y-6">
            <LessonPhaseHeader cardImage={arcano.cardImage} cardName={arcano.name} numeral={arcano.numeral} subtitle="Sabedoria Oculta" />
            <DeepDiveSection {...arcano.layers.deepDive} />
            <Button onClick={goNext} className="w-full h-auto py-5 bg-[#5B1F3D] text-white rounded-2xl border-2 border-[#C8A66A] font-black uppercase text-xs tracking-widest shadow-xl">Continuar</Button>
          </div>
        )}

        {phase === "aplicacoes" && (
          <div className="space-y-6">
            <LessonPhaseHeader cardImage={arcano.cardImage} cardName={arcano.name} numeral={arcano.numeral} subtitle="O Arcano no Dia a Dia" />
            <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 border-2 border-[#C8A66A]/20 shadow-xl space-y-8">
              <div className="space-y-6">
                <h2 className="font-heading text-xs tracking-[0.3em] uppercase font-black text-[#5B1F3D]">Aplicações</h2>
                <div className="space-y-4">
                  <p className="font-body text-[17px] leading-relaxed text-[#3D1429] font-black"><strong>Amor:</strong> {arcano.lessonSections.find(s => s.id === 'amor')?.content}</p>
                  <p className="font-body text-[17px] leading-relaxed text-[#3D1429] font-black"><strong>Trabalho:</strong> {arcano.lessonSections.find(s => s.id === 'trabalho')?.content}</p>
                </div>

              </div>
              <Button onClick={goNext} className="w-full h-auto py-5 bg-[#5B1F3D] text-white rounded-2xl border-2 border-[#C8A66A] font-black uppercase text-xs tracking-widest shadow-xl">Continuar</Button>
            </div>
          </div>
        )}

        {phase === "reflexao" && (
          <div className="space-y-6">
            <LessonPhaseHeader cardImage={arcano.cardImage} cardName={arcano.name} numeral={arcano.numeral} subtitle="Exercício de Conexão" />
            <ExerciseSection instruction={arcano.initiationLesson} type="reflection" onComplete={goNext} completed={false} />
          </div>
        )}

        {phase === "quiz" && (
          <div className="space-y-6">
            <LessonPhaseHeader cardImage={arcano.cardImage} cardName={arcano.name} numeral={arcano.numeral} subtitle="Integração de Saberes" />
            <QuizSection questions={arcano.quiz} onComplete={goNext} />
          </div>
        )}

        {phase === "complete" && (
          <CompletionScreen
            arcanoName={arcano.name}
            cardImage={arcano.cardImage}
            pontosEarned={100}
            quizScore={5}
            quizTotal={5}
            isLastArcano={false}
            onNextArcano={() => {}}
            onPrevArcano={() => {}}
            onBackToMap={() => {}}
          />
        )}
      </main>
    </div>
  );
};

export default AuditVisualPage;
