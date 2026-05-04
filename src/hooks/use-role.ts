import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export type AppRole = "admin" | "moderator" | "user";

export const useRole = () => {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<AppRole>("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setRole("user");
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      const roles = (data ?? []).map((r) => r.role as AppRole);
      if (roles.includes("admin")) setRole("admin");
      else if (roles.includes("moderator")) setRole("moderator");
      else setRole("user");
      setLoading(false);
    })();
  }, [authLoading, user]);

  return {
    role,
    loading,
    isAdmin: role === "admin",
    isModerator: role === "moderator",
    isStaff: role === "admin" || role === "moderator",
  };
};

/** Sections each role can access. Admin = everything. */
export const MODERATOR_SECTIONS = [] as const;

export const canAccessSection = (role: AppRole, section: string): boolean => {
  if (role === "admin") return true;
  if (role === "moderator") return (MODERATOR_SECTIONS as readonly string[]).includes(section);
  return false;
};
