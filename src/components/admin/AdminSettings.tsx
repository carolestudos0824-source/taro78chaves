import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Code2,
  Database,
  Store,
  CreditCard,
  ShieldCheck,
  KeyRound,
  Bell,
  LogIn,
  ChevronRight,
  ExternalLink,
  X,
  Settings2,
  Wrench,
  Cloud,
  Smartphone,
  Sparkles,
  MoonStar,
} from "lucide-react";

type Status = "ativo" | "pendente" | "opcional" | "proxima_fase" | "fora_de_escopo";
type Dependency = "externa" | "codigo" | "ambas" | "nenhuma";

interface Item {
  id: string;
  name: string;
  detail: string;
  icon: typeof Code2;
  status: Status;
  dependency: Dependency;
  whatsMissing?: string[];
  nextStep?: string;
  externalLink?: { label: string; url: string };
}

const STATUS_META: Record<
  Status,
  { label: string; icon: typeof CheckCircle2; cls: string; dot: string; muted?: boolean }
> = {
  ativo: {
    label: "Ativo",
    icon: CheckCircle2,
    cls: "bg-primary/10 text-primary border-primary/20",
    dot: "bg-primary",
  },
  pendente: {
    label: "Pendente desta fase",
    icon: Clock,
    cls: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    dot: "bg-amber-500",
  },
  opcional: {
    label: "Opcional · não bloqueia",
    icon: Sparkles,
    cls: "bg-secondary/10/10 text-secondary border-secondary/30/20",
    dot: "bg-secondary/10",
  },
  proxima_fase: {
    label: "Próxima fase",
    icon: MoonStar,
    cls: "bg-secondary/10/10 text-secondary border-secondary/30/20",
    dot: "bg-secondary/10",
    muted: true,
  },
  fora_de_escopo: {
    label: "Fora do escopo desta fase",
    icon: Smartphone,
    cls: "bg-muted/40 text-muted-foreground border-border/40",
    dot: "bg-muted-foreground/30",
    muted: true,
  },
};

const DEPENDENCY_META: Record<Dependency, { label: string; icon: typeof Cloud }> = {
  externa: { label: "Configuração externa", icon: Cloud },
  codigo: { label: "Implementação em código", icon: Code2 },
  ambas: { label: "Externa + código", icon: Wrench },
  nenhuma: { label: "Sem dependências", icon: CheckCircle2 },
};

const INFRA: Item[] = [
  {
    id: "db",
    name: "Banco de dados",
    detail: "Lovable Cloud · ativo",
    icon: Database,
    status: "ativo",
    dependency: "nenhuma",
    nextStep: "Nenhuma ação necessária.",
  },
  {
    id: "code",
    name: "Acesso ao código",
    detail: "Lovable · edição e export disponíveis",
    icon: Code2,
    status: "ativo",
    dependency: "nenhuma",
    nextStep: "Edição e deploy automatizados pela plataforma.",
  },
];

const AUTH: Item[] = [
  {
    id: "auth-email",
    name: "Autenticação por e-mail e senha",
    detail: "Login, cadastro e recuperação de senha",
    icon: KeyRound,
    status: "ativo",
    dependency: "nenhuma",
    nextStep: "Operacional. Sem ação pendente.",
  },
  {
    id: "auth-roles",
    name: "Papéis administrativos",
    detail: "Admin · Moderador · Usuário",
    icon: ShieldCheck,
    status: "ativo",
    dependency: "nenhuma",
    nextStep: "Gestão completa em Papéis.",
  },
  {
    id: "auth-oauth",
    name: "OAuth Google / Apple",
    detail: "Login social com provedores",
    icon: LogIn,
    status: "opcional",
    dependency: "ambas",
    whatsMissing: [
      "Configurar Client ID e Secret no Google Cloud",
      "Configurar Service ID na Apple Developer (necessário só no app mobile)",
      "Habilitar provedores no backend",
      "Adicionar botões de login social na tela de Auth",
    ],
    nextStep:
      "Opcional para o lançamento web. E-mail e senha já cobrem o fluxo. Pode ser ativado em qualquer momento sem refatoração.",
  },
];

const COMERCIAL: Item[] = [
  {
    id: "stripe",
    name: "Stripe (web)",
    detail: "Cobrança recorrente mensal e anual",
    icon: CreditCard,
    status: "ativo",
    dependency: "externa",
    nextStep:
      "Checkout, webhook e mirror de premium_until validados em produção. Monitorar eventos em Assinaturas.",
    externalLink: { label: "Stripe Dashboard", url: "https://dashboard.stripe.com" },
  },
  {
    id: "revenuecat",
    name: "RevenueCat (mobile)",
    detail: "Assinaturas via App Store e Google Play",
    icon: Store,
    status: "fora_de_escopo",
    dependency: "ambas",
    whatsMissing: [
      "Criar app no RevenueCat e linkar com App Store / Play Console",
      "Configurar produtos IAP nas lojas",
      "Implementar SDK no app mobile",
      "Conectar webhook do RevenueCat ao backend",
    ],
    nextStep: "Planejado para a fase mobile. Não aplicável ao lançamento web.",
    externalLink: { label: "RevenueCat", url: "https://www.revenuecat.com" },
  },
];

const ENGAJAMENTO: Item[] = [
  {
    id: "push",
    name: "Notificações push",
    detail: "Lembretes diários e retenção",
    icon: Bell,
    status: "fora_de_escopo",
    dependency: "ambas",
    whatsMissing: [
      "Definir provedor (OneSignal, Firebase ou nativo)",
      "Configurar credenciais e certificados push",
      "Implementar opt-in e gerenciamento de preferências",
      "Criar fluxos de envio (streak, lembrete diário, lições novas)",
    ],
    nextStep:
      "Planejado para a fase mobile. No web a retenção é tratada por e-mail e in-app banners.",
  },
];

const SECTIONS: Array<{ id: string; title: string; description: string; items: Item[] }> = [
  {
    id: "infra",
    title: "Infraestrutura",
    description: "Base técnica da plataforma — sem ação operacional necessária.",
    items: INFRA,
  },
  {
    id: "auth",
    title: "Autenticação e acesso",
    description: "Como pessoas entram e que permissões recebem.",
    items: AUTH,
  },
  {
    id: "comercial",
    title: "Comercial",
    description: "Cobrança recorrente e monetização. Centro do produto.",
    items: COMERCIAL,
  },
  {
    id: "engajamento",
    title: "Engajamento",
    description: "Canais de retenção e reativação.",
    items: ENGAJAMENTO,
  },
];

const ALL_ITEMS = SECTIONS.flatMap((s) => s.items);

const ItemRow = ({ item, onClick }: { item: Item; onClick: () => void }) => {
  const meta = STATUS_META[item.status];
  const Icon = item.icon;
  const StatusIcon = meta.icon;
  const active = item.status === "ativo";
  const muted = meta.muted;
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-[#C8A66A]/10 bg-white hover:bg-[#FAF5EF] hover:border-[#C8A66A]/40 hover:shadow-md transition-all text-left group ${
        muted ? "opacity-60 hover:opacity-100" : ""
      }`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border-2 ${
          active ? "bg-[#5B1F3D] text-white border-[#C8A66A]/40" : "bg-[#FAF5EF] text-[#C8A66A] border-[#C8A66A]/20"
        }`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-heading font-black text-[#5B1F3D]">{item.name}</p>
        <p className="text-xs font-body font-bold text-[#5B1F3D]/50 truncate">{item.detail}</p>
      </div>
      <span
        className={`flex items-center gap-1.5 text-[10px] font-heading font-black tracking-widest uppercase px-3 py-1.5 rounded-full shrink-0 border-2 shadow-sm ${meta.cls}`}
      >
        <StatusIcon className="w-3.5 h-3.5" />
        {meta.label}
      </span>
      <ChevronRight className="w-5 h-5 text-[#C8A66A]/40 group-hover:text-[#5B1F3D] transition-colors shrink-0" />
    </button>
  );
};

const ItemDetailDrawer = ({ item, onClose }: { item: Item; onClose: () => void }) => {
  const meta = STATUS_META[item.status];
  const dep = DEPENDENCY_META[item.dependency];
  const StatusIcon = meta.icon;
  const DepIcon = dep.icon;
  const Icon = item.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <button
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        aria-label="Fechar"
      />
      <div className="relative w-full sm:max-w-md max-h-[85vh] overflow-y-auto bg-card border border-border/60 rounded-t-2xl sm:rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-200">
        <div className="sticky top-0 bg-card/95 backdrop-blur border-b border-border/40 p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-base text-foreground">{item.name}</h3>
            <p className="text-[11px] text-muted-foreground">{item.detail}</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <span
              className={`flex items-center gap-1.5 text-[10px] font-heading tracking-wide px-2 py-1 rounded-full border ${meta.cls}`}
            >
              <StatusIcon className="w-3 h-3" />
              {meta.label}
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-heading tracking-wide px-2 py-1 rounded-full border border-border/40 bg-muted/30 text-muted-foreground">
              <DepIcon className="w-3 h-3" />
              {dep.label}
            </span>
          </div>

          {item.whatsMissing && item.whatsMissing.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-heading tracking-[0.18em] uppercase text-muted-foreground/70">
                O que envolve
              </h4>
              <ul className="space-y-1.5">
                {item.whatsMissing.map((m, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-foreground/90 leading-relaxed"
                  >
                    <span className="w-1 h-1 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {item.nextStep && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-heading tracking-[0.18em] uppercase text-muted-foreground/70">
                Próximo passo
              </h4>
              <p className="text-xs text-foreground/90 leading-relaxed p-3 rounded-lg bg-muted/30 border border-border/30">
                {item.nextStep}
              </p>
            </div>
          )}

          {item.externalLink && (
            <a
              href={item.externalLink.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-primary/10 text-primary text-xs font-heading tracking-wide hover:bg-primary/15 transition-colors"
            >
              {item.externalLink.label}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminSettings = () => {
  const [selected, setSelected] = useState<Item | null>(null);

  // Apenas estes contam para "saúde da fase web atual".
  const ativos = ALL_ITEMS.filter((i) => i.status === "ativo").length;
  const pendentes = ALL_ITEMS.filter((i) => i.status === "pendente").length;
  const opcionais = ALL_ITEMS.filter((i) => i.status === "opcional").length;
  const proximaFase = ALL_ITEMS.filter(
    (i) => i.status === "proxima_fase" || i.status === "fora_de_escopo",
  ).length;

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h2 className="font-heading text-3xl md:text-4xl text-[#5B1F3D] font-black tracking-tight mb-2">Configurações</h2>
        <p className="text-base font-body font-bold text-[#5B1F3D]/60">
          Governança da plataforma — monitoramento e status da fase web atual.
        </p>
      </header>

      {/* ═══ CAMADA 1: VISÃO GERAL POR ESCOPO ═══ */}
      <section className="space-y-3">
        <div className="flex items-center gap-4 mb-6">
          <Settings2 className="w-5 h-5 text-[#C8A66A]" />
          <h3 className="font-heading text-xs tracking-[0.3em] uppercase text-[#5B1F3D] font-black">
            Saúde da fase web
          </h3>
          <div className="h-[2px] flex-1 bg-[#C8A66A]/20" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { label: "Ativos", value: ativos, status: "ativo" as Status },
            { label: "Pendentes", value: pendentes, status: "pendente" as Status },
            { label: "Opcionais", value: opcionais, status: "opcional" as Status },
            { label: "Próxima fase", value: proximaFase, status: "proxima_fase" as Status },
          ].map((s) => {
            const meta = STATUS_META[s.status];
            return (
              <div
                key={s.label}
                className="p-6 rounded-[2rem] border-2 border-[#C8A66A]/20 bg-white shadow-lg text-center transition-all hover:scale-105"
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className={`w-3 h-3 rounded-full shadow-sm ${meta.dot}`} />
                  <p className="font-heading text-3xl text-[#5B1F3D] font-black">{s.value}</p>
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#5B1F3D]/60 font-black">
                  {s.label}
                </p>
              </div>
            );
          })}
        </div>
        <p className="text-sm font-body font-bold text-[#5B1F3D]/70 leading-relaxed px-1 mt-4">
          Apenas itens <span className="text-[#5B1F3D] font-black">Ativos</span> e{" "}
          <span className="text-[#5B1F3D] font-black">Pendentes</span> impactam o lançamento web.{" "}
          <span className="text-[#5B1F3D] font-black">Opcionais</span> não bloqueiam.{" "}
          <span className="text-[#5B1F3D] font-black">Próxima fase</span> entra no roadmap mobile.
        </p>
      </section>

      {/* ═══ CAMADA 2: ITENS POR ÁREA ═══ */}
      <section className="space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <Wrench className="w-5 h-5 text-[#C8A66A]" />
          <h3 className="font-heading text-xs tracking-[0.3em] uppercase text-[#5B1F3D] font-black">
            Itens por área
          </h3>
          <div className="h-[2px] flex-1 bg-[#C8A66A]/20" />
        </div>

        {SECTIONS.map((section) => (
          <div key={section.id} className="space-y-2">
            <div>
              <h4 className="font-heading text-sm text-foreground">{section.title}</h4>
              <p className="text-[11px] text-muted-foreground">{section.description}</p>
            </div>
            <div className="space-y-1.5">
              {section.items.map((item) => (
                <ItemRow key={item.id} item={item} onClick={() => setSelected(item)} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <div className="rounded-lg border border-border/30 bg-muted/20 p-3 text-[11px] text-muted-foreground leading-relaxed">
        Esta tela é o painel de governança. Gestão de papéis fica em{" "}
        <span className="text-foreground">Papéis</span>, códigos presente em{" "}
        <span className="text-foreground">Presentes</span>, assinaturas em{" "}
        <span className="text-foreground">Assinaturas</span>, e o histórico de mudanças em{" "}
        <span className="text-foreground">Auditoria</span>.
      </div>

      {selected && <ItemDetailDrawer item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default AdminSettings;
