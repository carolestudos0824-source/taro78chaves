import { useState } from "react";
import { BookOpen, Layers, Eye, ChevronDown, Heart, Briefcase, Sparkles, Feather } from "lucide-react";
import { type LessonSection } from "@/lib/content/runtime-types";

interface QuickReviewItem {
  keyword: string;
  meaning: string;
}

interface ReflectionQuestion {
  id: string;
  question: string;
}

interface LessonContentProps {
  sections: LessonSection[];
  essence: string;
  light: string;
  shadow: string;
  onComplete: () => void;
  onGoDeepDive: () => void;
  onGoExercise: () => void;
  onSkipToQuiz: () => void;
  quickReview?: QuickReviewItem[];
  reflectionQuestions?: ReflectionQuestion[];
  initiationLesson?: string;
}

/**
 * Phase 2: Pedagogical content in progressive steps
 * Mobile-first card-based layout with expandable sections
 * EMERGENCY RESTORATION: All 16 sections explicitly rendered.
 */
export function LessonContent(props: LessonContentProps) {
  const {
    sections = [], essence, light, shadow,
    onComplete, onGoDeepDive, onGoExercise, onSkipToQuiz,
    initiationLesson,
  } = props;
  const [openSection, setOpenSection] = useState<string | null>(null);

  // Mapeamento manual para garantir ordem e existência
  const getSection = (id: string) => sections.find(s => s.id === id);

  const appliedIcons: Record<string, any> = {
    amor: Heart,
    trabalho: Briefcase,
    espiritualidade: Sparkles,
  };

  const appliedColors: Record<string, { bg: string; border: string; accent: string }> = {
    amor: { bg: "rgba(91, 31, 61, 0.1)", border: "rgba(91, 31, 61, 0.3)", accent: "#5B1F3D" },
    trabalho: { bg: "rgba(200, 166, 106, 0.12)", border: "rgba(200, 166, 106, 0.4)", accent: "#8B6A30" },
    espiritualidade: { bg: "rgba(91, 31, 61, 0.08)", border: "rgba(91, 31, 61, 0.25)", accent: "#5B1F3D" },
  };

  const renderAccordionSection = (sectionId: string) => {
    const section = getSection(sectionId);
    if (!section) return null;

    const isOpen = openSection === sectionId;
    const isApplied = ["amor", "trabalho", "espiritualidade"].includes(sectionId);
    
    if (isApplied) {
      const colors = appliedColors[sectionId] || appliedColors.amor;
      const Icon = appliedIcons[sectionId] || Heart;
      
      const parts = section.content.split(/Na sombra:/);
      const lightText = parts[0]?.replace(/^Na luz:\s*/, "").trim();
      const shadowText = parts[1]?.trim();

      return (
        <div key={section.id} className="rounded-2xl overflow-hidden bg-white border-2 border-[#C8A66A]/30 shadow-md mb-6 transition-all hover:shadow-lg">
          <button
            onClick={() => setOpenSection(isOpen ? null : section.id)}
            className="w-full px-5 py-5 flex items-center gap-4 text-left"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: colors.bg, border: `1px solid ${colors.border}` }}>
              <Icon className="w-5 h-5" style={{ color: colors.accent }} />
            </div>
            <span className="font-heading text-md font-bold text-[#5B1F3D] flex-1">{section.title}</span>
            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} style={{ color: "#C8A66A" }} />
          </button>
          
          {isOpen && (
            <div className="px-5 pb-5 space-y-4">
              <div className="h-px bg-gradient-to-r from-transparent via-[#C8A66A]/20 to-transparent mb-4" />
              {lightText && shadowText ? (
                <div className="space-y-4">
                  <div className="rounded-xl p-4 bg-[#C8A66A]/5 border border-[#C8A66A]/10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[#8B6A30]">☀</span>
                      <span className="text-[10px] font-heading font-black tracking-widest uppercase text-[#8B6A30]">Luz</span>
                    </div>
                    <p className="text-[14px] leading-relaxed text-[#5B1F3D] font-medium">{lightText}</p>
                  </div>
                  <div className="rounded-xl p-4 bg-[#5B1F3D]/5 border border-[#5B1F3D]/10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[#5B1F3D]">☾</span>
                      <span className="text-[10px] font-heading font-black tracking-widest uppercase text-[#5B1F3D]">Sombra</span>
                    </div>
                    <p className="text-[14px] leading-relaxed text-[#5B1F3D] font-medium">{shadowText}</p>
                  </div>
                </div>
              ) : (
                <p className="text-[14px] leading-relaxed text-[#5B1F3D] font-medium whitespace-pre-line">{section.content}</p>
              )}
            </div>
          )}
        </div>
      );
    }

    // Default accordion for core sections
    return (
      <div key={section.id} className="rounded-2xl overflow-hidden bg-white border-2 border-[#C8A66A]/30 shadow-md mb-6 transition-all hover:shadow-lg">
        <button
          onClick={() => setOpenSection(isOpen ? null : section.id)}
          className="w-full px-5 py-5 flex items-center gap-4 text-left"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white border-2 border-[#C8A66A]/30 shadow-sm">
            <span className="text-lg">{section.icon || "✦"}</span>
          </div>
          <span className="font-heading text-md font-bold text-[#5B1F3D] flex-1">{section.title}</span>
          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} style={{ color: "#C8A66A" }} />
        </button>
        
        {isOpen && (
          <div className="px-5 pb-6">
            <div className="h-px bg-gradient-to-r from-transparent via-[#C8A66A]/20 to-transparent mb-4" />
            <p className="text-[15px] leading-relaxed text-[#5B1F3D] font-medium whitespace-pre-line">{section.content}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-10 pb-32 w-full max-w-full overflow-x-hidden">
      {/* 0. Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#C8A66A]" />
          <span className="text-[10px] font-heading tracking-[0.25em] uppercase text-[#C8A66A]">
            Lição do Arcano
          </span>
        </div>
        <button onClick={onSkipToQuiz} className="text-[10px] font-heading tracking-wider text-[#C8A66A]/80 hover:text-[#C8A66A]">
          Ir ao Quiz →
        </button>
      </div>

      {/* 1, 2, 3: Essência, Luz, Sombra (Destaque Inicial) */}
      <div className="grid gap-4">
        {essence && (
          <div className="rounded-2xl bg-white border border-[#C8A66A]/50 p-6 shadow-[0_8px_30px_rgb(91,31,61,0.06)] transition-all">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl w-10 h-10 rounded-full flex items-center justify-center bg-[#C8A66A]/10 text-[#C8A66A] border border-[#C8A66A]/20">✦</span>
              <h3 className="font-heading text-xl font-black text-[#5B1F3D]">Essência</h3>
            </div>
            <p className="text-[17px] leading-[1.8] text-[#5B1F3D] font-medium selection:bg-[#C8A66A]/20">{essence}</p>
          </div>
        )}

        {light && (
          <div className="rounded-2xl bg-white border border-[#C8A66A]/50 p-6 shadow-[0_8px_30px_rgb(91,31,61,0.06)] transition-all">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl w-10 h-10 rounded-full flex items-center justify-center bg-[#C8A66A]/10 text-[#C8A66A] border border-[#C8A66A]/20">☀</span>
              <h3 className="font-heading text-xl font-black text-[#5B1F3D]">Luz</h3>
            </div>
            <p className="text-[17px] leading-[1.8] text-[#5B1F3D] font-medium selection:bg-[#C8A66A]/20">{light}</p>
          </div>
        )}

        {shadow && (
          <div className="rounded-2xl bg-white border border-[#C8A66A]/50 p-6 shadow-[0_8px_30px_rgb(91,31,61,0.06)] transition-all">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl w-10 h-10 rounded-full flex items-center justify-center bg-[#C8A66A]/10 text-[#C8A66A] border border-[#C8A66A]/20">☾</span>
              <h3 className="font-heading text-xl font-black text-[#5B1F3D]">Sombra</h3>
            </div>
            <p className="text-[17px] leading-[1.8] text-[#5B1F3D] font-medium selection:bg-[#C8A66A]/20">{shadow}</p>
          </div>
        )}
      </div>

      {/* 4. Título Interpretações Práticas */}
      <div className="flex items-center gap-2 px-2 pt-4">
        <Eye className="w-4 h-4 text-[#5B1F3D]/60" />
        <span className="text-[10px] font-heading font-black tracking-[0.2em] uppercase text-[#5B1F3D]/60">Interpretações Práticas</span>
      </div>
      
      {/* 5, 6, 7: Amor, Trabalho, Espiritualidade */}
      <div className="space-y-0">
        {renderAccordionSection("amor")}
        {renderAccordionSection("trabalho")}
        {renderAccordionSection("espiritualidade")}
      </div>

      {/* 8. Título Conteúdo Detalhado */}
      <div className="flex items-center gap-2 px-2 pt-4">
        <Layers className="w-4 h-4 text-[#5B1F3D]/60" />
        <span className="text-[10px] font-heading font-black tracking-[0.2em] uppercase text-[#5B1F3D]/60">Conteúdo Detalhado</span>
      </div>

      {/* 9, 10, 11, 12, 13: Essência, Símbolos, Luz, Sombra, Lição (Accordion) */}
      <div className="space-y-0">
        {/* Renderiza apenas se NÃO houver conteúdo exibido nos cards de destaque (essence, light, shadow) */}
        {!essence && sections.some(s => s.id === "essencia") && renderAccordionSection("essencia")}
        {renderAccordionSection("simbolos")}
        {/* Caso a seção ID seja diferente das props (luz vs light, sombra vs shadow) */}
        {!light && sections.some(s => s.id === "luz") && renderAccordionSection("luz")}
        {!shadow && sections.some(s => s.id === "sombra") && renderAccordionSection("sombra")}
        {renderAccordionSection("licao")}
        {renderAccordionSection("mitologia")}
        {renderAccordionSection("numerologia")}
      </div>

      {/* 14, 15, 16: CTAs Finais */}
      <div className="pt-8 space-y-6">
        <button 
          onClick={onComplete}
          className="w-full py-7 rounded-2xl bg-[#5B1F3D] text-white font-heading font-black text-[13px] tracking-[0.3em] uppercase border-2 border-[#C8A66A] shadow-2xl active:scale-95 transition-all duration-300"
        >
          Concluir Lição ✦
        </button>

        <div className="flex flex-col sm:flex-row justify-center gap-6 pb-4">
          <button 
            onClick={onGoDeepDive}
            className="flex flex-1 items-center justify-center gap-4 px-10 py-5 rounded-[2rem] bg-white border-2 border-[#C8A66A]/30 shadow-xl active:scale-95 transition-all group hover:border-[#C8A66A]/60"
          >
            <span className="text-2xl transition-transform group-hover:scale-125 duration-300">🔮</span>
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-heading font-black tracking-widest uppercase text-[#C8A66A]/80">Fase 2</span>
              <span className="text-[14px] font-heading font-black tracking-widest uppercase text-[#5B1F3D]">Aprofundar</span>
            </div>
          </button>
          
          <button 
            onClick={onGoExercise}
            className="flex flex-1 items-center justify-center gap-4 px-10 py-5 rounded-[2rem] bg-white border-2 border-[#C8A66A]/30 shadow-xl active:scale-95 transition-all group hover:border-[#C8A66A]/60"
          >
            <span className="text-2xl transition-transform group-hover:scale-125 duration-300">✍️</span>
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-heading font-black tracking-widest uppercase text-[#C8A66A]/80">Fase 3</span>
              <span className="text-[14px] font-heading font-black tracking-widest uppercase text-[#5B1F3D]">Exercício</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
