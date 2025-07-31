"use client";
import React, { useState } from "react";
import { useIsMobile } from "../_hooks/useIsMobile";

const StyleContext = React.createContext();
export default StyleContext;

export function StyleProvider({ children }) {
  const isMobile = useIsMobile();
  const styleContext = { isMobile };
  const [isDefault, setIsDefault] = useState(true);

  const context = {
    styleContext,
    isDefault,
    setIsDefault,
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
