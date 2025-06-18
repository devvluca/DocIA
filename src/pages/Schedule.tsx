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

// Tipos de consulta com cores (similar ao WebDiet)
const appointmentTypes = {
  'Presencial': { color: 'bg-pink-500', border: 'border-pink-500', text: 'text-pink-700' },
  'Online': { color: 'bg-cyan-500', border: 'border-cyan-500', text: 'text-cyan-700' },
  'Primeira Consulta': { color: 'bg-green-500', border: 'border-green-500', text: 'text-green-700' },
  'Retorno': { color: 'bg-yellow-500', border: 'border-yellow-500', text: 'text-yellow-700' },
  'Em grupo': { color: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-700' },
  'Pacote': { color: 'bg-purple-300', border: 'border-purple-300', text: 'text-purple-700' },
  'Permuta': { color: 'bg-purple-600', border: 'border-purple-600', text: 'text-purple-700' },
  'Pessoal': { color: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-700' },
  'Antropometria': { color: 'bg-green-600', border: 'border-green-600', text: 'text-green-700' },
  'Amigo': { color: 'bg-red-500', border: 'border-red-500', text: 'text-red-700' },
  'Encaixe': { color: 'bg-orange-600', border: 'border-orange-600', text: 'text-orange-700' },
  'Teste': { color: 'bg-amber-800', border: 'border-amber-800', text: 'text-amber-700' },
};

// Status das consultas com cores de borda
const appointmentStatus = {
  'scheduled': { border: 'border-gray-300', text: 'A confirmar' },
  'confirmed': { border: 'border-cyan-400', text: 'Confirmado' },
  'cancelled': { border: 'border-red-300', text: 'Desmarcado' },
};

const Schedule = () => {
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
      case 'scheduled': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
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

  const sendWhatsAppReminder = (appointment: Appointment) => {
    alert(`Lembrete enviado para ${appointment.patientName} via WhatsApp!`);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

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

  // Função para sincronizar com Google Calendar
  const handleGoogleSync = () => {
    alert('Sincronização com Google Calendar iniciada!');
  };

  // Função para bloquear datas
  const handleBlockDates = () => {
    alert('Configurar bloqueio de datas');
  };

  // Função para configurar faixa de horário
  const handleTimeRange = () => {
    alert('Configurar faixa de horário de atendimento');
  };

  // Função para exportar calendário
  const handleExport = () => {
    alert('Exportando calendário...');
  };

  // Função para criar novo calendário
  const handleNewCalendar = () => {
    alert('Criar novo calendário');
  };

  const weekDays = ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.'];

  return (
    <div className="min-h-screen bg-background lg:pl-64 pt-16 lg:pt-0">
      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Agenda</h1>
            <p className="text-muted-foreground text-sm lg:text-base">Gerencie suas consultas e compromissos</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
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
                              <div className={`w-3 h-3 rounded ${appointmentTypes[type].color}`} />
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

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
          {/* Sidebar com Legendas */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Info className="w-5 h-5" />
                  Legendas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cor de fundo */}
                <div>
                  <h4 className="font-medium mb-3 text-sm">Tipos de consulta:</h4>
                  <div className="space-y-2">
                    {Object.entries(appointmentTypes).map(([type, config]) => (
                      <div key={type} className="flex items-center gap-2 text-sm">
                        <div className={`w-4 h-4 rounded ${config.color}`} />
                        <span>{type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Configurações */}
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

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-sm" onClick={handleGoogleSync}>
                  <Settings className="w-4 h-4 mr-2" />
                  Sincronizar Google
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Editar calendário
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm" onClick={handleBlockDates}>
                  <Lock className="w-4 h-4 mr-2" />
                  Bloquear datas
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm" onClick={handleTimeRange}>
                  <Clock className="w-4 h-4 mr-2" />
                  Faixa de horário
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm" onClick={handleExport}>
                  <Upload className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Calendário Principal */}
          <div className="xl:col-span-3">
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
                                const typeConfig = appointmentTypes[apt.type] || appointmentTypes['Presencial'];
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
                )}

                {viewMode === 'Semana' && (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="grid grid-cols-8 border-b">
                      <div className="p-3 bg-muted/50 border-r">
                        <span className="text-sm font-medium">Horário</span>
                      </div>
                      {weekDays.map((day, index) => (
                        <div key={day} className="p-3 bg-muted/50 border-r text-center">
                          <div className="text-sm font-medium">{day}</div>
                          <div className="text-xs text-muted-foreground">{15 + index}/12</div>
                        </div>
                      ))}
                    </div>
                    
                    {daySchedule.map((hour) => (
                      <div key={hour} className="grid grid-cols-8 border-b min-h-[60px]">
                        <div className="p-3 bg-muted/20 border-r text-sm text-muted-foreground">
                          {hour}
                        </div>
                        {Array.from({length: 7}).map((_, dayIndex) => (
                          <div key={dayIndex} className="border-r p-1 hover:bg-accent cursor-pointer">
                            {/* Consultas seriam renderizadas aqui baseadas no horário e dia */}
                          </div>
                        ))}
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
                                          <div className={`w-3 h-3 rounded ${appointmentTypes[type].color}`} />
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
                          const typeConfig = appointmentTypes[appointment.type] || appointmentTypes['Presencial'];
                          
                          return (
                            <div 
                              key={appointment.id} 
                              className={`p-4 rounded-lg border-l-4 ${typeConfig.color} bg-card hover:bg-accent/50 transition-colors cursor-pointer`}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-semibold text-lg">{appointment.time}</span>
                                  </div>
                                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${typeConfig.color} text-white`}>
                                    {appointment.type}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
