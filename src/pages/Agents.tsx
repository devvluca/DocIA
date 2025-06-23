import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Plus, Upload, DollarSign, Search, Filter, Edit, MessageSquare } from 'lucide-react';
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
		price: 299,
	},
	{
		id: '2',
		name: 'Nutri AI Pro',
		specialty: 'Nutrição',
		description: 'Análise nutricional e criação de planos alimentares personalizados',
		files: ['nutrition_database.pdf', 'diet_plans.pdf'],
		createdAt: '2024-01-10',
		isForSale: false,
	},
	{
		id: '3',
		name: 'Psico Analyzer',
		specialty: 'Psicologia',
		description: 'Assistente para análise comportamental e suporte terapêutico',
		files: ['psychological_tests.pdf', 'therapy_guidelines.pdf'],
		createdAt: '2024-01-05',
		isForSale: true,
		price: 199,
	},
];

const Agents = () => {
	const [agents, setAgents] = useState<Agent[]>(mockAgents);
	const [searchTerm, setSearchTerm] = useState('');
	const [filterSpecialty, setFilterSpecialty] = useState('all');
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [selectedMainSpecialty, setSelectedMainSpecialty] = useState('');
	const [newAgent, setNewAgent] = useState({
		name: '',
		specialty: '',
		description: '',
		files: [] as string[],
	});

	const mainSpecialties = [
		'Médico',
		'Nutricionista',
		'Cirurgião Dentista',
		'Fisioterapeuta',
		'Psicólogo',
		'Enfermeiro',
		'Farmacêutico',
		'Fonoaudiólogo',
		'Terapeuta Ocupacional',
		'Biomédico',
		'Veterinário',
	];

	const medicalSpecialties = [
		'Clínico Geral',
		'Cardiologia',
		'Neurologia',
		'Pediatria',
		'Ginecologia e Obstetrícia',
		'Ortopedia',
		'Dermatologia',
		'Psicologia',
		'Endocrinologia',
		'Gastroenterologia',
		'Pneumologia',
		'Urologia',
		'Oftalmologia',
		'Otorrinolaringologia',
		'Radiologia',
		'Anestesiologia',
		'Cirurgia Geral',
		'Medicina Interna',
		'Medicina de Família',
		'Oncologia',
		'Reumatologia',
	];

	const filteredAgents = agents.filter((agent) => {
		const matchesSearch =
			agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			agent.specialty.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesFilter = filterSpecialty === 'all' || agent.specialty === filterSpecialty;
		return matchesSearch && matchesFilter;
	});

	const handleCreateAgent = () => {
		const agent: Agent = {
			id: Date.now().toString(),
			...newAgent,
			createdAt: new Date().toISOString().split('T')[0],
			isForSale: false,
		};
		setAgents([...agents, agent]);
		setNewAgent({ name: '', specialty: '', description: '', files: [] });
		setIsCreateDialogOpen(false);
	};

	const toggleSaleStatus = (agentId: string) => {
		setAgents(
			agents.map((agent) =>
				agent.id === agentId
					? { ...agent, isForSale: !agent.isForSale, price: agent.isForSale ? undefined : 199 }
					: agent
			)
		);
	};

	const uniqueSpecialties = Array.from(new Set(agents.map((a) => a.specialty)));

	return (
		<div className="min-h-screen bg-background lg:pl-64 pt-16 lg:pt-0">
			<div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
				{/* Header */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<h1 className="text-2xl lg:text-3xl font-bold text-foreground">Agentes IA</h1>
						<p className="text-muted-foreground text-sm lg:text-base">
							Gerencie seus assistentes inteligentes especializados
						</p>
					</div>

					<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
						<DialogTrigger asChild>
							<Button className="medical-gradient text-white hover:opacity-90 w-full sm:w-auto">
								<Plus className="w-4 h-4 mr-2" />
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
										onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
										placeholder="Ex: Dr. Cardio AI"
									/>
								</div>
								<div>
									<Label htmlFor="specialty">Área de Atuação</Label>
									<Select
										onValueChange={(value) => {
											setSelectedMainSpecialty(value);
											if (value !== 'Médico') {
												setNewAgent({ ...newAgent, specialty: value });
											} else {
												// Se escolher Médico, automaticamente seta "Clínico Geral"
												setNewAgent({ ...newAgent, specialty: 'Clínico Geral' });
											}
										}}
									>
										<SelectTrigger>
											<SelectValue placeholder="Selecione a área" />
										</SelectTrigger>
										<SelectContent>
											{mainSpecialties.map((specialty) => (
												<SelectItem key={specialty} value={specialty}>
													{specialty}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								{/* Submenu de especialidades médicas */}
								{selectedMainSpecialty === 'Médico' && (
									<div>
										<Label htmlFor="medical-specialty">Especialidade Médica</Label>
										<Select onValueChange={(value) => setNewAgent({ ...newAgent, specialty: value })}>
											<SelectTrigger>
												<SelectValue placeholder="Selecione a especialidade" />
											</SelectTrigger>
											<SelectContent>
												{medicalSpecialties.map((specialty) => (
													<SelectItem key={specialty} value={specialty}>
														{specialty}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								)}

								<div>
									<Label htmlFor="description">Descrição</Label>
									<Textarea
										id="description"
										value={newAgent.description}
										onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
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
								<Button onClick={handleCreateAgent} className="w-full medical-gradient text-white">
									Criar Agente
								</Button>
							</div>
						</DialogContent>
					</Dialog>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-xs lg:text-sm font-medium">Total de Agentes</CardTitle>
							<Bot className="h-3 w-3 lg:h-4 lg:w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-lg lg:text-2xl font-bold">{agents.length}</div>
							<p className="text-[10px] lg:text-xs text-muted-foreground">+1 novo esta semana</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-xs lg:text-sm font-medium">À Venda</CardTitle>
							<DollarSign className="h-3 w-3 lg:h-4 lg:w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-lg lg:text-2xl font-bold text-green-600">
								{agents.filter((a) => a.isForSale).length}
							</div>
							<p className="text-[10px] lg:text-xs text-muted-foreground">Agentes monetizados</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-xs lg:text-sm font-medium">Especialidades</CardTitle>
							<Filter className="h-3 w-3 lg:h-4 lg:w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-lg lg:text-2xl font-bold">{uniqueSpecialties.length}</div>
							<p className="text-[10px] lg:text-xs text-muted-foreground">Áreas cobertas</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-xs lg:text-sm font-medium">Receita Total</CardTitle>
							<DollarSign className="h-3 w-3 lg:h-4 lg:w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-lg lg:text-2xl font-bold text-blue-600">
								R${' '}
								{agents
									.filter((a) => a.isForSale)
									.reduce((sum, a) => sum + (a.price || 0), 0)
									.toFixed(2)
									.replace('.', ',')}
							</div>
							<p className="text-[10px] lg:text-xs text-muted-foreground">Valor potencial</p>
						</CardContent>
					</Card>
				</div>

				{/* Agent Management Section */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="text-lg lg:text-xl">Gerenciamento de Agentes</CardTitle>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Filtros e Busca */}
						<div className="space-y-4">
							{/* Barra de busca principal */}
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
								<Input
									placeholder="Buscar agentes..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10"
								/>
							</div>

							{/* Filtros avançados */}
							<div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
								<Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
									<SelectTrigger className="text-xs lg:text-sm">
										<Filter className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
										<SelectValue placeholder="Especialidade" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Todas Especialidades</SelectItem>
										{uniqueSpecialties.map((specialty) => (
											<SelectItem key={specialty} value={specialty}>
												{specialty}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Indicadores de filtros ativos */}
							{(filterSpecialty !== 'all' || searchTerm) && (
								<div className="flex flex-wrap gap-1 lg:gap-2 items-center">
									<span className="text-xs lg:text-sm text-muted-foreground">Filtros ativos:</span>
									{searchTerm && (
										<Badge variant="secondary" className="gap-1">
											Busca: "{searchTerm}"
											<button
												onClick={() => setSearchTerm('')}
												className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
											>
												×
											</button>
										</Badge>
									)}
									{filterSpecialty !== 'all' && (
										<Badge variant="secondary" className="gap-1">
											{filterSpecialty}
											<button
												onClick={() => setFilterSpecialty('all')}
												className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
											>
												×
											</button>
										</Badge>
									)}
									<Button
										variant="ghost"
										size="sm"
										onClick={() => {
											setSearchTerm('');
											setFilterSpecialty('all');
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
									Mostrando {filteredAgents.length} de {agents.length} agentes
								</p>
							</div>
						</div>

						{/* Grid de Agentes */}
						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
							{filteredAgents.map((agent) => (
								<Card key={agent.id} className="hover:shadow-lg transition-shadow">
									<CardHeader className="pb-3">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-3 min-w-0 flex-1">
												<div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shrink-0">
													<Bot className="w-6 h-6 text-primary-foreground" />
												</div>
												<div className="min-w-0 flex-1">
													<CardTitle className="text-lg truncate">{agent.name}</CardTitle>
													<Badge variant="secondary" className="text-xs">
														{agent.specialty}
													</Badge>
												</div>
											</div>
											{agent.isForSale && (
												<Badge variant="outline" className="text-green-600 border-green-600 shrink-0">
													<DollarSign className="w-3 h-3 mr-1" />
													R$ {agent.price}
												</Badge>
											)}
										</div>
									</CardHeader>

									<CardContent className="space-y-4">
										<p className="text-sm text-muted-foreground line-clamp-2">{agent.description}</p>

										<div>
											<p className="text-xs text-muted-foreground mb-2">Arquivos de treinamento:</p>
											<div className="space-y-1">
												{agent.files.slice(0, 2).map((file, index) => (
													<div key={index} className="text-xs bg-muted p-2 rounded flex items-center gap-2">
														<Upload className="w-3 h-3 shrink-0" />
														<span className="truncate">{file}</span>
													</div>
												))}
												{agent.files.length > 2 && (
													<p className="text-xs text-muted-foreground">
														+{agent.files.length - 2} arquivo(s) adicional(is)
													</p>
												)}
											</div>
										</div>

										<div className="flex gap-2">
											<Button variant="outline" size="sm" className="flex-1">
												<Edit className="w-3 h-3 mr-1" />
												Editar
											</Button>
											<Button variant="outline" size="sm" className="flex-1">
												<MessageSquare className="w-3 h-3 mr-1" />
												Testar
											</Button>
										</div>

										<Button
											variant={agent.isForSale ? 'destructive' : 'default'}
											size="sm"
											className="w-full"
											onClick={() => toggleSaleStatus(agent.id)}
										>
											{agent.isForSale ? 'Remover da Venda' : 'Colocar à Venda'}
										</Button>

										<p className="text-xs text-muted-foreground">
											Criado em: {new Date(agent.createdAt).toLocaleDateString('pt-BR')}
										</p>
									</CardContent>
								</Card>
							))}
						</div>

						{filteredAgents.length === 0 && (
							<div className="text-center py-8">
								<p className="text-muted-foreground">Nenhum agente encontrado com os filtros aplicados.</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default Agents;
