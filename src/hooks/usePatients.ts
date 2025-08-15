import { useState, useEffect } from 'react';
import { Patient, CalculationResult, PatientWithCalculations } from '@/types/Patient';

const PATIENTS_STORAGE_KEY = 'perfusion-patients';
const CALCULATIONS_STORAGE_KEY = 'perfusion-calculations';

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [calculations, setCalculations] = useState<CalculationResult[]>([]);

  useEffect(() => {
    const storedPatients = localStorage.getItem(PATIENTS_STORAGE_KEY);
    const storedCalculations = localStorage.getItem(CALCULATIONS_STORAGE_KEY);
    
    if (storedPatients) {
      setPatients(JSON.parse(storedPatients));
    }
    
    if (storedCalculations) {
      setCalculations(JSON.parse(storedCalculations));
    }
  }, []);

  const savePatients = (newPatients: Patient[]) => {
    setPatients(newPatients);
    localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(newPatients));
  };

  const saveCalculations = (newCalculations: CalculationResult[]) => {
    setCalculations(newCalculations);
    localStorage.setItem(CALCULATIONS_STORAGE_KEY, JSON.stringify(newCalculations));
  };

  const addPatient = (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPatient: Patient = {
      ...patient,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedPatients = [...patients, newPatient];
    savePatients(updatedPatients);
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    const updatedPatients = patients.map(patient =>
      patient.id === id
        ? { ...patient, ...updates, updatedAt: new Date().toISOString() }
        : patient
    );
    savePatients(updatedPatients);
  };

  const deletePatient = (id: string) => {
    const updatedPatients = patients.filter(patient => patient.id !== id);
    const updatedCalculations = calculations.filter(calc => calc.patientId !== id);
    savePatients(updatedPatients);
    saveCalculations(updatedCalculations);
  };

  const addCalculation = (calculation: Omit<CalculationResult, 'id' | 'timestamp'>) => {
    const newCalculation: CalculationResult = {
      ...calculation,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    
    const updatedCalculations = [...calculations, newCalculation];
    saveCalculations(updatedCalculations);
    return newCalculation;
  };

  const getPatientWithCalculations = (patientId: string): PatientWithCalculations | undefined => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return undefined;
    
    const patientCalculations = calculations.filter(calc => calc.patientId === patientId);
    return {
      ...patient,
      calculations: patientCalculations,
    };
  };

  const getAllPatientsWithCalculations = (): PatientWithCalculations[] => {
    return patients.map(patient => ({
      ...patient,
      calculations: calculations.filter(calc => calc.patientId === patient.id),
    }));
  };

  return {
    patients,
    calculations,
    addPatient,
    updatePatient,
    deletePatient,
    addCalculation,
    getPatientWithCalculations,
    getAllPatientsWithCalculations,
  };
};