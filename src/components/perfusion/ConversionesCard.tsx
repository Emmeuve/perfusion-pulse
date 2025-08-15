import React, { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * ConversionesCard
 *
 * Incluye:
 * - mg ↔ µg
 * - cm ↔ pulgadas
 * - pulgadas ↔ French (Fr) (recordar: 1 Fr = 1/3 mm; 1 in = 25.4 mm)
 * - mEq ↔ mg (requiere Peso Molecular (PM) y valencia (z)): mg = mEq * (PM / z)
 */
export default function ConversionesCard() {
  return (
    <Card className="w-full max-w-5xl mx-auto shadow-xl border rounded-2xl">
      <CardHeader>
        <CardTitle>Conversiones</CardTitle>
        <CardDescription>Equivalencias rápidas usadas en perfusión y clínica.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <SeccionMgUg />
        <SeccionCmIn />
        <SeccionInFr />
        <SeccionMEqMg />
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

/**********************  mg ↔ µg  *************************/
function SeccionMgUg() {
  const [dir, setDir] = useState<"mgToUg" | "ugToMg">("mgToUg");
  const [valor, setValor] = useState<string>("");

  const resultado = useMemo(() => {
    const v = parseFloat(valor);
    if (Number.isNaN(v)) return "";
    return dir === "mgToUg" ? (v * 1000).toString() : (v / 1000).toString();
  }, [dir, valor]);

  return (
    <div className="p-4 rounded-xl border bg-card">
      <h3 className="font-semibold mb-1">mg ↔ µg</h3>
      <p className="text-xs text-muted-foreground mb-4">1 mg = 1000 µg</p>
      <div className="space-y-3">
        <Row label="Dirección">
          <Select value={dir} onValueChange={(v) => setDir(v as any)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mgToUg">mg → µg</SelectItem>
              <SelectItem value="ugToMg">µg → mg</SelectItem>
            </SelectContent>
          </Select>
        </Row>
        <Row label={dir === "mgToUg" ? "Valor en mg" : "Valor en µg"}>
          <Input inputMode="decimal" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="0" />
          <Button type="button" variant="secondary" onClick={() => setValor("")}>Limpiar</Button>
        </Row>
        <Row label="Resultado">
          <Input readOnly value={resultado} placeholder="—" />
          <Unidad tag={dir === "mgToUg" ? "µg" : "mg"} />
        </Row>
      </div>
    </div>
  );
}

/**********************  cm ↔ in  *************************/
function SeccionCmIn() {
  const [dir, setDir] = useState<"cmToIn" | "inToCm">("cmToIn");
  const [valor, setValor] = useState<string>("");

  const resultado = useMemo(() => {
    const v = parseFloat(valor);
    if (Number.isNaN(v)) return "";
    return dir === "cmToIn" ? (v / 2.54).toFixed(4) : (v * 2.54).toFixed(2);
  }, [dir, valor]);

  return (
    <div className="p-4 rounded-xl border bg-card">
      <h3 className="font-semibold mb-1">cm ↔ pulgadas</h3>
      <p className="text-xs text-muted-foreground mb-4">1 in = 2.54 cm</p>
      <div className="space-y-3">
        <Row label="Dirección">
          <Select value={dir} onValueChange={(v) => setDir(v as any)}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="cmToIn">cm → in</SelectItem>
              <SelectItem value="inToCm">in → cm</SelectItem>
            </SelectContent>
          </Select>
        </Row>
        <Row label={dir === "cmToIn" ? "Valor en cm" : "Valor en in"}>
          <Input inputMode="decimal" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="0" />
          <Button type="button" variant="secondary" onClick={() => setValor("")}>Limpiar</Button>
        </Row>
        <Row label="Resultado">
          <Input readOnly value={resultado} placeholder="—" />
          <Unidad tag={dir === "cmToIn" ? "in" : "cm"} />
        </Row>
      </div>
    </div>
  );
}

/**********************  in ↔ Fr  *************************/
function SeccionInFr() {
  const [dir, setDir] = useState<"inToFr" | "frToIn">("inToFr");
  const [valor, setValor] = useState<string>("");

  const resultado = useMemo(() => {
    const v = parseFloat(valor);
    if (Number.isNaN(v)) return "";
    if (dir === "inToFr") {
      // in -> mm -> Fr (1 in = 25.4 mm; 1 Fr = 1/3 mm => Fr = mm * 3)
      const mm = v * 25.4;
      const fr = mm * 3;
      return fr.toFixed(2);
    } else {
      // Fr -> mm -> in
      const mm = v / 3;
      const inches = mm / 25.4;
      return inches.toFixed(4);
    }
  }, [dir, valor]);

  return (
    <div className="p-4 rounded-xl border bg-card">
      <h3 className="font-semibold mb-1">pulgadas ↔ French (Fr)</h3>
      <p className="text-xs text-muted-foreground mb-4">1 Fr = 1/3 mm • 1 in = 25.4 mm</p>
      <div className="space-y-3">
        <Row label="Dirección">
          <Select value={dir} onValueChange={(v) => setDir(v as any)}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="inToFr">in → Fr</SelectItem>
              <SelectItem value="frToIn">Fr → in</SelectItem>
            </SelectContent>
          </Select>
        </Row>
        <Row label={dir === "inToFr" ? "Valor en pulgadas (in)" : "Valor en French (Fr)"}>
          <Input inputMode="decimal" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="0" />
          <Button type="button" variant="secondary" onClick={() => setValor("")}>Limpiar</Button>
        </Row>
        <Row label="Resultado">
          <Input readOnly value={resultado} placeholder="—" />
          <Unidad tag={dir === "inToFr" ? "Fr" : "in"} />
        </Row>
      </div>
    </div>
  );
}

/**********************  mEq ↔ mg  *************************/
function SeccionMEqMg() {
  const [dir, setDir] = useState<"meqToMg" | "mgToMeq">("meqToMg");
  const [valor, setValor] = useState<string>("");
  const [pm, setPm] = useState<string>(""); // Peso Molecular (g/mol)
  const [z, setZ] = useState<string>("1"); // Valencia

  const resultado = useMemo(() => {
    const v = parseFloat(valor);
    const pmNum = parseFloat(pm);
    const zNum = parseFloat(z);
    if ([v, pmNum, zNum].some((n) => Number.isNaN(n) || n <= 0)) return "";

    // Fórmulas:
    // mg = mEq * (PM / z)
    // mEq = mg * (z / PM)
    if (dir === "meqToMg") {
      const mg = v * (pmNum / zNum);
      return mg.toFixed(2);
    } else {
      const meq = v * (zNum / pmNum);
      return meq.toFixed(3);
    }
  }, [dir, valor, pm, z]);

  return (
    <div className="p-4 rounded-xl border bg-card">
      <h3 className="font-semibold mb-1">mEq ↔ mg</h3>
      <p className="text-xs text-muted-foreground mb-4">Requiere Peso Molecular (PM) y valencia (z).</p>
      <div className="space-y-3">
        <Row label="Dirección">
          <Select value={dir} onValueChange={(v) => setDir(v as any)}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="meqToMg">mEq → mg</SelectItem>
              <SelectItem value="mgToMeq">mg → mEq</SelectItem>
            </SelectContent>
          </Select>
        </Row>
        <Row label="Valor">
          <Input inputMode="decimal" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="0" />
          <Unidad tag={dir === "meqToMg" ? "mEq" : "mg"} />
        </Row>
        <Row label="Peso Molecular (PM)">
          <Input inputMode="decimal" value={pm} onChange={(e) => setPm(e.target.value)} placeholder="Ej: NaCl 58.44" />
          <Unidad tag="g/mol" />
        </Row>
        <Row label="Valencia (z)">
          <Input inputMode="decimal" value={z} onChange={(e) => setZ(e.target.value)} placeholder="Ej: 1" />
          <Unidad tag="z" />
        </Row>
        <Row label="Resultado">
          <Input readOnly value={resultado} placeholder="—" />
          <Unidad tag={dir === "meqToMg" ? "mg" : "mEq"} />
        </Row>
      </div>
      <TipsMEq />
    </div>
  );
}

function Unidad({ tag }: { tag: string }) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-lg border text-xs text-muted-foreground bg-background min-w-[48px] justify-center">
      {tag}
    </span>
  );
}

function TipsMEq() {
  return (
    <div className="mt-4 text-xs text-muted-foreground space-y-1">
      <p className="font-medium text-foreground">Notas rápidas:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Para NaCl: PM ≈ 58.44 g/mol; para KCl: PM ≈ 74.55 g/mol.</li>
        <li>Valencia típica: Na⁺, K⁺, Cl⁻ → z = 1; Ca²⁺, Mg²⁺ → z = 2.</li>
        <li>Ej.: 10 mEq de KCl → mg = 10 × (74.55 / 1) ≈ 745.5 mg.</li>
      </ul>
    </div>
  );
}
