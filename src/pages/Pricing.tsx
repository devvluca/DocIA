import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowLeft, Star, Users, Calendar, FileText, Smartphone, Brain, Building, Headphones, Zap, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { redirectToStripeCheckout } from '@/lib/stripe';

const Pricing = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  // Função para lidar com a seleção de planos
  const handlePlanSelection = async (planId: string, planName: string, price: number) => {
    setLoadingPlan(planId);

    try {
      if (planId === 'trial') {
        // Para teste grátis, apenas redireciona para registro
        toast.success('Redirecionando para criar sua conta...', {
          duration: 2000,
        });
        setTimeout(() => {
          navigate('/register');
        }, 1000);
        return;
      }

      // Para planos pagos, integrar com Stripe
      toast.loading('Redirecionando para pagamento...', {
        duration: 1500,
      });

      // Simular delay para UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      try {
        // Tentar usar a integração real do Stripe
        await redirectToStripeCheckout(
          planId as 'basic' | 'starter' | 'professional',
          billingCycle
        );
      } catch (stripeError) {
        // Fallback para URLs diretas ou desenvolvimento
        console.log('Stripe error, usando fallback:', stripeError);
        
        // Verificar se temos URLs configuradas no .env
        const envUrls = {
          basic: {
            monthly: import.meta.env.VITE_STRIPE_BASIC_MONTHLY_URL,
            yearly: import.meta.env.VITE_STRIPE_BASIC_YEARLY_URL
          },
          starter: {
            monthly: import.meta.env.VITE_STRIPE_STARTER_MONTHLY_URL, 
            yearly: import.meta.env.VITE_STRIPE_STARTER_YEARLY_URL
          },
          professional: {
            monthly: import.meta.env.VITE_STRIPE_PROFESSIONAL_MONTHLY_URL,
            yearly: import.meta.env.VITE_STRIPE_PROFESSIONAL_YEARLY_URL
          }
        };

        const planUrls = envUrls[planId as keyof typeof envUrls];
        const checkoutUrl = planUrls?.[billingCycle];

        if (checkoutUrl && checkoutUrl.includes('stripe.com') && !checkoutUrl.includes('simulado')) {
          // URL válida do Stripe - redirecionar
          window.location.href = checkoutUrl;
        } else {
          // Modo desenvolvimento/simulação - mostrar informações
          toast.success('� Modo Simulação', {
            description: `Plano: ${planName} - ${billingCycle === 'monthly' ? 'Mensal' : 'Anual'} - R$ ${price}`,
            duration: 4000,
          });
          
          toast.info('💡 Configure URLs reais do Stripe no .env para integração completa', {
            duration: 3000,
          });
          
          setTimeout(() => {
            navigate('/register?plan=' + planId + '&billing=' + billingCycle);
          }, 2000);
        }
      }
    } catch (error) {
      toast.error('Erro ao processar pagamento. Tente novamente.');
      console.error('Erro no pagamento:', error);
    } finally {
      setLoadingPlan(null);
    }
  };

  const plans = [
    {
      id: 'trial',
      name: 'Teste Grátis',
      description: 'Experimente todas as funcionalidades',
      price: { monthly: 0, yearly: 0 },
      duration: '7 dias',
      color: 'from-green-500 to-emerald-600',
      popular: false,
      features: [
        'Até 50 pacientes',
        'Agenda completa',
        'Prontuários digitais',
        'Relatórios básicos',
        'Suporte por email',
        'Todas as funcionalidades desbloqueadas'
      ],
      limitations: [
        'Limitado a 7 dias',
        'Máximo 50 pacientes',
        'Sem integração WhatsApp'
      ]
    },
    {
      id: 'basic',
      name: 'Básico',
      description: 'Essencial para começar',
      price: { monthly: 80, yearly: 800 },
      duration: 'mês',
      color: 'from-gray-500 to-slate-600',
      popular: false,
      features: [
        'Até 200 pacientes',
        'Agenda básica',
        'Prontuários simples',
        'Relatórios básicos',
        'Backup automático',
        'Suporte por email',
        'App mobile'
      ],
      limitations: [
        '1 usuário apenas',
        'Sem telemedicina',
        'Sem IA',
        'Storage: 2GB'
      ]
    },
    {
      id: 'starter',
      name: 'Completo com IA',
      description: 'O mais escolhido pelos médicos',
      price: { monthly: 200, yearly: 2000 },
      duration: 'mês',
      color: 'from-blue-500 to-blue-600',
      popular: true,
      features: [
        'Pacientes ilimitados',
        'Agenda completa',
        'Prontuários completos',
        'IA para diagnósticos',
        'Telemedicina integrada',
        'Relatórios avançados',
        'Backup automático',
        'Suporte prioritário',
        'App mobile',
        'Lembretes automáticos',
        'Integração WhatsApp'
      ],
      limitations: [
        '1 usuário apenas',
        'Storage: 10GB'
      ]
    },
    {
      id: 'professional',
      name: 'Clínicas',
      description: 'Para equipes e clínicas',
      price: { monthly: 400, yearly: 4200 },
      duration: 'mês',
      color: 'from-purple-500 to-violet-600',
      popular: false,
      features: [
        'Tudo do Completo com IA',
        'Múltiplos usuários (até 5)',
        'Dashboard de gestão',
        'Receituário digital',
        'API disponível',
        'Relatórios gerenciais',
        'Suporte 24/7',
        'Treinamento incluído'
      ],
      limitations: [
        'Máximo 5 usuários',
        'Storage: 50GB'
      ]
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getDiscountPercentage = (monthly: number, yearly: number) => {
    if (monthly === 0) return 0;
    const discount = ((monthly * 12 - yearly) / (monthly * 12)) * 100;
    return Math.round(discount);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/login')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar ao Login
              </Button>
              <div className="flex items-center gap-3">
                <img 
                  src="/img/docia_logo.png" 
                  alt="DocIA Logo" 
                  className="w-8 h-8 object-contain"
                />
                <span className="text-xl font-bold text-foreground">DocIA</span>
              </div>
            </div>
            <Button onClick={() => navigate('/login')}>
              Entrar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Escolha o plano ideal para você
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Comece com 7 dias grátis e depois escolha entre nossos planos. O <strong>Completo com IA</strong> é o mais escolhido pelos médicos!
          </p>
          
          {/* Billing Toggle */}
          <div className="flex flex-col items-center gap-4 mb-12">
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm ${billingCycle === 'monthly' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                Mensal
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative w-14 h-7 bg-muted rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
              <span className={`text-sm ${billingCycle === 'yearly' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                Anual
              </span>
            </div>
            {billingCycle === 'yearly' && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                Economize até 17%
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 pb-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col h-full ${
                  plan.popular ? 'ring-2 ring-primary border-primary' : 'border-border/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                    <Star className="w-4 h-4 inline mr-1" />
                    Mais Popular
                  </div>
                )}
                
                <CardHeader className={`${plan.popular ? 'pt-12' : ''} flex-shrink-0`}>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${plan.color} flex items-center justify-center mb-4`}>
                    {plan.id === 'trial' && <Zap className="w-6 h-6 text-white" />}
                    {plan.id === 'basic' && <Users className="w-6 h-6 text-white" />}
                    {plan.id === 'starter' && <Brain className="w-6 h-6 text-white" />}
                    {plan.id === 'professional' && <Building className="w-6 h-6 text-white" />}
                  </div>
                  
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  
                  <div className="pt-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">
                        {formatPrice(plan.price[billingCycle])}
                      </span>
                      {plan.price[billingCycle] > 0 && (
                        <span className="text-muted-foreground">
                          /{billingCycle === 'monthly' ? 'mês' : 'ano'}
                        </span>
                      )}
                    </div>
                    {plan.id === 'trial' && (
                      <p className="text-sm text-green-600 font-medium mt-1">
                        {plan.duration} - Depois R$ 200/mês
                      </p>
                    )}
                    {billingCycle === 'yearly' && plan.price.monthly > 0 && (
                      <p className="text-sm text-green-600">
                        Economize {getDiscountPercentage(plan.price.monthly, plan.price.yearly)}%
                      </p>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6 flex-grow flex flex-col">
                  <div className="flex-grow">
                    <div>
                      <h4 className="font-medium mb-3 text-green-700">✓ Incluído:</h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {plan.limitations.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-3 text-amber-700">⚠️ Limitações:</h4>
                        <ul className="space-y-2">
                          {plan.limitations.map((limitation, index) => (
                            <li key={index} className="text-sm text-muted-foreground">
                              • {limitation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    className={`w-full h-12 bg-gradient-to-r ${plan.color} text-white hover:opacity-90 transition-all duration-200 mt-auto flex items-center justify-center gap-2`}
                    onClick={() => handlePlanSelection(plan.id, plan.name, plan.price[billingCycle])}
                    disabled={loadingPlan === plan.id}
                  >
                    {loadingPlan === plan.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        {plan.id === 'trial' ? (
                          <>
                            <Zap className="w-4 h-4" />
                            Começar Teste Grátis
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4" />
                            Escolher Plano
                          </>
                        )}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Posso cancelar a qualquer momento?</h3>
                <p className="text-sm text-muted-foreground">
                  Sim! Você pode cancelar seu plano a qualquer momento sem multas ou taxas de cancelamento.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Como funciona o teste grátis?</h3>
                <p className="text-sm text-muted-foreground">
                  7 dias completos com acesso a todas as funcionalidades. Não precisamos do seu cartão para começar.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Posso mudar de plano depois?</h3>
                <p className="text-sm text-muted-foreground">
                  Claro! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Os dados ficam seguros?</h3>
                <p className="text-sm text-muted-foreground">
                  Sim! Utilizamos criptografia de ponta e seguimos todas as normas da LGPD e CFM.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Qual a diferença entre os planos?</h3>
                <p className="text-sm text-muted-foreground">
                  O Básico tem funcionalidades essenciais, o Completo com IA inclui inteligência artificial e telemedicina, e o Clínicas é para equipes.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Tem desconto anual?</h3>
                <p className="text-sm text-muted-foreground">
                  Sim! Pagando anualmente você economiza até 17% comparado ao plano mensal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para revolucionar seu consultório?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Comece hoje mesmo com 7 dias grátis. Depois, continue com nosso plano <strong>Completo com IA</strong> por R$ 200/mês.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 flex items-center gap-2"
              onClick={() => handlePlanSelection('trial', 'Teste Grátis', 0)}
              disabled={loadingPlan === 'trial'}
            >
              {loadingPlan === 'trial' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Começar Teste Grátis
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="h-12 px-8"
              onClick={() => navigate('/login')}
            >
              Já tenho uma conta
            </Button>
          </div>
          
          <div className="mt-8 text-sm text-muted-foreground">
            <p>✓ Sem cartão de crédito ✓ Cancelamento gratuito ✓ Suporte incluído</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 DocIA. Todos os direitos reservados.</p>
          <div className="mt-2 space-x-4">
            <button className="hover:text-foreground transition-colors">Termos de Uso</button>
            <button className="hover:text-foreground transition-colors">Política de Privacidade</button>
            <button className="hover:text-foreground transition-colors">Contato</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
