import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import brandIcon from "@/assets/brand-icon.png";
import { trackEvent } from "@/lib/analytics";

const AuthPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "login" ? "login" : searchParams.get("mode") === "forgot" ? "forgot" : "signup";
  const [mode, setMode] = useState<"login" | "signup" | "forgot">(initialMode);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  useEffect(() => {
    console.log("AuthPage mounted");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) setError(error.message);
      else setInfo("E-mail de recuperação enviado.");
      setLoading(false);
      return;
    }

    try {
      if (mode === "signup") {
        trackEvent("signup_started");
        const { error } = await signUp(email, password, name);
        if (error) throw error;
        trackEvent("signup_completed");
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
      }
      navigate("/module/fundamentos");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-6 py-12">
      {/* Background — Marfim Suave refined from /app */}
      <div className="fixed inset-0 z-0 mystic-bg-procedural">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #FAF5EF 0%, #F5EBDE 45%, #EFE2D2 100%)",
            opacity: 0.98,
          }}
        />
        {/* Subtle atmosphere layers */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 50% 20%, rgba(243, 230, 224, 0.45) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(250, 245, 239, 0.8) 0%, transparent 30%, transparent 70%, rgba(239, 226, 210, 0.5) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm space-y-10">
        <button onClick={() => navigate("/")} className="flex items-center gap-3 text-[11px] font-heading tracking-[0.3em] uppercase opacity-80 hover:opacity-100 transition-all font-black text-[#5B1F3D]">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        <div className="text-center space-y-6">
          <div className="relative inline-block group">
            <div className="absolute inset-0 bg-[#C8A66A]/20 rounded-3xl blur-2xl group-hover:bg-[#C8A66A]/40 transition-all duration-700" />
            <img
              src={brandIcon}
              alt="Tarô 78 Chaves"
              className="relative z-10 w-24 h-24 mx-auto rounded-3xl shadow-2xl border-2 border-[#C8A66A40] transition-transform duration-700 hover:rotate-6"
            />
          </div>
          
          <div className="space-y-4">
            <h1 className="font-heading text-4xl tracking-tight font-black" style={{ color: "#5B1F3D" }}>
              {mode === "signup" ? "Criar conta" : mode === "login" ? "Entrar" : "Recuperar senha"}
            </h1>
            <p className="text-[15px] font-body text-[#5B1F3D] max-w-[280px] mx-auto leading-relaxed font-bold">
              {mode === "signup" ? "Inicie pelos Fundamentos para desbloquear toda a Jornada." : mode === "login" ? "Boas-vindas de volta à sua jornada." : "Enviaremos um link de acesso."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-heading tracking-[0.2em] uppercase text-plum/70 ml-1">Nome</label>
              <Input className="shadcn-input-premium py-6" value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" />
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-[10px] font-heading tracking-[0.2em] uppercase text-plum/70 ml-1">E-mail</label>
            <Input className="shadcn-input-premium py-6" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" required />
          </div>
          {mode !== "forgot" && (
            <div className="space-y-1.5 relative">
              <label className="text-[10px] font-heading tracking-[0.2em] uppercase text-plum/70 ml-1">Senha</label>
              <div className="relative">
                <Input
                  className="shadcn-input-premium py-6"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-plum transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {error && <p className="text-[11px] font-body text-destructive text-center bg-destructive/5 py-2 rounded-lg">{error}</p>}
          {info && <p className="text-[11px] font-body text-success text-center bg-success/5 py-2 rounded-lg">{info}</p>}

          <div className="space-y-3">
            <Button type="submit" disabled={loading} className="w-full py-7 mt-4 bg-[#5B1F3D] text-[#FAF5EF] font-bold rounded-lg hover:bg-[#5B1F3D]/90 transition-all active:scale-95">
              {loading ? "Aguarde..." : mode === "signup" ? "Criar conta e acessar plataforma" : mode === "login" ? "Entrar e continuar jornada" : "Enviar link"}
            </Button>
            {mode === "signup" && (
              <p className="text-[10px] text-center text-muted-foreground/60 font-body italic">
                Inicie sua jornada pelos 78 arcanos.
              </p>
            )}
          </div>
        </form>

        <div className="text-center space-y-4">
          {mode === "login" && (
            <button onClick={() => setMode("forgot")} className="text-[11px] font-heading tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity">
              Esqueci minha senha
            </button>
          )}
          <p className="text-xs font-body text-muted-foreground">
            {mode === "signup" ? "Já tem conta?" : "Não tem conta?"}{" "}
            <button onClick={() => setMode(mode === "signup" ? "login" : "signup")} className="font-heading tracking-wider uppercase text-plum font-bold ml-1">
              {mode === "signup" ? "Entrar" : "Criar conta"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;