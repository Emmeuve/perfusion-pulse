import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calculator, FileText, Save } from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { PatientWithCalculations } from '@/types/Patient';

interface PediatricCPBCalculationsProps {
  selectedPatient?: PatientWithCalculations;
}

const PediatricCPBCalculations = ({ selectedPatient }: PediatricCPBCalculationsProps) => {
  const { addCalculation } = usePatients();
  
  // Input states
  const [weight, setWeight] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [age, setAge] = useState<number>(0);
  const [ageUnit, setAgeUnit] = useState<'months' | 'years'>('months');
  const [currentHematocrit, setCurrentHematocrit] = useState<number>(0);
  const [desiredHematocrit, setDesiredHematocrit] = useState<number>(25);
  const [primingVolume, setPrimingVolume] = useState<number>(0);
  const [bloodVolumeMethod, setBloodVolumeMethod] = useState<string>('pediatric-age-based');
  const [cardiacIndex, setCardiacIndex] = useState<number>(3.0);

  // Load patient data if provided
  useEffect(() => {
    if (selectedPatient) {
      setAge(selectedPatient.age);
      setAgeUnit(selectedPatient.age < 2 ? 'months' : 'years');
    }
  }, [selectedPatient]);

  // Age-specific calculations
  const getAgeCategory = () => {
    const ageInMonths = ageUnit === 'years' ? age * 12 : age;
    if (ageInMonths < 1) return 'neonate';
    if (ageInMonths < 12) return 'infant';
    return 'child';
  };

  const getCardiacIndexRange = () => {
    const category = getAgeCategory();
    switch (category) {
      case 'neonate': return { min: 3.0, max: 3.5, default: 3.2 };
      case 'infant': return { min: 2.5, max: 3.0, default: 2.8 };
      case 'child': return { min: 2.2, max: 2.8, default: 2.5 };
      default: return { min: 2.5, max: 3.0, default: 2.8 };
    }
  };

  // Calculations
  const calculateBSA = () => {
    if (weight <= 0 || height <= 0) return 0;
    return Math.sqrt((height * weight) / 3600);
  };

  const calculateBloodVolume = () => {
    if (weight <= 0) return 0;
    
    const category = getAgeCategory();
    let volumePerKg: number;
    
    switch (category) {
      case 'neonate':
        volumePerKg = 85; // 85 mL/kg for neonates
        break;
      case 'infant':
        volumePerKg = 80; // 80 mL/kg for infants
        break;
      case 'child':
        volumePerKg = 75; // 75 mL/kg for children
        break;
      default:
        volumePerKg = 80;
    }
    
    return weight * volumePerKg;
  };

  const calculatePumpFlow = () => {
    const bsa = calculateBSA();
    if (bsa <= 0) return 0;
    return (cardiacIndex * bsa) / 1000; // Convert to L/min
  };

  const calculateDilutionalHematocrit = () => {
    if (currentHematocrit <= 0 || primingVolume <= 0) return currentHematocrit;
    
    const totalBloodVolume = calculateBloodVolume();
    if (totalBloodVolume <= 0) return currentHematocrit;
    
    const dilutedVolume = totalBloodVolume + primingVolume;
    return (currentHematocrit * totalBloodVolume) / dilutedVolume;
  };

  const calculateCerebralFlow = () => {
    return calculatePumpFlow() * 0.15; // 15% for pediatric patients
  };

  const calculateCardiacFlow = () => {
    return calculatePumpFlow() * 0.05; // 5% for cardiac perfusion
  };

  const handleSaveCalculation = () => {
    if (!selectedPatient) {
      alert('Debe seleccionar un paciente para guardar el cálculo');
      return;
    }

    const calculation = {
      patientId: selectedPatient.id,
      type: 'cec-pediatrico' as const,
      inputs: {
        weight,
        height,
        currentHematocrit,
        desiredHematocrit,
        primingVolume,
        bloodVolumeMethod,
        cardiacIndex,
      },
      outputs: {
        bsa: calculateBSA(),
        totalBloodVolume: calculateBloodVolume(),
        pumpFlowRate: calculatePumpFlow(),
        dilutionalHematocrit: calculateDilutionalHematocrit(),
        cerebralFlow: calculateCerebralFlow(),
        cardiacFlow: calculateCardiacFlow(),
      },
    };

    addCalculation(calculation);
    alert('Cálculo guardado exitosamente');
  };

  const bsa = calculateBSA();
  const totalBloodVolume = calculateBloodVolume();
  const pumpFlow = calculatePumpFlow();
  const dilutionalHematocrit = calculateDilutionalHematocrit();
  const cerebralFlow = calculateCerebralFlow();
  const cardiacFlow = calculateCardiacFlow();
  const ageCategory = getAgeCategory();
  const cardiacIndexRange = getCardiacIndexRange();

  return (
    <div className="space-y-6">
      {/* Patient Info */}
      {selectedPatient && (
        <Card className="border-medical-primary-light bg-medical-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Paciente Seleccionado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Nombre:</span>
                <p>{selectedPatient.name} {selectedPatient.surname}</p>
              </div>
              <div>
                <span className="font-medium">Edad:</span>
                <p>{selectedPatient.age} años</p>
              </div>
              <div>
                <span className="font-medium">Diagnóstico:</span>
                <p>{selectedPatient.diagnosis || 'No especificado'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Parámetros del Paciente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    min="0"
                    value={weight || ''}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                    placeholder="0.0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    min="0"
                    value={height || ''}
                    onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Edad</Label>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    value={age || ''}
                    onChange={(e) => setAge(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ageUnit">Unidad</Label>
                  <Select value={ageUnit} onValueChange={(value: 'months' | 'years') => setAgeUnit(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="months">Meses</SelectItem>
                      <SelectItem value="years">Años</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Categoría de Edad:</Label>
                  <Badge variant={ageCategory === 'neonate' ? 'destructive' : ageCategory === 'infant' ? 'default' : 'secondary'}>
                    {ageCategory === 'neonate' ? 'Neonato (<1 mes)' : 
                     ageCategory === 'infant' ? 'Lactante (1-12 meses)' : 
                     'Niño (>1 año)'}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentHematocrit">Hematocrito Actual (%)</Label>
                  <Input
                    id="currentHematocrit"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={currentHematocrit || ''}
                    onChange={(e) => setCurrentHematocrit(parseFloat(e.target.value) || 0)}
                    placeholder="0.0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="desiredHematocrit">Hematocrito Deseado (%)</Label>
                  <Input
                    id="desiredHematocrit"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={desiredHematocrit || ''}
                    onChange={(e) => setDesiredHematocrit(parseFloat(e.target.value) || 0)}
                    placeholder="25.0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primingVolume">Volumen de Cebado (mL)</Label>
                <Input
                  id="primingVolume"
                  type="number"
                  step="1"
                  min="0"
                  value={primingVolume || ''}
                  onChange={(e) => setPrimingVolume(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardiacIndex">
                  Índice Cardíaco (L/min/m²)
                  <span className="text-sm text-muted-foreground ml-2">
                    Rango: {cardiacIndexRange.min} - {cardiacIndexRange.max}
                  </span>
                </Label>
                <Input
                  id="cardiacIndex"
                  type="number"
                  step="0.1"
                  min={cardiacIndexRange.min}
                  max={cardiacIndexRange.max}
                  value={cardiacIndex || ''}
                  onChange={(e) => setCardiacIndex(parseFloat(e.target.value) || cardiacIndexRange.default)}
                  placeholder={cardiacIndexRange.default.toString()}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resultados Calculados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">Superficie Corporal</div>
                  <div className="text-lg font-semibold">{bsa.toFixed(3)} m²</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">Volumen Sanguíneo Total</div>
                  <div className="text-lg font-semibold">{totalBloodVolume.toFixed(0)} mL</div>
                </div>
              </div>

              <div className="p-4 bg-medical-primary-light rounded-lg border border-medical-primary">
                <div className="text-sm font-medium text-medical-primary mb-1">Flujo de Bomba</div>
                <div className="text-2xl font-bold text-medical-primary">{pumpFlow.toFixed(2)} L/min</div>
                <div className="text-xs text-medical-primary/80 mt-1">
                  {(pumpFlow * 1000).toFixed(0)} mL/min
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">Hto Dilucional</div>
                  <div className="text-lg font-semibold">{dilutionalHematocrit.toFixed(1)}%</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">Flujo Cerebral</div>
                  <div className="text-lg font-semibold">{cerebralFlow.toFixed(2)} L/min</div>
                </div>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm font-medium text-muted-foreground">Flujo Cardíaco</div>
                <div className="text-lg font-semibold">{cardiacFlow.toFixed(2)} L/min</div>
              </div>

              {selectedPatient && (
                <Button 
                  onClick={handleSaveCalculation} 
                  className="w-full mt-4"
                  disabled={!weight || !height || !currentHematocrit}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cálculo
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Age-specific Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notas Pediátricas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-800">Consideraciones por edad:</p>
                <ul className="mt-2 space-y-1 text-blue-700">
                  {ageCategory === 'neonate' && (
                    <>
                      <li>• Volumen sanguíneo: 85 mL/kg</li>
                      <li>• Índice cardíaco: 3.0-3.5 L/min/m²</li>
                      <li>• Flujo cerebral: 15% del gasto cardíaco</li>
                    </>
                  )}
                  {ageCategory === 'infant' && (
                    <>
                      <li>• Volumen sanguíneo: 80 mL/kg</li>
                      <li>• Índice cardíaco: 2.5-3.0 L/min/m²</li>
                      <li>• Flujo cerebral: 15% del gasto cardíaco</li>
                    </>
                  )}
                  {ageCategory === 'child' && (
                    <>
                      <li>• Volumen sanguíneo: 75 mL/kg</li>
                      <li>• Índice cardíaco: 2.2-2.8 L/min/m²</li>
                      <li>• Flujo cerebral: 15% del gasto cardíaco</li>
                    </>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PediatricCPBCalculations;