import { Sparkles } from "lucide-react";

interface ArcanaPresenceHeroProps {
  mainCard: string;
  backCardLeft?: string;
  backCardRight?: string;
  mainCardAlt?: string;
}

export const ArcanaPresenceHero = ({
  mainCard,
  backCardLeft,
  backCardRight,
  mainCardAlt = "Carta de Tarô"
}: ArcanaPresenceHeroProps) => {
  return (
    <div className="relative group max-w-[280px] md:max-w-[320px] lg:max-w-[360px] w-full mb-12 lg:mb-0 animate-fade-in">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gold opacity-20 blur-3xl rounded-full scale-125 animate-pulse" />
      
      {/* Cards Layered - Trio Visual inspired by /jornada-do-louco */}
      <div className="flex items-end justify-center -space-x-12 md:-space-x-16 relative z-10 py-8">
        {/* Back Card Left */}
        {backCardLeft && (
          <div className="w-24 md:w-28 lg:w-32 aspect-[2/3.5] rounded-xl overflow-hidden border-2 border-gold/40 shadow-xl rotate-[-15deg] transition-all hover:rotate-0 hover:z-30 hover:scale-110 duration-500 bg-white">
          <img 
            src={backCardLeft} 
            alt="" 
            className="w-full h-full object-cover" 
            onError={(e) => {
              console.log("Error loading backCardLeft:", backCardLeft);
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=200";
            }}
          />
          </div>
        )}

        {/* Main Card (Center) */}
        <div className="w-40 md:w-48 lg:w-56 aspect-[2/3.5] rounded-2xl overflow-hidden border-4 border-gold shadow-2xl z-20 relative transform hover:scale-105 transition-transform duration-700 bg-white">
          <img src={mainCard} alt={mainCardAlt} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-plum/30 to-transparent opacity-60" />
          
          {/* Subtle Shine Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </div>

        {/* Back Card Right */}
        {backCardRight && (
          <div className="w-24 md:w-28 lg:w-32 aspect-[2/3.5] rounded-xl overflow-hidden border-2 border-gold/40 shadow-xl rotate-[15deg] transition-all hover:rotate-0 hover:z-30 hover:scale-110 duration-500 bg-white">
            <img src={backCardRight} alt="" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Decorative Ornaments */}
      <div className="absolute -top-4 -right-4 text-gold-dark text-3xl animate-bounce-slow">✦</div>
      <div className="absolute -bottom-2 -left-4 text-gold-dark text-2xl animate-pulse delay-700">✨</div>
      <div className="absolute top-1/2 -left-8 text-gold/30 text-xl animate-pulse">✧</div>
    </div>
  );
};
