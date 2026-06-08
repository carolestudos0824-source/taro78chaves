import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const useIsAdmin = () => {
  const { isAdmin, loading } = useRole();
  return { isAdmin, loading };
};

