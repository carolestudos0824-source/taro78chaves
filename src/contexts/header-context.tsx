import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";

interface HeaderState {
  title?: string;
  subtitle?: string;
  backRoute?: string;
  rightElement?: ReactNode;
  hidePontos?: boolean;
  hideStreak?: boolean;
  hideHeader?: boolean;
}

interface HeaderContextType {
  state: HeaderState;
  setHeader: (state: HeaderState) => void;
  resetHeader: () => void;
}

const defaultState: HeaderState = {
  title: "Tarô 78 Chaves",
  subtitle: "Formação 78 Arcanos",
  hidePontos: false,
  hideStreak: false,
  hideHeader: false,
};

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<HeaderState>(defaultState);

  const setHeader = useCallback((newState: HeaderState) => setState(newState), []);
  const resetHeader = useCallback(() => setState(defaultState), []);

  const value = useMemo(() => ({ state, setHeader, resetHeader }), [state, setHeader, resetHeader]);

  return (
    <HeaderContext.Provider value={value}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
};
