import React, { useEffect, useState } from "react";

const MobileAuditPage = () => {
  const [metrics, setMetrics] = useState<any>({});

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        bodyScrollWidth: document.body.scrollWidth,
        innerWidth: window.innerWidth,
      });
    };
    updateMetrics();
    window.addEventListener("resize", updateMetrics);
    return () => window.removeEventListener("resize", updateMetrics);
  }, []);

  const AuditFrame = ({ width, height, label, src }: { width: number; height: number; label: string; src: string }) => (
    <div className="flex flex-col items-center gap-4">
      <p className="text-white font-heading font-black tracking-widest uppercase text-sm">{label}</p>
      <div className="relative border-[8px] border-slate-700 rounded-[3rem] shadow-2xl overflow-hidden bg-white" style={{ width: `${width}px`, height: `${height}px` }}>
        <iframe 
          src={src} 
          style={{ width: '100%', height: '100%', border: 'none' }}
          title={label}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 p-8 flex flex-col items-center gap-12 overflow-y-auto pb-32 w-full">
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-white w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">Auditoria Mobile - Rota /trilhas</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-black/20 p-3 rounded-lg">
            <p className="opacity-60 uppercase text-[10px] font-bold">scrollWidth</p>
            <p className="text-xl font-mono">{metrics.scrollWidth}px</p>
          </div>
          <div className="bg-black/20 p-3 rounded-lg">
            <p className="opacity-60 uppercase text-[10px] font-bold">clientWidth</p>
            <p className="text-xl font-mono">{metrics.clientWidth}px</p>
          </div>
          <div className="bg-black/20 p-3 rounded-lg">
            <p className="opacity-60 uppercase text-[10px] font-bold">bodyScrollWidth</p>
            <p className="text-xl font-mono">{metrics.bodyScrollWidth}px</p>
          </div>
          <div className="bg-black/20 p-3 rounded-lg">
            <p className="opacity-60 uppercase text-[10px] font-bold">innerWidth</p>
            <p className="text-xl font-mono">{metrics.innerWidth}px</p>
          </div>
        </div>
        <p className={`mt-4 text-sm font-bold ${metrics.scrollWidth > metrics.clientWidth ? 'text-red-400' : 'text-green-400'}`}>
          {metrics.scrollWidth > metrics.clientWidth ? "❌ OVERFLOW DETECTADO" : "✅ SEM OVERFLOW HORIZONTAL"}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-16 items-start">
        <AuditFrame width={360} height={800} label="Preview 360x800" src="/trilhas?__lovable_force_render=1&__lovable_no_auth=1" />
        <AuditFrame width={390} height={844} label="Preview 390x844" src="/trilhas?__lovable_force_render=1&__lovable_no_auth=1" />
        <AuditFrame width={430} height={932} label="Preview 430x932" src="/trilhas?__lovable_force_render=1&__lovable_no_auth=1" />
      </div>
    </div>
  );
};

export default MobileAuditPage;