import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const numeroEtudiant = searchParams.get("numeroetudiant");

  if (!numeroEtudiant) {
    return NextResponse.json(
      { error: "Numéro étudiant manquant" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("eleves")
    .select("emploi_du_temps")
    .eq("numeroetudiant", numeroEtudiant)
    .single();

  if (error || !data?.emploi_du_temps) {
    return NextResponse.json(
      { error: "Emploi du temps non trouvé" },
      { status: 404 },
    );
  }

  return NextResponse.json({ emploi_du_temps: data.emploi_du_temps });
}
