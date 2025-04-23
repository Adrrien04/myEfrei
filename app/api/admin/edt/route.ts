import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: { rejectUnauthorized: false },
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filiere = searchParams.get("filiere");
  const niveau = searchParams.get("niveau");

if (!filiere || !niveau) {
    return NextResponse.json({ error: "Filière et niveau requis" }, { status: 400 });
}

try {
    const rows = await sql`
    SELECT t.jour, t.horaire AS heure, cours.nom AS cours, profs.nom || ' ' || profs.prenom AS prof
    FROM eleves
    JOIN LATERAL jsonb_to_recordset(emploi_du_temps) AS t(jour text, horaire text, cours_id text) ON true
    JOIN cours ON cours.id = t.cours_id
    JOIN profs ON cours.id_prof = profs.id
    WHERE filiere = ${filiere} AND niveau = ${niveau} AND emploi_du_temps IS NOT NULL
    `;

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Erreur GET /api/admin/edt :", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'emploi du temps" },
      { status: 500 },
    );
  }
}