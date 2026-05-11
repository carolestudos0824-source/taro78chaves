import { useState } from "react";
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
  const initialMode = searchParams.get("mode") === "forgot" ? "forgot" : "signup";
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
      navigate("/app");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm space-y-8">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-xs font-heading tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        <div className="text-center space-y-3">
          <img
            src={brandIcon}
            alt="Tarô 78 Chaves"
            className="w-20 h-20 mx-auto rounded-2xl shadow-sm"
          />
          <h1 className="font-heading text-2xl tracking-wide text-secondary">
            {mode === "signup" ? "Criar conta" : mode === "login" ? "Entrar" : "Recuperar senha"}
          </h1>
          <div className="space-y-2">
            <p className="text-xs font-body text-muted-foreground max-w-[240px] mx-auto leading-relaxed">
              {mode === "signup" ? "Crie sua conta para salvar seu progresso e começar sua jornada pelo Louco." : mode === "login" ? "Boas-vindas de volta à sua jornada." : "Enviaremos um link de acesso."}
            </p>
            {mode === "signup" && (
              <p className="text-[11px] font-bold text-plum italic">
                ✦ Comece pelo Louco gratuitamente. Sem cartão de crédito.
              </p>
            )}
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
            <label className="text-[10px] font-heading tracking-[0.2em] uppercase text-gold-dark ml-1">E-mail</label>
            <Input className="shadcn-input-premium py-6" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" required />
          </div>
          {mode !== "forgot" && (
            <div className="space-y-1.5 relative">
              <label className="text-[10px] font-heading tracking-[0.2em] uppercase text-gold-dark ml-1">Senha</label>
              <div className="relative">
                <Input
                  className="shadcn-input-premium py-6"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-gold-dark transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {error && <p className="text-[11px] font-body text-destructive text-center bg-destructive/5 py-2 rounded-lg">{error}</p>}
          {info && <p className="text-[11px] font-body text-success text-center bg-success/5 py-2 rounded-lg">{info}</p>}

          <div className="space-y-3">
            <Button type="submit" disabled={loading} className="btn-premium w-full py-7 mt-4">
              {loading ? "Aguarde..." : mode === "signup" ? "Criar conta e começar grátis" : mode === "login" ? "Entrar e continuar jornada" : "Enviar link"}
            </Button>
            {mode === "signup" && (
              <p className="text-[10px] text-center text-muted-foreground/60 font-body italic">
                Vá bem na primeira lição e desbloqueie O Mago.
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
            <button onClick={() => setMode(mode === "signup" ? "login" : "signup")} className="font-heading tracking-wider uppercase text-gold-dark ml-1">
              {mode === "signup" ? "Entrar" : "Criar conta"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;