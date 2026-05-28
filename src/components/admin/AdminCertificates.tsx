import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  FileText, Search, ExternalLink, ShieldCheck
} from "lucide-react";
import { 
  AdminSectionHeading, AdminBadge, AdminTable, 
  AdminTableHeader, AdminTableHead, AdminTableRow, AdminTableCell 
} from "./AdminComponents";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/** @ts-ignore */
const AdminTableCellFixed = AdminTableCell as any;

interface Certificate {
  id: string;
  user_id: string;
  course_name: string;
  validation_code: string;
  issued_at: string;
  profiles?: any;
}

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("certificates")
        .select(`
          *,
          profiles:user_id (display_name)
        `)
        .order("issued_at", { ascending: false });
      
      setCertificates(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = certificates.filter(c => 
    c.profiles?.display_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.validation_code.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center text-sm text-muted-foreground">Carregando certificados...</div>;

  return (
    <div className="space-y-10">
      <AdminSectionHeading 
        title="Certificados" 
        subtitle="Controle de emissão e validação de diplomas da Escola Digital Tarô 78 Chaves." 
      />

      <div className="bg-white/60 p-6 rounded-[2.5rem] border-2 border-[#C8A66A]/20 backdrop-blur-md shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5B1F3D]/50" />
          <Input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Buscar por nome da aluna ou código..." 
            className="pl-12 h-14 text-base font-body font-bold bg-white border-[#C8A66A]/30 rounded-2xl shadow-inner" 
          />
        </div>
      </div>

      <AdminTable>
        <AdminTableHeader>
          <AdminTableHead>Aluna</AdminTableHead>
          <AdminTableHead className="text-center">Curso</AdminTableHead>
          <AdminTableHead className="text-center">Código de Validação</AdminTableHead>
          <AdminTableHead className="text-center">Data de Emissão</AdminTableHead>
          <AdminTableHead className="text-center">Status</AdminTableHead>
          <AdminTableHead className="text-right">Ações</AdminTableHead>
        </AdminTableHeader>
        <tbody>
          {filtered.length === 0 ? (
            <AdminTableRow>
              <AdminTableCellFixed colSpan={6} className="text-center py-10 text-muted-foreground">Nenhum certificado encontrado.</AdminTableCellFixed>
            </AdminTableRow>
          ) : (
            filtered.map(c => (
              <AdminTableRow key={c.id}>
                <AdminTableCell>
                  <p className="text-[#5B1F3D] font-black leading-tight">{c.profiles?.display_name || "Aluna"}</p>
                </AdminTableCell>
                <AdminTableCell className="text-center font-body font-bold text-sm text-[#5B1F3D]/80">
                  {c.course_name}
                </AdminTableCell>
                <AdminTableCell className="text-center font-mono text-xs font-bold text-[#8B6A30]">
                  {c.validation_code}
                </AdminTableCell>
                <AdminTableCell className="text-center text-sm font-body font-bold">
                  {new Date(c.issued_at).toLocaleDateString("pt-BR")}
                </AdminTableCell>
                <AdminTableCell className="text-center">
                  <AdminBadge variant="success" icon={ShieldCheck}>Válido</AdminBadge>
                </AdminTableCell>
                <AdminTableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-[#5B1F3D] hover:bg-[#FAF5EF]"
                    asChild
                  >
                    <a href={`/validar/${c.validation_code}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Validar
                    </a>
                  </Button>
                </AdminTableCell>
              </AdminTableRow>
            ))
          )}
        </tbody>
      </AdminTable>
    </div>
  );
};

export default AdminCertificates;