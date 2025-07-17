import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Home, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const success = searchParams.get('success');

  useEffect(() => {
    if (success === 'true') {
      toast.success('Pagamento realizado com sucesso!', {
        description: 'Bem-vindo ao DocIA! Sua assinatura está ativa.',
        duration: 5000,
      });
    }
  }, [success]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-green-700">
            Pagamento Confirmado!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Parabéns! Sua assinatura do DocIA foi ativada com sucesso.
            </p>
            {sessionId && (
              <p className="text-xs text-muted-foreground">
                ID da sessão: {sessionId}
              </p>
            )}
          </div>

          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <h3 className="font-semibold text-sm">O que acontece agora?</h3>
            <ul className="text-xs text-muted-foreground space-y-1 text-left">
              <li>• Sua conta foi automaticamente ativada</li>
              <li>• Você receberá um email de confirmação</li>
              <li>• Acesso completo a todas as funcionalidades</li>
              <li>• Suporte prioritário disponível</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button 
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              onClick={() => navigate('/dashboard')}
            >
              <Home className="w-4 h-4 mr-2" />
              Ir para o Dashboard
            </Button>
            
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => navigate('/settings')}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Gerenciar Assinatura
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Precisa de ajuda? Entre em contato conosco pelo 
              <br />
              <strong>suporte@docia.com</strong> ou WhatsApp
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
