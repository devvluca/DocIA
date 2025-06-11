
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
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { mockPatients } from '@/data/mockData';

const PatientProfile = () => {
  const { id } = useParams();
  const patient = mockPatients.find(p => p.id === id);
  const [anamnesis, setAnamnesis] = useState(patient?.anamnesis || '');
  const [isEditingAnamnesis, setIsEditingAnamnesis] = useState(false);

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

  return (
    <div className="min-h-screen bg-background pl-64">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">Perfil do Paciente</h1>
            <p className="text-muted-foreground">Informações detalhadas e histórico médico</p>
          </div>
          <Link to={`/chat/${patient.id}`}>
            <Button className="medical-gradient text-white">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat com IA
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Patient Info */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={patient.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {patient.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{patient.name}</h3>
                    <p className="text-muted-foreground">{patient.condition}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{patient.age} anos, {patient.gender === 'M' ? 'Masculino' : 'Feminino'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{patient.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Última visita: {patient.lastVisit}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-sm font-medium mb-2">Tags:</p>
                  <div className="flex flex-wrap gap-1">
                    {patient.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
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
                  <CardTitle>Documentos</CardTitle>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {patient.documents.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhum documento anexado
                  </p>
                ) : (
                  <div className="space-y-2">
                    {patient.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span className="text-sm">{doc.name}</span>
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
          <div className="lg:col-span-2">
            <Card className="h-fit">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Prontuário / Anamnese</CardTitle>
                  <div className="flex gap-2">
                    {isEditingAnamnesis ? (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setIsEditingAnamnesis(false)}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleSaveAnamnesis}
                          className="medical-gradient text-white"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Salvar
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsEditingAnamnesis(true)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
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
                      rows={15}
                      className="w-full"
                      placeholder="Digite a anamnese do paciente..."
                    />
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        Usar Template
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Gerar com IA
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {anamnesis || 'Nenhuma anamnese registrada ainda.'}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Agendar Consulta</p>
                      <p className="text-sm text-muted-foreground">Nova consulta para este paciente</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Calendar className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Enviar WhatsApp</p>
                      <p className="text-sm text-muted-foreground">Lembrete ou orientação</p>
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
