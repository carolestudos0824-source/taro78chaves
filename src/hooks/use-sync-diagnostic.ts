import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook utilitário para forçar a sincronização do progresso no Supabase.
 * Útil para diagnósticos de sincronização em tempo real.
 */
export function useSyncDiagnostic(userId: string | undefined) {
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const forceSync = async (payload: any) => {
    if (!userId) return;
    
    console.log("[diagnostic] forcing sync for user:", userId);
    const { data, error: syncError } = await supabase
      .from("user_progress")
      .upsert({
        user_id: userId,
        ...payload,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })
      .select();

    if (syncError) {
      console.error("[diagnostic] sync failed:", syncError);
      setError(syncError.message);
    } else {
      console.log("[diagnostic] sync success:", data);
      setLastSync(new Date().toISOString());
      setError(null);
    }
  };

  return { forceSync, lastSync, error };
}
