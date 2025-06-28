import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Bot, 
  Settings, 
  LogOut, 
  Moon, 
  Sun,
  Menu,
  X,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { useNavbar } from '@/contexts/NavbarContext';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { isCollapsed, toggleCollapse } = useNavbar();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Função para carregar perfil do usuário
  const loadUserProfile = () => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      name: 'Dr. João Silva',
      email: 'joao.silva@email.com',
      specialty: 'Cardiologia',
      crm: '12345-SP',
      phone: '(11) 99999-9999',
      bio: 'Cardiologista com 15 anos de experiência em diagnósticos cardiovasculares.',
      avatar: null,
      avatarColor: 'bg-blue-500'
    };
  };

  // Função para gerar iniciais ignorando "Dr."
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(word => word.toLowerCase() !== 'dr.' && word.toLowerCase() !== 'dr')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const [userProfile] = useState(loadUserProfile);
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Calendar, label: 'Agenda', path: '/schedule' },
    { icon: FileText, label: 'Documentos', path: '/documents' },
    { icon: Bot, label: 'Agentes IA', path: '/agents' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];
  const isActive = (path: string) => location.pathname === path;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    logout(); // Usar o contexto de autenticação
    navigate('/login');
  };
  return (
    <>
      {/* Adicionar variável CSS global para o padding das páginas */}      <style>{`
        :root {
          --navbar-width: ${isCollapsed ? '72px' : '264px'};
        }
      `}</style>{/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border/50 h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <img 
            src="/img/docia_logo.png" 
            alt="DocIA Logo" 
            className="w-8 h-8 object-contain"
          />
          <div>
            <h1 className="text-lg font-semibold text-foreground">DocIA</h1>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-accent/50"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={closeMobileMenu}
        />
      )}      {/* Desktop Sidebar / Mobile Slide Menu */}
      <nav className={`
        bg-card/95 backdrop-blur-sm border-r border-border/50 h-screen fixed z-50 transition-all duration-300 ease-in-out
        lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}
        w-64
      `} style={{ 
        width: isCollapsed ? '64px' : '256px',
        left: '8px',
        top: '8px',
        height: 'calc(100vh - 16px)',
        borderRadius: '12px'
      }}>{/* Desktop Header */}
        <div className={`transition-all duration-300 border-b border-border/30 hidden lg:block ${isCollapsed ? 'p-3' : 'p-6'}`}>
          <div className="flex items-center gap-3">
            <img 
              src="/img/docia_logo.png" 
              alt="DocIA Logo" 
              className={`object-contain transition-all duration-300 ${isCollapsed ? 'w-10 h-10' : 'w-12 h-12'}`}
            />
            {!isCollapsed && (
              <div className="flex-1">
                <h1 className="text-lg font-semibold text-foreground">DocIA</h1>
                <p className="text-xs text-muted-foreground">Sistema Médico</p>
              </div>
            )}            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCollapse}
              className="p-2 hidden lg:flex hover:bg-accent/50 rounded-full transition-all duration-200 group"
            >
              <div className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
                <ChevronLeft className="w-4 h-4" />
              </div>
            </Button>
          </div>
        </div>        {/* Mobile Header in Sidebar */}
        <div className="p-4 border-b border-border/30 lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/img/docia_logo.png" 
                alt="DocIA Logo" 
                className="w-9 h-9 object-contain"
              />
              <div>
                <h1 className="text-lg font-semibold text-foreground">DocIA</h1>
                <p className="text-xs text-muted-foreground">Sistema Médico</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={userProfile.avatar} />
                <AvatarFallback className={`${userProfile.avatarColor || 'bg-blue-500'} text-white text-xs`}>
                  {getInitials(userProfile.name)}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeMobileMenu}
                className="p-2 lg:hidden hover:bg-accent/50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div><div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'py-4 px-2' : 'py-6 px-4'}`}>
          <ul className={`space-y-1 ${isCollapsed ? '' : ''}`}>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                    isActive(item.path)
                      ? 'bg-primary/10 text-primary border-r-2 border-primary'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                  } ${isCollapsed ? 'lg:justify-center lg:px-2' : ''}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className={`flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'}`} />
                  <span className={`font-medium text-sm transition-all duration-300 ${isCollapsed ? 'lg:hidden' : ''}`}>
                    {item.label}
                  </span>
                  {/* Tooltip para modo colapsado */}
                  {isCollapsed && (
                    <div className="absolute left-14 bg-popover text-popover-foreground px-2 py-1 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none hidden lg:block z-50 border shadow-lg">
                      {item.label}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>        <div className={`border-t border-border/30 space-y-2 transition-all duration-300 ${isCollapsed ? 'p-2' : 'p-4'}`}>          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className={`w-full gap-3 transition-all duration-300 hover:bg-accent/50 group ${
              isCollapsed ? 'lg:justify-center lg:px-2 lg:h-10' : 'justify-start h-9'
            }`}
            title={isCollapsed ? (theme === 'dark' ? 'Modo Claro' : 'Modo Escuro') : undefined}
          >
            <div className="relative w-4 h-4 flex items-center justify-center">
              <Sun className={`absolute w-4 h-4 transition-all duration-500 transform ${
                theme === 'dark' 
                  ? 'opacity-0 scale-0 rotate-90' 
                  : 'opacity-100 scale-100 rotate-0'
              }`} />
              <Moon className={`absolute w-4 h-4 transition-all duration-500 transform ${
                theme === 'dark' 
                  ? 'opacity-100 scale-100 rotate-0' 
                  : 'opacity-0 scale-0 -rotate-90'
              }`} />
            </div>
            <span className={`transition-all duration-300 text-xs font-medium ${isCollapsed ? 'lg:hidden' : ''}`}>
              {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
            </span>
          </Button>
            <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className={`w-full gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300 ${
              isCollapsed ? 'lg:justify-center lg:px-2 lg:h-10' : 'justify-start h-9'
            }`}
            title={isCollapsed ? 'Sair' : undefined}
          >
            <LogOut className={`flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'w-4 h-4' : 'w-4 h-4'}`} />
            <span className={`transition-all duration-300 text-xs font-medium ${isCollapsed ? 'lg:hidden' : ''}`}>
              Sair
            </span>
          </Button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
