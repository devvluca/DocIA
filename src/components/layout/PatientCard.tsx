import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Patient } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MessageSquare, FileText, MoreVertical, Edit, Trash2, Eye, EyeOff, Phone, Mail, Calendar } from 'lucide-react';

interface PatientCardProps {
  patient: Patient;
  onEdit?: () => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onEdit }) => {
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [isAnamnesisOpen, setIsAnamnesisOpen] = useState(false);

  const getAvatarColor = (patientId: string) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500', 
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500'
    ];
    const index = parseInt(patientId) % colors.length;
    return colors[index];
  };

  // Função para formatar a data da próxima consulta
  const formatNextAppointment = (dateString?: string) => {
    if (!dateString) return 'Sem consulta marcada';
    
    try {
      const [day, month, year] = dateString.split('/');
      const appointmentDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const today = new Date();
      
      // Remover horas para comparar apenas datas
      today.setHours(0, 0, 0, 0);
      appointmentDate.setHours(0, 0, 0, 0);
      
      const diffTime = appointmentDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return 'Hoje';
      } else if (diffDays === 1) {
        return 'Amanhã';
      } else if (diffDays > 0) {
        return `Em ${diffDays} dias (${dateString})`;
      } else {
        return `${Math.abs(diffDays)} dias atrás (${dateString})`;
      }
    } catch (error) {
      return dateString;
    }
  };

  const getNextAppointmentColor = (dateString?: string) => {
    if (!dateString) return 'text-muted-foreground';
    
    try {
      const [day, month, year] = dateString.split('/');
      const appointmentDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const today = new Date();
      
      today.setHours(0, 0, 0, 0);
      appointmentDate.setHours(0, 0, 0, 0);
      
      const diffTime = appointmentDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return 'text-blue-500 font-medium'; // Hoje - azul menos saturado
      } else if (diffDays === 1) {
        return 'text-green-500 font-medium'; // Amanhã - verde menos saturado
      } else if (diffDays > 0 && diffDays <= 7) {
        return 'text-orange-300'; // Esta semana - laranja muito menos saturado
      } else if (diffDays > 0) {
        return 'text-muted-foreground'; // Futuro distante
      } else {
        return 'text-red-500'; // Atrasado - vermelho menos saturado
      }
    } catch (error) {
      return 'text-muted-foreground';
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Tem certeza que deseja excluir ${patient.name}?`)) {
      console.log('Excluir paciente:', patient.id);
      // Implementar lógica de exclusão
    }
  };

  const handleViewContact = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowContactInfo(!showContactInfo);
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group hover:scale-105 relative">
      {/* Menu dropdown */}
      <div className="absolute top-3 right-3 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleViewContact}>
              {showContactInfo ? (
                <EyeOff className="w-4 h-4 mr-2" />
              ) : (
                <Eye className="w-4 h-4 mr-2" />
              )}
              {showContactInfo ? 'Ocultar Dados de Contato' : 'Ver Dados de Contato'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Editar Paciente
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir Paciente
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Link to={`/patients/${patient.id}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={patient.avatar} />
              <AvatarFallback className={`${patient.avatarColor || getAvatarColor(patient.id)} text-white`}>
                {patient.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {patient.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {patient.age} anos, {patient.gender === 'M' ? 'Masculino' : 'Feminino'}
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <div>
            <Badge variant="secondary" className="mb-2">{patient.condition}</Badge>
            <p className="text-sm text-muted-foreground">
              Última visita: {patient.lastVisit}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Calendar className="w-3 h-3 text-muted-foreground" />
              <p className={`text-xs ${getNextAppointmentColor(patient.nextAppointment)}`}>
                Próxima consulta: {formatNextAppointment(patient.nextAppointment)}
              </p>
            </div>
          </div>

          {/* Informações de contato (condicionalmente exibidas) */}
          {showContactInfo && (
            <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="break-all">{patient.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{patient.phone}</span>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-1">
            {patient.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Link>

      <CardContent className="pt-0">
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-accent" 
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <Link to={`/chat/${patient.id}`}>
              <MessageSquare className="w-4 h-4" />
            </Link>
          </Button>
          
          <Dialog open={isAnamnesisOpen} onOpenChange={setIsAnamnesisOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-accent" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsAnamnesisOpen(true);
                }}
              >
                <FileText className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Anamnese - {patient.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Idade</p>
                    <p className="text-base">{patient.age} anos</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Gênero</p>
                    <p className="text-base">{patient.gender === 'M' ? 'Masculino' : 'Feminino'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Condição Principal</p>
                    <p className="text-base">{patient.condition}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Última Visita</p>
                    <p className="text-base">{patient.lastVisit}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Histórico Clínico</h3>
                  <div className="p-4 border rounded-lg bg-background">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {patient.anamnesis || 'Nenhuma anamnese registrada para este paciente.'}
                    </p>
                  </div>
                </div>

                {patient.tags && patient.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {patient.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientCard;
