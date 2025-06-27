import React, { createContext, useContext, useState, useEffect } from 'react';

interface NavbarContextType {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export const NavbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Carregar estado do localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('navbarCollapsed');
    if (savedState) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Salvar estado no localStorage
  useEffect(() => {
    localStorage.setItem('navbarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <NavbarContext.Provider value={{ isCollapsed, toggleCollapse }}>
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (context === undefined) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
};
