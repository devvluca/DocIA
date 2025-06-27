import { useState, useEffect } from 'react';

export const useNavbar = () => {
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

  return {
    isCollapsed,
    toggleCollapse
  };
};
