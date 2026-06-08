import { useRole } from "@/hooks/use-role";

export const useIsAdmin = () => {
  const { isAdmin, loading } = useRole();
  return { isAdmin, loading };
};

