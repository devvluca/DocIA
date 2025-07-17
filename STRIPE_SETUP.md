# 🛒 Integração Stripe - DocIA

Este guia explica como configurar a integração de pagamentos com o Stripe no DocIA.

## 📋 Pré-requisitos

1. Conta no Stripe (gratuita): https://stripe.com
2. Chaves de API do Stripe
3. Produtos criados no dashboard do Stripe

## 🚀 Configuração Rápida

### 1. Criar Conta e Obter Chaves

1. Acesse [dashboard.stripe.com](https://dashboard.stripe.com)
2. Crie sua conta
3. Vá em **Desenvolvedores > Chaves de API**
4. Copie a **Chave Publicável** (pk_test_...)

### 2. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Configure suas chaves:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_publica_aqui
```

### 3. Criar Produtos no Stripe

No dashboard do Stripe:

1. Vá em **Produtos > Criar produto**
2. Crie 3 produtos com os seguintes preços:

#### 📦 Plano Básico
- **Nome**: DocIA - Plano Básico
- **Preço Mensal**: R$ 80,00
- **Preço Anual**: R$ 800,00 (17% desconto)

#### 🧠 Plano Completo com IA
- **Nome**: DocIA - Completo com IA  
- **Preço Mensal**: R$ 200,00
- **Preço Anual**: R$ 2.000,00 (17% desconto)

#### 🏢 Plano Clínicas
- **Nome**: DocIA - Clínicas
- **Preço Mensal**: R$ 400,00
- **Preço Anual**: R$ 4.000,00 (17% desconto)

### 4. Obter Links de Pagamento

Para cada produto:

1. Clique no produto criado
2. Clique em **Criar link de pagamento**
3. Configure as URLs de sucesso e cancelamento:
   - **Sucesso**: `https://seudominio.com/payment-success?success=true&session_id={CHECKOUT_SESSION_ID}`
   - **Cancelamento**: `https://seudominio.com/pricing?canceled=true`
4. Copie o link gerado
5. Adicione no `.env`:

```env
# Plano Básico
VITE_STRIPE_BASIC_MONTHLY_URL=https://buy.stripe.com/test_SEU_LINK_BASICO_MENSAL
VITE_STRIPE_BASIC_YEARLY_URL=https://buy.stripe.com/test_SEU_LINK_BASICO_ANUAL

# Plano Completo com IA
VITE_STRIPE_STARTER_MONTHLY_URL=https://buy.stripe.com/test_SEU_LINK_COMPLETO_MENSAL
VITE_STRIPE_STARTER_YEARLY_URL=https://buy.stripe.com/test_SEU_LINK_COMPLETO_ANUAL

# Plano Clínicas  
VITE_STRIPE_PROFESSIONAL_MONTHLY_URL=https://buy.stripe.com/test_SEU_LINK_CLINICAS_MENSAL
VITE_STRIPE_PROFESSIONAL_YEARLY_URL=https://buy.stripe.com/test_SEU_LINK_CLINICAS_ANUAL
```

## 🔧 Como Funciona

### Frontend (Atual)
- Usuário clica em "Escolher Plano"
- Sistema redireciona para link de pagamento do Stripe
- Após pagamento, usuário volta para `/payment-success`

### Backend (Opcional - Mais Avançado)
- Use o arquivo `backend-stripe-example.js` como base
- Crie endpoint para gerar sessões dinâmicas
- Configure webhooks para automação

## 🎯 Funcionalidades Implementadas

✅ **Seleção de Planos**: Interface completa com 4 planos  
✅ **Ciclo Mensal/Anual**: Toggle com descontos automáticos  
✅ **Integração Stripe**: Redirecionamento para checkout  
✅ **Página de Sucesso**: Confirmação pós-pagamento  
✅ **Estados de Loading**: UX durante processamento  
✅ **Fallback**: Modo desenvolvimento sem Stripe  
✅ **Toast Notifications**: Feedback visual para usuário  

## 🔒 Segurança

- ✅ Chaves públicas no frontend (seguro)
- ✅ Links diretos do Stripe (sem exposição de secrets)
- ✅ Redirecionamento externo para checkout
- ✅ Validação no lado do Stripe

## 📊 Monitoramento

No dashboard do Stripe você pode:
- Visualizar todas as transações
- Gerar relatórios financeiros
- Configurar webhooks
- Gerenciar assinaturas
- Fazer reembolsos

## 🆘 Resolução de Problemas

### Erro: "URL do Stripe não encontrada"
- Verifique se as variáveis de ambiente estão configuradas
- Confirme se os links do Stripe estão corretos

### Pagamento não redireciona
- Verifique as URLs de sucesso/cancelamento
- Confirme se o domínio está correto

### Modo desenvolvimento
- Se as URLs não estiverem configuradas, o sistema mostra um toast informativo
- Usuário ainda pode testar o fluxo de registro

## 📚 Próximos Passos

1. **Webhooks**: Automatizar ativação de contas
2. **Dashboard**: Gerenciar assinaturas pelo painel
3. **PIX**: Adicionar pagamento via PIX
4. **Promoções**: Códigos de desconto
5. **Métricas**: Analytics de conversão

---

💡 **Dica**: Use o modo de teste do Stripe durante desenvolvimento. Cartões de teste: `4242 4242 4242 4242`
