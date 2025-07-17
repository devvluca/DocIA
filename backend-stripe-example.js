// Exemplo de endpoint backend para criar sessões do Stripe
// Este código deve ir no seu backend (Node.js/Express, Python/FastAPI, etc.)

// Para Node.js/CommonJS:
// const Stripe = require('stripe');
// Para ES6/TypeScript:
import Stripe from 'stripe';

// Inicializar Stripe com sua chave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_sua_chave_secreta_aqui', {
  apiVersion: '2023-10-16',
});

// Configuração dos produtos/preços
const STRIPE_PRICES = {
  basic: {
    monthly: 'price_basic_monthly_id',
    yearly: 'price_basic_yearly_id'
  },
  starter: {
    monthly: 'price_starter_monthly_id',
    yearly: 'price_starter_yearly_id'
  },
  professional: {
    monthly: 'price_professional_monthly_id',
    yearly: 'price_professional_yearly_id'
  }
};

export async function createCheckoutSession(req, res) {
  try {
    const { planId, billingCycle, customerEmail } = req.body;

    // Validar parâmetros
    if (!planId || !billingCycle) {
      return res.status(400).json({ error: 'Parâmetros obrigatórios: planId, billingCycle' });
    }

    const priceId = STRIPE_PRICES[planId]?.[billingCycle];
    if (!priceId) {
      return res.status(400).json({ error: 'Plano ou ciclo de cobrança inválido' });
    }

    // Criar sessão do Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'pix'], // Aceitar cartão e PIX
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: customerEmail || undefined,
      success_url: `${req.headers.origin}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/pricing?canceled=true`,
      metadata: {
        planId,
        billingCycle,
      },
      // Configurar período de teste se aplicável
      subscription_data: {
        trial_period_days: planId === 'trial' ? 7 : undefined,
      },
      // Permitir códigos promocionais
      allow_promotion_codes: true,
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Erro ao criar sessão:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// Webhook para lidar com eventos do Stripe
export async function handleStripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send('Webhook Error: Invalid signature');
  }

  // Lidar com eventos específicos
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Pagamento concluído:', session.id);
      
      // Aqui você pode:
      // 1. Ativar a assinatura do usuário no seu banco de dados
      // 2. Enviar email de boas-vindas
      // 3. Configurar acesso às funcionalidades pagas
      
      break;

    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      console.log('Pagamento recorrente bem-sucedido:', invoice.id);
      break;

    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      console.log('Assinatura cancelada:', subscription.id);
      
      // Desativar acesso às funcionalidades pagas
      break;

    default:
      console.log(`Evento não tratado: ${event.type}`);
  }

  res.json({ received: true });
}

/* 
Como usar este backend:

1. Instalar dependências:
   npm install stripe express

2. Configurar variáveis de ambiente:
   STRIPE_SECRET_KEY=sk_test_sua_chave_secreta
   STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret

3. Criar produtos e preços no dashboard do Stripe

4. Configurar webhook no Stripe para:
   - checkout.session.completed
   - invoice.payment_succeeded  
   - customer.subscription.deleted

5. Endpoints da API:
   POST /api/create-checkout-session
   POST /api/stripe-webhook
*/
