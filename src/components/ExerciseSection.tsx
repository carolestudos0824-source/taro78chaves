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
      <div className="card-mystic p-6">
        <div className="flex items-center gap-2 mb-4">
          <TypeIcon className="w-5 h-5 text-primary" />
          <h3 className="font-heading text-lg text-gradient-gold">{typeLabels[type].label}</h3>
          {duration && (
            <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {duration}
            </span>
          )}
        </div>

        <div className="font-accent text-foreground/85 leading-relaxed italic mb-6 space-y-3">
          {instruction.split("\n\n").map((line, i) => (
            <p key={i}>"{line}"</p>
          ))}
        </div>

        {(type === "reflection" || type === "journaling") && (
          <textarea
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            placeholder="Escreva suas reflexões aqui... (opcional)"
            className="w-full h-32 bg-muted/50 border border-border rounded-xl p-4 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:border-primary/40 transition-colors"
          />
        )}
      </div>

      {!completed ? (
        <div className="flex justify-center">
          <button
            onClick={onComplete}
            className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-heading text-sm tracking-wider hover:glow-gold transition-all duration-300 hover:scale-105"
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
