
import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  Paperclip, 
  Bot, 
  User,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { mockPatients } from '@/data/mockData';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

const ChatIA = () => {
  const { id } = useParams();
  const patient = mockPatients.find(p => p.id === id);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Olá! Sou a IA especializada em ${patient?.condition || 'medicina'}. Como posso ajudá-lo com o caso de ${patient?.name || 'paciente'}?`,
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simular resposta da IA
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputMessage),
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const responses = [
      `Com base no histórico de ${patient?.name}, sugiro analisar os seguintes pontos: sintomas atuais, medicações em uso e evolução do quadro.`,
      `Para o caso de ${patient?.condition}, recomendo seguir as diretrizes clínicas mais atualizadas. Posso detalhar um protocolo específico se necessário.`,
      `Analisando o perfil do paciente, seria interessante considerar exames complementares para um diagnóstico mais preciso.`,
      `Com base nas informações disponíveis, posso sugerir algumas abordagens terapêuticas adequadas para este caso.`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
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
    <div className="min-h-screen bg-background pl-64">
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
                <h1 className="text-xl font-bold">IA Médica - {patient.name}</h1>
                <p className="text-sm text-muted-foreground">
                  Especialista em {patient.condition}
                </p>
              </div>
            </div>
            <div className="ml-auto">
              <Badge variant="secondary">Online</Badge>
            </div>
          </div>
        </div>

        {/* Patient Info Card */}
        <div className="p-4 border-b border-border bg-muted/30">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Contexto do Paciente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Nome:</span> {patient.name}
                </div>
                <div>
                  <span className="font-medium">Condição:</span> {patient.condition}
                </div>
                <div>
                  <span className="font-medium">Idade:</span> {patient.age} anos
                </div>
                <div>
                  <span className="font-medium">Última consulta:</span> {patient.lastVisit}
                </div>
              </div>
              <div className="flex gap-1 pt-2">
                {patient.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
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
              
              <div className={`max-w-xs lg:max-w-md ${message.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 opacity-70 ${message.sender === 'user' ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
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
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
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
          
          <div className="flex gap-2 mt-2">
            <Button variant="outline" size="sm" className="text-xs">
              <FileText className="w-3 h-3 mr-1" />
              Anexar Exame
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              Sugerir Diagnóstico
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              Protocolo de Tratamento
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatIA;
