import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Copy } from 'lucide-react';
import type { ConversionType, ConversionResult } from '@/types';

const ConversionesCard = () => {
  const [selectedConversion, setSelectedConversion] = useState<ConversionType>('mg_to_ug');
  const [inputValue, setInputValue] = useState<string>('');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Definir conversiones disponibles
  const conversions: {
    type: ConversionType;
    label: string;
    description: string;
  }[] = [
    { type: 'mg_to_ug', label: 'mg → μg', description: 'Miligramos a Microgramos' },
    { type: 'ug_to_mg', label: 'μg → mg', description: 'Microgramos a Miligramos' },
    { type: 'inch_to_fr', label: 'Pulgadas → Fr', description: 'Pulgadas a French' },
    { type: 'fr_to_inch', label: 'Fr → Pulgadas', description: 'French a Pulgadas' },
    { type: 'meq_to_mg', label: 'mEq → mg', description: 'Miliequivalentes a Miligramos' },
    { type: 'mg_to_meq', label: 'mg → mEq', description: 'Miligramos a Miliequivalentes' },
    { type: 'cm_to_inch', label: 'cm → Pulgadas', description: 'Centímetros a Pulgadas' },
    { type: 'inch_to_cm', label: 'Pulgadas → cm', description: 'Pulgadas a Centímetros' },
    { type: 'kg_to_lb', label: 'kg → lb', description: 'Kilogramos a Libras' },
    { type: 'lb_to_kg', label: 'lb → kg', description: 'Libras a Kilogramos' },
  ];

  // Función para realizar conversiones
  const performConversion = () => {
    try {
      setError(null);

      const value = parseFloat(inputValue);
      if (isNaN(value) || value < 0) {
        setError('Por favor ingresa un número válido y positivo');
        setResult(null);
        return;
      }

      let converted: number;
      let originalUnit: string;
      let convertedUnit: string;

      switch (selectedConversion) {
        // Masa: mg ↔ μg
        case 'mg_to_ug':
          converted = value * 1000;
          originalUnit = 'mg';
          convertedUnit = 'μg';
          break;
        case 'ug_to_mg':
          converted = value / 1000;
          originalUnit = 'μg';
          convertedUnit = 'mg';
          break;

        // Calibre: Pulgadas ↔ Fr (French)
        case 'inch_to_fr':
          converted = value * 3;
          originalUnit = 'Pulgadas';
          convertedUnit = 'Fr';
          break;
        case 'fr_to_inch':
          converted = value / 3;
          originalUnit = 'Fr';
          convertedUnit = 'Pulgadas';
          break;

        // Electrolitos: mEq ↔ mg (para sodio)
        case 'meq_to_mg':
          converted = value * 23; // Peso molecular del sodio
          originalUnit = 'mEq';
          convertedUnit = 'mg (Na)';
          break;
        case 'mg_to_meq':
          converted = value / 23;
          originalUnit = 'mg (Na)';
          convertedUnit = 'mEq';
          break;

        // Longitud: cm ↔ Pulgadas
        case 'cm_to_inch':
          converted = value / 2.54;
          originalUnit = 'cm';
          convertedUnit = 'Pulgadas';
          break;
        case 'inch_to_cm':
          converted = value * 2.54;
          originalUnit = 'Pulgadas';
          convertedUnit = 'cm';
          break;

        // Peso: kg ↔ lb
        case 'kg_to_lb':
          converted = value * 2.20462;
          originalUnit = 'kg';
          convertedUnit = 'lb';
          break;
        case 'lb_to_kg':
          converted = value / 2.20462;
          originalUnit = 'lb';
          convertedUnit = 'kg';
          break;

        default:
          setError('Conversión no disponible');
          return;
      }

      setResult({
        original: value,
        converted: parseFloat(converted.toFixed(4)),
        originalUnit,
        convertedUnit,
      });
    } catch (err) {
      setError((err as Error).message);
      setResult(null);
    }
  };

  const handleCopy = () => {
    if (result) {
      const text = `${result.original} ${result.originalUnit} = ${result.converted} ${result.convertedUnit}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performConversion();
    }
  };

  const getCurrentConversionLabel = () => {
    return conversions.find(c => c.type === selectedConversion)?.description || '';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">🔄 Conversiones Médicas</CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Herramienta rápida para conversiones comunes en perfusión cardiovascular
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selector de Conversión */}
          <div className="space-y-3">
            <Label htmlFor="conversion-select">Tipo de Conversión</Label>
            <Select value={selectedConversion} onValueChange={(value) => setSelectedConversion(value as ConversionType)}>
              <SelectTrigger id="conversion-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1.5">
                  <p className="text-xs font-semibold text-gray-600 mb-2">MASA</p>
                </div>
                <SelectItem value="mg_to_ug">mg → μg (Miligramos a Microgramos)</SelectItem>
                <SelectItem value="ug_to_mg">μg → mg (Microgramos a Miligramos)</SelectItem>

                <div className="px-2 py-1.5 border-t mt-2">
                  <p className="text-xs font-semibold text-gray-600 mb-2">CALIBRE</p>
                </div>
                <SelectItem value="inch_to_fr">Pulgadas → Fr</SelectItem>
                <SelectItem value="fr_to_inch">Fr → Pulgadas</SelectItem>

                <div className="px-2 py-1.5 border-t mt-2">
                  <p className="text-xs font-semibold text-gray-600 mb-2">ELECTROLITOS</p>
                </div>
                <SelectItem value="meq_to_mg">mEq → mg (Sodio)</SelectItem>
                <SelectItem value="mg_to_meq">mg → mEq (Sodio)</SelectItem>

                <div className="px-2 py-1.5 border-t mt-2">
                  <p className="text-xs font-semibold text-gray-600 mb-2">LONGITUD</p>
                </div>
                <SelectItem value="cm_to_inch">cm → Pulgadas</SelectItem>
                <SelectItem value="inch_to_cm">Pulgadas → cm</SelectItem>

                <div className="px-2 py-1.5 border-t mt-2">
                  <p className="text-xs font-semibold text-gray-600 mb-2">PESO</p>
                </div>
                <SelectItem value="kg_to_lb">kg → lb</SelectItem>
                <SelectItem value="lb_to_kg">lb → kg</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600">{getCurrentConversionLabel()}</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Input de Valor */}
          <div className="space-y-2">
            <Label htmlFor="input-value">Valor a Convertir</Label>
            <div className="flex gap-2">
              <Input
                id="input-value"
                type="number"
                step="any"
                min="0"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ingresa el valor"
                className="flex-1"
              />
              <Button onClick={performConversion}>Convertir</Button>
            </div>
          </div>

          {/* Resultado */}
          {result && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Resultado</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-green-700">
                      {result.converted}
                    </p>
                    <p className="text-lg text-green-700">{result.convertedUnit}</p>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    desde {result.original} {result.originalUnit}
                  </p>
                </div>
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? 'Copiado' : 'Copiar'}
                </Button>
              </div>
            </div>
          )}

          {/* Tabla de Referencia Rápida */}
          <div className="mt-6 pt-6 border-t space-y-3">
            <h3 className="font-semibold text-sm">📋 Conversiones Comunes de Referencia</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-2 bg-gray-50 rounded">
                <p className="font-medium">1 mg = 1000 μg</p>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <p className="font-medium">1 Fr = 0.33 pulgadas</p>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <p className="font-medium">1 pulgada = 2.54 cm</p>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <p className="font-medium">1 kg = 2.20462 lb</p>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <p className="font-medium">1 mEq Na = 23 mg</p>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <p className="font-medium">1 mEq K = 39 mg</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversionesCard;