import { loadStripe } from '@stripe/stripe-js';

// Chave pública do Stripe (substitua pela sua chave real)
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_sua_chave_aqui';

// Inicializar Stripe
export const stripePromise = loadStripe(stripePublishableKey);

// URLs de produto do Stripe (usar variáveis de ambiente quando disponíveis)
export const STRIPE_CHECKOUT_URLS = {
  basic: {
    monthly: import.meta.env.VITE_STRIPE_BASIC_MONTHLY_URL || 'https://buy.stripe.com/test_BASIC_MONTHLY_URL',
    yearly: import.meta.env.VITE_STRIPE_BASIC_YEARLY_URL || 'https://buy.stripe.com/test_BASIC_YEARLY_URL'
  },
  starter: {
    monthly: import.meta.env.VITE_STRIPE_STARTER_MONTHLY_URL || 'https://buy.stripe.com/test_STARTER_MONTHLY_URL', 
    yearly: import.meta.env.VITE_STRIPE_STARTER_YEARLY_URL || 'https://buy.stripe.com/test_STARTER_YEARLY_URL'
  },
  professional: {
    monthly: import.meta.env.VITE_STRIPE_PROFESSIONAL_MONTHLY_URL || 'https://buy.stripe.com/test_PROFESSIONAL_MONTHLY_URL',
    yearly: import.meta.env.VITE_STRIPE_PROFESSIONAL_YEARLY_URL || 'https://buy.stripe.com/test_PROFESSIONAL_YEARLY_URL'
  }
};

// Função para redirecionar ao checkout do Stripe
export const redirectToStripeCheckout = async (
  planId: keyof typeof STRIPE_CHECKOUT_URLS,
  billingCycle: 'monthly' | 'yearly',
  customerEmail?: string
) => {
  const url = STRIPE_CHECKOUT_URLS[planId]?.[billingCycle];
  
  if (!url) {
    throw new Error(`URL do Stripe não encontrada para o plano ${planId} ${billingCycle}`);
  }

  // Adicionar parâmetros opcionais à URL
  const checkoutUrl = new URL(url);
  if (customerEmail) {
    checkoutUrl.searchParams.set('prefilled_email', customerEmail);
  }
  
  // Adicionar URLs de sucesso e cancelamento
  checkoutUrl.searchParams.set('success_url', `${window.location.origin}/dashboard?success=true`);
  checkoutUrl.searchParams.set('cancel_url', `${window.location.origin}/pricing?canceled=true`);

  // Redirecionar para o Stripe Checkout
  window.location.href = checkoutUrl.toString();
};

// Função para criar sessão de checkout personalizada (requer backend)
export const createCheckoutSession = async (
  planId: string,
  billingCycle: 'monthly' | 'yearly',
  customerEmail?: string
) => {
  try {
    // Esta função requer um endpoint backend para criar a sessão
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planId,
        billingCycle,
        customerEmail,
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar sessão de checkout');
    }

    const { sessionId } = await response.json();
    
    // Redirecionar para o checkout
    const stripe = await stripePromise;
    if (stripe) {
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        throw error;
      }
    }
  } catch (error) {
    console.error('Erro no checkout:', error);
    throw error;
  }
};
