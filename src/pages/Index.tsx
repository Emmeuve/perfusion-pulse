import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Heart, Activity, Database, Baby, Stethoscope, BarChart3, FlaskConical, Droplet } from "lucide-react";
import { useState } from "react";
import AdultCPBCalculations from "@/components/perfusion/AdultCPBCalculations";
import PediatricCPBCalculations from "@/components/perfusion/PediatricCPBCalculations";
import ECMOCalculations from "@/components/perfusion/ECMOCalculations";
import PatientManager from "@/components/patient/PatientManager";
import { PatientWithCalculations } from "@/types/Patient";
import ConversionesCard from "@/components/perfusion/ConversionesCard";
import SolucionesCard from "@/components/perfusion/SolucionesCard";
import CorreccionELPCard from "@/components/perfusion/CorreccionELPCard";
import SupabasePing from "../components/perfusion/SupabasePing";

const Index = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [showPatientManager, setShowPatientManager] = useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientWithCalculations | undefined>(undefined);

  const perfusionCards = [
    {
      id: 1,
      title: "CEC Adulto",
      description: "Cálculos de circulación extracorpórea para pacientes adultos",
      icon: Calculator,
      color: "medical-primary",
      component: AdultCPBCalculations,
      requiresPatient: true
    },
    {
      id: 2,
      title: "CEC Pediátrica",
      description: "Cálculos específicos para circulación extracorpórea pediátrica",
      icon: Baby,
      color: "medical-primary",
      component: PediatricCPBCalculations,
      requiresPatient: true
    },
    {
      id: 3,
      title: "ECMO",
      description: "Cálculos de flujo ECMO, protocolos de cebado y transporte móvil",
      icon: Stethoscope,
      color: "medical-primary",
      component: ECMOCalculations
    },
    {
      id: 4,
      title: "Corrección de ELP",
      description: "Fórmulas para potasio y bicarbonato con conversión mEq ↔ mg.",
      icon: FlaskConical,
      color: "medical-primary",
      component: CorreccionELPCard,
      requiresPatient: false
    },
    {
      id: 5,
      title: "Valores normales",
      description: "Rangos de referencia específicos por edad",
      icon: BarChart3,
      color: "medical-primary",
      component: null
    },
    {
      id: 6,
      title: "Dosis de medicamentos",
      description: "Dosificación de medicamentos relevantes en perfusión",
      icon: Droplet,
      color: "medical-primary",
      component: null
    },
    {
    id: 7,
    title: "Conversiones",
    description: "Equivalencias mg↔µg, cm↔in, in↔Fr, mEq↔mg.",
    icon: Calculator,
    component: ConversionesCard,   // 👈 esto habilita el botón y permite montarlo al hacer click
    requiresPatient: false
    },
    {
      id: 8,
      title: "Valores hemodinámicos",
      description: "Parámetros hemodinámicos y cardiovasculares de referencia",
      icon: Heart,
      color: "medical-primary",
      component: null
    },
    {
      id: 9,
      title: "Soluciones",
      description: "Composición: SF 0,9%, RL, Ringer USP, Plasma‑Lyte A y recetas de cardioplegia.",
      icon: Database,
      component: SolucionesCard,
      requiresPatient: false
    },
  ];

  const handleCardClick = (cardId: number) => {
    const card = perfusionCards.find(c => c.id === cardId);
    if (card?.component) {
      if (card.requiresPatient) {
        setShowPatientManager(true);
      } else {
        setActiveCard(cardId);
      }
    }
  };

  const handleNavigateToCalculation = (type: 'cec-adulto' | 'cec-pediatrico', patient?: PatientWithCalculations) => {
    setSelectedPatient(patient);
    const cardId = type === 'cec-adulto' ? 1 : 2;
    setActiveCard(cardId);
    setShowPatientManager(false);
  };

  const handleBack = () => {
    setActiveCard(null);
    setShowPatientManager(false);
    setSelectedPatient(undefined);
  };

  if (activeCard) {
    const card = perfusionCards.find(c => c.id === activeCard);
    if (card?.component) {
      const Component = card.component;
      return (
        <div className="min-h-screen bg-background p-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="mb-4"
              >
                ← Volver al menú principal
              </Button>
              <h1 className="text-3xl font-bold text-foreground mb-2">{card.title}</h1>
              <p className="text-muted-foreground">{card.description}</p>
            </div>
            <Component selectedPatient={selectedPatient} />
          </div>
        </div>
      );
    }
  }
  // Show patient manager
  if (showPatientManager) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="mb-4"
            >
              ← Volver al menú principal
            </Button>
          </div>
          <PatientManager onNavigateToCalculation={handleNavigateToCalculation} />
        </div>
      </div>
    );
  }

  // Show calculation component
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Sistema de Cálculos de Perfusión
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Aplicación profesional para cálculos de circulación extracorpórea, 
            ECMO y perfusión cardiovascular. Diseñada para profesionales médicos en Chile.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {perfusionCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <Card 
                key={card.id}
                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-card-border bg-card"
                onClick={() => handleCardClick(card.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-medical-primary-light rounded-lg">
                      <IconComponent className="h-6 w-6 text-medical-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-card-foreground">
                        {card.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                    {card.description}
                  </CardDescription>
                  <div className="mt-4">
                    <Button 
                      variant={card.component ? "default" : "secondary"}
                      size="sm"
                      className="w-full"
                      disabled={!card.component}
                    >
                      {card.component ? (card.requiresPatient ? "Gestionar pacientes" : "Abrir módulo") : "Próximamente"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Aplicación médica para profesionales de perfusión • Chile 2025
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Todos los cálculos deben ser verificados independientemente. Esta aplicación es una herramienta de apoyo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;