import { useState, useEffect } from "react";
import LegalLayout from "@/components/LegalLayout";
import { businessInfo } from "@/config/business";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";
import { Mail, HelpCircle, AlertCircle, CheckCircle2 } from "lucide-react";

/**
 * Identificador Único de Versão: 2026-05-30-V2
 * Esta é a ÚNICA Central de Suporte. Se você vê outra página, limpe o cache do seu navegador.
 */
const SUPPORT_VERSION_ID = "2026-05-30-V2";

const REQUEST_TYPES = [
  { value: "duvida", label: "Dúvida pedagógica / Tarô" },
  { value: "acesso", label: "Acesso / Login" },
  { value: "hotmart", label: "Compra Hotmart" },
  { value: "liberacao", label: "Pagamento aprovado, mas sem acesso" },
  { value: "licao", label: "Problema em lição ou quiz" },
  { value: "progresso", label: "Problema com progresso ou XP" },
  { value: "certificado", label: "Certificado" },
  { value: "exclusao", label: "Exclusão de conta" },
  { value: "outro", label: "Outro assunto" },
];

const SupportPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.message || !formData.email) {
      toast.error("Por favor, preencha os campos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("beta_feedback").insert({
        user_id: user?.id || null,
        name: formData.name || (user ? "Usuário Logado" : "Anônimo"),
        email: formData.email,
        type: formData.type,
        subject: formData.subject || `Suporte: ${formData.type}`,
        message: formData.message,
        page: window.location.pathname,
        status: "aberto"
      });

      if (error) throw error;
      setSubmitted(true);
      toast.success("Solicitação enviada com sucesso!");
    } catch (err: any) {
      console.error("Erro ao enviar suporte:", err);
      toast.error("Erro ao enviar. Tente novamente ou use o e-mail oficial.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LegalLayout title="Central de Suporte — versão oficial">
      <div className="space-y-12">
        <section>
          <p className="text-plum font-body leading-relaxed mb-6 italic">
            Estamos aqui para guiar sua travessia. Se você encontrou algum obstáculo técnico ou tem dúvidas sobre sua jornada no <strong>{businessInfo.productName}</strong>, use o formulário oficial abaixo.
          </p>

          <div className="bg-[#FAF5EF] border-2 border-[#C8A66A]/20 p-6 rounded-[2rem] shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-12 h-12 rounded-2xl bg-[#5B1F3D] flex items-center justify-center shrink-0 shadow-md">
              <Mail className="w-6 h-6 text-[#C8A66A]" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-heading font-black tracking-widest text-[#C8A66A] uppercase">E-mail de Suporte</p>
              <p className="text-base font-heading font-black text-[#5B1F3D]">
                <a href={`mailto:${businessInfo.supportEmail}`} className="hover:underline" onClick={() => trackEvent("support_email_click")}>{businessInfo.supportEmail}</a>
              </p>
              <p className="text-[10px] font-body font-bold italic text-[#5B1F3D]/60">Respondemos em até 3 dias úteis.</p>
            </div>
          </div>
        </section>

        <section className="bg-white border-2 border-[#C8A66A]/10 p-8 md:p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FAF5EF] rounded-full blur-3xl -mr-16 -mt-16 opacity-50" />
          
          {submitted ? (
            <div className="text-center py-12 space-y-6 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <div className="space-y-2">
                <h3 className="font-heading text-2xl font-black text-[#5B1F3D]">Mensagem Entregue ao Oráculo</h3>
                <p className="text-[#5B1F3D]/70 font-body font-bold italic">
                  Sua mensagem foi entregue ao Oráculo. <br />
                  Responderemos em até <strong>3 dias úteis</strong> no e-mail informado.
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setSubmitted(false)}
                className="rounded-xl border-[#C8A66A]/40 text-[#5B1F3D] font-heading text-[10px] tracking-widest uppercase font-black"
              >
                Enviar nova mensagem
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-heading font-black tracking-widest text-[#5B1F3D] uppercase ml-1">Seu Nome</label>
                  <Input 
                    placeholder="Como podemos te chamar?"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="rounded-xl border-[#C8A66A]/30 focus:border-[#5B1F3D] h-12"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-heading font-black tracking-widest text-[#5B1F3D] uppercase ml-1">E-mail para resposta *</label>
                  <Input 
                    type="email"
                    required
                    placeholder="Ex: aluna@email.com"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="rounded-xl border-[#C8A66A]/30 focus:border-[#5B1F3D] h-12"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-heading font-black tracking-widest text-[#5B1F3D] uppercase ml-1">Tipo de Solicitação *</label>
                  <Select onValueChange={v => setFormData(prev => ({ ...prev, type: v }))}>
                    <SelectTrigger className="rounded-xl border-[#C8A66A]/30 focus:border-[#5B1F3D] h-12 bg-white">
                      <SelectValue placeholder="Selecione o motivo..." />
                    </SelectTrigger>
                    <SelectContent>
                      {REQUEST_TYPES.map(t => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-heading font-black tracking-widest text-[#5B1F3D] uppercase ml-1">Assunto</label>
                  <Input 
                    placeholder="Resumo do problema"
                    value={formData.subject}
                    onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="rounded-xl border-[#C8A66A]/30 focus:border-[#5B1F3D] h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-heading font-black tracking-widest text-[#5B1F3D] uppercase ml-1">Mensagem detalhada *</label>
                <Textarea 
                  placeholder="Descreva o que aconteceu..."
                  required
                  rows={5}
                  value={formData.message}
                  onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="rounded-2xl border-[#C8A66A]/30 focus:border-[#5B1F3D] p-4 min-h-[120px]"
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 bg-[#5B1F3D] hover:bg-[#3D1429] text-white rounded-2xl font-heading font-black tracking-[0.2em] shadow-lg border-2 border-[#C8A66A] transition-all"
              >
                {loading ? "ENVIANDO..." : "ENVIAR SOLICITAÇÃO"}
              </Button>
            </form>
          )}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/40 border border-[#C8A66A]/20 p-6 rounded-2xl space-y-3">
            <div className="flex items-center gap-3 text-[#5B1F3D]">
              <HelpCircle className="w-5 h-5" />
              <h3 className="font-heading font-black text-sm uppercase tracking-widest">Dúvidas Frequentes</h3>
            </div>
            <ul className="space-y-2 text-xs font-body font-bold text-[#5B1F3D]/70 italic leading-relaxed">
              <li>• Acesso Hotmart é liberado automaticamente por e-mail.</li>
              <li>• Use o mesmo e-mail da compra para fazer login.</li>
              <li>• Esqueceu a senha? Use o link na tela de entrada.</li>
            </ul>
          </div>
          <div className="bg-white/40 border border-[#C8A66A]/20 p-6 rounded-2xl space-y-3">
            <div className="flex items-center gap-3 text-[#5B1F3D]">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-heading font-black text-sm uppercase tracking-widest">Aviso Importante</h3>
            </div>
            <p className="text-xs font-body font-bold text-[#5B1F3D]/70 italic leading-relaxed">
              Seu progresso é salvo no banco de dados. Caso perceba alguma inconsistência, descreva a lição ou arcano afetado para que possamos auditar.
            </p>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
};

export default SupportPage;