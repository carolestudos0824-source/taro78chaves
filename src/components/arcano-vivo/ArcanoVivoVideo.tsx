import { useRef, useState } from "react";
import { Play } from "lucide-react";

interface ArcanoVivoVideoProps {
  arcanoId: number;
  videoSrc: string | null;
  posterImage: string;
  arcanoName: string;
  /** HSL string (without `hsl()`) for the ritual gold border/glow */
  glowColor?: string;
  /** Optional callback when the video finishes playing */
  onEnded?: () => void;
  /** Render fallback (the original card image) when no video is mapped */
  fallback: React.ReactNode;
}

/**
 * ArcanoVivoVideo
 *
 * Substitui a imagem estática principal da carta por um vídeo vertical 9:16
 * do "Arcano Vivo". Se não existir vídeo mapeado para o arcanoId ou se o
 * arquivo falhar ao carregar, renderiza o `fallback` (imagem da carta).
 *
 * Comportamento:
 * - playsInline + preload="metadata"
 * - poster = imagem da carta enquanto o vídeo não inicia
 * - botão de play personalizado (dourado ritualístico) sobre o poster
 * - som ativado ao tocar (não autoplay com áudio para preservar mobile)
 * - controles nativos discretos durante reprodução
 * - card com identidade premium: borda dourada, sombra mística
 */
export function ArcanoVivoVideo({
  arcanoId: _arcanoId,
  videoSrc,
  posterImage,
  arcanoName,
  glowColor = "36 45% 58%",
  onEnded,
  fallback,
}: ArcanoVivoVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasError, setHasError] = useState(false);
  const [started, setStarted] = useState(false);

  // Sem vídeo mapeado ou erro de carregamento → cai para imagem da carta
  if (!videoSrc || hasError) {
    return <>{fallback}</>;
  }

  const handlePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.play()
      .then(() => setStarted(true))
      .catch(() => {
        // Alguns browsers bloqueiam play com áudio — tenta mudo como último recurso
        v.muted = true;
        v.play().then(() => setStarted(true)).catch(() => setHasError(true));
      });
  };

  return (
    <div
      className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden"
      style={{
        border: `2px solid hsl(${glowColor} / 0.45)`,
        boxShadow: `0 20px 60px hsl(${glowColor} / 0.25), 0 0 100px hsl(${glowColor} / 0.10)`,
        background: "hsl(0 0% 5%)",
      }}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        poster={posterImage}
        preload="metadata"
        playsInline
        controls={started}
        controlsList="nodownload noremoteplayback"
        onEnded={onEnded}
        onError={() => setHasError(true)}
        onPlay={() => setStarted(true)}
        className="w-full h-full object-cover"
        aria-label={`Arcano Vivo — ${arcanoName}`}
      />

      {/* Botão de play personalizado — só aparece antes do vídeo iniciar */}
      {!started && (
        <button
          type="button"
          onClick={handlePlay}
          aria-label={`Reproduzir vídeo do arcano ${arcanoName}`}
          className="absolute inset-0 flex items-center justify-center group"
          style={{
            background:
              "linear-gradient(180deg, hsl(0 0% 0% / 0.05) 0%, hsl(0 0% 0% / 0.35) 100%)",
          }}
        >
          <span
            className="flex items-center justify-center w-20 h-20 rounded-full transition-transform duration-300 group-active:scale-95"
            style={{
              background: `radial-gradient(circle, hsl(${glowColor} / 0.95) 0%, hsl(${glowColor} / 0.75) 70%)`,
              boxShadow: `0 8px 32px hsl(${glowColor} / 0.5), 0 0 40px hsl(${glowColor} / 0.35)`,
              border: "1.5px solid hsl(36 33% 97% / 0.6)",
            }}
          >
            <Play
              className="w-8 h-8 ml-1"
              style={{ color: "hsl(36 33% 97%)", fill: "hsl(36 33% 97%)" }}
            />
          </span>
        </button>
      )}
    </div>
  );
}
