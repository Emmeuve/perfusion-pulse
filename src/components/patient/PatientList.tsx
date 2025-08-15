import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PatientWithCalculations } from '@/types/Patient';
import { User, Calculator, Edit, Trash2 } from 'lucide-react';

interface PatientListProps {
  patients: PatientWithCalculations[];
  onSelectPatient: (patient: PatientWithCalculations) => void;
  onEditPatient: (patient: PatientWithCalculations) => void;
  onDeletePatient: (patientId: string) => void;
}

const PatientList = ({ patients, onSelectPatient, onEditPatient, onDeletePatient }: PatientListProps) => {
  if (patients.length === 0) {
    return (
      <div className="text-center py-8">
        <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No hay pacientes registrados</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {patients.map((patient) => (
        <Card key={patient.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {patient.name} {patient.surname}
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">
                  {patient.age} años
                </Badge>
                <Badge variant="outline">
                  <Calculator className="h-3 w-3 mr-1" />
                  {patient.calculations.length}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              {patient.diagnosis && (
                <p className="text-sm">
                  <span className="font-medium">Diagnóstico:</span> {patient.diagnosis}
                </p>
              )}
              {patient.plannedSurgery && (
                <p className="text-sm">
                  <span className="font-medium">Cirugía:</span> {patient.plannedSurgery}
                </p>
              )}
              {patient.surgeonName && (
                <p className="text-sm">
                  <span className="font-medium">Cirujano:</span> {patient.surgeonName}
                </p>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => onSelectPatient(patient)}
                className="flex-1"
              >
                Ver Detalles
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditPatient(patient)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeletePatient(patient.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PatientList;