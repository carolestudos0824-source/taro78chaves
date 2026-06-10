import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, X, Lock, CheckCircle, Sparkles, Trophy, Flame, Target } from "lucide-react";
import { useProgress } from "@/hooks/use-progress";
import { useRitual } from "@/hooks/use-ritual";
import { useCertificatesContent } from "@/hooks/use-content";
import {
  buildEarnedCertificate,
  isCertificateEarned,
  type EarnedCertificateView,
} from "@/lib/certificates/emission";
import CertificateCard, { FullCertificate } from "@/components/CertificateCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const CertificatesPage = () => {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const { merits, streak: ritualStreak } = useRitual();
  const { data: certsData, isLoading: contentLoading } = useCertificatesContent();
  const [viewing, setViewing] = useState<EarnedCertificateView | null>(null);
  const [dbCertificates, setDbCertificates] = useState<Record<string, any>>({});
  const [issuing, setIssuing] = useState<string | null>(null);

  const studentName = progress.studentName || "Estudante";
  const allCerts = certsData?.items ?? [];

  // Fetch issued certificates from database
  useEffect(() => {
    const fetchIssued = async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("status", "issued");
      
      if (data) {
        const map = data.reduce((acc: any, cert: any) => {
          // Link by course_name (for legacy/display) or user-friendly identifier
          acc[cert.course_name] = cert;
          return acc;
        }, {});
        setDbCertificates(map);
      }
    };
    fetchIssued();
  }, []);

  const handleIssue = async (cert: any) => {
    setIssuing(cert.id);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Usuário não autenticado");

      // Check if already exists
      const { data: existing } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", userData.user.id)
        .eq("course_name", cert.title)
        .maybeSingle();

      if (existing) {
        setDbCertificates(prev => ({ ...prev, [cert.title]: existing }));
        setViewing(buildEarnedCertificate(cert, existing.issued_at, existing.student_name, existing.validation_code, existing.workload_hours));
        return;
      }

      const validationCode = `T78-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      
      const { data: newCert, error } = await supabase
        .from("certificates")
        .insert({
          user_id: userData.user.id,
          student_name: studentName,
          course_name: cert.title,
          workload_hours: 40,
          validation_code: validationCode,
          completion_percentage: 100,
          status: 'issued'
        })
        .select()
        .single();

      if (error) throw error;

      setDbCertificates(prev => ({ ...prev, [cert.title]: newCert }));
      setViewing(buildEarnedCertificate(cert, newCert.issued_at, newCert.student_name, newCert.validation_code, newCert.workload_hours));
      toast.success("Certificado emitido com sucesso!");
    } catch (err) {
      console.error("Erro ao emitir certificado:", err);
      toast.error("Erro ao emitir certificado. Tente novamente.");
    } finally {
      setIssuing(null);
    }
  };

  const earned = allCerts.filter((c) => isCertificateEarned(c, progress.completedModules));
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
                        .footer { font-size: 8px; color: rgba(40,35,50,0.3); max-width: 400px; margin-top: 40px; line-height: 1.4; }
                        .validation { font-size: 9px; color: #8a7a50; margin-top: 20px; font-weight: bold; }
                        @media print { body { background: white; } .cert { box-shadow: none; } }
                      </style></head><body>
                      <div class="cert">
                        <div class="top-label">Escola Digital</div>
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
                        
                        ${viewing.validationCode ? `
                          <div class="validation">
                            CÓDIGO DE VALIDAÇÃO: ${viewing.validationCode}<br/>
                            Verifique em: ${window.location.origin}/validar-certificado
                          </div>
                        ` : ''}

                        <div class="footer">
                          Certificado digital de conclusão emitido pelo Tarô 78 Chaves. Este certificado refere-se à conclusão de curso livre/formação livre e não equivale a diploma técnico, superior ou reconhecimento oficial do MEC.
                        </div>
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
            <div className="text-[12px] tracking-[0.4em] uppercase font-body mb-2" style={{ color: "hsl(36 45% 58% / 0.60)" }}>
              Escola Digital
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
              Suas conquistas na Escola Digital Tarô 78 Chaves
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-bottom-nav space-y-12">
        {/* Symbolic Merits Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-center mb-3">
            <div className="ornament-divider-procedural"><div className="ornament-divider-procedural-diamond" /></div>
          </div>
          <h2 className="font-heading text-base tracking-wide text-center mb-6 text-plum">
            Méritos da Jornada
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            {[
              { key: "chama_acesa", label: "Chama Acesa", desc: "1 dia de Ritual concluído", icon: Flame },
              { key: "ritmo_iniciado", label: "Ritmo Iniciado", desc: "3 dias seguidos de Ritual", icon: Target },
              { key: "portal_constante", label: "Portal Constante", desc: "7 dias seguidos de Ritual", icon: Trophy },
              { key: "habito_firmado", label: "Hábito Firmado", desc: "21 dias seguidos de Ritual", icon: Sparkles },
              { key: "guardia_rotina", label: "Guardiã da Rotina", desc: "30 dias seguidos de Ritual", icon: CheckCircle }
            ].map((m) => {
              const isUnlocked = merits.includes(m.key);
              return (
                <div 
                  key={m.key} 
                  className={`relative rounded-[2rem] p-6 border-2 transition-all duration-500 overflow-hidden flex items-center gap-5 ${
                    isUnlocked ? 'bg-white border-gold shadow-lg' : 'bg-gray-50 border-gray-100 opacity-60 grayscale'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 ${
                    isUnlocked ? 'bg-gold/10 border-gold text-plum' : 'bg-gray-200 border-gray-300 text-gray-400'
                  }`}>
                    <m.icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-heading text-sm font-black uppercase tracking-widest ${isUnlocked ? 'text-plum' : 'text-gray-400'}`}>
                      {m.label}
                    </h3>
                    <p className="text-[13px] font-body font-bold italic text-plum/40 leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                  {isUnlocked && (
                    <div className="absolute top-0 right-0 p-3">
                      <Sparkles className="w-4 h-4 text-gold animate-pulse" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Certificates Section */}
        <div className="pt-6">
          <div className="flex items-center justify-center mb-3">
            <div className="ornament-divider-procedural"><div className="ornament-divider-procedural-diamond" /></div>
          </div>
          <h2 className="font-heading text-base tracking-wide text-center mb-6 text-plum">
            Certificados de Formação
          </h2>
        </div>

        {/* Earned */}
        {earned.length > 0 && (
          <div>
            <div className="flex items-center justify-center mb-3">
              <div className="ornament-divider-procedural"><div className="ornament-divider-procedural-diamond" /></div>
            </div>
            <h2 className="font-heading text-base tracking-wide text-center mb-6" style={{ color: "hsl(340 42% 22%)" }}>
              Conquistados ({earned.length})
            </h2>
            <div className="space-y-4">
              {earned.map(cert => {
                const isIssued = !!dbCertificates[cert.title] || !!dbCertificates[cert.slug];
                const issued = dbCertificates[cert.title] || dbCertificates[cert.slug];
                return (
                  <div key={cert.id} className="space-y-2">
                    <CertificateCard
                      certificate={isIssued 
                        ? buildEarnedCertificate(cert, issued.issued_at, issued.student_name, issued.validation_code, issued.workload_hours)
                        : buildEarnedCertificate(cert, new Date().toISOString(), studentName)
                      }
                      compact
                      onView={() => {
                        if (isIssued) {
                          setViewing(buildEarnedCertificate(cert, issued.issued_at, issued.student_name, issued.validation_code, issued.workload_hours));
                        }
                      }}
                    />
                    {!isIssued && (
                      <Button
                        onClick={() => handleIssue(cert)}
                        disabled={issuing === cert.id}
                        className="w-full bg-plum hover:bg-plum/90 text-ivory rounded-xl py-6 flex items-center gap-2"
                      >
                        {issuing === cert.id ? "Emitindo..." : (
                          <>
                            <Sparkles className="w-4 h-4 text-gold" />
                            Emitir Certificado
                          </>
                        )}
                      </Button>
                    )}
                    {isIssued && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setViewing(buildEarnedCertificate(cert, issued.issued_at, issued.student_name, issued.validation_code, issued.workload_hours));
                          }}
                          className="flex-1 border-gold/30 text-plum hover:bg-gold/5"
                        >
                          Visualizar
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/validar-certificado?codigo=${issued.validation_code}`)}
                          className="flex-1 border-gold/30 text-plum hover:bg-gold/5"
                        >
                          Validar Autenticidade
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Locked */}
        {locked.length > 0 && (
          <div>
            <div className="flex items-center justify-center mb-3">
              <div className="ornament-divider-procedural"><div className="ornament-divider-procedural-diamond" /></div>
            </div>
            <h2 className="font-heading text-base tracking-wide text-center mb-6" style={{ color: "hsl(333 50% 24% / 0.70)" }}>
              Em progresso ({locked.length})
            </h2>
            <div className="grid grid-cols-1 gap-5">
              {locked.map(cert => (
                <div
                  key={cert.id}
                  className="rounded-[2rem] p-6 md:p-8 transition-all duration-300 relative overflow-hidden group border-2"
                  style={{
                    background: "rgba(255, 255, 255, 0.5)",
                    borderColor: "rgba(200, 166, 106, 0.15)",
                  }}
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Sparkles className="w-12 h-12 text-[#5B1F3D]" />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 text-3xl bg-[#FAF5EF] border-2 border-[#DCCFC2]/40 shadow-inner group-hover:scale-105 transition-transform">
                      <Lock className="w-8 h-8 text-[#5B1F3D]/30" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="font-heading text-lg md:text-xl font-black text-[#5B1F3D]/80 leading-tight">
                        {cert.title}
                      </div>
                      <div className="font-accent text-sm md:text-base italic text-[#5B1F3D]/60 font-medium">
                        {cert.subtitle}
                      </div>
                      <div className="pt-3">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5B1F3D]/5 border border-[#5B1F3D]/10 text-[10px] md:text-[11px] font-heading font-black uppercase tracking-[0.15em] text-[#5B1F3D]/70">
                          <Lock className="w-3 h-3" />
                          Libera ao concluir a jornada obrigatória
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!contentLoading && earned.length === 0 && locked.length === 0 && (
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