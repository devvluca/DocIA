export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  condition: string;
  age: number;
  gender: 'M' | 'F';
  tags: string[];
  lastVisit: string;
  nextAppointment?: string;
  documents: Document[];
  anamnesis: string;
  avatar?: string;
  avatarColor?: string;
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadDate: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface ChatMessage {
  id: string;
  patientId: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  attachments?: string[];
}

export interface Agent {
  id: string;
  name: string;
  specialty: string;
  description: string;
  files: string[];
  createdAt: string;
  isForSale: boolean;
  price?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  specialty: string;
  avatar?: string;
}

export interface AnamnesisTemplate {
  id: string;
  specialty: string;
  template: string;
}
