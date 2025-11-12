import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Stethoscope, Plane, AlertTriangle, Clock, AlertCircle } from "lucide-react";

// Importar funciones de cálculo centralizadas
import * as calculations from '@/services/calculations';
import type { ECMOCalculationInput, ECMOCalculationResult, ECMOMobileChecklist, ECMOMobileTimelineEvent, ECMOMobileEventType } from '@/types';

const ECMOCalculations = () => {
  // Patient Data
  const [patientData, setPatientData] = useState({
    weight: "",
    height: "",
    age: "",
    ecmoType: "VA" as 'VA' | 'VV' | 'VAV',
    currentHct: "",
    desiredHct: "",
    name: "",
    surname: "",
    diagnosis: "",
    originHospital: "",
    receivingHospital: ""
  });

  // Transport Data
  const [transportData, setTransportData] = useState({
    departureTime: "",
    airportArrivalTime: "",
    originHospitalArrivalTime: "",
    ecmoInitiationTime: "",
    originDepartureTime: "",
    destinationAirportArrivalTime: "",
    destinationHospitalArrivalTime: ""
  });

  // Calculation Results
  const [ecmoResults, setEcmoResults] = useState<ECMOCalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Checklist state
  const [checklist, setChecklist] = useState<ECMOMobileChecklist[]>([
    { 
      id: '1', itemId: 'oxygenator', title: 'Verificar funcionamiento del oxigenador', 
      description: 'Prueba de flujo y presión', isRequired: true, isChecked: false, category: 'Equipamiento' 
    },
    { 
      id: '2', itemId: 'anticoagulation', title: 'Comprobar niveles de anticoagulación', 
      description: 'ACT o INR', isRequired: true, isChecked: false, category: 'Medicamentos' 
    },
    { 
      id: '3', itemId: 'connections', title: 'Revisar conexiones de cánulas', 
      description: 'Verificar que no haya fugas', isRequired: true, isChecked: false, category: 'Equipamiento' 
    },
    { 
      id: '4', itemId: 'backup_power', title: 'Verificar backup de energía', 
      description: 'Batería cargada', isRequired: true, isChecked: false, category: 'Sistema' 
    },
    { 
      id: '5', itemId: 'alarms', title: 'Comprobar alarmas del sistema', 
      description: 'Volumen y funcionalidad', isRequired: true, isChecked: false, category: 'Sistema' 
    },
    { 
      id: '6', itemId: 'documentation', title: 'Documentación médica completa', 
      description: 'Consentimiento y registros', isRequired: false, isChecked: false, category: 'Documentación' 
    },
    { 
      id: '7', itemId: 'emergency', title: 'Equipo de emergencia disponible', 
      description: 'Desfibrilador, medicamentos', isRequired: true, isChecked: false, category: 'Equipamiento' 
    }
  ]);

  // Timeline Events state
  const [timelineEvents, setTimelineEvents] = useState<ECMOMobileTimelineEvent[]>([]);

  // Función para calcular ECMO usando funciones centralizadas
  const performECMOCalculations = () => {
    try {
      setError(null);

      const weight = parseFloat(patientData.weight);
      const height = parseFloat(patientData.height);
      const currentHct = parseFloat(patientData.currentHct);

      if (!weight || !height || !patientData.ecmoType) {
        setError('Por favor completa los campos requeridos (peso, altura, tipo ECMO)');
        setEcmoResults(null);
        return;
      }

      const input: ECMOCalculationInput = {
        weight,
        height,
        ecmoType: patientData.ecmoType,
        patientHematocrit: currentHct || 35,
        primingVolume: 300,
      };

      const results: ECMOCalculationResult = {
        recommendedFlow: calculations.calculateECMOFlow(weight, height, patientData.ecmoType),
        hematocritAfterPriming: currentHct 
          ? calculations.calculateECMOHctDrop(currentHct, 300, weight * 70)
          : undefined,
        calculatedAt: new Date(),
      };

      setEcmoResults(results);
    } catch (err) {
      setError((err as Error).message);
      setEcmoResults(null);
    }
  };

  // Trigger calculations cuando cambian los parámetros
  const handleWeightChange = (value: string) => {
    setPatientData({ ...patientData, weight: value });
  };

  const handleHeightChange = (value: string) => {
    setPatientData({ ...patientData, height: value });
  };

  const handleEcmoTypeChange = (value: string) => {
    setPatientData({ ...patientData, ecmoType: value as 'VA' | 'VV' | 'VAV' });
  };

  const handleHctChange = (value: string) => {
    setPatientData({ ...patientData, currentHct: value });
  };

  // Actualizar cálculos cuando cambian los inputs
  const handleCalculateClick = () => {
    performECMOCalculations();
  };

  // Checklist handlers
  const handleChecklistChange = (itemId: string, checked: boolean) => {
    setChecklist(prev => prev.map(item => 
      item.itemId === itemId ? { ...item, isChecked: checked } : item
    ));
  };

  // Timeline handlers
  const recordTimelineEvent = (eventType: ECMOMobileEventType, displayName: string) => {
    const newEvent: ECMOMobileTimelineEvent = {
      id: Date.now().toString(),
      eventType,
      displayName,
      scheduledTime: new Date(),
      actualTime: new Date(),
      isCompleted: true,
    };
    setTimelineEvents([...timelineEvents, newEvent]);
  };

  const mandatoryItemsChecked = checklist.filter(item => item.isRequired).every(item => item.isChecked);
  const uncheckedMandatory = checklist.filter(item => item.isRequired && !item.isChecked);

  const timelineEventOptions: { type: ECMOMobileEventType; label: string }[] = [
    { type: 'hospital_departure', label: 'Salida del Hospital' },
    { type: 'airport_arrival_origin', label: 'Llegada al Aeropuerto (Origen)' },
    { type: 'origin_hospital_arrival', label: 'Llegada Hospital Origen' },
    { type: 'ecmo_start', label: 'Inicio ECMO' },
    { type: 'origin_hospital_departure', label: 'Salida Hospital Origen' },
    { type: 'airport_arrival_destination', label: 'Llegada Aeropuerto (Destino)' },
    { type: 'destination_hospital_arrival', label: 'Llegada Hospital Destino' },
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="calculations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calculations">Cálculos ECMO</TabsTrigger>
          <TabsTrigger value="priming">Protocolos de Cebado</TabsTrigger>
          <TabsTrigger value="transport">Transporte Móvil</TabsTrigger>
        </TabsList>

        {/* ==================== CÁLCULOS ECMO ==================== */}
        <TabsContent value="calculations" className="space-y-6">
          {/* Patient Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Datos del Paciente ECMO
              </CardTitle>
              <CardDescription>
                Información del paciente para cálculos específicos de ECMO
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg) *</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={patientData.weight}
                    onChange={(e) => handleWeightChange(e.target.value)}
                    placeholder="70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Altura (cm) *</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    value={patientData.height}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    placeholder="170"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Edad</Label>
                  <Input
                    id="age"
                    value={patientData.age}
                    onChange={(e) => setPatientData({ ...patientData, age: e.target.value })}
                    placeholder="45 años"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ecmoType">Tipo de ECMO *</Label>
                  <Select value={patientData.ecmoType} onValueChange={handleEcmoTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VA">Veno-Arterial (VA)</SelectItem>
                      <SelectItem value="VV">Veno-Venoso (VV)</SelectItem>
                      <SelectItem value="VAV">VA-VV Híbrido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentHct">Hematocrito Actual (%)</Label>
                  <Input
                    id="currentHct"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={patientData.currentHct}
                    onChange={(e) => handleHctChange(e.target.value)}
                    placeholder="35"
                  />
                </div>
              </div>

              <Button onClick={handleCalculateClick} className="w-full">
                Calcular Parámetros ECMO
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {ecmoResults && (
            <Card>
              <CardHeader>
                <CardTitle>Resultados de Cálculos ECMO</CardTitle>
                <CardDescription>
                  Flujos recomendados y parámetros calculados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg bg-medical-primary-light/30">
                    <div className="text-sm font-medium text-muted-foreground">
                      Flujo ECMO {patientData.ecmoType}
                    </div>
                    <div className="text-2xl font-bold text-medical-primary">
                      {ecmoResults.recommendedFlow.toFixed(2)} L/min
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ({(ecmoResults.recommendedFlow * 1000).toFixed(0)} mL/min)
                    </div>
                  </div>
                  
                  {ecmoResults.hematocritAfterPriming !== undefined && (
                    <div className="p-4 border rounded-lg bg-warning/20">
                      <div className="text-sm font-medium text-muted-foreground">
                        Hematocrito Post-Dilución
                      </div>
                      <div className="text-2xl font-bold text-warning">
                        {ecmoResults.hematocritAfterPriming.toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Con cebado 300mL
                      </div>
                    </div>
                  )}
                </div>

                {/* Recomendaciones clínicas */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="font-semibold text-blue-900 text-sm mb-2">Recomendaciones:</p>
                  <ul className="space-y-1 text-blue-800 text-xs">
                    {patientData.ecmoType === 'VV' && (
                      <li>✓ ECMO VV: Flujo típico 4-6 L/min</li>
                    )}
                    {patientData.ecmoType === 'VA' && (
                      <li>✓ ECMO VA: Flujo típico 2.5-4.5 L/min</li>
                    )}
                    <li>✓ Monitorear ACT cada 2-4 horas</li>
                    <li>✓ Mantener hematocrito entre 25-35%</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ==================== PROTOCOLOS DE CEBADO ==================== */}
        <TabsContent value="priming" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Protocolos de Cebado ECMO</CardTitle>
              <CardDescription>
                Instrucciones paso a paso para cebado neonatal y pediátrico
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="neonatal">
                <TabsList>
                  <TabsTrigger value="neonatal">Neonatal</TabsTrigger>
                  <TabsTrigger value="pediatric">Pediátrico</TabsTrigger>
                </TabsList>
                
                <TabsContent value="neonatal" className="space-y-4">
                  <div className="bg-medical-primary-light/20 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Protocolo de Cebado Neonatal</h4>
                    <ol className="space-y-2 text-sm">
                      <li className="flex gap-3">
                        <span className="font-bold text-medical-primary min-w-fit">1.</span>
                        <span>Preparar solución cristaloide (250-300 mL)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-bold text-medical-primary min-w-fit">2.</span>
                        <span>Agregar albúmina al 5% (25-50 mL)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-bold text-medical-primary min-w-fit">3.</span>
                        <span>Heparina: 50-100 UI/kg</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-bold text-medical-primary min-w-fit">4.</span>
                        <span>Bicarbonato de sodio: 1-2 mEq/kg</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-bold text-medical-primary min-w-fit">5.</span>
                        <span>Cloruro de calcio: 5-10 mg/kg</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-bold text-medical-primary min-w-fit">6.</span>
                        <span>Verificar pH objetivo: 7.35-7.45</span>
                      </li>
                    </ol>
                  </div>
                </TabsContent>
                
                <TabsContent value="pediatric" className="space-y-4">
                  <div className="bg-medical-primary-light/20 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Protocolo de Cebado Pediátrico</h4>
                    <ol className="space-y-2 text-sm">
                      <li className="flex gap-3">
                        <span className="font-bold text-medical-primary min-w-fit">1.</span>
                        <span>Solución cristaloide: 500-800 mL (según peso)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-bold text-medical-primary min-w-fit">2.</span>
                        <span>Concentrado de glóbulos rojos si Hct {'<'} 25%</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-bold text-medical-primary min-w-fit">3.</span>
                        <span>Heparina: 50-100 UI/kg</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-bold text-medical-primary min-w-fit">4.</span>
                        <span>Manitol: 0.5-1 g/kg</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-bold text-medical-primary min-w-fit">5.</span>
                        <span>Corticosteroides según protocolo</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-bold text-medical-primary min-w-fit">6.</span>
                        <span>Verificar ACT {'>'} 400 segundos</span>
                      </li>
                    </ol>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== TRANSPORTE MÓVIL ==================== */}
        <TabsContent value="transport" className="space-y-6">
          {/* Patient Registration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5" />
                Registro de Paciente - Transporte ECMO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="originHospital">Hospital de Origen</Label>
                  <Input
                    id="originHospital"
                    value={patientData.originHospital}
                    onChange={(e) => setPatientData({ ...patientData, originHospital: e.target.value })}
                    placeholder="Hospital de origen"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receivingHospital">Hospital Receptor</Label>
                  <Input
                    id="receivingHospital"
                    value={patientData.receivingHospital}
                    onChange={(e) => setPatientData({ ...patientData, receivingHospital: e.target.value })}
                    placeholder="Hospital de destino"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pre-transport Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Lista de Verificación Pre-Transporte
              </CardTitle>
              <CardDescription>
                Todos los ítems obligatorios deben ser verificados antes del transporte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Agrupar por categoría */}
                {['Equipamiento', 'Medicamentos', 'Documentación', 'Sistema'].map(category => (
                  <div key={category}>
                    <h4 className="font-semibold text-sm mb-2 text-gray-700">{category}</h4>
                    <div className="space-y-3 ml-2">
                      {checklist
                        .filter(item => item.category === category)
                        .map((item) => (
                          <div key={item.itemId} className="flex items-start space-x-3">
                            <Checkbox
                              id={`checklist-${item.itemId}`}
                              checked={item.isChecked}
                              onCheckedChange={(checked) => handleChecklistChange(item.itemId, !!checked)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <Label
                                htmlFor={`checklist-${item.itemId}`}
                                className={`cursor-pointer ${item.isRequired ? 'font-medium' : ''}`}
                              >
                                {item.title}
                                {item.isRequired && <span className="text-destructive ml-1">*</span>}
                              </Label>
                              {item.description && (
                                <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {!mandatoryItemsChecked && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                    <div className="text-destructive text-sm">
                      <p className="font-medium">⚠️ Ítems obligatorios pendientes:</p>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        {uncheckedMandatory.map(item => (
                          <li key={item.itemId} className="text-xs">{item.title}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Time Logging */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Registro de Tiempos
              </CardTitle>
              <CardDescription>
                Documentación de tiempos críticos durante el transporte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Botones para registrar eventos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                {timelineEventOptions.map(({ type, label }) => {
                  const isRecorded = timelineEvents.some(e => e.eventType === type);
                  return (
                    <Button
                      key={type}
                      onClick={() => recordTimelineEvent(type, label)}
                      disabled={isRecorded}
                      variant={isRecorded ? 'outline' : 'default'}
                      size="sm"
                      className="justify-start text-left"
                    >
                      {isRecorded ? '✓' : '+'} {label}
                    </Button>
                  );
                })}
              </div>

              {/* Timeline de eventos registrados */}
              {timelineEvents.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-semibold text-sm mb-3">Eventos Registrados</h4>
                  <div className="space-y-2">
                    {timelineEvents.map((event, index) => (
                      <div key={event.id} className="p-3 bg-gray-50 rounded-lg border">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">{event.displayName}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              {event.actualTime?.toLocaleString('es-CL')}
                            </p>
                          </div>
                          <Button
                            onClick={() => setTimelineEvents(timelineEvents.filter(e => e.id !== event.id))}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ECMOCalculations;