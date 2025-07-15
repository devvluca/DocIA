
import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  ArrowLeft, 
  Send, 
  Paperclip, 
  Bot, 
  User,
  FileText,
  ChevronDown,
  ChevronUp,
  File,
  Download,
  Calendar,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavbar } from '@/contexts/NavbarContext';
import { mockPatients } from '@/data/mockData';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  attachedDocument?: {
    id: string;
    name: string;
    type: string;
    content?: string;
  };
}

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'template';
  size: string;
  uploadDate: string;
  category: string;
  patient?: string;
  content?: string;
  url?: string;
}

const ChatIA = () => {
  const { isCollapsed } = useNavbar();
  const { id } = useParams();
  const patient = mockPatients.find(p => p.id === id);

  // Função para carregar perfil do médico
  const loadUserProfile = () => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      name: 'Dr. João Silva',
      email: 'joao.silva@email.com',
      specialty: 'Cardiologia',
      crm: '12345-SP',
      phone: '(11) 99999-9999',
      bio: 'Cardiologista com 15 anos de experiência em diagnósticos cardiovasculares.',
      avatar: null,
      avatarColor: 'bg-blue-500',
      gender: 'M' // M para masculino, F para feminino
    };
  };

  const userProfile = loadUserProfile();
  const doctorGender = userProfile.gender || 'M'; // Padrão masculino se não definido
  const doctorTitle = doctorGender === 'F' ? 'Dra.' : 'Dr.';
  const doctorName = userProfile.name.replace(/dr\.?\s*/gi, '').replace(/dra\.?\s*/gi, '').trim();

  // Estados
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isContextExpanded, setIsContextExpanded] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [availableDocuments, setAvailableDocuments] = useState<Document[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carregar mensagens salvas para este paciente do localStorage
  const loadSavedMessages = (): Message[] => {
    const saved = localStorage.getItem(`chatMessages_${patient?.id}`);
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        id: '1',
        content: `Olá, ${doctorTitle} ${doctorName}! Sou o Dr. Synapse, sua IA de suporte clínico especializada em ${patient?.condition || 'medicina'}. \n\nEstou aqui para auxiliá-${doctorGender === 'F' ? 'la' : 'lo'} com o caso de ${patient?.name || 'paciente'}, analisando o histórico clínico e oferecendo insights baseados nas melhores evidências científicas disponíveis.\n\nComo posso ajudá-${doctorGender === 'F' ? 'la' : 'lo'} hoje?`,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
      }
    ];
  };

  const [messages, setMessages] = useState<Message[]>(loadSavedMessages);

  // Carregar documentos disponíveis
  useEffect(() => {
    const mockDocuments: Document[] = [
      {
        id: '1',
        name: 'Exame_Cardiológico.pdf',
        type: 'pdf',
        size: '2.3 MB',
        uploadDate: '2024-01-15',
        category: 'Exames',
        patient: patient?.name || 'Paciente',
        content: 'Resultado do exame cardiológico. ECG normal, pressão arterial dentro dos parâmetros normais. Função sistólica preservada.',
        url: '/mock/exame_cardio.pdf'
      },
      {
        id: '2',
        name: 'Hemograma_Completo.pdf',
        type: 'pdf',
        size: '150 KB',
        uploadDate: '2024-01-14',
        category: 'Exames',
        patient: patient?.name || 'Paciente',
        content: 'Hemograma completo: Hemoglobina 14.2 g/dL, Hematócrito 42%, Leucócitos 7.200/mm³, todos os valores dentro da normalidade.',
        url: '/mock/hemograma.pdf'
      },
      {
        id: '3',
        name: 'Ultrassom_Abdomen.pdf',
        type: 'pdf',
        size: '1.8 MB',
        uploadDate: '2024-01-13',
        category: 'Exames',
        patient: patient?.name || 'Paciente',
        content: 'Ultrassonografia de abdome total: Fígado com dimensões e ecogenicidade normais. Vesícula biliar sem alterações. Rins com dimensões preservadas.',
        url: '/mock/ultrassom.pdf'
      }
    ];

    // Carregar também documentos do localStorage
    const globalDocuments = JSON.parse(localStorage.getItem('globalDocuments') || '[]');
    const patientDocuments = globalDocuments.filter((doc: Document) => 
      doc.patient === patient?.name || doc.category === 'Exames'
    );
    
    setAvailableDocuments([...mockDocuments, ...patientDocuments]);
  }, [patient]);

  // Salvar mensagens no localStorage sempre que mudar
  useEffect(() => {
    if (patient?.id && messages.length > 0) {
      localStorage.setItem(`chatMessages_${patient.id}`, JSON.stringify(messages));
    }
  }, [messages, patient?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
      attachedDocument: selectedDocument ? {
        id: selectedDocument.id,
        name: selectedDocument.name,
        type: selectedDocument.type,
        content: selectedDocument.content
      } : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setSelectedDocument(null);
    setUploadedFile(null);
    setIsLoading(true);

    try {
      // Preparar contexto completo incluindo histórico de mensagens e documento anexado
      let fullContext = inputMessage;
      
      if (selectedDocument?.content) {
        fullContext += `\n\n[DOCUMENTO ANEXADO - ${selectedDocument.name}]:\n${selectedDocument.content}`;
      }

      // Adicionar contexto de mensagens anteriores (últimas 5)
      const recentMessages = messages.slice(-5).map(msg => 
        `${msg.sender === 'user' ? 'Médico' : 'Dr. Synapse'}: ${msg.content}`
      ).join('\n');
      
      if (recentMessages) {
        fullContext = `[CONTEXTO ANTERIOR]:\n${recentMessages}\n\n[PERGUNTA ATUAL]:\n${fullContext}`;
      }

      const aiResponseContent = await generateAIResponse(fullContext);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseContent,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Erro ao obter resposta da IA:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttachDocument = (document: Document) => {
    setSelectedDocument(document);
    setIsDocumentModalOpen(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verificar se é um tipo de arquivo suportado
      const supportedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (!supportedTypes.includes(file.type)) {
        alert('Tipo de arquivo não suportado. Aceitos: PDF, DOC, DOCX, TXT, JPG, PNG');
        return;
      }

      // Verificar tamanho do arquivo (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Arquivo muito grande. Tamanho máximo: 10MB');
        return;
      }

      setUploadedFile(file);
      
      // Ler conteúdo do arquivo se for texto
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          const newDocument: Document = {
            id: Date.now().toString(),
            name: file.name,
            type: 'doc',
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            uploadDate: new Date().toLocaleDateString('pt-BR'),
            category: 'Upload',
            patient: patient?.name || 'Paciente',
            content: content.substring(0, 1000), // Limitar conteúdo
            url: URL.createObjectURL(file)
          };
          setSelectedDocument(newDocument);
        };
        reader.readAsText(file);
      } else {
        // Para outros tipos de arquivo, criar documento sem conteúdo de texto
        const newDocument: Document = {
          id: Date.now().toString(),
          name: file.name,
          type: file.type.includes('pdf') ? 'pdf' : file.type.includes('image') ? 'image' : 'doc',
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          uploadDate: new Date().toLocaleDateString('pt-BR'),
          category: 'Upload',
          patient: patient?.name || 'Paciente',
          content: `Arquivo ${file.type.includes('image') ? 'de imagem' : file.type.includes('pdf') ? 'PDF' : 'de documento'} enviado pelo usuário: ${file.name}`,
          url: URL.createObjectURL(file)
        };
        setSelectedDocument(newDocument);
      }
    }
    
    // Limpar o input
    event.target.value = '';
  };

  const handlePaperclipClick = () => {
    fileInputRef.current?.click();
  };

  const generateAIResponse = async (userInput: string): Promise<string> => {
    try {
      const apiKey = import.meta.env.VITE_DIFY_API_KEY;
      const baseURL = import.meta.env.VITE_DIFY_BASE_URL;
      
      if (!apiKey || !baseURL) {
        throw new Error('Configuração da API não encontrada');
      }

      // Preparar as variáveis do contexto do paciente (com limite de caracteres)
      const truncateText = (text: string, maxLength: number) => 
        text.length > maxLength ? text.substring(0, maxLength - 3) + "..." : text;

      const variables = {
        nome_medico: `${doctorTitle} ${doctorName}`,
        especialidade_medico: truncateText(userProfile.specialty || "Medicina Geral", 45),
        nome_paciente: truncateText(patient?.name || "Paciente", 45),
        idade_paciente: patient?.age?.toString() || "N/A",
        genero_paciente: patient?.gender === 'M' ? 'Masculino' : 'Feminino',
        condicao_paciente: truncateText(patient?.condition || "Não especificada", 45),
        anamnese_paciente: truncateText(patient?.anamnesis || "Não disponível", 45),
        tags_paciente: truncateText(patient?.tags?.join(', ') || "Nenhuma", 45)
      };

      console.log('Enviando para Dify API:', {
        inputs: variables,
        query: userInput
      });

      const response = await fetch(`${baseURL}/chat-messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: variables,
          query: userInput,
          response_mode: 'blocking',
          user: 'medico-' + (patient?.id || 'default')
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na API do Dify:', response.status, errorText);
        
        if (response.status === 401) {
          throw new Error('Erro de autenticação com a API');
        } else if (response.status === 403) {
          throw new Error('Acesso negado pela API');
        } else if (response.status >= 500) {
          throw new Error('Erro interno do servidor');
        } else {
          throw new Error(`Erro na API: ${response.status}`);
        }
      }

      const data = await response.json();
      console.log('Resposta da Dify API:', data);
      
      return data.answer || 'Desculpe, não consegui processar sua solicitação no momento.';
      
    } catch (error) {
      console.error('Erro ao chamar API do Dify:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          return 'Erro de conexão com a IA. Verifique sua conexão com a internet.';
        } else if (error.message.includes('autenticação')) {
          return 'Erro de autenticação com a IA. Verifique as configurações da API.';
        } else {
          return `Erro: ${error.message}`;
        }
      }
      
      return 'Ocorreu um erro inesperado ao conectar com a IA. Por favor, tente novamente.';
    }
  };

  if (!patient) {
    return (
      <div className="min-h-screen bg-background pl-64 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Paciente não encontrado</h2>
          <Link to="/">
            <Button>Voltar ao Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className={`min-h-screen bg-background pt-16 lg:pt-2 transition-all duration-300 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4">
          <div className="flex items-center gap-4">
            <Link to={`/patients/${patient.id}`}>
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold">Dr. Synapse - {patient.name}</h1>
                <p className="text-sm text-muted-foreground">
                  IA de Suporte Clínico • Especialista em {patient.condition}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Info Card */}
        <div className="border-b border-border bg-muted/30">
          <Card className="border-0 rounded-none">
            <CardHeader className="pb-3 px-4">
              <CardTitle 
                className="text-sm flex items-center justify-between cursor-pointer hover:text-primary transition-colors"
                onClick={() => setIsContextExpanded(!isContextExpanded)}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Contexto Clínico do Paciente
                </div>
                {isContextExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </CardTitle>
            </CardHeader>
            
            {isContextExpanded && (
              <CardContent className="space-y-3 text-sm px-4 pb-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <span className="font-medium text-muted-foreground">Nome:</span>
                    <p className="font-medium">{patient.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Condição:</span>
                    <p className="font-medium">{patient.condition}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Idade:</span>
                    <p className="font-medium">{patient.age} anos</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Última consulta:</span>
                    <p className="font-medium">{patient.lastVisit}</p>
                  </div>
                </div>
                
                {patient.anamnesis && (
                  <div className="pt-2 border-t">
                    <span className="font-medium text-muted-foreground">Anamnese:</span>
                    <p className="text-xs leading-relaxed mt-1 text-muted-foreground">
                      {patient.anamnesis.length > 200 
                        ? patient.anamnesis.substring(0, 200) + "..." 
                        : patient.anamnesis
                      }
                    </p>
                  </div>
                )}
                
                <div className="flex gap-1 pt-2">
                  {patient.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback className={message.sender === 'ai' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}>
                  {message.sender === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
              
              <div className={`max-w-sm lg:max-w-2xl ${message.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
                {/* Documento anexado */}
                {message.attachedDocument && (
                  <div className="mb-3 p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
                    <div className="flex items-center gap-2 text-xs">
                      {message.attachedDocument.name.includes('Upload') || message.attachedDocument.type === 'upload' ? (
                        <Upload className="w-4 h-4 text-green-600" />
                      ) : (
                        <File className="w-4 h-4" />
                      )}
                      <span className="font-medium">{message.attachedDocument.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {message.attachedDocument.type.toUpperCase()}
                      </Badge>
                      {message.attachedDocument.name.includes('Upload') && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-300">
                          Arquivo Enviado
                        </Badge>
                      )}
                    </div>
                    {message.attachedDocument.content && (
                      <div className="mt-2 text-xs text-muted-foreground line-clamp-2">
                        {message.attachedDocument.content.substring(0, 100)}...
                      </div>
                    )}
                  </div>
                )}

                {message.sender === 'ai' ? (
                  <div className="markdown-content">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // Customizar estilos dos componentes markdown
                        p: ({ children }) => <p className="mb-2 last:mb-0 text-sm leading-relaxed">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc pl-4 mb-2 last:mb-0 text-sm">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 last:mb-0 text-sm">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        em: ({ children }) => <em className="italic">{children}</em>,
                        code: ({ children }) => <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                        pre: ({ children }) => <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto my-2">{children}</pre>,
                        h1: ({ children }) => <h1 className="text-base font-bold mb-2">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-sm font-bold mb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
                        blockquote: ({ children }) => <blockquote className="border-l-2 border-muted-foreground/30 pl-3 my-2 italic text-muted-foreground">{children}</blockquote>,
                        table: ({ children }) => <table className="w-full border-collapse my-2">{children}</table>,
                        th: ({ children }) => <th className="border border-muted p-2 bg-muted font-semibold text-left">{children}</th>,
                        td: ({ children }) => <td className="border border-muted p-2">{children}</td>,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
                <p className={`text-xs mt-2 opacity-70 ${message.sender === 'user' ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="chat-bubble-ai">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-border p-4">
          {/* Input de arquivo oculto */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            style={{ display: 'none' }}
          />

          {/* Documento selecionado */}
          {selectedDocument && (
            <div className="mb-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <File className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">{selectedDocument.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {selectedDocument.type.toUpperCase()}
                  </Badge>
                  {selectedDocument.category === 'Upload' && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      Arquivo Enviado
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedDocument(null);
                    setUploadedFile(null);
                  }}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                >
                  ×
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedDocument.category === 'Upload' 
                  ? 'Arquivo será anexado à sua mensagem' 
                  : 'Este documento será anexado à sua mensagem'
                }
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handlePaperclipClick}
              title="Enviar arquivo do computador"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            
            <div className="flex-1 flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Digite sua pergunta sobre o paciente..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="medical-gradient text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2 mt-2 flex-wrap">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={handlePaperclipClick}
              title="Enviar arquivo do computador"
            >
              <Paperclip className="w-3 h-3 mr-1" />
              Enviar Arquivo
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => setIsDocumentModalOpen(true)}
              title="Selecionar exame dos documentos salvos"
            >
              <FileText className="w-3 h-3 mr-1" />
              Exames Salvos
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => setInputMessage("Quais são as principais hipóteses diagnósticas para este caso?")}
            >
              Hipóteses Diagnósticas
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => setInputMessage("Que exames complementares você sugere para este paciente?")}
            >
              Sugerir Exames
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => setInputMessage("Analise o plano de tratamento atual e sugira otimizações.")}
            >
              Otimizar Tratamento
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => setInputMessage("Há sinais de alerta ou pontos críticos que devo observar?")}
            >
              Sinais de Alerta
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de Seleção de Documentos */}
      <Dialog open={isDocumentModalOpen} onOpenChange={setIsDocumentModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Selecionar Documento para Anexar
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Selecione um exame ou documento para anexar à sua mensagem. O conteúdo será analisado pela IA.
            </p>
            
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {availableDocuments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum documento disponível</p>
                    <p className="text-xs">Adicione documentos na seção "Documentos" primeiro</p>
                  </div>
                ) : (
                  availableDocuments.map((doc) => (
                    <Card 
                      key={doc.id} 
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => handleAttachDocument(doc)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <File className="w-5 h-5 text-primary" />
                          </div>
                          
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-sm">{doc.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {doc.type.toUpperCase()}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">{doc.size}</span>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {doc.uploadDate}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {doc.content && (
                              <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                                <strong>Preview:</strong> {doc.content.substring(0, 120)}...
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  {doc.category}
                                </Badge>
                                {doc.patient && (
                                  <span className="text-xs text-muted-foreground">
                                    Paciente: {doc.patient}
                                  </span>
                                )}
                              </div>
                              <Button variant="outline" size="sm" className="text-xs">
                                Anexar
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatIA;
