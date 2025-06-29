
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
    lastVisit: '23/06/2025',
    nextAppointment: '30/06/2025',
    documents: [],
    anamnesis: 'Paciente com histórico de hipertensão arterial há 5 anos. Apresenta pressão arterial controlada com medicação. Faz uso de losartana 50mg 1x/dia. Nega sintomas cardiovasculares. Realiza exercícios físicos regularmente.',
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
    lastVisit: '24/06/2025',
    documents: [],
    anamnesis: 'Paciente jovem com quadro de ansiedade generalizada há 6 meses. Relata episódios de palpitação, sudorese e sensação de falta de ar. Iniciado tratamento psicológico e medicamentoso com sertralina 50mg.',
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
    lastVisit: '25/06/2025',
    documents: [],
    anamnesis: 'Diagnóstico de diabetes tipo 2 há 3 anos. HbA1c atual: 7,2%. Faz uso de metformina 850mg 2x/dia. Orientada sobre dieta e exercícios. Nega complicações micro ou macrovasculares.',
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
    lastVisit: '26/06/2025',
    documents: [],
    anamnesis: 'Lesão no joelho direito durante atividade esportiva há 2 semanas. Ressonância magnética mostra lesão parcial do ligamento cruzado anterior. Indicado tratamento conservador com fisioterapia.',
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
    lastVisit: '27/06/2025',
    documents: [],
    anamnesis: 'Busca orientação nutricional para perda de peso. IMC: 28,5. Relata dificuldade para manter dieta equilibrada devido à rotina de trabalho. Sem comorbidades associadas.',
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
    lastVisit: '28/06/2025',
    documents: [],
    anamnesis: 'Paciente em tratamento para depressão há 8 meses. Episódio depressivo maior com melhora significativa após início de fluoxetina 20mg. Faz acompanhamento psicológico semanal.',
    createdAt: '2024-02-15',
  },
  {
    id: '7',
    name: 'Larissa Rodrigues',
    email: 'larissa.rodrigues@email.com',
    phone: '(11) 93333-7788',
    condition: 'Enxaqueca',
    age: 33,
    gender: 'F',
    tags: ['Neurológico', 'Crônico'],
    lastVisit: '29/06/2025',
    documents: [],
    anamnesis: 'Histórico de enxaqueca com aura há 5 anos. Crises 2-3x por semana, melhoram com sumatriptana. Fatores desencadeantes: estresse e alterações hormonais. Investigação para profilaxia.',
    createdAt: '2024-03-20',
  },
  {
    id: '8',
    name: 'Miguel Ferreira',
    email: 'miguel.ferreira@email.com',
    phone: '(11) 92222-9900',
    condition: 'Bronquite Asmática',
    age: 42,
    gender: 'M',
    tags: ['Respiratório', 'Controlado'],
    lastVisit: '23/06/2025',
    documents: [],
    anamnesis: 'Asma brônquica desde a infância. Atualmente controlada com budesonida/formoterol. Última crise há 3 meses. Evita fatores desencadeantes conhecidos. Espirometria normal.',
    createdAt: '2024-04-10',
  },
  {
    id: '9',
    name: 'Beatriz Almeida',
    email: 'beatriz.almeida@email.com',
    phone: '(11) 91111-2233',
    condition: 'Gastrite',
    age: 38,
    gender: 'F',
    tags: ['Digestivo', 'Helicobacter'],
    lastVisit: '24/06/2025',
    documents: [],
    anamnesis: 'Gastrite erosiva H. pylori positivo. Completou esquema tríplice de erradicação há 1 mês. Sintomas em melhora. Controle endoscópico em 3 meses para verificar cicatrização.',
    createdAt: '2024-05-01',
  },
  {
    id: '10',
    name: 'Rafael Souza',
    email: 'rafael.souza@email.com',
    phone: '(11) 90000-4455',
    condition: 'Lombalgia',
    age: 29,
    gender: 'M',
    tags: ['Ortopédico', 'Trabalhista'],
    lastVisit: '25/06/2025',
    documents: [],
    anamnesis: 'Lombalgia crônica relacionada ao trabalho. Atua como programador, permanece sentado por longas horas. Dor lombar baixa, sem irradiação. Iniciado fisioterapia e orientações ergonômicas.',
    createdAt: '2024-05-15',
  },
  {
    id: '11',
    name: 'Juliana Costa',
    email: 'juliana.costa@email.com',
    phone: '(11) 89999-6677',
    condition: 'Hipotireoidismo',
    age: 46,
    gender: 'F',
    tags: ['Endócrino', 'Hormonal'],
    lastVisit: '26/06/2025',
    documents: [],
    anamnesis: 'Hipotireoidismo primário diagnosticado há 2 anos. TSH atual: 2,8 mUI/L. Faz uso de levotiroxina 75mcg em jejum. Sintomas controlados. Sem sintomas de hipo ou hipertireoidismo.',
    createdAt: '2024-05-30',
  },
  {
    id: '12',
    name: 'André Martins',
    email: 'andre.martins@email.com',
    phone: '(11) 88888-8899',
    condition: 'Insônia',
    age: 51,
    gender: 'M',
    tags: ['Psicológico', 'Sono'],
    lastVisit: '27/06/2025',
    documents: [],
    anamnesis: 'Insônia inicial e de manutenção há 4 meses. Relacionada ao estresse profissional. Latência do sono >60min, despertares noturnos frequentes. Orientado sobre higiene do sono.',
    createdAt: '2024-06-01',
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Maria Silva Santos',
    date: '2025-06-29',
    time: '09:00',
    type: 'Consulta de Rotina',
    status: 'scheduled',
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'João Pedro Oliveira',
    date: '2025-06-29',
    time: '14:30',
    type: 'Psicoterapia',
    status: 'scheduled',
  },
  {
    id: '3',
    patientId: '4',
    patientName: 'Carlos Eduardo Costa',
    date: '2025-06-29',
    time: '10:15',
    type: 'Fisioterapia',
    status: 'scheduled',
  },
  {
    id: '4',
    patientId: '7',
    patientName: 'Larissa Rodrigues',
    date: '2025-06-29',
    time: '16:00',
    type: 'Neurologista',
    status: 'scheduled',
  },
  {
    id: '5',
    patientId: '11',
    patientName: 'Juliana Costa',
    date: '2025-06-30',
    time: '08:30',
    type: 'Primeira Consulta',
    status: 'scheduled',
  },
  {
    id: '6',
    patientId: '5',
    patientName: 'Roberto Almeida',
    date: '2025-06-30',
    time: '11:00',
    type: 'Primeira Consulta',
    status: 'scheduled',
  },
  {
    id: '7',
    patientId: '8',
    patientName: 'Patricia Fernandes',
    date: '2025-06-29',
    time: '15:30',
    type: 'Primeira Consulta',
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
