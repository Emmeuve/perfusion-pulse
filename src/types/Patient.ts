export interface Patient {
  id: string;
  name: string;
  surname: string;
  gender: 'masculino' | 'femenino' | 'otro';
  age: number;
  diagnosis: string;
  medicalHistory: string;
  allergies: string;
  plannedSurgery: string;
  surgeonName: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalculationResult {
  id: string;
  patientId: string;
  type: 'cec-adulto' | 'cec-pediatrico';
  timestamp: string;
  inputs: {
    weight: number;
    height: number;
    currentHematocrit: number;
    desiredHematocrit: number;
    primingVolume: number;
    bloodVolumeMethod: string;
    cardiacIndex: number;
  };
  outputs: {
    bsa: number;
    totalBloodVolume: number;
    pumpFlowRate: number;
    dilutionalHematocrit: number;
    cerebralFlow: number;
    cardiacFlow: number;
  };
}

export interface PatientWithCalculations extends Patient {
  calculations: CalculationResult[];
}