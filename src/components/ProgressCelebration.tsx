import { useEffect, useState } from "react";
import { Sparkles, Star, Award } from "lucide-react";

interface ProgressCelebrationProps {
  streak: number;
  completedLessons: number;
}

interface Celebration {
  id: string;
  title: string;
  subtitle: string;
  icon: "sparkle" | "star" | "award";
}

const CELEBRATION_KEY = "last-celebration-shown";

function detectCelebration(streak: number, lessons: number): Celebration | null {
  // Milestone de lições
  const lessonMilestones = [1, 5, 10, 22];
  for (const m of lessonMilestones) {
    if (lessons === m) {
      return {
        id: `lessons-${m}`,
        title: `${m === 1 ? 'Primeira' : m} Lição Concluída`,
        subtitle: "Cada passo revela uma nova chave da sua jornada.",
        icon: "award",
      };
    }
  }

  // Streak milestones
  if (streak === 3) {
    return {
      id: "streak-3",
      title: "Chama Constante",
      subtitle: "3 dias conectada com o Tarô.",
      icon: "sparkle",
    };
  }


  return null;
}


const ICONS = {
  sparkle: Sparkles,
  star: Star,
  award: Award,
};

const ProgressCelebration = ({ streak, completedLessons }: ProgressCelebrationProps) => {
  const [celebration, setCelebration] = useState<Celebration | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const c = detectCelebration(streak, completedLessons);
    if (!c) return;

    const lastShown = localStorage.getItem(CELEBRATION_KEY);
    if (lastShown === c.id) return;

    localStorage.setItem(CELEBRATION_KEY, c.id);
    setCelebration(c);
    setVisible(true);

    const timer = setTimeout(() => setVisible(false), 4500);
    return () => clearTimeout(timer);
  }, [streak, completedLessons]);


  if (!celebration || !visible) return null;

  const Icon = ICONS[celebration.icon];

  return (
    <div
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%]"
      style={{ animation: "celebration-in 0.5s ease-out, celebration-out 0.5s ease-in 4s forwards" }}
    >
      <div className="rounded-xl p-4 flex items-center gap-3.5" style={{
        background: "linear-gradient(145deg, hsl(36 33% 97% / 0.98), hsl(38 28% 93% / 0.96))",
        border: "1.5px solid hsl(36 45% 55% / 0.40)",
        boxShadow: "0 12px 50px hsl(36 45% 50% / 0.20), 0 0 60px hsl(36 45% 55% / 0.10)",
        backdropFilter: "blur(20px)",
      }}>
        <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{
          background: "linear-gradient(135deg, hsl(36 45% 55% / 0.15), hsl(340 42% 28% / 0.08))",
          border: "1.5px solid hsl(36 45% 55% / 0.30)",
        }}>
          <Icon className="w-5 h-5" style={{ color: "hsl(36 42% 40%)" }} />
        </div>
        <div>
          <h3 className="font-heading text-sm tracking-wide" style={{ color: "hsl(340 42% 22%)" }}>
            {celebration.title}
          </h3>
          <p className="font-accent text-[11px] italic" style={{ color: "hsl(230 20% 15% / 0.55)" }}>
            {celebration.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressCelebration;
