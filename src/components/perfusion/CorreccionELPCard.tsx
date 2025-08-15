import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function CorreccionELPCard() {
  return (
    <Card className="w-full max-w-3xl mx-auto rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>Corrección de ELP</CardTitle>
        <CardDescription>Fórmulas rápidas para potasio y bicarbonato, con conversión mEq ↔ mg</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <SeccionFormula
          titulo="Corrección de Potasio"
          factor={0.4}
          placeholder="K⁺"
        />
        <SeccionFormula
          titulo="Corrección de Bicarbonato"
          factor={0.3}
          placeholder="HCO₃⁻"
        />
        <SeccionEquivalencias />
      </CardContent>
    </Card>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-12 items-center gap-3">
      <Label className="col-span-5 md:col-span-4 text-sm text-muted-foreground">{label}</Label>
      <div className="col-span-7 md:col-span-8 flex gap-2">{children}</div>
    </div>
  );
}

function SeccionFormula({ titulo, factor, placeholder }: { titulo: string; factor: number; placeholder: string }) {
  const [actual, setActual] = useState("");
  const [deseado, setDeseado] = useState("");
  const [peso, setPeso] = useState("");

  const resultado = useMemo(() => {
    const a = parseFloat(actual);
    const d = parseFloat(deseado);
    const p = parseFloat(peso);
    if ([a, d, p].some((n) => Number.isNaN(n))) return "";
    return ((d - a) * p * factor).toFixed(2);
  }, [actual, deseado, peso, factor]);

  return (
    <div className="p-4 rounded-xl border bg-card space-y-3">
      <h3 className="font-semibold">{titulo}</h3>
      <Row label={`Valor actual (${placeholder}, mEq/L)`}>
        <Input value={actual} onChange={(e) => setActual(e.target.value)} inputMode="decimal" />
      </Row>
      <Row label={`Valor deseado (${placeholder}, mEq/L)`}>
        <Input value={deseado} onChange={(e) => setDeseado(e.target.value)} inputMode="decimal" />
      </Row>
      <Row label="Peso (kg)">
        <Input value={peso} onChange={(e) => setPeso(e.target.value)} inputMode="decimal" />
      </Row>
      <Row label="Resultado (mEq a administrar)">
        <Input readOnly value={resultado} placeholder="—" />
      </Row>
    </div>
  );
}

function SeccionEquivalencias() {
  const [tipo, setTipo] = useState<"KCl" | "NaHCO3">("KCl");
  const [valor, setValor] = useState("");

  const resultado = useMemo(() => {
    const v = parseFloat(valor);
    if (Number.isNaN(v)) return "";
    if (tipo === "KCl") return (v * 74.55).toFixed(2);
    if (tipo === "NaHCO3") return (v * 84.01).toFixed(2);
    return "";
  }, [valor, tipo]);

  return (
    <div className="p-4 rounded-xl border bg-card space-y-3">
      <h3 className="font-semibold">Equivalencia mEq ↔ mg</h3>
      <Row label="Tipo de sustancia">
        <Select value={tipo} onValueChange={(v) => setTipo(v as any)}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="KCl">KCl (PM 74.55, z=1)</SelectItem>
            <SelectItem value="NaHCO3">NaHCO₃ (PM 84.01, z=1)</SelectItem>
          </SelectContent>
        </Select>
      </Row>
      <Row label="mEq">
        <Input value={valor} onChange={(e) => setValor(e.target.value)} inputMode="decimal" />
        <Button type="button" variant="secondary" onClick={() => setValor("")}>Limpiar</Button>
      </Row>
      <Row label="Resultado (mg)">
        <Input readOnly value={resultado} placeholder="—" />
      </Row>
    </div>
  );
}
