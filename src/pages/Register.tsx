import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Eye, 
  EyeOff, 
  Stethoscope, 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  IdCard,
  ArrowLeft,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    crm: '',
    password: '',
    confirmPassword: ''
  });

  const specialties = [
    'Clínico Geral',
    'Cardiologia',
    'Neurologia',
    'Pediatria',
    'Ginecologia e Obstetrícia',
    'Ortopedia',
    'Dermatologia',
    'Psiquiatria',
    'Endocrinologia',
    'Gastroenterologia',
    'Pneumologia',
    'Urologia',
    'Oftalmologia',
    'Otorrinolaringologia',
    'Radiologia',
    'Anestesiologia',
    'Cirurgia Geral',
    'Medicina Interna',
    'Medicina de Família',
    'Oncologia',
    'Reumatologia'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem', {
        duration: 3000,
      });
      return;
    }

    if (formData.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres', {
        duration: 3000,
      });
      return;
    }

    if (!acceptTerms) {
      toast.error('Você deve aceitar os termos de uso', {
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);

    // Simular cadastro
    setTimeout(() => {
      toast.success('Cadastro realizado com sucesso! Agora você pode fazer login.', {
        duration: 3000,
      });
      navigate('/login');
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo - Gradiente */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
          {/* Formas geométricas animadas */}
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
          <div className="text-center text-white">
            <div className="mb-8 flex justify-center">
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
              Junte-se à revolução médica digital
            </p>
            <p className="text-sm text-white/60 mt-2">
              Crie sua conta e transforme sua prática médica
            </p>
          </div>
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Botão Voltar */}
          <Button
            variant="ghost"
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground p-0"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para login
          </Button>

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center lg:hidden mb-6">
              <img 
                src="/img/docia_logo.png" 
                alt="DocIA Logo" 
                className="w-16 h-16 object-contain"
              />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Criar conta</h2>
            <p className="text-muted-foreground">
              Preencha os dados para criar sua conta médica
            </p>
          </div>

          {/* Formulário */}
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Nome Completo */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-foreground">
                    Nome Completo
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Dr. Seu Nome Completo"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="pl-10 h-12 border-border/50"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    E-mail Profissional
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu.email@hospital.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10 h-12 border-border/50"
                      required
                    />
                  </div>
                </div>

                {/* Telefone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                    Telefone
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="pl-10 h-12 border-border/50"
                      required
                    />
                  </div>
                </div>

                {/* Especialidade e CRM na mesma linha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialty" className="text-sm font-medium text-foreground">
                      Especialidade
                    </Label>
                    <div className="relative">
                      <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                      <Select value={formData.specialty} onValueChange={(value) => handleInputChange('specialty', value)}>
                        <SelectTrigger className="pl-10 h-12 border-border/50">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {specialties.map((specialty) => (
                            <SelectItem key={specialty} value={specialty}>
                              {specialty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="crm" className="text-sm font-medium text-foreground">
                      CRM
                    </Label>
                    <div className="relative">
                      <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="crm"
                        type="text"
                        placeholder="12345-SP"
                        value={formData.crm}
                        onChange={(e) => handleInputChange('crm', e.target.value)}
                        className="pl-10 h-12 border-border/50"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Senha */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 6 caracteres"
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

                {/* Confirmar Senha */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                    Confirmar Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirme sua senha"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10 pr-10 h-12 border-border/50"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Aceitar termos */}
                <div className="flex items-start space-x-3 pt-2">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                    />
                    <div className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      acceptTerms 
                        ? 'bg-blue-600 border-blue-600' 
                        : 'border-border hover:border-blue-300'
                    }`}>
                      {acceptTerms && (
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Aceito os{' '}
                    <button type="button" className="text-primary hover:text-primary/80 underline">
                      termos de uso
                    </button>
                    {' '}e{' '}
                    <button type="button" className="text-primary hover:text-primary/80 underline">
                      política de privacidade
                    </button>
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Criando conta...
                    </div>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Criar conta
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>Já tem uma conta?</span>
              <button 
                className="text-primary hover:text-primary/80 font-medium transition-colors"
                onClick={() => navigate('/login')}
              >
                Faça login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
