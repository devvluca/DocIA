import React, { useState } from 'react';
import { Plus, Search, TrendingUp, Users, Calendar, Activity, Filter, Eye, MessageSquare, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavbar } from '@/contexts/NavbarContext';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import PatientCard from '@/components/layout/PatientCard';
import { usePatientData } from '@/hooks/usePatientData';
import { useTheme } from '@/hooks/useTheme';
import { Patient } from '@/types';
import { Link } from 'react-router-dom';
import AddPatientDialog from '@/components/dialogs/AddPatientDialog';

const Dashboard = () => {
  const { isCollapsed } = useNavbar();
  const { theme } = useTheme();
  const { 
    patients, 
    setPatients, 
    getTodayAppointments, 
    getUpcomingAppointments,
    stats 
  } = usePatientData();
  
  // Debug para verificar se o estado está mudando
  console.log('Dashboard - isCollapsed:', isCollapsed);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCondition, setFilterCondition] = useState('all');
  const [filterGender, setFilterGender] = useState('all');
  const [filterAge, setFilterAge] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');

  // Usar as funções do hook para obter as consultas
  const todayAppointments = getTodayAppointments();
  const upcomingAppointments = todayAppointments.length > 0 
    ? todayAppointments 
    : getUpcomingAppointments(3);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCondition = filterCondition === 'all' || patient.condition === filterCondition;
    const matchesGender = filterGender === 'all' || patient.gender === filterGender;
    
    let matchesAge = true;
    if (filterAge !== 'all') {
      const age = patient.age;
      switch (filterAge) {
        case 'young':
          matchesAge = age < 30;
          break;
        case 'adult':
          matchesAge = age >= 30 && age < 60;
          break;
        case 'senior':
          matchesAge = age >= 60;
          break;
        default:
          matchesAge = true;
      }
    }
    
    return matchesSearch && matchesCondition && matchesGender && matchesAge;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'age':
        return a.age - b.age;
      case 'lastVisit-newest':
        return new Date(b.lastVisit.split('/').reverse().join('-')).getTime() - 
               new Date(a.lastVisit.split('/').reverse().join('-')).getTime();
      case 'lastVisit-oldest':
        return new Date(a.lastVisit.split('/').reverse().join('-')).getTime() - 
               new Date(b.lastVisit.split('/').reverse().join('-')).getTime();
      case 'condition':
        return a.condition.localeCompare(b.condition);
      default:
        return 0;
    }
  });

  const uniqueConditions = Array.from(new Set(patients.map(p => p.condition)));

  const handleAddPatient = (newPatient: Omit<Patient, 'id' | 'createdAt'>) => {
    const patient: Patient = {
      ...newPatient,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setPatients([...patients, patient]);
    setIsAddPatientOpen(false);
    setDialogMode('add');
    setEditingPatient(null);
  };

  const handleEditPatient = (patientId: string, updatedPatient: Omit<Patient, 'id' | 'createdAt'>) => {
    setPatients(prevPatients => 
      prevPatients.map(patient => 
        patient.id === patientId 
          ? { ...updatedPatient, id: patientId, createdAt: patient.createdAt }
          : patient
      )
    );
    setIsAddPatientOpen(false);
    setDialogMode('add');
    setEditingPatient(null);
  };

  const openEditDialog = (patient: Patient) => {
    setEditingPatient(patient);
    setDialogMode('edit');
    setIsAddPatientOpen(true);
  };

  const openAddDialog = () => {
    setEditingPatient(null);
    setDialogMode('add');
    setIsAddPatientOpen(true);
  };

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
      avatarColor: 'bg-blue-500'
    };
  };

  const [userProfile] = useState(loadUserProfile);

  // Função para gerar iniciais ignorando "Dr."
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(word => word.toLowerCase() !== 'dr.' && word.toLowerCase() !== 'dr')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };
  return (
    <div className={`min-h-screen bg-background pt-16 lg:pt-2 transition-all duration-300 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 lg:w-12 lg:h-12">
              <AvatarImage src={userProfile.avatar} />
              <AvatarFallback className={`${userProfile.avatarColor || 'bg-blue-500'} text-white text-sm lg:text-base`}>
                {getInitials(userProfile.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground text-sm lg:text-base">Bem-vindo de volta, {userProfile.name.replace('Dr. ', '').split(' ')[0]}!</p>
            </div>
          </div>
          
          <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
            <DialogTrigger asChild>
              <Button 
                className="medical-gradient text-white hover:opacity-90 w-full sm:w-auto"
                onClick={openAddDialog}
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Paciente
              </Button>
            </DialogTrigger>
            <AddPatientDialog 
              onAddPatient={handleAddPatient} 
              onEditPatient={handleEditPatient}
              editingPatient={editingPatient}
              mode={dialogMode}
            />
          </Dialog>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium">Total de Pacientes</CardTitle>
              <Users className="h-3 w-3 lg:h-4 lg:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg lg:text-2xl font-bold">{stats.totalPatients}</div>
              <p className="text-[10px] lg:text-xs text-muted-foreground">
                +2 novos esta semana
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium">Pacientes Ativos</CardTitle>
              <Activity className="h-3 w-3 lg:h-4 lg:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg lg:text-2xl font-bold text-green-600">{stats.activePatients}</div>
              <p className="text-[10px] lg:text-xs text-muted-foreground">
                Com consultas agendadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium">Consultas Hoje</CardTitle>
              <Calendar className={`h-3 w-3 lg:h-4 lg:w-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-lg lg:text-2xl font-bold text-amber-600">{stats.todayAppointments}</div>
              <p className="text-[10px] lg:text-xs text-muted-foreground">
                {upcomingAppointments.length} próximas agendadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium">Taxa de Retorno</CardTitle>
              <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg lg:text-2xl font-bold text-blue-600">{stats.returnRate}%</div>
              <p className="text-[10px] lg:text-xs text-muted-foreground">
                Pacientes com retorno agendado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg lg:text-xl">
              {todayAppointments.length > 0 ? 'Consultas de Hoje' : 'Próximas Consultas'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{appointment.patientName}</p>
                    <p className="text-sm text-muted-foreground">{appointment.type}</p>
                  </div>
                  <div className="text-right ml-2">
                    <p className="text-sm font-medium">{appointment.time}</p>
                    <div className="flex flex-col items-end gap-1">
                      {todayAppointments.length === 0 && (
                        <p className="text-xs text-muted-foreground">{new Date(appointment.date).toLocaleDateString('pt-BR')}</p>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {appointment.status === 'scheduled' ? 'Agendada' : appointment.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
              {upcomingAppointments.length === 0 && (
                <p className="text-center text-muted-foreground py-4 col-span-full">
                  {todayAppointments.length === 0 ? 'Nenhuma consulta agendada' : 'Nenhuma consulta agendada para hoje'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Patient Management Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg lg:text-xl">Gerenciamento de Pacientes</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filtros e Busca */}
            <div className="space-y-4">
              {/* Barra de busca principal */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar pacientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtros avançados */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
                <Select value={filterCondition} onValueChange={setFilterCondition}>
                  <SelectTrigger className="text-xs lg:text-sm">
                    <Filter className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                    <SelectValue placeholder="Condição" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Condições</SelectItem>
                    {uniqueConditions.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterGender} onValueChange={setFilterGender}>
                  <SelectTrigger className="text-xs lg:text-sm">
                    <User className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                    <SelectValue placeholder="Gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Gêneros</SelectItem>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Feminino</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterAge} onValueChange={setFilterAge}>
                  <SelectTrigger className="text-xs lg:text-sm">
                    <Calendar className={`w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`} />
                    <SelectValue placeholder="Idade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Idades</SelectItem>
                    <SelectItem value="young">Jovens (até 29)</SelectItem>
                    <SelectItem value="adult">Adultos (30-59)</SelectItem>
                    <SelectItem value="senior">Idosos (60+)</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="text-xs lg:text-sm">
                    <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nome (A-Z)</SelectItem>
                    <SelectItem value="age">Idade</SelectItem>
                    <SelectItem value="condition">Condição</SelectItem>
                    <SelectItem value="lastVisit-newest">Mais Recente</SelectItem>
                    <SelectItem value="lastVisit-oldest">Mais Antiga</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Indicadores de filtros ativos */}
              {(filterCondition !== 'all' || filterGender !== 'all' || filterAge !== 'all' || searchTerm) && (
                <div className="flex flex-wrap gap-1 lg:gap-2 items-center">
                  <span className="text-xs lg:text-sm text-muted-foreground">Filtros ativos:</span>
                  {searchTerm && (
                    <Badge variant="secondary" className="gap-1">
                      Busca: "{searchTerm}"
                      <button onClick={() => setSearchTerm('')} className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5">
                        ×
                      </button>
                    </Badge>
                  )}
                  {filterCondition !== 'all' && (
                    <Badge variant="secondary" className="gap-1">
                      {filterCondition}
                      <button onClick={() => setFilterCondition('all')} className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5">
                        ×
                      </button>
                    </Badge>
                  )}
                  {filterGender !== 'all' && (
                    <Badge variant="secondary" className="gap-1">
                      {filterGender === 'M' ? 'Masculino' : 'Feminino'}
                      <button onClick={() => setFilterGender('all')} className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5">
                        ×
                      </button>
                    </Badge>
                  )}
                  {filterAge !== 'all' && (
                    <Badge variant="secondary" className="gap-1">
                      {filterAge === 'young' ? 'Jovens' : filterAge === 'adult' ? 'Adultos' : 'Idosos'}
                      <button onClick={() => setFilterAge('all')} className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5">
                        ×
                      </button>
                    </Badge>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setSearchTerm('');
                      setFilterCondition('all');
                      setFilterGender('all');
                      setFilterAge('all');
                    }}
                    className="h-5 lg:h-6 px-1 lg:px-2 text-[10px] lg:text-xs"
                  >
                    Limpar tudo
                  </Button>
                </div>
              )}

              {/* Contador de resultados */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-xs lg:text-sm text-muted-foreground">
                  Mostrando {filteredPatients.length} de {patients.length} pacientes
                </p>
                {/* View mode toggle */}
                <div className="flex gap-2">
                  <Button 
                    variant={viewMode === 'cards' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setViewMode('cards')}
                    className="text-xs lg:text-sm"
                  >
                    Cards
                  </Button>
                  <Button 
                    variant={viewMode === 'table' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setViewMode('table')}
                    className="text-xs lg:text-sm"
                  >
                    Tabela
                  </Button>
                </div>
              </div>
            </div>

            {/* Lista de Pacientes */}
            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
                {filteredPatients.map((patient) => (
                  <PatientCard 
                    key={patient.id} 
                    patient={patient} 
                    onEdit={() => openEditDialog(patient)}
                  />
                ))}
              </div>
            ) : (
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs lg:text-sm">Paciente</TableHead>
                      <TableHead className="text-xs lg:text-sm hidden lg:table-cell">Contato</TableHead>
                      <TableHead className="text-xs lg:text-sm">Condição</TableHead>
                      <TableHead className="text-xs lg:text-sm hidden sm:table-cell">Última Visita</TableHead>
                      <TableHead className="text-xs lg:text-sm hidden md:table-cell">Tags</TableHead>
                      <TableHead className="text-xs lg:text-sm text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="min-w-0">
                          <div className="flex items-center gap-2 lg:gap-3">
                            <Avatar className="w-8 h-8 lg:w-10 lg:h-10">
                              <AvatarImage src={patient.avatar} />
                              <AvatarFallback className={`${patient.avatarColor || getAvatarColor(patient.id)} text-white text-xs lg:text-sm`}>
                                {patient.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="font-medium text-xs lg:text-sm truncate">{patient.name}</p>
                              <p className="text-[10px] lg:text-xs text-muted-foreground">{patient.age} anos, {patient.gender === 'M' ? 'M' : 'F'}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div>
                            <p className="text-xs lg:text-sm">{patient.email}</p>
                            <p className="text-xs text-muted-foreground">{patient.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-[10px] lg:text-xs">{patient.condition}</Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-xs lg:text-sm">{patient.lastVisit}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {patient.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-[10px]">
                                {tag}
                              </Badge>
                            ))}
                            {patient.tags.length > 2 && (
                              <Badge variant="outline" className="text-[10px]">
                                +{patient.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="outline" size="sm" asChild className="h-7 w-7 p-0 lg:h-8 lg:w-8">
                              <Link to={`/patients/${patient.id}`}>
                                <Eye className="w-3 h-3 lg:w-4 lg:h-4" />
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild className="h-7 w-7 p-0 lg:h-8 lg:w-8">
                              <Link to={`/chat/${patient.id}`}>
                                <MessageSquare className="w-3 h-3 lg:w-4 lg:h-4" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {filteredPatients.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum paciente encontrado com os filtros aplicados.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
