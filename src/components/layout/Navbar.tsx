import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

const Navbar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Calendar, label: 'Agenda', path: '/schedule' },
    { icon: FileText, label: 'Documentos', path: '/documents' },
    { icon: Bot, label: 'Agentes IA', path: '/agents' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <img 
            src="/img/docia_logo.png" 
            alt="DocIA Logo" 
            className="w-8 h-8 object-contain"
          />
          <div>
            <h1 className="text-lg font-bold text-primary">DocIA</h1>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={closeMobileMenu}
        />
      )}

      {/* Desktop Sidebar / Mobile Slide Menu */}
      <nav className={`
        bg-card border-r border-border h-screen w-64 fixed left-0 top-0 flex flex-col z-50 transition-transform duration-300
        lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Desktop Header */}
        <div className="p-6 border-b border-border hidden lg:block">
          <div className="flex items-center gap-3">
            <img 
              src="/img/docia_logo.png" 
              alt="DocIA Logo" 
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-primary">DocIA</h1>
              <p className="text-sm text-muted-foreground">Sistema Médico</p>
            </div>
          </div>
        </div>

        {/* Mobile Header in Sidebar */}
        <div className="p-6 border-b border-border lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/img/docia_logo.png" 
                alt="DocIA Logo" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="text-lg font-bold text-primary">DocIA</h1>
                <p className="text-sm text-muted-foreground">Sistema Médico</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeMobileMenu}
              className="p-2 lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border-t border-border space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="w-full justify-start gap-3"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
