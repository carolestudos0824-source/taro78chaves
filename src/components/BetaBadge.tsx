const BetaBadge = () => (
  <div
    className="fixed top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 px-3 py-1 rounded-full select-none pointer-events-none md:top-3 md:right-3 md:left-auto md:translate-x-0"
    style={{
      background: "linear-gradient(135deg, hsl(340 42% 28% / 0.85), hsl(280 30% 28% / 0.85))",
      border: "1px solid hsl(36 45% 58% / 0.30)",
      boxShadow: "0 2px 12px hsl(340 42% 28% / 0.20)",
      backdropFilter: "blur(8px)",
    }}
  >
    <span className="text-[8px] md:text-[9px] font-heading tracking-[0.25em] uppercase" style={{ color: "hsl(36 45% 70%)" }}>
      ✦ Beta Privada
    </span>
  </div>
);

export default BetaBadge;
