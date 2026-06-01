import { createContext, useCallback, useContext, useEffect, useState, useMemo, type ReactNode } from "react";

export type FontSize = "normal" | "large" | "xl";

const STORAGE_KEY = "tarot-font-size";
const VALID_SIZES: FontSize[] = ["normal", "large", "xl"];

interface FontSizeContextValue {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  increaseFont: () => void;
  decreaseFont: () => void;
}

const FontSizeContext = createContext<FontSizeContextValue | undefined>(undefined);

function readStoredSize(): FontSize {
  if (typeof window === "undefined") return "normal";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && (VALID_SIZES as string[]).includes(stored)) {
      return stored as FontSize;
    }
  } catch {
    // ignore (private mode, etc.)
  }
  return "normal";
}

function applyClass(size: FontSize) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("font-normal-size", "font-large", "font-xl");
  if (size === "large") root.classList.add("font-large");
  else if (size === "xl") root.classList.add("font-xl");
  // "normal" → no class, falls back to base 17px
}

export function FontSizeProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>(() => readStoredSize());

  // Apply class on mount and whenever it changes
  useEffect(() => {
    applyClass(fontSize);
  }, [fontSize]);

  const setFontSize = useCallback((size: FontSize) => {
    setFontSizeState(size);
    try {
      window.localStorage.setItem(STORAGE_KEY, size);
    } catch {
      // ignore
    }
  }, []);

  const increaseFont = useCallback(() => {
    const currentIndex = VALID_SIZES.indexOf(fontSize);
    if (currentIndex < VALID_SIZES.length - 1) {
      setFontSize(VALID_SIZES[currentIndex + 1]);
    }
  }, [fontSize, setFontSize]);

  const decreaseFont = useCallback(() => {
    const currentIndex = VALID_SIZES.indexOf(fontSize);
    if (currentIndex > 0) {
      setFontSize(VALID_SIZES[currentIndex - 1]);
    }
  }, [fontSize, setFontSize]);

  const value = useMemo(() => ({ fontSize, setFontSize, increaseFont, decreaseFont }), [fontSize, setFontSize, increaseFont, decreaseFont]);

  return (
    <FontSizeContext.Provider value={value}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  const ctx = useContext(FontSizeContext);
  if (!ctx) {
    throw new Error("useFontSize must be used within a FontSizeProvider");
  }
  return ctx;
}
