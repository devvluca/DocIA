import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Stethoscope, ArrowRight, User } from 'lucide-react';

interface WelcomeSetupProps {
  onComplete: (userData: { title: string; name: string }) => void;
  isTestUser?: boolean;
  isPaidUser?: boolean;
  existingName?: string;
}

const WelcomeSetup: React.FC<WelcomeSetupProps> = ({ 
  onComplete, 
  isTestUser = false, 
  isPaidUser = false,
  existingName = ''
}) => {
  const [step, setStep] = useState(isPaidUser ? 'loading' : 1);
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Para usuários pagos, mostrar apenas loading e boas-vindas simples
  useEffect(() => {
    if (isPaidUser && existingName) {
      // Simular carregamento
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              onComplete({ 
                title: existingName.includes('Dr.') ? 'Dr.' : 'Dra.',
                name: existingName.replace(/^(Dr\.|Dra\.)/, '').trim()
              });
            }, 500);
            return 100;
          }
          return prev + 2;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isPaidUser, existingName, onComplete]);

  const handleNext = () => {
    if (step === 1 && title) {
      setStep(2);
    } else if (step === 2 && name) {
      setShowAnimation(true);
      setTimeout(() => {
        onComplete({ title, name });
      }, 3000);
    }
  };

  const handleTitleSelect = (selectedTitle: string) => {
    setTitle(selectedTitle);
    setTimeout(() => {
      setStep(2);
    }, 500);
  };

  // Loading para usuários pagos
  if (isPaidUser && step === 'loading') {
    const firstName = existingName.replace(/^(Dr\.|Dra\.)/, '').trim().split(' ')[0];
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
        <div className="text-center space-y-6 animate-fade-in max-w-md w-full px-4">
          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
              <Stethoscope className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-300 animate-slide-up">
              Bem-vindo, Dr. {firstName}!
            </h1>
            <p className="text-lg text-blue-600 dark:text-blue-400 animate-slide-up delay-200">
              Preparando seu ambiente personalizado...
            </p>
            
            {/* Barra de carregamento */}
            <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 animate-slide-up delay-300">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-100 ease-out"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-blue-500 animate-slide-up delay-400">
              {loadingProgress}% concluído
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (showAnimation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="relative">
            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center animate-pulse">
              <Stethoscope className="w-16 h-16 text-white" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-300 animate-slide-up">
              Bem-vindo, {title} {name}!
            </h1>
            <p className="text-xl text-blue-600 dark:text-blue-400 animate-slide-up delay-200">
              Seu DocIA está sendo preparado...
            </p>
            
            <div className="flex justify-center items-center space-x-2 animate-slide-up delay-300">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>

          {isTestUser && (
            <Badge variant="secondary" className="animate-slide-up delay-400">
              Conta de Demonstração
            </Badge>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-4">
      <Card className="max-w-md w-full animate-slide-up">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">
            {step === 1 ? 'Como devemos te chamar?' : 'Qual é o seu nome?'}
          </CardTitle>
          {isTestUser && (
            <Badge variant="outline" className="mx-auto">
              Configuração de Teste
            </Badge>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <Label className="text-sm text-muted-foreground text-center block">
                Selecione seu título profissional:
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={title === 'Dr.' ? 'default' : 'outline'}
                  className="h-12 flex items-center justify-center gap-2"
                  onClick={() => handleTitleSelect('Dr.')}
                >
                  <Stethoscope className="w-4 h-4" />
                  Dr.
                </Button>
                <Button
                  variant={title === 'Dra.' ? 'default' : 'outline'}
                  className="h-12 flex items-center justify-center gap-2"
                  onClick={() => handleTitleSelect('Dra.')}
                >
                  <Stethoscope className="w-4 h-4" />
                  Dra.
                </Button>
              </div>
              
              {title && (
                <div className="text-center animate-fade-in">
                  <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Perfeito! Agora vamos ao próximo passo...
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-slide-left">
              <div className="text-center mb-4">
                <Badge variant="secondary" className="mb-2">
                  {title}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Agora me conte seu nome:
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  placeholder="Digite seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12"
                  autoFocus
                />
              </div>

              <Button
                onClick={handleNext}
                disabled={!name.trim()}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                Finalizar Configuração
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
          
          {step === 1 && (
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Esta informação será usada para personalizar sua experiência
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeSetup;
