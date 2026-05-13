import { useState } from "react";
import { Dumbbell, Check, Clock, PenLine } from "lucide-react";

interface ExerciseSectionProps {
  instruction: string;
  type: "reflection" | "journaling" | "meditation" | "practice";
  duration?: string;
  onComplete: () => void;
  completed: boolean;
}

const typeLabels = {
  reflection: { label: "Reflexão", icon: PenLine },
  journaling: { label: "Journaling", icon: PenLine },
  meditation: { label: "Meditação", icon: Dumbbell },
  practice: { label: "Prática", icon: Dumbbell },
};

export function ExerciseSection({ instruction, type, duration, onComplete, completed }: ExerciseSectionProps) {
  const [journalEntry, setJournalEntry] = useState("");
  const TypeIcon = typeLabels[type].icon;

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="rounded-[2rem] p-8 space-y-6" style={{
        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 245, 239, 0.92) 100%)",
        border: "2px solid rgba(200, 166, 106, 0.35)",
        boxShadow: "0 20px 50px rgba(91, 31, 61, 0.08)"
      }}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#C8A66A10] border border-[#C8A66A30]">
            <TypeIcon className="w-6 h-6 text-[#C8A66A]" />
          </div>
          <div>
            <h3 className="font-heading text-xl font-black text-[#5B1F3D]">{typeLabels[type].label}</h3>
            {duration && (
              <span className="flex items-center gap-1.5 text-[10px] font-heading font-black tracking-widest uppercase text-[#C8A66A]">
                <Clock className="w-3 h-3" />
                {duration}
              </span>
            )}
          </div>
        </div>

        <div className="font-accent text-[#5B1F3D]/90 leading-relaxed italic mb-8 space-y-4 text-lg">
          {instruction.split("\n\n").map((line, i) => (
            <p key={i}>"{line}"</p>
          ))}
        </div>

        {(type === "reflection" || type === "journaling") && (
          <textarea
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            placeholder="Escreva suas reflexões aqui... (opcional)"
            className="w-full h-40 bg-white/50 border-2 border-[#C8A66A]/20 rounded-[1.5rem] p-5 text-[15px] text-[#5B1F3D] placeholder:text-[#5B1F3D]/30 resize-none focus:outline-none focus:border-[#C8A66A]/50 transition-all shadow-inner"
          />
        )}
      </div>

      {!completed ? (
        <div className="flex justify-center">
          <button
            onClick={onComplete}
            className="w-full py-6 rounded-2xl font-heading text-xs tracking-[0.2em] uppercase transition-all shadow-xl hover:scale-105 active:scale-95 bg-[#5B1F3D] text-white border-2 border-[#C8A66A] font-black"
          >
            Exercício Concluído
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 text-primary text-sm">
          <Check className="w-4 h-4" />
          <span className="font-heading tracking-wider">Concluído</span>
        </div>
      )}
    </div>
  );
}
