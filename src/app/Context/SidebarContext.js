"use client"
import { createContext, useContext, useState } from 'react';

// Create a context for the sidebar state
const SidebarContext = createContext();

// Custom hook to use the Sidebar context
export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children,sidebarOpen, tooglesidebar }) => {
  

  return (
    <SidebarContext.Provider value={{ sidebarOpen, tooglesidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};
