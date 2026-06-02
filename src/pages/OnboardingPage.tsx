import { useState, useCallback } from "react";
import { ChevronRight, Sparkles, Layers, Star, Eye, User, Key, DoorOpen, BookOpen } from "lucide-react";
import { useProgress } from "@/hooks/use-progress";

interface OnboardingStep {
  symbol: React.ReactNode;
  kicker: string;
  title: string;
  lines: string[];
  detail?: "name" | "layers";
}

const STEPS: OnboardingStep[] = [
  {
    symbol: <Key className="w-7 h-7" strokeWidth={1.5} />,
    kicker: "Boas-vindas",
    title: "Você não veio aprender cartas.",
    lines: [
      "Você veio aprender a ler o que já existe dentro de si.",
      "Aqui, o Tarô é linguagem viva — espelho de arquétipos, forças e verdades que já te habitam.",
      "Cada carta revela uma parte da sua história. Nenhuma resposta vem de fora.",
    ],
  },
  {
    symbol: <User className="w-7 h-7" strokeWidth={1.5} />,
    kicker: "Apresentação",
    title: "Como posso te chamar?",
    lines: [
      "Antes de começar, deixe seu nome.",
      "Ele aparecerá em momentos especiais da sua jornada — como saudação e nos seus certificados.",
      "Pode pular se preferir manter o anonimato.",
    ],
    detail: "name",
  },
  {
    symbol: <Star className="w-7 h-7" strokeWidth={1.5} />,
    kicker: "A Jornada do Louco",
    title: "22 mestres. Uma travessia.",
    lines: [
      "Tudo começa no Arcano Zero — O Louco. Ele é o viajante que salta sem garantias.",
      "Cada Arcano Maior é um portal de sabedoria:",
      "O Mago ensina o poder da intenção consciente.",
      "A Sacerdotisa revela o que está além do visível.",
      "A Imperatriz desperta a força criadora.",
      "Você vai caminhar com todos eles — um a um.",
    ],
  },
  {
    symbol: <Layers className="w-7 h-7" strokeWidth={1.5} />,
    kicker: "Método em Camadas",
    title: "Profundidade sem pressão.",
    lines: ["Cada arcano é estudado em camadas de significado:"],
    detail: "layers",
  },
  {
    symbol: <Eye className="w-7 h-7" strokeWidth={1.5} />,
    kicker: "Arcanos Vivos",
    title: "As cartas conversam com você.",
    lines: [
      "As cartas não estão presas em páginas.",
      "Elas aparecem nos seus quizzes, nos desafios, nas revisões — e falam diretamente com você.",
      "Você não memoriza. Você convive. E quanto mais convive, mais compreende.",
    ],
  },
  {
    symbol: <BookOpen className="w-7 h-7" strokeWidth={1.5} />,
    kicker: "A Jornada Completa",
    title: "Uma escola viva no seu bolso.",
    lines: [
      "Aprenda Tarô como uma jornada — arcano por arcano, com lições curtas, quizzes, Chaves e progresso real.",
      "Estude os 78 arcanos com uma trilha progressiva, fiel ao Rider-Waite-Smith.",
      "O Tarô deixa de ser imagem e se torna presença.",
    ],
  },
  {
    symbol: <DoorOpen className="w-7 h-7" strokeWidth={1.5} />,
    kicker: "Pronta?",
    title: "O Louco espera por você.",
    lines: [
      "Não é preciso saber nada. Não é preciso acreditar em nada.",
      "Só é preciso dar o primeiro passo.",
      "O precipício não é o fim. É onde a jornada começa.",
    ],
  },
];

const LAYER_ITEMS = [
  { label: "Essência", desc: "O coração vivo da carta", icon: "◉" },
  { label: "Luz & Sombra", desc: "Forças e desafios que ela encarna", icon: "☯" },
  { label: "Simbolismo", desc: "Cada detalhe visual tem propósito", icon: "⟡" },
  { label: "Amor & Trabalho", desc: "Aplicações na vida real", icon: "♡" },
  { label: "Quiz & Prática", desc: "Integre o que compreendeu", icon: "✦" },
];

interface Props {
  onComplete: () => void;
}

const OnboardingPage = ({ onComplete }: Props) => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"in" | "out">("in");
  const { progress, setStudentName } = useProgress();
  const [nameInput, setNameInput] = useState(progress.studentName ?? "");

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const goNext = useCallback(() => {
    if (current.detail === "name") setStudentName(nameInput.trim());
    if (isLast) {
      setDirection("out");
      setTimeout(onComplete, 480);
      return;
    }
    setDirection("out");
    setTimeout(() => {
      setStep(s => s + 1);
      setDirection("in");
    }, 280);
  }, [isLast, onComplete, current.detail, nameInput, setStudentName]);

  const goBack = useCallback(() => {
    if (step === 0) return;
    setDirection("out");
    setTimeout(() => {
      setStep(s => s - 1);
      setDirection("in");
    }, 280);
  }, [step]);

  return (
    <div
      data-onboarding
      className="fixed inset-0 z-[60] overflow-y-auto flex flex-col select-none"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, hsl(var(--brand-rose) / 0.55) 0%, transparent 55%), linear-gradient(180deg, hsl(var(--brand-ivory)) 0%, hsl(var(--brand-rose) / 0.4) 100%)",
        transition: "opacity 0.45s ease",
        opacity: direction === "out" && isLast ? 0 : 1,
      }}
    >
      {/* Subtle ornament watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 22%, hsl(var(--brand-gold)) 0 1.5px, transparent 2px), radial-gradient(circle at 88% 78%, hsl(var(--brand-gold)) 0 1.5px, transparent 2px), radial-gradient(circle at 80% 18%, hsl(var(--brand-plum)) 0 1px, transparent 2px), radial-gradient(circle at 18% 82%, hsl(var(--brand-plum)) 0 1px, transparent 2px)",
          backgroundSize: "420px 420px",
        }}
      />

      {/* Top bar: progress + skip */}
      <div className="relative z-10 flex items-center justify-between px-5 md:px-8 pt-5 md:pt-8 pb-2 max-w-3xl w-full mx-auto">
        <div className="flex items-center gap-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-500"
              style={{
                width: i === step ? 28 : 8,
                height: 8,
                background:
                  i < step
                    ? "hsl(var(--brand-gold))"
                    : i === step
                      ? "hsl(var(--brand-plum))"
                      : "hsl(var(--brand-greige))",
              }}
            />
          ))}
        </div>
        {!isLast && (
          <button
            onClick={onComplete}
            className="text-sm font-heading tracking-[0.18em] uppercase px-3 py-1.5 rounded-full transition-colors"
            style={{ color: "hsl(var(--brand-plum))" }}
          >
            Pular
          </button>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 relative z-10 flex items-center justify-center px-5 md:px-8 py-6">
        <div
          className="w-full max-w-xl"
          style={{
            opacity: direction === "out" ? 0 : 1,
            transform: direction === "out" ? "translateY(6px)" : "none",
            transition: "opacity 0.28s ease, transform 0.28s ease",
            animation: direction === "in" ? "fade-in 0.5s ease-out" : "none",
          }}
        >
          {/* Icon tile — plum bg, gold border, gold icon */}
          <div className="flex justify-center mb-6">
            <div
              className="w-[72px] h-[72px] md:w-[80px] md:h-[80px] rounded-2xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, hsl(var(--brand-plum)) 0%, hsl(333 50% 18%) 100%)",
                border: "1.5px solid hsl(var(--brand-gold) / 0.6)",
                color: "hsl(var(--brand-gold))",
                boxShadow:
                  "0 14px 40px -16px hsl(var(--brand-plum) / 0.55), inset 0 1px 0 hsl(var(--brand-gold) / 0.18)",
              }}
            >
              {current.symbol}
            </div>
          </div>

          {/* Kicker */}
          <p
            className="text-center text-[11px] md:text-xs font-heading tracking-[0.32em] uppercase mb-3"
            style={{ color: "hsl(var(--brand-gold))" }}
          >
            <span className="inline-block mx-2 opacity-70">✦</span>
            {current.kicker}
            <span className="inline-block mx-2 opacity-70">✦</span>
          </p>

          {/* Title — large, dark plum, legible */}
          <h1
            className="text-center font-heading text-[28px] leading-[1.15] md:text-[40px] md:leading-[1.1] tracking-tight mb-5"
            style={{ color: "hsl(var(--brand-plum))" }}
          >
            {current.title}
          </h1>

          {/* Gold divider */}
          <div className="flex items-center justify-center gap-2 mb-6" aria-hidden>
            <div className="w-10 h-px" style={{ background: "hsl(var(--brand-gold) / 0.5)" }} />
            <span className="text-[10px]" style={{ color: "hsl(var(--brand-gold))" }}>✦</span>
            <div className="w-10 h-px" style={{ background: "hsl(var(--brand-gold) / 0.5)" }} />
          </div>

          {/* Body — strong contrast, comfortable size */}
          <div className="space-y-3 mb-7 max-w-lg mx-auto">
            {current.lines.map((line, i) => (
              <p
                key={i}
                className="text-center font-body text-[16px] md:text-[18px] leading-[1.6]"
                style={{ color: "hsl(var(--foreground))" }}
              >
                {line}
              </p>
            ))}
          </div>

          {/* Detail: Layers */}
          {current.detail === "layers" && (
            <div className="space-y-2.5 mb-4 max-w-md mx-auto">
              {LAYER_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{
                    background: "hsl(var(--brand-ivory) / 0.85)",
                    border: "1px solid hsl(var(--brand-gold) / 0.28)",
                    boxShadow: "0 2px 10px -4px hsl(var(--brand-plum) / 0.08)",
                    animation:
                      direction === "in"
                        ? `fade-in 0.4s ease-out ${i * 70}ms both`
                        : "none",
                  }}
                >
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0"
                    style={{
                      background: "hsl(var(--brand-plum))",
                      color: "hsl(var(--brand-gold))",
                    }}
                  >
                    {item.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[14px] md:text-[15px] font-heading tracking-wide"
                      style={{ color: "hsl(var(--brand-plum))" }}
                    >
                      {item.label}
                    </p>
                    <p
                      className="text-[13px] md:text-[14px] leading-snug"
                      style={{ color: "hsl(var(--foreground) / 0.78)" }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
              <p
                className="text-center text-[13px] md:text-[14px] italic font-accent mt-4"
                style={{ color: "hsl(var(--brand-plum) / 0.75)" }}
              >
                Vá fundo quando quiser. Avance quando sentir que é hora.
              </p>
            </div>
          )}

          {/* Detail: Name capture */}
          {current.detail === "name" && (
            <div className="mb-4 max-w-sm mx-auto">
              <label
                htmlFor="onboarding-name"
                className="block text-center text-[11px] font-heading tracking-[0.28em] uppercase mb-3"
                style={{ color: "hsl(var(--brand-gold))" }}
              >
                Seu nome
              </label>
              <input
                id="onboarding-name"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Como posso te chamar?"
                autoComplete="given-name"
                maxLength={60}
                className="w-full px-5 py-4 rounded-xl text-center text-[17px] font-body outline-none transition-all"
                style={{
                  background: "hsl(var(--brand-ivory))",
                  border: "1.5px solid hsl(var(--brand-gold) / 0.45)",
                  color: "hsl(var(--brand-plum))",
                  boxShadow: "0 4px 18px -8px hsl(var(--brand-plum) / 0.15)",
                }}
              />
              <p
                className="text-center text-[13px] italic font-accent mt-3"
                style={{ color: "hsl(var(--brand-plum) / 0.65)" }}
              >
                Opcional. Pode deixar em branco e seguir.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom controls */}
      <div className="relative z-10 px-5 md:px-8 pb-8 md:pb-10 space-y-4 max-w-xl w-full mx-auto">
        {/* Main CTA — large, plum-filled with gold accent */}
        <button
          onClick={goNext}
          className="w-full flex items-center justify-center gap-2.5 min-h-[56px] md:min-h-[60px] px-6 rounded-2xl font-heading text-[13px] md:text-[14px] tracking-[0.22em] uppercase transition-all duration-300 active:scale-[0.98]"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--brand-plum)) 0%, hsl(333 50% 18%) 100%)",
            border: "1.5px solid hsl(var(--brand-gold) / 0.55)",
            color: "hsl(var(--brand-gold-light, 38 50% 78%))",
            boxShadow:
              "0 10px 32px -10px hsl(var(--brand-plum) / 0.5), inset 0 1px 0 hsl(var(--brand-gold) / 0.2)",
          }}
        >
          {isLast ? (
            <>
              <Sparkles className="w-4 h-4" />
              <span style={{ color: "hsl(var(--brand-gold))" }}>
                Iniciar minha Jornada
              </span>
            </>
          ) : (
            <>
              <span style={{ color: "hsl(var(--brand-gold))" }}>Continuar</span>
              <ChevronRight className="w-4 h-4" style={{ color: "hsl(var(--brand-gold))" }} />
            </>
          )}
        </button>

        {/* Back + counter */}
        <div className="flex items-center justify-center gap-4">
          {step > 0 && (
            <button
              onClick={goBack}
              className="text-[13px] font-heading tracking-[0.18em] uppercase underline-offset-4 hover:underline"
              style={{ color: "hsl(var(--brand-plum))" }}
            >
              Voltar
            </button>
          )}
          <span
            className="text-[12px] font-heading tracking-[0.22em] uppercase"
            style={{ color: "hsl(var(--brand-plum) / 0.65)" }}
          >
            <span style={{ color: "hsl(var(--brand-gold))" }}>✦</span> {step + 1} de {STEPS.length} <span style={{ color: "hsl(var(--brand-gold))" }}>✦</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
