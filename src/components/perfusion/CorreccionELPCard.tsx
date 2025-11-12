import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Zap } from 'lucide-react';
import * as calculations from '@/services/calculations';
import type { ElectrolyteCorrection } from '@/types';

const CorreccionELPCard = () => {
  // Estado para corrección de Potasio
  const [potassiumData, setPotassiumData] = useState({
    actualValue: '',
    desiredValue: '',
    weight: '',
  });

  // Estado para corrección de Bicarbonato
  const [bicarbonateData, setBicarbonateData] = useState({
    actualValue: '',
    desiredValue: '',
    weight: '',
  });

  // Resultados
  const [potassiumResult, setPotassiumResult] = useState<ElectrolyteCorrection | null>(null);
  const [bicarbonateResult, setBicarbonateResult] = useState<ElectrolyteCorrection | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Función para calcular corrección de Potasio
  const calculatePotassiumCorrection = () => {
    try {
      setError(null);

      const actual = parseFloat(potassiumData.actualValue);
      const desired = parseFloat(potassiumData.desiredValue);
      const weight = parseFloat(potassiumData.weight);

      if (!actual || !desired || !weight) {
        setError('Por favor completa todos los campos de potasio');
        setPotassiumResult(null);
        return;
      }

      if (actual < 2 || actual > 8 || desired < 2 || desired > 8) {
        setError('Potasio: valores deben estar entre 2-8 mEq/L');
        setPotassiumResult(null);
        return;
      }

      const deficit = calculations.calculatePotassiumDeficit(actual, desired, weight);

      setPotassiumResult({
        type: 'potassium',
        actualValue: actual,
        desiredValue: desired,
        weight,
        deficit,
      });
    } catch (err) {
      setError((err as Error).message);
      setPotassiumResult(null);
    }
  };

  // Función para calcular corrección de Bicarbonato
  const calculateBicarbonateCorrection = () => {
    try {
      setError(null);

      const actual = parseFloat(bicarbonateData.actualValue);
      const desired = parseFloat(bicarbonateData.desiredValue);
      const weight = parseFloat(bicarbonateData.weight);

      if (!actual || !desired || !weight) {
        setError('Por favor completa todos los campos de bicarbonato');
        setBicarbonateResult(null);
        return;
      }

      if (actual < 5 || actual > 40 || desired < 5 || desired > 40) {
        setError('Bicarbonato: valores deben estar entre 5-40 mEq/L');
        setBicarbonateResult(null);
        return;
      }

      const deficit = calculations.calculateBicarbonateDeficit(actual, desired, weight);

      setBicarbonateResult({
        type: 'bicarbonate',
        actualValue: actual,
        desiredValue: desired,
        weight,
        deficit,
      });
    } catch (err) {
      setError((err as Error).message);
      setBicarbonateResult(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === 'Enter') {
      callback();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Zap className="h-6 w-6" />
            Corrección de Electrolitos (ELP)
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Cálculo de déficit y recomendaciones de corrección
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="potassium" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="potassium">Potasio (K+)</TabsTrigger>
              <TabsTrigger value="bicarbonate">Bicarbonato (HCO3-)</TabsTrigger>
            </TabsList>

            {/* Error Alert Global */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* ==================== POTASIO ==================== */}
            <TabsContent value="potassium" className="space-y-6">
              {/* Input Panel */}
              <div className="space-y-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900">Parámetros de Corrección</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="k-actual">Potasio Actual (mEq/L) *</Label>
                    <Input
                      id="k-actual"
                      type="number"
                      step="0.1"
                      min="2"
                      max="8"
                      value={potassiumData.actualValue}
                      onChange={(e) => setPotassiumData({ ...potassiumData, actualValue: e.target.value })}
                      onKeyPress={(e) => handleKeyPress(e, calculatePotassiumCorrection)}
                      placeholder="3.5"
                    />
                    <p className="text-xs text-blue-700">Normal: 3.5-5.0 mEq/L</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="k-desired">Potasio Deseado (mEq/L) *</Label>
                    <Input
                      id="k-desired"
                      type="number"
                      step="0.1"
                      min="2"
                      max="8"
                      value={potassiumData.desiredValue}
                      onChange={(e) => setPotassiumData({ ...potassiumData, desiredValue: e.target.value })}
                      onKeyPress={(e) => handleKeyPress(e, calculatePotassiumCorrection)}
                      placeholder="4.5"
                    />
                    <p className="text-xs text-blue-700">Objetivo: 4.0-5.0 mEq/L</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="k-weight">Peso (kg) *</Label>
                    <Input
                      id="k-weight"
                      type="number"
                      step="0.1"
                      min="0"
                      value={potassiumData.weight}
                      onChange={(e) => setPotassiumData({ ...potassiumData, weight: e.target.value })}
                      onKeyPress={(e) => handleKeyPress(e, calculatePotassiumCorrection)}
                      placeholder="70"
                    />
                  </div>
                </div>

                <Button 
                  onClick={calculatePotassiumCorrection}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Calcular Déficit de Potasio
                </Button>
              </div>

              {/* Resultado */}
              {potassiumResult && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-3">Resultado</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="p-3 bg-white rounded border">
                        <p className="text-xs text-gray-600">Déficit Total</p>
                        <p className="text-2xl font-bold text-green-700">
                          {potassiumResult.deficit.toFixed(1)}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">mEq</p>
                      </div>

                      <div className="p-3 bg-white rounded border">
                        <p className="text-xs text-gray-600">Diferencia</p>
                        <p className="text-lg font-semibold text-blue-700">
                          {(potassiumResult.desiredValue - potassiumResult.actualValue).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">mEq/L</p>
                      </div>

                      <div className="p-3 bg-white rounded border">
                        <p className="text-xs text-gray-600">Factor Distribución</p>
                        <p className="text-lg font-semibold text-purple-700">
                          0.5 L/kg
                        </p>
                      </div>
                    </div>

                    {/* Recomendaciones */}
                    <div className="mt-4 pt-4 border-t border-green-200">
                      <h5 className="font-semibold text-green-900 text-sm mb-2">Opciones de Administración:</h5>
                      <div className="space-y-2 text-sm text-green-800">
                        <div className="p-2 bg-white rounded">
                          <p className="font-medium">Cloruro de Potasio 10% (13.4 mEq/10mL)</p>
                          <p className="text-xs mt-1">
                            Volumen: {((potassiumResult.deficit * 10) / 13.4).toFixed(1)} mL
                          </p>
                        </div>
                        <div className="p-2 bg-white rounded">
                          <p className="font-medium">Cloruro de Potasio 20% (26.8 mEq/20mL)</p>
                          <p className="text-xs mt-1">
                            Volumen: {((potassiumResult.deficit * 20) / 26.8).toFixed(1)} mL
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recomendación clínica */}
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-900">
                      <strong>⚠️ Nota:</strong> Administrar por vía IV lenta (máximo 10-20 mEq/hora). 
                      Siempre usar bolsa de suero. Monitorear ECG continuamente.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* ==================== BICARBONATO ==================== */}
            <TabsContent value="bicarbonate" className="space-y-6">
              {/* Input Panel */}
              <div className="space-y-4 bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h3 className="font-semibold text-orange-900">Parámetros de Corrección</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hco3-actual">HCO3- Actual (mEq/L) *</Label>
                    <Input
                      id="hco3-actual"
                      type="number"
                      step="0.1"
                      min="5"
                      max="40"
                      value={bicarbonateData.actualValue}
                      onChange={(e) => setBicarbonateData({ ...bicarbonateData, actualValue: e.target.value })}
                      onKeyPress={(e) => handleKeyPress(e, calculateBicarbonateCorrection)}
                      placeholder="18"
                    />
                    <p className="text-xs text-orange-700">Normal: 22-26 mEq/L</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hco3-desired">HCO3- Deseado (mEq/L) *</Label>
                    <Input
                      id="hco3-desired"
                      type="number"
                      step="0.1"
                      min="5"
                      max="40"
                      value={bicarbonateData.desiredValue}
                      onChange={(e) => setBicarbonateData({ ...bicarbonateData, desiredValue: e.target.value })}
                      onKeyPress={(e) => handleKeyPress(e, calculateBicarbonateCorrection)}
                      placeholder="24"
                    />
                    <p className="text-xs text-orange-700">Objetivo: 22-26 mEq/L</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hco3-weight">Peso (kg) *</Label>
                    <Input
                      id="hco3-weight"
                      type="number"
                      step="0.1"
                      min="0"
                      value={bicarbonateData.weight}
                      onChange={(e) => setBicarbonateData({ ...bicarbonateData, weight: e.target.value })}
                      onKeyPress={(e) => handleKeyPress(e, calculateBicarbonateCorrection)}
                      placeholder="70"
                    />
                  </div>
                </div>

                <Button 
                  onClick={calculateBicarbonateCorrection}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  Calcular Déficit de Bicarbonato
                </Button>
              </div>

              {/* Resultado */}
              {bicarbonateResult && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-3">Resultado</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="p-3 bg-white rounded border">
                        <p className="text-xs text-gray-600">Déficit Total</p>
                        <p className="text-2xl font-bold text-green-700">
                          {bicarbonateResult.deficit.toFixed(1)}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">mEq</p>
                      </div>

                      <div className="p-3 bg-white rounded border">
                        <p className="text-xs text-gray-600">Diferencia</p>
                        <p className="text-lg font-semibold text-blue-700">
                          {(bicarbonateResult.desiredValue - bicarbonateResult.actualValue).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">mEq/L</p>
                      </div>

                      <div className="p-3 bg-white rounded border">
                        <p className="text-xs text-gray-600">Factor Distribución</p>
                        <p className="text-lg font-semibold text-purple-700">
                          0.5 L/kg
                        </p>
                      </div>
                    </div>

                    {/* Recomendaciones */}
                    <div className="mt-4 pt-4 border-t border-green-200">
                      <h5 className="font-semibold text-green-900 text-sm mb-2">Opciones de Administración:</h5>
                      <div className="space-y-2 text-sm text-green-800">
                        <div className="p-2 bg-white rounded">
                          <p className="font-medium">Bicarbonato de Sodio 8.4% (1 mEq/mL)</p>
                          <p className="text-xs mt-1">
                            Volumen: {bicarbonateResult.deficit.toFixed(1)} mL
                          </p>
                        </div>
                        <div className="p-2 bg-white rounded">
                          <p className="font-medium">Bicarbonato de Sodio 7.5% (0.89 mEq/mL)</p>
                          <p className="text-xs mt-1">
                            Volumen: {(bicarbonateResult.deficit / 0.89).toFixed(1)} mL
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recomendación clínica */}
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-900">
                      <strong>⚠️ Nota:</strong> Administrar lentamente en vía central. 
                      Dilatar en suero. Monitorear pH y PCO2 frecuentemente. 
                      Evitar en alcalemia severa.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Tabla de Referencia */}
          <div className="mt-6 pt-6 border-t space-y-3">
            <h3 className="font-semibold text-sm">📋 Valores de Referencia</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-2 bg-blue-50 rounded">
                <p className="font-medium text-blue-900">Potasio Normal</p>
                <p className="text-blue-800">3.5 - 5.0 mEq/L</p>
              </div>
              <div className="p-2 bg-orange-50 rounded">
                <p className="font-medium text-orange-900">Bicarbonato Normal</p>
                <p className="text-orange-800">22 - 26 mEq/L</p>
              </div>
              <div className="p-2 bg-purple-50 rounded">
                <p className="font-medium text-purple-900">Hipocaliemia Severa</p>
                <p className="text-purple-800">{'<'} 2.5 mEq/L</p>
              </div>
              <div className="p-2 bg-red-50 rounded">
                <p className="font-medium text-red-900">Hipercaliemia Severa</p>
                <p className="text-red-800">{'>'}6.5 mEq/L</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CorreccionELPCard;