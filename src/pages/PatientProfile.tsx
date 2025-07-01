import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  FileText, 
  Upload, 
  Download, 
  MessageSquare,
  Calendar,
  Phone,
  Mail,
  User,
  Save,
  Palette,
  Clock,
  Heart,
  Activity,
  Pill,
  FileImage,
  Plus,
  Eye,
  AlertTriangle,
  CheckCircle,
  History,
  TrendingUp,
  MapPin,
  Users,
  Thermometer,
  Weight,
  Ruler,
  Zap,
  CircleDot,
  Trash2,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { mockPatients, mockAppointments } from '@/data/mockData';
import { useNavbar } from '@/contexts/NavbarContext';
import { toast } from 'sonner';

const PatientProfile = () => {
  const { isCollapsed } = useNavbar();
  const { id } = useParams();
  const patient = mockPatients.find(p => p.id === id);
  const [anamnesis, setAnamnesis] = useState(patient?.anamnesis || '');
  const [isEditingAnamnesis, setIsEditingAnamnesis] = useState(false);
  const [avatarColor, setAvatarColor] = useState(patient?.avatarColor || '');
  const [tempColor, setTempColor] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Estados para modais
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [isNewDocumentOpen, setIsNewDocumentOpen] = useState(false);
  const [isAddMedicationOpen, setIsAddMedicationOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isAnamnesisModalOpen, setIsAnamnesisModalOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [selectedMessageType, setSelectedMessageType] = useState<string>('');

  // Estados para formulários
  const [newAppointment, setNewAppointment] = useState({
    date: '',
    time: '',
    type: 'Consulta de Rotina',
    notes: ''
  });
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    startDate: ''
  });
  const [newEvent, setNewEvent] = useState({
    event: '',
    description: '',
    type: 'appointment',
    date: ''
  });

  // Mock data adicional para o perfil
  const patientAppointments = mockAppointments.filter(apt => apt.patientId === id);
  
  const vitals = {
    peso: '70 kg',
    altura: '1.75 m',
    imc: '22.9',
    pressao: '120/80 mmHg',
    temperatura: '36.5°C',
    frequenciaCardiaca: '72 bpm'
  };

  const medications = [
    { id: '1', name: 'Losartana 50mg', dosage: '1x ao dia', status: 'ativo', since: '15/01/2024', nextDose: '08:00' },
    { id: '2', name: 'Omeprazol 20mg', dosage: '1x ao dia', status: 'ativo', since: '22/03/2024', nextDose: '07:00' },
    { id: '3', name: 'Vitamina D 2000ui', dosage: '1x ao dia', status: 'pausado', since: '10/02/2024', nextDose: '-' }
  ];

  const allergies = [
    { substance: 'Penicilina', reaction: 'Erupção cutânea', severity: 'moderada' },
    { substance: 'Dipirona', reaction: 'Náusea', severity: 'leve' }
  ];

  const timeline = [
    { id: '1', date: '29/06/2025', event: 'Consulta de retorno agendada', description: 'Acompanhamento da pressão arterial', type: 'appointment', status: 'scheduled' },
    { id: '2', date: '25/06/2025', event: 'Consulta realizada', description: 'Avaliação geral e ajuste de medicação', type: 'appointment', status: 'completed' },
    { id: '3', date: '20/06/2025', event: 'Exames laboratoriais', description: 'Hemograma completo e glicemia', type: 'exam', status: 'completed' },
    { id: '4', date: '15/06/2025', event: 'Medicação ajustada', description: 'Losartana aumentada para 50mg', type: 'medication', status: 'completed' },
    { id: '5', date: '10/06/2025', event: 'Consulta de emergência', description: 'Pico hipertensivo controlado', type: 'emergency', status: 'completed' }
  ];

  const documents = [
    { id: '1', name: 'Exame de Sangue - Junho 2025', type: 'exam', date: '20/06/2025', size: '2.4 MB' },
    { id: '2', name: 'Eletrocardiograma', type: 'exam', date: '15/06/2025', size: '1.8 MB' },
    { id: '3', name: 'Receituário Médico', type: 'prescription', date: '25/06/2025', size: '1.2 MB' },
    { id: '4', name: 'Atestado Médico', type: 'certificate', date: '25/06/2025', size: '800 KB' }
  ];

  const colorOptions = [
    { name: 'Vermelho', class: 'bg-red-500' },
    { name: 'Vermelho Claro', class: 'bg-red-300' },
    { name: 'Vermelho Escuro', class: 'bg-red-700' },
    { name: 'Azul', class: 'bg-blue-500' },
    { name: 'Azul Claro', class: 'bg-blue-300' },
    { name: 'Azul Escuro', class: 'bg-blue-700' },
    { name: 'Verde', class: 'bg-green-500' },
    { name: 'Verde Claro', class: 'bg-green-300' },
    { name: 'Verde Escuro', class: 'bg-green-700' },
    { name: 'Amarelo', class: 'bg-yellow-500' },
    { name: 'Amarelo Claro', class: 'bg-yellow-300' },
    { name: 'Amarelo Escuro', class: 'bg-yellow-600' },
    { name: 'Roxo', class: 'bg-purple-500' },
    { name: 'Roxo Claro', class: 'bg-purple-300' },
    { name: 'Roxo Escuro', class: 'bg-purple-700' },
    { name: 'Rosa', class: 'bg-pink-500' },
    { name: 'Rosa Claro', class: 'bg-pink-300' },
    { name: 'Rosa Escuro', class: 'bg-pink-700' },
    { name: 'Índigo', class: 'bg-indigo-500' },
    { name: 'Índigo Claro', class: 'bg-indigo-300' },
    { name: 'Índigo Escuro', class: 'bg-indigo-700' },
    { name: 'Turquesa', class: 'bg-teal-500' },
    { name: 'Turquesa Claro', class: 'bg-teal-300' },
    { name: 'Turquesa Escuro', class: 'bg-teal-700' },
    { name: 'Laranja', class: 'bg-orange-500' },
    { name: 'Laranja Claro', class: 'bg-orange-300' },
    { name: 'Laranja Escuro', class: 'bg-orange-700' },
    { name: 'Ciano', class: 'bg-cyan-500' },
    { name: 'Ciano Claro', class: 'bg-cyan-300' },
    { name: 'Ciano Escuro', class: 'bg-cyan-700' }
  ];

  const getInitials = (name: string) => {
    const nameParts = name.split(' ').filter(part => 
      !['Dr.', 'Dr', 'Dra.', 'Dra'].includes(part)
    );
    return nameParts.map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (patientId: string) => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500'];
    const index = parseInt(patientId) % colors.length;
    return colors[index];
  };

  const getBannerGradient = () => {
    const currentColor = avatarColor || patient.avatarColor || getAvatarColor(patient.id);
    
    // Mapear cores do Tailwind para cores CSS - tons mais claros e vibrantes
    const colorMap: { [key: string]: string } = {
      'bg-red-500': 'from-red-400 to-red-500',
      'bg-blue-500': 'from-blue-400 to-blue-500',
      'bg-green-500': 'from-green-400 to-green-500',
      'bg-yellow-500': 'from-yellow-400 to-yellow-500',
      'bg-purple-500': 'from-purple-400 to-purple-500',
      'bg-pink-500': 'from-pink-400 to-pink-500',
      'bg-indigo-500': 'from-indigo-400 to-indigo-500',
      'bg-teal-500': 'from-teal-400 to-teal-500',
      'bg-orange-500': 'from-orange-400 to-orange-500',
      'bg-cyan-500': 'from-cyan-400 to-cyan-500',
      'bg-red-300': 'from-red-300 to-red-400',
      'bg-red-700': 'from-red-500 to-red-600',
      'bg-blue-300': 'from-blue-300 to-blue-400',
      'bg-blue-700': 'from-blue-500 to-blue-600',
      'bg-green-300': 'from-green-300 to-green-400',
      'bg-green-700': 'from-green-500 to-green-600',
      'bg-yellow-300': 'from-yellow-300 to-yellow-400',
      'bg-yellow-600': 'from-yellow-400 to-yellow-500',
      'bg-purple-300': 'from-purple-300 to-purple-400',
      'bg-purple-700': 'from-purple-500 to-purple-600',
      'bg-pink-300': 'from-pink-300 to-pink-400',
      'bg-pink-700': 'from-pink-500 to-pink-600',
      'bg-indigo-300': 'from-indigo-300 to-indigo-400',
      'bg-indigo-700': 'from-indigo-500 to-indigo-600',
      'bg-teal-300': 'from-teal-300 to-teal-400',
      'bg-teal-700': 'from-teal-500 to-teal-600',
      'bg-orange-300': 'from-orange-300 to-orange-400',
      'bg-orange-700': 'from-orange-500 to-orange-600',
      'bg-cyan-300': 'from-cyan-300 to-cyan-400',
      'bg-cyan-700': 'from-cyan-500 to-cyan-600'
    };
    
    return colorMap[currentColor] || 'from-blue-400 to-blue-500';
  };

  if (!patient) {
    return (
      <div className={`min-h-screen bg-background pt-16 lg:pt-2 transition-all duration-300 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-72'} flex items-center justify-center`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Paciente não encontrado</h2>
          <Link to="/">
            <Button>Voltar ao Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSaveAnamnesis = () => {
    console.log('Salvando anamnese:', anamnesis);
    setIsEditingAnamnesis(false);
    toast.success('Anamnese salva com sucesso!', {
      duration: 3000,
    });
  };

  const handleConfirmColor = () => {
    if (tempColor) {
      setAvatarColor(tempColor);
      // Atualizar no mockPatients para persistir a mudança
      const patientIndex = mockPatients.findIndex(p => p.id === patient.id);
      if (patientIndex !== -1) {
        mockPatients[patientIndex].avatarColor = tempColor;
      }
      setTempColor('');
      toast.success('Cor do avatar alterada!', {
        duration: 3000,
      });
    }
    setShowColorPicker(false);
  };

  // Funções para as funcionalidades
  const handleNewAppointment = () => {
    if (newAppointment.date && newAppointment.time) {
      toast.success('Consulta agendada com sucesso!', {
        duration: 3000,
      });
      setNewAppointment({ date: '', time: '', type: 'Consulta de Rotina', notes: '' });
      setIsNewAppointmentOpen(false);
    } else {
      toast.error('Preencha todos os campos obrigatórios!', {
        duration: 3000,
      });
    }
  };

  const handleAddMedication = () => {
    if (newMedication.name && newMedication.dosage) {
      toast.success('Medicação adicionada com sucesso!', {
        duration: 3000,
      });
      setNewMedication({ name: '', dosage: '', frequency: '', startDate: '' });
      setIsAddMedicationOpen(false);
    } else {
      toast.error('Preencha todos os campos obrigatórios!', {
        duration: 3000,
      });
    }
  };

  const handleAddEvent = () => {
    if (newEvent.event && newEvent.date) {
      toast.success('Evento adicionado ao histórico!', {
        duration: 3000,
      });
      setNewEvent({ event: '', description: '', type: 'appointment', date: '' });
      setIsAddEventOpen(false);
    } else {
      toast.error('Preencha todos os campos obrigatórios!', {
        duration: 3000,
      });
    }
  };

  const handleUploadDocument = () => {
    toast.success('Documento enviado com sucesso!', {
      duration: 3000,
    });
    setIsNewDocumentOpen(false);
  };

  const getWhatsAppMessage = (type: string, patientName: string) => {
    const messages = {
      reminder: `Olá ${patientName}! 👋\n\nEste é um lembrete da sua consulta agendada para amanhã às 14:00.\n\nPor favor, chegue 15 minutos antes do horário marcado.\n\nObrigado!`,
      orientation: `Olá ${patientName}! 👨‍⚕️\n\nSegue as orientações médicas conforme nossa última consulta:\n\n• Tomar medicação conforme prescrito\n• Manter dieta balanceada\n• Retornar em 30 dias\n\nDúvidas? Entre em contato!`,
      exam: `Olá ${patientName}! 📋\n\nSeus resultados de exames estão prontos!\n\nTodos os valores estão dentro da normalidade. Parabéns por cuidar da sua saúde!\n\nAgende seu retorno se necessário.`,
      medication: `Olá ${patientName}! 💊\n\nLembrete: É hora de tomar sua medicação!\n\n⏰ Horário: ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}\n\nMantenha a regularidade do tratamento.`
    };

    return messages[type as keyof typeof messages] || '';
  };

  const handleSendWhatsApp = (type: string) => {
    const message = getWhatsAppMessage(type, patient.name);
    const phoneNumber = patient.phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    setIsWhatsAppOpen(false);
    
    toast.success('Redirecionando para WhatsApp...', {
      duration: 3000,
    });
  };

  const getMessagePreview = (type: string) => {
    return getWhatsAppMessage(type, patient?.name || '[Nome do Paciente]') || 'Selecione um tipo de mensagem para ver o preview';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'scheduled': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'emergency': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Calendar className="w-4 h-4" />;
      case 'exam': return <FileText className="w-4 h-4" />;
      case 'medication': return <Pill className="w-4 h-4" />;
      case 'emergency': return <AlertTriangle className="w-4 h-4" />;
      default: return <CircleDot className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'alta': return 'bg-red-100 text-red-700 border border-red-200';
      case 'moderada': return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'leve': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const getMedicationStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800 border-green-200';
      case 'pausado': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'descontinuado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'exam': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'prescription': return <Pill className="w-4 h-4 text-green-500" />;
      case 'certificate': return <FileImage className="w-4 h-4 text-purple-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className={`min-h-screen bg-background pt-16 lg:pt-2 transition-all duration-300 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="icon" className="w-8 h-8 lg:w-10 lg:h-10">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Perfil do Paciente</h1>
            <p className="text-muted-foreground text-sm lg:text-base">Histórico médico completo e informações detalhadas</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsNewAppointmentOpen(true)}>
              <Calendar className="w-4 h-4 mr-2" />
              Nova Consulta
            </Button>
            <Button variant="outline" onClick={() => setIsNewDocumentOpen(true)}>
              <FileText className="w-4 h-4 mr-2" />
              Novo Documento
            </Button>
          </div>
        </div>

        {/* Patient Header Card */}
        <div className="relative">
          <Card className="overflow-hidden">
            <div className={`bg-gradient-to-r ${getBannerGradient()} p-6 text-white relative`}>
              {/* Overlay sutil para melhor legibilidade */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-black/10 to-black/20 backdrop-blur-[2px]"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative">
                  <Avatar className="w-20 h-20 lg:w-24 lg:h-24 border-4 border-white">
                    <AvatarImage src={patient.avatar} />
                    <AvatarFallback className={`${avatarColor || patient.avatarColor || getAvatarColor(patient.id)} text-white text-2xl`}>
                      {getInitials(patient.name)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute -bottom-2 -right-2 h-9 w-9 p-0 rounded-full bg-white hover:bg-gray-50 border-2 border-white shadow-lg"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                  >
                    <Palette className="w-4 h-4 text-gray-700" />
                  </Button>
                </div>
                
                <div className="flex-1 space-y-2">
                  <h2 className="text-2xl lg:text-3xl font-bold">{patient.name}</h2>
                  <p className="text-blue-100 text-lg">{patient.condition}</p>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="text-sm">{patient.age} anos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{patient.gender === 'M' ? 'Masculino' : 'Feminino'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Últ. visita: {patient.lastVisit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      <span className="text-sm">{patientAppointments.length} consultas</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {patient.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-white/20 text-white border-white/30">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Color Picker Modal - fora do card para não ficar preso */}
          {showColorPicker && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="p-6 bg-background border rounded-2xl shadow-2xl w-96 max-w-[90vw]">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-base font-semibold">Personalizar Tema</h3>
                    <p className="text-sm text-muted-foreground">Escolha uma cor para o avatar e banner</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full"
                    onClick={() => {
                      setShowColorPicker(false);
                      setTempColor('');
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-6 gap-3 mb-6">
                  {colorOptions.map((color) => {
                    const isSelected = (tempColor || avatarColor || patient.avatarColor || getAvatarColor(patient.id)) === color.class;
                    return (
                      <button
                        key={color.class}
                        className={`relative w-12 h-12 rounded-xl ${color.class} transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                          isSelected 
                            ? 'ring-3 ring-blue-500 ring-offset-2 scale-105 shadow-lg' 
                            : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-1'
                        }`}
                        onClick={() => setTempColor(color.class)}
                        title={color.name}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-white drop-shadow-lg" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    onClick={handleConfirmColor}
                    disabled={!tempColor}
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    Aplicar Tema
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="px-6"
                    onClick={() => {
                      setShowColorPicker(false);
                      setTempColor('');
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="relative">
            <TabsList className="grid w-full grid-cols-5 relative bg-muted p-1 h-auto">
              {/* Animated background slider */}
              <div 
                className={`absolute top-1 bottom-1 bg-background rounded-md shadow-sm transition-all duration-300 ease-in-out z-0 ${
                  activeTab === 'overview' 
                    ? 'left-1 w-[calc(20%-4px)]' 
                    : activeTab === 'anamnesis' 
                      ? 'left-[20%] w-[calc(20%-2px)]' 
                      : activeTab === 'medications'
                        ? 'left-[40%] w-[calc(20%-2px)]'
                        : activeTab === 'timeline'
                          ? 'left-[60%] w-[calc(20%-2px)]'
                          : 'left-[80%] w-[calc(20%-4px)]'
                }`}
              />
              
              <TabsTrigger value="overview" className="relative z-10 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span className="hidden sm:inline">Visão Geral</span>
              </TabsTrigger>
              
              <TabsTrigger value="anamnesis" className="relative z-10 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Prontuário</span>
              </TabsTrigger>
              
              <TabsTrigger value="medications" className="relative z-10 flex items-center gap-2">
                <Pill className="w-4 h-4" />
                <span className="hidden sm:inline">Medicações</span>
              </TabsTrigger>
              
              <TabsTrigger value="timeline" className="relative z-10 flex items-center gap-2">
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">Histórico</span>
              </TabsTrigger>
              
              <TabsTrigger value="documents" className="relative z-10 flex items-center gap-2">
                <FileImage className="w-4 h-4" />
                <span className="hidden sm:inline">Documentos</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Primeira linha: Informações de Contato, Medidas Corporais, Alergias */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informações de Contato
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium break-all">{patient.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Telefone</p>
                      <p className="font-medium">{patient.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Endereço</p>
                      <p className="font-medium text-sm">Rua das Flores, 123<br/>São Paulo - SP</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Medidas Corporais */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Medidas Corporais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">P</span>
                        </div>
                        <span className="text-sm font-medium">Peso</span>
                      </div>
                      <span className="text-lg font-bold">{vitals.peso}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-green-600">A</span>
                        </div>
                        <span className="text-sm font-medium">Altura</span>
                      </div>
                      <span className="text-lg font-bold">{vitals.altura}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-emerald-600">IMC</span>
                        </div>
                        <span className="text-sm font-medium">Índice de Massa</span>
                      </div>
                      <span className="text-lg font-bold">{vitals.imc}</span>
                    </div>
                  </div>
                  
                  <div className="text-center pt-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">Peso Normal</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Allergies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Alergias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {allergies.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">Nenhuma alergia registrada</p>
                  ) : (
                    <div className="space-y-3">
                      {allergies.map((allergy, index) => (
                        <div key={index} className="p-4 border-2 border-amber-200 dark:border-amber-700 bg-background rounded-xl shadow-sm hover:shadow-md hover:border-amber-300 dark:hover:border-amber-600 transition-all duration-200">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                              <p className="font-semibold">{allergy.substance}</p>
                            </div>
                            <Badge className={`${getSeverityColor(allergy.severity)} border-0 font-medium`}>
                              {allergy.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground ml-4">{allergy.reaction}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Segunda linha: Consultar IA, Anamnese, Comunicação WhatsApp */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Consultar IA */}
              <Card className="hover:shadow-md transition-shadow flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    Consultar IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">IA Médica</span>
                    <Badge className="text-xs bg-blue-900 text-blue-100 border-blue-800">
                      Disponível
                    </Badge>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg flex-1 flex items-center justify-center min-h-[120px]">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-blue-600" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Análise inteligente do histórico médico e recomendações personalizadas
                      </p>
                    </div>
                  </div>
                  
                  <Link to={`/chat/${patient.id}`} className="mt-auto">
                    <Button className="w-full">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Consultar IA
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Anamnese */}
              <Card className="hover:shadow-md transition-shadow cursor-pointer flex flex-col" onClick={() => setIsAnamnesisModalOpen(true)}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Anamnese
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Prontuário</span>
                    <Badge className={`text-xs ${anamnesis ? 'bg-purple-800 text-purple-100 border-purple-700' : 'bg-gray-100 text-gray-700 border-gray-300'}`}>
                      {anamnesis ? 'Preenchida' : 'Pendente'}
                    </Badge>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg flex-1 min-h-[120px]">
                    <p className="text-sm leading-relaxed">
                      {anamnesis || 'Nenhuma anamnese registrada ainda. Clique para adicionar informações médicas do paciente.'}
                    </p>
                  </div>
                  
                  <Button className="w-full mt-auto" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    {anamnesis ? 'Editar Anamnese' : 'Criar Anamnese'}
                  </Button>
                </CardContent>
              </Card>

              {/* Comunicação WhatsApp */}
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    Comunicação WhatsApp
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Mensagens</span>
                    <Badge className="text-xs bg-green-600 text-white border-green-500">
                      Ativo
                    </Badge>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg flex-1 min-h-[120px] flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-8 h-8 text-green-600" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Envie mensagens pré-configuradas diretamente para o WhatsApp do paciente
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-auto bg-green-600 hover:bg-green-700 text-white" 
                    onClick={() => setIsWhatsAppOpen(true)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Enviar Mensagem
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Anamnesis Tab */}
          <TabsContent value="anamnesis" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Anamnese
                  </CardTitle>
                  <Button
                    variant={isEditingAnamnesis ? "default" : "outline"}
                    onClick={() => isEditingAnamnesis ? handleSaveAnamnesis() : setIsEditingAnamnesis(true)}
                  >
                    {isEditingAnamnesis ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isEditingAnamnesis ? (
                  <Textarea
                    value={anamnesis}
                    onChange={(e) => setAnamnesis(e.target.value)}
                    className="min-h-[300px] text-base"
                    placeholder="Digite a anamnese do paciente..."
                  />
                ) : (
                  <div className="whitespace-pre-wrap text-base leading-relaxed bg-muted/30 p-4 rounded-lg">
                    {anamnesis || 'Nenhuma anamnese registrada.'}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medications Tab */}
          <TabsContent value="medications" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Medicações</h3>
              <Button onClick={() => setIsAddMedicationOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Medicação
              </Button>
            </div>

            <div className="grid gap-4">
              {medications.map((medication) => (
                <Card key={medication.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Pill className="w-5 h-5 text-blue-500" />
                          <h4 className="font-semibold text-lg">{medication.name}</h4>
                          <Badge className={getMedicationStatusColor(medication.status)}>
                            {medication.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Dosagem:</span>
                            <p className="font-medium">{medication.dosage}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Início:</span>
                            <p className="font-medium">{medication.since}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Próxima dose:</span>
                            <p className="font-medium">{medication.nextDose}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-1 ml-4">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Histórico do Paciente</h3>
              <Button onClick={() => setIsAddEventOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Evento
              </Button>
            </div>

            <div className="space-y-4">
              {timeline.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(event.status)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getTypeIcon(event.type)}
                          <h4 className="font-semibold">{event.event}</h4>
                          <span className="text-sm text-muted-foreground">• {event.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Documentos</h3>
              <Button onClick={() => setIsNewDocumentOpen(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Documento
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((document) => (
                <Card key={document.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {getDocumentIcon(document.type)}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{document.name}</h4>
                        <p className="text-sm text-muted-foreground">{document.date}</p>
                        <p className="text-xs text-muted-foreground">{document.size}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 mt-3">
                      <Button variant="ghost" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-1" />
                        Baixar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Modais */}
        
        {/* Modal Nova Consulta */}
        <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nova Consulta para {patient?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="appointment-date">Data</Label>
                <Input
                  id="appointment-date"
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="appointment-time">Horário</Label>
                <Input
                  id="appointment-time"
                  type="time"
                  value={newAppointment.time}
                  onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="appointment-type">Tipo de Consulta</Label>
                <Select value={newAppointment.type} onValueChange={(value) => setNewAppointment({...newAppointment, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Consulta de Rotina">Consulta de Rotina</SelectItem>
                    <SelectItem value="Retorno">Retorno</SelectItem>
                    <SelectItem value="Urgência">Urgência</SelectItem>
                    <SelectItem value="Exame">Exame</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="appointment-notes">Observações</Label>
                <Textarea
                  id="appointment-notes"
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                  placeholder="Observações sobre a consulta..."
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleNewAppointment} className="flex-1">
                  Agendar Consulta
                </Button>
                <Button variant="outline" onClick={() => setIsNewAppointmentOpen(false)} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal Novo Documento */}
        <Dialog open={isNewDocumentOpen} onOpenChange={setIsNewDocumentOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload de Documento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="document-upload">Selecionar Arquivo</Label>
                <Input id="document-upload" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
              </div>
              <div>
                <Label htmlFor="document-category">Categoria</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exam">Exame</SelectItem>
                    <SelectItem value="prescription">Receita</SelectItem>
                    <SelectItem value="certificate">Atestado</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="document-description">Descrição</Label>
                <Textarea
                  id="document-description"
                  placeholder="Descrição do documento..."
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleUploadDocument} className="flex-1">
                  Fazer Upload
                </Button>
                <Button variant="outline" onClick={() => setIsNewDocumentOpen(false)} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal Adicionar Medicação */}
        <Dialog open={isAddMedicationOpen} onOpenChange={setIsAddMedicationOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Medicação</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="medication-name">Nome da Medicação</Label>
                <Input
                  id="medication-name"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                  placeholder="Ex: Losartana 50mg"
                />
              </div>
              <div>
                <Label htmlFor="medication-dosage">Dosagem</Label>
                <Input
                  id="medication-dosage"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                  placeholder="Ex: 1 comprimido"
                />
              </div>
              <div>
                <Label htmlFor="medication-frequency">Frequência</Label>
                <Select value={newMedication.frequency} onValueChange={(value) => setNewMedication({...newMedication, frequency: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1x ao dia">1x ao dia</SelectItem>
                    <SelectItem value="2x ao dia">2x ao dia</SelectItem>
                    <SelectItem value="3x ao dia">3x ao dia</SelectItem>
                    <SelectItem value="A cada 8 horas">A cada 8 horas</SelectItem>
                    <SelectItem value="A cada 12 horas">A cada 12 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="medication-start">Data de Início</Label>
                <Input
                  id="medication-start"
                  type="date"
                  value={newMedication.startDate}
                  onChange={(e) => setNewMedication({...newMedication, startDate: e.target.value})}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddMedication} className="flex-1">
                  Adicionar Medicação
                </Button>
                <Button variant="outline" onClick={() => setIsAddMedicationOpen(false)} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal Adicionar Evento */}
        <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Evento ao Histórico</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="event-title">Título do Evento</Label>
                <Input
                  id="event-title"
                  value={newEvent.event}
                  onChange={(e) => setNewEvent({...newEvent, event: e.target.value})}
                  placeholder="Ex: Consulta realizada"
                />
              </div>
              <div>
                <Label htmlFor="event-description">Descrição</Label>
                <Textarea
                  id="event-description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="Descrição detalhada do evento..."
                />
              </div>
              <div>
                <Label htmlFor="event-type">Tipo do Evento</Label>
                <Select value={newEvent.type} onValueChange={(value) => setNewEvent({...newEvent, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="appointment">Consulta</SelectItem>
                    <SelectItem value="exam">Exame</SelectItem>
                    <SelectItem value="medication">Medicação</SelectItem>
                    <SelectItem value="emergency">Emergência</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="event-date">Data</Label>
                <Input
                  id="event-date"
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddEvent} className="flex-1">
                  Adicionar Evento
                </Button>
                <Button variant="outline" onClick={() => setIsAddEventOpen(false)} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal Anamnese */}
        <Dialog open={isAnamnesisModalOpen} onOpenChange={setIsAnamnesisModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Anamnese - {patient?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {isEditingAnamnesis ? 'Editando' : 'Visualização'}
                  </Badge>
                </div>
                <Button
                  variant={isEditingAnamnesis ? "default" : "outline"}
                  onClick={() => isEditingAnamnesis ? handleSaveAnamnesis() : setIsEditingAnamnesis(true)}
                >
                  {isEditingAnamnesis ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </>
                  )}
                </Button>
              </div>
              {isEditingAnamnesis ? (
                <Textarea
                  value={anamnesis}
                  onChange={(e) => setAnamnesis(e.target.value)}
                  className="min-h-[400px] text-base"
                  placeholder="Digite a anamnese do paciente..."
                />
              ) : (
                <div className="whitespace-pre-wrap text-base leading-relaxed bg-muted/30 p-4 rounded-lg min-h-[400px]">
                  {anamnesis || 'Nenhuma anamnese registrada.'}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal WhatsApp */}
        <Dialog open={isWhatsAppOpen} onOpenChange={(open) => {
          setIsWhatsAppOpen(open);
          if (!open) setSelectedMessageType('');
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-600" />
                Enviar WhatsApp para {patient?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Botões de seleção de mensagem */}
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Escolha o tipo de mensagem para enviar:
                </p>
                
                <div 
                  className="space-y-3"
                  onMouseLeave={() => setSelectedMessageType('')}
                >
                  <Button 
                    className="w-full justify-start bg-green-600 hover:bg-green-700"
                    onClick={() => handleSendWhatsApp('reminder')}
                    onMouseEnter={() => setSelectedMessageType('reminder')}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Lembrete de Consulta
                  </Button>
                  
                  <Button 
                    className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleSendWhatsApp('orientation')}
                    onMouseEnter={() => setSelectedMessageType('orientation')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Orientações Médicas
                  </Button>
                  
                  <Button 
                    className="w-full justify-start bg-purple-600 hover:bg-purple-700"
                    onClick={() => handleSendWhatsApp('exam')}
                    onMouseEnter={() => setSelectedMessageType('exam')}
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Resultados de Exames
                  </Button>
                  
                  <Button 
                    className="w-full justify-start bg-orange-600 hover:bg-orange-700"
                    onClick={() => handleSendWhatsApp('medication')}
                    onMouseEnter={() => setSelectedMessageType('medication')}
                  >
                    <Pill className="w-4 h-4 mr-2" />
                    Lembrete de Medicação
                  </Button>
                </div>
                
                <div className="pt-4 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      const phoneNumber = patient.phone.replace(/\D/g, '');
                      const defaultMessage = `Olá ${patient.name}! 👋\n\nEspero que esteja bem. Entre em contato através do sistema DocIA se precisar de alguma coisa.\n\nAtenciosamente,\nEquipe Médica`;
                      const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;
                      window.open(whatsappUrl, '_blank');
                      setIsWhatsAppOpen(false);
                    }}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Abrir Chat Direto
                  </Button>
                </div>
              </div>

              {/* Preview da mensagem */}
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Preview da mensagem:
                </p>
                
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 min-h-[300px]">
                  {selectedMessageType ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-300">
                        <MessageSquare className="w-4 h-4" />
                        WhatsApp
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border">
                        <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-sans">
                          {getMessagePreview(selectedMessageType)}
                        </pre>
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                        <span>•</span>
                        Passe o mouse sobre os botões para ver diferentes mensagens
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-center">
                      <div className="space-y-3">
                        <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                          <MessageSquare className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Passe o mouse sobre um botão para ver o preview da mensagem
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PatientProfile;
