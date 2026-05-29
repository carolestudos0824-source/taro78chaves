import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { initGA } from "@/lib/analytics";

const ConsentBanner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("taro_analytics_consent");
    if (!consent) {
      setShow(true);
    } else if (consent === "true") {
      initGA();
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("taro_analytics_consent", "true");
    setShow(false);
    initGA();
  };

  const handleDecline = () => {
    localStorage.setItem("taro_analytics_consent", "false");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md border border-gold/20 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="space-y-2 text-center md:text-left">
          <p className="font-heading text-sm md:text-base text-plum font-bold">
            Respeitamos sua privacidade ✦
          </p>
          <p className="font-body text-xs md:text-sm text-midnight/70 leading-relaxed max-w-xl">
            Usamos cookies e analytics para entender como você utiliza a jornada e melhorar sua experiência. Ao aceitar, você nos ajuda a evoluir a plataforma.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            variant="ghost"
            onClick={handleDecline}
            className="flex-1 md:flex-none h-11 px-6 rounded-xl text-midnight/50 hover:text-midnight hover:bg-black/5 font-heading text-[10px] tracking-widest uppercase"
          >
            Recusar
          </Button>
          <Button
            onClick={handleAccept}
            className="flex-1 md:flex-none h-11 px-8 rounded-xl bg-plum hover:bg-plum/90 text-ivory font-heading text-[10px] tracking-widest uppercase shadow-lg shadow-plum/20"
          >
            Aceitar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner;
