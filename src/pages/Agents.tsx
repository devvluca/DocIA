
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Plus, Upload, DollarSign, Search, Filter } from 'lucide-react';
import { Agent } from '@/types';

const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Dr. Cardio AI',
    specialty: 'Cardiologia',
    description: 'Especialista em análise de ECGs e diagnósticos cardiovasculares',
    files: ['ecg_patterns.pdf', 'cardio_guidelines.pdf'],
    createdAt: '2024-01-15',
    isForSale: true,
    price: 299
  },
  {
    id: '2',
    name: 'Nutri AI Pro',
    specialty: 'Nutrição',
    description: 'Análise nutricional e criação de planos alimentares personalizados',
    files: ['nutrition_database.pdf', 'diet_plans.pdf'],
    createdAt: '2024-01-10',
    isForSale: false
  },
  {
    id: '3',
    name: 'Psico Analyzer',
    specialty: 'Psicologia',
    description: 'Assistente para análise comportamental e suporte terapêutico',
    files: ['psychological_tests.pdf', 'therapy_guidelines.pdf'],
    createdAt: '2024-01-05',
    isForSale: true,
    price: 199
  }
];

const Agents = () => {
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: '',
    specialty: '',
    description: '',
    files: [] as string[]
  });

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterSpecialty === 'all' || agent.specialty === filterSpecialty;
    return matchesSearch && matchesFilter;
  });

  const handleCreateAgent = () => {
    const agent: Agent = {
      id: Date.now().toString(),
      ...newAgent,
      createdAt: new Date().toISOString().split('T')[0],
      isForSale: false
    };
    setAgents([...agents, agent]);
    setNewAgent({ name: '', specialty: '', description: '', files: [] });
    setIsCreateDialogOpen(false);
  };

  const toggleSaleStatus = (agentId: string) => {
    setAgents(agents.map(agent => 
      agent.id === agentId 
        ? { ...agent, isForSale: !agent.isForSale, price: agent.isForSale ? undefined : 199 }
        : agent
    ));
  };

  return (
    <div className="ml-64 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Agentes IA</h1>
            <p className="text-muted-foreground mt-2">Gerencie seus assistentes inteligentes especializados</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Criar Novo Agente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Novo Agente IA</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Agente</Label>
                  <Input
                    id="name"
                    value={newAgent.name}
                    onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                    placeholder="Ex: Dr. Cardio AI"
                  />
                </div>
                <div>
                  <Label htmlFor="specialty">Especialidade</Label>
                  <Select onValueChange={(value) => setNewAgent({...newAgent, specialty: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a especialidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cardiologia">Cardiologia</SelectItem>
                      <SelectItem value="Nutrição">Nutrição</SelectItem>
                      <SelectItem value="Psicologia">Psicologia</SelectItem>
                      <SelectItem value="Fisioterapia">Fisioterapia</SelectItem>
                      <SelectItem value="Pediatria">Pediatria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={newAgent.description}
                    onChange={(e) => setNewAgent({...newAgent, description: e.target.value})}
                    placeholder="Descreva as funcionalidades do agente..."
                  />
                </div>
                <div>
                  <Label>Arquivos de Treinamento</Label>
                  <Button variant="outline" className="w-full gap-2">
                    <Upload className="w-4 h-4" />
                    Upload de Arquivos
                  </Button>
                </div>
                <Button onClick={handleCreateAgent} className="w-full">
                  Criar Agente
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filtros */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar agentes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Especialidades</SelectItem>
              <SelectItem value="Cardiologia">Cardiologia</SelectItem>
              <SelectItem value="Nutrição">Nutrição</SelectItem>
              <SelectItem value="Psicologia">Psicologia</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid de Agentes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <Card key={agent.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <Bot className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {agent.specialty}
                      </Badge>
                    </div>
                  </div>
                  {agent.isForSale && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <DollarSign className="w-3 h-3 mr-1" />
                      R$ {agent.price}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{agent.description}</p>
                
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Arquivos de treinamento:</p>
                  <div className="space-y-1">
                    {agent.files.map((file, index) => (
                      <div key={index} className="text-xs bg-muted p-2 rounded flex items-center gap-2">
                        <Upload className="w-3 h-3" />
                        {file}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Editar
                  </Button>
                  <Button 
                    variant={agent.isForSale ? "destructive" : "default"} 
                    size="sm" 
                    className="flex-1"
                    onClick={() => toggleSaleStatus(agent.id)}
                  >
                    {agent.isForSale ? 'Remover da Venda' : 'Colocar à Venda'}
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Criado em: {new Date(agent.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Agents;
