import { useEffect, useState } from "react";
import { CheckCircle2, Circle, ExternalLink, Smartphone } from "lucide-react";

interface Item {
  id: string;
  title: string;
  detail: string;
  link?: { label: string; href: string };
}

const ITEMS: Item[] = [
  { id: "privacy", title: "Privacy Policy URL", detail: "URL pública da Política de Privacidade para o Play Console.", link: { label: "/privacidade", href: "/privacidade" } },
  { id: "terms", title: "Termos de Serviço URL", detail: "URL pública dos Termos de Serviço.", link: { label: "/termos", href: "/termos" } },
  { id: "support", title: "Página de Suporte", detail: "Contato e canal de atendimento exigidos pelo Play Console.", link: { label: "/suporte", href: "/suporte" } },
  { id: "delete", title: "Exclusão de conta", detail: "Fluxo público de solicitação de exclusão (obrigatório para apps com login).", link: { label: "/excluir-conta", href: "/excluir-conta" } },
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
    <div className="space-y-6">
      <header className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Smartphone className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-heading text-lg tracking-wide">Play Store — Checklist</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pendências para publicação do Tarô 78 Chaves no Google Play. {completed}/{total} concluídos.
          </p>
        </div>
      </header>

      <div className="rounded-xl border border-border/50 bg-card/40 divide-y divide-border/40">
        {ITEMS.map((item) => {
          const isDone = !!done[item.id];
          return (
            <div key={item.id} className="p-4 flex items-start gap-3">
              <button onClick={() => toggle(item.id)} className="mt-0.5 shrink-0" aria-label={isDone ? "Desmarcar" : "Marcar como concluído"}>
                {isDone
                  ? <CheckCircle2 className="w-5 h-5 text-primary" />
                  : <Circle className="w-5 h-5 text-muted-foreground/60" />}
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
