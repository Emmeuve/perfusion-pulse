import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SupabasePing() {
  const [msg, setMsg] = useState("Probando conexión a Supabase…");

  useEffect(() => {
    (async () => {
      const { error } = await supabase.auth.getSession();
      setMsg(error ? `❌ ${error.message}` : "✅ Supabase OK");
    })();
  }, []);

  return <div className="text-xs text-muted-foreground">{msg}</div>;
}
