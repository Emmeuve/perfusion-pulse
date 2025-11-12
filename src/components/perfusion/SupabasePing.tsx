import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SupabasePing() {
  const [msg, setMsg] = useState("Probando conexión a Supabase…");
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      // 1) ping auth (solo para confirmar credenciales/red)
      const { error } = await supabase.auth.getSession();
      if (error) { setMsg(`❌ ${error.message}`); return; }

      // 2) TU QUERY de prueba a 'patients'
      const { data: pats, error: e2 } = await supabase
        .from("patients")
        .select("*")
        .limit(5);

      if (e2) {
        setMsg(`✅ Supabase OK • ⚠️ patients: ${e2.message}`);
        return;
      }

      setCount(pats?.length ?? 0);
      setMsg(`✅ Supabase OK • patients: ${pats?.length ?? 0}`);
      console.log("patients sample:", pats); // <-- mira la consola del navegador
    })();
  }, []);

  return (
    <div className="text-xs text-muted-foreground">
      {msg}{count !== null ? ` (muestra en consola)` : ""}
    </div>
  );
}
