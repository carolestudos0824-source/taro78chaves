import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Key, CheckCircle, XCircle, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ValidateCertificatePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [code, setCode] = useState(searchParams.get("codigo") || "");
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const validateCode = async (validationCode: string) => {
    if (!validationCode) return;
    setLoading(true);
    setError(null);
    setCertificate(null);

    try {
      const { data, error: fetchError } = await supabase
        .rpc("validate_certificate", { _code: validationCode });

      if (fetchError) throw fetchError;

      const row = Array.isArray(data) ? data[0] : data;
      if (!row) {
        setError("Certificado não encontrado.");
      } else {
        setCertificate(row);
      }
    } catch (err) {
      console.error("Erro ao validar certificado:", err);
      setError("Ocorreu um erro ao validar o código. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialCode = searchParams.get("codigo");
    if (initialCode) {
      validateCode(initialCode);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateCode(code);
  };

  return (
    <div className="min-h-screen bg-[#FAF5EF] flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-plum/5 rounded-2xl flex items-center justify-center mx-auto border border-gold/20 shadow-sm">
            <Key className="w-8 h-8 text-gold-dark" />
          </div>
          <h1 className="font-heading text-3xl text-plum font-black tracking-tight">
            Validação de Certificado
          </h1>
          <p className="font-body text-midnight/60 text-sm">
            Insira o código de validação para verificar a autenticidade do certificado.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-8 shadow-xl border border-gold/10 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-heading tracking-[0.2em] uppercase text-plum/70 ml-1">Código de Validação</label>
            <div className="relative">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ex: T78-XXXX-XXXX"
                className="shadcn-input-premium py-6 pl-10"
                required
              />
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gold-dark/50" />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading} 
            className="btn-premium w-full py-7 text-sm shadow-lg"
          >
            {loading ? "Validando..." : "Validar Certificado"}
          </Button>
        </form>

        {error && (
          <div className="bg-red-50 border border-destructive/20 rounded-2xl p-6 flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
            <XCircle className="w-6 h-6 text-destructive shrink-0" />
            <p className="text-sm font-body text-destructive font-bold">{error}</p>
          </div>
        )}

        {certificate && (
          <div className="bg-white rounded-[2rem] p-8 shadow-xl border-2 border-green-100 space-y-6 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3 text-green-600 mb-2">
              <CheckCircle className="w-6 h-6 shrink-0" />
              <span className="font-heading text-lg font-black tracking-tight">Certificado Válido</span>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-gold/10 text-left">
              <div>
                <p className="text-[10px] font-heading tracking-[0.2em] uppercase text-plum/50">Aluno(a)</p>
                <p className="font-heading text-lg text-plum font-black">{certificate.student_name}</p>
              </div>
              <div>
                <p className="text-[10px] font-heading tracking-[0.2em] uppercase text-plum/50">Curso</p>
                <p className="font-body text-sm text-midnight/80 font-bold">{certificate.course_name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-heading tracking-[0.2em] uppercase text-plum/50">Carga Horária</p>
                  <p className="font-body text-sm text-midnight/80 font-bold">{certificate.workload_hours} horas</p>
                </div>
                <div>
                  <p className="text-[10px] font-heading tracking-[0.2em] uppercase text-plum/50">Emissão</p>
                  <p className="font-body text-sm text-midnight/80 font-bold">
                    {new Date(certificate.issued_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-gold/10">
                <p className="text-[10px] font-heading tracking-[0.2em] uppercase text-plum/50">Emitido por</p>
                <p className="font-body text-[11px] text-midnight/60 font-bold">Tarô 78 Chaves • CNPJ 44.472.530/0001-08</p>
              </div>
            </div>
          </div>
        )}

        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-[10px] font-heading tracking-[0.2em] uppercase text-plum/60 hover:text-plum transition-all mx-auto font-black"
        >
          <ArrowLeft className="w-3 h-3" />
          Voltar para Home
        </button>
      </div>
    </div>
  );
};

export default ValidateCertificatePage;