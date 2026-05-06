import { useReducedMotion } from "framer-motion";

/**
 * Custom hook to safely handle reduced motion preferences.
 * Returns true if the user has requested reduced motion at the system level.
 */
export function useReducedMotionSafe() {
  return useReducedMotion();
}
