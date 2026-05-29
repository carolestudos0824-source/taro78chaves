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

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF5EF]">
        <div className="text-center space-y-6 animate-pulse">
          <div className="w-12 h-12 border-4 border-[#C8A66A]/20 border-t-[#5B1F3D] animate-spin rounded-full mx-auto shadow-[0_0_15px_rgba(91,31,61,0.1)]" />
          <p className="text-[11px] text-[#5B1F3D] font-heading tracking-[0.3em] uppercase font-black">Lendo Arcanos...</p>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF5EF]">
        <div className="text-center space-y-8 max-w-xs px-6 animate-fade-in">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-2 border-4 border-[#C8A66A] shadow-xl ring-8 ring-[#C8A66A]/10">
            <span className="text-3xl">🃏</span>
          </div>
          <div className="space-y-3">
            <h2 className="font-heading text-2xl text-[#5B1F3D] font-black tracking-tight">Carta não encontrada</h2>
            <p className="font-accent text-sm text-[#5B1F3D]/70 italic leading-relaxed font-bold">
              "Nem toda porta deve ser aberta antes do tempo."
            </p>
          </div>
          <button 
            onClick={() => navigate("/app")} 
            className="w-full py-5 px-6 rounded-2xl font-heading text-[11px] tracking-[0.2em] uppercase transition-all shadow-xl hover:scale-105 active:scale-95 bg-[#5B1F3D] text-white border-2 border-[#C8A66A] font-black"
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
    totalQuiz === 0 || (totalQuiz > 0 && Object.keys(quizSubmitted).length === totalQuiz);

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
    if (!isStaff) {
      completeLesson(card.id);
      addXP(XP_REWARD);
    }
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
    <div className="min-h-screen relative overflow-hidden bg-[#FAF5EF]">
      {/* Background — Marfim Suave replicando /app */}
      <div className="fixed inset-0 z-0 mystic-bg-procedural">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #FAF5EF 0%, #F5EBDE 45%, #EFE2D2 100%)",
            opacity: 0.98,
          }}
        />
      </div>

      {/* Header — sticky, com carta animada */}
      <header
        className="relative z-10 sticky top-0"
        style={{
          borderBottom: "2px solid #C8A66A40",
          background: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 4px 20px rgba(91, 31, 61, 0.05)",
        }}
      >
        <div className="container max-w-3xl py-4 px-6">
          <div className="flex items-center gap-5 mb-4">
            <button
              onClick={goBack}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-[#FAF5EF] border border-[#C8A66A30] text-[#5B1F3D] hover:scale-110 transition-all duration-200"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 min-w-0">
              <span
                className="text-[10px] tracking-[0.35em] uppercase font-heading font-black flex items-center gap-1.5"
                style={{ color: "#8B6A30" }}
              >
                {naipeInfo.icon} {naipeInfo.name}
              </span>
              <h1
                className="font-heading text-lg md:text-xl tracking-wide truncate font-black"
                style={{ color: "#5B1F3D" }}
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
              className="h-2 rounded-full overflow-hidden"
              style={{
                background: "#DCCFC240",
                border: "1px solid #C8A66A20",
              }}
            >
              <div
                className="h-full rounded-full transition-all duration-700 relative overflow-hidden"
                style={{
                  width: `${progressPct}%`,
                  background: "linear-gradient(90deg, #5B1F3D, #C8A66A)",
                }}
              >
                <div className="absolute inset-0 w-1/3 h-full bg-white/20 skew-x-[-20deg] animate-pulse" style={{ left: '10%' }} />
              </div>
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
              border: "2.5px solid #C8A66A",
              boxShadow: "0 20px 50px rgba(91, 31, 61, 0.15)",
              background: "white",
              maxWidth: phase === "intro" ? "260px" : "180px",
              transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
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
          className="space-y-6 bg-white/70 backdrop-blur-md rounded-[2rem] px-8 py-8 border-2 border-[#C8A66A]/20 shadow-xl"
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
        <div className="max-w-sm mx-auto px-6 pointer-events-auto">
          <button
            onClick={goNext}
            disabled={phase === "quiz" && !allQuizSubmitted}
            className="w-full py-5 px-4 rounded-2xl font-heading text-xs tracking-[0.15em] md:tracking-[0.2em] uppercase font-black flex items-center justify-center gap-2 md:gap-3 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed border-2 border-[#C8A66A] shadow-[0_15px_40px_-10px_rgba(91,31,61,0.4)] active:scale-95 hover:scale-105"
            style={{
              background: "#5B1F3D",
              color: "#FAF5EF",
            }}
          >
            {isLast ? (
              completed ? (
                <>Voltar ao naipe <ArrowRight className="w-5 h-5" /></>
              ) : (
                <>Concluir lição <Check className="w-5 h-5" /></>
              )
            ) : (
              <>Continuar <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
          {phase === "quiz" && !allQuizSubmitted && (
            <p
              className="text-[10px] font-heading font-black tracking-widest uppercase text-center mt-3"
              style={{ color: "#5B1F3D60" }}
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
  <div className="flex items-center gap-3 mb-3">
    <Sparkles className="w-4 h-4" style={{ color: "#C8A66A" }} />
    <h2
      className="font-heading text-xs tracking-[0.3em] uppercase font-black"
      style={{ color: "#5B1F3D" }}
    >
      {children}
    </h2>
  </div>
);

const Prose = ({ children }: { children: React.ReactNode }) => (
  <p
    className="font-body text-[17px] md:text-[18px] leading-[1.8] font-black"
    style={{ color: "#3D1429" }}
  >
    {children}
  </p>
);

const PhaseIntro = ({ card, accent }: { card: ArcanoMenorEditorial; accent: string }) => (
  <>
    {card.subtitulo && (
      <p
        className="font-accent italic text-center text-[22px] md:text-[24px] font-black leading-relaxed mb-8"
        style={{ color: "#8B6A30" }}
      >
        "{card.subtitulo}"
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
      className="font-accent italic text-2xl leading-[1.7] pl-6 border-l-4 font-bold"
      style={{
        borderColor: "#C8A66A",
        color: "#5B1F3D",
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
          <span className="font-body text-[17px] font-black leading-relaxed" style={{ color: "#3D1429" }}>
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
      className="font-body text-[16px] leading-relaxed font-black"
      style={{ color: "#3D1429" }}
    >
      {value}
    </span>
  </div>
);

export default ArcanoMenorLessonPage;
