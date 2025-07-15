import { useState, useEffect, useMemo } from 'react';
import { mockPatients, mockAppointments } from '@/data/mockData';
import { Patient, Appointment } from '@/types';

export const usePatientData = () => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);

  // Função para sincronizar as próximas consultas dos pacientes com as consultas agendadas
  const syncPatientAppointments = () => {
    const updatedPatients = patients.map(patient => {
      // Encontrar a próxima consulta agendada para este paciente
      const nextAppointment = appointments
        .filter(apt => 
          apt.patientId === patient.id && 
          apt.status === 'scheduled' &&
          new Date(apt.date) >= new Date()
        )
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

      return {
        ...patient,
        nextAppointment: nextAppointment ? 
          new Date(nextAppointment.date).toLocaleDateString('pt-BR') : 
          undefined
      };
    });

    setPatients(updatedPatients);
  };

  // Sincronizar automaticamente quando as consultas mudarem
  useEffect(() => {
    syncPatientAppointments();
  }, [appointments]); // eslint-disable-line react-hooks/exhaustive-deps

  // Função para obter consultas de um paciente específico
  const getPatientAppointments = (patientId: string) => {
    return appointments.filter(apt => apt.patientId === patientId);
  };

  // Função para obter consultas futuras de um paciente
  const getPatientFutureAppointments = (patientId: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return appointments
      .filter(apt => 
        apt.patientId === patientId && 
        apt.status === 'scheduled' &&
        new Date(apt.date) >= today
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Função para obter consultas de hoje
  const getTodayAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === today && apt.status === 'scheduled');
  };

  // Função para obter próximas consultas (quando não há consultas hoje)
  const getUpcomingAppointments = (limit: number = 5) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return appointments
      .filter(apt => 
        apt.status === 'scheduled' &&
        new Date(apt.date) >= today
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, limit);
  };

  // Função para adicionar nova consulta
  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString()
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  // Função para atualizar consulta
  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => 
      prev.map(apt => apt.id === id ? { ...apt, ...updates } : apt)
    );
  };

  // Função para cancelar consulta
  const cancelAppointment = (id: string) => {
    updateAppointment(id, { status: 'cancelled' });
  };

  // Função para completar consulta
  const completeAppointment = (id: string) => {
    updateAppointment(id, { status: 'completed' });
  };

  // Estatísticas computadas
  const stats = useMemo(() => {
    const today = new Date();
    const todayDateString = today.toISOString().split('T')[0];
    
    // Consultas de hoje
    const todayAppts = appointments.filter(apt => {
      const aptDate = new Date(apt.date).toISOString().split('T')[0];
      return aptDate === todayDateString && apt.status === 'scheduled';
    });
    
    // Pacientes ativos (com próximas consultas agendadas)
    const activePatients = patients.filter(patient => {
      return appointments.some(apt => 
        apt.patientId === patient.id && 
        apt.status === 'scheduled' &&
        new Date(apt.date) >= today
      );
    });
    
    // Taxa de retorno (pacientes com consultas futuras / total de pacientes)
    const returnRate = patients.length > 0 ? 
      Math.round((activePatients.length / patients.length) * 100) : 0;
    
    return {
      totalPatients: patients.length,
      activePatients: activePatients.length,
      todayAppointments: todayAppts.length,
      completedAppointments: appointments.filter(apt => apt.status === 'completed').length,
      returnRate
    };
  }, [patients, appointments]);

  return {
    patients,
    appointments,
    setPatients,
    setAppointments,
    getPatientAppointments,
    getPatientFutureAppointments,
    getTodayAppointments,
    getUpcomingAppointments,
    addAppointment,
    updateAppointment,
    cancelAppointment,
    completeAppointment,
    syncPatientAppointments,
    stats
  };
};
