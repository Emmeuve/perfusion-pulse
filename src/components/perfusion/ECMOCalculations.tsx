import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Stethoscope, Plane, AlertTriangle, Clock } from "lucide-react";

const ECMOCalculations = () => {
  const [patientData, setPatientData] = useState({
    weight: "",
    height: "",
    age: "",
    ecmoType: "",
    currentHct: "",
    desiredHct: "",
    name: "",
    surname: "",
    diagnosis: "",
    originHospital: "",
    receivingHospital: ""
  });

  const [transportData, setTransportData] = useState({
    departureTime: "",
    airportArrivalTime: "",
    originHospitalArrivalTime: "",
    ecmoInitiationTime: "",
    originDepartureTime: "",
    destinationAirportArrivalTime: "",
    destinationHospitalArrivalTime: ""
  });

  const [checklist, setChecklist] = useState([
    { id: 1, item: "Verificar funcionamiento del oxigenador", checked: false, mandatory: true },
    { id: 2, item: "Comprobar niveles de anticoagulación", checked: false, mandatory: true },
    { id: 3, item: "Revisar conexiones de cánulas", checked: false, mandatory: true },
    { id: 4, item: "Verificar backup de energía", checked: false, mandatory: true },
    { id: 5, item: "Comprobar alarmas del sistema", checked: false, mandatory: true },
    { id: 6, item: "Documentación médica completa", checked: false, mandatory: false },
    { id: 7, item: "Equipo de emergencia disponible", checked: false, mandatory: true }
  ]);

  const calculateECMOFlow = (weight: number, ecmoType: string) => {
    if (ecmoType === "VV") {
      return {
        min: weight * 100,
        max: weight * 150,
        unit: "mL/kg/min"
      };
    } else if (ecmoType === "VA") {
      return {
        min: weight * 50,
        max: weight * 100,
        unit: "mL/kg/min"
      };
    }
    return null;
  };

  const calculateHematocritDrop = (currentHct: number, weight: number, primingVolume = 300) => {
    const bloodVolume = weight * 70; // mL/kg approximation
    const totalVolume = bloodVolume + primingVolume;
    return (currentHct * bloodVolume) / totalVolume;
  };

  const getCalculations = () => {
    const weight = parseFloat(patientData.weight);
    const currentHct = parseFloat(patientData.currentHct);

    if (!weight || !patientData.ecmoType) {
      return null;
    }

    const flowCalc = calculateECMOFlow(weight, patientData.ecmoType);
    const hctDrop = currentHct ? calculateHematocritDrop(currentHct, weight) : null;

    return {
      flow: flowCalc,
      hematocritDrop: hctDrop
    };
  };

  const calculations = getCalculations();

  const handleChecklistChange = (id: number, checked: boolean) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, checked } : item
    ));
  };

  const mandatoryItemsChecked = checklist.filter(item => item.mandatory).every(item => item.checked);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="calculations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calculations">Cálculos ECMO</TabsTrigger>
          <TabsTrigger value="priming">Protocolos de Cebado</TabsTrigger>
          <TabsTrigger value="transport">Transporte Móvil</TabsTrigger>
        </TabsList>

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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg) *</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={patientData.weight}
                    onChange={(e) => setPatientData({ ...patientData, weight: e.target.value })}
                    placeholder="70"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={patientData.height}
                    onChange={(e) => setPatientData({ ...patientData, height: e.target.value })}
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
                  <Select value={patientData.ecmoType} onValueChange={(value) => setPatientData({ ...patientData, ecmoType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VV">Veno-Venoso (VV)</SelectItem>
                      <SelectItem value="VA">Veno-Arterial (VA)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentHct">Hematocrito Actual (%)</Label>
                  <Input
                    id="currentHct"
                    type="number"
                    value={patientData.currentHct}
                    onChange={(e) => setPatientData({ ...patientData, currentHct: e.target.value })}
                    placeholder="35"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {calculations && (
            <Card>
              <CardHeader>
                <CardTitle>Resultados de Cálculos ECMO</CardTitle>
                <CardDescription>
                  Flujos recomendados y parámetros calculados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {calculations.flow && (
                    <div className="p-4 border rounded-lg bg-medical-primary-light/30">
                      <div className="text-sm font-medium text-muted-foreground">
                        Flujo ECMO {patientData.ecmoType}
                      </div>
                      <div className="text-2xl font-bold text-medical-primary">
                        {calculations.flow.min} - {calculations.flow.max}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {calculations.flow.unit}
                      </div>
                    </div>
                  )}
                  
                  {calculations.hematocritDrop && (
                    <div className="p-4 border rounded-lg bg-warning/20">
                      <div className="text-sm font-medium text-muted-foreground">
                        Hematocrito Post-Dilución
                      </div>
                      <div className="text-2xl font-bold text-warning">
                        {calculations.hematocritDrop.toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Estimado con cebado 300mL
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

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
                    <h4 className="font-semibold mb-2">Protocolo de Cebado Neonatal</h4>
                    <ol className="space-y-2 text-sm">
                      <li>1. Preparar solución cristaloide (250-300 mL)</li>
                      <li>2. Agregar albúmina al 5% (25-50 mL)</li>
                      <li>3. Heparina: 50-100 UI/kg</li>
                      <li>4. Bicarbonato de sodio: 1-2 mEq/kg</li>
                      <li>5. Cloruro de calcio: 5-10 mg/kg</li>
                      <li>6. Verificar pH objetivo: 7.35-7.45</li>
                    </ol>
                  </div>
                </TabsContent>
                
                <TabsContent value="pediatric" className="space-y-4">
                  <div className="bg-medical-primary-light/20 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Protocolo de Cebado Pediátrico</h4>
                    <ol className="space-y-2 text-sm">
                      <li>1. Solución cristaloide: 500-800 mL (según peso)</li>
                      <li>2. Concentrado de glóbulos rojos si Hct {"<"} 25%</li>
                      <li>3. Heparina: 50-100 UI/kg</li>
                      <li>4. Manitol: 0.5-1 g/kg</li>
                      <li>5. Corticosteroides según protocolo</li>
                      <li>6. Verificar ACT {">"} 400 segundos</li>
                    </ol>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

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
              <div className="space-y-3">
                {checklist.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={`checklist-${item.id}`}
                      checked={item.checked}
                      onCheckedChange={(checked) => handleChecklistChange(item.id, !!checked)}
                    />
                    <Label
                      htmlFor={`checklist-${item.id}`}
                      className={`flex-1 ${item.mandatory ? 'font-medium' : ''}`}
                    >
                      {item.item}
                      {item.mandatory && <span className="text-destructive ml-1">*</span>}
                    </Label>
                  </div>
                ))}
              </div>
              
              {!mandatoryItemsChecked && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Ítems obligatorios pendientes
                    </span>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departureTime">Salida del Hospital</Label>
                  <Input
                    id="departureTime"
                    type="datetime-local"
                    value={transportData.departureTime}
                    onChange={(e) => setTransportData({ ...transportData, departureTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="airportArrivalTime">Llegada al Aeropuerto</Label>
                  <Input
                    id="airportArrivalTime"
                    type="datetime-local"
                    value={transportData.airportArrivalTime}
                    onChange={(e) => setTransportData({ ...transportData, airportArrivalTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originHospitalArrivalTime">Llegada Hospital Origen</Label>
                  <Input
                    id="originHospitalArrivalTime"
                    type="datetime-local"
                    value={transportData.originHospitalArrivalTime}
                    onChange={(e) => setTransportData({ ...transportData, originHospitalArrivalTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ecmoInitiationTime">Inicio ECMO</Label>
                  <Input
                    id="ecmoInitiationTime"
                    type="datetime-local"
                    value={transportData.ecmoInitiationTime}
                    onChange={(e) => setTransportData({ ...transportData, ecmoInitiationTime: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ECMOCalculations;