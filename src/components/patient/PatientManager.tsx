import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { usePatients } from '@/hooks/usePatients';
import { PatientWithCalculations } from '@/types/Patient';
import PatientList from './PatientList';
import PatientForm from './PatientForm';
import PatientHistory from './PatientHistory';
import { UserPlus } from 'lucide-react';

type View = 'list' | 'form' | 'history';

interface PatientManagerProps {
  onNavigateToCalculation: (type: 'cec-adulto' | 'cec-pediatrico', patient?: PatientWithCalculations) => void;
}

const PatientManager = ({ onNavigateToCalculation }: PatientManagerProps) => {
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedPatient, setSelectedPatient] = useState<PatientWithCalculations | null>(null);
  const [editingPatient, setEditingPatient] = useState<PatientWithCalculations | null>(null);
  
  const { 
    addPatient, 
    updatePatient, 
    deletePatient, 
    getAllPatientsWithCalculations 
  } = usePatients();

  const patients = getAllPatientsWithCalculations();

  const handleNewPatient = () => {
    setEditingPatient(null);
    setCurrentView('form');
  };

  const handleEditPatient = (patient: PatientWithCalculations) => {
    setEditingPatient(patient);
    setCurrentView('form');
  };

  const handleSavePatient = (patientData: any) => {
    if (editingPatient) {
      updatePatient(editingPatient.id, patientData);
    } else {
      addPatient(patientData);
    }
    setEditingPatient(null);
    setCurrentView('list');
  };

  const handleSelectPatient = (patient: PatientWithCalculations) => {
    setSelectedPatient(patient);
    setCurrentView('history');
  };

  const handleDeletePatient = (patientId: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este paciente? Esta acción no se puede deshacer.')) {
      deletePatient(patientId);
    }
  };

  const handleNewCalculation = (type: 'cec-adulto' | 'cec-pediatrico') => {
    onNavigateToCalculation(type, selectedPatient || undefined);
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedPatient(null);
    setEditingPatient(null);
  };

  if (currentView === 'form') {
    return (
      <PatientForm
        patient={editingPatient || undefined}
        onSave={handleSavePatient}
        onCancel={handleBackToList}
      />
    );
  }

  if (currentView === 'history' && selectedPatient) {
    return (
      <PatientHistory
        patient={selectedPatient}
        onBack={handleBackToList}
        onNewCalculation={handleNewCalculation}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Pacientes</h2>
          <p className="text-muted-foreground">
            Administre los datos y el historial de cálculos de sus pacientes
          </p>
        </div>
        <Button onClick={handleNewPatient}>
          <UserPlus className="h-4 w-4 mr-2" />
          Nuevo Paciente
        </Button>
      </div>

      <PatientList
        patients={patients}
        onSelectPatient={handleSelectPatient}
        onEditPatient={handleEditPatient}
        onDeletePatient={handleDeletePatient}
      />
    </div>
  );
};

export default PatientManager;