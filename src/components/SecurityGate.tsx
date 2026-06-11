import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useRole } from "@/hooks/use-role";
import { usePremium } from "@/hooks/use-premium";
import { ShieldAlert, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SecurityGateProps {
  children?: React.ReactNode;
  requireAdmin?: boolean;
  requirePremium?: boolean;
}

const SecurityGate = ({ children, requireAdmin, requirePremium }: SecurityGateProps) => {
  const content = children || <Outlet />;
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useRole();
  const { isPremium, loading: premiumLoading } = usePremium();

  const loading = authLoading || roleLoading || premiumLoading;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF5EF] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#C8A66A]" />
        <p className="font-heading text-xs tracking-widest uppercase text-[#5B1F3D]/60 font-black">
          Validando chaves de segurança...
        </p>
      </div>
    );
  }

  // 1. Not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAF5EF] text-center space-y-6">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center border-2 border-[#C8A66A]/20 shadow-xl">
          <ShieldAlert className="w-10 h-10 text-[#5B1F3D]" />
        </div>
        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-black text-[#5B1F3D]">Acesso Restrito</h1>
          <p className="text-sm font-body font-bold italic text-[#5B1F3D]/60 max-w-xs">
            Este portal exige sintonização. Entre na sua conta para prosseguir.
          </p>
        </div>
        <Button 
          onClick={() => navigate("/auth")}
          className="bg-[#5B1F3D] text-white border-2 border-[#C8A66A] rounded-2xl py-6 px-8 font-heading font-black tracking-widest uppercase shadow-lg"
        >
          Ir para Login
        </Button>
      </div>
    );
  }

  // 2. Requires Admin but not an Admin
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAF5EF] text-center space-y-6">
        <div className="w-20 h-20 bg-[#5B1F3D] rounded-3xl flex items-center justify-center border-2 border-[#C8A66A] shadow-xl">
          <ShieldAlert className="w-10 h-10 text-white" />
        </div>
        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-black text-[#5B1F3D]">Chave Mestra Necessária</h1>
          <p className="text-sm font-body font-bold italic text-[#5B1F3D]/60 max-w-xs">
            Esta área é reservada para o Oráculo e administradores da Escola.
          </p>
        </div>
        <Button 
          onClick={() => navigate("/app")}
          variant="outline"
          className="rounded-2xl py-6 px-8 font-heading font-black tracking-widest uppercase border-2 border-[#DCCFC2] text-[#5B1F3D]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Início
        </Button>
      </div>
    );
  }

  // 3. Requires Premium but not Premium (and not Admin)
  if (requirePremium && !isPremium && !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAF5EF] text-center space-y-6">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center border-2 border-[#C8A66A] shadow-xl">
          <ShieldAlert className="w-10 h-10 text-[#C8A66A]" />
        </div>
        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-black text-[#5B1F3D]">Portal Trancado</h1>
          <p className="text-sm font-body font-bold italic text-[#5B1F3D]/60 max-w-xs">
            Este conteúdo é parte da Jornada Completa. Ative sua assinatura para desbloquear.
          </p>
        </div>
        <div className="flex flex-col w-full max-w-xs gap-3">
          <Button 
            onClick={() => navigate("/premium")}
            className="bg-[#5B1F3D] text-white border-2 border-[#C8A66A] rounded-2xl py-6 px-4 font-heading font-black tracking-widest uppercase shadow-lg h-auto"
          >
            Ativar Jornada Completa
          </Button>
          <Button 
            onClick={() => navigate("/app")}
            variant="ghost"
            className="text-[#5B1F3D]/60 font-heading font-black text-[10px] tracking-widest uppercase"
          >
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return <>{content}</>;
};

export default SecurityGate;
