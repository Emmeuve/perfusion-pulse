import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Activity, Droplet, Heart, Zap } from 'lucide-react';

interface NormalRange {
  parameter: string;
  unit: string;
  adult?: { min: number; max: number };
  pediatric?: { min: number; max: number };
  neonatal?: { min: number; max: number };
  notes?: string;
}

const NormalValuesCard = () => {
  const [ageGroup, setAgeGroup] = useState<'adult' | 'pediatric' | 'neonatal'>('adult');
  const [searchTerm, setSearchTerm] = useState('');

  // Valores Hemodinámicos
  const hemodynamicValues: NormalRange[] = [
    {
      parameter: 'Presión Arterial Media (PAM)',
      unit: 'mmHg',
      adult: { min: 70, max: 100 },
      pediatric: { min: 60, max: 90 },
      neonatal: { min: 50, max: 70 },
      notes: 'Mantenerse en rango para perfusión adecuada',
    },
    {
      parameter: 'Presión Venosa Central (PVC)',
      unit: 'cmH2O',
      adult: { min: 2, max: 8 },
      pediatric: { min: 2, max: 8 },
      neonatal: { min: 1, max: 6 },
      notes: 'Indicador de precarga ventricular',
    },
    {
      parameter: 'Gasto Cardíaco (GC)',
      unit: 'L/min',
      adult: { min: 4, max: 8 },
      pediatric: { min: 2, max: 5 },
      neonatal: { min: 0.4, max: 1.2 },
    },
    {
      parameter: 'Índice Cardíaco (IC)',
      unit: 'L/min/m²',
      adult: { min: 2.4, max: 4.2 },
      pediatric: { min: 2.5, max: 3.5 },
      neonatal: { min: 3.0, max: 4.0 },
      notes: 'GC ajustado por superficie corporal',
    },
    {
      parameter: 'Frecuencia Cardíaca (FC)',
      unit: 'lpm',
      adult: { min: 60, max: 100 },
      pediatric: { min: 80, max: 140 },
      neonatal: { min: 120, max: 160 },
      notes: 'Aumenta con edad menor',
    },
    {
      parameter: 'Presión Pulmonar Sistólica',
      unit: 'mmHg',
      adult: { min: 20, max: 30 },
      pediatric: { min: 15, max: 25 },
      neonatal: { min: 15, max: 25 },
    },
    {
      parameter: 'Presión Pulmonar Media',
      unit: 'mmHg',
      adult: { min: 10, max: 20 },
      pediatric: { min: 10, max: 15 },
      neonatal: { min: 10, max: 15 },
    },
    {
      parameter: 'Presión de Enclavamiento Pulmonar',
      unit: 'mmHg',
      adult: { min: 8, max: 15 },
      pediatric: { min: 6, max: 12 },
      neonatal: { min: 5, max: 10 },
      notes: 'Refleja presión diastólica del VI',
    },
  ];

  // Valores de Oxigenación
  const oxygenationValues: NormalRange[] = [
    {
      parameter: 'Saturación O2 Arterial (SaO2)',
      unit: '%',
      adult: { min: 95, max: 100 },
      pediatric: { min: 95, max: 100 },
      neonatal: { min: 92, max: 98 },
      notes: 'Crítico para función celular',
    },
    {
      parameter: 'Saturación O2 Venosa (SvO2)',
      unit: '%',
      adult: { min: 60, max: 80 },
      pediatric: { min: 65, max: 85 },
      neonatal: { min: 65, max: 85 },
      notes: 'Refleja balance DO2-VO2',
    },
    {
      parameter: 'Presión Arterial de O2 (PaO2)',
      unit: 'mmHg',
      adult: { min: 80, max: 100 },
      pediatric: { min: 75, max: 95 },
      neonatal: { min: 50, max: 80 },
      notes: 'Aumentar en posoperatorio',
    },
    {
      parameter: 'Presión Arterial de CO2 (PaCO2)',
      unit: 'mmHg',
      adult: { min: 35, max: 45 },
      pediatric: { min: 35, max: 45 },
      neonatal: { min: 35, max: 45 },
    },
    {
      parameter: 'pH Arterial',
      unit: 'pH',
      adult: { min: 7.35, max: 7.45 },
      pediatric: { min: 7.35, max: 7.45 },
      neonatal: { min: 7.35, max: 7.45 },
      notes: 'Mantener en rango fisiológico',
    },
    {
      parameter: 'Bicarbonato (HCO3-)',
      unit: 'mEq/L',
      adult: { min: 22, max: 26 },
      pediatric: { min: 22, max: 26 },
      neonatal: { min: 20, max: 24 },
    },
    {
      parameter: 'Lactato',
      unit: 'mmol/L',
      adult: { min: 0.5, max: 2.0 },
      pediatric: { min: 0.5, max: 2.0 },
      neonatal: { min: 1.0, max: 3.0 },
      notes: 'Indicador de isquemia tisular',
    },
    {
      parameter: 'Déficit de Base',
      unit: 'mEq/L',
      adult: { min: -2, max: 2 },
      pediatric: { min: -2, max: 2 },
      neonatal: { min: -2, max: 2 },
    },
  ];

  // Valores de Laboratorio
  const laboratoryValues: NormalRange[] = [
    {
      parameter: 'Hemoglobina',
      unit: 'g/dL',
      adult: { min: 12, max: 16 },
      pediatric: { min: 11, max: 14 },
      neonatal: { min: 14, max: 20 },
      notes: 'Crucial para transporte O2',
    },
    {
      parameter: 'Hematocrito',
      unit: '%',
      adult: { min: 36, max: 46 },
      pediatric: { min: 33, max: 41 },
      neonatal: { min: 42, max: 60 },
      notes: 'Objetivo CEC: 20-25%',
    },
    {
      parameter: 'Potasio (K+)',
      unit: 'mEq/L',
      adult: { min: 3.5, max: 5.0 },
      pediatric: { min: 3.5, max: 5.0 },
      neonatal: { min: 3.5, max: 5.5 },
      notes: 'Crítico para ritmo cardíaco',
    },
    {
      parameter: 'Sodio (Na+)',
      unit: 'mEq/L',
      adult: { min: 135, max: 145 },
      pediatric: { min: 135, max: 145 },
      neonatal: { min: 135, max: 145 },
    },
    {
      parameter: 'Calcio Total',
      unit: 'mg/dL',
      adult: { min: 8.5, max: 10.5 },
      pediatric: { min: 8.5, max: 10.5 },
      neonatal: { min: 7.5, max: 10.0 },
    },
    {
      parameter: 'Magnesio',
      unit: 'mg/dL',
      adult: { min: 1.7, max: 2.2 },
      pediatric: { min: 1.7, max: 2.2 },
      neonatal: { min: 1.5, max: 2.5 },
    },
    {
      parameter: 'Glucosa',
      unit: 'mg/dL',
      adult: { min: 70, max: 110 },
      pediatric: { min: 70, max: 110 },
      neonatal: { min: 60, max: 100 },
      notes: 'Monitorear post-CEC',
    },
    {
      parameter: 'Albumina',
      unit: 'g/dL',
      adult: { min: 3.5, max: 5.0 },
      pediatric: { min: 3.5, max: 5.0 },
      neonatal: { min: 3.0, max: 4.5 },
    },
    {
      parameter: 'Creatinina',
      unit: 'mg/dL',
      adult: { min: 0.7, max: 1.3 },
      pediatric: { min: 0.5, max: 1.0 },
      neonatal: { min: 0.3, max: 0.7 },
    },
    {
      parameter: 'BUN (Nitrógeno de Urea)',
      unit: 'mg/dL',
      adult: { min: 7, max: 20 },
      pediatric: { min: 7, max: 20 },
      neonatal: { min: 5, max: 18 },
    },
  ];

  // Valores de Coagulación
  const coagulationValues: NormalRange[] = [
    {
      parameter: 'ACT (Tiempo de Coagulación Activado)',
      unit: 'segundos',
      adult: { min: 80, max: 120 },
      pediatric: { min: 80, max: 120 },
      neonatal: { min: 80, max: 120 },
      notes: 'CEC: > 400 seg con heparina',
    },
    {
      parameter: 'INR (Índice Normalizado)',
      unit: 'ratio',
      adult: { min: 0.8, max: 1.1 },
      pediatric: { min: 0.8, max: 1.1 },
      neonatal: { min: 0.8, max: 1.1 },
    },
    {
      parameter: 'TP (Tiempo de Protrombina)',
      unit: 'segundos',
      adult: { min: 11, max: 13.5 },
      pediatric: { min: 11, max: 13.5 },
      neonatal: { min: 11, max: 14 },
    },
    {
      parameter: 'TPT (Tiempo Parcial Tromboplastina)',
      unit: 'segundos',
      adult: { min: 25, max: 35 },
      pediatric: { min: 25, max: 35 },
      neonatal: { min: 25, max: 40 },
    },
    {
      parameter: 'Fibrinógeno',
      unit: 'mg/dL',
      adult: { min: 200, max: 400 },
      pediatric: { min: 200, max: 400 },
      neonatal: { min: 200, max: 400 },
      notes: 'Crítico para hemostasia',
    },
    {
      parameter: 'Plaquetas',
      unit: 'x10³/μL',
      adult: { min: 150, max: 400 },
      pediatric: { min: 150, max: 400 },
      neonatal: { min: 150, max: 400 },
    },
  ];

  const allValues = {
    hemodynamic: hemodynamicValues,
    oxygenation: oxygenationValues,
    laboratory: laboratoryValues,
    coagulation: coagulationValues,
  };

  // Filtrar valores según búsqueda
  const filterValues = (values: NormalRange[]) => {
    return values.filter(val =>
      val.parameter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      val.unit.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getValueRange = (param: NormalRange): string => {
    let range;
    if (ageGroup === 'adult') range = param.adult;
    else if (ageGroup === 'pediatric') range = param.pediatric;
    else range = param.neonatal;

    if (!range) return 'N/A';
    return `${range.min} - ${range.max}`;
  };

  const getAgeGroupLabel = () => {
    switch (ageGroup) {
      case 'adult':
        return 'Adulto';
      case 'pediatric':
        return 'Pediátrico (1-17 años)';
      case 'neonatal':
        return 'Neonatal (< 1 mes)';
      default:
        return '';
    }
  };

  const TableRow = ({ param }: { param: NormalRange }) => (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3 font-medium text-sm">{param.parameter}</td>
      <td className="p-3 text-center text-sm">{param.unit}</td>
      <td className="p-3 text-center font-semibold text-green-700">
        {getValueRange(param)}
      </td>
      {param.notes && (
        <td className="p-3 text-xs text-gray-600">{param.notes}</td>
      )}
    </tr>
  );

  const CategorySection = ({ 
    title, 
    icon: Icon, 
    values 
  }: { 
    title: string; 
    icon: any; 
    values: NormalRange[] 
  }) => {
    const filtered = filterValues(values);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Icon className="h-5 w-5 text-medical-primary" />
          <h3 className="font-bold text-lg">{title}</h3>
          <Badge variant="secondary">{filtered.length} parámetros</Badge>
        </div>

        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 border-b-2">
                  <th className="p-3 text-left font-semibold">Parámetro</th>
                  <th className="p-3 text-center font-semibold">Unidad</th>
                  <th className="p-3 text-center font-semibold">
                    Rango Normal
                  </th>
                  {values.some(v => v.notes) && (
                    <th className="p-3 text-left font-semibold">Notas</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((param) => (
                  <TableRow key={param.parameter} param={param} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-600">
            <p className="text-sm">No hay resultados para: "{searchTerm}"</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Activity className="h-6 w-6" />
            Valores Normales de Referencia
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Rangos de referencia clínicos específicos por edad
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selector de Grupo de Edad */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Grupo de Edad</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(['adult', 'pediatric', 'neonatal'] as const).map((group) => (
                <button
                  key={group}
                  onClick={() => setAgeGroup(group)}
                  className={`p-3 rounded-lg border-2 transition text-left ${
                    ageGroup === group
                      ? 'border-medical-primary bg-medical-primary/5'
                      : 'border-gray-200 bg-white hover:border-medical-primary/50'
                  }`}
                >
                  <p className="font-semibold text-sm">
                    {group === 'adult'
                      ? 'Adulto'
                      : group === 'pediatric'
                      ? 'Pediátrico'
                      : 'Neonatal'}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {group === 'adult'
                      ? '> 18 años'
                      : group === 'pediatric'
                      ? '1-17 años'
                      : '< 1 mes'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Búsqueda */}
          <div className="space-y-2">
            <Label htmlFor="search">Buscar Parámetro</Label>
            <Input
              id="search"
              placeholder="Ej: potasio, presión, oxígeno..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Información del Grupo Seleccionado */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-semibold text-blue-900">
              Mostrando valores para: <span className="text-blue-700">{getAgeGroupLabel()}</span>
            </p>
          </div>

          {/* Tabs de Categorías */}
          <Tabs defaultValue="hemodynamic" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="hemodynamic">Hemodinámica</TabsTrigger>
              <TabsTrigger value="oxygenation">Oxigenación</TabsTrigger>
              <TabsTrigger value="laboratory">Laboratorio</TabsTrigger>
              <TabsTrigger value="coagulation">Coagulación</TabsTrigger>
            </TabsList>

            <TabsContent value="hemodynamic" className="mt-6">
              <CategorySection
                title="Valores Hemodinámicos"
                icon={Heart}
                values={allValues.hemodynamic}
              />
            </TabsContent>

            <TabsContent value="oxygenation" className="mt-6">
              <CategorySection
                title="Valores de Oxigenación"
                icon={Droplet}
                values={allValues.oxygenation}
              />
            </TabsContent>

            <TabsContent value="laboratory" className="mt-6">
              <CategorySection
                title="Valores de Laboratorio"
                icon={Zap}
                values={allValues.laboratory}
              />
            </TabsContent>

            <TabsContent value="coagulation" className="mt-6">
              <CategorySection
                title="Valores de Coagulación"
                icon={Zap}
                values={allValues.coagulation}
              />
            </TabsContent>
          </Tabs>

          {/* Recomendaciones Clínicas */}
          <div className="mt-6 pt-6 border-t space-y-3">
            <h3 className="font-semibold text-sm">💡 Recomendaciones Clínicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="font-medium text-green-900 text-sm">CEC Adulto</p>
                <ul className="text-xs text-green-800 mt-2 space-y-1">
                  <li>• Flujo: 2.2-2.4 L/min/m²</li>
                  <li>• Hematocrito: 20-25%</li>
                  <li>• PAM: 50-80 mmHg</li>
                  <li>• Temp: 28-32°C</li>
                </ul>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-medium text-blue-900 text-sm">CEC Pediátrico</p>
                <ul className="text-xs text-blue-800 mt-2 space-y-1">
                  <li>• Flujo: 2.5-3.0 L/min/m²</li>
                  <li>• Hematocrito: 22-25%</li>
                  <li>• PAM: 40-60 mmHg</li>
                  <li>• Temp: 28-32°C</li>
                </ul>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="font-medium text-orange-900 text-sm">ECMO</p>
                <ul className="text-xs text-orange-800 mt-2 space-y-1">
                  <li>• VA: 2.5-4.5 L/min</li>
                  <li>• VV: 4-6 L/min</li>
                  <li>• Hematocrito: 25-35%</li>
                  <li>• ACT: > 400 seg</li>
                </ul>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="font-medium text-purple-900 text-sm">Monitoreo</p>
                <ul className="text-xs text-purple-800 mt-2 space-y-1">
                  <li>• Revisar ACT c/2-4 horas</li>
                  <li>• Gases arteriales c/15-30 min</li>
                  <li>• Electrolitos c/1-2 horas</li>
                  <li>• Lactato si hay isquemia</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NormalValuesCard;