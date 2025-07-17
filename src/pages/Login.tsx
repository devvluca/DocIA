import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Eye, EyeOff, Stethoscope, UserPlus, Mail, Lock, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular autenticação
    setTimeout(() => {
      if (formData.email === 'medico@docia.com' && formData.password === '123456') {
        toast.success('Login realizado com sucesso!', {
          duration: 3000,
        });
        
        // Login como usuário de teste (vai precisar configurar o perfil)
        login({ 
          email: formData.email, 
          isTestUser: true,
          isPaidUser: false
        });
        navigate('/');
      } else if (formData.email === 'dr.luca@docia.com' && formData.password === '123456') {
        toast.success('Bem-vindo de volta, Dr. Luca!', {
          duration: 3000,
        });
        
        // Login como usuário pago existente (vai direto mostrar carregamento)
        login({ 
          email: formData.email, 
          isTestUser: false,
          isPaidUser: true,
          title: 'Dr.',
          name: 'Dr. Luca Silva',
          planType: 'starter'
        });
        navigate('/');
      } else {
        toast.error('Credenciais inválidas. Tente: medico@docia.com / 123456 ou dr.luca@docia.com / 123456', {
          duration: 4000,
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleCRMLogin = () => {
    toast.info('Integração com CRM em desenvolvimento...');
  };

  const handleGoogleLogin = () => {
    toast.info('Login com Google em desenvolvimento...');
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo - Gradiente */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">          {/* Formas geométricas animadas */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-32 w-24 h-24 bg-white/30 rounded-lg rotate-45 animate-bounce"></div>
            <div className="absolute bottom-40 left-32 w-20 h-20 bg-white/20 rounded-full animate-ping"></div>
            <div className="absolute bottom-20 right-20 w-28 h-28 bg-white/10 rounded-lg animate-pulse"></div>
          </div>
            {/* Círculos concêntricos */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-96 h-96 border border-white/10 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
            <div className="absolute top-8 left-8 w-80 h-80 border border-white/15 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
            <div className="absolute top-16 left-16 w-64 h-64 border border-white/20 rounded-full animate-spin" style={{ animationDuration: '10s' }}></div>
          </div>
        </div>
        
        {/* Logo central */}
        <div className="relative z-10 flex items-center justify-center w-full">
          <div className="text-center text-white">            <div className="mb-8 flex justify-center">
              <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <img 
                  src="/img/docia_logo.png" 
                  alt="DocIA Logo" 
                  className="w-20 h-20 object-contain"
                />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4">DocIA</h1>
            <p className="text-xl text-white/80 max-w-md">
              Sistema Inteligente de Gestão Médica
            </p>
            <p className="text-sm text-white/60 mt-2">
              Transformando o cuidado médico com tecnologia avançada
            </p>
          </div>
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center lg:hidden mb-6">
              <img 
                src="/img/docia_logo.png" 
                alt="DocIA Logo" 
                className="w-16 h-16 object-contain"
              />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Acesse sua conta</h2>
            <p className="text-muted-foreground">
              Entre com suas credenciais para continuar
            </p>
          </div>

          {/* Botões de login social */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 flex items-center justify-center gap-3 hover:bg-accent/50 transition-all duration-200"
              onClick={handleCRMLogin}
            >
              <Stethoscope className="w-5 h-5" />
              <span className="font-medium">Entrar com CRM</span>
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 flex items-center justify-center gap-3 hover:bg-accent/50 transition-all duration-200"
              onClick={handleGoogleLogin}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-medium">Entrar com Google</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground font-medium">
                ou continue com e-mail
              </span>
            </div>
          </div>

          {/* Formulário */}
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    E-mail
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Seu e-mail profissional"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10 h-12 border-border/50"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Sua senha"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10 h-12 border-border/50"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <div className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                        rememberMe 
                          ? 'bg-blue-600 border-blue-600' 
                          : 'border-border hover:border-blue-300'
                      }`}>
                        {rememberMe && (
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        )}
                      </div>
                    </div>
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                      Lembrar de mim
                    </span>
                  </label>
                  <button
                    type="button"
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Esqueci minha senha
                  </button>
                </div>                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Entrando...
                    </div>
                  ) : (
                    'Entrar'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <UserPlus className="w-4 h-4" />
              <span>Não tem uma conta?</span>
              <button 
                className="text-primary hover:text-primary/80 font-medium transition-colors"
                onClick={() => navigate('/register')}
              >
                Crie sua conta grátis
              </button>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p>Credenciais de teste:</p>
              <p><strong>Usuário novo:</strong> medico@docia.com / 123456</p>
              <p><strong>Usuário existente:</strong> dr.luca@docia.com / 123456</p>
            </div>
            
            <div className="text-center pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-2">
                💡 <strong>7 dias grátis</strong> para testar todas as funcionalidades
              </p>
              <button 
                className="text-xs text-primary hover:text-primary/80 font-medium transition-colors underline"
                onClick={() => navigate('/pricing')}
              >
                Ver planos e preços →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
