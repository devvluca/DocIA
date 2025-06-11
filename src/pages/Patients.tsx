
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Search, Filter, Plus, Eye, MessageSquare, Calendar } from 'lucide-react';
import { Patient } from '@/types';
import { mockPatients } from '@/data/mockData';
import { Link } from 'react-router-dom';
import PatientCard from '@/components/ui/PatientCard';
import AddPatientDialog from '@/components/dialogs/AddPatientDialog';

const Patients = () => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCondition, setFilterCondition] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCondition === 'all' || patient.condition === filterCondition;
    return matchesSearch && matchesFilter;
  });

  const uniqueConditions = Array.from(new Set(patients.map(p => p.condition)));

  const handleAddPatient = (newPatient: Omit<Patient, 'id' | 'createdAt'>) => {
    const patient: Patient = {
      ...newPatient,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setPatients([...patients, patient]);
  };

  return (
    <div className="ml-64 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pacientes</h1>
            <p className="text-muted-foreground mt-2">Gerencie todos os seus pacientes</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className=" gap-2">
                <Plus className="w-4 h-4" />
                Novo Paciente
              </Button>
            </DialogTrigger>
            
          </Dialog>
        </div>

        {/* Filtros e Busca */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar pacientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterCondition} onValueChange={setFilterCondition}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
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

          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'cards' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('cards')}
            >
              Cards
            </Button>
            <Button 
              variant={viewMode === 'table' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('table')}
            >
              Tabela
            </Button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="text-sm font-medium text-muted-foreground">Total de Pacientes</h3>
            <p className="text-2xl font-bold text-foreground">{patients.length}</p>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="text-sm font-medium text-muted-foreground">Pacientes Ativos</h3>
            <p className="text-2xl font-bold text-green-600">{patients.filter(p => p.tags.includes('ativo')).length}</p>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="text-sm font-medium text-muted-foreground">Novos este Mês</h3>
            <p className="text-2xl font-bold text-blue-600">12</p>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="text-sm font-medium text-muted-foreground">Consultas Hoje</h3>
            <p className="text-2xl font-bold text-amber-600">5</p>
          </div>
        </div>

        {/* Lista de Pacientes */}
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Condição</TableHead>
                  <TableHead>Última Visita</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={patient.avatar} />
                          <AvatarFallback>
                            {patient.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">{patient.age} anos, {patient.gender === 'M' ? 'Masculino' : 'Feminino'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{patient.email}</p>
                        <p className="text-sm text-muted-foreground">{patient.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{patient.condition}</Badge>
                    </TableCell>
                    <TableCell>{patient.lastVisit}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {patient.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {patient.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{patient.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/patients/${patient.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/chat/${patient.id}`}>
                            <MessageSquare className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm">
                          <Calendar className="w-4 h-4" />
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
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum paciente encontrado com os filtros aplicados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Patients;
