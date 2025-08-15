import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calculator, FileText } from "lucide-react";

const AdultCPBCalculations = () => {
  const [patientData, setPatientData] = useState({
    weight: "",
    height: "",
    currentHct: "",
    desiredHct: "",
    primingVolume: "",
    name: "",
    surname: "",
    gender: "",
    age: "",
    diagnosis: "",
    medicalHistory: "",
    allergies: "",
    plannedSurgery: "",
    surgeonName: "",
    perfusionistNotes: ""
  });

  const [bloodVolumeMethod, setBloodVolumeMethod] = useState("nadler");
  const [cardiacIndex, setCardiacIndex] = useState("2.2");

  const calculateBSA = (weight: number, height: number) => {
    // DuBois formula: BSA = 0.007184 × weight^0.425 × height^0.725
    return 0.007184 * Math.pow(weight, 0.425) * Math.pow(height, 0.725);
  };

  const calculateBloodVolume = (weight: number, height: number, gender: string, method: string) => {
    if (method === "nadler") {
      // Nadler formula
      if (gender === "male") {
        return (0.3669 * Math.pow(height / 100, 3)) + (0.03219 * weight) + 0.6041;
      } else {
        return (0.3561 * Math.pow(height / 100, 3)) + (0.03308 * weight) + 0.1833;
      }
    } else if (method === "simplified") {
      // Simplified formula: 70 mL/kg for adults
      return weight * 0.07;
    }
    return 0;
  };

  const calculateDilutionalHct = (currentHct: number, bloodVolume: number, primingVolume: number) => {
    const totalVolume = bloodVolume + (primingVolume / 1000);
    return (currentHct * bloodVolume) / totalVolume;
  };

  const getCalculations = () => {
    const weight = parseFloat(patientData.weight);
    const height = parseFloat(patientData.height);
    const currentHct = parseFloat(patientData.currentHct);
    const primingVol = parseFloat(patientData.primingVolume);
    const ci = parseFloat(cardiacIndex);

    if (!weight || !height || !currentHct || !primingVol) {
      return null;
    }

    const bsa = calculateBSA(weight, height);
    const bloodVolume = calculateBloodVolume(weight, height, patientData.gender, bloodVolumeMethod);
    const pumpFlow = ci * bsa;
    const dilutionalHct = calculateDilutionalHct(currentHct, bloodVolume, primingVol);
    const cerebralFlow = pumpFlow * 0.1;
    const cardiacFlow = pumpFlow;

    return {
      bsa: bsa.toFixed(2),
      bloodVolume: bloodVolume.toFixed(2),
      pumpFlow: pumpFlow.toFixed(2),
      dilutionalHct: dilutionalHct.toFixed(1),
      cerebralFlow: cerebralFlow.toFixed(2),
      cardiacFlow: cardiacFlow.toFixed(2)
    };
  };

  const calculations = getCalculations();

  const generatePDFReport = () => {
    // This would integrate with a PDF generation library
    alert("Función de generación de PDF en desarrollo");
  };

  return (
    <div className="space-y-6">
      {/* Patient Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Datos del Paciente
          </CardTitle>
          <CardDescription>
            Información básica del paciente para cálculos de CEC
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={patientData.name}
                onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                placeholder="Nombre del paciente"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="surname">Apellido</Label>
              <Input
                id="surname"
                value={patientData.surname}
                onChange={(e) => setPatientData({ ...patientData, surname: e.target.value })}
                placeholder="Apellido del paciente"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Género</Label>
              <Select value={patientData.gender} onValueChange={(value) => setPatientData({ ...patientData, gender: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Masculino</SelectItem>
                  <SelectItem value="female">Femenino</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Edad</Label>
              <Input
                id="age"
                value={patientData.age}
                onChange={(e) => setPatientData({ ...patientData, age: e.target.value })}
                placeholder="Edad en años"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnóstico</Label>
              <Input
                id="diagnosis"
                value={patientData.diagnosis}
                onChange={(e) => setPatientData({ ...patientData, diagnosis: e.target.value })}
                placeholder="Diagnóstico principal"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clinical Parameters */}
      <Card>
        <CardHeader>
          <CardTitle>Parámetros Clínicos</CardTitle>
          <CardDescription>
            Datos requeridos para cálculos de CEC
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
              <Label htmlFor="height">Altura (cm) *</Label>
              <Input
                id="height"
                type="number"
                value={patientData.height}
                onChange={(e) => setPatientData({ ...patientData, height: e.target.value })}
                placeholder="170"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primingVolume">Volumen Cebado (mL) *</Label>
              <Input
                id="primingVolume"
                type="number"
                value={patientData.primingVolume}
                onChange={(e) => setPatientData({ ...patientData, primingVolume: e.target.value })}
                placeholder="1200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentHct">Hematocrito Actual (%) *</Label>
              <Input
                id="currentHct"
                type="number"
                value={patientData.currentHct}
                onChange={(e) => setPatientData({ ...patientData, currentHct: e.target.value })}
                placeholder="40"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desiredHct">Hematocrito Deseado (%)</Label>
              <Input
                id="desiredHct"
                type="number"
                value={patientData.desiredHct}
                onChange={(e) => setPatientData({ ...patientData, desiredHct: e.target.value })}
                placeholder="25"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bloodVolumeMethod">Método de Volumen Sanguíneo</Label>
              <Select value={bloodVolumeMethod} onValueChange={setBloodVolumeMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nadler">Fórmula de Nadler</SelectItem>
                  <SelectItem value="simplified">Fórmula Simplificada (70 mL/kg)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardiacIndex">Índice Cardíaco (L/min/m²)</Label>
              <Select value={cardiacIndex} onValueChange={setCardiacIndex}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2.0">Bajo flujo (2.0)</SelectItem>
                  <SelectItem value="2.2">Estándar (2.2)</SelectItem>
                  <SelectItem value="2.4">Alto flujo (2.4)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {calculations && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados de Cálculos</CardTitle>
            <CardDescription>
              Cálculos automáticos basados en los parámetros ingresados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg bg-medical-primary-light/30">
                <div className="text-sm font-medium text-muted-foreground">Superficie Corporal</div>
                <div className="text-2xl font-bold text-medical-primary">{calculations.bsa} m²</div>
                <div className="text-xs text-muted-foreground">Fórmula DuBois</div>
              </div>
              <div className="p-4 border rounded-lg bg-medical-primary-light/30">
                <div className="text-sm font-medium text-muted-foreground">Volumen Sanguíneo</div>
                <div className="text-2xl font-bold text-medical-primary">{calculations.bloodVolume} L</div>
                <div className="text-xs text-muted-foreground">{bloodVolumeMethod === "nadler" ? "Nadler" : "70 mL/kg"}</div>
              </div>
              <div className="p-4 border rounded-lg bg-medical-primary-light/30">
                <div className="text-sm font-medium text-muted-foreground">Flujo de Bomba</div>
                <div className="text-2xl font-bold text-medical-primary">{calculations.pumpFlow} L/min</div>
                <div className="text-xs text-muted-foreground">IC × BSA</div>
              </div>
              <div className="p-4 border rounded-lg bg-warning/20">
                <div className="text-sm font-medium text-muted-foreground">Hct Dilucional</div>
                <div className="text-2xl font-bold text-warning">{calculations.dilutionalHct}%</div>
                <div className="text-xs text-muted-foreground">Post-cebado</div>
              </div>
              <div className="p-4 border rounded-lg bg-medical-primary-light/30">
                <div className="text-sm font-medium text-muted-foreground">Flujo Cerebral</div>
                <div className="text-2xl font-bold text-medical-primary">{calculations.cerebralFlow} L/min</div>
                <div className="text-xs text-muted-foreground">10% del flujo total</div>
              </div>
              <div className="p-4 border rounded-lg bg-medical-primary-light/30">
                <div className="text-sm font-medium text-muted-foreground">Flujo Cardíaco</div>
                <div className="text-2xl font-bold text-medical-primary">{calculations.cardiacFlow} L/min</div>
                <div className="text-xs text-muted-foreground">Flujo total calculado</div>
              </div>
            </div>
            
            <div className="mt-6">
              <Button onClick={generatePDFReport} className="w-full md:w-auto">
                <FileText className="h-4 w-4 mr-2" />
                Generar Reporte PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdultCPBCalculations;