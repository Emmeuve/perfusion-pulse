import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PatientWithCalculations } from '@/types/Patient';
import { ArrowLeft, Download, Calculator } from 'lucide-react';

interface PatientHistoryProps {
  patient: PatientWithCalculations;
  onBack: () => void;
  onNewCalculation: (type: 'cec-adulto' | 'cec-pediatrico') => void;
}

const PatientHistory = ({ patient, onBack, onNewCalculation }: PatientHistoryProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-CL');
  };

  const handleNewCalculation = () => {
    // Determinar el tipo basado en la edad
    const type = patient.age >= 18 ? 'cec-adulto' : 'cec-pediatrico';
    onNewCalculation(type);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Pacientes
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">
            {patient.name} {patient.surname}
          </h2>
          <p className="text-muted-foreground">
            {patient.age} años • {patient.gender}
          </p>
        </div>
        <Button onClick={handleNewCalculation}>
          <Calculator className="h-4 w-4 mr-2" />
          Nuevo Cálculo
        </Button>
      </div>

      {/* Patient Info */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Paciente</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          {patient.diagnosis && (
            <div>
              <span className="font-medium">Diagnóstico:</span>
              <p className="text-muted-foreground">{patient.diagnosis}</p>
            </div>
          )}
          {patient.plannedSurgery && (
            <div>
              <span className="font-medium">Cirugía Planificada:</span>
              <p className="text-muted-foreground">{patient.plannedSurgery}</p>
            </div>
          )}
          {patient.surgeonName && (
            <div>
              <span className="font-medium">Cirujano:</span>
              <p className="text-muted-foreground">{patient.surgeonName}</p>
            </div>
          )}
          {patient.medicalHistory && (
            <div>
              <span className="font-medium">Historia Médica:</span>
              <p className="text-muted-foreground">{patient.medicalHistory}</p>
            </div>
          )}
          {patient.allergies && (
            <div>
              <span className="font-medium">Alergias:</span>
              <p className="text-muted-foreground">{patient.allergies}</p>
            </div>
          )}
          {patient.notes && (
            <div className="md:col-span-2">
              <span className="font-medium">Notas:</span>
              <p className="text-muted-foreground">{patient.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Calculations History */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Cálculos ({patient.calculations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {patient.calculations.length === 0 ? (
            <div className="text-center py-8">
              <Calculator className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No hay cálculos registrados</p>
              <Button onClick={handleNewCalculation} className="mt-4">
                Realizar Primer Cálculo
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {patient.calculations
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((calculation) => (
                  <Card key={calculation.id} className="border border-border">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant={calculation.type === 'cec-adulto' ? 'default' : 'secondary'}>
                            {calculation.type === 'cec-adulto' ? 'CEC Adulto' : 'CEC Pediátrica'}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(calculation.timestamp)}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Parámetros:</span>
                          <div className="mt-1 space-y-1 text-muted-foreground">
                            <div>Peso: {calculation.inputs.weight} kg</div>
                            <div>Altura: {calculation.inputs.height} cm</div>
                            <div>Hematocrito: {calculation.inputs.currentHematocrit}%</div>
                            <div>Volumen cebado: {calculation.inputs.primingVolume} mL</div>
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Resultados:</span>
                          <div className="mt-1 space-y-1 text-muted-foreground">
                            <div>SC: {calculation.outputs.bsa} m²</div>
                            <div>Flujo bomba: {calculation.outputs.pumpFlowRate} L/min</div>
                            <div>Hto dilucional: {calculation.outputs.dilutionalHematocrit}%</div>
                            <div>Flujo cerebral: {calculation.outputs.cerebralFlow} L/min</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientHistory;