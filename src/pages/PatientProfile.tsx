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
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { mockPatients } from '@/data/mockData';
import { useNavbar } from '@/contexts/NavbarContext';

const PatientProfile = () => {
  const { isCollapsed } = useNavbar();
  const { id } = useParams();
  const patient = mockPatients.find(p => p.id === id);
  const [anamnesis, setAnamnesis] = useState(patient?.anamnesis || '');
  const [isEditingAnamnesis, setIsEditingAnamnesis] = useState(false);
  const [avatarColor, setAvatarColor] = useState(patient?.avatarColor || '');
  const [tempColor, setTempColor] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);

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

  const getAvatarColor = (patientId: string) => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500'];
    const index = parseInt(patientId) % colors.length;
    return colors[index];
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

  const handleSaveAnamnesis = () => {
    console.log('Salvando anamnese:', anamnesis);
    setIsEditingAnamnesis(false);
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
    }
    setShowColorPicker(false);
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
            <p className="text-muted-foreground text-sm lg:text-base">Informações detalhadas e histórico médico</p>
          </div>
          <Link to={`/chat/${patient.id}`}>
            <Button className="medical-gradient text-white w-full sm:w-auto">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat com IA
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
          {/* Left Column - Patient Info */}
          <div className="space-y-4 lg:space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg lg:text-xl">Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="relative">
                    <Avatar className="w-12 h-12 lg:w-16 lg:h-16">
                      <AvatarImage src={patient.avatar} />
                      <AvatarFallback className={`${avatarColor || patient.avatarColor || getAvatarColor(patient.id)} text-white text-sm lg:text-lg`}>
                        {patient.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute -bottom-1 -right-1 lg:-bottom-2 lg:-right-2 h-5 w-5 lg:h-6 lg:w-6 p-0 rounded-full"
                      onClick={() => setShowColorPicker(!showColorPicker)}
                    >
                      <Palette className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                    </Button>
                    
                    {showColorPicker && (
                      <div className="absolute top-full left-0 mt-2 p-3 bg-card border rounded-lg shadow-lg z-10 w-48 lg:w-60">
                        <p className="text-sm font-medium mb-3">Escolher cor:</p>
                        <div className="grid grid-cols-5 lg:grid-cols-6 gap-2 mb-4">
                          {colorOptions.map((color) => (
                            <button
                              key={color.class}
                              className={`w-6 h-6 lg:w-7 lg:h-7 rounded-full ${color.class} hover:scale-110 transition-transform ${
                                (tempColor || avatarColor || patient.avatarColor || getAvatarColor(patient.id)) === color.class
                                  ? 'ring-2 ring-offset-2 ring-primary' 
                                  : 'hover:ring-1 hover:ring-offset-1 hover:ring-gray-300'
                              }`}
                              onClick={() => setTempColor(color.class)}
                              title={color.name}
                            />
                          ))}
                        </div>

                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={handleConfirmColor}
                          disabled={!tempColor}
                        >
                          Confirmar
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg lg:text-xl font-semibold truncate">{patient.name}</h3>
                    <p className="text-muted-foreground text-sm lg:text-base">{patient.condition}</p>
                  </div>
                </div>

                <div className="space-y-2 lg:space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm lg:text-base">{patient.age} anos, {patient.gender === 'M' ? 'Masculino' : 'Feminino'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm lg:text-base break-all">{patient.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm lg:text-base">{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm lg:text-base">Última visita: {patient.lastVisit}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-sm font-medium mb-2">Tags:</p>
                  <div className="flex flex-wrap gap-1">
                    {patient.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg lg:text-xl">Documentos</CardTitle>
                  <Button variant="outline" size="sm" className="text-xs lg:text-sm">
                    <Upload className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                    Upload
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {patient.documents.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4 text-sm lg:text-base">
                    Nenhum documento anexado
                  </p>
                ) : (
                  <div className="space-y-2">
                    {patient.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <FileText className="w-4 h-4" />
                          <span className="text-sm truncate">{doc.name}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Anamnesis */}
          <div className="xl:col-span-2">
            <Card className="h-fit">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <CardTitle className="text-lg lg:text-xl">Prontuário / Anamnese</CardTitle>
                  <div className="flex gap-2">
                    {isEditingAnamnesis ? (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setIsEditingAnamnesis(false)}
                          className="text-xs lg:text-sm"
                        >
                          Cancelar
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleSaveAnamnesis}
                          className="medical-gradient text-white text-xs lg:text-sm"
                        >
                          <Save className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                          Salvar
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsEditingAnamnesis(true)}
                        className="text-xs lg:text-sm"
                      >
                        <Edit className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                        Editar
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isEditingAnamnesis ? (
                  <div className="space-y-4">
                    <Textarea
                      value={anamnesis}
                      onChange={(e) => setAnamnesis(e.target.value)}
                      rows={12}
                      className="w-full text-sm lg:text-base"
                      placeholder="Digite a anamnese do paciente..."
                    />
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button variant="outline" className="flex-1 text-xs lg:text-sm">
                        Usar Template
                      </Button>
                      <Button variant="outline" className="flex-1 text-xs lg:text-sm">
                        Gerar com IA
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-sm lg:text-base leading-relaxed">
                      {anamnesis || 'Nenhuma anamnese registrada ainda.'}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 mt-4 lg:mt-6">
              <Card>
                <CardContent className="p-3 lg:p-4">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm lg:text-base">Agendar Consulta</p>
                      <p className="text-xs lg:text-sm text-muted-foreground">Nova consulta para este paciente</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Calendar className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3 lg:p-4">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm lg:text-base">Enviar WhatsApp</p>
                      <p className="text-xs lg:text-sm text-muted-foreground">Lembrete ou orientação</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
