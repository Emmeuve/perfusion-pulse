import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Pill, AlertCircle, Calculator } from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  genericName?: string;
  category: string;
  dosage: string;
  route: string;
  indications: string[];
  contraindications?: string[];
  sideEffects?: string[];
  notes?: string;
}

const MedicationsDosageCard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
  const [patientWeight, setPatientWeight] = useState<string>('');
  const [calculatedDose, setCalculatedDose] = useState<string>('');

  // Base de medicamentos
  const medications: Medication[] = [
    // Anticoagulantes
    {
      id: 'med_heparina',
      name: 'Heparina Sódica',
      genericName: 'Heparin Sodium',
      category: 'Anticoagulantes',
      dosage: 'Dosis inicial: 50-100 UI/kg IV\nMantención CEC: 300-400 UI/kg\nReversa: 1 mg por 100 UI heparina',
      route: 'IV (bolo o infusión)',
      indications: ['Anticoagulación sistémica CEC', 'ECMO', 'Prevención trombosis'],
      contraindications: ['Alergia', 'Trombocitopenia inducida por heparina'],
      sideEffects: ['Hemorragia', 'Trombocitopenia', 'Osteoporosis (uso crónico)'],
      notes: 'Monitorear ACT durante CEC. Reversible con protamina.',
    },
    {
      id: 'med_protamina',
      name: 'Sulfato de Protamina',
      genericName: 'Protamine Sulfate',
      category: 'Antídotos',
      dosage: '1 mg por 100 UI de heparina residual\nMáximo: 50 mg en 10 minutos',
      route: 'IV lento',
      indications: ['Reversión de anticoagulación heparina'],
      contraindications: ['Alergia al pescado'],
      sideEffects: ['Hipotensión', 'Bradicardia', 'Reacción anafiláctica'],
      notes: 'Administrar lentamente para evitar hipotensión severa.',
    },

    // Inotrópicos
    {
      id: 'med_dopamina',
      name: 'Dopamina',
      genericName: 'Dopamine',
      category: 'Inotrópicos',
      dosage: 'Bajo: 2-5 mcg/kg/min (vasodilatación renal)\nMedio: 5-10 mcg/kg/min (inotrópico)\nAlto: 10-20 mcg/kg/min (vasoconstricción)',
      route: 'IV infusión',
      indications: ['Soporte inotrópico', 'Hipotensión', 'Bajo gasto cardíaco post-CEC'],
      contraindications: ['Feocromocitoma', 'Arritmias ventriculares'],
      sideEffects: ['Taquicardia', 'Arritmias', 'Vasoconstricción'],
      notes: 'Dosis dependiente del efecto deseado. Usar línea central si es posible.',
    },
    {
      id: 'med_dobutamina',
      name: 'Dobutamina',
      genericName: 'Dobutamine',
      category: 'Inotrópicos',
      dosage: '2-20 mcg/kg/min IV infusión\nInicio: 5 mcg/kg/min',
      route: 'IV infusión',
      indications: ['Insuficiencia cardíaca', 'Bajo gasto cardíaco', 'Shock cardiogénico'],
      contraindications: ['Feocromocitoma', 'Hipertensión severa sin control'],
      sideEffects: ['Taquicardia', 'Hipertensión', 'Arritmias', 'Cefalea'],
      notes: 'Mejor tolerabilidad que dopamina para inotrópismo puro.',
    },
    {
      id: 'med_milrinona',
      name: 'Milrinona',
      genericName: 'Milrinone',
      category: 'Inodilatadores',
      dosage: 'Bolo: 50 mcg/kg en 10-60 min\nMantención: 0.25-0.75 mcg/kg/min',
      route: 'IV',
      indications: ['Falla cardíaca', 'Post-CEC con disfunción', 'Insuficiencia diastólica'],
      contraindications: ['Obstrucción TSVI'],
      sideEffects: ['Hipotensión', 'Arritmias', 'Trombocitopenia'],
      notes: 'Inodilatador: aumenta contractilidad y causa vasodilatación.',
    },
    {
      id: 'med_levosimendan',
      name: 'Levosimendan',
      genericName: 'Levosimendan',
      category: 'Inotrópicos',
      dosage: 'Bolo: 24 mcg/kg en 10 min\nMantención: 0.1-0.2 mcg/kg/min',
      route: 'IV',
      indications: ['Falla cardíaca aguda', 'Post-CEC', 'Bajo gasto cardíaco'],
      contraindications: ['Hipotensión severa'],
      sideEffects: ['Hipotensión', 'Taquicardia', 'Cefalea'],
      notes: 'No disponible en todos los países. Mayor eficacia que dopamina.',
    },

    // Vasopresores
    {
      id: 'med_epinefrina',
      name: 'Epinefrina (Adrenalina)',
      genericName: 'Epinephrine',
      category: 'Vasopresores',
      dosage: 'Bajo: 0.01-0.05 mcg/kg/min\nAlto: 0.05-0.5 mcg/kg/min\nParo: 0.1 mg IV cada 3-5 min',
      route: 'IV infusión',
      indications: ['Shock cardiogénico', 'Paro cardíaco', 'Hipotensión severa'],
      contraindications: ['Coronariopatía descontrolada'],
      sideEffects: ['Taquicardia', 'Hipertensión', 'Arritmias', 'Isquemia'],
      notes: 'Usar línea central para evitar extravasación. Monitoreo continuo.',
    },
    {
      id: 'med_norepinefrina',
      name: 'Norepinefrina',
      genericName: 'Norepinephrine',
      category: 'Vasopresores',
      dosage: '0.01-0.5 mcg/kg/min IV infusión\nInicio: 0.05-0.1 mcg/kg/min',
      route: 'IV infusión',
      indications: ['Shock séptico/cardiogénico', 'Hipotensión post-CEC', 'Insuficiencia vasomoción'],
      contraindications: ['Vasoespasmo coronario no controlado'],
      sideEffects: ['Hipertensión', 'Cefalea', 'Taquicardia'],
      notes: 'Equilibrio entre inotrópismo y vasoconstricción. Usar línea central.',
    },
    {
      id: 'med_vasopresina',
      name: 'Vasopresina',
      genericName: 'Vasopressin',
      category: 'Vasopresores',
      dosage: '0.03-0.1 U/kg/min IV infusión\nBolo paro: 40 U IV',
      route: 'IV infusión',
      indications: ['Shock refractario', 'Hipotensión post-CEC', 'Paro cardíaco'],
      contraindications: ['Enfermedad coronaria sin control'],
      sideEffects: ['Isquemia', 'Arritmias', 'Úlcera gastrointestinal'],
      notes: 'Uso en dosis bajas. Considerar segunda línea.',
    },

    // Vasodilatadores
    {
      id: 'med_nitroglicerina',
      name: 'Nitroglicerina',
      genericName: 'Nitroglycerin',
      category: 'Vasodilatadores',
      dosage: '0.5-10 mcg/kg/min IV infusión\nSublingual: 0.3-0.6 mg',
      route: 'IV infusión o sublingual',
      indications: ['Isquemia coronaria', 'Hipertensión intraoperatoria', 'Insuficiencia cardíaca'],
      contraindications: ['Inhibidores de fosfodiesterasa recientes'],
      sideEffects: ['Cefalea', 'Hipotensión', 'Tolerancia (uso prolongado)'],
      notes: 'Dilata venas más que arterias. Proteger de luz.',
    },
    {
      id: 'med_nitroprusiato',
      name: 'Nitroprusiato de Sodio',
      genericName: 'Sodium Nitroprusside',
      category: 'Vasodilatadores',
      dosage: '0.5-8 mcg/kg/min IV infusión',
      route: 'IV infusión',
      indications: ['Crisis hipertensiva', 'Vasoespasmo', 'Afterload reduction'],
      contraindications: ['Insuficiencia renal severa'],
      sideEffects: ['Hipotensión', 'Toxicidad por tiocianato (>48h)', 'Cefalea'],
      notes: 'Vasodilatador potente y rápido. Proteger de luz. Monitoreo de tiocianato.',
    },
    {
      id: 'med_esmolol',
      name: 'Esmolol',
      genericName: 'Esmolol',
      category: 'Beta-bloqueantes',
      dosage: 'Bolo: 0.5-1 mg/kg en 1 min\nMantención: 50-300 mcg/kg/min',
      route: 'IV',
      indications: ['Taquicardia intraoperatoria', 'Hipertensión', 'Arritmias'],
      contraindications: ['Bloqueo AV', 'Shock cardiogénico', 'Asma'],
      sideEffects: ['Hipotensión', 'Bradicardia', 'Broncoespasmo'],
      notes: 'Vida media muy corta (~9 min). Acción rápida y reversible.',
    },

    // Electrolitos y Correcciones
    {
      id: 'med_bicarb_sodio',
      name: 'Bicarbonato de Sodio',
      genericName: 'Sodium Bicarbonate',
      category: 'Electrolitos',
      dosage: 'Corrección: mEq = 0.3 × peso (kg) × (HCO3 deseado - HCO3 actual)\n8.4%: 1 mEq/mL\n7.5%: 0.89 mEq/mL',
      route: 'IV lento',
      indications: ['Acidosis metabólica', 'Post-CEC', 'Reanimación'],
      contraindications: ['Alcalemia'],
      sideEffects: ['Alcalemia', 'Hipocalcemia', 'Hipokalemia'],
      notes: 'Dilatar en suero. Monitorear pH. Evitar en alcalemia severa.',
    },
    {
      id: 'med_cloruro_potasio',
      name: 'Cloruro de Potasio',
      genericName: 'Potassium Chloride',
      category: 'Electrolitos',
      dosage: 'Déficit = (5 - K actual) × 0.4 × peso\nMáximo: 10-20 mEq/hora en vena periférica',
      route: 'IV lento',
      indications: ['Hipocaliemia', 'Arritmias post-CEC', 'Debilidad muscular'],
      contraindications: ['Hipercaliemia', 'Bloqueo AV'],
      sideEffects: ['Hipercaliemia', 'Arritmias', 'Flebitis (periférica)'],
      notes: 'Siempre IV lento. Monitorear ECG. Usar línea central si es posible.',
    },
    {
      id: 'med_gluconato_calcio',
      name: 'Gluconato de Calcio',
      genericName: 'Calcium Gluconate',
      category: 'Electrolitos',
      dosage: 'Hipocalcemia: 100-200 mg IV lento\nPost-CEC: 10-20 mEq',
      route: 'IV lento (5-10 min)',
      indications: ['Hipocalcemia', 'Post-CEC', 'Hiperkalemia (antagonista)'],
      contraindications: ['Hipercalcemia'],
      sideEffects: ['Bradicardia', 'Arritmias', 'Necrosis tisular (extravasación)'],
      notes: 'No mezclar con bicarbonato. Monitorear ECG durante infusión.',
    },

    // Otros
    {
      id: 'med_furosemida',
      name: 'Furosemida (Lasix)',
      genericName: 'Furosemide',
      category: 'Diuréticos',
      dosage: 'IV: 0.5-1 mg/kg cada 4-6 horas\nMáximo: 200 mg/día',
      route: 'IV o IM',
      indications: ['Edema pulmonar', 'Sobrecarga de volumen post-CEC', 'Hipercaliemia'],
      contraindications: ['Hipovolemia severa', 'Insuficiencia renal aguda'],
      sideEffects: ['Hipokalemia', 'Hipotensión', 'Ototoxicidad (dosis altas)'],
      notes: 'Monitorear electrolitos. Reposición de K+ necesaria.',
    },
    {
      id: 'med_dexametasona',
      name: 'Dexametasona',
      genericName: 'Dexamethasone',
      category: 'Corticosteroides',
      dosage: 'Inflamación post-CEC: 0.1 mg/kg IV (máx 10 mg)\nManejo inflamación: 4-8 mg cada 6-8 horas',
      route: 'IV',
      indications: ['Síndrome de respuesta inflamatoria sistémica post-CEC', 'Edema laringo-traqueal'],
      contraindications: ['Infección no controlada', 'Vacunación viva reciente'],
      sideEffects: ['Hiperglucemia', 'Inmunosupresión', 'Psicosis (raros)'],
      notes: 'Usar dosis mínima. Protege endotelio en CEC prolongada.',
    },
    {
      id: 'med_mannitol',
      name: 'Manitol',
      genericName: 'Mannitol',
      category: 'Agentes Osmóticos',
      dosage: '0.25-1 g/kg IV en 15-30 minutos\nMantención: 0.25 g/kg cada 4-6 horas',
      route: 'IV infusión',
      indications: ['Edema cerebral post-CEC', 'Oliguria', 'Neuroprotección ECMO'],
      contraindications: ['Deshidratación severa', 'Insuficiencia renal anúrica'],
      sideEffects: ['Deshidratación', 'Hipernatremia', 'Rebound edema'],
      notes: 'Usar durante CEC para protección del SNC. Monitorear osmolalidad.',
    },
  ];

  // Categorías únicas
  const categories = Array.from(new Set(medications.map(m => m.category)));

  // Filtrar medicamentos
  const filteredMeds = medications.filter(med => {
    const matchesSearch = 
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.genericName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || med.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCalculateDose = (dosageRange: string) => {
    if (!patientWeight) {
      setCalculatedDose('Ingresa el peso del paciente');
      return;
    }

    // Intentar extraer rango de dosis
    const matches = dosageRange.match(/(\d+(?:\.\d+)?)\s*(?:-|a)\s*(\d+(?:\.\d+)?)\s*mcg\/kg/i);
    if (matches) {
      const minDose = parseFloat(matches[1]);
      const maxDose = parseFloat(matches[2]);
      const weight = parseFloat(patientWeight);
      const minCalc = (minDose * weight).toFixed(2);
      const maxCalc = (maxDose * weight).toFixed(2);
      setCalculatedDose(`${minCalc} - ${maxCalc} mcg/min`);
    } else {
      setCalculatedDose('No se pudo calcular. Revisa el formato.');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Pill className="h-6 w-6" />
            Dosis de Medicamentos
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Catálogo de medicamentos comunes en perfusión cardiovascular
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Búsqueda y Filtros */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Buscar Medicamento
              </Label>
              <Input
                id="search"
                placeholder="Ej: dopamina, heparina, potasio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las Categorías</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Calculadora de Dosis */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
            <h3 className="font-semibold text-blue-900 flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Calculadora de Dosis
            </h3>
            <div className="space-y-2">
              <Label htmlFor="weight">Peso del Paciente (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="Ej: 70"
                value={patientWeight}
                onChange={(e) => setPatientWeight(e.target.value)}
              />
            </div>
            {calculatedDose && (
              <div className="p-2 bg-white rounded border border-blue-300">
                <p className="text-sm text-blue-900">
                  <strong>Dosis calculada:</strong> {calculatedDose}
                </p>
              </div>
            )}
          </div>

          {/* Lista de Medicamentos */}
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              {filteredMeds.length} medicamentos encontrados
            </p>

            {filteredMeds.length > 0 ? (
              <div className="space-y-3">
                {filteredMeds.map(med => (
                  <div
                    key={med.id}
                    onClick={() => setSelectedMed(selectedMed?.id === med.id ? null : med)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                      selectedMed?.id === med.id
                        ? 'border-medical-primary bg-medical-primary/5'
                        : 'border-gray-200 hover:border-medical-primary/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-sm">{med.name}</h4>
                        {med.genericName && (
                          <p className="text-xs text-gray-600">{med.genericName}</p>
                        )}
                      </div>
                      <Badge variant="secondary">{med.category}</Badge>
                    </div>

                    {selectedMed?.id === med.id && (
                      <div className="mt-4 space-y-3 pt-4 border-t">
                        {/* Dosis */}
                        <div>
                          <p className="font-semibold text-sm mb-1">📋 Dosis:</p>
                          <p className="text-sm whitespace-pre-wrap bg-gray-50 p-2 rounded">
                            {med.dosage}
                          </p>
                          <button
                            onClick={() => handleCalculateDose(med.dosage)}
                            className="mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                          >
                            Calcular para mi paciente
                          </button>
                        </div>

                        {/* Vía */}
                        <div>
                          <p className="font-semibold text-sm">💉 Vía de Administración:</p>
                          <p className="text-sm text-gray-700">{med.route}</p>
                        </div>

                        {/* Indicaciones */}
                        <div>
                          <p className="font-semibold text-sm mb-1">✅ Indicaciones:</p>
                          <ul className="text-sm space-y-1">
                            {med.indications.map((ind, i) => (
                              <li key={i} className="text-gray-700">• {ind}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Contraindicaciones */}
                        {med.contraindications && (
                          <div>
                            <p className="font-semibold text-sm text-red-700 mb-1">⚠️ Contraindicaciones:</p>
                            <ul className="text-sm space-y-1">
                              {med.contraindications.map((contra, i) => (
                                <li key={i} className="text-red-600">• {contra}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Efectos Secundarios */}
                        {med.sideEffects && (
                          <div>
                            <p className="font-semibold text-sm text-orange-700 mb-1">⚡ Efectos Secundarios:</p>
                            <ul className="text-sm space-y-1">
                              {med.sideEffects.map((effect, i) => (
                                <li key={i} className="text-orange-600">• {effect}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Notas */}
                        {med.notes && (
                          <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
                            <p className="font-semibold text-xs text-yellow-900 mb-1">💡 Notas Clínicas:</p>
                            <p className="text-xs text-yellow-800">{med.notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-600">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No hay medicamentos que coincidan con tu búsqueda</p>
              </div>
            )}
          </div>

          {/* Recomendaciones */}
          <div className="mt-6 pt-6 border-t space-y-3">
            <h3 className="font-semibold text-sm">⚠️ Recomendaciones de Seguridad</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="p-2 bg-red-50 rounded border border-red-200">
                <p className="font-semibold text-red-900">Siempre verificar:</p>
                <ul className="text-xs text-red-800 mt-1 space-y-1">
                  <li>✓ Dosis correcta para peso/edad del paciente</li>
                  <li>✓ Vía de administración apropiada</li>
                  <li>✓ Alergias y contraindicaciones</li>
                  <li>✓ Compatibilidad con otros medicamentos</li>
                  <li>✓ Monitoreo según protocolo</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function TestComponent() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', color: '#000' }}>
      <h1>TEST - Si ves esto, funciona</h1>
      <p>El componente se renderiza correctamente</p>
    </div>
  );
}