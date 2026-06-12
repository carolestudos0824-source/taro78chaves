import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Flame, Sparkles, BookOpen, Sun, ArrowRight } from "lucide-react";

interface RetentionBannerProps {
  streak: number;
  completedLessons: number;
  pontos: number;
  level: number;
  lastActive: string;
}

// Motivational messages based on context
function getMotivationalMessage(streak: number, lessons: number, hoursSinceActive: number): {
  title: string;
  subtitle: string;
  icon: "flame" | "sparkle" | "book" | "sun";
  cta?: { label: string; path: string };
} | null {
  // Returning user after absence
  if (hoursSinceActive > 48) {
    return {
      title: "Sentimos sua falta ✦",
      subtitle: "Sua jornada te aguarda. Um passo por dia transforma o caminho.",
      icon: "sun",
      cta: { label: "Retomar jornada", path: "/desafios" },
    };
  }

  // Streak milestones
  if (streak === 3) {
    return {
      title: "3 dias consecutivos ✦",
      subtitle: "A constância é o primeiro sinal de verdadeira dedicação. Continue.",
      icon: "flame",
    };
  }
  if (streak === 7) {
    return {
      title: "Uma semana de prática",
      subtitle: "Sete dias de estudo ininterrupto. A sabedoria se constrói assim.",
      icon: "flame",
    };
  }
  if (streak === 14) {
    return {
      title: "Duas semanas de jornada",
      subtitle: "Você já percorreu um caminho significativo. Os arcanos reconhecem sua dedicação.",
      icon: "sparkle",
    };
  }
  if (streak === 30) {
    return {
      title: "Um mês de estudo ✦",
      subtitle: "Trinta dias de prática transformam percepção em sabedoria.",
      icon: "sparkle",
    };
  }

  // Lesson milestones
  if (lessons === 1) {
    return {
      title: "Primeira lição concluída",
      subtitle: "O primeiro passo na jornada é sempre o mais corajoso. Boas-vindas.",
      icon: "book",
    };
  }
  if (lessons === 5) {
    return {
      title: "5 lições concluídas ✦",
      subtitle: "Você já acumula um corpo de conhecimento que poucas alcançam.",
      icon: "book",
    };
  }
  if (lessons === 10) {
    return {
      title: "10 lições na jornada",
      subtitle: "Uma dezena de ensinamentos interiorizados. Sua leitura já não é a mesma.",
      icon: "sparkle",
    };
  }
  if (lessons === 22) {
    return {
      title: "Todos os Arcanos Maiores ✦",
      subtitle: "Você percorreu a Jornada do Louco inteira. Uma conquista rara e profunda.",
      icon: "sparkle",
    };
  }

  // Daily encouragement based on streak
  if (streak > 0 && streak % 5 === 0) {
    return {
      title: `${streak} dias de prática`,
      subtitle: "Cada dia de estudo aprofunda sua conexão com os arcanos.",
      icon: "flame",
    };
  }

  // Gentle daily nudge to ritual
  if (hoursSinceActive > 20 && hoursSinceActive <= 48) {
    return {
      title: "Seu ritual de hoje espera",
      subtitle: "Poucos minutos de prática mantêm a chama acesa.",
      icon: "sun",
      cta: { label: "Praticar agora", path: "/desafios" },
    };
  }

  return null;
}

const ICONS = {
  flame: Flame,
  sparkle: Sparkles,
  book: BookOpen,
  sun: Sun,
};

const BANNER_DISMISSED_KEY = "retention-banner-dismissed";

const RetentionBanner = ({ streak, completedLessons, pontos, level, lastActive }: RetentionBannerProps) => {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  const hoursSinceActive = (Date.now() - new Date(lastActive).getTime()) / (1000 * 60 * 60);
  const message = getMotivationalMessage(streak, completedLessons, hoursSinceActive);

  // Check if this specific message was already dismissed today
  useEffect(() => {
    const saved = localStorage.getItem(BANNER_DISMISSED_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const today = new Date().toISOString().slice(0, 10);
        if (parsed.date === today && parsed.title === message?.title) {
          setDismissed(true);
        }
      } catch {} // No-op callback
    }
  }, [message?.title]);

  if (!message || dismissed) return null;

  const Icon = ICONS[message.icon];

  const handleDismiss = () => {
    localStorage.setItem(BANNER_DISMISSED_KEY, JSON.stringify({
      date: new Date().toISOString().slice(0, 10),
      title: message.title,
    }));
    setDismissed(true);
  };

  return (
    <div
      className="relative rounded-xl overflow-hidden mb-5"
      style={{
        background: "linear-gradient(145deg, hsl(340 42% 28% / 0.06), hsl(36 45% 58% / 0.08), hsl(38 28% 93% / 0.90))",
        border: "1px solid hsl(340 42% 28% / 0.18)",
        boxShadow: "0 4px 20px hsl(340 42% 28% / 0.06)",
        animation: "fade-in 0.6s ease-out",
      }}
    >
      {/* Subtle glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 20% 30%, hsl(36 45% 58% / 0.08) 0%, transparent 60%)",
      }} />

      <div className="relative p-4 flex items-start gap-3.5">
        {/* Icon */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{
          background: "linear-gradient(135deg, hsl(340 42% 28% / 0.10), hsl(36 45% 58% / 0.08))",
          border: "1.5px solid hsl(340 42% 28% / 0.25)",
        }}>
          <Icon className="w-4.5 h-4.5" style={{ color: "hsl(340 42% 26%)" }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-[13px] tracking-wide mb-0.5" style={{ color: "hsl(340 42% 22%)" }}>
            {message.title}
          </h3>
          <p className="font-accent text-[11px] italic leading-relaxed" style={{ color: "hsl(230 20% 15% / 0.55)" }}>
            {message.subtitle}
          </p>

          {message.cta && (
            <button
              onClick={() => { handleDismiss(); navigate(message.cta!.path); }}
              className="mt-2.5 flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase font-heading transition-all hover:gap-2.5"
              style={{ color: "hsl(340 42% 26%)" }}
            >
              {message.cta.label}
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Dismiss */}
        <button
          onClick={handleDismiss}
          className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ color: "hsl(230 15% 40% / 0.25)" }}
        >
          <span className="text-sm leading-none">×</span>
        </button>
      </div>
    </div>
  );
};

export default RetentionBanner;
