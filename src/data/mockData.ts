
import { Patient, Appointment, Agent, AnamnesisTemplate } from '@/types';

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Maria Silva Santos',
    email: 'maria.silva@email.com',
    phone: '(11) 99999-1234',
    condition: 'Hipertensão Arterial',
    age: 45,
    gender: 'F',
    tags: ['Crônico', 'Controlado'],
    lastVisit: '15/05/2024',
    nextAppointment: '20/06/2024',
    documents: [],
    anamnesis: 'Paciente com histórico de hipertensão arterial há 5 anos...',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'João Pedro Oliveira',
    email: 'joao.pedro@email.com',
    phone: '(11) 98888-5678',
    condition: 'Ansiedade Generalizada',
    age: 28,
    gender: 'M',
    tags: ['Primeira Vez', 'Ansioso'],
    lastVisit: '18/05/2024',
    documents: [],
    anamnesis: 'Paciente jovem com quadro de ansiedade...',
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    name: 'Ana Carolina Lima',
    email: 'ana.carolina@email.com',
    phone: '(11) 97777-9101',
    condition: 'Diabetes Tipo 2',
    age: 52,
    gender: 'F',
    tags: ['Crônico', 'Diabetes'],
    lastVisit: '22/05/2024',
    documents: [],
    anamnesis: 'Diagnóstico de diabetes tipo 2 há 3 anos...',
    createdAt: '2024-01-30',
  },
  {
    id: '4',
    name: 'Carlos Eduardo Costa',
    email: 'carlos.eduardo@email.com',
    phone: '(11) 96666-1122',
    condition: 'Lesão no Joelho',
    age: 35,
    gender: 'M',
    tags: ['Urgente', 'Fisioterapia'],
    lastVisit: '25/05/2024',
    documents: [],
    anamnesis: 'Lesão no joelho direito durante atividade esportiva...',
    createdAt: '2024-03-10',
  },
  {
    id: '5',
    name: 'Fernanda Santos',
    email: 'fernanda.santos@email.com',
    phone: '(11) 95555-3344',
    condition: 'Sobrepeso',
    age: 30,
    gender: 'F',
    tags: ['Nutrição', 'Primeira Vez'],
    lastVisit: '28/05/2024',
    documents: [],
    anamnesis: 'Busca orientação nutricional para perda de peso...',
    createdAt: '2024-04-05',
  },
  {
    id: '6',
    name: 'Roberto Mendes',
    email: 'roberto.mendes@email.com',
    phone: '(11) 94444-5566',
    condition: 'Depressão',
    age: 40,
    gender: 'M',
    tags: ['Psicológico', 'Acompanhamento'],
    lastVisit: '30/05/2024',
    documents: [],
    anamnesis: 'Paciente em tratamento para depressão...',
    createdAt: '2024-02-15',
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Maria Silva Santos',
    date: '2024-06-20',
    time: '09:00',
    type: 'Consulta de Rotina',
    status: 'scheduled',
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'João Pedro Oliveira',
    date: '2024-06-21',
    time: '14:30',
    type: 'Psicoterapia',
    status: 'scheduled',
  },
  {
    id: '3',
    patientId: '4',
    patientName: 'Carlos Eduardo Costa',
    date: '2024-06-22',
    time: '10:15',
    type: 'Fisioterapia',
    status: 'scheduled',
  },
];

export const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Dr. CardioIA',
    specialty: 'Cardiologia',
    description: 'Especialista em análise de exames cardiológicos e diagnósticos',
    files: ['guidelines_cardiologia.pdf', 'protocolos_emergencia.pdf'],
    createdAt: '2024-01-15',
    isForSale: false,
  },
  {
    id: '2',
    name: 'PsicoAssist',
    specialty: 'Psicologia',
    description: 'Assistente para análise de comportamento e suporte terapêutico',
    files: ['manual_dsm5.pdf', 'tecnicas_terapia.pdf'],
    createdAt: '2024-02-20',
    isForSale: true,
    price: 299,
  },
];

export const anamnesisTemplates: AnamnesisTemplate[] = [
  {
    id: '1',
    specialty: 'Cardiologia',
    template: `ANAMNESE CARDIOLÓGICA

Queixa Principal:
- Motivo da consulta:

História da Doença Atual:
- Dor torácica: ( ) Sim ( ) Não
- Dispneia: ( ) Sim ( ) Não
- Palpitações: ( ) Sim ( ) Não
- Síncope: ( ) Sim ( ) Não

Antecedentes Pessoais:
- Hipertensão: ( ) Sim ( ) Não
- Diabetes: ( ) Sim ( ) Não
- Dislipidemia: ( ) Sim ( ) Não
- Tabagismo: ( ) Sim ( ) Não

Medicações em uso:

Exame Físico:
- PA: _____ mmHg
- FC: _____ bpm
- Ausculta cardíaca:
- Ausculta pulmonar:

Conduta:`,
  },
  {
    id: '2',
    specialty: 'Psicologia',
    template: `ANAMNESE PSICOLÓGICA

Dados de Identificação:
- Nome:
- Idade:
- Estado Civil:
- Profissão:

Motivo da Consulta:
- Queixa principal:
- Quando iniciaram os sintomas:

História Pessoal:
- Relacionamentos familiares:
- Histórico de tratamentos anteriores:
- Uso de medicações psiquiátricas:

Estado Mental Atual:
- Humor:
- Ansiedade:
- Sono:
- Apetite:

Objetivos do Tratamento:`,
  },
];
