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
      case 'alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'moderada': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'leve': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
            <Link to={`/chat/${patient.id}`}>
              <Button className="medical-gradient text-white">
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat com IA
              </Button>
            </Link>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Nova Consulta
            </Button>
          </div>
        </div>

        {/* Patient Header Card */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
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
                  className="absolute -bottom-2 -right-2 h-8 w-8 p-0 rounded-full bg-white"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                >
                  <Palette className="w-4 h-4 text-gray-600" />
                </Button>
                
                {showColorPicker && (
                  <div className="absolute top-full left-0 mt-2 p-4 bg-white border rounded-lg shadow-xl z-10 w-72">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-gray-900">Escolher cor do avatar:</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => setShowColorPicker(false)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-6 gap-2 mb-4">
                      {colorOptions.map((color) => (
                        <button
                          key={color.class}
                          className={`w-8 h-8 rounded-full ${color.class} hover:scale-110 transition-transform ${
                            (tempColor || avatarColor || patient.avatarColor || getAvatarColor(patient.id)) === color.class
                              ? 'ring-2 ring-offset-2 ring-gray-800' 
                              : 'hover:ring-1 hover:ring-offset-1 hover:ring-gray-300'
                          }`}
                          onClick={() => setTempColor(color.class)}
                          title={color.name}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={handleConfirmColor}
                        disabled={!tempColor}
                      >
                        Confirmar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setShowColorPicker(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
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

              {/* Vital Signs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Sinais Vitais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Weight className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Peso</p>
                        <p className="font-bold text-lg">{vitals.peso}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Ruler className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Altura</p>
                        <p className="font-bold text-lg">{vitals.altura}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">IMC</p>
                        <p className="font-bold text-lg text-green-600">{vitals.imc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Pressão</p>
                        <p className="font-bold text-lg">{vitals.pressao}</p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="text-sm">Freq. Cardíaca</span>
                      </div>
                      <span className="font-semibold">{vitals.frequenciaCardiaca}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Temperatura</span>
                      </div>
                      <span className="font-semibold">{vitals.temperatura}</span>
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
                        <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-red-800">{allergy.substance}</p>
                            <Badge className={getSeverityColor(allergy.severity)}>
                              {allergy.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-red-600">{allergy.reaction}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Consultas Totais</p>
                      <p className="text-2xl font-bold">{patientAppointments.length}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Medicações Ativas</p>
                      <p className="text-2xl font-bold">{medications.filter(m => m.status === 'ativo').length}</p>
                    </div>
                    <Pill className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Documentos</p>
                      <p className="text-2xl font-bold">{documents.length}</p>
                    </div>
                    <FileText className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Adesão ao Tratamento</p>
                      <p className="text-2xl font-bold">92%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-orange-500" />
                  </div>
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
              <Button>
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
              <Button>
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
              <Button>
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
      </div>
    </div>
  );
};

export default PatientProfile;
