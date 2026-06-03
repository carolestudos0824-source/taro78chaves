import React, { useEffect, useState, createContext, useContext, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export type AppRole = "admin" | "auditor" | "moderator" | "user";

interface RoleState {
  role: AppRole;
  loading: boolean;
  isAdmin: boolean;
  isAuditor: boolean;
  isModerator: boolean;
  isStaff: boolean;
}

const RoleContext = createContext<RoleState | undefined>(undefined);

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
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
      setRole("user");
      setLoading(false);
    })();

  }, [authLoading, user]);

  const value = useMemo(() => ({
    role,
    loading,
    isAdmin: role === "admin",
    isAuditor: role === "auditor",
    isModerator: role === "moderator",
    isStaff: role === "admin" || role === "auditor" || role === "moderator",
  }), [role, loading]);

  return React.createElement(RoleContext.Provider, { value }, children);
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    // Return a default value to avoid breaking during transition or in places where provider is missing
    return { role: "user" as AppRole, loading: false, isAdmin: false, isAuditor: false, isModerator: false, isStaff: false };
  }
  return context;
};

/** Sections each role can access. Admin = everything. */
export const MODERATOR_SECTIONS = [] as const;
export const AUDITOR_SECTIONS = [] as const;

export const canAccessSection = (role: AppRole, section: string): boolean => {
  if (role === "admin") return true;
  if (role === "auditor") return (AUDITOR_SECTIONS as readonly string[]).includes(section);
  if (role === "moderator") return (MODERATOR_SECTIONS as readonly string[]).includes(section);
  return false;
};
