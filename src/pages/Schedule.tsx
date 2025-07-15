import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Plus, Clock, User, ChevronLeft, ChevronRight, MessageSquare, Settings, Info, Lock, Upload, Download } from 'lucide-react';
import { Appointment } from '@/types';
import { mockPatients, mockAppointments } from '@/data/mockData';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';
import { useNavbar } from '@/contexts/NavbarContext';

const Schedule = () => {
  const { isCollapsed } = useNavbar();
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'Mês' | 'Semana' | 'Lista'>('Mês');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [showLegends, setShowLegends] = useState(true);
  const [newAppointment, setNewAppointment] = useState({
    patientId: '',
    date: '',
    time: '',
    type: 'Presencial',
    notes: ''
  });
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>(['principal']);

  // Estados para modais específicos
  const [editCalendarModal, setEditCalendarModal] = useState({
    isOpen: false,
    calendarName: 'Calendário Principal'
  });

  const [newCalendarModal, setNewCalendarModal] = useState({
    isOpen: false,
    calendarName: '',
    calendarColor: 'bg-blue-400'
  });

  const [blockDatesModal, setBlockDatesModal] = useState({
    isOpen: false,
    startDate: '',
    endDate: '',
    reason: 'Férias'
  });

  const [timeRangeModal, setTimeRangeModal] = useState({
    isOpen: false,
    startTime: '08:00',
    endTime: '18:00'
  });

  // Array dos dias da semana
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Estados para modais
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'info' as 'success' | 'warning' | 'info' | 'error',
    title: '',
    description: '',
    onConfirm: () => {}
  });

  // Gerar horários do dia (similar ao WebDiet)
  const generateDaySchedule = () => {
    const hours = [];
    for (let i = 8; i <= 22; i++) {
      hours.push(`${i.toString().padStart(2, '0')}:00`);
    }
    return hours;
  };

  const daySchedule = generateDaySchedule();

  // Gerar calendário do mês atual
  const generateCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    const endDate = new Date(lastDay);
    
    // Ajustar para começar na segunda-feira da semana
    startDate.setDate(startDate.getDate() - (startDate.getDay() === 0 ? 6 : startDate.getDay() - 1));
    
    // Ajustar para terminar no domingo da semana
    endDate.setDate(endDate.getDate() + (7 - endDate.getDay()));
    
    const days = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = useMemo(() => generateCalendar(currentDate), [currentDate]);

  // Obter consultas por data
  const getAppointmentsByDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  };

  // Obter consultas do dia selecionado
  const selectedDayAppointments = useMemo(() => {
    return getAppointmentsByDate(selectedDate).sort((a, b) => a.time.localeCompare(b.time));
  }, [selectedDate, appointments]);

  const handleCreateAppointment = () => {
    const patient = mockPatients.find(p => p.id === newAppointment.patientId);
    if (!patient) return;

    const appointment: Appointment = {
      id: Date.now().toString(),
      patientId: newAppointment.patientId,
      patientName: patient.name,
      date: newAppointment.date,
      time: newAppointment.time,
      type: newAppointment.type,
      status: 'scheduled',
      notes: newAppointment.notes
    };

    setAppointments([...appointments, appointment]);
    setNewAppointment({ patientId: '', date: '', time: '', type: 'Presencial', notes: '' });
    setIsCreateDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-400';
      case 'completed': return 'bg-emerald-400';
      case 'cancelled': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Agendada';
      case 'completed': return 'Concluída';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  // Função para sincronizar com Google Calendar
  const handleGoogleSync = () => {
    setModalState({
      isOpen: true,
      type: 'info',
      title: 'Sincronização com Google Calendar',
      description: 'Deseja sincronizar sua agenda com o Google Calendar? Isso permitirá que suas consultas apareçam em ambos os calendários.',
      onConfirm: () => {
        // Simular sincronização
        setTimeout(() => {
          setModalState({
            isOpen: true,
            type: 'success',
            title: 'Sincronização Concluída',
            description: 'Sua agenda foi sincronizada com sucesso com o Google Calendar!',
            onConfirm: () => {}
          });
        }, 100);
      }
    });
  };

  // Função para editar calendário
  const handleEditCalendar = () => {
    setEditCalendarModal({ ...editCalendarModal, isOpen: true });
  };

  const confirmEditCalendar = () => {
    setModalState({
      isOpen: true,
      type: 'success',
      title: 'Calendário Atualizado',
      description: `Calendário renomeado para: ${editCalendarModal.calendarName}`,
      onConfirm: () => {}
    });
    setEditCalendarModal({ ...editCalendarModal, isOpen: false });
  };

  // Função para criar novo calendário
  const handleNewCalendar = () => {
    setNewCalendarModal({ ...newCalendarModal, isOpen: true });
  };

  const confirmNewCalendar = () => {
    if (newCalendarModal.calendarName.trim()) {
      setModalState({
        isOpen: true,
        type: 'success',
        title: 'Novo Calendário Criado',
        description: `Calendário "${newCalendarModal.calendarName}" foi criado com sucesso!`,
        onConfirm: () => {}
      });
      setNewCalendarModal({ isOpen: false, calendarName: '', calendarColor: 'bg-blue-400' });
    }
  };

  // Função para bloquear datas
  const handleBlockDates = () => {
    setBlockDatesModal({ ...blockDatesModal, isOpen: true });
  };

  const confirmBlockDates = () => {
    if (blockDatesModal.startDate && blockDatesModal.endDate && blockDatesModal.reason) {
      setModalState({
        isOpen: true,
        type: 'success',
        title: 'Período Bloqueado',
        description: `Período de ${new Date(blockDatesModal.startDate).toLocaleDateString('pt-BR')} até ${new Date(blockDatesModal.endDate).toLocaleDateString('pt-BR')} foi bloqueado com sucesso.\nMotivo: ${blockDatesModal.reason}`,
        onConfirm: () => {}
      });
      setBlockDatesModal({ ...blockDatesModal, isOpen: false });
    }
  };

  // Função para configurar horário de funcionamento
  const handleTimeRange = () => {
    setTimeRangeModal({ ...timeRangeModal, isOpen: true });
  };

  const confirmTimeRange = () => {
    if (timeRangeModal.startTime && timeRangeModal.endTime) {
      setModalState({
        isOpen: true,
        type: 'success',
        title: 'Horário Atualizado',
        description: `Horário de funcionamento configurado: ${timeRangeModal.startTime} às ${timeRangeModal.endTime}`,
        onConfirm: () => {}
      });
      setTimeRangeModal({ ...timeRangeModal, isOpen: false });
    }
  };

  const sendWhatsAppReminder = (appointment: Appointment) => {
    setModalState({
      isOpen: true,
      type: 'success',
      title: 'Lembrete Enviado',
      description: `Lembrete enviado para ${appointment.patientName} via WhatsApp com sucesso!`,
      onConfirm: () => {}
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    if (viewMode === 'Semana') {
      // Navegar por semanas
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      // Navegar por meses
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    
    setCurrentDate(newDate);
  };

  // Função para gerar a semana atual
  const generateWeek = (date: Date) => {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const currentWeek = useMemo(() => generateWeek(currentDate), [currentDate]);

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelectedDate = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const formatDateHeader = (date: Date) => {
    if (viewMode === 'Semana') {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      if (weekStart.getMonth() === weekEnd.getMonth()) {
        return `${weekStart.getDate()}-${weekEnd.getDate()} de ${weekEnd.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`;
      } else {
        return `${weekStart.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} - ${weekEnd.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
      }
    }
    
    return date.toLocaleDateString('pt-BR', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatSelectedDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: 'numeric',
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Função para carregar perfil do usuário
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
      avatarColor: 'bg-blue-400'
    };
  };

  const [userProfile] = useState(loadUserProfile);

  // Tipos de consulta adaptados por especialidade
  const getAppointmentTypesBySpecialty = (specialty: string) => {
    const medicalSpecialties = [
      'Clínico Geral', 'Cardiologia', 'Neurologia', 'Pediatria', 
      'Ginecologia e Obstetrícia', 'Ortopedia', 'Dermatologia', 
      'Psiquiatria', 'Endocrinologia', 'Gastroenterologia', 
      'Pneumologia', 'Urologia', 'Oftalmologia', 'Otorrinolaringologia', 
      'Radiologia', 'Anestesiologia', 'Cirurgia Geral', 'Medicina Interna', 
      'Medicina de Família', 'Oncologia', 'Reumatologia'
    ];

    // Tipos comuns para todas as especialidades
    const commonTypes = {
      'Primeira Consulta': { color: 'bg-indigo-500', border: 'border-indigo-500', text: 'text-indigo-700' },
      'Retorno': { color: 'bg-blue-400', border: 'border-blue-400', text: 'text-blue-600' },
      'Urgência': { color: 'bg-red-400', border: 'border-red-400', text: 'text-red-600' },
      'Telemedicina': { color: 'bg-indigo-400', border: 'border-indigo-400', text: 'text-indigo-600' },
    };

    if (medicalSpecialties.includes(specialty)) {
      return {
        ...commonTypes,
        'Exame Clínico': { color: 'bg-amber-400', border: 'border-amber-400', text: 'text-amber-600' },
        'Procedimento': { color: 'bg-emerald-400', border: 'border-emerald-400', text: 'text-emerald-600' },
      };
    }

    switch (specialty) {
      case 'Nutricionista':
        return {
          ...commonTypes,
          'Avaliação Nutricional': { color: 'bg-amber-400', border: 'border-amber-400', text: 'text-amber-600' },
          'Orientação Dietética': { color: 'bg-lime-400', border: 'border-lime-400', text: 'text-lime-600' },
          'Acompanhamento': { color: 'bg-teal-400', border: 'border-teal-400', text: 'text-teal-600' },
        };

      case 'Fisioterapeuta':
        return {
          ...commonTypes,
          'Avaliação Fisioterapêutica': { color: 'bg-amber-400', border: 'border-amber-400', text: 'text-amber-600' },
          'Sessão de Fisioterapia': { color: 'bg-emerald-400', border: 'border-emerald-400', text: 'text-emerald-600' },
          'Reavaliação': { color: 'bg-teal-400', border: 'border-teal-400', text: 'text-teal-600' },
        };

      case 'Psicólogo':
        return {
          ...commonTypes,
          'Avaliação Psicológica': { color: 'bg-amber-400', border: 'border-amber-400', text: 'text-amber-600' },
          'Psicoterapia': { color: 'bg-violet-400', border: 'border-violet-400', text: 'text-violet-600' },
          'Terapia de Grupo': { color: 'bg-teal-400', border: 'border-teal-400', text: 'text-teal-600' },
        };

      case 'Cirurgião Dentista':
        return {
          ...commonTypes,
          'Avaliação Odontológica': { color: 'bg-amber-400', border: 'border-amber-400', text: 'text-amber-600' },
          'Procedimento Cirúrgico': { color: 'bg-rose-400', border: 'border-rose-400', text: 'text-rose-600' },
          'Limpeza': { color: 'bg-cyan-400', border: 'border-cyan-400', text: 'text-cyan-600' },
        };

      case 'Enfermeiro':
        return {
          ...commonTypes,
          'Consulta de Enfermagem': { color: 'bg-amber-400', border: 'border-amber-400', text: 'text-amber-600' },
          'Procedimento': { color: 'bg-emerald-400', border: 'border-emerald-400', text: 'text-emerald-600' },
          'Acompanhamento': { color: 'bg-teal-400', border: 'border-teal-400', text: 'text-teal-600' },
        };

      case 'Farmacêutico':
        return {
          ...commonTypes,
          'Atenção Farmacêutica': { color: 'bg-amber-400', border: 'border-amber-400', text: 'text-amber-600' },
          'Orientação Medicamentosa': { color: 'bg-lime-400', border: 'border-lime-400', text: 'text-lime-600' },
          'Seguimento Farmacoterapêutico': { color: 'bg-teal-400', border: 'border-teal-400', text: 'text-teal-600' },
        };

      case 'Fonoaudiólogo':
        return {
          ...commonTypes,
          'Avaliação Fonoaudiológica': { color: 'bg-amber-400', border: 'border-amber-400', text: 'text-amber-600' },
          'Terapia Fonoaudiológica': { color: 'bg-violet-400', border: 'border-violet-400', text: 'text-violet-600' },
          'Audiometria': { color: 'bg-teal-400', border: 'border-teal-400', text: 'text-teal-600' },
        };

      case 'Terapeuta Ocupacional':
        return {
          ...commonTypes,
          'Avaliação TO': { color: 'bg-amber-400', border: 'border-amber-400', text: 'text-amber-600' },
          'Terapia Ocupacional': { color: 'bg-emerald-400', border: 'border-emerald-400', text: 'text-emerald-600' },
          'Adaptação': { color: 'bg-teal-400', border: 'border-teal-400', text: 'text-teal-600' },
        };

      case 'Biomédico':
        return {
          ...commonTypes,
          'Análise Clínica': { color: 'bg-amber-400', border: 'border-amber-400', text: 'text-amber-600' },
          'Coleta de Exames': { color: 'bg-sky-400', border: 'border-sky-400', text: 'text-sky-600' },
          'Interpretação de Resultados': { color: 'bg-teal-400', border: 'border-teal-400', text: 'text-teal-600' },
        };

      case 'Veterinário':
        return {
          ...commonTypes,
          'Consulta Veterinária': { color: 'bg-amber-400', border: 'border-amber-400', text: 'text-amber-600' },
          'Cirurgia Veterinária': { color: 'bg-rose-400', border: 'border-rose-400', text: 'text-rose-600' },
          'Vacinação': { color: 'bg-emerald-400', border: 'border-emerald-400', text: 'text-emerald-600' },
        };

      default:
        return {
          ...commonTypes,
          'Consulta Especializada': { color: 'bg-amber-400', border: 'border-amber-400', text: 'text-amber-600' },
          'Procedimento': { color: 'bg-emerald-400', border: 'border-emerald-400', text: 'text-emerald-600' },
        };
    }
  };

  const appointmentTypes = getAppointmentTypesBySpecialty(userProfile.specialty);

  // Status configurations for appointments
  const appointmentStatus = {
    'scheduled': { 
      text: 'Agendada', 
      color: 'bg-blue-400', 
      border: 'border-blue-400' 
    },
    'completed': { 
      text: 'Concluída', 
      color: 'bg-emerald-400', 
      border: 'border-emerald-400' 
    },
    'cancelled': { 
      text: 'Cancelada', 
      color: 'bg-red-400', 
      border: 'border-red-400' 
    },
    'confirmed': { 
      text: 'Confirmada', 
      color: 'bg-green-400', 
      border: 'border-green-400' 
    },
    'no-show': { 
      text: 'Não compareceu', 
      color: 'bg-gray-400', 
      border: 'border-gray-400' 
    }
  };

  const handleExport = () => {
    setModalState({
      isOpen: true,
      type: 'info',
      title: 'Exportar Calendário',
      description: 'Escolha o formato de exportação do seu calendário:',
      onConfirm: () => {
        try {
          // Create calendar data in ICS format
          const calendarData = appointments.map(apt => {
            const patient = mockPatients.find(p => p.id === apt.patientId);
            const startDateTime = new Date(`${apt.date}T${apt.time}`);
            const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour duration
            
            return [
              'BEGIN:VEVENT',
              `DTSTART:${startDateTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
              `DTEND:${endDateTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
              `SUMMARY:${apt.type} - ${apt.patientName}`,
              `DESCRIPTION:Paciente: ${apt.patientName}\\nTipo: ${apt.type}\\nStatus: ${getStatusText(apt.status)}${apt.notes ? `\\nObservações: ${apt.notes}` : ''}`,
              `UID:${apt.id}@docia.app`,
              'END:VEVENT'
            ].join('\n');
          }).join('\n');

          const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//DocIA//Agenda//PT',
            'CALSCALE:GREGORIAN',
            calendarData,
            'END:VCALENDAR'
          ].join('\n');

          // Create download
          const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `agenda_${userProfile.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.ics`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          setModalState({
            isOpen: true,
            type: 'success',
            title: 'Exportação Concluída',
            description: 'Seu calendário foi exportado com sucesso! O arquivo pode ser importado no Google Calendar, Outlook ou outros aplicativos de calendário.',
            onConfirm: () => {}
          });
        } catch (error) {
          setModalState({
            isOpen: true,
            type: 'error',
            title: 'Erro na Exportação',
            description: 'Ocorreu um erro ao exportar o calendário. Tente novamente.',
            onConfirm: () => {}
          });
        }
      }
    });
  };
  return (
    <div className={`min-h-screen bg-background pt-16 lg:pt-2 transition-all duration-300 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Agenda</h1>
            <p className="text-muted-foreground text-sm lg:text-base">Gerencie suas consultas e compromissos</p>
          </div>
          
          <div className="flex gap-2">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="medical-gradient text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Consulta
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xs sm:max-w-md mx-4 sm:mx-0">
                <DialogHeader>
                  <DialogTitle>Agendar Nova Consulta</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="patient" className="text-sm">Paciente</Label>
                    <Select onValueChange={(value) => setNewAppointment({...newAppointment, patientId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o paciente" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockPatients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="date" className="text-sm">Data</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newAppointment.date}
                      onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time" className="text-sm">Horário</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newAppointment.time}
                      onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="type" className="text-sm">Tipo de Consulta</Label>
                    <Select value={newAppointment.type} onValueChange={(value) => setNewAppointment({...newAppointment, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(appointmentTypes).map((type) => (
                          <SelectItem key={type} value={type}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded ${(appointmentTypes[type] || { color: 'bg-gray-400' }).color}`} />
                              {type}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="notes" className="text-sm">Observações</Label>
                    <Input
                      id="notes"
                      value={newAppointment.notes}
                      onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                      placeholder="Observações adicionais..."
                    />
                  </div>
                  <Button onClick={handleCreateAppointment} className="w-full medical-gradient text-white">
                    Agendar Consulta
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="space-y-4 lg:space-y-6">
          {/* Calendário Principal */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        const today = new Date();
                        setCurrentDate(today);
                        setSelectedDate(today);
                      }}
                    >
                      Hoje
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <h2 className="text-lg font-semibold">{formatDateHeader(currentDate)}</h2>
                </div>
                
                <div className="flex gap-2">
                  {['Mês', 'Semana', 'Lista'].map((mode) => (
                    <Button 
                      key={mode}
                      variant={viewMode === mode ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setViewMode(mode as any)}
                      className="text-xs lg:text-sm"
                    >
                      {mode}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {viewMode === 'Mês' && (
                <div>
                  {/* Cabeçalho dos dias da semana */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekDays.map((day, index) => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                        <div>{day}</div>
                        <div className="text-xs">{15 + index}/12</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Grid do calendário */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => {
                      const dayAppointments = getAppointmentsByDate(day);
                      const isCurrentMonthDay = isCurrentMonth(day);
                      const isTodayDay = isToday(day);
                      const isSelected = isSelectedDate(day);
                      
                      return (
                        <div
                          key={index}
                          onClick={() => setSelectedDate(day)}
                          className={`
                            min-h-[100px] lg:min-h-[120px] p-1 lg:p-2 border rounded-lg cursor-pointer transition-all hover:bg-accent
                            ${!isCurrentMonthDay ? 'bg-muted/30' : 'bg-card'}
                            ${isTodayDay ? 'bg-primary/5 border-primary' : ''}
                            ${isSelected ? 'ring-2 ring-primary' : ''}
                          `}
                        >
                          <div className="text-sm font-medium mb-1 text-center">
                            {day.getDate()}
                          </div>
                          <div className="space-y-1">
                            {dayAppointments.slice(0, 3).map((apt, i) => {
                              const typeConfig = appointmentTypes[apt.type] || appointmentTypes['Primeira Consulta'] || { color: 'bg-slate-400', border: 'border-slate-400', text: 'text-slate-600' };
                              const statusConfig = appointmentStatus[apt.status] || appointmentStatus['scheduled'];
                              
                              return (
                                <div
                                  key={i}
                                  className={`text-[10px] lg:text-xs p-1 rounded border-l-2 ${typeConfig.color} ${statusConfig.border} text-white truncate`}
                                >
                                  <div className="font-medium">{apt.time}</div>
                                  <div className="truncate">{apt.patientName.split(' ')[0]}</div>
                                </div>
                              );
                            })}
                            {dayAppointments.length > 3 && (
                              <div className="text-[10px] text-center text-muted-foreground">
                                +{dayAppointments.length - 3} mais
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}                {viewMode === 'Semana' && (
                <div className="border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-8 border-b">
                    <div className="p-3 bg-muted/50 border-r">
                      <span className="text-sm font-medium">Horário</span>
                    </div>
                    {currentWeek.map((dayDate, index) => {
                      const isTodayWeek = isToday(dayDate);
                      
                      return (
                        <div 
                          key={index} 
                          className={`p-3 border-r text-center transition-colors ${
                            isTodayWeek 
                              ? 'bg-primary/20 border-primary' 
                              : 'bg-muted/50'
                          }`}
                        >
                          <div className={`text-sm font-medium ${isTodayWeek ? 'text-primary font-bold' : ''}`}>
                            {weekDays[dayDate.getDay()]}
                          </div>
                          <div className={`text-xs ${isTodayWeek ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                            {dayDate.getDate()}/{dayDate.getMonth() + 1}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {daySchedule.map((hour) => (
                    <div key={hour} className="grid grid-cols-8 border-b min-h-[60px]">
                      <div className="p-3 bg-muted/20 border-r text-sm text-muted-foreground">
                        {hour}
                      </div>
                      {currentWeek.map((dayDate, dayIndex) => {
                        const dayDateStr = dayDate.toISOString().split('T')[0];
                        
                        // Encontrar consultas para este dia e horário
                        const dayAppointments = getAppointmentsByDate(dayDate);
                        const hourAppointments = dayAppointments.filter(apt => 
                          apt.time.split(':')[0] === hour.split(':')[0]
                        );
                        
                        return (
                          <div key={dayIndex} className="border-r p-1 hover:bg-accent cursor-pointer relative">
                            {hourAppointments.map((appointment) => (
                              <div
                                key={appointment.id}
                                className="text-xs p-1 mb-1 rounded bg-primary/20 border-l-2 border-primary truncate"
                                title={`${appointment.time} - ${appointment.patientName} (${appointment.type})`}
                              >
                                <div className="font-medium truncate">{appointment.patientName}</div>
                                <div className="text-muted-foreground truncate">{appointment.type}</div>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}

              {viewMode === 'Lista' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {formatSelectedDate(selectedDate)}
                    </h3>
                    <Badge variant="outline">
                      {selectedDayAppointments.length} consulta{selectedDayAppointments.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  
                  {selectedDayAppointments.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h4 className="text-lg font-medium mb-2">Nenhuma consulta agendada</h4>
                      <p className="text-muted-foreground mb-4">
                        Não há consultas marcadas para {formatSelectedDate(selectedDate)}
                      </p>
                      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="medical-gradient text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Agendar Consulta
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xs sm:max-w-md mx-4 sm:mx-0">
                          <DialogHeader>
                            <DialogTitle>Agendar Nova Consulta</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="patient" className="text-sm">Paciente</Label>
                              <Select onValueChange={(value) => setNewAppointment({...newAppointment, patientId: value})}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o paciente" />
                                </SelectTrigger>
                                <SelectContent>
                                  {mockPatients.map((patient) => (
                                    <SelectItem key={patient.id} value={patient.id}>
                                      {patient.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="date" className="text-sm">Data</Label>
                              <Input
                                id="date"
                                type="date"
                                value={newAppointment.date}
                                onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="time" className="text-sm">Horário</Label>
                              <Input
                                id="time"
                                type="time"
                                value={newAppointment.time}
                                onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="type" className="text-sm">Tipo de Consulta</Label>
                              <Select value={newAppointment.type} onValueChange={(value) => setNewAppointment({...newAppointment, type: value})}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.keys(appointmentTypes).map((type) => (
                                    <SelectItem key={type} value={type}>
                                      <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded ${(appointmentTypes[type] || { color: 'bg-gray-400' }).color}`} />
                                        {type}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="notes" className="text-sm">Observações</Label>
                              <Input
                                id="notes"
                                value={newAppointment.notes}
                                onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                                placeholder="Observações adicionais..."
                              />
                            </div>
                            <Button onClick={handleCreateAppointment} className="w-full medical-gradient text-white">
                              Agendar Consulta
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedDayAppointments.map((appointment, index) => {
                        const typeConfig = appointmentTypes[appointment.type] || appointmentTypes['Primeira Consulta'] || { color: 'bg-slate-400', border: 'border-slate-400', text: 'text-slate-600' };
                        
                        return (
                          <div 
                            key={appointment.id} 
                            className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-semibold text-lg">{appointment.time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${typeConfig.color}`} />
                                  <span className="text-sm font-medium text-muted-foreground">
                                    {appointment.type}
                                  </span>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {appointmentStatus[appointment.status]?.text || 'A confirmar'}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-2 mb-3">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium text-base">{appointment.patientName}</span>
                            </div>
                            
                            {appointment.notes && (
                              <div className="mb-3 p-3 bg-muted/50 rounded-lg">
                                <p className="text-sm text-muted-foreground">
                                  <strong>Observações:</strong> {appointment.notes}
                                </p>
                              </div>
                            )}
                            
                            <div className="flex gap-2 pt-2 border-t">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => sendWhatsAppReminder(appointment)}
                                className="text-xs"
                              >
                                <MessageSquare className="w-3 h-3 mr-1" />
                                Lembrete
                              </Button>
                              <Button variant="outline" size="sm" className="text-xs">
                                <Settings className="w-3 h-3 mr-1" />
                                Editar
                              </Button>
                              <Button variant="outline" size="sm" className="text-xs">
                                <Download className="w-3 h-3 mr-1" />
                                Detalhes
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Resumo do dia */}
                      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                        <h4 className="font-medium mb-2">Resumo do dia</h4>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Total:</span>
                            <span className="ml-2 font-medium">{selectedDayAppointments.length} consultas</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Primeira:</span>
                            <span className="ml-2 font-medium">{selectedDayAppointments[0]?.time || '-'}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Última:</span>
                            <span className="ml-2 font-medium">{selectedDayAppointments[selectedDayAppointments.length - 1]?.time || '-'}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Tipos:</span>
                            <span className="ml-2 font-medium">
                              {Array.from(new Set(selectedDayAppointments.map(apt => apt.type))).length} diferentes
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cards em baixo */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {/* Legendas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Info className="w-5 h-5" />
                  Tipos de {userProfile.specialty === 'Médico' || ['Clínico Geral', 'Cardiologia', 'Neurologia', 'Pediatria', 'Ginecologia e Obstetrícia', 'Ortopedia', 'Dermatologia', 'Psiquiatria', 'Endocrinologia', 'Gastroenterologia', 'Pneumologia', 'Urologia', 'Oftalmologia', 'Otorrinolaringologia', 'Radiologia', 'Anestesiologia', 'Cirurgia Geral', 'Medicina Interna', 'Medicina de Família', 'Oncologia', 'Reumatologia'].includes(userProfile.specialty) ? 'Consulta' : 'Atendimento'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {Object.entries(appointmentTypes).map(([type, config]) => (
                    <div key={type} className="flex items-center gap-2 text-sm">
                      <div className={`w-4 h-4 rounded ${config.color}`} />
                      <span>{type}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Meus calendários */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Meus calendários</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">Visão geral</span>
                </div>
                <Button className="w-full medical-gradient text-white justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Calendário Principal
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm" onClick={handleNewCalendar}>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo calendário
                </Button>
              </CardContent>
            </Card>

            {/* Ações Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-sm" onClick={handleGoogleSync}>
                  <Settings className="w-4 h-4 mr-2" />
                  Sincronizar Google
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm" onClick={handleEditCalendar}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Editar calendário
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm" onClick={handleBlockDates}>
                  <Lock className="w-4 h-4 mr-2" />
                  Bloquear período
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm" onClick={handleTimeRange}>
                  <Clock className="w-4 h-4 mr-2" />
                  Horário de funcionamento
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Exportar calendário
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação */}
      <ConfirmationDialog
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        onConfirm={modalState.onConfirm}
        title={modalState.title}
        description={modalState.description}
        type={modalState.type}
        showCancel={modalState.type === 'info'}
        confirmText={modalState.type === 'info' ? 'Confirmar' : 'OK'}
      />

      {/* Modal para Editar Calendário */}
      <Dialog open={editCalendarModal.isOpen} onOpenChange={(open) => setEditCalendarModal({ ...editCalendarModal, isOpen: open })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-500" />
              Editar Calendário
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="calendar-name">Nome do Calendário</Label>
              <Input
                id="calendar-name"
                value={editCalendarModal.calendarName}
                onChange={(e) => setEditCalendarModal({ ...editCalendarModal, calendarName: e.target.value })}
                placeholder="Digite o nome do calendário"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setEditCalendarModal({ ...editCalendarModal, isOpen: false })}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              onClick={confirmEditCalendar}
              disabled={!editCalendarModal.calendarName.trim()}
              className="flex-1"
            >
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Bloquear Período */}
      <Dialog open={blockDatesModal.isOpen} onOpenChange={(open) => setBlockDatesModal({ ...blockDatesModal, isOpen: open })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-red-500" />
              Bloquear Período
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="start-date">Data de Início</Label>
              <Input
                id="start-date"
                type="date"
                value={blockDatesModal.startDate}
                onChange={(e) => setBlockDatesModal({ ...blockDatesModal, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="end-date">Data de Fim</Label>
              <Input
                id="end-date"
                type="date"
                value={blockDatesModal.endDate}
                onChange={(e) => setBlockDatesModal({ ...blockDatesModal, endDate: e.target.value })}
                min={blockDatesModal.startDate}
              />
            </div>
            <div>
              <Label htmlFor="reason">Motivo do Bloqueio</Label>
              <Select value={blockDatesModal.reason} onValueChange={(value) => setBlockDatesModal({ ...blockDatesModal, reason: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Férias">Férias</SelectItem>
                  <SelectItem value="Viagem">Viagem</SelectItem>
                  <SelectItem value="Congresso">Congresso</SelectItem>
                  <SelectItem value="Licença Médica">Licença Médica</SelectItem>
                  <SelectItem value="Feriado">Feriado</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setBlockDatesModal({ ...blockDatesModal, isOpen: false })}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              onClick={confirmBlockDates}
              disabled={!blockDatesModal.startDate || !blockDatesModal.endDate || !blockDatesModal.reason}
              className="flex-1"
            >
              Bloquear
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Horário de Funcionamento */}
      <Dialog open={timeRangeModal.isOpen} onOpenChange={(open) => setTimeRangeModal({ ...timeRangeModal, isOpen: open })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-green-500" />
              Horário de Funcionamento
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="start-time">Horário de Início</Label>
              <Input
                id="start-time"
                type="time"
                value={timeRangeModal.startTime}
                onChange={(e) => setTimeRangeModal({ ...timeRangeModal, startTime: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="end-time">Horário de Fim</Label>
              <Input
                id="end-time"
                type="time"
                value={timeRangeModal.endTime}
                onChange={(e) => setTimeRangeModal({ ...timeRangeModal, endTime: e.target.value })}
                min={timeRangeModal.startTime}
              />
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Dica:</strong> Este horário será usado para definir os slots disponíveis para agendamento de consultas.
              </p>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setTimeRangeModal({ ...timeRangeModal, isOpen: false })}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              onClick={confirmTimeRange}
              disabled={!timeRangeModal.startTime || !timeRangeModal.endTime}
              className="flex-1"
            >
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Novo Calendário */}
      <Dialog open={newCalendarModal.isOpen} onOpenChange={(open) => setNewCalendarModal({ ...newCalendarModal, isOpen: open })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Plus className="w-5 h-5 text-green-500" />
              Criar Novo Calendário
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-calendar-name">Nome do Calendário</Label>
              <Input
                id="new-calendar-name"
                value={newCalendarModal.calendarName}
                onChange={(e) => setNewCalendarModal({ ...newCalendarModal, calendarName: e.target.value })}
                placeholder="Ex: Consultório Particular, Hospital, etc."
              />
            </div>
            <div>
              <Label htmlFor="calendar-color">Cor do Calendário</Label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {[
                  'bg-blue-400', 'bg-emerald-400', 'bg-red-400', 
                  'bg-amber-400', 'bg-violet-400', 'bg-pink-400',
                  'bg-indigo-400', 'bg-teal-400', 'bg-orange-400',
                  'bg-cyan-400', 'bg-lime-400', 'bg-rose-400'
                ].map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full ${color} hover:scale-110 transition-transform ${
                      newCalendarModal.calendarColor === color
                        ? 'ring-2 ring-offset-2 ring-primary' 
                        : ''
                    }`}
                    onClick={() => setNewCalendarModal({ ...newCalendarModal, calendarColor: color })}
                  />
                ))}
              </div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Dica:</strong> Você pode criar calendários separados para diferentes locais de atendimento.
              </p>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setNewCalendarModal({ isOpen: false, calendarName: '', calendarColor: 'bg-blue-400' })}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              onClick={confirmNewCalendar}
              disabled={!newCalendarModal.calendarName.trim()}
              className="flex-1"
            >
              Criar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Schedule;
