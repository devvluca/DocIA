# Integração com Dify API - Dr. Synapse

## Configuração

A integração com a API do Dify foi implementada no ChatIA.tsx com as seguintes configurações:

### Variáveis de Ambiente (.env)
```
VITE_DIFY_API_KEY=app-fL0zQeEZlNYnVBTWSNObuViN
VITE_DIFY_BASE_URL=https://api-dify.talka.tech/v1
```

## Persona do Dr. Synapse

O agente foi configurado com o seguinte prompt no Dify:

### PERSONA
- Nome: Dr. Synapse
- Papel: IA de suporte clínico especializada
- Comunicação: Formal, empática e analítica
- Objetivo: Sintetizar dados do paciente e oferecer insights baseados em evidências científicas

### Variáveis do Contexto
O sistema envia automaticamente as seguintes variáveis para o Dify (limitadas a 45 caracteres cada):

- `nome_medico`: Nome do médico (atualmente "Dr(a). Usuário")
- `especialidade_medico`: Especialidade baseada na condição do paciente
- `nome_paciente`: Nome do paciente
- `idade_paciente`: Idade do paciente
- `genero_paciente`: Gênero (Masculino/Feminino)
- `condicao_paciente`: Condição médica principal
- `anamnese_paciente`: Histórico clínico detalhado (truncado se necessário)
- `tags_paciente`: Tags e observações relevantes

**Nota**: Todas as variáveis de texto são automaticamente truncadas para 45 caracteres + "..." se necessário, devido às limitações da API do Dify.

## Funcionalidades Implementadas

### 1. Chat em Tempo Real
- Integração completa com a API do Dify
- Conversas contextualizadas por paciente
- Histórico de conversa persistente

### 2. Status da API
- Verificação automática do status da conexão
- Indicadores visuais (online/offline/verificando)
- Tratamento de erros específicos

### 3. Sugestões Rápidas
Botões pré-configurados para perguntas comuns:
- Hipóteses Diagnósticas
- Sugerir Exames
- Otimizar Tratamento
- Sinais de Alerta

### 4. Interface Adaptada
- Header atualizado para "Dr. Synapse"
- Card de contexto clínico expansível/recolhível
- Mensagem de boas-vindas personalizada
- **Renderização Markdown**: Suporte completo para formatação Markdown nas respostas da IA
  - Listas numeradas e com marcadores
  - Texto em negrito e itálico
  - Código inline e blocos de código
  - Citações (blockquotes)
  - Cabeçalhos (H1, H2, H3)
  - Tabelas
  - Links e outros elementos Markdown

## Tratamento de Erros

O sistema trata diferentes tipos de erro:
- Erro 401: Problema de autenticação
- Erro 403: Acesso negado
- Erro 500+: Problemas do servidor
- Erros de rede: Problemas de conectividade

## Logging e Debug

Para debug, o sistema registra no console:
- Dados enviados para a API
- Respostas recebidas
- Erros de conexão

## Como Testar

1. Certifique-se de que o arquivo .env está configurado
2. Acesse o perfil de qualquer paciente
3. Clique em "Consultar IA"
4. Verifique o status da API no header
5. Envie uma mensagem de teste

## Próximos Passos

- [ ] Implementar upload de arquivos para o chat
- [ ] Adicionar histórico de conversas persistente
- [ ] Personalizar nome do médico por usuário
- [ ] Implementar análise de exames em tempo real
