"use client";
import React from "react";
const CardLayout = React.createContext(null);
export default CardLayout;

export function CardLayoutProvider({ children }) {
  const [layoutType, setLayoutType] = React.useState("square-grid");
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  function changeLayout(element) {
    // let element = e.target;
    // console.log(element.getAttribute("aria-label"));
    if (element.id == "" || element.id === layoutType) return;
    setLayoutType(element.id);
  }

  function openSongDetails(song) {
    setIsDrawerOpen(true);
  }

  function closeDrawer() {
    setIsDrawerOpen(false);
  }

  const layoutContext = {
    layoutType,
    changeLayout,
    isDrawerOpen,
    openSongDetails,
    closeDrawer,
  };

  const context = {
    layoutContext,
  };

  return <CardLayout.Provider value={context}>{children}</CardLayout.Provider>;
}

export function useGridContext() {
  const context = React.useContext(CardLayout);
  if (!context) {
    throw new Error("useGridContext must be used within a CardLayoutProvider");
  }
  return context;
}
