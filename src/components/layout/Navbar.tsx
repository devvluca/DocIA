import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Calendar, 
  Bot, 
  Settings, 
  LogOut, 
  Moon, 
  Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

const Navbar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Pacientes', path: '/patients' },
    { icon: Calendar, label: 'Agenda', path: '/schedule' },
    { icon: Bot, label: 'Agentes IA', path: '/agents' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-card border-r border-border h-screen w-64 fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-border">
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

      <div className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
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
  );
};

export default Navbar;
