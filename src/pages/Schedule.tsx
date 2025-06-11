
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Plus, Clock, User, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { Appointment, Patient } from '@/types';
import { mockPatients } from '@/data/mockData';

const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Ana Silva',
    date: '2024-06-11',
    time: '09:00',
    type: 'Consulta',
    status: 'scheduled',
    notes: 'Consulta de rotina'
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Carlos Santos',
    date: '2024-06-11',
    time: '10:30',
    type: 'Retorno',
    status: 'scheduled'
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Maria Oliveira',
    date: '2024-06-12',
    time: '14:00',
    type: 'Primeira Consulta',
    status: 'scheduled'
  }
];

const Schedule = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patientId: '',
    date: '',
    time: '',
    type: '',
    notes: ''
  });

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
    setNewAppointment({ patientId: '', date: '', time: '', type: '', notes: '' });
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
    // Simulação de envio de lembrete
    alert(`Lembrete enviado para ${appointment.patientName} via WhatsApp!`);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const todayAppointments = appointments.filter(apt => 
    apt.date === currentDate.toISOString().split('T')[0]
  );

  return (
    <div className="ml-64 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Agenda</h1>
            <p className="text-muted-foreground mt-2">Gerencie suas consultas e compromissos</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nova Consulta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Agendar Nova Consulta</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="patient">Paciente</Label>
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
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Horário</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Tipo de Consulta</Label>
                  <Select onValueChange={(value) => setNewAppointment({...newAppointment, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Primeira Consulta">Primeira Consulta</SelectItem>
                      <SelectItem value="Consulta">Consulta de Rotina</SelectItem>
                      <SelectItem value="Retorno">Retorno</SelectItem>
                      <SelectItem value="Emergência">Emergência</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Input
                    id="notes"
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                    placeholder="Observações adicionais..."
                  />
                </div>
                <Button onClick={handleCreateAppointment} className="w-full">
                  Agendar Consulta
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Controles de Navegação */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-xl font-semibold">{formatDate(currentDate)}</h2>
            <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'day' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('day')}
            >
              Dia
            </Button>
            <Button 
              variant={viewMode === 'week' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('week')}
            >
              Semana
            </Button>
            <Button 
              variant={viewMode === 'month' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('month')}
            >
              Mês
            </Button>
          </div>
        </div>

        {/* Lista de Consultas do Dia */}
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Consultas de Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayAppointments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhuma consulta agendada para hoje
                </p>
              ) : (
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{appointment.time}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span>{appointment.patientName}</span>
                        </div>
                        
                        <Badge variant="secondary">
                          {appointment.type}
                        </Badge>
                        
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(appointment.status)}`} />
                          <span className="text-sm text-muted-foreground">
                            {getStatusText(appointment.status)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => sendWhatsAppReminder(appointment)}
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Lembrete
                        </Button>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Próximas Consultas */}
          <Card>
            <CardHeader>
              <CardTitle>Próximas Consultas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {appointments.filter(apt => new Date(apt.date) > currentDate).slice(0, 5).map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">
                        {new Date(appointment.date).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="text-sm">{appointment.time}</span>
                      <span className="text-sm">{appointment.patientName}</span>
                    </div>
                    <Badge variant="outline">{appointment.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
