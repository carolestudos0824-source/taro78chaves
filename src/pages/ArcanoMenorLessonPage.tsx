import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import {
  getArcanoMenor,
  NAIPES,
  type ArcanoMenorEditorial,
} from "@/registry/naipes";
import { useProgress } from "@/hooks/use-progress";
import { useRole } from "@/hooks/use-role";
import { useAuth } from "@/hooks/use-auth";
import { persistQuizResponse } from "@/lib/quiz-persistence";
import mysticBg from "@/assets/mystic-bg.jpg";

/**
 * Lição-piloto dos Arcanos Menores — multi-fase carrossel.
 *
 * Mapeamento oficial (mem://features/arcano-menor-lesson-model):
 *   main      → 1 Apresentação · 2 Símbolos · 3 Luz & Sombra
 *   deepDive  → 4 Voz da Carta · 5 Aprofundamento
 *   extras    → 6 Aplicações
 *   exercise  → 7 Reflexão guiada
 *   quiz      → 8 Quiz · 9 Revisão rápida
 *
 * Carta sempre visível no header, com motion leve (fade + scale-in).
 * Tela única reaproveitável para todas as 56 cartas.
 */

type Phase =
  | "intro"
  | "simbolos"
  | "luz-sombra"
  | "voz"
  | "aprofundamento"
  | "aplicacoes"
  | "reflexao"
  | "quiz"
  | "revisao";

const PHASE_ORDER: Phase[] = [
  "intro",
  "simbolos",
  "luz-sombra",
  "voz",
  "aprofundamento",
  "aplicacoes",
  "reflexao",
  "quiz",
  "revisao",
];

const PHASE_LABEL: Record<Phase, string> = {
  intro: "Apresentação",
  simbolos: "Símbolos",
  "luz-sombra": "Luz & Sombra",
  voz: "Voz da Carta",
  aprofundamento: "Aprofundamento",
  aplicacoes: "Aplicações",
  reflexao: "Reflexão",
  quiz: "Quiz",
  revisao: "Revisão",
};

const XP_REWARD = 50;

const ArcanoMenorLessonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { progress, completeLesson, addXP } = useProgress();
  const { isStaff, loading: roleLoading } = useRole();
  const { user } = useAuth();

  const card = useMemo(
    () => (id ? getArcanoMenor(id) : undefined),
    [id]
  );

  const [phaseIdx, setPhaseIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<number, boolean>>({});
  const [completed, setCompleted] = useState(false);

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(36 33% 97%)" }}>
        <div className="text-center space-y-4">
          <p className="font-heading text-lg" style={{ color: "hsl(230 25% 15%)" }}>
            Carta não encontrada
          </p>
          <button
            onClick={() => navigate("/app")}
            className="text-sm font-heading tracking-wider"
            style={{ color: "hsl(36 45% 58%)" }}
          >
            Voltar aos módulos
          </button>
        </div>
      </div>
    );
  }

  const naipeInfo = NAIPES[card.naipe];
  const phase = PHASE_ORDER[phaseIdx];
  const isLast = phaseIdx === PHASE_ORDER.length - 1;
  const totalQuiz = card.quiz?.length ?? 0;
  const allQuizSubmitted =
    totalQuiz > 0 && Object.keys(quizSubmitted).length === totalQuiz;

  const goNext = () => {
    if (phase === "quiz" && !allQuizSubmitted) return;
    if (isLast) {
      handleFinish();
      return;
    }
    setPhaseIdx((i) => Math.min(PHASE_ORDER.length - 1, i + 1));
  };

  const goBack = () => {
    if (phaseIdx === 0) {
      navigate(`/module/${card.naipe}`);
      return;
    }
    setPhaseIdx((i) => Math.max(0, i - 1));
  };

  const handleFinish = () => {
    if (completed) {
      navigate(`/module/${card.naipe}`);
      return;
    }
    completeLesson(card.id);
    addXP(XP_REWARD);
    setCompleted(true);
  };

  const handleQuizAnswer = (qIdx: number, optIdx: number) => {
    if (quizSubmitted[qIdx]) return;
    setQuizAnswers((s) => ({ ...s, [qIdx]: optIdx }));
    setQuizSubmitted((s) => ({ ...s, [qIdx]: true }));

    // Fire-and-forget persistence to quiz_responses
    if (user && card.quiz?.[qIdx]) {
      const correctIdx = card.quiz[qIdx].correctIndex;
      persistQuizResponse({
        userId: user.id,
        quizId: `quiz-menor-${card.id}`,
        questionIndex: qIdx,
        selectedAnswer: optIdx,
        isCorrect: optIdx === correctIdx,
      });
    }
  };

  const progressPct = Math.round(((phaseIdx + 1) / PHASE_ORDER.length) * 100);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img src={mysticBg} alt="" className="w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, hsl(36 33% 97% / 0.12) 0%, hsl(36 33% 97% / 0.06) 30%, hsl(36 33% 97% / 0.10) 70%, hsl(36 33% 97% / 0.24) 100%)",
          }}
        />
      </div>

      {/* Header — sticky, com carta animada */}
      <header
        className="relative z-10 sticky top-0"
        style={{
          borderBottom: `1px solid ${naipeInfo.color.border}`,
          background:
            "linear-gradient(180deg, hsl(36 33% 96% / 0.96) 0%, hsl(38 28% 93% / 0.94) 100%)",
          backdropFilter: "blur(28px)",
          boxShadow: "0 6px 36px hsl(36 45% 50% / 0.08)",
        }}
      >
        <div className="container max-w-3xl py-4 px-6">
          <div className="flex items-center gap-4 mb-3">
            <button
              onClick={goBack}
              className="transition-colors hover:scale-105 duration-200"
              style={{ color: "hsl(230 10% 40%)" }}
              aria-label="Voltar"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 min-w-0">
              <span
                className="text-[10px] tracking-[0.35em] uppercase font-body flex items-center gap-1.5"
                style={{ color: naipeInfo.color.primary }}
              >
                {naipeInfo.icon} {naipeInfo.name}
              </span>
              <h1
                className="font-heading text-lg md:text-xl tracking-wide truncate"
                style={{
                  background: `linear-gradient(135deg, hsl(340 42% 22%), ${naipeInfo.color.primary})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {card.nome}
              </h1>
            </div>
          </div>

          {/* Progress fases */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] font-heading tracking-wider"
                style={{ color: "hsl(230 10% 45%)" }}
              >
                {PHASE_LABEL[phase]} · {phaseIdx + 1}/{PHASE_ORDER.length}
              </span>
              <span
                className="text-[10px] font-heading tracking-wider"
                style={{ color: naipeInfo.color.primary }}
              >
                {progressPct}%
              </span>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{
                background: "hsl(36 18% 84%)",
                border: "1px solid hsl(36 22% 75% / 0.50)",
              }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progressPct}%`,
                  background: `linear-gradient(90deg, ${naipeInfo.color.primary}, hsl(36 45% 55%))`,
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 container max-w-3xl py-6 px-6 pb-96">
        {/* Carta — sempre visível, motion leve por fase */}
        <div
          key={`card-${phase}`}
          className="flex justify-center mb-6"
          style={{ animation: "fade-in 0.5s ease-out, scale-in 0.4s ease-out" }}
        >
          <div
            className="relative rounded-xl overflow-hidden"
            style={{
              border: `1.5px solid ${naipeInfo.color.border}`,
              boxShadow: `0 12px 40px ${naipeInfo.color.border}, 0 2px 8px hsl(36 45% 50% / 0.10)`,
              background: naipeInfo.color.surface,
              maxWidth: phase === "intro" ? "260px" : "180px",
              transition: "max-width 0.6s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <img
              src={card.cardImage}
              alt={card.nome}
              className="w-full h-auto block"
              style={{ aspectRatio: "2/3", objectFit: "cover" }}
            />
          </div>
        </div>

        {/* Fase atual */}
        <section
          key={`phase-${phase}`}
          className="space-y-5 bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-5"
          style={{ animation: "fade-up 0.5s ease-out" }}
        >
          {phase === "intro" && <PhaseIntro card={card} accent={naipeInfo.color.primary} />}
          {phase === "simbolos" && <PhaseSimbolos card={card} accent={naipeInfo.color.primary} />}
          {phase === "luz-sombra" && (
            <PhaseLuzSombra card={card} accent={naipeInfo.color.primary} />
          )}
          {phase === "voz" && <PhaseVoz card={card} accent={naipeInfo.color.primary} />}
          {phase === "aprofundamento" && (
            <PhaseAprofundamento card={card} accent={naipeInfo.color.primary} />
          )}
          {phase === "aplicacoes" && (
            <PhaseAplicacoes card={card} accent={naipeInfo.color.primary} />
          )}
          {phase === "reflexao" && (
            <PhaseReflexao card={card} accent={naipeInfo.color.primary} />
          )}
          {phase === "quiz" && (
            <PhaseQuiz
              card={card}
              accent={naipeInfo.color.primary}
              answers={quizAnswers}
              submitted={quizSubmitted}
              onAnswer={handleQuizAnswer}
            />
          )}
          {phase === "revisao" && (
            <PhaseRevisao
              card={card}
              accent={naipeInfo.color.primary}
              completed={completed}
              xp={XP_REWARD}
            />
          )}
        </section>
      </main>

      {/* Footer fixo — botão compacto de avanço (acima do BottomNav: z-50 > z-40) */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 80px)",
        }}
      >
        <div className="max-w-xs mx-auto px-6 pointer-events-auto">
          <button
            onClick={goNext}
            disabled={phase === "quiz" && !allQuizSubmitted}
            className="w-full py-3 rounded-xl font-heading text-sm tracking-wider flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01]"
            style={{
              background: `linear-gradient(135deg, ${naipeInfo.color.primary}, hsl(36 50% 50%))`,
              color: "hsl(36 33% 98%)",
              boxShadow: `0 8px 28px ${naipeInfo.color.border}`,
            }}
          >
            {isLast ? (
              completed ? (
                <>Voltar ao naipe <ArrowRight className="w-4 h-4" /></>
              ) : (
                <>Concluir lição <Check className="w-4 h-4" /></>
              )
            ) : (
              <>Continuar <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
          {phase === "quiz" && !allQuizSubmitted && (
            <p
              className="text-[10px] font-body tracking-wider text-center mt-2"
              style={{ color: "hsl(230 10% 50%)" }}
            >
              Responda todas as perguntas para continuar
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Componentes de fase ────────────────────────────────────────────

const SectionTitle = ({ children, accent }: { children: React.ReactNode; accent: string }) => (
  <div className="flex items-center gap-2 mb-2">
    <Sparkles className="w-3.5 h-3.5" style={{ color: accent }} />
    <h2
      className="font-heading text-xs tracking-[0.25em] uppercase"
      style={{ color: accent }}
    >
      {children}
    </h2>
  </div>
);

const Prose = ({ children }: { children: React.ReactNode }) => (
  <p
    className="font-body text-[15px] leading-[1.75] whitespace-pre-line"
    style={{ color: "hsl(230 25% 18% / 0.92)" }}
  >
    {children}
  </p>
);

const PhaseIntro = ({ card, accent }: { card: ArcanoMenorEditorial; accent: string }) => (
  <>
    {card.subtitulo && (
      <p
        className="font-accent italic text-center text-base"
        style={{ color: "hsl(230 20% 25% / 0.65)" }}
      >
        {card.subtitulo}
      </p>
    )}
    <SectionTitle accent={accent}>Essência</SectionTitle>
    <Prose>{card.essencia}</Prose>
    {card.arquetipo && (
      <>
        <SectionTitle accent={accent}>Arquétipo</SectionTitle>
        <Prose>{card.arquetipo}</Prose>
      </>
    )}
  </>
);

const PhaseSimbolos = ({ card, accent }: { card: ArcanoMenorEditorial; accent: string }) => (
  <>
    <SectionTitle accent={accent}>Símbolos centrais</SectionTitle>
    <Prose>{card.simbolosCentrais}</Prose>
  </>
);

const PhaseLuzSombra = ({ card, accent }: { card: ArcanoMenorEditorial; accent: string }) => (
  <>
    <SectionTitle accent={accent}>Luz</SectionTitle>
    <Prose>{card.luz}</Prose>
    <SectionTitle accent={accent}>Sombra</SectionTitle>
    <Prose>{card.sombra}</Prose>
    {card.licaoPratica && (
      <div
        className="rounded-xl p-4 mt-4"
        style={{
          background: "hsl(36 33% 95% / 0.7)",
          border: `1px solid ${accent}33`,
        }}
      >
        <p
          className="text-[10px] font-heading tracking-[0.25em] uppercase mb-2"
          style={{ color: accent }}
        >
          Lição prática
        </p>
        <Prose>{card.licaoPratica}</Prose>
      </div>
    )}
  </>
);

const PhaseVoz = ({ card, accent }: { card: ArcanoMenorEditorial; accent: string }) => (
  <>
    <SectionTitle accent={accent}>Voz da carta</SectionTitle>
    <blockquote
      className="font-accent italic text-lg leading-[1.7] pl-5 border-l-2"
      style={{
        borderColor: accent,
        color: "hsl(230 25% 18% / 0.85)",
      }}
    >
      {card.vozDaCarta}
    </blockquote>
  </>
);

const PhaseAprofundamento = ({ card, accent }: { card: ArcanoMenorEditorial; accent: string }) => (
  <>
    <SectionTitle accent={accent}>Aprofundamento</SectionTitle>
    <Prose>{card.aprofundamento}</Prose>
  </>
);

const PhaseAplicacoes = ({ card, accent }: { card: ArcanoMenorEditorial; accent: string }) => (
  <>
    <SectionTitle accent={accent}>Amor</SectionTitle>
    <Prose>{card.interpretacaoAmor}</Prose>
    <SectionTitle accent={accent}>Trabalho</SectionTitle>
    <Prose>{card.interpretacaoTrabalho}</Prose>
    <SectionTitle accent={accent}>Espiritualidade</SectionTitle>
    <Prose>{card.interpretacaoEspiritualidade}</Prose>
  </>
);

const PhaseReflexao = ({ card, accent }: { card: ArcanoMenorEditorial; accent: string }) => (
  <>
    <SectionTitle accent={accent}>Reflexão guiada</SectionTitle>
    <p
      className="font-body text-sm leading-relaxed mb-3"
      style={{ color: "hsl(230 20% 25% / 0.70)" }}
    >
      Pause antes de seguir. Leia cada pergunta sem pressa e deixe que a carta
      converse com sua experiência.
    </p>
    <ol className="space-y-3">
      {card.perguntasReflexao?.map((q, i) => (
        <li
          key={i}
          className="rounded-xl p-4"
          style={{
            background: "hsl(36 33% 95% / 0.7)",
            border: `1px solid ${accent}26`,
          }}
        >
          <span
            className="font-heading text-[11px] tracking-[0.2em] uppercase mr-2"
            style={{ color: accent }}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="font-body text-[15px]" style={{ color: "hsl(230 25% 18% / 0.90)" }}>
            {q}
          </span>
        </li>
      ))}
    </ol>
  </>
);

const PhaseQuiz = ({
  card,
  accent,
  answers,
  submitted,
  onAnswer,
}: {
  card: ArcanoMenorEditorial;
  accent: string;
  answers: Record<number, number>;
  submitted: Record<number, boolean>;
  onAnswer: (qIdx: number, optIdx: number) => void;
}) => (
  <>
    <SectionTitle accent={accent}>Quiz</SectionTitle>
    <div className="space-y-6">
      {card.quiz?.map((q, qi) => {
        const wasAnswered = submitted[qi];
        const userAnswer = answers[qi];
        return (
          <div key={q.id} className="space-y-3">
            <p
              className="font-heading text-base leading-snug"
              style={{ color: "hsl(230 25% 15%)" }}
            >
              {qi + 1}. {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                const isCorrect = oi === q.correctIndex;
                const isSelected = userAnswer === oi;
                let bg = "hsl(36 33% 95% / 0.7)";
                let border = "hsl(36 22% 80%)";
                let color = "hsl(230 25% 18%)";
                if (wasAnswered) {
                  if (isCorrect) {
                    bg = "hsl(140 35% 92%)";
                    border = "hsl(140 40% 55%)";
                    color = "hsl(140 50% 22%)";
                  } else if (isSelected) {
                    bg = "hsl(0 35% 94%)";
                    border = "hsl(0 50% 60%)";
                    color = "hsl(0 50% 30%)";
                  }
                }
                return (
                  <button
                    key={oi}
                    onClick={() => onAnswer(qi, oi)}
                    disabled={wasAnswered}
                    className="w-full text-left p-3 rounded-lg transition-all duration-200 disabled:cursor-default"
                    style={{
                      background: bg,
                      border: `1.5px solid ${border}`,
                      color,
                    }}
                  >
                    <span className="font-body text-[14px]">{opt}</span>
                  </button>
                );
              })}
            </div>
            {wasAnswered && q.explanation && (
              <div
                className="rounded-lg p-3 mt-2"
                style={{
                  background: "hsl(36 33% 95% / 0.85)",
                  border: `1px solid ${accent}33`,
                }}
              >
                <p
                  className="text-[10px] font-heading tracking-[0.2em] uppercase mb-1"
                  style={{ color: accent }}
                >
                  Comentário
                </p>
                <p
                  className="font-body text-sm leading-relaxed"
                  style={{ color: "hsl(230 25% 18% / 0.85)" }}
                >
                  {q.explanation}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </>
);

const PhaseRevisao = ({
  card,
  accent,
  completed,
  xp,
}: {
  card: ArcanoMenorEditorial;
  accent: string;
  completed: boolean;
  xp: number;
}) => {
  const r = card.revisaoRapida;
  return (
    <>
      <SectionTitle accent={accent}>Revisão rápida</SectionTitle>
      {r && (
        <div
          className="rounded-xl p-5 space-y-3"
          style={{
            background: "hsl(36 33% 95% / 0.85)",
            border: `1px solid ${accent}40`,
          }}
        >
          <ReviewRow label="Palavra-chave" value={r.palavraChave} accent={accent} />
          <ReviewRow label="Luz" value={r.luz} accent={accent} />
          <ReviewRow label="Sombra" value={r.sombra} accent={accent} />
          <ReviewRow label="Lição central" value={r.licaoCentral} accent={accent} />
          <ReviewRow label="Aplicação" value={r.aplicacaoPratica} accent={accent} />
          <div className="pt-3 mt-2" style={{ borderTop: `1px solid ${accent}33` }}>
            <p
              className="font-accent italic text-center text-base leading-relaxed"
              style={{ color: accent }}
            >
              "{r.fraseFixacao}"
            </p>
          </div>
        </div>
      )}
      {completed && (
        <div
          className="rounded-xl p-4 text-center"
          style={{
            background: "linear-gradient(135deg, hsl(140 35% 92%), hsl(140 30% 88%))",
            border: "1px solid hsl(140 40% 55%)",
            animation: "scale-in 0.4s ease-out",
          }}
        >
          <Check className="w-6 h-6 mx-auto mb-1" style={{ color: "hsl(140 50% 30%)" }} />
          <p className="font-heading text-sm tracking-wider" style={{ color: "hsl(140 50% 22%)" }}>
            Lição concluída · +{xp} XP
          </p>
        </div>
      )}
    </>
  );
};

const ReviewRow = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) => (
  <div className="flex flex-col gap-0.5">
    <span
      className="text-[10px] font-heading tracking-[0.2em] uppercase"
      style={{ color: accent }}
    >
      {label}
    </span>
    <span
      className="font-body text-[14px] leading-relaxed"
      style={{ color: "hsl(230 25% 18% / 0.90)" }}
    >
      {value}
    </span>
  </div>
);

export default ArcanoMenorLessonPage;
