import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserData {
  title: string;
  name: string;
  email: string;
  isTestUser: boolean;
  isPaidUser: boolean;
  planType?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserData | null;
  needsWelcomeSetup: boolean;
  login: (userData?: Partial<UserData>) => void;
  logout: () => void;
  completeWelcomeSetup: (userData: { title: string; name: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [needsWelcomeSetup, setNeedsWelcomeSetup] = useState(false);

  useEffect(() => {
    // Verificar se o usuário está logado
    const authStatus = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('userData');
    
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Se for usuário pago com nome, não precisa de setup
        // Se for usuário teste sem configuração completa, precisa de setup
        if (parsedUser.isPaidUser && parsedUser.name) {
          setNeedsWelcomeSetup(false);
        } else if (!parsedUser.name || !parsedUser.title) {
          setNeedsWelcomeSetup(true);
        } else {
          setNeedsWelcomeSetup(false);
        }
      } else {
        setNeedsWelcomeSetup(true);
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = (userData?: Partial<UserData>) => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    
    if (userData) {
      const fullUserData: UserData = {
        title: userData.title || '',
        name: userData.name || '',
        email: userData.email || 'medico@docia.com',
        isTestUser: userData.isTestUser || false,
        isPaidUser: userData.isPaidUser || false,
        planType: userData.planType || '',
      };
      setUser(fullUserData);
      localStorage.setItem('userData', JSON.stringify(fullUserData));
      
      // Se for usuário pago com nome, não precisa de setup
      if (fullUserData.isPaidUser && fullUserData.name) {
        setNeedsWelcomeSetup(false);
      } else {
        setNeedsWelcomeSetup(true);
      }
    } else {
      setNeedsWelcomeSetup(true);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setNeedsWelcomeSetup(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
  };

  const completeWelcomeSetup = (setupData: { title: string; name: string }) => {
    const updatedUser: UserData = {
      ...setupData,
      email: user?.email || 'medico@docia.com',
      isTestUser: user?.isTestUser || true,
      isPaidUser: user?.isPaidUser || false,
      planType: user?.planType || '',
    };
    
    setUser(updatedUser);
    setNeedsWelcomeSetup(false);
    localStorage.setItem('userData', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading, 
      user, 
      needsWelcomeSetup, 
      login, 
      logout, 
      completeWelcomeSetup 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
