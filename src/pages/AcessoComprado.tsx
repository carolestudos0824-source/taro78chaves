import { Key, UserPlus, LogIn, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AcessoComprado = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border border-gold/10 text-center space-y-8 animate-fade-in">
        <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto ring-8 ring-gold/5">
          <Key className="w-10 h-10 text-gold-dark" />
        </div>

        <div className="space-y-4">
          <h1 className="font-heading text-2xl md:text-3xl text-plum font-bold">
            Sua compra foi concluída!
          </h1>
          <p className="font-body text-midnight/70 leading-relaxed text-sm md:text-base">
            Agora crie sua conta na plataforma Tarô 78 Chaves usando o <span className="font-bold text-plum">mesmo e-mail</span> utilizado na compra. Assim que o sistema identificar sua compra aprovada, seu acesso será liberado automaticamente.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-4">
          <Button
            onClick={() => navigate("/auth?mode=signup")}
            className="w-full h-14 rounded-2xl bg-plum hover:bg-plum/90 text-ivory font-heading tracking-widest uppercase flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
          >
            <UserPlus className="w-5 h-5" />
            Criar minha conta
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/auth?mode=login")}
            className="w-full h-14 rounded-2xl border-gold/30 text-plum hover:bg-gold/5 font-heading tracking-widest uppercase flex items-center justify-center gap-3 transition-all"
          >
            <LogIn className="w-5 h-5" />
            Entrar na plataforma
          </Button>
        </div>

        <div className="pt-6 border-t border-gold/10">
          <p className="text-[10px] md:text-xs text-midnight/50 font-body mb-4 uppercase tracking-widest">
            Precisa de ajuda?
          </p>
          <a
            href="https://wa.me/5511970221438?text=Comprei%20o%20Tar%C3%B4%2078%20Chaves%20e%20preciso%20de%20ajuda%20com%20meu%20acesso"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-plum hover:text-gold-dark font-heading text-xs tracking-widest uppercase underline underline-offset-4 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            Falar com suporte
          </a>
        </div>
      </div>
    </div>
  );
};

export default AcessoComprado;
