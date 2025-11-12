import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Heart, TrendingUp } from 'lucide-react';

interface HemodynamicValue {
  parameter: string;
  abbreviation: string;
  unit: string;
  normalRange: { adult: string; pediatric: string; neonatal: string };
  formula?: string;
  interpretation: string;
  clinical_notes: string;
}

const HemodynamicValuesCard = () => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [calculations, setCalculations] = useState<{ [key: string]: string }>({});

  const hemodynamicValues: HemodynamicValue[] = [
    {
      parameter: 'Presión Arterial Media',
      abbreviation: 'PAM',
      unit: 'mmHg',
      normalRange: {
        adult: '70-100',
        pediatric: '60-90',
        neonatal: '50-70',
      },
      formula: 'PAM = PAS + 2(PAD) / 3\nO: PAM = PAD + (PAS - PAD) / 3',
      interpretation: 'Presión promedio en la circulación sistémica. Crítica para perfusión de órganos.',
      clinical_notes:
        'Mantener > 50 mmHg en cirugía para evitar disfunción orgánica. En CEC, objetivo 50-80 mmHg.',
    },
    {
      parameter: 'Presión Venosa Central',
      abbreviation: 'PVC',
      unit: 'cmH2O o mmHg',
      normalRange: {
        adult: '2-8 cmH2O (1.5-6 mmHg)',
        pediatric: '2-8 cmH2O',
        neonatal: '1-6 cmH2O',
      },
      interpretation:
        'Refleja la precarga del ventrículo derecho. Indicador de volemia y función VD.',
      clinical_notes:
        'PVC bajo: Hipovolemia, vasodilatación. PVC alto: Insuficiencia cardíaca, ARDS, tamponamiento.',
    },
    {
      parameter: 'Gasto Cardíaco',
      abbreviation: 'GC',
      unit: 'L/min',
      normalRange: {
        adult: '4-8',
        pediatric: '2-5',
        neonatal: '0.4-1.2',
      },
      formula:
        'GC = Volumen sistólico × Frecuencia cardíaca\nGC = VO2 / (CaO2 - CvO2) × 10',
      interpretation: 'Volumen de sangre bombeado por el corazón por minuto.',
      clinical_notes:
        'Bajo GC: Choque cardiogénico, requiere inotrópicos. Alto GC: Sepsis, anemia, hipertiroidismo.',
    },
    {
      parameter: 'Índice Cardíaco',
      abbreviation: 'IC',
      unit: 'L/min/m²',
      normalRange: {
        adult: '2.4-4.2',
        pediatric: '2.5-3.5',
        neonatal: '3.0-4.0',
      },
      formula: 'IC = GC / BSA\nGC ajustado por superficie corporal',
      interpretation: 'GC normalizado para tamaño corporal.',
      clinical_notes:
        'Más confiable que GC solo. IC bajo: Disfunción miocárdica. Objetivo CEC adulto: 2.4 L/min/m².',
    },
    {
      parameter: 'Volumen Sistólico',
      abbreviation: 'VS',
      unit: 'mL',
      normalRange: {
        adult: '60-130',
        pediatric: '30-80',
        neonatal: '3-5',
      },
      formula: 'VS = GC / FC × 1000',
      interpretation: 'Volumen de sangre eyectado por ventrículo por latido.',
      clinical_notes:
        'Disminuye con contractilidad baja o presión elevada. Aumenta con precarga. Importante en CEC.',
    },
    {
      parameter: 'Índice de Volumen Sistólico',
      abbreviation: 'IVS',
      unit: 'mL/m²',
      normalRange: {
        adult: '25-45',
        pediatric: '25-35',
        neonatal: '25-35',
      },
      formula: 'IVS = VS / BSA',
      interpretation: 'VS normalizado por superficie corporal.',
      clinical_notes:
        'IVS bajo: Miocardio disfuncional. IVS alto: Dilatación ventricular. Monitorear en CEC.',
    },
    {
      parameter: 'Frecuencia Cardíaca',
      abbreviation: 'FC',
      unit: 'lpm (latidos/min)',
      normalRange: {
        adult: '60-100',
        pediatric: '80-140',
        neonatal: '120-160',
      },
      interpretation: 'Número de contracciones cardíacas por minuto.',
      clinical_notes:
        'FC baja: Bradicardia (hipotermia, bloqueo, medicamentos). FC alta: Taquicardia (estrés, hipoxia).',
    },
    {
      parameter: 'Resistencia Vascular Sistémica',
      abbreviation: 'RVS',
      unit: 'mmHg·min/L o Wood Units',
      normalRange: {
        adult: '10-15 Wood Units (800-1200 mmHg·min/L)',
        pediatric: '10-15 Wood Units',
        neonatal: '15-20 Wood Units',
      },
      formula:
        'RVS = (PAM - PVC) / GC × 80\nWood = (PAM - PVC) / GC',
      interpretation:
        'Resistencia a flujo en la circulación sistémica. Refleja vasoconstricción periférica.',
      clinical_notes:
        'RVS alto: Vasoconstricción, shock. RVS bajo: Vasodilatación, sepsis. En CEC intentar mantener normal.',
    },
    {
      parameter: 'Resistencia Vascular Pulmonar',
      abbreviation: 'RVP',
      unit: 'mmHg·min/L o Wood Units',
      normalRange: {
        adult: '1-3 Wood Units (80-240 mmHg·min/L)',
        pediatric: '2-4 Wood Units',
        neonatal: '3-5 Wood Units',
      },
      formula: 'RVP = (PAPm - POt) / GC × 80',
      interpretation: 'Resistencia en la circulación pulmonar.',
      clinical_notes:
        'RVP alto: Enfermedad pulmonar, hipoxia. Post-CEC puede aumentar. Hipoxia y CO2 alto empeoran RVP.',
    },
    {
      parameter: 'Presión Arterial Pulmonar',
      abbreviation: 'PAP',
      unit: 'mmHg',
      normalRange: {
        adult: 'Sistólica 20-30, Media 10-20, Diastólica 8-15',
        pediatric: 'Sistólica 15-25, Media 10-15, Diastólica 5-10',
        neonatal: 'Sistólica 15-25, Media 10-15, Diastólica 5-10',
      },
      interpretation: 'Presión en la arteria pulmonar. Refleja función VD y carga pulmonar.',
      clinical_notes:
        'PAP elevada: Sobrecarga volumen, hipertensión pulmonar. Post-CEC puede aumentar significativamente.',
    },
    {
      parameter: 'Presión de Enclavamiento Pulmonar',
      abbreviation: 'PEP (PAWP)',
      unit: 'mmHg',
      normalRange: {
        adult: '8-15',
        pediatric: '6-12',
        neonatal: '5-10',
      },
      interpretation:
        'Presión reflejada de aurícula izquierda. Indica precarga VI y presión diastólica VI.',
      clinical_notes:
        'PEP alto: Insuficiencia mitral, disfunción VI, edema pulmonar. PEP bajo: Hipovolemia.',
    },
    {
      parameter: 'Flujo Sanguíneo Cerebral',
      abbreviation: 'FSC',
      unit: 'mL/100g/min',
      normalRange: {
        adult: '50-60',
        pediatric: '50-70',
        neonatal: '40-60',
      },
      formula: 'FSC = GC × (0.1 - 0.15) = Aproximadamente 10-15% del GC',
      interpretation: 'Flujo de sangre a través del encéfalo.',
      clinical_notes:
        'Crítico mantener en CEC. Hipotermia disminuye demanda. Monitorear presión de perfusión cerebral.',
    },
    {
      parameter: 'Flujo Coronario',
      abbreviation: 'FC',
      unit: 'mL/min',
      normalRange: {
        adult: '200-300 (en reposo)',
        pediatric: '100-200',
        neonatal: '20-50',
      },
      formula: 'FC = GC × (0.05 - 0.06) = Aproximadamente 5-6% del GC',
      interpretation: 'Flujo de sangre a través de las arterias coronarias.',
      clinical_notes:
        'En CEC, asegurar flujo anterógrado con cardioplegia. Post-CEC, restaurar flujo gradualmente.',
    },
    {
      parameter: 'Flujo Renal',
      abbreviation: 'FR',
      unit: 'mL/min',
      normalRange: {
        adult: '1000-1200 (20-25% del GC)',
        pediatric: '500-1000',
        neonatal: '30-200',
      },
      formula: 'FR = GC × (0.2 - 0.25) = 20-25% del GC',
      interpretation: 'Flujo de sangre a través de los riñones.',
      clinical_notes:
        'En CEC, mantener presión media > 50 mmHg. Hipoperfusión causa lesión renal aguda.',
    },
  ];

  const getStatusColor = (value: string, normal: string): string => {
    const [min, max] = normal.split('-').map(v => parseFloat(v));
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'gray';
    if (numValue < min) return 'blue'; // Bajo
    if (numValue > max) return 'red'; // Alto
    return 'green'; // Normal
  };

  const getStatusLabel = (value: string, normal: string): string => {
    const [min, max] = normal.split('-').map(v => parseFloat(v));
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'Sin datos';
    if (numValue < min) return '↓ Bajo';
    if (numValue > max) return '↑ Alto';
    return '✓ Normal';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Heart className="h-6 w-6" />
            Valores Hemodinámicos
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Parámetros clave con rangos normales, fórmulas e interpretación clínica
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Seleccionar Grupo de Edad */}
          <Tabs defaultValue="adult" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="adult">Adulto</TabsTrigger>
              <TabsTrigger value="pediatric">Pediátrico</TabsTrigger>
              <TabsTrigger value="neonatal">Neonatal</TabsTrigger>
            </TabsList>

            {(['adult', 'pediatric', 'neonatal'] as const).map(ageGroup => (
              <TabsContent key={ageGroup} value={ageGroup} className="space-y-4 mt-6">
                {/* Tabla de Valores */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 border-b-2">
                        <th className="p-3 text-left font-semibold">Parámetro</th>
                        <th className="p-3 text-center font-semibold">Abreviatura</th>
                        <th className="p-3 text-center font-semibold">Unidad</th>
                        <th className="p-3 text-center font-semibold">Rango Normal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hemodynamicValues.map(hv => (
                        <tr
                          key={hv.parameter}
                          onClick={() => 
                            setSelectedValue(selectedValue === hv.parameter ? null : hv.parameter)
                          }
                          className="border-b hover:bg-gray-50 cursor-pointer"
                        >
                          <td className="p-3 font-medium">{hv.parameter}</td>
                          <td className="p-3 text-center">
                            <Badge variant="outline">{hv.abbreviation}</Badge>
                          </td>
                          <td className="p-3 text-center text-gray-600">{hv.unit}</td>
                          <td className="p-3 text-center font-semibold">
                            {hv.normalRange[ageGroup]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Detalles del Valor Seleccionado */}
                {selectedValue && (
                  <div className="mt-6 pt-6 border-t space-y-4">
                    {(() => {
                      const selected = hemodynamicValues.find(
                        hv => hv.parameter === selectedValue
                      );
                      if (!selected) return null;

                      return (
                        <>
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h3 className="font-bold text-lg text-blue-900 mb-2">
                              {selected.parameter}
                            </h3>
                            <p className="text-sm text-blue-800">
                              <strong>Abreviatura:</strong> {selected.abbreviation} | 
                              <strong className="ml-2">Unidad:</strong> {selected.unit} |
                              <strong className="ml-2">Rango Normal:</strong> {selected.normalRange[ageGroup]}
                            </p>
                          </div>

                          {selected.formula && (
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                              <p className="font-semibold text-green-900 mb-2">📐 Fórmula:</p>
                              <pre className="text-sm text-green-800 whitespace-pre-wrap bg-white p-2 rounded border border-green-300">
                                {selected.formula}
                              </pre>
                            </div>
                          )}

                          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <p className="font-semibold text-purple-900 mb-2">💡 Interpretación:</p>
                            <p className="text-sm text-purple-800">{selected.interpretation}</p>
                          </div>

                          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                            <p className="font-semibold text-yellow-900 mb-2">📌 Notas Clínicas:</p>
                            <p className="text-sm text-yellow-800">{selected.clinical_notes}</p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>

          {/* Guía Rápida de Interpretación */}
          <div className="mt-6 pt-6 border-t space-y-3">
            <h3 className="font-semibold text-sm">🎯 Guía Rápida en CEC</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="font-semibold text-green-900 text-sm mb-2">✓ Objetivos Óptimos</p>
                <ul className="text-xs text-green-800 space-y-1">
                  <li>• PAM: 50-80 mmHg</li>
                  <li>• IC: 2.2-2.6 L/min/m²</li>
                  <li>• RVS: 10-15 Wood Units</li>
                </ul>
              </div>
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="font-semibold text-red-900 text-sm mb-2">⚠️ Valores Críticos</p>
                <ul className="text-xs text-red-800 space-y-1">
                  <li>• PAM {'<'} 50 mmHg: Daño orgánico</li>
                  <li>• IC {'<'} 2.0: Bajo gasto</li>
                  <li>• PAP {'>'} 25: Hipertensión pulmonar</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HemodynamicValuesCard;