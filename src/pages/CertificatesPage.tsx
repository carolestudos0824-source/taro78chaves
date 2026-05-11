import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, X, Lock } from "lucide-react";
import { useProgress } from "@/hooks/use-progress";
import { useCertificatesContent } from "@/hooks/use-content";
import {
  buildEarnedCertificate,
  isCertificateEarned,
  type EarnedCertificateView,
} from "@/lib/certificates/emission";
import CertificateCard, { FullCertificate } from "@/components/CertificateCard";
// import ornamentDivider from "@/assets/ornament-divider.png";

const CertificatesPage = () => {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const { data: certsData } = useCertificatesContent();
  const [viewing, setViewing] = useState<EarnedCertificateView | null>(null);

  const studentName = progress.studentName || "Estudante";
  const allCerts = certsData?.items ?? [];

  const earned: EarnedCertificateView[] = allCerts
    .filter((c) => isCertificateEarned(c, progress.completedModules))
    .map((c) =>
      buildEarnedCertificate(
        c,
        progress.certificatesEarned?.[c.id] || new Date().toISOString(),
        studentName,
      ),
    );

  const locked = allCerts.filter((c) => !isCertificateEarned(c, progress.completedModules));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "hsl(230 25% 10% / 0.60)", backdropFilter: "blur(8px)" }}>
          <div className="relative w-full max-w-lg">
            <button
              onClick={() => setViewing(null)}
              className="absolute -top-12 right-0 p-2 rounded-full transition-colors"
              style={{ color: "hsl(36 33% 97%)" }}
            >
              <X className="w-5 h-5" />
            </button>
            <FullCertificate certificate={viewing} />
            <div className="flex justify-center mt-4">
              <button
                onClick={() => {
                  // Print-friendly approach
                  const printWindow = window.open("", "_blank");
                  if (printWindow) {
                    printWindow.document.write(`
                      <html><head><title>${viewing.title}</title>
                      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;1,400&family=Inter:wght@300;400&display=swap" rel="stylesheet">
                      <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f5f0e8; font-family: Inter, sans-serif; }
                        .cert { width: 600px; aspect-ratio: 3/4; background: linear-gradient(160deg, #f8f5f0, #f0ebe0, #e8e2d8); border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 48px; position: relative; box-shadow: 0 20px 60px rgba(20,20,40,0.12); }
                        .cert::before { content: ''; position: absolute; inset: 12px; border: 1.5px solid rgba(180,155,100,0.30); border-radius: 12px; }
                        .heading { font-family: Cinzel, serif; }
                        .accent { font-family: 'Cormorant Garamond', serif; }
                        .icon { font-size: 40px; margin-bottom: 16px; }
                        .title { font-size: 22px; letter-spacing: 1px; background: linear-gradient(135deg, #4a2030, #50453a, #8a7a50); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 4px; }
                        .subtitle { font-size: 14px; font-style: italic; color: rgba(30,25,40,0.45); margin-bottom: 24px; }
                        .line { width: 80px; height: 1px; background: linear-gradient(90deg, transparent, rgba(180,155,100,0.40), transparent); margin: 16px auto; }
                        .label { font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: rgba(40,35,50,0.35); margin-bottom: 4px; }
                        .name { font-size: 18px; letter-spacing: 1px; color: #4a2030; border-bottom: 1px solid rgba(180,155,100,0.25); padding-bottom: 4px; margin-bottom: 24px; }
                        .desc { font-size: 12px; line-height: 1.6; max-width: 320px; color: rgba(40,35,50,0.50); margin-bottom: 24px; }
                        .date { font-size: 10px; color: rgba(40,35,50,0.35); }
                        .top-label { font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: rgba(180,155,100,0.60); margin-bottom: 8px; }
                        .top-type { font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: rgba(100,60,70,0.50); margin-bottom: 24px; }
                        @media print { body { background: white; } .cert { box-shadow: none; } }
                      </style></head><body>
                      <div class="cert">
                        <div class="top-label">Arcano Vivo</div>
                        <div class="top-type">Certificado de Conclusão</div>
                        <div class="line"></div>
                        <div class="icon">${viewing.icon}</div>
                        <div class="heading title">${viewing.title}</div>
                        <div class="accent subtitle">${viewing.subtitle}</div>
                        <div class="line"></div>
                        <div class="label">Conferido a</div>
                        <div class="heading name">${viewing.studentName}</div>
                        <div class="desc">${viewing.description}</div>
                        <div class="date">${new Date(viewing.earnedAt).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}</div>
                        <div class="line" style="margin-top:24px"></div>
                        <div style="color:rgba(180,155,100,0.35);font-size:14px;margin-top:12px">⟡</div>
                      </div>
                      <script>setTimeout(()=>window.print(),500)<\/script>
                      </body></html>
                    `);
                    printWindow.document.close();
                  }
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-body text-sm transition-all duration-300 hover:shadow-md"
                style={{
                  background: "linear-gradient(135deg, hsl(340 42% 26%), hsl(36 42% 44%))",
                  color: "hsl(36 33% 97%)",
                }}
              >
                <Download className="w-4 h-4" />
                Baixar / Imprimir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 0%, hsl(42 70% 80% / 0.15) 0%, transparent 60%)",
        }} />
        <div className="relative max-w-2xl mx-auto px-6 pt-8 pb-6">
          <button
            onClick={() => navigate("/perfil")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-body">Perfil</span>
          </button>

          <div className="text-center">
            <div className="text-[10px] tracking-[0.4em] uppercase font-body mb-2" style={{ color: "hsl(36 45% 58% / 0.60)" }}>
              Arcano Vivo
            </div>
            <h1
              className="font-heading text-2xl tracking-wide"
              style={{
                background: "linear-gradient(135deg, hsl(340 42% 20%), hsl(36 35% 28%), hsl(36 42% 42%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Certificados
            </h1>
            <p className="font-accent text-sm italic mt-1" style={{ color: "hsl(230 20% 15% / 0.50)" }}>
              Suas conquistas na formação em Tarô
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-16 space-y-8">
        {/* Earned */}
        {earned.length > 0 && (
          <div>
            <div className="flex items-center justify-center mb-3">
              <div className="ornament-divider-procedural"><div className="ornament-divider-procedural-diamond" /></div>
            </div>
            <h2 className="font-heading text-sm tracking-wide text-center mb-4" style={{ color: "hsl(340 42% 22%)" }}>
              Conquistados ({earned.length})
            </h2>
            <div className="space-y-3">
              {earned.map(cert => (
                <CertificateCard
                  key={cert.id}
                  certificate={cert}
                  compact
                  onView={() => setViewing(cert)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Locked */}
        {locked.length > 0 && (
          <div>
            <div className="flex items-center justify-center mb-3">
              <div className="ornament-divider-procedural"><div className="ornament-divider-procedural-diamond" /></div>
            </div>
            <h2 className="font-heading text-sm tracking-wide text-center mb-4" style={{ color: "hsl(230 15% 30% / 0.35)" }}>
              Em progresso ({locked.length})
            </h2>
            <div className="space-y-3">
              {locked.map(cert => (
                <div
                  key={cert.id}
                  className="rounded-xl p-5 opacity-50"
                  style={{
                    background: "hsl(36 18% 90% / 0.50)",
                    border: "1px solid hsl(36 20% 82% / 0.30)",
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 text-2xl grayscale" style={{
                      background: "hsl(36 15% 88% / 0.50)",
                      border: "1px solid hsl(36 18% 80% / 0.25)",
                    }}>
                      <Lock className="w-5 h-5" style={{ color: "hsl(230 15% 30% / 0.30)" }} />
                    </div>
                    <div>
                      <div className="font-heading text-sm tracking-wide" style={{ color: "hsl(230 15% 30% / 0.40)" }}>
                        {cert.title}
                      </div>
                      <div className="font-accent text-xs italic" style={{ color: "hsl(230 15% 30% / 0.30)" }}>
                        {cert.subtitle}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {earned.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📜</div>
            <h3 className="font-heading text-base tracking-wide mb-2" style={{ color: "hsl(340 42% 22%)" }}>
              Nenhum certificado ainda
            </h3>
            <p className="font-body text-sm" style={{ color: "hsl(230 15% 30% / 0.45)" }}>
              Complete módulos para conquistar seus certificados de formação.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificatesPage;
