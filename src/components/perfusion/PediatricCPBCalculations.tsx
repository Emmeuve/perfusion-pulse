import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calculator, FileText, Save, AlertCircle } from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { PatientWithCalculations } from '@/types/Patient';

// Importar funciones de cálculo centralizadas
import * as calculations from '@/services/calculations';
import type { CECPediatricCalculationInput, CECPediatricCalculationResult } from '@/types';

interface PediatricCPBCalculationsProps {
  selectedPatient?: PatientWithCalculations;
}

const PediatricCPBCalculations = ({ selectedPatient }: PediatricCPBCalculationsProps) => {
  const { addCalculation } = usePatients();
  
  // Input states
  const [weight, setWeight] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [ageYears, setAgeYears] = useState<number>(0);
  const [ageMonths, setAgeMonths] = useState<number>(0);
  const [currentHematocrit, setCurrentHematocrit] = useState<number>(0);
  const [desiredHematocrit, setDesiredHematocrit] = useState<number>(25);
  const [primingVolume, setPrimingVolume] = useState<number>(0);
  const [volumeOption, setVolumeOption] = useState<string>('75');
  const [cardiacIndexOption, setCardiacIndexOption] = useState<string>('2.5');
  const [zScoreAnnulus, setZScoreAnnulus] = useState<number | undefined>();
  
  // Estado para errores y resultados
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<CECPediatricCalculationResult | null>(null);

  // Load patient data if provided
  useEffect(() => {
    if (selectedPatient) {
      setAgeYears(selectedPatient.age);
    }
  }, [selectedPatient]);

  // Función helper para obtener categoría de edad
  const getAgeCategory = () => {
    const totalMonths = ageYears * 12 + ageMonths;
    if (totalMonths < 1) return 'neonatal';
    if (totalMonths < 12) return 'infant';
    return 'pediatric';
  };

  // Función helper para obtener rango de índice cardíaco según edad
  const getCardiacIndexRangeForAge = () => {
    const category = getAgeCategory();
    switch (category) {
      case 'neonatal': return { min: 3.0, max: 3.5, default: '3.2' };
      case 'infant': return { min: 2.5, max: 3.0, default: '2.8' };
      case 'pediatric': return { min: 2.2, max: 2.8, default: '2.5' };
      default: return { min: 2.5, max: 3.0, default: '2.8' };
    }
  };

  // Función para realizar los cálculos
  const performCalculations = () => {
    try {
      setError(null);

      // Validar datos de entrada
      if (!weight || !height || !currentHematocrit || !primingVolume) {
        setError('Por favor completa todos los campos requeridos');
        setResults(null);
        return;
      }

      // Preparar input
      const input: CECPediatricCalculationInput = {
        weight,
        height,
        ageYears: ageYears + ageMonths / 12,
        targetHematocrit: desiredHematocrit,
        primingVolume,
        volumeOption,
        cardiacIndexOption,
        zScoreAnnulus,
      };

      // Realizar cálculos usando funciones centralizadas
      const calcResults: CECPediatricCalculationResult = {
        surfaceArea: calculations.calculateSurfaceArea(height, weight),
        totalVolume: calculations.calculateTotalVolume(weight, volumeOption),
        flow: calculations.calculateFlow(weight, cardiacIndexOption),
        postPrimingHct: calculations.calculatePostPrimingHct(
          currentHematocrit,
          primingVolume,
          desiredHematocrit,
          calculations.calculateTotalVolume(weight, volumeOption)
        ),
        cerebralFlow: calculations.calculateCerebralFlow(weight),
        coronaryFlow: calculations.calculateCoronaryFlow(weight),
        recommendedVolume: calculations.getPediatricVolumeByAge(ageYears + ageMonths / 12),
        zScore: zScoreAnnulus 
          ? calculations.calculateZScore(zScoreAnnulus, calculations.calculateSurfaceArea(height, weight))
          : undefined,
        calculatedAt: new Date(),
      };

      setResults(calcResults);
    } catch (err) {
      setError((err as Error).message);
      setResults(null);
    }
  };

  // Trigger calculations cuando cambian los inputs
  useEffect(() => {
    if (weight && height && currentHematocrit && primingVolume) {
      performCalculations();
    }
  }, [weight, height, ageYears, ageMonths, currentHematocrit, desiredHematocrit, primingVolume, volumeOption, cardiacIndexOption, zScoreAnnulus]);

  const handleSaveCalculation = () => {
    if (!selectedPatient) {
      alert('Debe seleccionar un paciente para guardar el cálculo');
      return;
    }

    if (!results) {
      alert('Por favor completa los cálculos primero');
      return;
    }

    const calculation = {
      patientId: selectedPatient.id,
      type: 'cec-pediatrico' as const,
      inputs: {
        weight,
        height,
        ageYears: ageYears + ageMonths / 12,
        currentHematocrit,
        desiredHematocrit,
        primingVolume,
        volumeOption,
        cardiacIndexOption,
        zScoreAnnulus,
      },
      outputs: {
        bsa: results.surfaceArea,
        totalBloodVolume: results.totalVolume,
        pumpFlowRate: results.flow,
        dilutionalHematocrit: results.postPrimingHct,
        cerebralFlow: results.cerebralFlow,
        cardiacFlow: results.coronaryFlow,
        recommendedVolume: results.recommendedVolume,
        zScore: results.zScore,
      },
    };

    addCalculation(calculation);
    alert('Cálculo guardado exitosamente');
  };

  const ageCategory = getAgeCategory();
  const cardiacIndexRange = getCardiacIndexRangeForAge();

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
                Parámetros del Paciente Pediátrico
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Error Alert */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Datos Antropométricos */}
              <div>
                <h3 className="font-semibold text-sm mb-3 text-gray-700">Datos Antropométricos</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Peso (kg) *</Label>
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
                    <Label htmlFor="height">Altura (cm) *</Label>
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
              </div>

              {/* Edad */}
              <div>
                <h3 className="font-semibold text-sm mb-3 text-gray-700">Edad</h3>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="space-y-2">
                    <Label htmlFor="ageYears">Años</Label>
                    <Input
                      id="ageYears"
                      type="number"
                      step="1"
                      min="0"
                      value={ageYears || ''}
                      onChange={(e) => setAgeYears(parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ageMonths">Meses</Label>
                    <Input
                      id="ageMonths"
                      type="number"
                      step="1"
                      min="0"
                      max="11"
                      value={ageMonths || ''}
                      onChange={(e) => setAgeMonths(parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-xs text-gray-600">Categoría:</Label>
                  <Badge 
                    variant={
                      ageCategory === 'neonatal' ? 'destructive' : 
                      ageCategory === 'infant' ? 'default' : 
                      'secondary'
                    }
                  >
                    {ageCategory === 'neonatal' ? 'Neonato (<1 mes)' : 
                     ageCategory === 'infant' ? 'Lactante (1-12 meses)' : 
                     'Niño (>1 año)'}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Hematocrito */}
              <div>
                <h3 className="font-semibold text-sm mb-3 text-gray-700">Hematocrito</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentHematocrit">Actual (%) *</Label>
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
                    <Label htmlFor="desiredHematocrit">Deseado (%)</Label>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="primingVolume">Volumen de Cebado (mL) *</Label>
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

              <Separator />

              {/* Parámetros de Perfusión */}
              <div>
                <h3 className="font-semibold text-sm mb-3 text-gray-700">Parámetros de Perfusión</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="volumeOption">Volemia Recomendada (mL/kg)</Label>
                    <Select value={volumeOption} onValueChange={setVolumeOption}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="75">Estándar: 75 mL/kg</SelectItem>
                        <SelectItem value="80">Alto: 80 mL/kg</SelectItem>
                        <SelectItem value="85">Muy alto (Neonatos): 85 mL/kg</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardiacIndex">
                      Índice Cardíaco (L/min/m²)
                      <span className="text-xs text-muted-foreground ml-2">
                        Rango: {cardiacIndexRange.min} - {cardiacIndexRange.max}
                      </span>
                    </Label>
                    <Select 
                      value={cardiacIndexOption} 
                      onValueChange={setCardiacIndexOption}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ageCategory === 'neonatal' && (
                          <>
                            <SelectItem value="3.0">Bajo: 3.0</SelectItem>
                            <SelectItem value="3.2">Estándar: 3.2</SelectItem>
                            <SelectItem value="3.5">Alto: 3.5</SelectItem>
                          </>
                        )}
                        {ageCategory === 'infant' && (
                          <>
                            <SelectItem value="2.5">Bajo: 2.5</SelectItem>
                            <SelectItem value="2.8">Estándar: 2.8</SelectItem>
                            <SelectItem value="3.0">Alto: 3.0</SelectItem>
                          </>
                        )}
                        {ageCategory === 'pediatric' && (
                          <>
                            <SelectItem value="2.2">Bajo: 2.2</SelectItem>
                            <SelectItem value="2.5">Estándar: 2.5</SelectItem>
                            <SelectItem value="2.8">Alto: 2.8</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Z-Score (Opcional) */}
              <div className="space-y-2">
                <Label htmlFor="zScore">Z-Score Anillo Valvular (mm) - Opcional</Label>
                <Input
                  id="zScore"
                  type="number"
                  step="0.1"
                  value={zScoreAnnulus || ''}
                  onChange={(e) => setZScoreAnnulus(e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="Diámetro del anillo en mm"
                />
                {zScoreAnnulus && results && (
                  <p className="text-xs text-gray-600">
                    Z-Score calculado: {results.zScore?.toFixed(1)}
                  </p>
                )}
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
              {results ? (
                <>
                  {/* Fila 1: SC y Volemia */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground">Superficie Corporal</div>
                      <div className="text-lg font-semibold">{results.surfaceArea.toFixed(2)} m²</div>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground">Volemia Total</div>
                      <div className="text-lg font-semibold">{results.totalVolume.toFixed(0)} mL</div>
                    </div>
                  </div>

                  {/* Flujo de Bomba - Destacado */}
                  <div className="p-4 bg-medical-primary-light rounded-lg border border-medical-primary">
                    <div className="text-sm font-medium text-medical-primary mb-1">Flujo de Bomba</div>
                    <div className="text-2xl font-bold text-medical-primary">{results.flow.toFixed(2)} L/min</div>
                    <div className="text-xs text-medical-primary/80 mt-1">
                      ({(results.flow * 1000).toFixed(0)} mL/min)
                    </div>
                  </div>

                  {/* Hematocrito y Flujos */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground">Hto Post-Priming</div>
                      <div className="text-lg font-semibold text-orange-600">{results.postPrimingHct.toFixed(1)}%</div>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground">Flujo Cerebral</div>
                      <div className="text-lg font-semibold">{results.cerebralFlow.toFixed(0)} mL/min</div>
                    </div>
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground">Flujo Coronario</div>
                    <div className="text-lg font-semibold">{results.coronaryFlow.toFixed(0)} mL/min</div>
                  </div>

                  {selectedPatient && (
                    <Button 
                      onClick={handleSaveCalculation} 
                      className="w-full mt-4"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Cálculo
                    </Button>
                  )}
                </>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-600">
                  <p className="text-sm">Completa los parámetros para ver los resultados</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Age-specific Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Consideraciones Pediátricas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-semibold text-blue-900 mb-2">Parámetros según categoría:</p>
                <ul className="space-y-1 text-blue-800 text-xs">
                  {ageCategory === 'neonatal' && (
                    <>
                      <li>✓ Volemia: {results?.recommendedVolume || 85} mL/kg</li>
                      <li>✓ Índice cardíaco: 3.0-3.5 L/min/m²</li>
                      <li>✓ Hematocrito objetivo: 20-25%</li>
                      <li>✓ Flujo cerebral: 15% del gasto cardíaco</li>
                    </>
                  )}
                  {ageCategory === 'infant' && (
                    <>
                      <li>✓ Volemia: {results?.recommendedVolume || 80} mL/kg</li>
                      <li>✓ Índice cardíaco: 2.5-3.0 L/min/m²</li>
                      <li>✓ Hematocrito objetivo: 22-25%</li>
                      <li>✓ Flujo cerebral: 15% del gasto cardíaco</li>
                    </>
                  )}
                  {ageCategory === 'pediatric' && (
                    <>
                      <li>✓ Volemia: {results?.recommendedVolume || 75} mL/kg</li>
                      <li>✓ Índice cardíaco: 2.2-2.8 L/min/m²</li>
                      <li>✓ Hematocrito objetivo: 23-25%</li>
                      <li>✓ Flujo cerebral: 15% del gasto cardíaco</li>
                    </>
                  )}
                </ul>
              </div>

              {results && results.postPrimingHct < 20 && (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="font-semibold text-yellow-900 text-xs">
                    ⚠️ Hematocrito post-priming muy bajo. Considerar reducir volumen de cebado.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PediatricCPBCalculations;