import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Droplet, Beaker } from 'lucide-react';
import { solutions, cardioplegias } from '@/data';
import type { Solution } from '@/types';

const SolucionesCard = () => {
  const [selectedSolution, setSelectedSolution] = useState<string | null>(
    solutions[0]?.id || null
  );

  const currentSolution = solutions.find(s => s.id === selectedSolution);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="solutions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="solutions">Soluciones IV</TabsTrigger>
          <TabsTrigger value="cardioplegias">Cardioplegias</TabsTrigger>
        </TabsList>

        {/* ==================== SOLUCIONES IV ==================== */}
        <TabsContent value="solutions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplet className="h-6 w-6" />
                Soluciones Intravenosas
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Información sobre composición y uso de soluciones comunes en perfusión
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selector de Soluciones */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Selecciona una Solución</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {solutions.map((solution) => (
                    <button
                      key={solution.id}
                      onClick={() => setSelectedSolution(solution.id)}
                      className={`p-3 rounded-lg border-2 transition text-left ${
                        selectedSolution === solution.id
                          ? 'border-medical-primary bg-medical-primary/5'
                          : 'border-gray-200 bg-white hover:border-medical-primary/50'
                      }`}
                    >
                      <p className="font-semibold text-sm">{solution.name}</p>
                      <p className="text-xs text-gray-600 mt-1">{solution.indication}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Detalle de Solución */}
              {currentSolution && (
                <div className="space-y-4 pt-4 border-t">
                  {/* Header */}
                  <div>
                    <h2 className="text-2xl font-bold text-medical-primary">
                      {currentSolution.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {currentSolution.indication}
                    </p>
                  </div>

                  {/* Composición */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Composición</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      {currentSolution.components.map((comp, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 bg-white rounded">
                          <span className="text-sm font-medium">{comp.name}</span>
                          <span className="text-sm text-gray-600">
                            {comp.concentration} {comp.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Características */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {currentSolution.osmolarity && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-gray-600">Osmolaridad</p>
                        <p className="text-lg font-semibold text-blue-700 mt-1">
                          {currentSolution.osmolarity}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">mOsm/L</p>
                      </div>
                    )}
                    {currentSolution.pH && (
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-xs text-gray-600">pH</p>
                        <p className="text-lg font-semibold text-green-700 mt-1">
                          {currentSolution.pH}
                        </p>
                      </div>
                    )}
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-xs text-gray-600">Tipo de Solución</p>
                      <p className="text-lg font-semibold text-purple-700 mt-1">
                        {currentSolution.name.includes('Ringer') || 
                         currentSolution.name.includes('Plasmalyte') ||
                         currentSolution.name.includes('Suero') ? 'Cristaloide' : 'Coloide'}
                      </p>
                    </div>
                  </div>

                  {/* Consideraciones Clínicas */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 text-sm mb-2">
                      💡 Consideraciones Clínicas
                    </h4>
                    <ul className="space-y-1 text-sm text-blue-800">
                      {currentSolution.id === 'sol_sf09' && (
                        <>
                          <li>• Solución isotónica y simpla</li>
                          <li>• Uso general de primera línea</li>
                          <li>• Alto contenido de cloro (acidosis hiperclorémica)</li>
                          <li>• No contiene potasio ni calcio</li>
                        </>
                      )}
                      {currentSolution.id === 'sol_rl' && (
                        <>
                          <li>• Más fisiológica que SF 0.9%</li>
                          <li>• Contiene potasio, calcio y lactato</li>
                          <li>• Metabolismo del lactato a bicarbonato</li>
                          <li>• Recomendada en trauma y CEC</li>
                        </>
                      )}
                      {currentSolution.id === 'sol_plasmalyte' && (
                        <>
                          <li>• Composición más cercana al plasma</li>
                          <li>• Contiene acetato y gluconato (electrolitos tamponados)</li>
                          <li>• Menor acidosis en infusión masiva</li>
                          <li>• Excelente para resucitación</li>
                        </>
                      )}
                      {currentSolution.id === 'sol_albumina5' && (
                        <>
                          <li>• Derivado de plasma humano</li>
                          <li>• Presión oncótica importante</li>
                          <li>• Mantiene volemia más prolongadamente</li>
                          <li>• Usar cuando hay hipoproteinemia severa</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {/* Tabla Comparativa */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <h3 className="font-semibold text-sm">📊 Comparativa Rápida</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 text-left">Solución</th>
                        <th className="p-2 text-center">Na (mEq/L)</th>
                        <th className="p-2 text-center">K (mEq/L)</th>
                        <th className="p-2 text-center">Cl (mEq/L)</th>
                        <th className="p-2 text-center">Osmolarity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {solutions
                        .filter(s => !s.name.includes('Albúmina'))
                        .map((sol) => (
                          <tr key={sol.id} className="border-b hover:bg-gray-50">
                            <td className="p-2 font-medium">{sol.name}</td>
                            <td className="p-2 text-center">
                              {sol.components.find(c => c.name.includes('Sodio'))?.concentration || '-'}
                            </td>
                            <td className="p-2 text-center">
                              {sol.components.find(c => c.name.includes('Potasio'))?.concentration || '-'}
                            </td>
                            <td className="p-2 text-center">
                              {sol.components.find(c => c.name.includes('Cloro'))?.concentration || '-'}
                            </td>
                            <td className="p-2 text-center">{sol.osmolarity || '-'}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== CARDIOPLEGIAS ==================== */}
        <TabsContent value="cardioplegias" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Beaker className="h-6 w-6" />
                Soluciones Cardiopléjicas
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Fórmulas y protocolos para protección miocárdica
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(cardioplegias).map(([key, cardiop]) => (
                <div key={key} className="p-4 border rounded-lg space-y-3 hover:bg-gray-50 transition">
                  {/* Header */}
                  <div>
                    <h3 className="text-lg font-semibold text-medical-primary">
                      {cardiop.name}
                    </h3>
                    <Badge className="mt-2" variant="secondary">
                      {cardiop.indication}
                    </Badge>
                  </div>

                  {/* Componentes */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Componentes:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {cardiop.components.map((comp, idx) => (
                        <div key={idx} className="p-2 bg-gray-50 rounded text-sm">
                          {comp}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Parámetros */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t">
                    <div>
                      <p className="text-xs text-gray-600">Temperatura</p>
                      <p className="font-semibold text-sm">{cardiop.temperature}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Flujo</p>
                      <p className="font-semibold text-sm">{cardiop.flow}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Indicación</p>
                      <p className="font-semibold text-sm text-blue-600">{cardiop.indication}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Recomendaciones Generales */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <h3 className="font-semibold text-sm">⚕️ Recomendaciones Generales</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="font-medium mb-1">Administración:</p>
                    <p>• Administrar en raíz aórtica después del pinzamiento</p>
                    <p>• Puede ser repetida cada 20-30 minutos</p>
                    <p>• Monitorear temperatura miocárdica</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="font-medium mb-1">Monitoreo:</p>
                    <p>• ECG en asistolia o bradicardia</p>
                    <p>• Verificar presión de infusión {'<'} 100 mmHg</p>
                    <p>• Evitar hipercarga ventricular</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SolucionesCard;