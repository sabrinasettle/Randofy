"use client";
import React from "react";
import { useIsMobile } from "../_hooks/useIsMobile";

const StyleContext = React.createContext();
export default StyleContext;

export function StyleProvider({ children }) {
  const isMobile = useIsMobile();
  const styleContext = { isMobile };

  const context = {
    styleContext,
  };

  return (
    <StyleContext.Provider value={context}>{children}</StyleContext.Provider>
  );
}

export function useStyleContext() {
  const context = React.useContext(StyleContext);
  if (!context) {
    throw new Error("useStyleContext must be used within a StyleProvider");
  }
  return context;
}
