import { useEffect, useState } from "react";
import { CheckCircle2, Circle, ExternalLink, Smartphone } from "lucide-react";
import { AdminSectionHeading } from "./AdminComponents";

interface Item {
  id: string;
  title: string;
  detail: string;
  link?: { label: string; href: string };
}

const ITEMS: Item[] = [
  { id: "privacy", title: "Privacy Policy URL", detail: "URL pública da Política de Privacidade para o Play Console.", link: { label: "taro78chaves.lovable.app/privacidade", href: "https://taro78chaves.lovable.app/privacidade" } },
  { id: "terms", title: "Termos de Serviço URL", detail: "URL pública dos Termos de Serviço.", link: { label: "taro78chaves.lovable.app/termos", href: "https://taro78chaves.lovable.app/termos" } },
  { id: "support", title: "Página de Suporte", detail: "Contato e canal de atendimento exigidos pelo Play Console.", link: { label: "taro78chaves.lovable.app/suporte", href: "https://taro78chaves.lovable.app/suporte" } },
  { id: "delete", title: "Exclusão de conta", detail: "Fluxo público de solicitação de exclusão (obrigatório para apps com login).", link: { label: "taro78chaves.lovable.app/excluir-conta", href: "https://taro78chaves.lovable.app/excluir-conta" } },
  { id: "data-safety", title: "Data Safety", detail: "Preencher seção Data Safety: dados coletados (e-mail, progresso, analytics), criptografia em trânsito, opção de exclusão." },
  { id: "app-access", title: "App Access para revisão", detail: "Fornecer credenciais demo (login + premium) para o time de revisão do Google." },
  { id: "content-rating", title: "Content Rating", detail: "Aplicar questionário do IARC. Conteúdo educacional simbólico, sem violência/sexo." },
  { id: "target-sdk", title: "Target SDK / API", detail: "Garantir target SDK atualizado conforme exigência vigente do Play Console." },
  { id: "closed-testing", title: "Closed Testing 12×14", detail: "Para contas novas: 12 testers ativos por 14 dias antes da publicação aberta." },
  { id: "billing", title: "Billing policy: Stripe web ≠ Android", detail: "No Android, ocultar checkout Stripe (flag isAndroidApp). Conteúdo digital pago dentro do app deve usar Google Play Billing ou RevenueCat." },
  { id: "icons", title: "Ícones e screenshots", detail: "Ícone 512×512, feature graphic 1024×500, screenshots phone (mín. 2)." },
  { id: "package", title: "Wrapper Android", detail: "Definir TWA (Trusted Web Activity) ou Capacitor; configurar applicationId, signing key e versionCode." },
];

const STORAGE_KEY = "admin.playstore.checklist.v1";

const AdminPlayStore = () => {
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const toggle = (id: string) => {
    setDone((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  const total = ITEMS.length;
  const completed = ITEMS.filter((i) => done[i.id]).length;

  return (
    <div className="space-y-8">
      <AdminSectionHeading 
        title="Play Store" 
        subtitle={`Checklist estratégico para publicação na Google Play Store. ${completed}/${total} itens concluídos.`} 
      />

      <div className="rounded-[2.5rem] border-2 border-[#C8A66A]/20 bg-white/60 shadow-xl overflow-hidden backdrop-blur-md">
        {ITEMS.map((item) => {
          const isDone = !!done[item.id];
          return (
            <div key={item.id} className="p-6 flex items-start gap-4 border-b border-[#C8A66A]/10 last:border-0 hover:bg-[#FAF5EF]/40 transition-colors">
              <button onClick={() => toggle(item.id)} className="mt-0.5 shrink-0" aria-label={isDone ? "Desmarcar" : "Marcar como concluído"}>
                {isDone
                  ? <CheckCircle2 className="w-6 h-6 text-[#5B1F3D]" />
                  : <Circle className="w-6 h-6 text-[#C8A66A]/40 group-hover:text-[#C8A66A]" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${isDone ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.detail}</p>
                {item.link && (
                  <a
                    href={item.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-[11px] text-primary hover:underline"
                  >
                    {item.link.label}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-muted-foreground italic">
        Este checklist é uma referência interna. Estado salvo localmente neste navegador.
      </p>
    </div>
  );
};

export default AdminPlayStore;
