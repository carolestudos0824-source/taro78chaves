import React, { useEffect, useState } from "react";
import TrailsPage from "./TrailsPage";

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
        {/* Frame 360px */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-white font-heading font-black tracking-widest uppercase text-sm">Preview 360x800</p>
          <div className="relative border-[8px] border-slate-700 rounded-[3rem] shadow-2xl overflow-hidden bg-white" style={{ width: '360px', height: '800px' }}>
             <div className="absolute inset-0 overflow-y-auto overflow-x-hidden w-full">
                <TrailsPage />
             </div>
          </div>
        </div>

        {/* Frame 390px */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-white font-heading font-black tracking-widest uppercase text-sm">Preview 390x844</p>
          <div className="relative border-[8px] border-slate-700 rounded-[3rem] shadow-2xl overflow-hidden bg-white" style={{ width: '390px', height: '844px' }}>
             <div className="absolute inset-0 overflow-y-auto overflow-x-hidden w-full">
                <TrailsPage />
             </div>
          </div>
        </div>

        {/* Frame 430px */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-white font-heading font-black tracking-widest uppercase text-sm">Preview 430x932</p>
          <div className="relative border-[8px] border-slate-700 rounded-[3rem] shadow-2xl overflow-hidden bg-white" style={{ width: '430px', height: '932px' }}>
             <div className="absolute inset-0 overflow-y-auto overflow-x-hidden w-full">
                <TrailsPage />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAuditPage;
