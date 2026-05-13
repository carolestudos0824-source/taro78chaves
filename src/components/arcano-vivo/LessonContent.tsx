import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Layers, Eye, ChevronDown, Heart, Briefcase, Sparkles, ScrollText, Feather } from "lucide-react";
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
 */
export function LessonContent({
  sections, essence, light, shadow,
  onComplete, onGoDeepDive, onGoExercise, onSkipToQuiz,
  quickReview, reflectionQuestions, initiationLesson,
}: LessonContentProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [step, setStep] = useState(0); // 0=essence, 1=light, 2=shadow, 3=initiation+applied

  const steps = [
    { id: "essence", title: "Essência", icon: "✦", content: essence },
    { id: "light", title: "Luz", icon: "☀", content: light },
    { id: "shadow", title: "Sombra", icon: "☾", content: shadow },
  ];

  // Separate sections into core and applied
  const coreIds = ["essencia", "simbolos", "luz", "sombra", "licao"];
  const appliedIds = ["amor", "trabalho", "espiritualidade"];
  const coreSections = sections.filter(s => coreIds.includes(s.id));
  const appliedSections = sections.filter(s => appliedIds.includes(s.id));
  const otherSections = sections.filter(s => !coreIds.includes(s.id) && !appliedIds.includes(s.id));

  const appliedIcons: Record<string, typeof Heart> = {
    amor: Heart,
    trabalho: Briefcase,
    espiritualidade: Sparkles,
  };

  const appliedColors: Record<string, { bg: string; border: string; accent: string }> = {
    amor: { bg: "rgba(91, 31, 61, 0.05)", border: "rgba(91, 31, 61, 0.2)", accent: "#5B1F3D" },
    trabalho: { bg: "rgba(200, 166, 106, 0.05)", border: "rgba(200, 166, 106, 0.2)", accent: "#C8A66A" },
    espiritualidade: { bg: "rgba(91, 31, 61, 0.03)", border: "rgba(91, 31, 61, 0.15)", accent: "#5B1F3D" },
  };

  return (
    <motion.div 
      className="space-y-6 pb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" style={{ color: "hsl(36 40% 42%)" }} />
          <span className="text-[10px] font-heading tracking-[0.25em] uppercase" style={{ color: "hsl(36 40% 42%)" }}>
            Lição do Arcano
          </span>
        </div>
        <button onClick={onSkipToQuiz} className="text-[10px] font-heading tracking-wider" style={{ color: "hsl(36 45% 58%)" }}>
          Ir ao Quiz →
        </button>
      </div>

      {/* Progressive steps */}
      <div className="space-y-3">
        {steps.map((s, idx) => {
          const isActive = idx <= step;
          const isCurrent = idx === step;
          return (
            <div
              key={s.id}
              className={`rounded-xl overflow-hidden transition-all duration-500 ${isActive ? "opacity-100" : "opacity-30 pointer-events-none"}`}
              style={{
                background: isCurrent ? "hsl(38 30% 95% / 0.9)" : "hsl(38 30% 95% / 0.6)",
                border: `1px solid ${isCurrent ? "hsl(36 45% 58% / 0.25)" : "hsl(36 25% 82% / 0.4)"}`,
                boxShadow: isCurrent ? "0 4px 20px hsl(36 45% 58% / 0.06)" : "none",
                animation: isActive ? `fade-up 0.4s ease-out ${idx * 0.1}s both` : undefined,
              }}
            >
              <div className="px-5 py-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-base w-7 h-7 rounded-full flex items-center justify-center"
                    style={{
                      background: "hsl(36 45% 58% / 0.08)",
                      border: "1px solid hsl(36 45% 58% / 0.2)",
                    }}
                  >{s.icon}</span>
                  <h3 className="font-heading text-sm tracking-wide" style={{ color: "hsl(230 25% 15%)" }}>{s.title}</h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(230 20% 25%)" }}>{s.content}</p>
              </div>
              {isCurrent && idx < 2 && (
                <div className="px-5 pb-4">
                  <button
                    onClick={() => setStep(idx + 1)}
                    className="text-[10px] font-heading tracking-wider px-4 py-1.5 rounded-full transition-all"
                    style={{
                      background: "hsl(36 45% 58% / 0.1)",
                      border: "1px solid hsl(36 45% 58% / 0.2)",
                      color: "hsl(36 40% 42%)",
                    }}
                  >
                    Continuar →
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Initiation Lesson ── */}
      {step >= 2 && initiationLesson && (
        <div
          className="rounded-xl p-5"
          style={{
            background: "linear-gradient(135deg, hsl(36 42% 44% / 0.04), hsl(270 30% 35% / 0.03))",
            border: "1px solid hsl(36 42% 44% / 0.15)",
            animation: "fade-up 0.4s ease-out",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: "hsl(36 42% 44% / 0.08)", border: "1px solid hsl(36 42% 44% / 0.2)" }}
            >⟡</span>
            <span className="text-[10px] font-heading tracking-[0.2em] uppercase" style={{ color: "hsl(36 40% 42%)" }}>Lição Iniciática</span>
          </div>
          <p className="text-sm leading-relaxed italic" style={{ color: "hsl(230 20% 25%)" }}>{initiationLesson}</p>
        </div>
      )}

      {/* Applied interpretations — amor, trabalho, espiritualidade */}
      {step >= 2 && appliedSections.length > 0 && (
        <div className="space-y-3 pt-2" style={{ animation: "fade-up 0.4s ease-out" }}>
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-3.5 h-3.5" style={{ color: "hsl(340 42% 28% / 0.6)" }} />
            <span className="text-[9px] font-heading tracking-[0.3em] uppercase" style={{ color: "hsl(340 42% 28% / 0.6)" }}>
              Interpretações práticas
            </span>
          </div>
          {appliedSections.map((section) => {
            const isOpen = openSection === section.id;
            const colors = appliedColors[section.id] || appliedColors.amor;
            const Icon = appliedIcons[section.id] || Heart;
            
            const parts = section.content.split(/Na sombra:/);
            const lightText = parts[0]?.replace(/^Na luz:\s*/, "").trim();
            const shadowText = parts[1]?.trim();

            return (
              <div key={section.id} className="rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  background: isOpen ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.4)",
                  border: `1px solid ${isOpen ? "rgba(200, 166, 106, 0.3)" : "rgba(200, 166, 106, 0.15)"}`,
                  boxShadow: isOpen ? "0 4px 15px rgba(91, 31, 61, 0.04)" : "none",
                }}
              >
                <button
                  onClick={() => setOpenSection(isOpen ? null : section.id)}
                  className="w-full px-5 py-4 flex items-center gap-4 text-left transition-colors"
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{
                    background: colors.bg,
                    border: `1px solid ${colors.border}`,
                  }}>
                    <Icon className="w-4 h-4" style={{ color: colors.accent }} />
                  </div>
                  <span className="font-heading text-sm font-bold tracking-wide flex-1 text-[#5B1F3D]">{section.title}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    style={{ color: "#C8A66A" }} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4" style={{ animation: "fade-up 0.3s ease-out" }}>
                    <div className="h-px mb-3" style={{ background: `linear-gradient(90deg, transparent, ${colors.border}, transparent)` }} />
                    {lightText && shadowText ? (
                      <div className="space-y-3">
                        <div className="rounded-xl p-4" style={{ background: "rgba(200, 166, 106, 0.05)", border: "1px solid rgba(200, 166, 106, 0.15)" }}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm">☀</span>
                            <span className="text-[10px] font-heading font-black tracking-widest uppercase text-[#8B6A30]">Luz</span>
                          </div>
                          <p className="text-[14px] leading-[1.65] text-[#5B1F3D]/90">{lightText}</p>
                        </div>
                        <div className="rounded-xl p-4" style={{ background: "rgba(91, 31, 61, 0.04)", border: "1px solid rgba(91, 31, 61, 0.15)" }}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm">☾</span>
                            <span className="text-[10px] font-heading font-black tracking-widest uppercase text-[#5B1F3D]/70">Sombra</span>
                          </div>
                          <p className="text-[14px] leading-[1.65] text-[#5B1F3D]/90">{shadowText}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[14px] leading-[1.65] text-[#5B1F3D]/90">{section.content}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Reflection Questions ── */}
      {step >= 2 && reflectionQuestions && reflectionQuestions.length > 0 && (
        <div
          className="rounded-2xl p-6 space-y-4"
          style={{
            background: "rgba(91, 31, 61, 0.04)",
            border: "1px solid rgba(91, 31, 61, 0.15)",
            animation: "fade-up 0.4s ease-out 0.1s both",
          }}
        >
          <div className="flex items-center gap-3">
            <Feather className="w-4 h-4 text-[#5B1F3D]" />
            <span className="text-[11px] font-heading font-black tracking-[0.25em] uppercase text-[#5B1F3D]">
              Perguntas para Reflexão
            </span>
          </div>
          <div className="space-y-3">
            {reflectionQuestions.map((q, i) => (
              <div
                key={q.id}
                className="rounded-xl px-5 py-4 animate-fade-in"
                style={{
                  background: "rgba(255, 255, 255, 0.4)",
                  border: "1px solid rgba(91, 31, 61, 0.1)",
                  animationDelay: `${i * 80}ms`,
                  animationFillMode: "both",
                }}
              >
                <p className="text-[14px] leading-relaxed italic text-[#5B1F3D]/80">
                  "{q.question}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Quick Review Cards ── */}
      {step >= 2 && quickReview && quickReview.length > 0 && (
        <div
          className="rounded-2xl p-6 space-y-4"
          style={{
            background: "rgba(200, 166, 106, 0.05)",
            border: "1px solid rgba(200, 166, 106, 0.15)",
            animation: "fade-up 0.4s ease-out 0.2s both",
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <ScrollText className="w-4 h-4 text-[#8B6A30]" />
            <span className="text-[11px] font-heading font-black tracking-[0.25em] uppercase text-[#8B6A30]">
              Revisão Rápida
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickReview.map((item, i) => (
              <div
                key={i}
                className="rounded-xl px-4 py-3 animate-fade-in"
                style={{
                  background: "rgba(255, 255, 255, 0.5)",
                  border: "1px solid rgba(200, 166, 106, 0.15)",
                  animationDelay: `${i * 60}ms`,
                  animationFillMode: "both",
                }}
              >
                <p className="text-[10px] font-heading font-black tracking-wider uppercase mb-1 text-[#8B6A30]">
                  {item.keyword}
                </p>
                <p className="text-[13px] leading-tight text-[#5B1F3D]" style={{ fontWeight: 500 }}>
                  {item.meaning}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expandable core lesson sections */}
      {step >= 2 && [...coreSections, ...otherSections].length > 0 && (
        <div className="space-y-2 pt-2" style={{ animation: "fade-up 0.4s ease-out" }}>
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-3.5 h-3.5" style={{ color: "hsl(36 40% 42%)" }} />
            <span className="text-[9px] font-heading tracking-[0.3em] uppercase" style={{ color: "hsl(36 40% 42% / 0.7)" }}>
              Conteúdo detalhado
            </span>
          </div>
          {[...coreSections, ...otherSections].map((section) => {
            const isOpen = openSection === section.id;
            return (
              <div key={section.id} className="rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  background: isOpen ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.4)",
                  border: `1px solid ${isOpen ? "rgba(200, 166, 106, 0.3)" : "rgba(200, 166, 106, 0.15)"}`,
                  boxShadow: isOpen ? "0 4px 15px rgba(91, 31, 61, 0.04)" : "none",
                }}
              >
                <button
                  onClick={() => setOpenSection(isOpen ? null : section.id)}
                  className="w-full px-5 py-4 flex items-center gap-4 text-left transition-colors"
                >
                  <span className="text-base w-8 h-8 rounded-full flex items-center justify-center bg-white/50 border border-[#C8A66A]/20">{section.icon}</span>
                  <span className="font-heading text-sm font-bold tracking-wide flex-1 text-[#5B1F3D]">{section.title}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    style={{ color: "#C8A66A" }} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5" style={{ animation: "fade-up 0.3s ease-out" }}>
                    <div className="h-px mb-4" style={{ background: "linear-gradient(90deg, transparent, rgba(200, 166, 106, 0.2), transparent)" }} />
                    <p className="text-[14px] leading-[1.7] text-[#5B1F3D]/80">{section.content}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Action buttons */}
      <AnimatePresence>
        {step >= 2 && (
          <motion.div 
            className="flex flex-col items-center gap-3 pt-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <button onClick={onComplete}
              className="w-full py-6 rounded-2xl font-heading font-black text-xs tracking-[0.2em] uppercase transition-all shadow-xl hover:scale-105 active:scale-95 bg-[#5B1F3D] text-white border-2 border-[#C8A66A]"
            >
              Concluir Lição ✦
            </button>
            <div className="flex gap-4">
              <button onClick={onGoDeepDive} className="text-[10px] font-heading tracking-wider" style={{ color: "hsl(230 10% 45%)" }}>
                🔮 Aprofundar
              </button>
              <button onClick={onGoExercise} className="text-[10px] font-heading tracking-wider" style={{ color: "hsl(230 10% 45%)" }}>
                ✍️ Exercício
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
