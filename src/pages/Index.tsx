import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Heart, Activity, Database, Baby, Stethoscope, BarChart3, FlaskConical, Droplet } from "lucide-react";
import { useState } from "react";
import AdultCPBCalculations from "@/components/perfusion/AdultCPBCalculations";
import ECMOCalculations from "@/components/perfusion/ECMOCalculations";

const Index = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const perfusionCards = [
    {
      id: 1,
      title: "Adult CPB Calculations",
      description: "Comprehensive cardiopulmonary bypass calculations for adult patients",
      icon: Calculator,
      color: "medical-primary",
      component: AdultCPBCalculations
    },
    {
      id: 2,
      title: "Adult Cannulation Guide",
      description: "Cannula selection and sizing recommendations for adult CPB",
      icon: Heart,
      color: "medical-primary",
      component: null
    },
    {
      id: 3,
      title: "Gas Exchange & Oxygen Delivery",
      description: "DO2, VO2, and oxygen content calculations",
      icon: Activity,
      color: "medical-primary",
      component: null
    },
    {
      id: 4,
      title: "Adult Oxygenator Database",
      description: "Comprehensive oxygenator specifications for Chilean market",
      icon: Database,
      color: "medical-primary",
      component: null
    },
    {
      id: 5,
      title: "Pediatric CPB Calculations",
      description: "Age-specific calculations for pediatric cardiopulmonary bypass",
      icon: Baby,
      color: "medical-primary",
      component: null
    },
    {
      id: 6,
      title: "ECMO Calculations & Management",
      description: "ECMO flow calculations, priming protocols, and mobile transport",
      icon: Stethoscope,
      color: "medical-primary",
      component: ECMOCalculations
    },
    {
      id: 7,
      title: "Z-Values & Reference Tables",
      description: "Z-valve references, volumes, and cannula flow tables",
      icon: BarChart3,
      color: "medical-primary",
      component: null
    },
    {
      id: 8,
      title: "Laboratory Corrections",
      description: "ELP corrections, normal values, and unit conversions",
      icon: FlaskConical,
      color: "medical-primary",
      component: null
    },
    {
      id: 9,
      title: "Solutions & Cardioplegia",
      description: "Solution compositions and cardioplegia formulations",
      icon: Droplet,
      color: "medical-primary",
      component: null
    }
  ];

  const handleCardClick = (cardId: number) => {
    const card = perfusionCards.find(c => c.id === cardId);
    if (card?.component) {
      setActiveCard(cardId);
    }
  };

  const handleBack = () => {
    setActiveCard(null);
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
            <Component />
          </div>
        </div>
      );
    }
  }

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
                      {card.component ? "Abrir módulo" : "Próximamente"}
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