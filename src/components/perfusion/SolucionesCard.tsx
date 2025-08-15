import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Datos de soluciones (valores típicos por 1 L)
const soluciones = [
  {
    nombre: "SF 0,9% (NaCl 0,9%)",
    na: 154,
    k: 0,
    ca: 0,
    mg: 0,
    cl: 154,
    organicos: "—",
    osm: "≈308 mOsm/L",
    ph: "≈5.6 (4.5–7.0)",
  },
  {
    nombre: "Ringer Lactato (RL)",
    na: 130,
    k: 4,
    ca: 2.7,
    mg: 0,
    cl: 109,
    organicos: "Lactato 28 mEq/L",
    osm: "≈273 mOsm/L",
    ph: "≈6.5 (6.0–7.5)",
  },
  {
    nombre: "Ringer USP (sin lactato)",
    na: 147,
    k: 4,
    ca: 4.0, // algunas etiquetas reportan 4–4.5 mEq/L
    mg: 0,
    cl: 156,
    organicos: "—",
    osm: "≈309–310 mOsm/L",
    ph: "≈5.4–5.8 (5.0–7.5)",
  },
  {
    nombre: "Plasma‑Lyte A",
    na: 140,
    k: 5,
    ca: 0,
    mg: 3,
    cl: 98,
    organicos: "Acetato 27 / Gluconato 23 mEq/L",
    osm: "≈294 mOsm/L",
    ph: "≈7.4 (6.5–8.0)",
  },
];

export default function SolucionesCard() {
  return (
    <Card className="w-full max-w-6xl mx-auto rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>Soluciones</CardTitle>
        <CardDescription>Composición típica y comparaciones rápidas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Tabla de soluciones */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Solución</TableHead>
                <TableHead className="text-right">Na⁺</TableHead>
                <TableHead className="text-right">K⁺</TableHead>
                <TableHead className="text-right">Ca²⁺</TableHead>
                <TableHead className="text-right">Mg²⁺</TableHead>
                <TableHead className="text-right">Cl⁻</TableHead>
                <TableHead>Aniones orgánicos</TableHead>
                <TableHead>Osm</TableHead>
                <TableHead>pH</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {soluciones.map((s) => (
                <TableRow key={s.nombre}>
                  <TableCell className="font-medium">{s.nombre}</TableCell>
                  <TableCell className="text-right">{s.na}</TableCell>
                  <TableCell className="text-right">{s.k}</TableCell>
                  <TableCell className="text-right">{s.ca}</TableCell>
                  <TableCell className="text-right">{s.mg}</TableCell>
                  <TableCell className="text-right">{s.cl}</TableCell>
                  <TableCell>{s.organicos}</TableCell>
                  <TableCell>{s.osm}</TableCell>
                  <TableCell>{s.ph}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="mt-2 text-xs text-muted-foreground">
            Unidades en mEq/L salvo que se indique lo contrario. Valores aproximados según ficha técnica del fabricante.
          </p>
        </div>

        {/* Cardioplegias */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold">Cardioplegias — recetas de referencia</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border bg-card">
              <h4 className="font-medium mb-1">del Nido (base Plasma‑Lyte A)</h4>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>Base: <span className="font-medium">Plasma‑Lyte A</span> (Na 140, K 5, Mg 3, Cl 98, acetato 27, gluconato 23; pH ≈7.4).</li>
                <li>Aditivos (típicos por 1 L de base): Bicarbonato 8.4% ~13–20 mL; Manitol 20% ~16.3 mL; MgSO₄ 50% ~4 mL; Lidocaína 1–2% ~13 mL; KCl (2 mEq/mL) ~13 mL.</li>
                <li>Usos: adulto/ped, con protocolos que ajustan dosis, temperatura y redosis.</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2">Ajustar a protocolo local (concentraciones y volúmenes pueden variar).</p>
            </div>

            <div className="p-4 rounded-xl border bg-card">
              <h4 className="font-medium mb-1">St. Thomas’ (modificada) / Plegisol (cristaloide)</h4>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>Composición típica (mmol/L): K⁺ ~16–26; Na⁺ ~110–120; Cl⁻ ~159–160; Mg²⁺ ~16–32; HCO₃⁻ ~10; Ca²⁺ ~2.4; (a veces Manitol ~30).</li>
                <li>pH ~7.8–8.0; Osm ~320–324 mOsm/L.</li>
                <li>Puede usarse sola o mezclada con sangre según protocolo.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border bg-card">
              <h4 className="font-medium mb-1">Buckberg (sanguínea, ejemplo común)</h4>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>Mezcla típica: <span className="font-medium">sangre:cristaloide = 4:1</span> (cristaloide basado en RL).</li>
                <li>Aditivos frecuentes al 1 L de RL: KCl ~80 mEq; NaHCO₃ ~30 mEq (ajustar a protocolo).</li>
                <li>Dosis de inducción y redosis según tiempo/temperatura y cirugía.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border bg-card">
              <h4 className="font-medium mb-1">Variantes del del Nido con RL</h4>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>Base: <span className="font-medium">RL 800 mL</span> + aditivos (ejemplo): Manitol 20% 16.3 mL; MgSO₄ 50% 4 mL; NaHCO₃ 8.4% 13 mL; KCl 2 mEq/mL 13 mL; Lidocaína 1% 13 mL.</li>
                <li>Hipotónica (~276 mOsm/L). Ajustar según preferencia del equipo.</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            *Ejemplos educativos. Sigue siempre las órdenes de farmacia, etiquetas del fabricante y el protocolo de tu centro.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
